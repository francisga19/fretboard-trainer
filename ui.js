const VF = window.Vex;

export function createUI() {
  let songStepClickHandler = null;
  let scaleWriteStepClickHandler = null;
  const elements = {
    targetNote: document.getElementById("targetNote"),
    targetString: document.getElementById("targetString"),
    message: document.getElementById("message"),
    notation: document.getElementById("notation"),
    notationWrap: document.querySelector(".notation-wrap"),
    circleModeLayout: document.getElementById("circleModeLayout"),
    fretboardPanel: document.getElementById("fretboardPanel"),
    fretboard: document.getElementById("fretboard"),
    stringLabels: document.getElementById("stringLabels"),
    confidenceFill: document.getElementById("confidenceFill"),
    tuner: document.getElementById("tuner"),
    tunerNeedle: document.getElementById("tuner-needle"),
    tunerLabel: document.getElementById("tuner-label"),
    detectedNote: document.getElementById("detectedNote"),
    inputLevelFill: document.getElementById("inputLevelFill"),
    runtimeHint: document.getElementById("runtimeHint"),
    controls: {
      toggleOptionsBtn: document.getElementById("toggleOptionsBtn"),
      modeOptionsPanel: document.getElementById("modeOptionsPanel"),
      trainerMode: document.getElementById("trainerMode"),
      noteSpellingMode: document.getElementById("noteSpellingMode"),
      stringScopeBlock: document.getElementById("stringScopeBlock"),
      stringScopeInputs: Array.from(document.querySelectorAll('input[name="stringScope"]')),
      stringScopeSelectAllBtn: document.getElementById("stringScopeSelectAllBtn"),
      stringScopeSelectNoneBtn: document.getElementById("stringScopeSelectNoneBtn"),
      clefMode: document.getElementById("clefMode"),
      intervalSelector: document.getElementById("intervalSelector"),
      scaleSelector: document.getElementById("scaleSelector"),
      circleSelector: document.getElementById("circleSelector"),
      circleTrainingMode: document.getElementById("circleTrainingMode"),
      circleQualityMode: document.getElementById("circleQualityMode"),
      scaleTrainingMode: document.getElementById("scaleTrainingMode"),
      scaleTypeMode: document.getElementById("scaleTypeMode"),
      scaleIncludeMelodicMinorModes: document.getElementById("scaleIncludeMelodicMinorModes"),
      scaleIncludeHarmonicMinorModes: document.getElementById("scaleIncludeHarmonicMinorModes"),
      scaleEarTools: document.getElementById("scaleEarTools"),
      scaleWriteRootTools: document.getElementById("scaleWriteRootTools"),
      scaleWriteRootNote: document.getElementById("scaleWriteRootNote"),
      scaleReplayBtn: document.getElementById("scaleReplayBtn"),
      scaleEarAnswerButtons: document.getElementById("scaleEarAnswerButtons"),
      scaleWriteTools: document.getElementById("scaleWriteTools"),
      scaleWriteAccidentalDoubleFlatBtn: document.getElementById("scaleWriteAccidentalDoubleFlatBtn"),
      scaleWriteAccidentalFlatBtn: document.getElementById("scaleWriteAccidentalFlatBtn"),
      scaleWriteAccidentalNaturalBtn: document.getElementById("scaleWriteAccidentalNaturalBtn"),
      scaleWriteAccidentalSharpBtn: document.getElementById("scaleWriteAccidentalSharpBtn"),
      scaleWriteAccidentalDoubleSharpBtn: document.getElementById("scaleWriteAccidentalDoubleSharpBtn"),
      scaleWriteCheckBtn: document.getElementById("scaleWriteCheckBtn"),
      chordSelector: document.getElementById("chordSelector"),
      chordTrainingMode: document.getElementById("chordTrainingMode"),
      chordTypeMode: document.getElementById("chordTypeMode"),
      chordPlaybackMode: document.getElementById("chordPlaybackMode"),
      chordArpeggioSpeed: document.getElementById("chordArpeggioSpeed"),
      chordArpeggioSpeedValue: document.getElementById("chordArpeggioSpeedValue"),
      chordEarTools: document.getElementById("chordEarTools"),
      chordReplayBtn: document.getElementById("chordReplayBtn"),
      chordReplayOctDownBtn: document.getElementById("chordReplayOctDownBtn"),
      chordReplayOctUpBtn: document.getElementById("chordReplayOctUpBtn"),
      chordEarAnswerButtons: document.getElementById("chordEarAnswerButtons"),
      intervalMode: document.getElementById("intervalMode"),
      intervalCadenceToggle: document.getElementById("intervalCadenceToggle"),
      intervalEarCount: document.getElementById("intervalEarCount"),
      intervalDirectionMode: document.getElementById("intervalDirectionMode"),
      intervalChecklist: document.getElementById("intervalChecklist"),
      intervalSelectAllBtn: document.getElementById("intervalSelectAllBtn"),
      intervalSelectNoneBtn: document.getElementById("intervalSelectNoneBtn"),
      intervalReplayBtn: document.getElementById("intervalReplayBtn"),
      intervalReplayNotesBtn: document.getElementById("intervalReplayNotesBtn"),
      songEditor: document.getElementById("songEditor"),
      songCustomMode: document.getElementById("songCustomMode"),
      songStepEditor: document.getElementById("songStepEditor"),
      songBarSelect: document.getElementById("songBarSelect"),
      songBeatSelect: document.getElementById("songBeatSelect"),
      songStepPrevBtn: document.getElementById("songStepPrevBtn"),
      songStepNextBtn: document.getElementById("songStepNextBtn"),
      songStepNoteSelect: document.getElementById("songStepNoteSelect"),
      songStepDurationButtons: document.getElementById("songStepDurationButtons"),
      songStepRestButtons: document.getElementById("songStepRestButtons"),
      songStepMeta: document.getElementById("songStepMeta"),
      songBrowseTools: document.getElementById("songBrowseTools"),
      songViewPrevBtn: document.getElementById("songViewPrevBtn"),
      songViewCurrentBtn: document.getElementById("songViewCurrentBtn"),
      songViewNextBtn: document.getElementById("songViewNextBtn"),
      songViewLabel: document.getElementById("songViewLabel"),
      songFretboardToggleBtn: document.getElementById("songFretboardToggleBtn"),
      randomSongTools: document.getElementById("randomSongTools"),
      randomizeSongBtn: document.getElementById("randomizeSongBtn"),
      randomSongStartOverBtn: document.getElementById("randomSongStartOverBtn"),
      randomSongGenerationStyle: document.getElementById("randomSongGenerationStyle"),
      randomSongCounterpointStrictness: document.getElementById("randomSongCounterpointStrictness"),
      randomSongPlayBarChordsToggle: document.getElementById("randomSongPlayBarChordsToggle"),
      randomSongCueTempoSlider: document.getElementById("randomSongCueTempoSlider"),
      randomSongCueTempoValue: document.getElementById("randomSongCueTempoValue"),
      randomSongCueVolumeSlider: document.getElementById("randomSongCueVolumeSlider"),
      randomSongCueVolumeValue: document.getElementById("randomSongCueVolumeValue"),
      randomSongCueVelocitySlider: document.getElementById("randomSongCueVelocitySlider"),
      randomSongCueVelocityValue: document.getElementById("randomSongCueVelocityValue"),
      songNameInput: document.getElementById("songNameInput"),
      songSaveBtn: document.getElementById("songSaveBtn"),
      songLoadSelect: document.getElementById("songLoadSelect"),
      songLoadBtn: document.getElementById("songLoadBtn"),
      songDeleteBtn: document.getElementById("songDeleteBtn"),
      newQuestionBtn: document.getElementById("newQuestionBtn"),
      revealAnswerBtn: document.getElementById("revealAnswerBtn"),
      deviceSelect: document.getElementById("deviceSelect"),
      playbackInstrument: document.getElementById("playbackInstrument"),
      sampleOctaveShift: document.getElementById("sampleOctaveShift"),
      startListeningBtn: document.getElementById("startListeningBtn"),
      stopListeningBtn: document.getElementById("stopListeningBtn")
    },
    circleFifthsBoard: document.getElementById("circleFifthsBoard"),
    circleAccidentalsPanel: document.getElementById("circleAccidentalsPanel"),
    circleScaleNamesPanel: document.getElementById("circleScaleNamesPanel"),
    circleScaleNamesTitle: document.getElementById("circleScaleNamesTitle"),
    circleAccidentalsWheel: document.getElementById("circleAccidentalsWheel"),
    circleScaleNamesWheel: document.getElementById("circleScaleNamesWheel")
  };

  function setTarget(note, stringName) {
    elements.targetNote.textContent = note;
    elements.targetString.textContent = stringName;
  }

  function setMessage(text) {
    elements.message.textContent = text;
  }

  function setDetectedNote(text) {
    if (!elements.detectedNote) return;
    elements.detectedNote.textContent = text || "Detected: —";
  }

  function setInputLevel(level) {
    if (!elements.inputLevelFill) return;
    const clamped = Math.max(0, Math.min(1, Number(level) || 0));
    elements.inputLevelFill.style.width = `${Math.round(clamped * 100)}%`;
  }

  function clearMessage() {
    setMessage("");
  }

  function updateConfidence(count, maxCount) {
    const percent = Math.min(100, (count / maxCount) * 100);
    elements.confidenceFill.style.width = `${percent}%`;
  }

  function setTunerState({ freq, note, confidence, noteToFreq, centsOff }) {
    if (!freq || !note) {
      elements.tuner.style.opacity = "0.3";
      return;
    }

    const targetFreq = noteToFreq(note);
    let cents = centsOff(freq, targetFreq);
    cents = Math.max(-50, Math.min(50, cents));

    const percent = 50 + cents;
    elements.tunerNeedle.style.left = `${percent}%`;

    if (Math.abs(cents) < 5 && confidence >= 3) {
      elements.tunerLabel.textContent = "✔ In tune";
      elements.tuner.style.opacity = "1";
    } else if (cents < 0) {
      elements.tunerLabel.textContent = "◀ Flat";
      elements.tuner.style.opacity = "0.9";
    } else {
      elements.tunerLabel.textContent = "▶ Sharp";
      elements.tuner.style.opacity = "0.9";
    }
  }

  function renderNotation(note, noteToMidi) {
    if (!VF || !note || !/^([A-G])([#b]?)(\d)$/.test(note)) return;

    elements.notation.style.justifyContent = "center";
    elements.notation.innerHTML = "";

    const renderer = new VF.Renderer(elements.notation, VF.Renderer.Backends.SVG);
    renderer.resize(420, 180);
    const context = renderer.getContext();

    const trebleStave = new VF.Stave(40, 18, 340);
    trebleStave.addClef("treble").setContext(context).draw();

    const bassStave = new VF.Stave(40, 88, 340);
    bassStave.addClef("bass").setContext(context).draw();

    new VF.StaveConnector(trebleStave, bassStave)
      .setType(VF.StaveConnector.type.BRACE)
      .setContext(context)
      .draw();

    const [, letter, accidental, octave] = note.match(/^([A-G])([#b]?)(\d)$/);
    const pitchRaw = `${letter}${accidental}`;
    const key = `${pitchRaw.toLowerCase()}/${octave}`;
    const midi = noteToMidi(note);
    const useBass = midi < noteToMidi("C4");
    const stemDir = useBass
      ? (midi >= noteToMidi("D3") ? VF.Stem.DOWN : VF.Stem.UP)
      : (midi >= noteToMidi("B4") ? VF.Stem.DOWN : VF.Stem.UP);

    const staveNote = new VF.StaveNote({
      clef: useBass ? "bass" : "treble",
      keys: [key],
      duration: "q",
      stem_direction: stemDir
    });

    if (accidental === "#") {
      staveNote.addModifier(new VF.Accidental("#"), 0);
    } else if (accidental === "b") {
      staveNote.addModifier(new VF.Accidental("b"), 0);
    }

    const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
    voice.setStrict(false);
    voice.addTickables([staveNote]);

    const formatter = new VF.Formatter();
    formatter.joinVoices([voice]);
    formatter.format([voice], 300);
    voice.draw(context, useBass ? bassStave : trebleStave);
  }

  function renderKeySignatureNotation(keySignature = "C") {
    if (!VF) return;
    elements.notation.style.justifyContent = "center";
    elements.notation.innerHTML = "";

    const renderer = new VF.Renderer(elements.notation, VF.Renderer.Backends.SVG);
    renderer.resize(420, 180);
    const context = renderer.getContext();

    const trebleStave = new VF.Stave(40, 18, 340);
    trebleStave.addClef("treble");
    if (keySignature && keySignature !== "C") {
      trebleStave.addKeySignature(keySignature);
    }
    trebleStave.setContext(context).draw();

    const bassStave = new VF.Stave(40, 88, 340);
    bassStave.addClef("bass");
    if (keySignature && keySignature !== "C") {
      bassStave.addKeySignature(keySignature);
    }
    bassStave.setContext(context).draw();

    new VF.StaveConnector(trebleStave, bassStave)
      .setType(VF.StaveConnector.type.BRACE)
      .setContext(context)
      .draw();
  }

  function renderIntervalSequence(notes, noteToMidi, options = {}) {
    if (!VF || !Array.isArray(notes) || notes.length === 0) return;
    const valid = notes.filter((n) => /^([A-G])([#b]?)(\d)$/.test(n));
    const placeholderCount = Math.max(0, parseInt(options.placeholderCount || 0, 10) || 0);
    const placeholderPitches = ["G4", "A4", "B4", "C5"];
    const sequence = valid.map((note) => ({ note, placeholder: false }));
    for (let i = 0; i < placeholderCount; i++) {
      sequence.push({
        note: placeholderPitches[Math.min(i, placeholderPitches.length - 1)],
        placeholder: true
      });
    }
    if (sequence.length === 0) return;

    elements.notation.style.justifyContent = "center";
    elements.notation.innerHTML = "";

    const count = sequence.length;
    const width = Math.max(460, 140 + count * 66);
    const renderer = new VF.Renderer(elements.notation, VF.Renderer.Backends.SVG);
    renderer.resize(width, 220);
    const context = renderer.getContext();
    const trebleStave = new VF.Stave(40, 30, width - 80);
    trebleStave.addClef("treble").setContext(context).draw();
    const bassStave = new VF.Stave(40, 120, width - 80);
    bassStave.addClef("bass").setContext(context).draw();

    new VF.StaveConnector(trebleStave, bassStave)
      .setType(VF.StaveConnector.type.BRACE)
      .setContext(context)
      .draw();
    new VF.StaveConnector(trebleStave, bassStave)
      .setType(VF.StaveConnector.type.SINGLE_LEFT)
      .setContext(context)
      .draw();

    const trebleTickables = [];
    const bassTickables = [];
    const c4 = noteToMidi("C4");

    sequence.forEach((entry) => {
      const note = entry.note;
      const [, letter, accidental, octave] = note.match(/^([A-G])([#b]?)(\d)$/);
      const key = `${letter.toLowerCase()}${accidental || ""}/${octave}`;
      const midi = noteToMidi(note);
      const useTreble = midi >= c4;

      const pitched = new VF.StaveNote({
        clef: useTreble ? "treble" : "bass",
        keys: [key],
        duration: "q",
        stem_direction: midi >= noteToMidi("B4") ? VF.Stem.DOWN : VF.Stem.UP
      });
      if (accidental === "#") {
        pitched.addModifier(new VF.Accidental("#"), 0);
      } else if (accidental === "b") {
        pitched.addModifier(new VF.Accidental("b"), 0);
      }
      if (entry.placeholder) {
        pitched.setStyle({ fillStyle: "#9aa0a6", strokeStyle: "#9aa0a6" });
      }

      const trebleRest = new VF.StaveNote({ clef: "treble", keys: ["b/4"], duration: "qr" });
      const bassRest = new VF.StaveNote({ clef: "bass", keys: ["d/3"], duration: "qr" });

      if (useTreble) {
        trebleTickables.push(pitched);
        bassTickables.push(bassRest);
      } else {
        trebleTickables.push(trebleRest);
        bassTickables.push(pitched);
      }
    });

    const trebleVoice = new VF.Voice({
      num_beats: count,
      beat_value: 4
    });
    trebleVoice.setStrict(false);
    trebleVoice.addTickables(trebleTickables);

    const bassVoice = new VF.Voice({
      num_beats: count,
      beat_value: 4
    });
    bassVoice.setStrict(false);
    bassVoice.addTickables(bassTickables);

    new VF.Formatter()
      .joinVoices([trebleVoice])
      .joinVoices([bassVoice])
      .format([trebleVoice, bassVoice], width - 120);

    trebleVoice.draw(context, trebleStave);
    bassVoice.draw(context, bassStave);
  }

  function renderSongNotation(notes, activeIndex, noteToMidi, viewStartOverride = null, options = {}) {
    if (!VF || !Array.isArray(notes) || notes.length === 0) return;
    elements.notation.style.justifyContent = "flex-start";
    elements.notation.innerHTML = "";

    const normalized = notes.map((entry) =>
      typeof entry === "string" ? { note: entry, duration: "q" } : entry
    );
    const stepsPerBar = 16;
    const barsPerView = 4;
    const viewSize = stepsPerBar * barsPerView;
    const computedViewStart = activeIndex >= 0
      ? Math.floor(activeIndex / viewSize) * viewSize
      : 0;
    const viewStart = Number.isInteger(viewStartOverride)
      ? Math.max(0, Math.min(Math.max(0, normalized.length - viewSize), viewStartOverride))
      : computedViewStart;
    const viewNotes = normalized.slice(viewStart, viewStart + viewSize);
    const localActiveIndex = activeIndex >= 0 ? activeIndex - viewStart : -1;

    const renderer = new VF.Renderer(elements.notation, VF.Renderer.Backends.SVG);
    const staveWidth = 420;
    const staveGap = 0;
    const startX = 20;
    const totalWidth = startX * 2 + barsPerView * staveWidth + (barsPerView - 1) * staveGap;
    renderer.resize(totalWidth, 360);
    const context = renderer.getContext();
    const svg = context && context.svg ? context.svg : null;
    const topY = 62;
    const bottomY = 212;
    const firstBarNumber = Math.floor(viewStart / stepsPerBar) + 1;
    const lastBarNumber = Math.floor((viewStart + viewSize - 1) / stepsPerBar) + 1;

    if (svg) {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(startX + 4));
      label.setAttribute("y", String(topY - 20));
      label.setAttribute("fill", "#555");
      label.setAttribute("font-size", "14");
      label.setAttribute("font-weight", "700");
      label.textContent = `Bars ${firstBarNumber}-${lastBarNumber}`;
      svg.appendChild(label);
    }

    const c4 = noteToMidi("C4");
    const g3 = noteToMidi("G3");
    const e4 = noteToMidi("E4");
    const classifyClefWithContinuity = (midi, lastClef = null) => {
      if (midi < g3) return "bass";
      if (midi > e4) return "treble";
      if (lastClef) return lastClef;
      return midi >= c4 ? "treble" : "bass";
    };
    const durationSpec = {
      "16": { code: "16", base: "16", dots: 0, units: 1 },
      "8": { code: "8", base: "8", dots: 0, units: 2 },
      "q": { code: "q", base: "q", dots: 0, units: 4 },
      "qd": { code: "qd", base: "q", dots: 1, units: 6 },
      "h": { code: "h", base: "h", dots: 0, units: 8 },
      "w": { code: "w", base: "w", dots: 0, units: 16 }
    };
    const getDurationSpec = (value) => durationSpec[value] || null;
    const specForUnits = (units) => {
      if (units === 1) return durationSpec["16"];
      if (units === 2) return durationSpec["8"];
      if (units === 4) return durationSpec["q"];
      if (units === 6) return durationSpec["qd"];
      if (units === 8) return durationSpec["h"];
      if (units === 16) return durationSpec["w"];
      return null;
    };
    const applyDots = (staveNote, dotCount) => {
      for (let i = 0; i < dotCount; i++) {
        if (VF.Dot && typeof VF.Dot.buildAndAttach === "function") {
          VF.Dot.buildAndAttach([staveNote], { all: true });
        } else {
          staveNote.addModifier(new VF.Dot(), 0);
        }
      }
    };
    const splitUnitsGreedy = (units) => {
      const result = [];
      const options = [16, 8, 6, 4, 2, 1];
      let remaining = units;
      while (remaining > 0) {
        const pick = options.find((u) => u <= remaining);
        if (!pick) break;
        result.push(pick);
        remaining -= pick;
      }
      return result;
    };
    const rangesOverlap = (aStart, aUnits, bStart, bUnits) => {
      const aEnd = aStart + aUnits;
      const bEnd = bStart + bUnits;
      return aStart < bEnd && bStart < aEnd;
    };
    const makeStaveNote = ({ clef, key, spec, accidental, isRest, highlight }) => {
      const duration = isRest ? `${spec.base}r` : spec.base;
      const note = new VF.StaveNote({
        clef,
        keys: [key],
        duration
      });
      if (!isRest) {
        if (accidental === "#") {
          note.addModifier(new VF.Accidental("#"), 0);
        } else if (accidental === "b") {
          note.addModifier(new VF.Accidental("b"), 0);
        } else if (accidental === "n") {
          note.addModifier(new VF.Accidental("n"), 0);
        }
      }
      if (spec.dots > 0) {
        applyDots(note, spec.dots);
      }
      if (highlight) {
        note.setStyle({ fillStyle: "#1c7ed6", strokeStyle: "#1c7ed6" });
      }
      return note;
    };
    const isBeamableNote = (note) => {
      if (!note || typeof note.isRest !== "function" || note.isRest()) return false;
      const duration = String(note.getDuration?.() || "").replace("r", "");
      return duration === "8" || duration === "16" || duration === "32" || duration === "64";
    };
    const buildAdjacentBeams = (notes) => {
      const beams = [];
      let run = [];
      notes.forEach((note) => {
        if (isBeamableNote(note)) {
          run.push(note);
          return;
        }
        if (run.length >= 2) {
          beams.push(new VF.Beam(run));
        }
        run = [];
      });
      if (run.length >= 2) {
        beams.push(new VF.Beam(run));
      }
      return beams;
    };

    let lastAssignedClef = null;
    if (viewStart > 0) {
      for (let i = 0; i < Math.min(viewStart, normalized.length); i++) {
        const prior = normalized[i];
        if (!prior || prior.note === "REST" || prior.duration === "0") continue;
        const priorMidi = noteToMidi(prior.note);
        if (priorMidi === null || priorMidi === undefined) continue;
        lastAssignedClef = classifyClefWithContinuity(priorMidi, lastAssignedClef);
      }
    }

    for (let bar = 0; bar < barsPerView; bar++) {
      const barStart = bar * stepsPerBar;
      const barNotes = viewNotes.slice(barStart, barStart + stepsPerBar);
      const globalBarIndex = Math.floor(viewStart / stepsPerBar) + bar;

      const x = startX + bar * (staveWidth + staveGap);
      const trebleStave = new VF.Stave(x, topY, staveWidth);
      const bassStave = new VF.Stave(x, bottomY, staveWidth);

      if (bar === 0) {
        trebleStave.addClef("treble");
        bassStave.addClef("bass");
      }
      if (bar > 0 && VF.Barline && VF.Barline.type && VF.Barline.type.NONE !== undefined) {
        trebleStave.setBegBarType(VF.Barline.type.NONE);
        bassStave.setBegBarType(VF.Barline.type.NONE);
      }
      if (bar === barsPerView - 1) {
        trebleStave.setEndBarType(VF.Barline.type.END);
        bassStave.setEndBarType(VF.Barline.type.END);
      } else {
        trebleStave.setEndBarType(VF.Barline.type.SINGLE);
        bassStave.setEndBarType(VF.Barline.type.SINGLE);
      }

      trebleStave.setContext(context).draw();
      bassStave.setContext(context).draw();

      if (svg && Array.isArray(options.barChordLabels)) {
        const chordLabel = options.barChordLabels[globalBarIndex];
        if (chordLabel) {
          const chordText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          chordText.setAttribute("x", String(x + (bar === 0 ? 64 : 8)));
          chordText.setAttribute("y", String(topY - 6));
          chordText.setAttribute("fill", "#2b2b2b");
          chordText.setAttribute("font-size", "14");
          chordText.setAttribute("font-weight", "700");
          chordText.textContent = chordLabel;
          svg.appendChild(chordText);
        }
      }

      const connector = new VF.StaveConnector(trebleStave, bassStave).setContext(context);
      if (bar === 0) {
        connector.setType(VF.StaveConnector.type.BRACE).draw();
        new VF.StaveConnector(trebleStave, bassStave)
          .setType(VF.StaveConnector.type.SINGLE_LEFT)
          .setContext(context)
          .draw();
      }

      let trebleNotes = [];
      let bassNotes = [];
      const trebleTies = [];
      const bassTies = [];
      const trebleTiedNotes = new Set();
      const bassTiedNotes = new Set();
      const clickSegments = [];
      const trebleEvents = [];
      const bassEvents = [];
      const accidentalState = {
        treble: new Map(),
        bass: new Map()
      };
      let cursorUnits = 0;
      let activeStartUnits = null;
      let activeUnits = 0;
      let activeIsRest = false;

      const buildClefNotes = (events, clef, restKey, ties, tiedSet) => {
        const notes = [];
        let eventCursor = 0;
        let prevPitched = null;

        events
          .sort((a, b) => a.start - b.start)
          .forEach((event) => {
            if (event.start > eventCursor) {
              const gapUnits = splitUnitsGreedy(event.start - eventCursor);
              let gapCursor = eventCursor;
              gapUnits.forEach((units) => {
                const gapSpec = specForUnits(units);
                if (!gapSpec) return;
                const highlightGap = activeIsRest
                  && activeStartUnits !== null
                  && rangesOverlap(gapCursor, units, activeStartUnits, activeUnits);
                notes.push(makeStaveNote({
                  clef,
                  key: restKey,
                  spec: gapSpec,
                  accidental: "",
                  isRest: true,
                  highlight: highlightGap
                }));
                gapCursor += units;
              });
            }

            const note = makeStaveNote({
              clef,
              key: event.key,
              spec: event.spec,
              accidental: event.accidental,
              isRest: false,
              highlight: event.highlight
            });
            notes.push(note);

            if (event.tieFromPrev && prevPitched) {
              tiedSet.add(prevPitched);
              tiedSet.add(note);
              ties.push(new VF.StaveTie({
                first_note: prevPitched,
                last_note: note,
                first_indices: [0],
                last_indices: [0]
              }));
            }

            prevPitched = note;
            eventCursor = event.start + event.units;
          });

        if (eventCursor < 16) {
          const tailUnits = splitUnitsGreedy(16 - eventCursor);
          let tailCursor = eventCursor;
          tailUnits.forEach((units) => {
            const tailSpec = specForUnits(units);
            if (!tailSpec) return;
            const highlightTail = activeIsRest
              && activeStartUnits !== null
              && rangesOverlap(tailCursor, units, activeStartUnits, activeUnits);
            notes.push(makeStaveNote({
              clef,
              key: restKey,
              spec: tailSpec,
              accidental: "",
              isRest: true,
              highlight: highlightTail
            }));
            tailCursor += units;
          });
        }

        if (notes.length === 0) {
          notes.push(new VF.StaveNote({ clef, keys: [restKey], duration: "wr" }));
        }

        return notes;
      };

      try {
        barNotes.forEach((entry, idx) => {
          const note = entry?.note;
          const spec = getDurationSpec(entry?.duration);
          if (!spec) return;
          const eventStartUnits = cursorUnits;
          const isPitched = /^([A-G])([#b]?)(\d)$/.test(note);
          const globalIdx = barStart + idx;
          if (globalIdx === localActiveIndex) {
            activeStartUnits = eventStartUnits;
            activeUnits = spec.units;
            activeIsRest = !isPitched;
          }
          if (spec.units > 0) {
            clickSegments.push({
              globalStep: viewStart + barStart + idx,
              startUnits: eventStartUnits,
              units: spec.units,
              duration: spec.code,
              isRest: !isPitched
            });
          }
          const splitQuarterOnUpbeat = isPitched && spec.code === "q" && (cursorUnits % 4) === 2;
          const chunkUnits = splitQuarterOnUpbeat ? [2, 2] : [spec.units];

          if (!isPitched) {
            cursorUnits += spec.units;
            return;
          }

          const [, letter, accidental, octave] = note.match(/^([A-G])([#b]?)(\d)$/);
          const key = `${letter.toLowerCase()}${accidental ? accidental : ""}/${octave}`;
          const naturalizedKey = `${letter.toLowerCase()}/${octave}`;
          const accidentalStateKey = `${letter.toUpperCase()}${octave}`;
          const midi = noteToMidi(note);
          const assignedClef = classifyClefWithContinuity(midi, lastAssignedClef);
          const useTreble = assignedClef === "treble";
          const clefState = accidentalState[assignedClef];
          const targetAccidental = accidental || "";
          const previousAccidental = clefState.get(accidentalStateKey) || "";
          let renderedAccidental = "";
          if (targetAccidental !== previousAccidental) {
            renderedAccidental = targetAccidental === "" ? "n" : targetAccidental;
          }
          clefState.set(accidentalStateKey, targetAccidental);
          lastAssignedClef = assignedClef;
          let chunkStart = cursorUnits;

          chunkUnits.forEach((units, chunkIndex) => {
            const chunkSpec = specForUnits(units);
            if (!chunkSpec) return;
            const event = {
              start: chunkStart,
              units,
              key: targetAccidental ? key : naturalizedKey,
              accidental: chunkIndex === 0 ? renderedAccidental : "",
              spec: chunkSpec,
              highlight: globalIdx === localActiveIndex,
              tieFromPrev: splitQuarterOnUpbeat && chunkIndex > 0
            };
            if (useTreble) {
              trebleEvents.push(event);
            } else {
              bassEvents.push(event);
            }
            chunkStart += units;
          });
          cursorUnits += spec.units;
        });
      } catch (err) {
        console.error("Song note build failed for bar", bar, err);
      }

      trebleNotes = buildClefNotes(trebleEvents, "treble", "b/4", trebleTies, trebleTiedNotes);
      bassNotes = buildClefNotes(bassEvents, "bass", "d/3", bassTies, bassTiedNotes);

      try {
        const trebleVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        trebleVoice.setStrict(false);
        trebleVoice.addTickables(trebleNotes);

        const bassVoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        bassVoice.setStrict(false);
        bassVoice.addTickables(bassNotes);

        new VF.Formatter()
          .joinVoices([trebleVoice])
          .joinVoices([bassVoice])
          .format([trebleVoice, bassVoice], staveWidth - 24);

        let trebleBeams = [];
        let bassBeams = [];

        try {
          const trebleBeamCandidates = trebleNotes.filter((n) => !trebleTiedNotes.has(n));
          const bassBeamCandidates = bassNotes.filter((n) => !bassTiedNotes.has(n));
          trebleBeams = buildAdjacentBeams(trebleBeamCandidates);
          bassBeams = buildAdjacentBeams(bassBeamCandidates);
        } catch (beamErr) {
          console.warn("Beam rendering failed for bar", bar, beamErr);
        }

        trebleVoice.draw(context, trebleStave);
        bassVoice.draw(context, bassStave);
        trebleBeams.forEach((beam) => beam.setContext(context).draw());
        bassBeams.forEach((beam) => beam.setContext(context).draw());
        trebleTies.forEach((tie) => tie.setContext(context).draw());
        bassTies.forEach((tie) => tie.setContext(context).draw());
      } catch (err) {
        console.error("Song bar render failed", bar, err);
      }

      if (svg && typeof songStepClickHandler === "function") {
        const zoneStartX = typeof trebleStave.getNoteStartX === "function"
          ? trebleStave.getNoteStartX()
          : x;
        const zoneEndX = typeof trebleStave.getNoteEndX === "function"
          ? trebleStave.getNoteEndX()
          : (x + staveWidth);
        const zoneWidth = Math.max(0, zoneEndX - zoneStartX);
        const clickTop = topY - 14;
        const clickHeight = (bottomY - topY) + 90;
        clickSegments.forEach((segment) => {
          if (segment.globalStep >= normalized.length) return;
          const rectX = zoneStartX + (segment.startUnits / 16) * zoneWidth;
          const rectWidth = Math.max(4, (segment.units / 16) * zoneWidth);
          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", String(rectX));
          rect.setAttribute("y", String(clickTop));
          rect.setAttribute("width", String(rectWidth));
          rect.setAttribute("height", String(clickHeight));
          rect.setAttribute("fill", "rgba(28,126,214,0)");
          rect.setAttribute("stroke", "rgba(28,126,214,0)");
          rect.setAttribute("stroke-width", "1");
          rect.style.transition = "fill 80ms linear, stroke 80ms linear";
          rect.style.cursor = "pointer";
          rect.addEventListener("mouseenter", () => {
            rect.setAttribute("fill", "rgba(28,126,214,0.10)");
            rect.setAttribute("stroke", "rgba(28,126,214,0.35)");
          });
          rect.addEventListener("mouseleave", () => {
            rect.setAttribute("fill", "rgba(28,126,214,0)");
            rect.setAttribute("stroke", "rgba(28,126,214,0)");
          });
          rect.addEventListener("click", (event) => {
            event.stopPropagation();
            songStepClickHandler({
              stepIndex: segment.globalStep,
              duration: segment.duration,
              isRest: segment.isRest
            });
          });
          svg.appendChild(rect);
        });
      }
    }
  }

  function clearActiveString() {
    document.querySelectorAll(".string-row").forEach((row) => row.classList.remove("active"));
  }

  function highlightActiveString(stringIndex) {
    clearActiveString();
    const row = document.querySelector(`.string-row[data-string="${stringIndex}"]`);
    if (row) row.classList.add("active");
  }

  function clearCorrectFret() {
    document.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("correct"));
  }

  function highlightCorrectFret(target) {
    if (!target) return;
    const cell = document.querySelector(
      `.cell[data-string="${target.s}"][data-fret="${target.f}"]`
    );
    if (cell) cell.classList.add("correct");
  }

  function clearIntervalSource() {
    document.querySelectorAll(".string-row").forEach((row) => row.classList.remove("source"));
    document.querySelectorAll(".cell").forEach((cell) => cell.classList.remove("interval-root"));
  }

  function highlightIntervalSource(target) {
    if (!target) return;
    const row = document.querySelector(`.string-row[data-string="${target.s}"]`);
    if (row) row.classList.add("source");

    const cell = document.querySelector(
      `.cell[data-string="${target.s}"][data-fret="${target.f}"]`
    );
    if (cell) cell.classList.add("interval-root");
  }

  function buildFretboard(tuning, onCellClick) {
    elements.fretboard.innerHTML = "";
    const fretCount = 12;

    for (let fret = 0; fret <= fretCount; fret++) {
      const fretEl = document.createElement("div");
      fretEl.className = "fret";
      if (fret === 0) fretEl.classList.add("nut");
      fretEl.style.left = `${((fret + 1) / (fretCount + 1)) * 100}%`;
      elements.fretboard.appendChild(fretEl);
    }

    tuning.forEach((stringInfo, stringIndex) => {
      const row = document.createElement("div");
      row.className = `string-row string-${stringIndex}`;
      row.dataset.string = String(stringIndex);
      row.style.display = "grid";
      row.style.gridTemplateColumns = `repeat(${fretCount + 1}, 1fr)`;

      for (let fret = 0; fret <= fretCount; fret++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.string = String(stringIndex);
        cell.dataset.fret = String(fret);
        cell.addEventListener("click", () => onCellClick(stringIndex, fret));
        row.appendChild(cell);
      }

      elements.fretboard.appendChild(row);
    });

    elements.stringLabels.innerHTML = "";
    tuning.forEach((stringInfo) => {
      const label = document.createElement("div");
      label.textContent = stringInfo.note.replace(/\d/, "");
      elements.stringLabels.appendChild(label);
    });
  }

  function addFretMarkers() {
    const board = elements.fretboard;
    board.querySelectorAll(".fret-marker").forEach((marker) => marker.remove());

    function getCellCenter(fret, stringIndex) {
      const cell = board.querySelector(
        `.cell[data-string="${stringIndex}"][data-fret="${fret}"]`
      );
      if (!cell) return null;

      const cellRect = cell.getBoundingClientRect();
      const boardRect = board.getBoundingClientRect();
      return {
        x: cellRect.left + cellRect.width / 2 - boardRect.left,
        y: cellRect.top + cellRect.height / 2 - boardRect.top
      };
    }

    function placeMarker(fret, stringA, stringB) {
      const posA = getCellCenter(fret, stringA);
      const posB = getCellCenter(fret, stringB);
      if (!posA || !posB) return;

      const marker = document.createElement("div");
      marker.className = "fret-marker";
      marker.style.left = `${posA.x}px`;
      marker.style.top = `${(posA.y + posB.y) / 2}px`;
      board.appendChild(marker);
    }

    [3, 5, 7, 9].forEach((fret) => placeMarker(fret, 2, 3));
    placeMarker(12, 1, 2);
    placeMarker(12, 3, 4);
  }

  function showRuntimeHint(message) {
    elements.runtimeHint.style.display = "block";
    elements.runtimeHint.textContent = message;
  }

  function setIntervalSelectorVisible(visible) {
    elements.controls.intervalSelector.style.display = visible ? "block" : "none";
  }

  function setScaleSelectorVisible(visible) {
    if (!elements.controls.scaleSelector) return;
    elements.controls.scaleSelector.style.display = visible ? "block" : "none";
  }

  function setCircleSelectorVisible(visible) {
    if (!elements.controls.circleSelector) return;
    elements.controls.circleSelector.style.display = visible ? "block" : "none";
  }

  function setScaleEarToolsVisible(visible) {
    if (!elements.controls.scaleEarTools) return;
    elements.controls.scaleEarTools.style.display = visible ? "block" : "none";
  }

  function setScaleWriteToolsVisible(visible) {
    if (!elements.controls.scaleWriteTools) return;
    elements.controls.scaleWriteTools.style.display = visible ? "block" : "none";
  }

  function setScaleWriteRootToolsVisible(visible) {
    if (!elements.controls.scaleWriteRootTools) return;
    elements.controls.scaleWriteRootTools.style.display = visible ? "block" : "none";
  }

  function setStringScopeVisible(visible) {
    if (!elements.controls.stringScopeBlock) return;
    elements.controls.stringScopeBlock.style.display = visible ? "block" : "none";
  }

  function setChordSelectorVisible(visible) {
    if (!elements.controls.chordSelector) return;
    elements.controls.chordSelector.style.display = visible ? "block" : "none";
  }

  function setChordEarToolsVisible(visible) {
    if (!elements.controls.chordEarTools) return;
    elements.controls.chordEarTools.style.display = visible ? "block" : "none";
  }

  function setCircleFifthsBoardVisible(visible) {
    if (!elements.circleFifthsBoard) return;
    elements.circleFifthsBoard.style.display = visible ? "block" : "none";
  }

  function setCircleFifthsPanelsVisible(showAccidentals, showScaleNames) {
    if (elements.circleAccidentalsPanel) {
      elements.circleAccidentalsPanel.style.display = showAccidentals ? "block" : "none";
    }
    if (elements.circleScaleNamesPanel) {
      elements.circleScaleNamesPanel.style.display = showScaleNames ? "block" : "none";
    }
  }

  function setCircleNotationLayout({
    showNotation = true,
    compactSpacing = false,
    hideScaleNamesTitle = false,
    sideBySide = false
  } = {}) {
    if (elements.notationWrap) {
      elements.notationWrap.style.display = showNotation ? "block" : "none";
    }
    if (elements.circleModeLayout) {
      elements.circleModeLayout.classList.toggle("side-by-side", Boolean(sideBySide));
    }
    if (elements.circleFifthsBoard) {
      elements.circleFifthsBoard.classList.toggle("tight-spacing", Boolean(compactSpacing));
    }
    if (elements.circleScaleNamesTitle) {
      elements.circleScaleNamesTitle.style.display = hideScaleNamesTitle ? "none" : "block";
    }
  }

  const CIRCLE_SCALE_SVG_PATH = "Assets/SVG Circle of fifths/circle of 5ths.svg";
  let circleScaleSvgCacheText = null;
  let circleScaleSvgCachePromise = null;
  let circleScaleRenderCounter = 0;

  function loadCircleScaleSvgText() {
    if (circleScaleSvgCacheText) return Promise.resolve(circleScaleSvgCacheText);
    if (circleScaleSvgCachePromise) return circleScaleSvgCachePromise;
    const bust = `?v=${Date.now()}`;
    circleScaleSvgCachePromise = fetch(`${encodeURI(CIRCLE_SCALE_SVG_PATH)}${bust}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`SVG load failed: ${response.status}`);
        return response.text();
      })
      .then((text) => {
        circleScaleSvgCacheText = text;
        return text;
      })
      .finally(() => {
        circleScaleSvgCachePromise = null;
      });
    return circleScaleSvgCachePromise;
  }

  function normalizeScaleToken(value) {
    return String(value || "")
      .replace(/♯/g, "#")
      .replace(/♭/g, "b")
      .replace(/\s+/g, "")
      .toUpperCase();
  }

  function getScaleSvgGroupId(item) {
    const isMinor = item?.quality === "minor" || String(item?.key || "").startsWith("min:");
    const tokens = Array.isArray(item?.answerKeys) && item.answerKeys.length
      ? item.answerKeys
      : [item?.answerKey, item?.label].filter(Boolean);
    const normalized = new Set(tokens.map(normalizeScaleToken));

    if (isMinor) {
      if (normalized.has("AM")) return "min_Am";
      if (normalized.has("EM")) return "min_Em";
      if (normalized.has("BM")) return "min_Bm";
      if (normalized.has("F#M")) return "min_Fsm";
      if (normalized.has("C#M")) return "min_Csm";
      if (normalized.has("G#M")) return "min_Gsm";
      if (normalized.has("D#M") || normalized.has("EBM")) return "min_Ebm_Dsm";
      if (normalized.has("BBM")) return "min_Bbm";
      if (normalized.has("FM")) return "min_Fm";
      if (normalized.has("CM")) return "min_Cm";
      if (normalized.has("GM")) return "min_Gm";
      if (normalized.has("DM")) return "min_Dm";
      return null;
    }

    if (normalized.has("C")) return "maj_C";
    if (normalized.has("G")) return "maj_G";
    if (normalized.has("D")) return "maj_D";
    if (normalized.has("A")) return "maj_A";
    if (normalized.has("E")) return "maj_E";
    if (normalized.has("B")) return "maj_B";
    if (normalized.has("F#") || normalized.has("GB")) return "maj_Gb_Fs";
    if (normalized.has("DB")) return "maj_Db";
    if (normalized.has("AB")) return "maj_Ab";
    if (normalized.has("EB")) return "maj_Eb";
    if (normalized.has("BB")) return "maj_Bb";
    if (normalized.has("F")) return "maj_F";
    return null;
  }

  function applyScaleSvgGroupState(group, { selected, correct, dimmed }) {
    if (!group) return;
    const color = correct ? "#2f9e44" : selected ? "#1c7ed6" : "";
    group.style.opacity = dimmed ? "0.35" : "1";
    group.querySelectorAll("path").forEach((path) => {
      path.style.transition = "fill 120ms ease, opacity 120ms ease";
      path.style.fill = color;
    });
  }

  function applyScaleSvgGroupHover(group, enabled) {
    if (!group) return;
    group.querySelectorAll("path").forEach((path) => {
      path.style.fill = enabled ? "#444" : "";
    });
  }

  function renderScaleCircleWithSvg(rootEl, items, onPick, options = {}, fallback) {
    if (!rootEl) return;
    const token = String(++circleScaleRenderCounter);
    rootEl.dataset.circleSvgRenderToken = token;
    rootEl.innerHTML = "";
    rootEl.classList.remove("scale-theme", "accidental-theme");
    rootEl.classList.add("scale-theme");
    if (!Array.isArray(items) || items.length === 0) return;

    const selectedKey = options.selectedKey || null;
    const correctKey = options.correctKey || null;
    const dimmedKeys = options.dimmedKeys instanceof Set ? options.dimmedKeys : new Set();

    loadCircleScaleSvgText()
      .then((svgText) => {
        if (rootEl.dataset.circleSvgRenderToken !== token) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const parsedSvg = doc.documentElement;
        if (!parsedSvg || parsedSvg.nodeName.toLowerCase() === "parsererror") {
          fallback();
          return;
        }
        parsedSvg.classList.add("circle-wheel-svg");
        parsedSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        rootEl.innerHTML = "";
        rootEl.appendChild(parsedSvg);

        let boundCount = 0;
        items.forEach((item) => {
          const svgId = getScaleSvgGroupId(item);
          if (!svgId) return;
          const group = rootEl.querySelector(`#${svgId}`);
          if (!group) return;
          const dimmed = dimmedKeys.has(item.key);
          const selected = item.key === selectedKey;
          const correct = item.key === correctKey;
          applyScaleSvgGroupState(group, {
            selected,
            correct,
            dimmed
          });
          group.style.cursor = dimmed ? "default" : "pointer";
          if (!dimmed) {
            group.addEventListener("mouseenter", () => {
              if (selected || correct) return;
              applyScaleSvgGroupHover(group, true);
            });
            group.addEventListener("mouseleave", () => {
              applyScaleSvgGroupState(group, { selected, correct, dimmed });
            });
          }
          group.addEventListener("click", () => {
            if (dimmed || typeof onPick !== "function") return;
            onPick(item);
          });
          boundCount++;
        });

        if (boundCount === 0) {
          fallback();
        }
      })
      .catch(() => {
        fallback();
      });
  }

  function renderCircleWheel(rootEl, items, onPick, options = {}) {
    if (!rootEl) return;
    rootEl.innerHTML = "";
    rootEl.classList.remove("scale-theme", "accidental-theme");
    if (!Array.isArray(items) || items.length === 0) return;

    const selectedKey = options.selectedKey || null;
    const correctKey = options.correctKey || null;
    const dimmedKeys = options.dimmedKeys instanceof Set ? options.dimmedKeys : new Set();
    const size = 600;
    const center = size / 2;
    const outerRadius = 292;
    const ringRadiusOuter = 236;
    const ringRadiusInner = 168;
    const centerHoleRadius = 124;
    const splitRingRadius = 202;
    const hasInnerItems = items.some((item) => item.ring === "inner");

    const outerItems = items.filter((item) => item.ring !== "inner");
    const innerItems = items.filter((item) => item.ring === "inner");
    const lineCount = Math.max(outerItems.length, innerItems.length, 1);
    const keySignatureGlyphs = Array.isArray(options.keySignatureGlyphs)
      ? options.keySignatureGlyphs
      : null;
    rootEl.classList.add(hasInnerItems ? "scale-theme" : "accidental-theme");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.classList.add("circle-wheel-svg");

    const outline = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outline.setAttribute("cx", String(center));
    outline.setAttribute("cy", String(center));
    outline.setAttribute("r", String(outerRadius));
    outline.setAttribute("class", "outline");
    svg.appendChild(outline);

    const centerRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centerRing.setAttribute("cx", String(center));
    centerRing.setAttribute("cy", String(center));
    centerRing.setAttribute("r", String(centerHoleRadius));
    centerRing.setAttribute("class", "ring");
    svg.appendChild(centerRing);

    if (hasInnerItems) {
      const splitRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      splitRing.setAttribute("cx", String(center));
      splitRing.setAttribute("cy", String(center));
      splitRing.setAttribute("r", String(splitRingRadius));
      splitRing.setAttribute("class", "ring");
      svg.appendChild(splitRing);
    }

    for (let i = 0; i < lineCount; i++) {
      const angle = (-Math.PI / 2) + ((i / lineCount) * Math.PI * 2);
      const x1 = center + Math.cos(angle) * centerHoleRadius;
      const y1 = center + Math.sin(angle) * centerHoleRadius;
      const x = center + Math.cos(angle) * outerRadius;
      const y = center + Math.sin(angle) * outerRadius;
      const spoke = document.createElementNS("http://www.w3.org/2000/svg", "line");
      spoke.setAttribute("x1", String(x1));
      spoke.setAttribute("y1", String(y1));
      spoke.setAttribute("x2", String(x));
      spoke.setAttribute("y2", String(y));
      spoke.setAttribute("class", "spoke");
      svg.appendChild(spoke);
    }
    rootEl.appendChild(svg);

    if (keySignatureGlyphs && keySignatureGlyphs.length > 0) {
      const glyphRadius = 252;
      for (let i = 0; i < lineCount; i++) {
        const glyph = keySignatureGlyphs[i] || "";
        const glyphSrcs = Array.isArray(outerItems[i]?.glyphSrcs)
          ? outerItems[i].glyphSrcs
          : [];
        if (!glyph && glyphSrcs.length === 0) continue;
        const angle = (-Math.PI / 2) + ((i / lineCount) * Math.PI * 2);
        const x = center + Math.cos(angle) * glyphRadius;
        const y = center + Math.sin(angle) * glyphRadius;
        const itemKey = outerItems[i]?.key || null;

        const wrap = document.createElement("div");
        wrap.className = "circle-keysig-glyph";
        wrap.style.left = `${x}px`;
        wrap.style.top = `${y}px`;
        wrap.style.transform = "translate(-50%, -50%)";
        if (itemKey && itemKey === selectedKey) wrap.classList.add("selected");
        if (itemKey && itemKey === correctKey) wrap.classList.add("correct");

        if (glyphSrcs.length > 0) {
          wrap.classList.add("asset");
          glyphSrcs.slice(0, 2).forEach((src, idx) => {
            if (idx > 0) {
              const sep = document.createElement("span");
              sep.className = "sep";
              sep.textContent = "/";
              wrap.appendChild(sep);
            }
            const img = document.createElement("img");
            img.alt = "Key signature";
            img.src = src;
            wrap.appendChild(img);
          });
        } else {
          const staff = document.createElement("div");
          staff.className = "staff";
          const clef = document.createElement("div");
          clef.className = "clef";
          clef.textContent = "𝄞";
          const acc = document.createElement("div");
          acc.className = "acc";
          acc.textContent = glyph;

          wrap.appendChild(staff);
          wrap.appendChild(clef);
          wrap.appendChild(acc);
        }
        if (typeof onPick === "function" && outerItems[i]) {
          wrap.addEventListener("click", () => onPick(outerItems[i]));
        }
        rootEl.appendChild(wrap);
      }
    }

    const placeItem = (item, idx, total, ringRadius) => {
      const angle = (-Math.PI / 2) + ((idx / total) * Math.PI * 2);
      const x = center + Math.cos(angle) * ringRadius;
      const y = center + Math.sin(angle) * ringRadius;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "circle-wheel-item";
      if (item.style) button.classList.add(item.style);
      if (item.key === selectedKey) button.classList.add("selected");
      if (item.key === correctKey) button.classList.add("correct");
      const isDimmed = dimmedKeys.has(item.key);
      if (isDimmed) {
        button.classList.add("dimmed");
      }
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      button.title = item.hint || item.label;
      button.textContent = item.label || "";
      button.addEventListener("click", () => {
        if (isDimmed || typeof onPick !== "function") return;
        onPick(item);
      });
      rootEl.appendChild(button);
    };

    outerItems.forEach((item, idx) => {
      placeItem(item, idx, Math.max(1, outerItems.length), ringRadiusOuter);
    });
    innerItems.forEach((item, idx) => {
      placeItem(item, idx, Math.max(1, innerItems.length), ringRadiusInner);
    });
  }

  function renderCircleFifths(sets, handlers = {}, stateView = {}) {
    renderCircleWheel(
      elements.circleAccidentalsWheel,
      sets?.accidentals || [],
      handlers.onPickAccidental,
      {
        selectedKey: stateView.selectedAccidentalKey,
        correctKey: stateView.correctAccidentalKey,
        dimmedKeys: stateView.accidentalDimmedKeys,
        keySignatureGlyphs: (sets?.accidentals || []).map((item) => item.glyph || "")
      }
    );
    renderScaleCircleWithSvg(
      elements.circleScaleNamesWheel,
      sets?.scales || [],
      handlers.onPickScale,
      {
        selectedKey: stateView.selectedScaleKey,
        correctKey: stateView.correctScaleKey,
        dimmedKeys: stateView.scaleDimmedKeys
      },
      () => renderCircleWheel(
        elements.circleScaleNamesWheel,
        sets?.scales || [],
        handlers.onPickScale,
        {
          selectedKey: stateView.selectedScaleKey,
          correctKey: stateView.correctScaleKey,
          dimmedKeys: stateView.scaleDimmedKeys
        }
      )
    );
  }

  function renderScaleAnswerButtons(scales, onPick) {
    const root = elements.controls.scaleEarAnswerButtons;
    if (!root) return;
    root.innerHTML = "";
    scales.forEach((scale) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "scale-answer-btn";
      btn.textContent = scale.label;
      btn.addEventListener("click", () => onPick(scale));
      root.appendChild(btn);
    });
  }

  function renderChordAnswerButtons(chords, onPick, options = {}) {
    const root = elements.controls.chordEarAnswerButtons;
    if (!root) return;
    root.innerHTML = "";
    if (options.grouped) {
      root.classList.add("chord-answer-columns");
      const groups = [
        { label: "Triads", filter: (chord) => chord.group === "triads" },
        { label: "Sus Chords", filter: (chord) => chord.group === "sus" },
        { label: "7th Chords", filter: (chord) => chord.group === "seventh" },
        { label: "9th", filter: (chord) => chord.group === "extensions" && chord.label.includes("9") },
        { label: "11th", filter: (chord) => chord.group === "extensions" && chord.label.includes("11") },
        { label: "13th", filter: (chord) => chord.group === "extensions" && chord.label.includes("13") }
      ];
      groups.forEach((group) => {
        const col = document.createElement("div");
        col.className = "chord-answer-col";
        const heading = document.createElement("div");
        heading.className = "chord-answer-heading";
        heading.textContent = group.label;
        col.appendChild(heading);

        chords.filter(group.filter).forEach((chord) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "scale-answer-btn";
          btn.textContent = chord.label;
          btn.addEventListener("click", () => onPick(chord));
          col.appendChild(btn);
        });

        root.appendChild(col);
      });
      return;
    }

    root.classList.remove("chord-answer-columns");
    chords.forEach((chord) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "scale-answer-btn";
      btn.textContent = chord.label;
      btn.addEventListener("click", () => onPick(chord));
      root.appendChild(btn);
    });
  }

  function setModeOptionsVisible(visible) {
    if (!elements.controls.modeOptionsPanel) return;
    elements.controls.modeOptionsPanel.style.display = visible ? "block" : "none";
  }

  function setOptionsToggleLabel(hidden) {
    if (!elements.controls.toggleOptionsBtn) return;
    elements.controls.toggleOptionsBtn.textContent = hidden ? "Show Options" : "Hide Options";
  }

  function setIntervalReplayVisible(visible) {
    if (elements.controls.intervalReplayBtn) {
      elements.controls.intervalReplayBtn.style.display = visible ? "inline-block" : "none";
    }
    if (elements.controls.intervalReplayNotesBtn) {
      elements.controls.intervalReplayNotesBtn.style.display = visible ? "inline-block" : "none";
    }
  }

  function setSongEditorVisible(visible) {
    elements.controls.songEditor.style.display = visible ? "block" : "none";
  }

  function setSongStepEditorVisible(visible) {
    if (!elements.controls.songStepEditor) return;
    elements.controls.songStepEditor.style.display = visible ? "block" : "none";
  }

  function setSongBrowseVisible(visible) {
    if (!elements.controls.songBrowseTools) return;
    elements.controls.songBrowseTools.style.display = visible ? "flex" : "none";
  }

  function setSongBrowseLabel(text) {
    if (!elements.controls.songViewLabel) return;
    elements.controls.songViewLabel.textContent = text || "";
  }

  function setPrimarySongActionsVisible(visible) {
    if (elements.controls.newQuestionBtn) {
      elements.controls.newQuestionBtn.style.display = visible ? "none" : "inline-block";
    }
    if (elements.controls.revealAnswerBtn) {
      elements.controls.revealAnswerBtn.style.display = visible ? "none" : "inline-block";
    }
    if (elements.controls.songFretboardToggleBtn) {
      elements.controls.songFretboardToggleBtn.style.display = visible ? "inline-block" : "none";
    }
  }

  function setFretboardVisible(visible) {
    if (elements.fretboardPanel) {
      elements.fretboardPanel.style.display = visible ? "block" : "none";
    }
  }

  function setSongFretboardToggleLabel(hidden) {
    if (!elements.controls.songFretboardToggleBtn) return;
    elements.controls.songFretboardToggleBtn.textContent = hidden ? "Show Fretboard" : "Hide Fretboard";
  }

  function onSongStepClick(handler) {
    songStepClickHandler = typeof handler === "function" ? handler : null;
  }

  function setRandomSongToolsVisible(visible) {
    elements.controls.randomSongTools.style.display = visible ? "block" : "none";
  }

  function onScaleWriteStepClick(handler) {
    scaleWriteStepClickHandler = typeof handler === "function" ? handler : null;
  }

  function renderScaleWriteNotation(entries, noteToMidi, selectedIndex = 1) {
    if (!VF || !Array.isArray(entries) || entries.length === 0) return;
    const validEntries = entries.filter((entry) => /^([A-G])([#b]{0,2})(\d)$/.test(entry.note || ""));
    if (validEntries.length === 0) return;

    elements.notation.style.justifyContent = "center";
    elements.notation.innerHTML = "";

    const count = validEntries.length;
    const width = Math.max(460, 140 + count * 66);
    const renderer = new VF.Renderer(elements.notation, VF.Renderer.Backends.SVG);
    renderer.resize(width, 220);
    const context = renderer.getContext();
    const svg = context && context.svg ? context.svg : null;
    const trebleStave = new VF.Stave(40, 30, width - 80);
    trebleStave.addClef("treble").setContext(context).draw();
    const bassStave = new VF.Stave(40, 120, width - 80);
    bassStave.addClef("bass").setContext(context).draw();

    new VF.StaveConnector(trebleStave, bassStave)
      .setType(VF.StaveConnector.type.BRACE)
      .setContext(context)
      .draw();
    new VF.StaveConnector(trebleStave, bassStave)
      .setType(VF.StaveConnector.type.SINGLE_LEFT)
      .setContext(context)
      .draw();

    const trebleTickables = [];
    const bassTickables = [];
    const c4 = noteToMidi("C4");

    validEntries.forEach((entry, index) => {
      const [, letter, accidental, octave] = entry.note.match(/^([A-G])([#b]{0,2})(\d)$/);
      const key = `${letter.toLowerCase()}/${octave}`;
      const midi = noteToMidi(entry.note);
      const useTreble = midi >= c4;
      const visited = !!entry.visited;
      const style = index === 0
        ? { fillStyle: "#111", strokeStyle: "#111" }
        : index === selectedIndex
          ? { fillStyle: "#1c7ed6", strokeStyle: "#1c7ed6" }
          : visited
            ? { fillStyle: "#111", strokeStyle: "#111" }
            : { fillStyle: "#9aa0a6", strokeStyle: "#9aa0a6" };

      const pitched = new VF.StaveNote({
        clef: useTreble ? "treble" : "bass",
        keys: [key],
        duration: "q",
        stem_direction: midi >= noteToMidi("B4") ? VF.Stem.DOWN : VF.Stem.UP
      });
      if (accidental === "#") {
        pitched.addModifier(new VF.Accidental("#"), 0);
      } else if (accidental === "b") {
        pitched.addModifier(new VF.Accidental("b"), 0);
      } else if (accidental === "bb") {
        pitched.addModifier(new VF.Accidental("bb"), 0);
      } else if (accidental === "##") {
        pitched.addModifier(new VF.Accidental("##"), 0);
      }
      pitched.setStyle(style);

      const trebleRest = new VF.StaveNote({ clef: "treble", keys: ["b/4"], duration: "qr" });
      const bassRest = new VF.StaveNote({ clef: "bass", keys: ["d/3"], duration: "qr" });

      if (useTreble) {
        trebleTickables.push(pitched);
        bassTickables.push(bassRest);
      } else {
        trebleTickables.push(trebleRest);
        bassTickables.push(pitched);
      }
    });

    const trebleVoice = new VF.Voice({ num_beats: count, beat_value: 4 });
    trebleVoice.setStrict(false);
    trebleVoice.addTickables(trebleTickables);
    const bassVoice = new VF.Voice({ num_beats: count, beat_value: 4 });
    bassVoice.setStrict(false);
    bassVoice.addTickables(bassTickables);

    new VF.Formatter()
      .joinVoices([trebleVoice])
      .joinVoices([bassVoice])
      .format([trebleVoice, bassVoice], width - 120);

    trebleVoice.draw(context, trebleStave);
    bassVoice.draw(context, bassStave);

    if (!svg || typeof scaleWriteStepClickHandler !== "function") return;
    const zoneStartX = typeof trebleStave.getNoteStartX === "function"
      ? trebleStave.getNoteStartX()
      : 40;
    const zoneEndX = typeof trebleStave.getNoteEndX === "function"
      ? trebleStave.getNoteEndX()
      : (width - 40);
    const zoneWidth = Math.max(1, zoneEndX - zoneStartX);
    const clickTop = 14;
    const clickHeight = 220;
    for (let i = 0; i < count; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(zoneStartX + (i / count) * zoneWidth));
      rect.setAttribute("y", String(clickTop));
      rect.setAttribute("width", String(Math.max(4, zoneWidth / count)));
      rect.setAttribute("height", String(clickHeight));
      rect.setAttribute("fill", "rgba(28,126,214,0)");
      rect.setAttribute("stroke", "none");
      rect.style.cursor = i === 0 ? "default" : "pointer";
      if (i !== 0) {
        rect.addEventListener("click", (event) => {
          event.stopPropagation();
          scaleWriteStepClickHandler(i);
        });
      }
      svg.appendChild(rect);
    }
  }

  function renderIntervalChecklist(intervals, selectedKeys, onToggle) {
    const root = elements.controls.intervalChecklist;
    root.innerHTML = "";

    intervals.forEach((interval) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selectedKeys.has(interval.key);
      input.addEventListener("change", () => onToggle(interval.key, input.checked));

      const text = document.createElement("span");
      text.textContent = interval.label;
      label.appendChild(input);
      label.appendChild(text);
      root.appendChild(label);
    });
  }

  return {
    controls: elements.controls,
    setTarget,
    setMessage,
    setDetectedNote,
    setInputLevel,
    clearMessage,
    updateConfidence,
    setTunerState,
    renderNotation,
    renderIntervalSequence,
    renderSongNotation,
    clearActiveString,
    highlightActiveString,
    clearCorrectFret,
    highlightCorrectFret,
    clearIntervalSource,
    highlightIntervalSource,
    buildFretboard,
    addFretMarkers,
    showRuntimeHint,
    setIntervalSelectorVisible,
    setScaleSelectorVisible,
    setCircleSelectorVisible,
    setScaleEarToolsVisible,
    setScaleWriteToolsVisible,
    setScaleWriteRootToolsVisible,
    setStringScopeVisible,
    setChordSelectorVisible,
    setChordEarToolsVisible,
    setCircleFifthsBoardVisible,
    setCircleFifthsPanelsVisible,
    setCircleNotationLayout,
    renderScaleAnswerButtons,
    renderChordAnswerButtons,
    renderCircleFifths,
    setModeOptionsVisible,
    setOptionsToggleLabel,
    setIntervalReplayVisible,
    setSongEditorVisible,
    setSongStepEditorVisible,
    setSongBrowseVisible,
    setSongBrowseLabel,
    setPrimarySongActionsVisible,
    setFretboardVisible,
    setSongFretboardToggleLabel,
    onSongStepClick,
    onScaleWriteStepClick,
    setRandomSongToolsVisible,
    renderIntervalChecklist,
    renderScaleWriteNotation,
    renderKeySignatureNotation
  };
}
