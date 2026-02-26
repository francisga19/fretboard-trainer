// audio-engine.js
const notesSharp = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const STRING_PROFILES = {
  all:   { min: 70,  max: 1000, foldAbove: 1400, confidence: 2 },
  lowE:  { min: 75,  max: 165, foldAbove: 200, confidence: 4 },
  A:     { min: 100, max: 220, foldAbove: 300, confidence: 4 },
  D:     { min: 140, max: 330, foldAbove: 420, confidence: 3 },
  G:     { min: 190, max: 500, foldAbove: 650, confidence: 3 },
  B:     { min: 240, max: 650, foldAbove: 900, confidence: 2 },
  highE: { min: 300, max: 1000, foldAbove: 1400, confidence: 2 }
};

 


/// --------   switching profiles -------  ///
let activeProfile = STRING_PROFILES.lowE;

function setStringProfile(name) {
  const profile = STRING_PROFILES[name];
  if (!profile) return;

  activeProfile = profile;
  expectedMinFreq = profile.min;
  expectedMaxFreq = profile.max;
}


//// per string harmonic bias ///
let activeStringIndex = null;

function setActiveString(index) {
  activeStringIndex = index;
}


function freqToMidi(freq) {
  return Math.round(69 + 12 * Math.log2(freq / 440));
}

function midiToNote(midi) {
  return notesSharp[midi % 12] + (Math.floor(midi / 12) - 1);
}

function normalizeFrequency(freq) {
  if (activeStringIndex === null) return freq;

  // How aggressively we fold harmonics per string
  const harmonicBias = [
    1.0, // High E (almost no folding)
    1.1, // B
    1.2, // G
    1.4, // D
    1.7, // A
    2.2  // Low E (very aggressive)
  ];

  const bias = harmonicBias[activeStringIndex] ?? 1.2;

  const foldLimit = activeProfile?.foldAbove ?? expectedMaxFreq * bias;

  if (freq > foldLimit) {
  freq /= 2;
  }


  return freq;
}


let expectedMinFreq = 70;
let expectedMaxFreq = 500;
let lastFrequency = null;

const ATTACK_MIN_RMS = 0.008;
const ATTACK_DELTA_RMS = 0.0018;
const ATTACK_NOISE_MULTIPLIER = 1.7;
const ATTACK_MAX_THRESHOLD_RMS = 0.016;
const REARM_SILENCE_RMS = 0.006;
const REARM_SILENCE_FRAMES = 8;
const NOISE_FLOOR_ALPHA = 0.02;

function computeRms(buf) {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    sum += buf[i] * buf[i];
  }
  return Math.sqrt(sum / buf.length);
}


function autoCorrelate(buf, sampleRate, precomputedRms = null) {
  const rms = precomputedRms ?? computeRms(buf);
  if (rms < 0.005) return -1;

  let bestOffset = -1;
  let bestCorrelation = 0;

  const minOffset = Math.floor(sampleRate / expectedMaxFreq);
  const maxOffset = Math.floor(sampleRate / expectedMinFreq);

  for (let offset = minOffset; offset <= maxOffset; offset++) {
  let correlation = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < buf.length - offset; i++) {
    const a = buf[i];
    const b = buf[i + offset];

    correlation += a * b;
    norm1 += a * a;
    norm2 += b * b;
  }

  correlation /= Math.sqrt((norm1 * norm2) || 1);

  if (correlation > bestCorrelation) {
    bestCorrelation = correlation;
    bestOffset = offset;
  }
}


  return bestOffset > 0 ? sampleRate / bestOffset : -1;
}


export const AudioEngine = (() => {
  let audioContext = null;
  let analyser = null;
  let sourceNode = null;
  let mediaStream = null;
  let rafId = null;
  let listeners = [];
  let levelListeners = [];
  let selectedDeviceId = null;
  let running = false;

  let lastNote = null;
  let stableCount = 0;
  let awaitingAttack = true;
  let noiseFloor = 0.003;
  let previousRms = 0;
  let silenceFrames = 0;

  function resetStability() {
    lastNote = null;
    stableCount = 0;
    awaitingAttack = true;
    silenceFrames = 0;
    previousRms = 0;
  }

  function emitNote(payload) {
    listeners.forEach(fn => {
      try {
        fn(payload);
      } catch (err) {
        console.error("AudioEngine listener error:", err);
      }
    });
  }

  function emitLevel(level) {
    levelListeners.forEach(fn => {
      try {
        fn(level);
      } catch (err) {
        console.error("AudioEngine level listener error:", err);
      }
    });
  }








  async function start() {
    if (audioContext) {
      running = true;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      if (!rafId) update();
      return;
    }

    const audioConstraints = {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 1
    };
    if (selectedDeviceId) {
      audioConstraints.deviceId = { exact: selectedDeviceId };
    }
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: audioConstraints
    });

    audioContext = new AudioContext();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0;

    sourceNode = audioContext.createMediaStreamSource(mediaStream);
    sourceNode.connect(analyser);

    running = true;
    update();
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;

    if (sourceNode) {
      sourceNode.disconnect();
      sourceNode = null;
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    }

    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    lastNote = null;
    stableCount = 0;
    awaitingAttack = true;
    noiseFloor = 0.003;
    previousRms = 0;
    silenceFrames = 0;
    emitLevel(0);

  }

  function update() {
    if (!running || !analyser || !audioContext) return;

    try {
      const buf = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(buf);
      const rms = computeRms(buf);

      const clampedRms = Math.min(rms, 0.03);
      // Slightly boosted meter response so guitar plucks are visible at typical interface gains.
      emitLevel(Math.min(1, Math.sqrt(clampedRms / 0.015)));
      // Track a conservative floor so sustained playback leakage doesn't
      // push attack threshold beyond realistic guitar pluck RMS values.
      const floorSample = Math.min(clampedRms, 0.012);
      noiseFloor =
        noiseFloor * (1 - NOISE_FLOOR_ALPHA) +
        floorSample * NOISE_FLOOR_ALPHA;

      if (awaitingAttack) {
        const dynamicThreshold = Math.min(
          ATTACK_MAX_THRESHOLD_RMS,
          Math.max(ATTACK_MIN_RMS, noiseFloor * ATTACK_NOISE_MULTIPLIER)
        );
        const attackDetected =
          rms >= dynamicThreshold &&
          (rms - previousRms) >= ATTACK_DELTA_RMS;

        previousRms = rms;

        if (!attackDetected) {
          lastNote = null;
          stableCount = 0;
          lastFrequency = null;
          return;
        }

        awaitingAttack = false;
        lastNote = null;
        stableCount = 0;
      }

      const freq = autoCorrelate(buf, audioContext.sampleRate, rms);

      if (freq <= 0) {
        lastNote = null;
        stableCount = 0;
        lastFrequency = null;
        if (rms < REARM_SILENCE_RMS) {
          silenceFrames++;
          if (silenceFrames >= REARM_SILENCE_FRAMES) {
            awaitingAttack = true;
          }
        } else {
          silenceFrames = 0;
        }
        return;
      }

      let normalized = normalizeFrequency(freq);
      const foldLimit = activeProfile?.foldAbove ?? expectedMaxFreq;
      while (normalized > foldLimit) normalized /= 2;
      // High notes can be detected at a subharmonic (one octave low).
      // If doubling lands inside the expected range, promote it.
      let octaveUps = 0;
      while (
        normalized < expectedMinFreq * 0.85 &&
        normalized * 2 <= expectedMaxFreq * 1.25 &&
        octaveUps < 2
      ) {
        normalized *= 2;
        octaveUps++;
      }

      lastFrequency = normalized;

      if (
        normalized < expectedMinFreq * 0.85 ||
        normalized > expectedMaxFreq * 1.25
      ) {
        if (rms < REARM_SILENCE_RMS) {
          silenceFrames++;
          if (silenceFrames >= REARM_SILENCE_FRAMES) {
            awaitingAttack = true;
          }
        } else {
          silenceFrames = 0;
        }
        return;
      }

      const note = midiToNote(freqToMidi(normalized));

      if (note === lastNote) {
        stableCount++;
      } else {
        lastNote = note;
        stableCount = 1;
      }

      emitNote({
        note,
        freq: normalized,
        confidence: stableCount
      });

      if (rms < REARM_SILENCE_RMS) {
        silenceFrames++;
        if (silenceFrames >= REARM_SILENCE_FRAMES) {
          awaitingAttack = true;
        }
      } else {
        silenceFrames = 0;
      }
    } finally {
      if (running) {
        rafId = requestAnimationFrame(update);
      }
    }
  }



  


  function onNote(fn) {
    listeners.push(fn);
  }

  function onLevel(fn) {
    levelListeners.push(fn);
  }

  async function setDevice(deviceId) {
    selectedDeviceId = deviceId;

    // If already running, restart cleanly
    if (audioContext) {
      stop();
      await start();
    }
  }
 

  return {
    start,
    stop,
    onNote,
    onLevel,
    setDevice,
    setStringProfile,
    setActiveString,
    resetStability
  };

})();
