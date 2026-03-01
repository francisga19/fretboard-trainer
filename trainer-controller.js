import { AudioEngine } from "./audio-engine.js";
import { createUI } from "./ui.js";

const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const tuning = [
  { name: "High E", note: "E4" },
  { name: "B", note: "B3" },
  { name: "G", note: "G3" },
  { name: "D", note: "D3" },
  { name: "A", note: "A2" },
  { name: "Low E", note: "E2" }
];
const ALL_STRING_INDEXES = [0, 1, 2, 3, 4, 5];
const CONFIDENCE_MAX = 6;
const SONG_STORAGE_KEY = "fretboard_trainer_songs_v1";
const SONG_BARS = 8; // Custom mode bars
const RANDOM_SONG_BARS = 17;
const BEATS_PER_BAR = 4;
const STEPS_PER_BAR = 16; // 16th-note grid
const SONG_STEPS = SONG_BARS * STEPS_PER_BAR;
const RANDOM_SONG_STEPS = RANDOM_SONG_BARS * STEPS_PER_BAR;
const SONG_DURATIONS = [
  { value: "16", label: "16th" },
  { value: "8", label: "Eighth" },
  { value: "q", label: "Quarter" },
  { value: "qd", label: "Dotted Quarter" },
  { value: "h", label: "Half" },
  { value: "w", label: "Whole" }
];
const ALL_DURATION_VALUES = ["0", ...SONG_DURATIONS.map((d) => d.value)];
const DURATION_ICON_FILES = {
  note: {
    "16": "16th note.svg",
    "8": "8th note.svg",
    q: "Quarter Note.svg",
    qd: "Dotted Quarter note.svg",
    h: "Half Note.svg",
    w: "Whole note.svg"
  },
  rest: {
    "16": "16th rest.svg",
    "8": "8th rest.svg",
    q: "Quarter rest.svg",
    qd: "Dotted quarter rest.svg",
    h: "Half rest.svg",
    w: "Whole rest.svg"
  }
};
const INTERVALS = [
  { key: "m2", label: "minor 2nd", semitones: 1 },
  { key: "M2", label: "major 2nd", semitones: 2 },
  { key: "m3", label: "minor 3rd", semitones: 3 },
  { key: "M3", label: "major 3rd", semitones: 4 },
  { key: "P4", label: "perfect 4th", semitones: 5 },
  { key: "aug4", label: "augmented 4th", semitones: 6 },
  { key: "P5", label: "perfect 5th", semitones: 7 },
  { key: "dim5", label: "diminished 5th", semitones: 6 },
  { key: "aug5", label: "augmented 5th", semitones: 8 },
  { key: "m6", label: "minor 6th", semitones: 8 },
  { key: "M6", label: "major 6th", semitones: 9 },
  { key: "m7", label: "minor 7th", semitones: 10 },
  { key: "M7", label: "major 7th", semitones: 11 }
];
const EAR_INTERVALS = [
  { key: "m2", label: "minor 2nd", semitones: 1 },
  { key: "M2", label: "major 2nd", semitones: 2 },
  { key: "m3", label: "minor 3rd", semitones: 3 },
  { key: "M3", label: "major 3rd", semitones: 4 },
  { key: "P4", label: "perfect 4th", semitones: 5 },
  { key: "TT", label: "tritone", semitones: 6 },
  { key: "P5", label: "perfect 5th", semitones: 7 },
  { key: "m6", label: "minor 6th", semitones: 8 },
  { key: "M6", label: "major 6th", semitones: 9 },
  { key: "m7", label: "minor 7th", semitones: 10 },
  { key: "M7", label: "major 7th", semitones: 11 },
  { key: "P8", label: "octave", semitones: 12 },
  { key: "m9", label: "minor 9th", semitones: 13 },
  { key: "M9", label: "major 9th", semitones: 14 },
  { key: "m10", label: "minor 10th", semitones: 15 },
  { key: "M10", label: "major 10th", semitones: 16 },
  { key: "P11", label: "perfect 11th", semitones: 17 },
  { key: "A11", label: "augmented 11th", semitones: 18 },
  { key: "P12", label: "perfect 12th", semitones: 19 },
  { key: "m13", label: "minor 13th", semitones: 20 },
  { key: "M13", label: "major 13th", semitones: 21 }
];
const SCALES = [
  { key: "major", label: "Ionian/Major", semitones: [0, 2, 4, 5, 7, 9, 11, 12], family: "other" },
  { key: "dorian", label: "Dorian", semitones: [0, 2, 3, 5, 7, 9, 10, 12], family: "other" },
  { key: "phrygian", label: "Phrygian", semitones: [0, 1, 3, 5, 7, 8, 10, 12], family: "other" },
  { key: "lydian", label: "Lydian", semitones: [0, 2, 4, 6, 7, 9, 11, 12], family: "other" },
  { key: "mixolydian", label: "Mixolydian", semitones: [0, 2, 4, 5, 7, 9, 10, 12], family: "other" },
  { key: "natural_minor", label: "Aeolian/Natural Minor", semitones: [0, 2, 3, 5, 7, 8, 10, 12], family: "other" },
  { key: "locrian", label: "Locrian", semitones: [0, 1, 3, 5, 6, 8, 10, 12], family: "other" },
  { key: "melodic_minor", label: "Melodic Minor", semitones: [0, 2, 3, 5, 7, 9, 11, 12], family: "melodic_minor" },
  { key: "melodic_dorian_b2", label: "Dorian b2 (Melodic Minor)", semitones: [0, 1, 3, 5, 7, 9, 10, 12], family: "melodic_minor" },
  { key: "melodic_lydian_augmented", label: "Lydian Augmented (Melodic Minor)", semitones: [0, 2, 4, 6, 8, 9, 11, 12], family: "melodic_minor" },
  { key: "melodic_lydian_dominant", label: "Lydian Dominant (Melodic Minor)", semitones: [0, 2, 4, 6, 7, 9, 10, 12], family: "melodic_minor" },
  { key: "melodic_mixolydian_b6", label: "Mixolydian b6 (Melodic Minor)", semitones: [0, 2, 4, 5, 7, 8, 10, 12], family: "melodic_minor" },
  { key: "melodic_locrian_sharp2", label: "Locrian #2 (Melodic Minor)", semitones: [0, 2, 3, 5, 6, 8, 10, 12], family: "melodic_minor" },
  { key: "melodic_altered", label: "Altered / Super Locrian (Melodic Minor)", semitones: [0, 1, 3, 4, 6, 8, 10, 12], family: "melodic_minor" },
  { key: "harmonic_minor", label: "Harmonic Minor", semitones: [0, 2, 3, 5, 7, 8, 11, 12], family: "harmonic_minor" },
  { key: "harmonic_locrian_sharp6", label: "Locrian #6 (Harmonic Minor)", semitones: [0, 1, 3, 5, 6, 9, 10, 12], family: "harmonic_minor" },
  { key: "harmonic_ionian_sharp5", label: "Ionian #5 (Harmonic Minor)", semitones: [0, 2, 4, 5, 8, 9, 11, 12], family: "harmonic_minor" },
  { key: "harmonic_dorian_sharp4", label: "Dorian #4 (Harmonic Minor)", semitones: [0, 2, 3, 6, 7, 9, 10, 12], family: "harmonic_minor" },
  { key: "harmonic_phrygian_dominant", label: "Phrygian Dominant (Harmonic Minor)", semitones: [0, 1, 4, 5, 7, 8, 10, 12], family: "harmonic_minor" },
  { key: "harmonic_lydian_sharp2", label: "Lydian #2 (Harmonic Minor)", semitones: [0, 3, 4, 6, 7, 9, 11, 12], family: "harmonic_minor" },
  { key: "harmonic_super_locrian_bb7", label: "Super Locrian bb7 (Harmonic Minor)", semitones: [0, 1, 3, 4, 6, 8, 9, 12], family: "harmonic_minor" },
  { key: "major_pentatonic", label: "Major Pentatonic", semitones: [0, 2, 4, 7, 9, 12], family: "other" },
  { key: "minor_pentatonic", label: "Minor Pentatonic", semitones: [0, 3, 5, 7, 10, 12], family: "other" }
];
const CHORDS = [
  { key: "maj", label: "Major", semitones: [0, 4, 7], group: "triads" },
  { key: "min", label: "Minor", semitones: [0, 3, 7], group: "triads" },
  { key: "dim", label: "Diminished", semitones: [0, 3, 6], group: "triads" },
  { key: "aug", label: "Augmented", semitones: [0, 4, 8], group: "triads" },
  { key: "sus2", label: "Sus2", semitones: [0, 2, 7], group: "sus" },
  { key: "sus4", label: "Sus4", semitones: [0, 5, 7], group: "sus" },
  { key: "7sus4", label: "7sus4", semitones: [0, 5, 7, 10], group: "sus" },
  { key: "7sus4_9", label: "7sus4 (9)", semitones: [0, 5, 7, 10, 14], group: "sus" },
  { key: "7sus4_b9", label: "7sus4 (b9)", semitones: [0, 5, 7, 10, 13], group: "sus" },
  { key: "7sus4_13", label: "7sus4 (13)", semitones: [0, 5, 7, 10, 21], group: "sus" },
  { key: "maj7", label: "Major 7", semitones: [0, 4, 7, 11], group: "seventh" },
  { key: "7", label: "Dominant 7", semitones: [0, 4, 7, 10], group: "seventh" },
  { key: "7b9", label: "7 (b9)", semitones: [0, 4, 7, 10, 13], group: "seventh" },
  { key: "7sharp9", label: "7 (#9)", semitones: [0, 4, 7, 10, 15], group: "seventh" },
  { key: "min7", label: "Minor 7", semitones: [0, 3, 7, 10], group: "seventh" },
  { key: "minMaj7", label: "Minor-Major 7", semitones: [0, 3, 7, 11], group: "seventh" },
  { key: "dim7", label: "Diminished 7", semitones: [0, 3, 6, 9], group: "seventh" },
  { key: "m7b5", label: "Half-Diminished (m7b5)", semitones: [0, 3, 6, 10], group: "seventh" },
  { key: "add9", label: "Add9", semitones: [0, 4, 7, 14], group: "extensions" },
  { key: "9", label: "Dominant 9", semitones: [0, 4, 7, 10, 14], group: "extensions" },
  { key: "maj9", label: "Major 9", semitones: [0, 4, 7, 11, 14], group: "extensions" },
  { key: "min9", label: "Minor 9", semitones: [0, 3, 7, 10, 14], group: "extensions" },
  { key: "11(no5)", label: "11 (No 5)", semitones: [0, 4, 10, 14, 17], group: "extensions" },
  { key: "maj11(no5)", label: "Major 11 (No 5)", semitones: [0, 4, 11, 14, 17], group: "extensions" },
  { key: "min11(no5)", label: "Minor 11 (No 5)", semitones: [0, 3, 10, 14, 17], group: "extensions" },
  { key: "13(no11)", label: "13 (No 11)", semitones: [0, 4, 10, 14, 21], group: "extensions" },
  { key: "maj13(no11)", label: "Major 13 (No 11)", semitones: [0, 4, 11, 14, 21], group: "extensions" },
  { key: "min13(no11)", label: "Minor 13 (No 11)", semitones: [0, 3, 10, 14, 21], group: "extensions" }
];
const CIRCLE_FIFTHS_SIGNATURES = [
  {
    id: "sig_0",
    accidentalCount: 0,
    accidentals: [],
    major: { short: "C", label: "C major", vfKey: "C" },
    minor: { short: "Am", label: "A minor", vfKey: "Am" }
  },
  {
    id: "sig_1s",
    accidentalCount: 1,
    accidentals: ["F#"],
    major: { short: "G", label: "G major", vfKey: "G" },
    minor: { short: "Em", label: "E minor", vfKey: "Em" }
  },
  {
    id: "sig_2s",
    accidentalCount: 2,
    accidentals: ["F#", "C#"],
    major: { short: "D", label: "D major", vfKey: "D" },
    minor: { short: "Bm", label: "B minor", vfKey: "Bm" }
  },
  {
    id: "sig_3s",
    accidentalCount: 3,
    accidentals: ["F#", "C#", "G#"],
    major: { short: "A", label: "A major", vfKey: "A" },
    minor: { short: "F#m", label: "F# minor", vfKey: "F#m" }
  },
  {
    id: "sig_4s",
    accidentalCount: 4,
    accidentals: ["F#", "C#", "G#", "D#"],
    major: { short: "E", label: "E major", vfKey: "E" },
    minor: { short: "C#m", label: "C# minor", vfKey: "C#m" }
  },
  {
    id: "sig_5s",
    accidentalCount: 5,
    accidentals: ["F#", "C#", "G#", "D#", "A#"],
    major: { short: "B", label: "B major", vfKey: "B" },
    minor: { short: "G#m", label: "G# minor", vfKey: "G#m" }
  },
  {
    id: "sig_6s",
    accidentalCount: 6,
    accidentals: ["F#", "C#", "G#", "D#", "A#", "E#"],
    major: { short: "F#", label: "F# major", vfKey: "F#" },
    minor: { short: "D#m", label: "D# minor", vfKey: "D#m" }
  },
  {
    id: "sig_1b",
    accidentalCount: -1,
    accidentals: ["Bb"],
    major: { short: "F", label: "F major", vfKey: "F" },
    minor: { short: "Dm", label: "D minor", vfKey: "Dm" }
  },
  {
    id: "sig_2b",
    accidentalCount: -2,
    accidentals: ["Bb", "Eb"],
    major: { short: "Bb", label: "Bb major", vfKey: "Bb" },
    minor: { short: "Gm", label: "G minor", vfKey: "Gm" }
  },
  {
    id: "sig_3b",
    accidentalCount: -3,
    accidentals: ["Bb", "Eb", "Ab"],
    major: { short: "Eb", label: "Eb major", vfKey: "Eb" },
    minor: { short: "Cm", label: "C minor", vfKey: "Cm" }
  },
  {
    id: "sig_4b",
    accidentalCount: -4,
    accidentals: ["Bb", "Eb", "Ab", "Db"],
    major: { short: "Ab", label: "Ab major", vfKey: "Ab" },
    minor: { short: "Fm", label: "F minor", vfKey: "Fm" }
  },
  {
    id: "sig_5b",
    accidentalCount: -5,
    accidentals: ["Bb", "Eb", "Ab", "Db", "Gb"],
    major: { short: "Db", label: "Db major", vfKey: "Db" },
    minor: { short: "Bbm", label: "Bb minor", vfKey: "Bbm" }
  },
  {
    id: "sig_6b",
    accidentalCount: -6,
    accidentals: ["Bb", "Eb", "Ab", "Db", "Gb", "Cb"],
    major: { short: "Gb", label: "Gb major", vfKey: "Gb" },
    minor: { short: "Ebm", label: "Eb minor", vfKey: "Ebm" }
  }
];
const CIRCLE_DISPLAY_WEDGES = [
  { id: "w0", signatureIds: ["sig_0"] },
  { id: "w1s", signatureIds: ["sig_1s"] },
  { id: "w2s", signatureIds: ["sig_2s"] },
  { id: "w3s", signatureIds: ["sig_3s"] },
  { id: "w4s", signatureIds: ["sig_4s"] },
  { id: "w5s", signatureIds: ["sig_5s"] },
  { id: "w6x", signatureIds: ["sig_6s", "sig_6b"] },
  { id: "w5b", signatureIds: ["sig_5b"] },
  { id: "w4b", signatureIds: ["sig_4b"] },
  { id: "w3b", signatureIds: ["sig_3b"] },
  { id: "w2b", signatureIds: ["sig_2b"] },
  { id: "w1b", signatureIds: ["sig_1b"] }
];

const state = {
  trainerMode: "note",
  intervalMode: "visual",
  circleTrainingMode: "sig_to_scale",
  circleQualityMode: "mixed",
  intervalCadenceEnabled: false,
  intervalEarCount: 1,
  scaleTrainingMode: "play",
  scaleWriteRootNote: "all",
  scaleTypeMode: "mixed",
  scaleIncludeMelodicMinorModes: true,
  scaleIncludeHarmonicMinorModes: true,
  chordTrainingMode: "ear",
  chordTypeMode: "mixed",
  chordPlaybackMode: "block",
  chordArpeggioGapMs: 200,
  playbackInstrument: "piano",
  sampleOctaveShiftSemitones: 0,
  modeOptionsHidden: false,
  currentTarget: null,
  questionAnswered: false,
  questionSpellingMode: "mixed",
  selectedStringIndexes: new Set(ALL_STRING_INDEXES),
  clefFilterMode: "all",
  intervalDirectionMode: "both",
  selectedIntervalKeys: new Set(INTERVALS.map((interval) => interval.key)),
  songCustomMode: "play",
  songEditStepIndex: 0,
  customSongBeats: [],
  randomSongBeats: [],
  randomSongScaleLabel: "",
  randomSongBarChords: [],
  randomSongBarChordMidis: [],
  randomSongGenerationStyle: "chord",
  randomSongCounterpointStrictness: "light",
  randomSongPlayBarChordsEnabled: false,
  randomSongCueTempoBpm: 96,
  randomSongCueVolume: 0.85,
  randomSongCueVelocity: 0.9,
  randomSongBarCueTimerId: null,
  randomSongBarCueTransitionTimerId: null,
  randomSongBarCueToken: 0,
  randomSongCurrentCueBar: -1,
  randomSongCurrentCueStartedAtMs: 0,
  randomSongCurrentCueLastPlayAtMs: 0,
  songViewStartStep: null,
  songFretboardHidden: false,
  songBeats: [],
  songActiveBeat: 0,
  songCorrectPos: null,
  songAttackArmed: false,
  songAttackReady: false,
  songPrevInputLevel: 0,
  songLastAcceptedMidi: null,
  intervalEarIgnoreUntil: 0
};

let earAudioContext = null;
let earPlaybackNodes = [];
let earPianoSampler = null;
let earPianoReady = false;
let earPianoLoading = null;
let earRhodesSampler = null;
let earRhodesReady = false;
let earRhodesLoading = null;
let earRhodesSynth = null;
let earRhodesEq = null;
let earRhodesCompressor = null;
let earRhodesChorus = null;
let earRhodesReverb = null;
let earPadSampler = null;
let earPadReady = false;
let earPadLoading = null;
let earPadSynth = null;
let earPadFilter = null;

const HUMANIZE_TIMING_BLOCK_SEC = 0.01;
const HUMANIZE_TIMING_ARP_SEC = 0.012;
const HUMANIZE_TIMING_LINE_SEC = 0.01;
const HUMANIZE_VELOCITY_JITTER = 0.06;

const ui = createUI();
const deviceSelect = ui.controls.deviceSelect;

function armSongAttackGate() {
  state.songAttackArmed = true;
  state.songAttackReady = false;
}

function stopRandomSongBarCueLoop() {
  state.randomSongBarCueToken += 1;
  state.randomSongCurrentCueBar = -1;
  state.randomSongCurrentCueStartedAtMs = 0;
  state.randomSongCurrentCueLastPlayAtMs = 0;
  if (state.randomSongBarCueTimerId !== null) {
    clearTimeout(state.randomSongBarCueTimerId);
    state.randomSongBarCueTimerId = null;
  }
  if (state.randomSongBarCueTransitionTimerId !== null) {
    clearTimeout(state.randomSongBarCueTransitionTimerId);
    state.randomSongBarCueTransitionTimerId = null;
  }
}

function getRandomSongCueRepeatMs() {
  const bpm = Math.max(40, Math.min(180, Number(state.randomSongCueTempoBpm) || 96));
  return Math.round(60000 / bpm);
}

function toggleOptionsPanel() {
  state.modeOptionsHidden = !state.modeOptionsHidden;
  const panel = document.getElementById("modeOptionsPanel");
  if (panel) {
    panel.style.display = state.modeOptionsHidden ? "none" : "block";
  }
  const btn = document.getElementById("toggleOptionsBtn");
  if (btn) {
    btn.textContent = state.modeOptionsHidden ? "Show Options" : "Hide Options";
  }
}

window.__toggleOptionsPanel = toggleOptionsPanel;

function noteToMidi(note) {
  const m = note.match(/^([A-G])([#b]{0,2})(\d)$/);
  if (!m) return null;

  const letterBase = `${m[1]}`;
  let pitchClass = notesSharp.indexOf(letterBase);
  if (pitchClass === -1) {
    pitchClass = notesFlat.indexOf(letterBase);
  }
  if (pitchClass === -1) return null;

  const accidental = m[2] || "";
  const accidentalOffset = accidental === "bb"
    ? -2
    : accidental === "b"
      ? -1
      : accidental === "##"
        ? 2
        : accidental === "#"
          ? 1
          : 0;
  const naturalMidi = (parseInt(m[3], 10) + 1) * 12 + pitchClass;
  return naturalMidi + accidentalOffset;
}

function midiToNote(midi, preferFlat = false) {
  const names = preferFlat ? notesFlat : notesSharp;
  return names[midi % 12] + (Math.floor(midi / 12) - 1);
}

function midiToQuestionNote(midi) {
  if (state.questionSpellingMode === "flat") return midiToNote(midi, true);
  if (state.questionSpellingMode === "sharp") return midiToNote(midi, false);

  const pitchClass = midi % 12;
  const isAccidental = [1, 3, 6, 8, 10].includes(pitchClass);
  const preferFlat = isAccidental && Math.random() < 0.5;
  return midiToNote(midi, preferFlat);
}

function shouldPreferFlatForScale(rootMidi, scaleKey) {
  if (state.questionSpellingMode === "flat") return true;
  if (state.questionSpellingMode === "sharp") return false;

  const pc = rootMidi % 12;
  const majorLike = new Set([
    "major",
    "lydian",
    "mixolydian",
    "major_pentatonic",
    "melodic_lydian_augmented",
    "melodic_lydian_dominant",
    "melodic_mixolydian_b6",
    "harmonic_ionian_sharp5",
    "harmonic_lydian_sharp2"
  ]);
  const minorLike = new Set([
    "natural_minor",
    "melodic_minor",
    "dorian",
    "phrygian",
    "locrian",
    "harmonic_minor",
    "minor_pentatonic",
    "melodic_dorian_b2",
    "melodic_locrian_sharp2",
    "melodic_altered",
    "harmonic_locrian_sharp6",
    "harmonic_dorian_sharp4",
    "harmonic_phrygian_dominant",
    "harmonic_super_locrian_bb7"
  ]);
  const flatMajorPcs = new Set([5, 10, 3, 8, 1, 6]); // F Bb Eb Ab Db Gb
  const flatMinorPcs = new Set([2, 7, 0, 5, 10, 3, 8]); // D G C F Bb Eb Ab

  if (majorLike.has(scaleKey)) return flatMajorPcs.has(pc);
  if (minorLike.has(scaleKey)) return flatMinorPcs.has(pc);
  return false;
}

function buildScaleNoteNames(rootMidi, scale) {
  const preferFlat = shouldPreferFlatForScale(rootMidi, scale.key);
  const naturalPcByLetter = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
  };
  const letterOrder = ["C", "D", "E", "F", "G", "A", "B"];
  const accidentalByDelta = {
    "-2": "bb",
    "-1": "b",
    "0": "",
    "1": "#",
    "2": "##"
  };

  const rootName = midiToNote(rootMidi, preferFlat);
  const rootMatch = rootName.match(/^([A-G])([#b]?)(\d)$/);
  if (!rootMatch) {
    return scale.semitones.map((semi) => midiToNote(rootMidi + semi, preferFlat));
  }
  const rootLetter = rootMatch[1];
  const rootOctave = parseInt(rootMatch[3], 10);
  const rootLetterIndex = letterOrder.indexOf(rootLetter);

  return scale.semitones.map((semi, degreeIndex) => {
    const targetMidi = rootMidi + semi;
    const targetPc = ((targetMidi % 12) + 12) % 12;
    const letter = letterOrder[(rootLetterIndex + degreeIndex) % 7];
    const letterPc = naturalPcByLetter[letter];

    let bestDelta = 0;
    let bestScore = Infinity;
    for (let delta = -2; delta <= 2; delta++) {
      const candidatePc = ((letterPc + delta) % 12 + 12) % 12;
      if (candidatePc !== targetPc) continue;
      const abs = Math.abs(delta);
      const directionPenalty = preferFlat
        ? (delta > 0 ? 0.25 : 0)
        : (delta < 0 ? 0.25 : 0);
      const score = abs + directionPenalty;
      if (score < bestScore) {
        bestScore = score;
        bestDelta = delta;
      }
    }

    const accidental = accidentalByDelta[String(bestDelta)] || "";
    const octave = rootOctave + Math.floor((rootLetterIndex + degreeIndex) / 7);
    return `${letter}${accidental}${octave}`;
  });
}

function noteAt(open, fret) {
  const midi = noteToMidi(open) + fret;
  return { midi, note: midiToQuestionNote(midi) };
}

function getSelectedPlaybackInstrument() {
  return state.playbackInstrument || "piano";
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function applySampleOctaveShift(midi) {
  const userShift = Number(state.sampleOctaveShiftSemitones) || 0;
  const shifted = midi + userShift;
  return Math.max(21, Math.min(108, shifted));
}

function humanizeTimeSec(rangeSec) {
  return (Math.random() * 2 - 1) * rangeSec;
}

function relativeVelocityFactor(index) {
  const contour = [1.0, 0.94, 0.98, 0.92, 0.96, 0.9];
  const base = contour[index % contour.length];
  const jitter = 1 + ((Math.random() * 2 - 1) * HUMANIZE_VELOCITY_JITTER);
  return base * jitter;
}

function isCustomSongMode() {
  return state.trainerMode === "song-custom";
}

function isRandomSongMode() {
  return state.trainerMode === "song-random";
}

function isSongMode() {
  return isCustomSongMode() || isRandomSongMode();
}

function isScaleMode() {
  return state.trainerMode === "scale";
}

function isChordMode() {
  return state.trainerMode === "chord";
}

function isCircleMode() {
  return state.trainerMode === "circle";
}

function isSongBrowseMode() {
  return isSongMode();
}

function refreshModeChrome() {
  const inSongMode = isSongMode();
  const inScaleWriteMode = isScaleMode() && state.scaleTrainingMode === "write";
  const inCircleMode = isCircleMode();
  ui.setPrimarySongActionsVisible(inSongMode);
  ui.setIntervalReplayVisible(state.trainerMode === "interval" && state.intervalMode === "ear");
  if (typeof ui.setCircleFifthsBoardVisible === "function") {
    ui.setCircleFifthsBoardVisible(inCircleMode);
  }
  if (typeof ui.setCircleNotationLayout === "function") {
    ui.setCircleNotationLayout({
      showNotation: !inCircleMode || state.circleTrainingMode !== "scale_to_sig",
      compactSpacing: inCircleMode && state.circleTrainingMode === "sig_to_scale",
      hideScaleNamesTitle: inCircleMode && state.circleTrainingMode === "sig_to_scale",
      sideBySide: inCircleMode && state.circleTrainingMode === "sig_to_scale"
    });
  }
  if (!inSongMode) {
    ui.setFretboardVisible(!(inScaleWriteMode || inCircleMode));
    state.songFretboardHidden = false;
    ui.setSongFretboardToggleLabel(false);
    return;
  }
  ui.setFretboardVisible(!state.songFretboardHidden);
  ui.setSongFretboardToggleLabel(state.songFretboardHidden);
}

function createDefaultSongBeats() {
  const pattern = ["E4", "F4", "G4", "A4"];
  return Array.from({ length: SONG_STEPS }, (_, idx) => ({
    note: idx % 4 === 0 ? pattern[Math.floor(idx / 4) % pattern.length] : "REST",
    duration: idx % 4 === 0 ? "q" : "0"
  }));
}

function cloneSongBeats(beats) {
  if (!Array.isArray(beats)) return [];
  return beats.map((entry) => ({ ...entry }));
}

function persistCurrentSongModeBeats(mode = state.trainerMode) {
  if (mode === "song-custom") {
    state.customSongBeats = cloneSongBeats(state.songBeats);
    return;
  }
  if (mode === "song-random") {
    state.randomSongBeats = cloneSongBeats(state.songBeats);
  }
}

function restoreSongModeBeats(mode) {
  if (mode === "song-custom") {
    if (!Array.isArray(state.customSongBeats) || state.customSongBeats.length !== SONG_STEPS) {
      state.customSongBeats = createDefaultSongBeats();
    }
    state.songBeats = normalizeSongBeats(cloneSongBeats(state.customSongBeats));
    return;
  }
  if (mode === "song-random") {
    if (Array.isArray(state.randomSongBeats) && state.randomSongBeats.length === RANDOM_SONG_STEPS) {
      state.songBeats = normalizeSongBeats(cloneSongBeats(state.randomSongBeats), RANDOM_SONG_STEPS);
    } else {
      randomizeSongBeats();
    }
  }
}

function ensureSongBeatsForCurrentMode() {
  if (!isSongMode()) return;
  const expectedSteps = isRandomSongMode() ? RANDOM_SONG_STEPS : SONG_STEPS;
  if (!Array.isArray(state.songBeats) || state.songBeats.length !== expectedSteps) {
    restoreSongModeBeats(state.trainerMode);
  }
}

function durationToBeats(duration) {
  if (duration === "w") return 4;
  if (duration === "h") return 2;
  if (duration === "qd") return 1.5;
  if (duration === "q") return 1;
  if (duration === "8") return 0.5;
  if (duration === "16") return 0.25;
  return 0;
}

function durationToUnits(duration) {
  return Math.round(durationToBeats(duration) * 4);
}

function unitsToDuration(units) {
  if (units >= 16) return "w";
  if (units >= 8) return "h";
  if (units >= 6) return "qd";
  if (units >= 4) return "q";
  if (units >= 2) return "8";
  if (units >= 1) return "16";
  return "0";
}

function canRepresentUnitsWithSlots(units, slots) {
  const memo = new Map();
  const options = [0, 1, 2, 4, 6, 8, 16];

  function dfs(remaining, remainingSlots) {
    const key = `${remaining}:${remainingSlots}`;
    if (memo.has(key)) return memo.get(key);

    if (remainingSlots === 0) return remaining === 0;
    if (remaining < 0) return false;

    for (const opt of options) {
      if (opt > remaining) continue;
      if (dfs(remaining - opt, remainingSlots - 1)) {
        memo.set(key, true);
        return true;
      }
    }
    memo.set(key, false);
    return false;
  }

  return dfs(units, slots);
}

function isSilentSongStep(step) {
  if (!step) return true;
  return step.duration === "0" || step.note === "REST";
}

function clampBarDurations(barIndex) {
  const start = barIndex * STEPS_PER_BAR;
  const barUnits = 16; // 4 beats in quarter-beat units (16th-note grid)
  let usedUnits = 0;

  for (let i = 0; i < STEPS_PER_BAR; i++) {
    const idx = start + i;
    const step = state.songBeats[idx];
    if (!step) continue;
    if (typeof step.note !== "string") {
      step.note = "REST";
    }

    const remainingUnits = barUnits - usedUnits;
    if (remainingUnits <= 0) {
      step.duration = "0";
      step.note = "REST";
      continue;
    }

    const preferredUnits = Math.max(0, Math.min(16, durationToUnits(step.duration)));
    const slotsLeftAfter = STEPS_PER_BAR - i - 1;
    const candidates = [0, 1, 2, 4, 6, 8, 16]
      .filter((u) => u <= remainingUnits)
      .filter((u) => canRepresentUnitsWithSlots(remainingUnits - u, slotsLeftAfter))
      .sort((a, b) => {
        const da = Math.abs(a - preferredUnits);
        const db = Math.abs(b - preferredUnits);
        if (da !== db) return da - db;
        return b - a;
      });

    const chosenUnits = candidates.length > 0 ? candidates[0] : 0;
    step.duration = unitsToDuration(chosenUnits);
    if (chosenUnits === 0) {
      step.note = "REST";
    }
    usedUnits += chosenUnits;
  }

  if (usedUnits !== barUnits) {
    const lastIdx = start + STEPS_PER_BAR - 1;
    const last = state.songBeats[lastIdx];
    if (last) {
      const missingUnits = barUnits - usedUnits;
      if (missingUnits > 0 && [1, 2, 4, 6, 8, 16].includes(missingUnits)) {
        last.duration = unitsToDuration(missingUnits);
      }
    }
  }
}

function clampAllBarsDurations() {
  const totalBars = Math.ceil((state.songBeats?.length || 0) / STEPS_PER_BAR);
  for (let bar = 0; bar < totalBars; bar++) {
    clampBarDurations(bar);
  }
}

function applyLockedStepDuration(stepIndex, nextNote, nextDuration) {
  const barIndex = Math.floor(stepIndex / STEPS_PER_BAR);
  const start = barIndex * STEPS_PER_BAR;
  const lockedStepInBar = stepIndex - start;
  const options = [0, 1, 2, 4, 6, 8, 16];

  const requestedUnits = Math.max(1, Math.min(16, durationToUnits(nextDuration)));
  let remainingUnits = 16 - requestedUnits;

  for (let i = 0; i < STEPS_PER_BAR; i++) {
    const idx = start + i;
    if (!state.songBeats[idx]) {
      state.songBeats[idx] = { note: "REST", duration: "0" };
    }
  }

  for (let i = 0; i < STEPS_PER_BAR; i++) {
    if (i === lockedStepInBar) continue;
    const idx = start + i;
    const step = state.songBeats[idx];
    const preferredUnits = Math.max(0, Math.min(16, durationToUnits(step.duration)));
    let slotsLeftAfter = 0;
    for (let j = i + 1; j < STEPS_PER_BAR; j++) {
      if (j !== lockedStepInBar) slotsLeftAfter += 1;
    }

    const candidates = options
      .filter((u) => u <= remainingUnits)
      .filter((u) => canRepresentUnitsWithSlots(remainingUnits - u, slotsLeftAfter))
      .sort((a, b) => {
        const da = Math.abs(a - preferredUnits);
        const db = Math.abs(b - preferredUnits);
        if (da !== db) return da - db;
        return b - a;
      });

    const chosenUnits = candidates.length > 0 ? candidates[0] : 0;
    step.duration = unitsToDuration(chosenUnits);
    if (chosenUnits === 0) step.note = "REST";
    remainingUnits -= chosenUnits;
  }

  const locked = state.songBeats[stepIndex];
  locked.note = nextNote;
  locked.duration = unitsToDuration(requestedUnits);
}

function advanceSongCursor() {
  while (
    state.songActiveBeat < state.songBeats.length &&
    isSilentSongStep(state.songBeats[state.songActiveBeat])
  ) {
    state.songActiveBeat += 1;
  }
}

function noteToFreq(note) {
  const midi = noteToMidi(note);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function centsOff(freq, targetFreq) {
  return 1200 * Math.log2(freq / targetFreq);
}

async function ensureEarAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!earAudioContext) {
    earAudioContext = new AudioCtx();
  }
  if (earAudioContext.state === "suspended") {
    try {
      await earAudioContext.resume();
    } catch (err) {
      console.warn("Ear audio resume failed:", err);
    }
  }
  return earAudioContext;
}

async function ensureEarPiano() {
  if (earPianoReady && earPianoSampler) return earPianoSampler;
  if (earPianoLoading) return earPianoLoading;
  const Tone = window.Tone;
  if (!Tone) return null;

  earPianoLoading = (async () => {
    try {
      await Tone.start();
      earPianoSampler = new Tone.Sampler({
        urls: {
          A0: "A0.mp3",
          C1: "C1.mp3",
          "D#1": "Ds1.mp3",
          "F#1": "Fs1.mp3",
          A1: "A1.mp3",
          C2: "C2.mp3",
          "D#2": "Ds2.mp3",
          "F#2": "Fs2.mp3",
          A2: "A2.mp3",
          C3: "C3.mp3",
          "D#3": "Ds3.mp3",
          "F#3": "Fs3.mp3",
          A3: "A3.mp3",
          C4: "C4.mp3",
          "D#4": "Ds4.mp3",
          "F#4": "Fs4.mp3",
          A4: "A4.mp3",
          C5: "C5.mp3",
          "D#5": "Ds5.mp3",
          "F#5": "Fs5.mp3",
          A5: "A5.mp3",
          C6: "C6.mp3",
          "D#6": "Ds6.mp3",
          "F#6": "Fs6.mp3",
          A6: "A6.mp3",
          C7: "C7.mp3",
          "D#7": "Ds7.mp3",
          "F#7": "Fs7.mp3",
          A7: "A7.mp3",
          C8: "C8.mp3"
        },
        release: 1.0,
        baseUrl: "https://tonejs.github.io/audio/salamander/"
      }).toDestination();
      await Tone.loaded();
      earPianoReady = true;
      return earPianoSampler;
    } catch (err) {
      console.warn("Piano sampler load failed, using synth fallback:", err);
      earPianoSampler = null;
      earPianoReady = false;
      return null;
    } finally {
      earPianoLoading = null;
    }
  })();

  return earPianoLoading;
}

async function ensureEarRhodes() {
  const Tone = window.Tone;
  if (!Tone) return null;
  if (earRhodesReady && earRhodesSampler) return earRhodesSampler;
  if (earRhodesLoading) return earRhodesLoading;
  try {
    await Tone.start();
  } catch (_) {
    // continue
  }
  earRhodesLoading = (async () => {
    try {
      earRhodesSampler = new Tone.Sampler({
        urls: {
          C2: "C2.wav",
          E2: "E2.wav",
          G2: "G2.wav",
          C3: "C3.wav",
          E3: "E3.wav",
          G3: "G3.wav",
          C4: "C4.wav",
          E4: "E4.wav",
          G4: "G4.wav",
          C5: "C5.wav"
        },
        release: 1.6,
        baseUrl: "./Assets/Samples/Rhodes/"
      }).toDestination();
      await Tone.loaded();
      earRhodesReady = true;
      return earRhodesSampler;
    } catch (err) {
      console.warn("Rhodes sampler unavailable, falling back to synth:", err);
      earRhodesSampler = null;
      earRhodesReady = false;
      return null;
    } finally {
      earRhodesLoading = null;
    }
  })();
  const rhodesSampler = await earRhodesLoading;
  if (rhodesSampler && earRhodesReady) return rhodesSampler;
  if (earRhodesSynth) return earRhodesSynth;
  earRhodesEq = new Tone.EQ3({
    low: -2,
    mid: 1.5,
    high: -5,
    lowFrequency: 220,
    highFrequency: 2600
  });
  earRhodesCompressor = new Tone.Compressor({
    threshold: -24,
    ratio: 3,
    attack: 0.01,
    release: 0.2
  });
  earRhodesChorus = new Tone.Chorus({
    frequency: 1.6,
    delayTime: 2.8,
    depth: 0.35,
    spread: 140,
    wet: 0.24
  });
  earRhodesReverb = new Tone.Reverb({
    decay: 2.1,
    preDelay: 0.018,
    wet: 0.15
  });
  if (typeof earRhodesChorus.start === "function") {
    earRhodesChorus.start();
  }
  if (typeof earRhodesReverb.generate === "function") {
    await earRhodesReverb.generate();
  }
  earRhodesSynth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2.75,
    modulationIndex: 7,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.012, decay: 0.55, sustain: 0.2, release: 1.4 },
    modulation: { type: "square" },
    modulationEnvelope: { attack: 0.01, decay: 0.25, sustain: 0.1, release: 0.9 },
    volume: -8
  });
  earRhodesSynth.chain(
    earRhodesEq,
    earRhodesCompressor,
    earRhodesChorus,
    earRhodesReverb,
    Tone.Destination
  );
  return earRhodesSynth;
}

async function ensureEarPad() {
  const Tone = window.Tone;
  if (!Tone) return null;
  if (earPadReady && earPadSampler) return earPadSampler;
  if (earPadLoading) return earPadLoading;
  try {
    await Tone.start();
  } catch (_) {
    // continue
  }
  earPadLoading = (async () => {
    try {
      earPadSampler = new Tone.Sampler({
        urls: {
          C2: "C2.wav",
          E2: "E2.wav",
          G2: "G2.wav",
          C3: "C3.wav",
          E3: "E3.wav",
          G3: "G3.wav",
          C4: "C4.wav",
          E4: "E4.wav",
          G4: "G4.wav",
          C5: "C5.wav"
        },
        release: 2.8,
        baseUrl: "./Assets/Samples/Pad/"
      }).toDestination();
      await Tone.loaded();
      earPadReady = true;
      return earPadSampler;
    } catch (err) {
      console.warn("Pad sampler unavailable, falling back to synth:", err);
      earPadSampler = null;
      earPadReady = false;
      return null;
    } finally {
      earPadLoading = null;
    }
  })();
  const padSampler = await earPadLoading;
  if (padSampler && earPadReady) return padSampler;
  if (earPadSynth) return earPadSynth;
  earPadFilter = new Tone.Filter({
    type: "lowpass",
    frequency: 1400,
    rolloff: -24,
    Q: 0.7
  }).toDestination();
  earPadSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.45, decay: 0.5, sustain: 0.65, release: 2.2 }
  });
  earPadSynth.connect(earPadFilter);
  return earPadSynth;
}

async function ensureSelectedToneInstrument() {
  const instrument = getSelectedPlaybackInstrument();
  if (instrument === "rhodes") return ensureEarRhodes();
  if (instrument === "pad") return ensureEarPad();
  return ensureEarPiano();
}

function stopEarPlayback() {
  earPlaybackNodes.forEach((node) => {
    try {
      node.stop();
    } catch (_) {
      // ignore already stopped oscillators
    }
    try {
      node.disconnect();
    } catch (_) {
      // ignore disconnect errors
    }
  });
  earPlaybackNodes = [];
  if (earPianoSampler && typeof earPianoSampler.releaseAll === "function") {
    try {
      earPianoSampler.releaseAll();
    } catch (_) {
      // ignore sampler release failures
    }
  }
  if (earRhodesSampler && typeof earRhodesSampler.releaseAll === "function") {
    try {
      earRhodesSampler.releaseAll();
    } catch (_) {
      // ignore release failures
    }
  }
  if (earPadSampler && typeof earPadSampler.releaseAll === "function") {
    try {
      earPadSampler.releaseAll();
    } catch (_) {
      // ignore release failures
    }
  }
  if (earRhodesSynth && typeof earRhodesSynth.releaseAll === "function") {
    try {
      earRhodesSynth.releaseAll();
    } catch (_) {
      // ignore release failures
    }
  }
  if (earPadSynth && typeof earPadSynth.releaseAll === "function") {
    try {
      earPadSynth.releaseAll();
    } catch (_) {
      // ignore release failures
    }
  }
}

function scheduleEarTone(ctx, midi, startAt, durationSec, peakGain = 0.14) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(midiToFreq(midi), startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(Math.max(0.0002, peakGain), startAt + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + durationSec + 0.02);
  earPlaybackNodes.push(osc);
  osc.onended = () => {
    earPlaybackNodes = earPlaybackNodes.filter((n) => n !== osc);
    try {
      osc.disconnect();
    } catch (_) {
      // noop
    }
  };
}

function buildTwoFiveOneChordMidis(rootMidi) {
  const low = noteToMidi("C3");
  const high = noteToMidi("B3");
  const wrapToCadenceRange = (midi) => {
    let m = midi;
    while (m < low) m += 12;
    while (m > high) m -= 12;
    return m;
  };
  const iRoot = wrapToCadenceRange(rootMidi);
  const iiRoot = wrapToCadenceRange(rootMidi + 2);
  const vRoot = wrapToCadenceRange(rootMidi + 7);

  return [
    // I major triad
    [iRoot, iRoot + 4, iRoot + 7],
    // ii minor triad
    [iiRoot, iiRoot + 3, iiRoot + 7],
    // V major triad
    [vRoot, vRoot + 4, vRoot + 7],
    // I major triad (resolution)
    [iRoot, iRoot + 4, iRoot + 7]
  ];
}

async function playEarPrompt(rootMidi, targetMidis, withCadence = false) {
  const sequence = Array.isArray(targetMidis) ? targetMidis : [targetMidis];
  if (!sequence || sequence.length === 0) return;
  const toneDuration = 0.5;
  const gap = 0.32;
  const cadenceChordDuration = 0.5;
  const cadenceGap = 0.14;
  const cadenceTailGap = 0.22;
  const cadenceCount = withCadence ? 4 : 0;
  const cadenceTime = withCadence
    ? (cadenceCount * cadenceChordDuration) + ((cadenceCount - 1) * cadenceGap) + cadenceTailGap
    : 0;
  const totalNotes = 1 + sequence.length; // root + targets
  const promptTime = totalNotes * toneDuration + (totalNotes - 1) * gap;
  const ignoreMs = Math.ceil((cadenceTime + promptTime + 0.22) * 1000);
  state.intervalEarIgnoreUntil = Date.now() + ignoreMs;

  const toneInstrument = await ensureSelectedToneInstrument();
  const selectedInstrument = getSelectedPlaybackInstrument();
  const toneReady = selectedInstrument === "piano" ? earPianoReady : true;
  if (toneInstrument && toneReady && window.Tone) {
    const Tone = window.Tone;
    const start = Tone.now() + 0.05;
    let promptStart = start;
    if (withCadence) {
      const chords = buildTwoFiveOneChordMidis(rootMidi);
      chords.forEach((chord, idx) => {
        const chordStart = start + idx * (cadenceChordDuration + cadenceGap);
        chord.forEach((midi, chordNoteIndex) => {
          const playbackMidi = applySampleOctaveShift(midi);
          const vel = clamp01(0.78 * relativeVelocityFactor(chordNoteIndex));
          toneInstrument.triggerAttackRelease(
            midiToQuestionNote(playbackMidi),
            cadenceChordDuration,
            chordStart + humanizeTimeSec(HUMANIZE_TIMING_BLOCK_SEC),
            vel
          );
        });
      });
      promptStart = start + cadenceTime;
    }
    const rootPlaybackMidi = applySampleOctaveShift(rootMidi);
    toneInstrument.triggerAttackRelease(
      midiToQuestionNote(rootPlaybackMidi),
      toneDuration,
      promptStart + humanizeTimeSec(HUMANIZE_TIMING_LINE_SEC),
      clamp01(0.95 * relativeVelocityFactor(0))
    );
    sequence.forEach((midi, idx) => {
      const playbackMidi = applySampleOctaveShift(midi);
      toneInstrument.triggerAttackRelease(
        midiToQuestionNote(playbackMidi),
        toneDuration,
        promptStart + (idx + 1) * (toneDuration + gap) + humanizeTimeSec(HUMANIZE_TIMING_LINE_SEC),
        clamp01(0.95 * relativeVelocityFactor(idx + 1))
      );
    });
    return;
  }

  const ctx = await ensureEarAudioContext();
  if (!ctx) return;
  stopEarPlayback();
  const start = ctx.currentTime + 0.05;
  let promptStart = start;
  if (withCadence) {
    const chords = buildTwoFiveOneChordMidis(rootMidi);
    chords.forEach((chord, idx) => {
      const chordStart = start + idx * (cadenceChordDuration + cadenceGap);
      chord.forEach((midi) => {
        scheduleEarTone(ctx, applySampleOctaveShift(midi), chordStart, cadenceChordDuration);
      });
    });
    promptStart = start + cadenceTime;
  }
  scheduleEarTone(ctx, applySampleOctaveShift(rootMidi), promptStart, toneDuration);
  sequence.forEach((midi, idx) => {
    scheduleEarTone(
      ctx,
      applySampleOctaveShift(midi),
      promptStart + (idx + 1) * (toneDuration + gap),
      toneDuration
    );
  });
}

async function playScalePrompt(scaleMidis) {
  if (!Array.isArray(scaleMidis) || scaleMidis.length === 0) return;
  const toneDuration = 0.44;
  const gap = 0.2;
  const toneInstrument = await ensureSelectedToneInstrument();
  const selectedInstrument = getSelectedPlaybackInstrument();
  const toneReady = selectedInstrument === "piano" ? earPianoReady : true;
  if (toneInstrument && toneReady && window.Tone) {
    const Tone = window.Tone;
    const start = Tone.now() + 0.05;
    scaleMidis.forEach((midi, idx) => {
      const playbackMidi = applySampleOctaveShift(midi);
      toneInstrument.triggerAttackRelease(
        midiToQuestionNote(playbackMidi),
        toneDuration,
        start + idx * (toneDuration + gap) + humanizeTimeSec(HUMANIZE_TIMING_LINE_SEC),
        clamp01(0.92 * relativeVelocityFactor(idx))
      );
    });
    return;
  }
  const ctx = await ensureEarAudioContext();
  if (!ctx) return;
  stopEarPlayback();
  const start = ctx.currentTime + 0.05;
  scaleMidis.forEach((midi, idx) => {
    scheduleEarTone(
      ctx,
      applySampleOctaveShift(midi),
      start + idx * (toneDuration + gap),
      toneDuration
    );
  });
}

async function playChordPrompt(chordMidis, playbackMode = "block", options = {}) {
  if (!Array.isArray(chordMidis) || chordMidis.length === 0) return;
  const arpeggio = playbackMode === "arpeggio";
  const toneDuration = arpeggio ? 0.62 : 2.3;
  const arpeggioGapSec = Math.max(0.04, (Number(state.chordArpeggioGapMs) || 200) / 1000);
  const stepGap = arpeggio ? arpeggioGapSec : 0;
  const volume = clamp01(Number(options.volume) || 1);
  const velocity = clamp01(Number(options.velocity) || 0.92);
  const preserveTail = Boolean(options.preserveTail);
  const baseVelocity = clamp01(velocity * volume);
  const toneInstrument = await ensureSelectedToneInstrument();
  const selectedInstrument = getSelectedPlaybackInstrument();
  const toneReady = selectedInstrument === "piano" ? earPianoReady : true;
  if (toneInstrument && toneReady && window.Tone) {
    const Tone = window.Tone;
    const start = Tone.now() + 0.05;
    chordMidis.forEach((midi, idx) => {
      const playbackMidi = applySampleOctaveShift(midi);
      const timingRange = arpeggio ? HUMANIZE_TIMING_ARP_SEC : HUMANIZE_TIMING_BLOCK_SEC;
      const startOffset = humanizeTimeSec(timingRange);
      const noteVelocity = clamp01(baseVelocity * relativeVelocityFactor(idx));
      toneInstrument.triggerAttackRelease(
        midiToQuestionNote(playbackMidi),
        toneDuration,
        start + idx * stepGap + startOffset,
        noteVelocity
      );
    });
    return;
  }
  const ctx = await ensureEarAudioContext();
  if (!ctx) return;
  if (!preserveTail) {
    stopEarPlayback();
  }
  const start = ctx.currentTime + 0.05;
  const fallbackGainBase = Math.max(0.01, 0.14 * baseVelocity);
  chordMidis.forEach((midi, idx) => {
    const playbackMidi = applySampleOctaveShift(midi);
    const timingRange = arpeggio ? HUMANIZE_TIMING_ARP_SEC : HUMANIZE_TIMING_BLOCK_SEC;
    const startOffset = humanizeTimeSec(timingRange);
    const gain = Math.max(0.01, fallbackGainBase * relativeVelocityFactor(idx));
    scheduleEarTone(ctx, playbackMidi, start + idx * stepGap + startOffset, toneDuration, gain);
  });
}

function playRandomSongBarCue(barIndex) {
  if (!isRandomSongMode()) return;
  if (!state.randomSongPlayBarChordsEnabled) return;
  const chordMidis = state.randomSongBarChordMidis?.[barIndex];
  if (!Array.isArray(chordMidis) || chordMidis.length === 0) return;
  playChordPrompt(chordMidis, "block", {
    volume: state.randomSongCueVolume,
    velocity: state.randomSongCueVelocity
  });
}

function startRandomSongBarCueLoop(barIndex, options = {}) {
  stopRandomSongBarCueLoop();
  if (!isRandomSongMode()) return;
  if (!state.randomSongPlayBarChordsEnabled) return;
  if (state.songActiveBeat >= state.songBeats.length) return;
  const chordMidis = state.randomSongBarChordMidis?.[barIndex];
  if (!Array.isArray(chordMidis) || chordMidis.length === 0) return;

  const token = state.randomSongBarCueToken;
  const initialDelayBeats = Math.max(0, Number(options.initialDelayBeats) || 0);
  const initialDelayMs = Math.round(getRandomSongCueRepeatMs() * initialDelayBeats);
  const sameChord = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
  let firstLoopHit = true;
  const playLoop = () => {
    if (token !== state.randomSongBarCueToken) return;
    if (!isRandomSongMode() || !state.randomSongPlayBarChordsEnabled) return;
    if (state.songActiveBeat >= state.songBeats.length) return;
    const currentBar = Math.floor(state.songActiveBeat / STEPS_PER_BAR);
    const currentBarChord = state.randomSongBarChordMidis?.[currentBar];
    if (!sameChord(currentBarChord, chordMidis)) return;
    if (firstLoopHit || state.randomSongCurrentCueBar !== currentBar) {
      state.randomSongCurrentCueBar = currentBar;
      state.randomSongCurrentCueStartedAtMs = Date.now();
      firstLoopHit = false;
    }
    state.randomSongCurrentCueLastPlayAtMs = Date.now();
    playChordPrompt(chordMidis, "block", {
      volume: state.randomSongCueVolume,
      velocity: state.randomSongCueVelocity,
      preserveTail: true
    });
    state.randomSongBarCueTimerId = setTimeout(playLoop, getRandomSongCueRepeatMs());
  };
  if (initialDelayMs > 0) {
    state.randomSongBarCueTimerId = setTimeout(playLoop, initialDelayMs);
    return;
  }
  playLoop();
}

function scheduleRandomSongBarCueBarTransition(previousBar, nextBar) {
  if (!isRandomSongMode()) return;
  if (!state.randomSongPlayBarChordsEnabled) return;
  if (state.songActiveBeat >= state.songBeats.length) return;

  if (state.randomSongBarCueTransitionTimerId !== null) {
    clearTimeout(state.randomSongBarCueTransitionTimerId);
  }
  const beatMs = getRandomSongCueRepeatMs();
  const minimumBeatsPerChord = 4;
  let waitMs = beatMs;
  if (state.randomSongCurrentCueBar === previousBar && state.randomSongCurrentCueStartedAtMs > 0) {
    const elapsedMs = Date.now() - state.randomSongCurrentCueStartedAtMs;
    const minHoldMs = beatMs * minimumBeatsPerChord;
    const remainingMs = Math.max(0, minHoldMs - elapsedMs);
    waitMs = Math.max(beatMs, remainingMs);
  }
  if (state.randomSongCurrentCueLastPlayAtMs > 0) {
    const sinceLastPlay = Date.now() - state.randomSongCurrentCueLastPlayAtMs;
    const untilNextBeat = Math.max(0, beatMs - sinceLastPlay);
    waitMs = Math.max(waitMs, untilNextBeat);
  }
  state.randomSongBarCueTransitionTimerId = setTimeout(() => {
    state.randomSongBarCueTransitionTimerId = null;
    if (!isRandomSongMode()) return;
    if (!state.randomSongPlayBarChordsEnabled) return;
    if (state.songActiveBeat >= state.songBeats.length) return;
    startRandomSongBarCueLoop(nextBar);
  }, waitMs);
}

function getQuestionStringIndex() {
  const selected = [...state.selectedStringIndexes].filter((s) => s >= 0 && s < tuning.length);
  if (selected.length === 0) return null;
  return selected[Math.floor(Math.random() * selected.length)];
}

function transposeMidisByOctave(midis, octaveShift) {
  const shift = 12 * octaveShift;
  return midis
    .map((midi) => midi + shift)
    .map((midi) => Math.max(21, Math.min(108, midi)));
}

function collectSongNoteCandidates() {
  if (state.selectedStringIndexes.size === 0) return [];
  const positions = collectCandidatePositions().filter((pos) => matchesClefFilter(pos.midi));
  if (positions.length > 0) return positions;

  // Fallback to all playable notes if current filters are too restrictive.
  const fallback = [];
  for (let s = 0; s < tuning.length; s++) {
    for (let f = 0; f <= 12; f++) {
      fallback.push({ s, f, ...noteAt(tuning[s].note, f) });
    }
  }
  return fallback;
}

function randomizeSongBeats() {
  const pool = collectSongNoteCandidates();
  if (pool.length === 0) return;
  const useCounterpoint = state.randomSongGenerationStyle === "counterpoint";
  const useJazz = state.randomSongGenerationStyle === "jazz";
  const strictCounterpoint = useCounterpoint && state.randomSongCounterpointStrictness === "strict";
  const midiPool = [...new Set(pool.map((p) => p.midi))].sort((a, b) => a - b);
  if (midiPool.length === 0) return;
  const songScalePool = SCALES.filter((scale) => ["major", "natural_minor"].includes(scale.key));
  const selectedScale = songScalePool[Math.floor(Math.random() * songScalePool.length)];
  const songRootMidi = midiPool[Math.floor(Math.random() * midiPool.length)];
  const rootSharp = midiToNote(songRootMidi, false);
  const rootFlat = midiToNote(songRootMidi, true);
  let preferFlatForScale = shouldPreferFlatForScale(songRootMidi, selectedScale.key);
  let rootLabel = preferFlatForScale ? rootFlat : rootSharp;
  if (state.questionSpellingMode === "flat") {
    rootLabel = rootFlat;
    preferFlatForScale = true;
  } else if (state.questionSpellingMode === "sharp") {
    rootLabel = rootSharp;
    preferFlatForScale = false;
  } else if (rootLabel.includes("b")) {
    preferFlatForScale = true;
  } else if (rootLabel.includes("#")) {
    preferFlatForScale = false;
  }

  const modeLabel = useJazz
    ? " • Jazz-Driven"
    : (useCounterpoint
      ? (strictCounterpoint ? " • Counterpoint (Strict)" : " • Counterpoint")
      : "");
  state.randomSongScaleLabel = `${rootLabel} ${selectedScale.label}${modeLabel}`;
  const scalePitchClasses = new Set(
    selectedScale.semitones.map((semi) => {
      const pc = (songRootMidi + semi) % 12;
      return pc < 0 ? pc + 12 : pc;
    })
  );
  const inScaleMidiPool = midiPool.filter((m) => scalePitchClasses.has(((m % 12) + 12) % 12));
  const outOfScaleMidiPool = midiPool.filter((m) => !scalePitchClasses.has(((m % 12) + 12) % 12));
  const scalePcsOrdered = selectedScale.semitones
    .slice(0, 7)
    .map((semi) => (((songRootMidi + semi) % 12) + 12) % 12);
  const degreeRootNames = selectedScale.semitones
    .slice(0, 7)
    .map((semi) => midiToNote(songRootMidi + semi, preferFlatForScale).replace(/\d+$/, ""));
  const pcToName = (pc) => (
    preferFlatForScale
      ? notesFlat[pc % 12]
      : notesSharp[pc % 12]
  );
  const degreeChords = scalePcsOrdered.map((rootPc, degreeIndex) => {
    const uniqueSorted = (intervals) => [...new Set(intervals)].sort((a, b) => a - b);
    const toPcSet = (intervals) => new Set(intervals.map((i) => ((rootPc + i) % 12 + 12) % 12));
    const createVariant = (label, intervals, family) => ({
      label,
      intervals: uniqueSorted(intervals),
      pcs: toPcSet(intervals),
      family,
      rootPc
    });
    const secondPc = scalePcsOrdered[(degreeIndex + 1) % 7];
    const thirdPc = scalePcsOrdered[(degreeIndex + 2) % 7];
    const fourthPc = scalePcsOrdered[(degreeIndex + 3) % 7];
    const fifthPc = scalePcsOrdered[(degreeIndex + 4) % 7];
    const sixthPc = scalePcsOrdered[(degreeIndex + 5) % 7];
    const seventhPc = scalePcsOrdered[(degreeIndex + 6) % 7];
    const i2 = (secondPc - rootPc + 12) % 12;
    const i3 = (thirdPc - rootPc + 12) % 12;
    const i4 = (fourthPc - rootPc + 12) % 12;
    const i5 = (fifthPc - rootPc + 12) % 12;
    const i6 = (sixthPc - rootPc + 12) % 12;
    const i7 = (seventhPc - rootPc + 12) % 12;
    let suffix = "";
    if (i3 === 3 && i5 === 7) suffix = "m";
    else if (i3 === 3 && i5 === 6) suffix = "dim";
    else if (i3 === 4 && i5 === 8) suffix = "aug";
    else if (!(i3 === 4 && i5 === 7)) suffix = "(alt)";

    let seventhSuffix = "";
    if (i3 === 4 && i5 === 7 && i7 === 11) seventhSuffix = "maj7";
    else if (i3 === 4 && i5 === 7 && i7 === 10) seventhSuffix = "7";
    else if (i3 === 3 && i5 === 7 && i7 === 10) seventhSuffix = "m7";
    else if (i3 === 3 && i5 === 6 && i7 === 10) seventhSuffix = "m7b5";
    else if (i3 === 3 && i5 === 6 && i7 === 9) seventhSuffix = "dim7";
    else if (i3 === 3 && i5 === 7 && i7 === 11) seventhSuffix = "m(maj7)";
    else seventhSuffix = "(alt7)";

    const rootName = degreeRootNames[degreeIndex];
    const triadLabel = `${rootName}${suffix}`;
    const seventhLabel = `${rootName}${seventhSuffix}`;

    const triads = [
      createVariant(triadLabel, [0, i3, i5], "triad")
    ];

    const sevenths = [
      createVariant(seventhLabel, [0, i3, i5, i7], "seventh")
    ];

    const sus = [
      createVariant(`${rootName}sus2`, [0, i2, i5], "sus"),
      createVariant(`${rootName}sus4`, [0, i4, i5], "sus")
    ];
    if (i7 === 10) {
      sus.push(createVariant(`${rootName}7sus4`, [0, i4, i5, i7], "sus"));
      sus.push(createVariant(`${rootName}9sus4`, [0, i4, i5, i7, i2 + 12], "sus"));
      sus.push(createVariant(`${rootName}13sus4`, [0, i4, i5, i7, i6 + 12], "sus"));
    }

    const extensions = [
      createVariant(`${triadLabel}(add9)`, [0, i3, i5, i2 + 12], "extension"),
      createVariant(`${seventhLabel}(9)`, [0, i3, i5, i7, i2 + 12], "extension"),
      createVariant(`${seventhLabel}(11)`, [0, i3, i5, i7, i4 + 12], "extension"),
      createVariant(`${seventhLabel}(13)`, [0, i3, i5, i7, i6 + 12], "extension")
    ];

    return { triads, sevenths, sus, extensions };
  });

  const c4 = noteToMidi("C4");
  const g3 = noteToMidi("G3");
  const e4 = noteToMidi("E4");
  const classifyClefWithContinuity = (midi, lastClef = null) => {
    if (midi < g3) return "bass";
    if (midi > e4) return "treble";
    if (lastClef) return lastClef;
    return midi >= c4 ? "treble" : "bass";
  };

  const pickNextMidiByPriority = (lastMidi, lastClef = null, sourcePool = midiPool) => {
    const activePool = Array.isArray(sourcePool) && sourcePool.length > 0 ? sourcePool : midiPool;
    if (lastMidi === null || lastMidi === undefined) {
      return activePool[Math.floor(Math.random() * activePool.length)];
    }

    const withinP5 = activePool.filter((m) => Math.abs(m - lastMidi) <= 7);
    const withinOctave = activePool.filter((m) => {
      const d = Math.abs(m - lastMidi);
      return d > 7 && d <= 12;
    });
    const withinTwoOctaves = activePool.filter((m) => {
      const d = Math.abs(m - lastMidi);
      return d > 12 && d <= 24;
    });

    const buckets = [
      { notes: withinP5, weight: 50 },
      { notes: withinOctave, weight: 35 },
      { notes: withinTwoOctaves, weight: 15 }
    ].filter((b) => b.notes.length > 0);

    if (buckets.length === 0) {
      return activePool[Math.floor(Math.random() * activePool.length)];
    }

    const totalWeight = buckets.reduce((sum, b) => sum + b.weight, 0);
    let roll = Math.random() * totalWeight;
    const pickFromBucket = (bucketNotes) => {
      if (!lastClef) {
        return bucketNotes[Math.floor(Math.random() * bucketNotes.length)];
      }
      const sameClef = bucketNotes.filter(
        (m) => classifyClefWithContinuity(m, lastClef) === lastClef
      );
      const otherClef = bucketNotes.filter(
        (m) => classifyClefWithContinuity(m, lastClef) !== lastClef
      );
      if (sameClef.length === 0 || otherClef.length === 0) {
        return bucketNotes[Math.floor(Math.random() * bucketNotes.length)];
      }
      const staySameClef = Math.random() < 0.7;
      const chosenList = staySameClef ? sameClef : otherClef;
      return chosenList[Math.floor(Math.random() * chosenList.length)];
    };
    for (const bucket of buckets) {
      roll -= bucket.weight;
      if (roll <= 0) {
        return pickFromBucket(bucket.notes);
      }
    }

    const fallback = buckets[buckets.length - 1].notes;
    return pickFromBucket(fallback);
  };
  const pickClosedVoicingPool = (sourcePool, referenceMidi = null) => {
    if (!Array.isArray(sourcePool) || sourcePool.length === 0) return [];
    const center = noteToMidi("C4");
    const ref = Number.isFinite(referenceMidi)
      ? referenceMidi
      : sourcePool.reduce((best, midi) => (
          Math.abs(midi - center) < Math.abs(best - center) ? midi : best
        ), sourcePool[0]);
    const closeM3 = sourcePool.filter((m) => Math.abs(m - ref) <= 4);
    if (closeM3.length >= 2) return closeM3;
    const closeP5 = sourcePool.filter((m) => Math.abs(m - ref) <= 7);
    if (closeP5.length >= 2) return closeP5;
    const closeOct = sourcePool.filter((m) => Math.abs(m - ref) <= 12);
    if (closeOct.length >= 2) return closeOct;
    return [...sourcePool]
      .sort((a, b) => Math.abs(a - ref) - Math.abs(b - ref))
      .slice(0, Math.min(6, sourcePool.length));
  };

  const weightedUnitChoices = [
    { units: 4, weight: 35 },    // quarter
    { units: 2, weight: 25 },    // 8th
    { units: 8, weight: 15 },    // half
    { units: 6, weight: 12.5 },  // dotted quarter
    { units: 1, weight: 7.5 },   // 16th
    { units: 16, weight: 5 }     // whole
  ];
  const weightedNoteRestChoices = [
    { isRest: false, weight: 80 },
    { isRest: true, weight: 20 }
  ];
  const DOWNBEAT_WEIGHT = 80;
  const UPBEAT_WEIGHT = 20;
  const pickWeightedUnits = (choices, weightKey = "weight") => {
    const total = choices.reduce((sum, c) => sum + (c[weightKey] ?? 0), 0);
    if (total <= 0) return choices[0]?.units ?? 1;
    let r = Math.random() * total;
    for (const c of choices) {
      r -= (c[weightKey] ?? 0);
      if (r <= 0) return c.units;
    }
    return choices[choices.length - 1]?.units ?? 1;
  };
  const pickWeightedIsRest = () => {
    const total = weightedNoteRestChoices.reduce((sum, c) => sum + c.weight, 0);
    if (total <= 0) return false;
    let r = Math.random() * total;
    for (const c of weightedNoteRestChoices) {
      r -= c.weight;
      if (r <= 0) return c.isRest;
    }
    return false;
  };
  state.songBeats = [];
  state.randomSongBarChords = [];
  state.randomSongBarChordMidis = [];
  let lastPitchedMidi = null;
  let lastPitchedClef = null;
  let activeTwoBarChord = null;
  let activeChordHoldUntilBar = -1;
  let currentDegreeIndex = null;
  let prevBarBassMidi = null;
  let lastStrongMidi = null;
  let lastStrongBassMidi = null;
  const pickWeightedChordVariant = (degree) => {
    const weightedFamilies = [
      { family: degree.triads, weight: useCounterpoint ? 42 : (useJazz ? 20 : 36) },
      { family: degree.sevenths, weight: useCounterpoint ? 34 : (useJazz ? 34 : 34) },
      { family: degree.sus, weight: useCounterpoint ? 10 : (useJazz ? 16 : 14) },
      { family: degree.extensions, weight: useCounterpoint ? 14 : (useJazz ? 30 : 16) }
    ].filter((f) => Array.isArray(f.family) && f.family.length > 0);
    if (weightedFamilies.length === 0) return null;
    let roll = Math.random() * weightedFamilies.reduce((sum, f) => sum + f.weight, 0);
    for (const item of weightedFamilies) {
      roll -= item.weight;
      if (roll <= 0) {
        return item.family[Math.floor(Math.random() * item.family.length)];
      }
    }
    const fallback = weightedFamilies[weightedFamilies.length - 1].family;
    return fallback[Math.floor(Math.random() * fallback.length)];
  };
  const createRootedChord = (rootPc, label, intervals) => {
    const uniqueIntervals = [...new Set(intervals)].sort((a, b) => a - b);
    return {
      label,
      intervals: uniqueIntervals,
      pcs: new Set(uniqueIntervals.map((semi) => ((rootPc + semi) % 12 + 12) % 12)),
      rootPc
    };
  };
  const pickNextJazzDegreeIndex = () => {
    if (currentDegreeIndex === null) {
      const starts = [1, 5, 0, 3];
      return starts[Math.floor(Math.random() * starts.length)];
    }
    const transitions = {
      0: [[5, 34], [1, 30], [3, 22], [4, 14]], // I -> vi / ii / IV / V
      1: [[4, 58], [5, 20], [0, 12], [3, 10]], // ii -> V
      2: [[5, 55], [1, 25], [4, 20]],           // iii -> vi / ii / V
      3: [[1, 44], [4, 34], [0, 22]],           // IV -> ii / V / I
      4: [[0, 62], [5, 24], [3, 14]],           // V -> I / vi / IV
      5: [[1, 50], [4, 30], [0, 20]],           // vi -> ii / V / I
      6: [[0, 70], [3, 30]]                     // vii -> I / IV
    };
    const options = transitions[currentDegreeIndex] || [[0, 100]];
    let roll = Math.random() * options.reduce((sum, [, w]) => sum + w, 0);
    for (const [degreeIndex, weight] of options) {
      roll -= weight;
      if (roll <= 0) return degreeIndex;
    }
    return options[options.length - 1][0];
  };
  const pickJazzChordVariant = (degreeIndex) => {
    const degree = degreeChords[degreeIndex];
    if (!degree) return null;

    // Most of the time: diatonic jazz colors on the chosen degree.
    if (Math.random() < 0.72) {
      return pickWeightedChordVariant(degree);
    }

    // Secondary dominant colors targeting the current degree.
    const targetRootPc = scalePcsOrdered[degreeIndex];
    const secondaryRootPc = (targetRootPc + 7) % 12;
    const secondaryRootName = pcToName(secondaryRootPc);
    const secondaryOptions = [
      createRootedChord(secondaryRootPc, `${secondaryRootName}7`, [0, 4, 7, 10]),
      createRootedChord(secondaryRootPc, `${secondaryRootName}7(b9)`, [0, 4, 7, 10, 13]),
      createRootedChord(secondaryRootPc, `${secondaryRootName}7(#9)`, [0, 4, 7, 10, 15]),
      createRootedChord(secondaryRootPc, `${secondaryRootName}13`, [0, 4, 7, 10, 21])
    ];

    // Occasional tritone substitution for the secondary dominant.
    if (Math.random() < 0.35) {
      const tritoneRootPc = (secondaryRootPc + 6) % 12;
      const tritoneName = pcToName(tritoneRootPc);
      secondaryOptions.push(
        createRootedChord(tritoneRootPc, `${tritoneName}7(alt)`, [0, 4, 7, 10, 13, 15])
      );
    }
    return secondaryOptions[Math.floor(Math.random() * secondaryOptions.length)];
  };
  const getTonicCadenceChord = () => {
    const tonic = degreeChords[0];
    if (!tonic) return null;
    if (useJazz) {
      const finals = [
        ...tonic.sevenths,
        ...tonic.extensions.filter((c) => /\(9\)|\(13\)|add9/.test(c.label))
      ];
      if (finals.length > 0) return finals[Math.floor(Math.random() * finals.length)];
    }
    if (useCounterpoint) {
      if (tonic.triads.length > 0) return tonic.triads[0];
    }
    return pickWeightedChordVariant(tonic) || tonic.triads[0] || tonic.sevenths[0] || null;
  };
  const getApproachCadenceChord = () => {
    if (useJazz) {
      const ii = degreeChords[1]?.sevenths?.[0] || degreeChords[1]?.triads?.[0] || null;
      const v = degreeChords[4]?.sevenths?.[0] || degreeChords[4]?.triads?.[0] || null;
      const vRootPc = scalePcsOrdered[4];
      const tritoneSub = Number.isInteger(vRootPc)
        ? createRootedChord((vRootPc + 6) % 12, `${pcToName((vRootPc + 6) % 12)}7(alt)`, [0, 4, 7, 10, 13, 15])
        : null;
      const pool = [ii, v, tritoneSub].filter(Boolean);
      if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    }
    if (useCounterpoint) {
      const v = degreeChords[4]?.triads?.[0] || degreeChords[4]?.sevenths?.[0] || null;
      const vii = degreeChords[6]?.triads?.[0] || null;
      const pool = [v, vii].filter(Boolean);
      if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    }
    const vChord = degreeChords[4];
    const ivChord = degreeChords[3];
    const pool = [
      vChord ? (pickWeightedChordVariant(vChord) || vChord.triads[0] || vChord.sevenths[0]) : null,
      ivChord ? (pickWeightedChordVariant(ivChord) || ivChord.triads[0] || ivChord.sevenths[0]) : null
    ].filter(Boolean);
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    return getTonicCadenceChord();
  };
  const pickNextDegreeIndex = () => {
    if (!useCounterpoint || currentDegreeIndex === null) {
      return Math.floor(Math.random() * degreeChords.length);
    }
    const deltas = strictCounterpoint ? [-1, 1, -2, 2, 4, -4] : [-2, -1, 1, 2, 4, -4];
    const weights = strictCounterpoint ? [36, 36, 12, 12, 2, 2] : [20, 30, 30, 10, 5, 5];
    let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
    let delta = deltas[0];
    for (let i = 0; i < deltas.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        delta = deltas[i];
        break;
      }
    }
    return (currentDegreeIndex + delta + degreeChords.length) % degreeChords.length;
  };
  const isPerfectInterval = (itv) => itv === 0 || itv === 7;
  const scoreCounterpointCandidate = (midi, context) => {
    const { bassMidi, lastMidi, isDownbeat, previousBassMidi } = context;
    const semitoneClass = ((midi - bassMidi) % 12 + 12) % 12;
    const strongConsonant = new Set([0, 3, 4, 7, 8, 9]);
    const weakAllowed = new Set([0, 2, 3, 4, 5, 7, 8, 9, 10]);
    let score = 0;
    if (isDownbeat) {
      score += strongConsonant.has(semitoneClass) ? (strictCounterpoint ? 5 : 4) : (strictCounterpoint ? -7 : -5);
    } else {
      score += weakAllowed.has(semitoneClass) ? (strictCounterpoint ? 1.2 : 1.6) : (strictCounterpoint ? -2.2 : -1.6);
    }
    if (lastMidi !== null) {
      const leap = Math.abs(midi - lastMidi);
      if (leap === 0) score -= strictCounterpoint ? 3.2 : 2.2;
      else if (leap <= 2) score += strictCounterpoint ? 3.1 : 2.4;
      else if (leap <= 5) score += strictCounterpoint ? 1.6 : 1.4;
      else if (leap <= 7) score += strictCounterpoint ? -0.4 : 0.4;
      else if (leap <= 12) score -= strictCounterpoint ? 2.1 : 0.9;
      else score -= strictCounterpoint ? 3.4 : 2.4;
    }
    if (lastMidi !== null && previousBassMidi !== null && previousBassMidi !== bassMidi) {
      const bassDir = Math.sign(bassMidi - previousBassMidi);
      const melodyDir = Math.sign(midi - lastMidi);
      if (bassDir !== 0 && melodyDir !== 0) {
        if (bassDir !== melodyDir) score += strictCounterpoint ? 1.8 : 1.2;
        else score -= strictCounterpoint ? 1.6 : 0.8;
      }
    }
    if (isDownbeat && lastStrongMidi !== null && lastStrongBassMidi !== null) {
      const prevInt = ((lastStrongMidi - lastStrongBassMidi) % 12 + 12) % 12;
      const nextInt = ((midi - bassMidi) % 12 + 12) % 12;
      const bassDir = Math.sign(bassMidi - lastStrongBassMidi);
      const melodyDir = Math.sign(midi - lastStrongMidi);
      if (
        isPerfectInterval(prevInt)
        && isPerfectInterval(nextInt)
        && bassDir !== 0
        && melodyDir !== 0
        && bassDir === melodyDir
      ) {
        score -= strictCounterpoint ? 7 : 4;
      }
    }
    return score;
  };
  const pickCounterpointMidi = (candidatePool, context) => {
    if (!Array.isArray(candidatePool) || candidatePool.length === 0) return null;
    const scored = candidatePool.map((m) => ({ midi: m, score: scoreCounterpointCandidate(m, context) }));
    scored.sort((a, b) => b.score - a.score);
    const width = Math.max(1, Math.min(6, Math.ceil(scored.length * 0.25)));
    const top = scored.slice(0, width);
    return top[Math.floor(Math.random() * top.length)].midi;
  };
  const lastBarIndex = RANDOM_SONG_BARS - 1;
  const cadenceApproachBar = Math.max(0, lastBarIndex - 1);
  for (let bar = 0; bar < RANDOM_SONG_BARS; bar++) {
    if (bar === lastBarIndex) {
      activeTwoBarChord = getTonicCadenceChord();
      activeChordHoldUntilBar = bar;
    } else if (bar === cadenceApproachBar) {
      activeTwoBarChord = getApproachCadenceChord();
      activeChordHoldUntilBar = bar;
    } else if (!activeTwoBarChord || bar > activeChordHoldUntilBar) {
      if (useJazz) {
        currentDegreeIndex = pickNextJazzDegreeIndex();
        activeTwoBarChord = pickJazzChordVariant(currentDegreeIndex) || degreeChords[currentDegreeIndex].sevenths[0];
        activeChordHoldUntilBar = bar + 1; // jazz stays mostly 2 bars
      } else if (useCounterpoint) {
        currentDegreeIndex = pickNextDegreeIndex();
        const degree = degreeChords[currentDegreeIndex];
        activeTwoBarChord = pickWeightedChordVariant(degree) || degree.triads[0];
        const holdBars = Math.random() < (strictCounterpoint ? 0.2 : 0.35) ? 2 : 1;
        activeChordHoldUntilBar = bar + holdBars - 1;
      } else {
        currentDegreeIndex = pickNextDegreeIndex();
        const degree = degreeChords[currentDegreeIndex];
        activeTwoBarChord = pickWeightedChordVariant(degree) || degree.triads[0];
        activeChordHoldUntilBar = bar + 1; // chord-driven stays mostly 2 bars
      }
    }
    const barChord = activeTwoBarChord;
    state.randomSongBarChords[bar] = barChord.label;
    const rootPc = Number.isInteger(barChord.rootPc) ? barChord.rootPc : 0;
    let cueRoot = 48 + (rootPc >= 0 ? rootPc : 0); // center around C3
    while (cueRoot > 59) cueRoot -= 12;
    while (cueRoot < 45) cueRoot += 12;
    const barBassMidi = cueRoot;
    state.randomSongBarChordMidis[bar] = barChord.intervals.map((semi) => cueRoot + semi);
    const chordSourcePool = useJazz ? midiPool : inScaleMidiPool;
    const inChordMidiPool = chordSourcePool.filter((m) => barChord.pcs.has(((m % 12) + 12) % 12));
    const inScaleNonChordMidiPool = inScaleMidiPool.filter((m) => !barChord.pcs.has(((m % 12) + 12) % 12));
    const pickPoolForBar = () => {
      if (useJazz) {
        const r = Math.random();
        if (r < 0.05 && outOfScaleMidiPool.length > 0) {
          return { pool: outOfScaleMidiPool, inScale: false };
        }
        if (r < 0.20 && inScaleNonChordMidiPool.length > 0) {
          return { pool: inScaleNonChordMidiPool, inScale: true };
        }
        if (inChordMidiPool.length > 0) {
          const closedPool = pickClosedVoicingPool(inChordMidiPool, lastPitchedMidi);
          if (closedPool.length > 0 && Math.random() < 0.88) {
            return { pool: closedPool, inScale: true };
          }
          return { pool: inChordMidiPool, inScale: true };
        }
        if (inScaleMidiPool.length > 0) {
          return { pool: inScaleMidiPool, inScale: true };
        }
        if (outOfScaleMidiPool.length > 0) {
          return { pool: outOfScaleMidiPool, inScale: false };
        }
        return { pool: midiPool, inScale: true };
      }

      const r = Math.random();
      if (r < 0.05 && outOfScaleMidiPool.length > 0) {
        return { pool: outOfScaleMidiPool, inScale: false };
      }
      if (r < 0.20 && inScaleNonChordMidiPool.length > 0) {
        return { pool: inScaleNonChordMidiPool, inScale: true };
      }
      if (inChordMidiPool.length > 0) {
        const closedPool = pickClosedVoicingPool(inChordMidiPool, lastPitchedMidi);
        if (closedPool.length > 0 && Math.random() < 0.85) {
          return { pool: closedPool, inScale: true };
        }
        return { pool: inChordMidiPool, inScale: true };
      }
      if (inScaleMidiPool.length > 0) {
        return { pool: inScaleMidiPool, inScale: true };
      }
      if (outOfScaleMidiPool.length > 0) {
        return { pool: outOfScaleMidiPool, inScale: false };
      }
      return { pool: midiPool, inScale: true };
    };

    let remainingUnits = 16;
    const barStepIndexes = [];
    let hasPitchedNote = false;
    for (let step = 0; step < STEPS_PER_BAR; step++) {
      if (remainingUnits <= 0) {
        state.songBeats.push({ note: "REST", duration: "0" });
        continue;
      }

      const slotsLeftAfter = STEPS_PER_BAR - step - 1;
      const cursorUnits = 16 - remainingUnits;
      const allowed = weightedUnitChoices
        .filter((c) => c.units <= remainingUnits)
        .filter((c) => canRepresentUnitsWithSlots(remainingUnits - c.units, slotsLeftAfter))
        .map((c) => {
          const nextStart = cursorUnits + c.units;
          const nextIsDownbeat = nextStart < 16 && (nextStart % 4 === 0);
          const beatBias = nextStart >= 16
            ? 1
            : (nextIsDownbeat ? (DOWNBEAT_WEIGHT / 100) : (UPBEAT_WEIGHT / 100));
          return {
            ...c,
            biasedWeight: c.weight * beatBias
          };
        });

      const pickUnits = allowed.length > 0
        ? pickWeightedUnits(allowed, "biasedWeight")
        : 1;
      const duration = unitsToDuration(pickUnits);
      const isRest = pickWeightedIsRest();
      const note = "REST";
      state.songBeats.push({
        note,
        duration
      });
      barStepIndexes.push(state.songBeats.length - 1);
      if (!isRest) {
        const notePick = pickPoolForBar();
        const isDownbeat = cursorUnits % 4 === 0;
        let midi;
        if (useCounterpoint) {
          const picked = pickCounterpointMidi(notePick.pool, {
            bassMidi: barBassMidi,
            lastMidi: lastPitchedMidi,
            isDownbeat,
            previousBassMidi: prevBarBassMidi
          });
          midi = picked !== null
            ? picked
            : pickNextMidiByPriority(lastPitchedMidi, lastPitchedClef, notePick.pool);
        } else {
          midi = pickNextMidiByPriority(lastPitchedMidi, lastPitchedClef, notePick.pool);
        }
        hasPitchedNote = true;
        const note = notePick.inScale
          ? midiToNote(midi, preferFlatForScale)
          : midiToQuestionNote(midi);
        state.songBeats[state.songBeats.length - 1].note = note;
        lastPitchedMidi = midi;
        lastPitchedClef = classifyClefWithContinuity(midi, lastPitchedClef);
        if (useCounterpoint && isDownbeat) {
          lastStrongMidi = midi;
          lastStrongBassMidi = barBassMidi;
        }
      }
      remainingUnits -= pickUnits;
    }

    // Never allow an all-rest bar in randomized mode.
    if (!hasPitchedNote) {
      const playableIdx = barStepIndexes.find((idx) => state.songBeats[idx]?.duration !== "0");
      if (playableIdx !== undefined) {
        const notePick = pickPoolForBar();
        const midi = useCounterpoint
          ? (
            pickCounterpointMidi(notePick.pool, {
              bassMidi: barBassMidi,
              lastMidi: lastPitchedMidi,
              isDownbeat: true,
              previousBassMidi: prevBarBassMidi
            })
            ?? pickNextMidiByPriority(lastPitchedMidi, lastPitchedClef, notePick.pool)
          )
          : pickNextMidiByPriority(lastPitchedMidi, lastPitchedClef, notePick.pool);
        state.songBeats[playableIdx].note = notePick.inScale
          ? midiToNote(midi, preferFlatForScale)
          : midiToQuestionNote(midi);
        lastPitchedMidi = midi;
        lastPitchedClef = classifyClefWithContinuity(midi, lastPitchedClef);
        if (useCounterpoint) {
          lastStrongMidi = midi;
          lastStrongBassMidi = barBassMidi;
        }
      }
    }
    prevBarBassMidi = barBassMidi;
  }
  clampAllBarsDurations();
  state.randomSongBeats = cloneSongBeats(state.songBeats);

  renderSongStepEditor();
}

function collectCandidatePositions() {
  const positions = [];
  const selected = [...state.selectedStringIndexes].filter((s) => s >= 0 && s < tuning.length);
  if (selected.length === 0) {
    return positions;
  }
  for (const s of selected) {
    for (let f = 0; f <= 12; f++) {
      positions.push({ s, f, ...noteAt(tuning[s].note, f) });
    }
  }
  return positions;
}

function findAllPositionsForMidi(targetMidi) {
  const matches = [];
  for (let s = 0; s < tuning.length; s++) {
    for (let f = 0; f <= 12; f++) {
      const pos = noteAt(tuning[s].note, f);
      if (pos.midi === targetMidi) {
        matches.push({ s, f });
      }
    }
  }
  return matches;
}

function findPreferredPositionForMidi(targetMidi) {
  const matches = findAllPositionsForMidi(targetMidi);
  return matches.length > 0 ? matches[0] : null;
}

function findPreferredScaleRootPositionForMidi(targetMidi) {
  const allowedStrings = new Set([2, 3, 4, 5]); // G, D, A, Low E
  const matches = findAllPositionsForMidi(targetMidi);
  const preferred = matches.find((m) => allowedStrings.has(m.s));
  return preferred || null;
}

function matchesClefFilter(midi) {
  const c4Midi = noteToMidi("C4");
  if (state.clefFilterMode === "bass") return midi < c4Midi;
  if (state.clefFilterMode === "treble") return midi >= c4Midi;
  return true;
}

function getSongNotePool() {
  const notes = [];
  for (let midi = 40; midi <= 76; midi++) {
    notes.push(midiToNote(midi, false));
  }
  return notes;
}

function normalizeSongBeats(rawBeats, targetSteps = SONG_STEPS) {
  if (!Array.isArray(rawBeats)) {
    if (targetSteps === RANDOM_SONG_STEPS) {
      return Array.from({ length: RANDOM_SONG_STEPS }, () => ({ note: "REST", duration: "0" }));
    }
    return createDefaultSongBeats();
  }

  const defaults = targetSteps === RANDOM_SONG_STEPS
    ? Array.from({ length: RANDOM_SONG_STEPS }, () => ({ note: "REST", duration: "0" }))
    : createDefaultSongBeats();
  const normalized = [];
  for (let i = 0; i < targetSteps; i++) {
    const entry = rawBeats[i];
    if (typeof entry === "string") {
      normalized.push({ note: entry, duration: "q" });
      continue;
    }
    if (entry && typeof entry.note === "string") {
      const duration = ALL_DURATION_VALUES.includes(entry.duration)
        ? entry.duration
        : "q";
      normalized.push({ note: entry.note, duration });
      continue;
    }
    normalized.push(defaults[i]);
  }
  state.songBeats = normalized;
  clampAllBarsDurations();
  return state.songBeats;
}

function formatSongStepLabel(index) {
  const bar = Math.floor(index / STEPS_PER_BAR) + 1;
  const step = (index % STEPS_PER_BAR) + 1;
  const beat = Math.floor((step - 1) / 4) + 1;
  const subdivision = ((step - 1) % 4) + 1;
  return `Bar ${bar} • Beat ${beat}.${subdivision}`;
}

function exactUnitsToDuration(units) {
  if (units === 16) return "w";
  if (units === 8) return "h";
  if (units === 6) return "qd";
  if (units === 4) return "q";
  if (units === 2) return "8";
  if (units === 1) return "16";
  return null;
}

function getEffectiveStepDurationForEditor(stepIndex) {
  const idx = Math.max(0, Math.min(SONG_STEPS - 1, stepIndex));
  const step = state.songBeats[idx];
  if (!step) return "q";
  if (step.note !== "REST" || step.duration === "0") {
    return step.duration;
  }

  const barStart = Math.floor(idx / STEPS_PER_BAR) * STEPS_PER_BAR;
  const barEnd = barStart + STEPS_PER_BAR - 1;

  let left = idx;
  while (left - 1 >= barStart) {
    const prev = state.songBeats[left - 1];
    if (!prev || prev.note !== "REST" || prev.duration === "0") break;
    left -= 1;
  }

  let right = idx;
  while (right + 1 <= barEnd) {
    const next = state.songBeats[right + 1];
    if (!next || next.note !== "REST" || next.duration === "0") break;
    right += 1;
  }

  let totalUnits = 0;
  for (let i = left; i <= right; i++) {
    totalUnits += durationToUnits(state.songBeats[i]?.duration);
  }
  return exactUnitsToDuration(totalUnits) || step.duration;
}

function getSongEditBarAndStepInBar() {
  const index = Math.max(0, Math.min(SONG_STEPS - 1, state.songEditStepIndex));
  return {
    barIndex: Math.floor(index / STEPS_PER_BAR),
    stepInBar: index % STEPS_PER_BAR
  };
}

function applySongEditBarAndStep(barIndex, stepInBar) {
  const b = Math.max(0, Math.min(SONG_BARS - 1, barIndex));
  const s = Math.max(0, Math.min(STEPS_PER_BAR - 1, stepInBar));
  state.songEditStepIndex = b * STEPS_PER_BAR + s;
}

function refreshSongEditSelectors() {
  const barSelect = ui.controls.songBarSelect;
  const beatSelect = ui.controls.songBeatSelect;
  if (!barSelect || !beatSelect) return;

  const { barIndex, stepInBar } = getSongEditBarAndStepInBar();

  barSelect.innerHTML = "";
  for (let bar = 0; bar < SONG_BARS; bar++) {
    const option = document.createElement("option");
    option.value = String(bar);
    option.textContent = `Bar ${bar + 1}`;
    barSelect.appendChild(option);
  }
  barSelect.value = String(barIndex);

  beatSelect.innerHTML = "";
  for (let step = 0; step < STEPS_PER_BAR; step++) {
    const beat = Math.floor(step / 4) + 1;
    const subdivision = (step % 4) + 1;
    const option = document.createElement("option");
    option.value = String(step);
    option.textContent = `${beat}.${subdivision}`;
    beatSelect.appendChild(option);
  }
  beatSelect.value = String(stepInBar);
}

function renderDurationGlyphIcon(container, { duration, isRest }) {
  container.innerHTML = "";
  const kind = isRest ? "rest" : "note";
  const filename = DURATION_ICON_FILES[kind][duration];
  if (!filename) {
    container.textContent = duration;
    return;
  }

  const img = document.createElement("img");
  img.className = "duration-img";
  if (!isRest && duration === "w") {
    img.classList.add("duration-img-whole-note");
  }
  img.alt = `${duration} ${kind}`;
  img.src = encodeURI(`Assets/SVG Note files/${filename}`);
  img.onerror = () => {
    container.textContent = duration;
  };
  container.appendChild(img);
}

function renderSongStepEditor() {
  refreshSongEditSelectors();

  const idx = Math.max(0, Math.min(SONG_STEPS - 1, state.songEditStepIndex));
  state.songEditStepIndex = idx;
  const step = state.songBeats[idx] || { note: "REST", duration: "q" };
  const effectiveDuration = getEffectiveStepDurationForEditor(idx);

  const noteSelect = ui.controls.songStepNoteSelect;
  const durationButtons = ui.controls.songStepDurationButtons;
  const restButtons = ui.controls.songStepRestButtons;
  const meta = ui.controls.songStepMeta;
  if (!noteSelect || !durationButtons || !restButtons || !meta) return;
  const noteOptions = ["REST", ...getSongNotePool()];

  noteSelect.innerHTML = "";
  noteOptions.forEach((note) => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note === "REST" ? "Rest" : note;
    noteSelect.appendChild(option);
  });
  noteSelect.value = noteOptions.includes(step.note) ? step.note : "REST";

  const defaultPitchedNote = () => {
    const current = noteSelect.value;
    if (current && current !== "REST") return current;
    return "E4";
  };

  const applyStepAndRefresh = () => {
    clampBarDurations(Math.floor(idx / STEPS_PER_BAR));
    persistCurrentSongModeBeats();
    renderSongStepEditor();
    if (isCustomSongMode()) {
      if (state.songCustomMode === "edit") {
        enterCustomEditView();
      } else {
        startSongTraining();
      }
    }
  };

  durationButtons.innerHTML = "";
  restButtons.innerHTML = "";

  SONG_DURATIONS.forEach((dur) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "duration-btn";
    btn.title = `${dur.label} Note`;
    const noteActive = step.note !== "REST" && effectiveDuration === dur.value;
    if (noteActive) {
      btn.classList.add("active");
    }
    const noteIconMount = document.createElement("span");
    noteIconMount.className = "duration-icon";
    btn.appendChild(noteIconMount);
    renderDurationGlyphIcon(noteIconMount, {
      duration: dur.value,
      isRest: false
    });
    btn.addEventListener("click", () => {
      applyLockedStepDuration(idx, defaultPitchedNote(), dur.value);
      applyStepAndRefresh();
    });
    durationButtons.appendChild(btn);

    const restBtn = document.createElement("button");
    restBtn.type = "button";
    restBtn.className = "duration-btn";
    restBtn.title = `${dur.label} Rest`;
    const restActive = step.note === "REST" && effectiveDuration === dur.value;
    if (restActive) {
      restBtn.classList.add("active");
    }
    const restIconMount = document.createElement("span");
    restIconMount.className = "duration-icon";
    restBtn.appendChild(restIconMount);
    renderDurationGlyphIcon(restIconMount, {
      duration: dur.value,
      isRest: true
    });
    restBtn.addEventListener("click", () => {
      applyLockedStepDuration(idx, "REST", dur.value);
      applyStepAndRefresh();
    });
    restButtons.appendChild(restBtn);
  });

  const durationLabel = SONG_DURATIONS.find((d) => d.value === effectiveDuration)?.label
    || (effectiveDuration === "0" ? "Auto (No beat)" : "Quarter");
  meta.textContent = `${formatSongStepLabel(idx)} • ${step.note} • ${durationLabel}`;
}

function nudgeSelectedSongStepNote(direction) {
  if (!isCustomSongMode() || state.songCustomMode !== "edit") return;
  const idx = state.songEditStepIndex;
  const step = state.songBeats[idx];
  if (!step || step.note === "REST") return;

  const pool = getSongNotePool();
  const pos = pool.indexOf(step.note);
  if (pos === -1) return;

  const next = Math.max(0, Math.min(pool.length - 1, pos + direction));
  if (next === pos) return;

  step.note = pool[next];
  clampBarDurations(Math.floor(idx / STEPS_PER_BAR));
  persistCurrentSongModeBeats();
  renderSongStepEditor();
  enterCustomEditView();
}

function setSelectedSongStepLetter(letter) {
  if (!isCustomSongMode() || state.songCustomMode !== "edit") return;
  const idx = state.songEditStepIndex;
  const step = state.songBeats[idx];
  if (!step) return;

  const pool = getSongNotePool();
  const effectiveDuration = getEffectiveStepDurationForEditor(idx);
  const targetDuration = effectiveDuration === "0" ? "q" : effectiveDuration;

  let nextNote = null;
  const m = step.note.match(/^([A-G])([#b]?)(\d)$/);
  if (m) {
    const octave = parseInt(m[3], 10);
    const accidental = m[2] || "";
    const candidates = [
      `${letter}${accidental}${octave}`,
      `${letter}${octave}`,
      `${letter}${accidental}${octave - 1}`,
      `${letter}${octave - 1}`,
      `${letter}${accidental}${octave + 1}`,
      `${letter}${octave + 1}`
    ];
    nextNote = candidates.find((n) => pool.includes(n)) || null;
  } else {
    // When a rest is selected, default to a practical middle-register note.
    const restCandidates = [
      `${letter}4`,
      `${letter}3`,
      `${letter}5`
    ];
    nextNote = restCandidates.find((n) => pool.includes(n)) || null;
  }

  if (!nextNote) {
    nextNote = pool.find((n) => n.startsWith(`${letter}`));
  }
  if (!nextNote) return;

  applyLockedStepDuration(idx, nextNote, targetDuration);
  persistCurrentSongModeBeats();
  renderSongStepEditor();
  enterCustomEditView();
}

function moveSelectedSongStep(direction) {
  if (!isCustomSongMode() || state.songCustomMode !== "edit") return;
  const start = state.songEditStepIndex;
  let idx = start + direction;
  while (idx >= 0 && idx < SONG_STEPS) {
    const step = state.songBeats[idx];
    if (step && step.duration !== "0") {
      state.songEditStepIndex = idx;
      enterCustomEditView();
      return;
    }
    idx += direction;
  }
}

function refreshCustomSongModeUI() {
  const isEdit = isCustomSongMode() && state.songCustomMode === "edit";
  ui.setSongStepEditorVisible(isEdit);
}

function enterCustomEditView(preserveView = false) {
  refreshCustomSongModeUI();
  if (!preserveView) {
    state.songViewStartStep = null;
  }
  if (!isCustomSongMode() || state.songCustomMode !== "edit") return;
  ensureSongBeatsForCurrentMode();
  state.currentTarget = null;
  renderSongStepEditor();
  ui.clearCorrectFret();
  ui.clearActiveString();
  ui.clearIntervalSource();
  const current = state.songBeats[state.songEditStepIndex];
  const label = formatSongStepLabel(state.songEditStepIndex);
  ui.setTarget(current?.note || "REST", `${label} • Edit mode`);
  ui.renderSongNotation(
    state.songBeats,
    state.songEditStepIndex,
    noteToMidi,
    state.songViewStartStep,
    {
      barChordLabels: isRandomSongMode() ? state.randomSongBarChords : null
    }
  );
  ui.setMessage("Edit the selected step.");
  refreshModeChrome();
  refreshSongBrowseState();
}

function loadSongsFromStorage() {
  try {
    const raw = localStorage.getItem(SONG_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveSongsToStorage(songs) {
  localStorage.setItem(SONG_STORAGE_KEY, JSON.stringify(songs));
}

function refreshSongLoadSelect() {
  const songs = loadSongsFromStorage();
  const names = Object.keys(songs).sort();
  const select = ui.controls.songLoadSelect;
  select.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Saved songs";
  select.appendChild(placeholder);

  names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function renderSongTargetState() {
  advanceSongCursor();
  if (state.songActiveBeat >= state.songBeats.length) {
    state.questionAnswered = true;
    ui.setMessage("🎉 Song complete!");
    ui.setTarget("Done", "Song complete");
    ui.renderSongNotation(
      state.songBeats,
      -1,
      noteToMidi,
      state.songViewStartStep,
      {
        barChordLabels: isRandomSongMode() ? state.randomSongBarChords : null
      }
    );
    refreshSongBrowseState();
    return;
  }

  const beat = state.songActiveBeat;
  const current = state.songBeats[beat];
  const currentNote = current?.note;
  const barIndex = Math.floor(beat / STEPS_PER_BAR) + 1;
  const stepInBar = (beat % STEPS_PER_BAR) + 1;
  const beatIndex = Math.floor((stepInBar - 1) / 4) + 1;
  const sub = ((stepInBar - 1) % 4) + 1;
  const durationLabel = SONG_DURATIONS.find((d) => d.value === (current?.duration || "q"))?.label || "Quarter";
  const scalePrefix = isRandomSongMode() && state.randomSongScaleLabel
    ? `${state.randomSongScaleLabel} • `
    : "";
  const totalBars = Math.ceil((state.songBeats?.length || 0) / STEPS_PER_BAR);

  ui.setTarget(
    currentNote ?? "—",
    `${scalePrefix}Bar ${barIndex}/${totalBars} • Beat ${beatIndex}.${sub} • ${durationLabel}`
  );
  ui.renderSongNotation(
    state.songBeats,
    beat,
    noteToMidi,
    state.songViewStartStep,
    {
      barChordLabels: isRandomSongMode() ? state.randomSongBarChords : null
    }
  );
  refreshSongBrowseState();
}

function startSongTraining() {
  stopRandomSongBarCueLoop();
  ensureSongBeatsForCurrentMode();
  state.currentTarget = null;
  state.songActiveBeat = 0;
  state.songViewStartStep = null;
  state.songCorrectPos = null;
  state.songLastAcceptedMidi = null;
  state.songPrevInputLevel = 0;
  armSongAttackGate();
  state.questionAnswered = false;
  ui.clearCorrectFret();
  ui.clearIntervalSource();
  ui.clearActiveString();
  ui.clearMessage();
  AudioEngine.resetStability();
  AudioEngine.setStringProfile("all");
  AudioEngine.setActiveString(null);
  clampAllBarsDurations();
  refreshModeChrome();
  renderSongTargetState();
  startRandomSongBarCueLoop(0);
}

function getSongViewWindowSize() {
  return STEPS_PER_BAR * 4;
}

function getCurrentSongViewStart() {
  const windowSize = getSongViewWindowSize();
  if (Number.isInteger(state.songViewStartStep)) {
    return Math.max(0, state.songViewStartStep);
  }
  if (state.songActiveBeat >= 0) {
    return Math.floor(state.songActiveBeat / windowSize) * windowSize;
  }
  return 0;
}

function refreshSongBrowseState() {
  const visible = isSongBrowseMode();
  ui.setSongBrowseVisible(visible);
  if (!visible) {
    ui.setSongBrowseLabel("");
    return;
  }
  const windowSize = getSongViewWindowSize();
  const start = getCurrentSongViewStart();
  const startBar = Math.floor(start / STEPS_PER_BAR) + 1;
  const totalBars = Math.ceil((state.songBeats?.length || 0) / STEPS_PER_BAR);
  const endBar = Math.min(totalBars, startBar + 3);
  const activeBar = state.songActiveBeat >= 0
    ? Math.floor(state.songActiveBeat / STEPS_PER_BAR) + 1
    : 1;
  ui.setSongBrowseLabel(`Bars ${startBar}-${endBar} • Current ${activeBar}`);
}

function shiftSongViewWindow(direction) {
  const windowSize = getSongViewWindowSize();
  const maxStart = Math.max(0, state.songBeats.length - windowSize);
  const current = getCurrentSongViewStart();
  state.songViewStartStep = Math.max(0, Math.min(maxStart, current + direction * windowSize));
  if (isCustomSongMode() && state.songCustomMode === "edit") {
    // In custom edit mode, browsing bars selects the first step of the viewed block.
    state.songEditStepIndex = state.songViewStartStep;
    enterCustomEditView(true);
    return;
  }
  renderSongTargetState();
}

function resetSongViewToCurrent() {
  state.songViewStartStep = null;
  renderSongTargetState();
}

function completeSongStep(correctPos = null) {
  const previousBar = Math.floor(state.songActiveBeat / STEPS_PER_BAR);
  ui.clearCorrectFret();
  state.songCorrectPos = correctPos;
  if (state.songCorrectPos) {
    ui.highlightCorrectFret(state.songCorrectPos);
  }

  state.songActiveBeat += 1;
  advanceSongCursor();
  if (state.songActiveBeat >= state.songBeats.length) {
    stopRandomSongBarCueLoop();
    state.questionAnswered = true;
    ui.setMessage("🎉 Song complete!");
    ui.setTarget("Done", "Song complete");
    ui.renderSongNotation(state.songBeats, -1, noteToMidi, null, {
      barChordLabels: isRandomSongMode() ? state.randomSongBarChords : null
    });
    armSongAttackGate();
    return;
  }

  renderSongTargetState();
  const nextBar = Math.floor(state.songActiveBeat / STEPS_PER_BAR);
  if (nextBar !== previousBar) {
    const prevChord = state.randomSongBarChordMidis?.[previousBar];
    const nextChord = state.randomSongBarChordMidis?.[nextBar];
    const changed = Array.isArray(prevChord) && Array.isArray(nextChord)
      ? (prevChord.length !== nextChord.length || prevChord.some((m, i) => m !== nextChord[i]))
      : true;
    if (changed) {
      scheduleRandomSongBarCueBarTransition(previousBar, nextBar);
    }
  }
  armSongAttackGate();
}

function setExpectedRangeForString(stringIndex) {
  const map = ["highE", "B", "G", "D", "A", "lowE"];
  AudioEngine.setStringProfile(map[stringIndex]);
}

function syncBoard() {
  if (isSongMode()) {
    if (state.songCorrectPos) ui.highlightCorrectFret(state.songCorrectPos);
    return;
  }
  if (isCircleMode()) {
    return;
  }
  if (!state.currentTarget) return;
  if (isScaleMode() && state.currentTarget.mode === "scale") {
    if (state.currentTarget.rootPos) {
      ui.highlightIntervalSource(state.currentTarget.rootPos);
    }
    if (state.currentTarget.correctPos) {
      ui.highlightCorrectFret(state.currentTarget.correctPos);
    }
    return;
  }
  if (isScaleMode() && state.currentTarget.mode === "scale-write") {
    if (state.currentTarget.rootPos) {
      ui.highlightIntervalSource(state.currentTarget.rootPos);
    }
    return;
  }
  if (isChordMode() && state.currentTarget?.mode === "chord-ear") {
    if (state.currentTarget.rootPos) {
      ui.highlightIntervalSource(state.currentTarget.rootPos);
    }
    return;
  }
  if (state.trainerMode === "interval") {
    ui.highlightIntervalSource(state.currentTarget.rootPos);
    if (state.questionAnswered && state.currentTarget.correctPos) {
      ui.highlightCorrectFret(state.currentTarget.correctPos);
    }
    return;
  }

  ui.highlightActiveString(state.currentTarget.s);
  if (state.questionAnswered) ui.highlightCorrectFret(state.currentTarget);
}

function newQuestion() {
  stopRandomSongBarCueLoop();
  state.questionAnswered = false;
  AudioEngine.resetStability();
  ui.clearCorrectFret();
  ui.clearActiveString();
  ui.clearIntervalSource();
  ui.clearMessage();
  stopEarPlayback();

  if (isSongMode()) {
    state.currentTarget = null;
    refreshSongBrowseState();
    refreshModeChrome();
    ensureSongBeatsForCurrentMode();
    if (isRandomSongMode()) {
      randomizeSongBeats();
      startSongTraining();
      return;
    }
    if (state.songCustomMode === "edit") {
      enterCustomEditView();
      return;
    }
    startSongTraining();
    return;
  }

  if (state.trainerMode === "interval") {
    refreshModeChrome();
    return newIntervalQuestion();
  }
  if (isScaleMode()) {
    refreshModeChrome();
    return newScaleQuestion();
  }
  if (isChordMode()) {
    refreshModeChrome();
    return newChordQuestion();
  }
  if (isCircleMode()) {
    refreshModeChrome();
    return newCircleQuestion();
  }

  AudioEngine.setStringProfile("all");
  let target = null;
  let s = 0;
  let f = 0;
  const maxTries = 200;

  for (let i = 0; i < maxTries; i++) {
    s = getQuestionStringIndex();
    if (s === null) {
      ui.setMessage("Select at least one string.");
      return;
    }
    f = Math.floor(Math.random() * 13);
    target = noteAt(tuning[s].note, f);
    if (matchesClefFilter(target.midi)) break;
  }

  // Defensive fallback when filters are too restrictive in future changes.
  if (!target || !matchesClefFilter(target.midi)) {
    s = getQuestionStringIndex();
    if (s === null) {
      ui.setMessage("Select at least one string.");
      return;
    }
    f = Math.floor(Math.random() * 13);
    target = noteAt(tuning[s].note, f);
  }

  state.currentTarget = { s, f, n: target.note, midi: target.midi };

  setExpectedRangeForString(s);
  AudioEngine.setActiveString(s);

  ui.setTarget(target.note, tuning[s].name);
  ui.highlightActiveString(s);
  ui.renderNotation(target.note, noteToMidi);
  refreshModeChrome();
}

function getSelectedScalePool() {
  if (state.scaleTypeMode === "mixed") {
    return SCALES.filter((scale) => {
      if (scale.family === "melodic_minor") return state.scaleIncludeMelodicMinorModes;
      if (scale.family === "harmonic_minor") return state.scaleIncludeHarmonicMinorModes;
      return true;
    });
  }
  const match = SCALES.find((s) => s.key === state.scaleTypeMode);
  return match ? [match] : SCALES;
}

function getCircleSignatureById(id) {
  return CIRCLE_FIFTHS_SIGNATURES.find((sig) => sig.id === id) || null;
}

function circleAccidentalGlyph(count) {
  const n = Math.abs(Number(count) || 0);
  if (n <= 0) return "";
  const sign = count > 0 ? "♯" : "♭";
  return sign.repeat(Math.min(7, n));
}

function getCircleKeySignatureAssetPath(signatureId) {
  const candidates = {
    sig_0: ["sig_0.svg"],
    sig_1s: ["sig_1s.svg"],
    sig_2s: ["sig_2s.svg"],
    sig_3s: ["sig_3s.svg"],
    sig_4s: ["sig_4s.svg"],
    sig_5s: ["sig_5s.svg"],
    sig_6s: ["sig_6s.svg"],
    sig_1b: ["sig_1b.svg"],
    sig_2b: ["sib_2b.svg"],
    sig_3b: ["sig_3b.svg"],
    sig_4b: ["sig_4b.svg"],
    sig_5b: ["sig_5b.svg"],
    sig_6b: ["sig_6b.svg"]
  }[signatureId] || [];
  return candidates.map((name) => encodeURI(`Assets/SVG Key Signatures/${name}`));
}

function getCircleQuestionCandidates() {
  const qualityMode = state.circleQualityMode;
  const candidates = [];
  CIRCLE_FIFTHS_SIGNATURES.forEach((sig) => {
    if (qualityMode !== "minor") {
      candidates.push({
        signatureId: sig.id,
        quality: "major",
        scaleKey: sig.major.short,
        scaleLabel: sig.major.label,
        vfKey: sig.major.vfKey
      });
    }
    if (qualityMode !== "major") {
      candidates.push({
        signatureId: sig.id,
        quality: "minor",
        scaleKey: sig.minor.short,
        scaleLabel: sig.minor.label,
        vfKey: sig.minor.vfKey
      });
    }
  });
  return candidates;
}

function getCircleAccidentalItems() {
  return CIRCLE_DISPLAY_WEDGES
    .map((wedge) => {
      const signatures = wedge.signatureIds
        .map((id) => getCircleSignatureById(id))
        .filter(Boolean);
      if (signatures.length === 0) return null;
      const primary = signatures[0];
      const glyph = signatures
        .map((sig) => circleAccidentalGlyph(sig.accidentalCount))
        .filter(Boolean)
        .join("/");
      const hint = signatures
        .map((sig) => {
          if (sig.accidentals.length) {
            return `${sig.accidentals.join(" ")} (${sig.major.label} / ${sig.minor.label})`;
          }
          return `No accidentals (${sig.major.label} / ${sig.minor.label})`;
        })
        .join(" or ");
      return {
        key: wedge.id,
        answerKeys: signatures.map((sig) => sig.id),
        answerKey: primary.id,
        label: "",
        ring: "outer",
        style: "accidental",
        glyph,
        glyphSrcs: signatures
          .flatMap((sig) => getCircleKeySignatureAssetPath(sig.id))
          .filter(Boolean),
        hint
      };
    })
    .filter(Boolean);
}

function getCircleScaleItems() {
  const items = [];
  CIRCLE_DISPLAY_WEDGES
    .forEach((wedge) => {
      const signatures = wedge.signatureIds
        .map((id) => getCircleSignatureById(id))
        .filter(Boolean);
      if (signatures.length === 0) return;
      const majorLabel = signatures.map((sig) => sig.major.short).join("/");
      const minorLabel = signatures.map((sig) => sig.minor.short).join("/");
      items.push({
        key: `maj:${wedge.id}`,
        answerKeys: signatures.map((sig) => sig.major.short),
        answerKey: signatures[0].major.short,
        label: majorLabel,
        quality: "major",
        ring: "outer",
        style: "major",
        hint: signatures.map((sig) => sig.major.label).join(" / ")
      });
      items.push({
        key: `min:${wedge.id}`,
        answerKeys: signatures.map((sig) => sig.minor.short),
        answerKey: signatures[0].minor.short,
        label: minorLabel,
        quality: "minor",
        ring: "inner",
        style: "minor",
        hint: signatures.map((sig) => sig.minor.label).join(" / ")
      });
    });
  return items;
}

function renderCircleFifthsQuestion() {
  if (!isCircleMode() || !state.currentTarget || state.currentTarget.mode !== "circle") return;
  if (typeof ui.renderCircleFifths !== "function") return;

  const target = state.currentTarget;
  if (typeof ui.setCircleNotationLayout === "function") {
    ui.setCircleNotationLayout({
      showNotation: target.trainingMode !== "scale_to_sig",
      compactSpacing: target.trainingMode === "sig_to_scale",
      hideScaleNamesTitle: target.trainingMode === "sig_to_scale",
      sideBySide: target.trainingMode === "sig_to_scale"
    });
  }
  if (typeof ui.setCircleFifthsPanelsVisible === "function") {
    const showAccidentals = target.trainingMode === "scale_to_sig";
    const showScaleNames = target.trainingMode === "sig_to_scale";
    ui.setCircleFifthsPanelsVisible(showAccidentals, showScaleNames);
  }
  const accidentalItems = getCircleAccidentalItems();
  const scaleItems = getCircleScaleItems();

  ui.renderCircleFifths(
    {
      accidentals: accidentalItems,
      scales: scaleItems
    },
    {
      onPickAccidental: (item) => {
        if (!state.currentTarget || state.currentTarget.mode !== "circle") return;
        if (state.questionAnswered) return;
        state.currentTarget.selectedAccidentalKey = item.key;
        if (state.currentTarget.trainingMode !== "scale_to_sig") {
          const sig = getCircleSignatureById(item.key);
          const list = sig?.accidentals?.length ? sig.accidentals.join(" ") : "None";
          ui.setMessage(`Accidentals: ${list}`);
          renderCircleFifthsQuestion();
          return;
        }
        const answerKeys = Array.isArray(item.answerKeys) ? item.answerKeys : [item.answerKey || item.key];
        const correct = answerKeys.includes(state.currentTarget.answerSignatureId);
        if (correct) {
          state.questionAnswered = true;
          state.currentTarget.correctAccidentalKey = item.key;
          ui.setMessage("🎯 Correct!");
          renderCircleFifthsQuestion();
          setTimeout(() => newQuestion(), 900);
          return;
        }
        ui.setMessage("❌ Not this accidental set");
        renderCircleFifthsQuestion();
      },
      onPickScale: (item) => {
        if (!state.currentTarget || state.currentTarget.mode !== "circle") return;
        if (state.questionAnswered) return;
        state.currentTarget.selectedScaleKey = item.key;
        if (state.currentTarget.trainingMode !== "sig_to_scale") {
          ui.setMessage(`Scale: ${item.hint || item.label}`);
          renderCircleFifthsQuestion();
          return;
        }
        const answerKeys = Array.isArray(item.answerKeys) ? item.answerKeys : [item.answerKey || item.key];
        const correct = answerKeys.includes(state.currentTarget.answerScaleKey);
        if (correct) {
          state.questionAnswered = true;
          state.currentTarget.correctScaleKey = item.key;
          ui.setMessage("🎯 Correct!");
          renderCircleFifthsQuestion();
          setTimeout(() => newQuestion(), 900);
          return;
        }
        ui.setMessage("❌ Try another scale");
        renderCircleFifthsQuestion();
      }
    },
    {
      selectedAccidentalKey: target.selectedAccidentalKey || null,
      selectedScaleKey: target.selectedScaleKey || null,
      correctAccidentalKey: target.correctAccidentalKey || null,
      correctScaleKey: target.correctScaleKey || null,
      accidentalDimmedKeys: new Set(),
      scaleDimmedKeys: new Set()
    }
  );
}

function newCircleQuestion() {
  const candidates = getCircleQuestionCandidates();
  if (candidates.length === 0) {
    ui.setMessage("No circle-of-fifths candidates for this scope.");
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const signature = getCircleSignatureById(pick.signatureId);
  if (!signature) {
    ui.setMessage("Circle-of-fifths data unavailable.");
    return;
  }

  state.currentTarget = {
    mode: "circle",
    trainingMode: state.circleTrainingMode,
    quality: pick.quality,
    answerScaleKey: pick.scaleKey,
    answerScaleLabel: pick.scaleLabel,
    answerSignatureId: pick.signatureId,
    keySignature: pick.vfKey,
    selectedScaleKey: null,
    selectedAccidentalKey: null,
    correctScaleKey: null,
    correctAccidentalKey: null
  };

  if (state.circleTrainingMode === "sig_to_scale") {
    ui.setTarget("Key Signature", `${pick.quality === "major" ? "Major" : "Minor"} — pick scale`);
    if (typeof ui.renderKeySignatureNotation === "function") {
      ui.renderKeySignatureNotation(pick.vfKey);
    }
    ui.setMessage("Select the matching scale name.");
  } else {
    ui.setTarget(pick.scaleLabel, "Pick its accidentals");
    if (typeof ui.renderKeySignatureNotation === "function") {
      ui.renderKeySignatureNotation("C");
    }
    ui.setMessage("Select the accidental set for this scale.");
  }

  renderCircleFifthsQuestion();
}

function getSelectedChordPool() {
  if (state.chordTypeMode === "mixed") return CHORDS;
  return CHORDS.filter((chord) => chord.group === state.chordTypeMode);
}

function refreshScaleModeUI() {
  const inScaleMode = isScaleMode();
  const isEar = isScaleMode() && state.scaleTrainingMode === "ear";
  const isWrite = isScaleMode() && state.scaleTrainingMode === "write";
  ui.setScaleEarToolsVisible(isEar);
  ui.setScaleWriteToolsVisible(isWrite);
  ui.setScaleWriteRootToolsVisible(inScaleMode);
  ui.setStringScopeVisible(!isWrite && !isCircleMode());
}

function refreshChordModeUI() {
  const isEar = isChordMode() && state.chordTrainingMode === "ear";
  ui.setChordEarToolsVisible(isEar);
}

function renderScaleProgressNotation() {
  if (!state.currentTarget || state.currentTarget.mode !== "scale") return;
  const total = state.currentTarget.scaleMidis.length;
  const placeholderCount = Math.max(0, total - (state.currentTarget.revealedNotes?.length || 0));
  if (typeof ui.renderIntervalSequence === "function") {
    ui.renderIntervalSequence(state.currentTarget.revealedNotes, noteToMidi, { placeholderCount });
  } else {
    ui.renderNotation(state.currentTarget.rootNote, noteToMidi);
  }
}

function getScaleWriteSelectedIndex() {
  if (!state.currentTarget || state.currentTarget.mode !== "scale-write") return 1;
  const max = Math.max(1, (state.currentTarget.inputNotes?.length || 1) - 1);
  const idx = Number.isInteger(state.currentTarget.selectedIndex)
    ? state.currentTarget.selectedIndex
    : 1;
  return Math.max(1, Math.min(max, idx));
}

function renderScaleWriteNotation() {
  if (!state.currentTarget || state.currentTarget.mode !== "scale-write") return;
  const selected = getScaleWriteSelectedIndex();
  const visited = state.currentTarget.visitedIndices instanceof Set
    ? state.currentTarget.visitedIndices
    : new Set();
  const entries = (state.currentTarget.inputNotes || []).map((note, idx) => ({
    note,
    placeholder: idx !== 0,
    visited: idx === 0 || visited.has(idx)
  }));
  ui.renderScaleWriteNotation(entries, noteToMidi, selected);
}

function updateScaleWriteAccidentalSwitch() {
  const dblFlatBtn = ui.controls.scaleWriteAccidentalDoubleFlatBtn;
  const flatBtn = ui.controls.scaleWriteAccidentalFlatBtn;
  const natBtn = ui.controls.scaleWriteAccidentalNaturalBtn;
  const sharpBtn = ui.controls.scaleWriteAccidentalSharpBtn;
  const dblSharpBtn = ui.controls.scaleWriteAccidentalDoubleSharpBtn;
  if (!dblFlatBtn || !flatBtn || !natBtn || !sharpBtn || !dblSharpBtn) return;
  dblFlatBtn.classList.remove("active");
  flatBtn.classList.remove("active");
  natBtn.classList.remove("active");
  sharpBtn.classList.remove("active");
  dblSharpBtn.classList.remove("active");
  if (!state.currentTarget || state.currentTarget.mode !== "scale-write") return;
  const idx = getScaleWriteSelectedIndex();
  const note = state.currentTarget.inputNotes?.[idx] || "";
  const m = note.match(/^([A-G])([#b]{0,2})(\d)$/);
  const acc = m ? (m[2] || "") : "";
  if (acc === "bb") dblFlatBtn.classList.add("active");
  else if (acc === "b") flatBtn.classList.add("active");
  else if (acc === "#") sharpBtn.classList.add("active");
  else if (acc === "##") dblSharpBtn.classList.add("active");
  else natBtn.classList.add("active");
}

function moveScaleWriteSelection(direction) {
  if (!isScaleMode() || state.currentTarget?.mode !== "scale-write") return;
  const current = getScaleWriteSelectedIndex();
  const max = Math.max(1, state.currentTarget.inputNotes.length - 1);
  const next = Math.max(1, Math.min(max, current + direction));
  state.currentTarget.selectedIndex = next;
  if (!(state.currentTarget.visitedIndices instanceof Set)) {
    state.currentTarget.visitedIndices = new Set();
  }
  state.currentTarget.visitedIndices.add(next);
  renderScaleWriteNotation();
  updateScaleWriteAccidentalSwitch();
}

function nudgeScaleWriteSelectedNote(direction) {
  if (!isScaleMode() || state.currentTarget?.mode !== "scale-write") return;
  const idx = getScaleWriteSelectedIndex();
  const current = state.currentTarget.inputNotes[idx];
  const m = current?.match(/^([A-G])([#b]{0,2})(\d)$/);
  if (!m) return;
  const letters = ["C", "D", "E", "F", "G", "A", "B"];
  const letter = m[1];
  const octave = parseInt(m[3], 10);
  const pos = letters.indexOf(letter);
  if (pos === -1) return;
  let nextPos = pos + direction;
  let nextOct = octave;
  if (nextPos < 0) {
    nextPos = 6;
    nextOct -= 1;
  } else if (nextPos > 6) {
    nextPos = 0;
    nextOct += 1;
  }
  state.currentTarget.inputNotes[idx] = `${letters[nextPos]}${nextOct}`;
  renderScaleWriteNotation();
  updateScaleWriteAccidentalSwitch();
}

function setScaleWriteSelectedAccidental(symbol) {
  if (!isScaleMode() || state.currentTarget?.mode !== "scale-write") return;
  const idx = getScaleWriteSelectedIndex();
  const current = state.currentTarget.inputNotes[idx];
  const m = current?.match(/^([A-G])([#b]{0,2})(\d)$/);
  if (!m) return;
  const letter = m[1];
  const octave = m[3];
  const nextAcc = ["bb", "b", "", "#", "##"].includes(symbol) ? symbol : "";
  state.currentTarget.inputNotes[idx] = `${letter}${nextAcc}${octave}`;
  renderScaleWriteNotation();
  updateScaleWriteAccidentalSwitch();
}

function cycleScaleWriteAccidental(direction) {
  if (!isScaleMode() || state.currentTarget?.mode !== "scale-write") return;
  const idx = getScaleWriteSelectedIndex();
  const current = state.currentTarget.inputNotes[idx];
  const m = current?.match(/^([A-G])([#b]{0,2})(\d)$/);
  const currentAcc = m ? (m[2] || "") : "";
  const order = ["bb", "b", "", "#", "##"];
  const pos = Math.max(0, order.indexOf(currentAcc));
  const next = Math.max(0, Math.min(order.length - 1, pos + direction));
  setScaleWriteSelectedAccidental(order[next]);
}

function setScaleWriteSelectedLetter(letter) {
  if (!isScaleMode() || state.currentTarget?.mode !== "scale-write") return;
  const idx = getScaleWriteSelectedIndex();
  const current = state.currentTarget.inputNotes[idx];
  const m = current?.match(/^([A-G])([#b]{0,2})(\d)$/);
  const accidental = m ? (m[2] || "") : "";
  const rootMatch = String(state.currentTarget.rootNote || "").match(/^([A-G])([#b]{0,2})(\d)$/);
  const letters = ["C", "D", "E", "F", "G", "A", "B"];
  const rootLetter = rootMatch ? rootMatch[1] : "C";
  const rootOctave = rootMatch ? parseInt(rootMatch[3], 10) : 4;
  const rootPos = letters.indexOf(rootLetter);
  const letterPos = letters.indexOf(letter);
  const octave = letterPos <= rootPos ? rootOctave + 1 : rootOctave;
  state.currentTarget.inputNotes[idx] = `${letter}${accidental}${octave}`;
  renderScaleWriteNotation();
  updateScaleWriteAccidentalSwitch();
}

function checkScaleWriteAnswer() {
  if (!state.currentTarget || state.currentTarget.mode !== "scale-write") return;
  const expectedMidis = state.currentTarget.scaleMidis || [];
  const inputMidis = (state.currentTarget.inputNotes || []).map((n) => noteToMidi(n));
  if (expectedMidis.length !== inputMidis.length || inputMidis.some((m) => m === null)) {
    ui.setMessage("Incomplete answer.");
    return;
  }
  const wrongIndex = inputMidis.findIndex((m, idx) => m !== expectedMidis[idx]);
  if (wrongIndex >= 0) {
    state.currentTarget.selectedIndex = Math.max(1, wrongIndex);
    renderScaleWriteNotation();
    updateScaleWriteAccidentalSwitch();
    ui.setMessage(`❌ Not quite. Check note ${wrongIndex + 1}.`);
    return;
  }
  ui.setMessage("🎯 Correct scale!");
  state.questionAnswered = true;
  setTimeout(() => {
    newQuestion();
  }, 900);
}

function newChordQuestion() {
  return newChordEarQuestion();
}

function newChordEarQuestion() {
  const chordPool = getSelectedChordPool();
  const positions = collectCandidatePositions();
  if (positions.length === 0 || chordPool.length === 0) {
    ui.setMessage("No chord candidates for current filters.");
    return;
  }

  const minMidi = noteToMidi("E2");
  const maxMidi = noteToMidi("E6");
  const uniqueRoots = [...new Set(positions.map((p) => p.midi))]
    .filter((midi) => matchesClefFilter(midi))
    .filter((midi) => midi >= minMidi && midi <= maxMidi);
  if (uniqueRoots.length === 0) {
    ui.setMessage("No chord roots available for current filters.");
    return;
  }

  const candidates = [];
  uniqueRoots.forEach((rootMidi) => {
    chordPool.forEach((chord) => {
      const chordMidis = chord.semitones.map((semi) => rootMidi + semi);
      const inRange = chordMidis.every((m) => m >= minMidi && m <= maxMidi);
      if (!inRange) return;
      candidates.push({ rootMidi, chord, chordMidis });
    });
  });
  if (candidates.length === 0) {
    ui.setMessage("No complete chord fits current range.");
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const rootNote = midiToQuestionNote(pick.rootMidi);
  const rootPos = findPreferredPositionForMidi(pick.rootMidi);

  state.currentTarget = {
    mode: "chord-ear",
    rootMidi: pick.rootMidi,
    rootNote,
    chordKey: pick.chord.key,
    chordLabel: pick.chord.label,
    chordMidis: pick.chordMidis,
    playbackMode: state.chordPlaybackMode,
    rootPos,
    revealedNotes: [rootNote]
  };

  AudioEngine.setStringProfile("all");
  AudioEngine.setActiveString(null);
  ui.setTarget(rootNote, "Chord Ear Training");
  if (rootPos) ui.highlightIntervalSource(rootPos);
  ui.renderNotation(rootNote, noteToMidi);
  ui.setMessage(
    state.chordPlaybackMode === "arpeggio"
      ? "Listen to the arpeggio, then choose its type."
      : "Listen to the chord, then choose its type."
  );
  ui.renderChordAnswerButtons(
    chordPool,
    (chord) => {
      if (!state.currentTarget || state.currentTarget.mode !== "chord-ear") return;
      if (chord.key === state.currentTarget.chordKey) {
        ui.setMessage("🎯 Correct chord!");
        setTimeout(() => newQuestion(), 900);
      } else {
        ui.setMessage("❌ Try again");
      }
    },
    { grouped: state.chordTypeMode === "mixed" }
  );
  playChordPrompt(pick.chordMidis, state.chordPlaybackMode);
}

function newScaleQuestion() {
  if (state.scaleTrainingMode === "write") {
    return newScaleWriteQuestion();
  }
  if (state.scaleTrainingMode === "ear") {
    return newScaleEarQuestion();
  }
  const scalePool = getSelectedScalePool();
  const positions = collectCandidatePositions();
  if (positions.length === 0 || scalePool.length === 0) {
    ui.setMessage("No scale candidates for current filters.");
    return;
  }

  const minMidi = noteToMidi("E2");
  const maxMidi = noteToMidi("E6");
  const allowedRootStrings = new Set([2, 3, 4, 5]); // G, D, A, Low E
  const rootPositions = positions.filter((p) => allowedRootStrings.has(p.s));
  const selectedRootPcRaw = notesSharp.indexOf(state.scaleWriteRootNote || "C");
  const selectedRootPc = selectedRootPcRaw >= 0 ? selectedRootPcRaw : 0;
  const useAllRoots = state.scaleWriteRootNote === "all";
  const uniqueRoots = [...new Set(rootPositions.map((p) => p.midi))]
    .filter((midi) => useAllRoots || (((midi % 12) + 12) % 12) === selectedRootPc)
    .filter((midi) => matchesClefFilter(midi))
    .filter((midi) => midi >= minMidi && midi <= maxMidi);
  if (uniqueRoots.length === 0) {
    ui.setMessage("No scale roots available on G/D/A/Low E for current filters.");
    return;
  }

  const candidates = [];
  uniqueRoots.forEach((rootMidi) => {
    scalePool.forEach((scale) => {
      const scaleMidis = scale.semitones.map((s) => rootMidi + s);
      const inRange = scaleMidis.every((m) => m >= minMidi && m <= maxMidi);
      const playable = scaleMidis.every((m) => findAllPositionsForMidi(m).length > 0);
      if (!inRange || !playable) return;
      candidates.push({ rootMidi, scale, scaleMidis });
    });
  });

  if (candidates.length === 0) {
    ui.setMessage("No complete scale fits current range.");
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const ascendingScaleMidis = pick.scaleMidis;
  const descendingScaleMidis = ascendingScaleMidis.slice(0, -1).reverse();
  const fullScaleMidis = [...ascendingScaleMidis, ...descendingScaleMidis];
  const ascendingScaleNotes = buildScaleNoteNames(pick.rootMidi, pick.scale);
  const fullScaleNotes = [
    ...ascendingScaleNotes,
    ...ascendingScaleNotes.slice(0, -1).reverse()
  ];
  const rootNote = fullScaleNotes[0];
  const rootPos = findPreferredScaleRootPositionForMidi(pick.rootMidi);

  state.currentTarget = {
    mode: "scale",
    rootMidi: pick.rootMidi,
    rootNote,
    scaleLabel: pick.scale.label,
    scaleMidis: fullScaleMidis,
    scaleNotes: fullScaleNotes,
    scaleIndex: 0,
    revealedNotes: [rootNote],
    midi: fullScaleMidis[0],
    rootPos,
    correctPos: null
  };

  AudioEngine.setStringProfile("all");
  AudioEngine.setActiveString(null);
  ui.setTarget(rootNote, `${pick.scale.label} • Up & Down`);
  if (rootPos) ui.highlightIntervalSource(rootPos);
  renderScaleProgressNotation();
  ui.setMessage("Play the scale up and back down.");
}

function newScaleWriteQuestion() {
  const scalePool = getSelectedScalePool();
  const positions = [];
  for (let s = 0; s < tuning.length; s++) {
    for (let f = 0; f <= 12; f++) {
      positions.push({ s, f, ...noteAt(tuning[s].note, f) });
    }
  }
  if (positions.length === 0 || scalePool.length === 0) {
    ui.setMessage("No scale candidates for current filters.");
    return;
  }

  const minMidi = noteToMidi("E2");
  const maxMidi = noteToMidi("E6");
  const allowedRootStrings = new Set([2, 3, 4, 5]); // G, D, A, Low E
  const rootPositions = positions.filter((p) => allowedRootStrings.has(p.s));
  const selectedRootPcRaw = notesSharp.indexOf(state.scaleWriteRootNote || "C");
  const selectedRootPc = selectedRootPcRaw >= 0 ? selectedRootPcRaw : 0;
  const useAllRoots = state.scaleWriteRootNote === "all";
  const uniqueRoots = [...new Set(rootPositions.map((p) => p.midi))]
    .filter((midi) => useAllRoots || (((midi % 12) + 12) % 12) === selectedRootPc)
    .filter((midi) => matchesClefFilter(midi))
    .filter((midi) => midi >= minMidi && midi <= maxMidi);
  if (uniqueRoots.length === 0) {
    ui.setMessage("No scale roots available on G/D/A/Low E for current filters.");
    return;
  }

  const candidates = [];
  uniqueRoots.forEach((rootMidi) => {
    scalePool.forEach((scale) => {
      const scaleMidis = scale.semitones.map((s) => rootMidi + s);
      const inRange = scaleMidis.every((m) => m >= minMidi && m <= maxMidi);
      if (!inRange) return;
      candidates.push({ rootMidi, scale, scaleMidis });
    });
  });
  if (candidates.length === 0) {
    ui.setMessage("No complete scale fits current range.");
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const scaleNotes = buildScaleNoteNames(pick.rootMidi, pick.scale);
  const rootNote = scaleNotes[0];
  const rootPos = findPreferredScaleRootPositionForMidi(pick.rootMidi);
  const inputNotes = [rootNote];
  for (let i = 1; i < scaleNotes.length; i++) {
    const [, letter, , octave] = rootNote.match(/^([A-G])([#b]?)(\d)$/);
    inputNotes.push(`${letter}${octave}`);
  }

  state.currentTarget = {
    mode: "scale-write",
    rootMidi: pick.rootMidi,
    rootNote,
    scaleLabel: pick.scale.label,
    scaleMidis: pick.scaleMidis,
    scaleNotes,
    inputNotes,
    selectedIndex: 1,
    visitedIndices: new Set([1]),
    rootPos
  };

  AudioEngine.setStringProfile("all");
  AudioEngine.setActiveString(null);
  ui.setTarget(rootNote, `${pick.scale.label} • Write on Score`);
  if (rootPos) ui.highlightIntervalSource(rootPos);
  renderScaleWriteNotation();
  updateScaleWriteAccidentalSwitch();
  ui.setMessage("Write the ascending scale, then press Check Answer.");
}

function newScaleEarQuestion() {
  const scalePool = getSelectedScalePool();
  const positions = collectCandidatePositions();
  if (positions.length === 0 || scalePool.length === 0) {
    ui.setMessage("No scale candidates for current filters.");
    return;
  }

  const minMidi = noteToMidi("E2");
  const maxMidi = noteToMidi("E6");
  const allowedRootStrings = new Set([2, 3, 4, 5]); // G, D, A, Low E
  const rootPositions = positions.filter((p) => allowedRootStrings.has(p.s));
  const selectedRootPcRaw = notesSharp.indexOf(state.scaleWriteRootNote || "C");
  const selectedRootPc = selectedRootPcRaw >= 0 ? selectedRootPcRaw : 0;
  const useAllRoots = state.scaleWriteRootNote === "all";
  const uniqueRoots = [...new Set(rootPositions.map((p) => p.midi))]
    .filter((midi) => useAllRoots || (((midi % 12) + 12) % 12) === selectedRootPc)
    .filter((midi) => matchesClefFilter(midi))
    .filter((midi) => midi >= minMidi && midi <= maxMidi);
  if (uniqueRoots.length === 0) {
    ui.setMessage("No scale roots available on G/D/A/Low E for current filters.");
    return;
  }

  const candidates = [];
  uniqueRoots.forEach((rootMidi) => {
    scalePool.forEach((scale) => {
      const scaleMidis = scale.semitones.map((s) => rootMidi + s);
      const inRange = scaleMidis.every((m) => m >= minMidi && m <= maxMidi);
      if (!inRange) return;
      candidates.push({ rootMidi, scale, scaleMidis });
    });
  });
  if (candidates.length === 0) {
    ui.setMessage("No complete scale fits current range.");
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const scaleNotes = buildScaleNoteNames(pick.rootMidi, pick.scale);
  const rootNote = scaleNotes[0];
  const rootPos = findPreferredScaleRootPositionForMidi(pick.rootMidi);

  state.currentTarget = {
    mode: "scale-ear",
    rootMidi: pick.rootMidi,
    rootNote,
    scaleKey: pick.scale.key,
    scaleLabel: pick.scale.label,
    scaleMidis: pick.scaleMidis,
    scaleNotes,
    rootPos,
    revealedNotes: [rootNote]
  };

  AudioEngine.setStringProfile("all");
  AudioEngine.setActiveString(null);
  ui.setTarget(rootNote, "Scale Ear Training");
  if (rootPos) ui.highlightIntervalSource(rootPos);
  ui.renderNotation(rootNote, noteToMidi);
  ui.setMessage("Listen to the scale, then choose its name.");
  ui.renderScaleAnswerButtons(scalePool, (scale) => {
    if (!state.currentTarget || state.currentTarget.mode !== "scale-ear") return;
    if (scale.key === state.currentTarget.scaleKey) {
      ui.setMessage("🎯 Correct scale!");
      setTimeout(() => newQuestion(), 900);
    } else {
      ui.setMessage("❌ Try again");
    }
  });
  playScalePrompt(pick.scaleMidis);
}

function newIntervalQuestion() {
  state.currentTarget = null;
  const isEarMode = state.intervalMode === "ear";
  const selectedIntervals = isEarMode
    ? EAR_INTERVALS
    : INTERVALS.filter((interval) => state.selectedIntervalKeys.has(interval.key));
  if (selectedIntervals.length === 0) {
    ui.setMessage("Select at least one interval.");
    return;
  }

  const positions = collectCandidatePositions();
  if (positions.length === 0) {
    ui.setMessage("No candidates for current filters.");
    return;
  }

  const candidates = [];
  const allowedDirections =
    state.intervalDirectionMode === "up"
      ? [1]
      : state.intervalDirectionMode === "down"
        ? [-1]
        : [1, -1];

  if (isEarMode) {
    const sequenceLen = Math.max(1, Math.min(4, state.intervalEarCount || 1));
    for (const pos of positions) {
      if (!matchesClefFilter(pos.midi)) continue;
      for (let attempt = 0; attempt < 24; attempt++) {
        let currentMidi = pos.midi;
        const chain = [];
        let valid = true;
        for (let step = 0; step < sequenceLen; step++) {
          const interval = selectedIntervals[Math.floor(Math.random() * selectedIntervals.length)];
          const dir = allowedDirections[Math.floor(Math.random() * allowedDirections.length)];
          const targetMidi = currentMidi + dir * interval.semitones;
          if (targetMidi > pos.midi + 24 || targetMidi < pos.midi - 24) {
            valid = false;
            break;
          }
          if (!matchesClefFilter(targetMidi)) {
            valid = false;
            break;
          }
          const targetPositions = findAllPositionsForMidi(targetMidi);
          if (targetPositions.length === 0) {
            valid = false;
            break;
          }
          chain.push({
            interval,
            direction: dir === 1 ? "UP" : "DOWN",
            midi: targetMidi
          });
          currentMidi = targetMidi;
        }
        if (valid && chain.length === sequenceLen) {
          candidates.push({
            root: pos,
            chain
          });
        }
      }
    }
  } else {
    for (const pos of positions) {
      if (!matchesClefFilter(pos.midi)) continue;

      for (const interval of selectedIntervals) {
        for (const dir of allowedDirections) {
          const targetMidi = pos.midi + dir * interval.semitones;
          const targetPositions = findAllPositionsForMidi(targetMidi);
          if (targetPositions.length === 0) continue;
          if (!matchesClefFilter(targetMidi)) continue;

          candidates.push({
            root: pos,
            interval,
            direction: dir === 1 ? "UP" : "DOWN",
            targetMidi
          });
        }
      }
    }
  }

  if (candidates.length === 0) {
    ui.setMessage("No interval questions fit the current filters.");
    return;
  }

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const rootNote = midiToQuestionNote(pick.root.midi);
  if (isEarMode) {
    const first = pick.chain[0];
    state.currentTarget = {
      mode: "interval-ear",
      s: pick.root.s,
      f: pick.root.f,
      rootMidi: pick.root.midi,
      rootNote,
      intervalLabel: first.interval.label,
      direction: first.direction,
      n: midiToQuestionNote(first.midi),
      midi: first.midi,
      earTargetMidis: pick.chain.map((item) => item.midi),
      earChain: pick.chain,
      earIndex: 0,
      revealedNotes: [rootNote],
      rootPos: { s: pick.root.s, f: pick.root.f },
      correctPos: null
    };
  } else {
    const targetNote = midiToQuestionNote(pick.targetMidi);
    state.currentTarget = {
      mode: "interval",
      s: pick.root.s,
      f: pick.root.f,
      rootMidi: pick.root.midi,
      rootNote,
      intervalLabel: pick.interval.label,
      direction: pick.direction,
      n: targetNote,
      midi: pick.targetMidi,
      revealedNotes: [rootNote],
      rootPos: { s: pick.root.s, f: pick.root.f },
      correctPos: null
    };
  }

  AudioEngine.setStringProfile("all");
  AudioEngine.setActiveString(null);
  if (isEarMode) {
    const total = state.currentTarget.earTargetMidis.length;
    ui.setTarget(rootNote, `Interval Ear Training • ${total} interval${total > 1 ? "s" : ""}`);
    ui.setMessage("Listen, then play each hidden note in order.");
    playEarPrompt(
      pick.root.midi,
      state.currentTarget.earTargetMidis,
      state.intervalCadenceEnabled
    );
  } else {
    ui.setTarget(rootNote, `${pick.interval.label} ${pick.direction}`);
  }
  ui.highlightIntervalSource(state.currentTarget.rootPos);
  renderIntervalProgressNotation(rootNote);
}

function renderIntervalProgressNotation(fallbackRootNote = null) {
  if (!state.currentTarget) return;
  if (typeof ui.renderIntervalSequence === "function") {
    const placeholderCount = state.currentTarget.mode === "interval-ear"
      ? Math.max(
          0,
          (state.currentTarget.earTargetMidis?.length || 0)
            - Math.max(0, (state.currentTarget.revealedNotes?.length || 1) - 1)
        )
      : 0;
    ui.renderIntervalSequence(
      state.currentTarget.revealedNotes || (fallbackRootNote ? [fallbackRootNote] : []),
      noteToMidi,
      { placeholderCount }
    );
    return;
  }
  if (fallbackRootNote) {
    ui.renderNotation(fallbackRootNote, noteToMidi);
  }
}

function revealAnswer() {
  if (isSongMode()) {
    if (isCustomSongMode() && state.songCustomMode === "edit") {
      const step = state.songBeats[state.songEditStepIndex];
      ui.setMessage(`Step: ${step?.note || "REST"} (${step?.duration || "q"})`);
      return;
    }
    if (state.songActiveBeat >= state.songBeats.length) return;
    const step = state.songBeats[state.songActiveBeat];
    if (isSilentSongStep(step)) {
      ui.setMessage("Answer: Rest");
    } else {
      ui.setMessage(`Answer: ${step.note}`);
    }
    return;
  }
  if (!state.currentTarget) return;
  if (state.currentTarget.mode === "scale") {
    const idx = state.currentTarget.scaleIndex || 0;
    const nextNote = state.currentTarget.scaleNotes?.[idx];
    ui.setMessage(`Answer: ${nextNote || "—"}`);
    return;
  }
  if (state.currentTarget.mode === "scale-ear") {
    ui.setMessage(`Answer: ${state.currentTarget.scaleLabel}`);
    return;
  }
  if (state.currentTarget.mode === "scale-write") {
    ui.setMessage(`Answer: ${state.currentTarget.scaleNotes?.join(" ") || "—"}`);
    return;
  }
  if (state.currentTarget.mode === "chord-ear") {
    ui.setMessage(`Answer: ${state.currentTarget.chordLabel}`);
    return;
  }
  if (state.currentTarget.mode === "circle") {
    if (state.currentTarget.trainingMode === "sig_to_scale") {
      ui.setMessage(`Answer: ${state.currentTarget.answerScaleLabel}`);
    } else {
      const sig = getCircleSignatureById(state.currentTarget.answerSignatureId);
      const list = sig?.accidentals?.length ? sig.accidentals.join(" ") : "None";
      ui.setMessage(`Answer: ${list}`);
    }
    return;
  }
  ui.setMessage(`Answer: ${state.currentTarget.n}`);
}

function handleCellClick(s, f) {
  if (isSongMode()) {
    if (isCustomSongMode() && state.songCustomMode === "edit") return;
    if (state.songActiveBeat >= state.songBeats.length) return;
    const clicked = noteAt(tuning[s].note, f);
    const expected = state.songBeats[state.songActiveBeat];
    if (isSilentSongStep(expected)) {
      state.songLastAcceptedMidi = null;
      completeSongStep(null);
      return;
    }
    if (clicked.midi === noteToMidi(expected.note)) {
      ui.setMessage("✅ Correct!");
      completeSongStep({ s, f });
    } else {
      ui.setMessage("❌ Try again");
    }
    return;
  }

  if (!state.currentTarget) return;

  if (state.trainerMode === "interval") {
    const clicked = noteAt(tuning[s].note, f);
    if (state.intervalMode === "ear") return;
    if (clicked.midi === state.currentTarget.midi) {
      state.currentTarget.correctPos = { s, f };
      if (Array.isArray(state.currentTarget.revealedNotes)) {
        state.currentTarget.revealedNotes.push(state.currentTarget.n);
        renderIntervalProgressNotation(state.currentTarget.rootNote);
      }
      ui.setMessage("✅ Correct!");
      ui.highlightCorrectFret(state.currentTarget.correctPos);
      state.questionAnswered = true;
      return;
    }
    ui.setMessage("❌ Try again");
    return;
  }
  if (isScaleMode() && state.currentTarget?.mode === "scale") {
    const clicked = noteAt(tuning[s].note, f);
    const idx = state.currentTarget.scaleIndex || 0;
    const expectedMidi = state.currentTarget.scaleMidis[idx];
    if (clicked.midi !== expectedMidi) {
      ui.setMessage("❌ Try again");
      return;
    }
    state.currentTarget.correctPos = { s, f };
    ui.clearCorrectFret();
    ui.highlightCorrectFret(state.currentTarget.correctPos);

    if (idx > 0) {
      state.currentTarget.revealedNotes.push(state.currentTarget.scaleNotes[idx]);
    }
    state.currentTarget.scaleIndex = idx + 1;
    if (state.currentTarget.scaleIndex >= state.currentTarget.scaleMidis.length) {
      state.questionAnswered = true;
      ui.setMessage("🎯 Correct scale!");
      renderScaleProgressNotation();
      setTimeout(() => newQuestion(), 900);
      return;
    }
    state.currentTarget.midi = state.currentTarget.scaleMidis[state.currentTarget.scaleIndex];
    renderScaleProgressNotation();
    ui.setMessage("✅ Correct! Continue scale.");
    return;
  }
  if (isScaleMode() && state.currentTarget?.mode === "scale-ear") {
    return;
  }
  if (isScaleMode() && state.currentTarget?.mode === "scale-write") {
    return;
  }
  if (isChordMode() && state.currentTarget?.mode === "chord-ear") {
    return;
  }

  if (s === state.currentTarget.s && f === state.currentTarget.f) {
    ui.setMessage("✅ Correct!");
    ui.highlightCorrectFret(state.currentTarget);
    state.questionAnswered = true;
  } else {
    ui.setMessage("❌ Try again");
  }
}

async function startListening() {
  try {
    await AudioEngine.start();
  } catch (err) {
    console.error("Failed to start audio engine:", err);
    ui.setMessage("Microphone start failed. Check browser permissions.");
  }
}

function stopListening() {
  AudioEngine.stop();
}

async function loadDevices() {
  const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    deviceSelect.innerHTML = "";

    devices
      .filter((device) => device.kind === "audioinput")
      .forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.textContent = device.label || "Audio input";
        deviceSelect.appendChild(option);
      });

    if (deviceSelect.options.length > 0) {
      deviceSelect.value = deviceSelect.options[0].value;
      await AudioEngine.setDevice(deviceSelect.value);
    }
  } finally {
    permissionStream.getTracks().forEach((track) => track.stop());
  }
}

function setupControls() {
  const optionsPanel = document.getElementById("modeOptionsPanel");
  if (optionsPanel) {
    optionsPanel.style.display = state.modeOptionsHidden ? "none" : "block";
  }
  const optionsBtn = document.getElementById("toggleOptionsBtn");
  if (optionsBtn) {
    optionsBtn.textContent = state.modeOptionsHidden ? "Show Options" : "Hide Options";
  }
  ui.controls.trainerMode.value = state.trainerMode;
  ui.controls.noteSpellingMode.value = state.questionSpellingMode;
  if (Array.isArray(ui.controls.stringScopeInputs)) {
    ui.controls.stringScopeInputs.forEach((input) => {
      const idx = parseInt(input.value, 10);
      input.checked = state.selectedStringIndexes.has(idx);
    });
  }
  ui.controls.clefMode.value = state.clefFilterMode;
  if (ui.controls.scaleTypeMode) {
    ui.controls.scaleTypeMode.value = state.scaleTypeMode;
  }
  if (ui.controls.scaleTrainingMode) {
    ui.controls.scaleTrainingMode.value = state.scaleTrainingMode;
  }
  if (ui.controls.scaleIncludeMelodicMinorModes) {
    ui.controls.scaleIncludeMelodicMinorModes.checked = state.scaleIncludeMelodicMinorModes;
  }
  if (ui.controls.scaleIncludeHarmonicMinorModes) {
    ui.controls.scaleIncludeHarmonicMinorModes.checked = state.scaleIncludeHarmonicMinorModes;
  }
  if (ui.controls.scaleWriteRootNote) {
    ui.controls.scaleWriteRootNote.value = state.scaleWriteRootNote;
  }
  if (ui.controls.chordTypeMode) {
    ui.controls.chordTypeMode.value = state.chordTypeMode;
  }
  if (ui.controls.chordTrainingMode) {
    ui.controls.chordTrainingMode.value = state.chordTrainingMode;
  }
  if (ui.controls.chordArpeggioSpeed) {
    ui.controls.chordArpeggioSpeed.value = String(state.chordArpeggioGapMs);
  }
  if (ui.controls.chordArpeggioSpeedValue) {
    ui.controls.chordArpeggioSpeedValue.textContent = `${state.chordArpeggioGapMs} ms`;
  }
  if (ui.controls.chordPlaybackMode) {
    ui.controls.chordPlaybackMode.value = state.chordPlaybackMode;
  }
  if (ui.controls.intervalMode) {
    ui.controls.intervalMode.value = state.intervalMode;
  }
  if (ui.controls.circleTrainingMode) {
    ui.controls.circleTrainingMode.value = state.circleTrainingMode;
  }
  if (ui.controls.circleQualityMode) {
    ui.controls.circleQualityMode.value = state.circleQualityMode;
  }
  if (ui.controls.intervalEarCount) {
    ui.controls.intervalEarCount.value = String(state.intervalEarCount);
  }
  if (ui.controls.intervalCadenceToggle) {
    ui.controls.intervalCadenceToggle.checked = state.intervalCadenceEnabled;
  }

  if (ui.controls.intervalEarCount) {
    ui.controls.intervalEarCount.addEventListener("change", (event) => {
      const n = parseInt(event.target.value, 10);
      if (!Number.isInteger(n) || n < 1 || n > 4) return;
      state.intervalEarCount = n;
      if (state.trainerMode === "interval" && state.intervalMode === "ear") {
        newQuestion();
      }
    });
  }
  if (ui.controls.chordArpeggioSpeed) {
    ui.controls.chordArpeggioSpeed.addEventListener("input", (event) => {
      const ms = Math.max(60, Math.min(360, parseInt(event.target.value, 10) || 200));
      state.chordArpeggioGapMs = ms;
      if (ui.controls.chordArpeggioSpeedValue) {
        ui.controls.chordArpeggioSpeedValue.textContent = `${ms} ms`;
      }
    });
  }
  ui.controls.intervalDirectionMode.value = state.intervalDirectionMode;
  if (ui.controls.songCustomMode) {
    ui.controls.songCustomMode.value = state.songCustomMode;
  }
  if (ui.controls.playbackInstrument) {
    ui.controls.playbackInstrument.value = state.playbackInstrument;
  }
  if (ui.controls.sampleOctaveShift) {
    ui.controls.sampleOctaveShift.value = String(state.sampleOctaveShiftSemitones);
  }
  if (ui.controls.randomSongCueTempoSlider) {
    ui.controls.randomSongCueTempoSlider.value = String(state.randomSongCueTempoBpm);
  }
  if (ui.controls.randomSongCueTempoValue) {
    ui.controls.randomSongCueTempoValue.textContent = `${state.randomSongCueTempoBpm} BPM`;
  }
  if (ui.controls.randomSongCueVolumeSlider) {
    ui.controls.randomSongCueVolumeSlider.value = String(Math.round(state.randomSongCueVolume * 100));
  }
  if (ui.controls.randomSongCueVolumeValue) {
    ui.controls.randomSongCueVolumeValue.textContent = `${Math.round(state.randomSongCueVolume * 100)}%`;
  }
  if (ui.controls.randomSongCueVelocitySlider) {
    ui.controls.randomSongCueVelocitySlider.value = String(Math.round(state.randomSongCueVelocity * 100));
  }
  if (ui.controls.randomSongCueVelocityValue) {
    ui.controls.randomSongCueVelocityValue.textContent = `${Math.round(state.randomSongCueVelocity * 100)}%`;
  }
  if (ui.controls.randomSongPlayBarChordsToggle) {
    ui.controls.randomSongPlayBarChordsToggle.checked = state.randomSongPlayBarChordsEnabled;
  }
  if (ui.controls.randomSongGenerationStyle) {
    ui.controls.randomSongGenerationStyle.value = state.randomSongGenerationStyle;
  }
  if (ui.controls.randomSongCounterpointStrictness) {
    ui.controls.randomSongCounterpointStrictness.value = state.randomSongCounterpointStrictness;
    ui.controls.randomSongCounterpointStrictness.disabled = state.randomSongGenerationStyle !== "counterpoint";
  }
  ui.setIntervalSelectorVisible(state.trainerMode === "interval");
  ui.setScaleSelectorVisible(isScaleMode());
  ui.setChordSelectorVisible(isChordMode());
  if (typeof ui.setCircleSelectorVisible === "function") {
    ui.setCircleSelectorVisible(isCircleMode());
  }
  refreshScaleModeUI();
  refreshChordModeUI();
  ui.setSongEditorVisible(isCustomSongMode());
  refreshCustomSongModeUI();
  ui.setRandomSongToolsVisible(isRandomSongMode());
  const renderIntervalChecklist = () => {
    ui.renderIntervalChecklist(
      INTERVALS,
      state.selectedIntervalKeys,
      (key, checked) => {
        if (checked) {
          state.selectedIntervalKeys.add(key);
        } else {
          state.selectedIntervalKeys.delete(key);
        }
        if (state.trainerMode === "interval") {
          newQuestion();
        }
      }
    );
  };
  renderIntervalChecklist();

  ui.controls.newQuestionBtn.addEventListener("click", newQuestion);
  ui.controls.revealAnswerBtn.addEventListener("click", revealAnswer);
  ui.controls.startListeningBtn.addEventListener("click", startListening);
  ui.controls.stopListeningBtn.addEventListener("click", stopListening);

  ui.controls.trainerMode.addEventListener("change", (event) => {
    const mode = event.target.value;
    if (!["note", "interval", "scale", "chord", "circle", "song-custom", "song-random"].includes(mode)) return;
    const previousMode = state.trainerMode;
    if (previousMode === "song-custom" || previousMode === "song-random") {
      persistCurrentSongModeBeats(previousMode);
    }
    state.trainerMode = mode;
    state.songViewStartStep = null;
    if (mode === "song-custom" || mode === "song-random") {
      restoreSongModeBeats(mode);
    }
    ui.setIntervalSelectorVisible(state.trainerMode === "interval");
    ui.setScaleSelectorVisible(isScaleMode());
    ui.setChordSelectorVisible(isChordMode());
    if (typeof ui.setCircleSelectorVisible === "function") {
      ui.setCircleSelectorVisible(isCircleMode());
    }
    refreshScaleModeUI();
    refreshChordModeUI();
    ui.setSongEditorVisible(isCustomSongMode());
    refreshCustomSongModeUI();
    ui.setRandomSongToolsVisible(isRandomSongMode());
    refreshModeChrome();
    refreshSongBrowseState();
    newQuestion();
  });

  if (ui.controls.songCustomMode) {
    ui.controls.songCustomMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["play", "edit"].includes(mode)) return;
      state.songCustomMode = mode;
      state.songViewStartStep = null;
      refreshCustomSongModeUI();
      refreshModeChrome();
      refreshSongBrowseState();
      if (isCustomSongMode()) {
        if (mode === "edit") {
          enterCustomEditView();
        } else {
          startSongTraining();
        }
      }
    });
  }

  ui.controls.noteSpellingMode.addEventListener("change", (event) => {
    const mode = event.target.value;
    if (!["mixed", "sharp", "flat"].includes(mode)) return;
    state.questionSpellingMode = mode;
    newQuestion();
  });

  if (Array.isArray(ui.controls.stringScopeInputs)) {
    ui.controls.stringScopeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const selected = new Set();
        ui.controls.stringScopeInputs.forEach((el) => {
          if (el.checked) {
            const idx = parseInt(el.value, 10);
            if (Number.isInteger(idx) && idx >= 0 && idx < tuning.length) {
              selected.add(idx);
            }
          }
        });
        state.selectedStringIndexes = selected;
        newQuestion();
      });
    });
  }
  if (ui.controls.stringScopeSelectAllBtn) {
    ui.controls.stringScopeSelectAllBtn.addEventListener("click", () => {
      state.selectedStringIndexes = new Set(ALL_STRING_INDEXES);
      if (Array.isArray(ui.controls.stringScopeInputs)) {
        ui.controls.stringScopeInputs.forEach((input) => {
          input.checked = true;
        });
      }
      newQuestion();
    });
  }
  if (ui.controls.stringScopeSelectNoneBtn) {
    ui.controls.stringScopeSelectNoneBtn.addEventListener("click", () => {
      state.selectedStringIndexes = new Set();
      if (Array.isArray(ui.controls.stringScopeInputs)) {
        ui.controls.stringScopeInputs.forEach((input) => {
          input.checked = false;
        });
      }
      newQuestion();
    });
  }

  ui.controls.clefMode.addEventListener("change", (event) => {
    const mode = event.target.value;
    if (!["all", "treble", "bass"].includes(mode)) return;
    state.clefFilterMode = mode;
    newQuestion();
  });

  ui.controls.intervalDirectionMode.addEventListener("change", (event) => {
    const mode = event.target.value;
    if (!["both", "up", "down"].includes(mode)) return;
    state.intervalDirectionMode = mode;
    if (state.trainerMode === "interval") {
      newQuestion();
    }
  });

  if (ui.controls.circleTrainingMode) {
    ui.controls.circleTrainingMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["sig_to_scale", "scale_to_sig"].includes(mode)) return;
      state.circleTrainingMode = mode;
      if (isCircleMode()) {
        newQuestion();
      }
    });
  }
  if (ui.controls.circleQualityMode) {
    ui.controls.circleQualityMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["mixed", "major", "minor"].includes(mode)) return;
      state.circleQualityMode = mode;
      if (isCircleMode()) {
        newQuestion();
      }
    });
  }

  if (ui.controls.scaleTypeMode) {
    ui.controls.scaleTypeMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!(mode === "mixed" || SCALES.some((scale) => scale.key === mode))) return;
      state.scaleTypeMode = mode;
      if (isScaleMode()) {
        newQuestion();
      }
    });
  }
  if (ui.controls.scaleIncludeMelodicMinorModes) {
    ui.controls.scaleIncludeMelodicMinorModes.addEventListener("change", (event) => {
      state.scaleIncludeMelodicMinorModes = Boolean(event.target.checked);
      if (isScaleMode()) {
        newQuestion();
      }
    });
  }
  if (ui.controls.scaleIncludeHarmonicMinorModes) {
    ui.controls.scaleIncludeHarmonicMinorModes.addEventListener("change", (event) => {
      state.scaleIncludeHarmonicMinorModes = Boolean(event.target.checked);
      if (isScaleMode()) {
        newQuestion();
      }
    });
  }

  if (ui.controls.scaleTrainingMode) {
    ui.controls.scaleTrainingMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["play", "ear", "write"].includes(mode)) return;
      state.scaleTrainingMode = mode;
      refreshScaleModeUI();
      if (isScaleMode()) {
        newQuestion();
      }
    });
  }
  if (ui.controls.scaleWriteRootNote) {
    ui.controls.scaleWriteRootNote.addEventListener("change", (event) => {
      const value = event.target.value;
      if (!(value === "all" || notesSharp.includes(value))) return;
      state.scaleWriteRootNote = value;
      if (isScaleMode() && state.scaleTrainingMode === "write") {
        newQuestion();
      }
      if (isScaleMode() && state.scaleTrainingMode !== "write") {
        newQuestion();
      }
    });
  }

  if (ui.controls.chordTypeMode) {
    ui.controls.chordTypeMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["mixed", "triads", "sus", "seventh", "extensions"].includes(mode)) return;
      state.chordTypeMode = mode;
      if (isChordMode()) {
        newQuestion();
      }
    });
  }

  if (ui.controls.chordTrainingMode) {
    ui.controls.chordTrainingMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["ear"].includes(mode)) return;
      state.chordTrainingMode = mode;
      refreshChordModeUI();
      if (isChordMode()) {
        newQuestion();
      }
    });
  }
  if (ui.controls.chordPlaybackMode) {
    ui.controls.chordPlaybackMode.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["block", "arpeggio"].includes(mode)) return;
      state.chordPlaybackMode = mode;
      if (
        isChordMode()
        && state.chordTrainingMode === "ear"
        && state.currentTarget
        && state.currentTarget.mode === "chord-ear"
      ) {
        state.currentTarget.playbackMode = mode;
        playChordPrompt(state.currentTarget.chordMidis, mode);
        ui.setMessage(
          mode === "arpeggio"
            ? "Switched to arpeggio for current question."
            : "Switched to chord playback for current question."
        );
      }
    });
  }

  ui.controls.intervalMode.addEventListener("change", (event) => {
    const mode = event.target.value;
    if (!["visual", "ear"].includes(mode)) return;
    state.intervalMode = mode;
    refreshModeChrome();
    if (state.trainerMode === "interval") {
      newQuestion();
    }
  });

  if (ui.controls.intervalCadenceToggle) {
    ui.controls.intervalCadenceToggle.addEventListener("change", (event) => {
      state.intervalCadenceEnabled = !!event.target.checked;
    });
  }

  if (ui.controls.intervalReplayBtn) {
    ui.controls.intervalReplayBtn.addEventListener("click", () => {
      if (state.trainerMode !== "interval" || state.intervalMode !== "ear") return;
      if (!state.currentTarget || state.currentTarget.mode !== "interval-ear") return;
      playEarPrompt(
        state.currentTarget.rootMidi,
        state.currentTarget.earTargetMidis || [state.currentTarget.midi],
        state.intervalCadenceEnabled
      );
      ui.setMessage("Replayed interval prompt.");
    });
  }
  if (ui.controls.scaleReplayBtn) {
    ui.controls.scaleReplayBtn.addEventListener("click", () => {
      if (!isScaleMode() || state.scaleTrainingMode !== "ear") return;
      if (!state.currentTarget || state.currentTarget.mode !== "scale-ear") return;
      playScalePrompt(state.currentTarget.scaleMidis);
      ui.setMessage("Replayed scale.");
    });
  }
  if (ui.controls.scaleWriteAccidentalDoubleFlatBtn) {
    ui.controls.scaleWriteAccidentalDoubleFlatBtn.addEventListener("click", () => {
      setScaleWriteSelectedAccidental("bb");
    });
  }
  if (ui.controls.scaleWriteAccidentalFlatBtn) {
    ui.controls.scaleWriteAccidentalFlatBtn.addEventListener("click", () => {
      setScaleWriteSelectedAccidental("b");
    });
  }
  if (ui.controls.scaleWriteAccidentalNaturalBtn) {
    ui.controls.scaleWriteAccidentalNaturalBtn.addEventListener("click", () => {
      setScaleWriteSelectedAccidental("");
    });
  }
  if (ui.controls.scaleWriteAccidentalSharpBtn) {
    ui.controls.scaleWriteAccidentalSharpBtn.addEventListener("click", () => {
      setScaleWriteSelectedAccidental("#");
    });
  }
  if (ui.controls.scaleWriteAccidentalDoubleSharpBtn) {
    ui.controls.scaleWriteAccidentalDoubleSharpBtn.addEventListener("click", () => {
      setScaleWriteSelectedAccidental("##");
    });
  }
  if (ui.controls.scaleWriteCheckBtn) {
    ui.controls.scaleWriteCheckBtn.addEventListener("click", () => {
      checkScaleWriteAnswer();
    });
  }
  if (ui.controls.chordReplayBtn) {
    ui.controls.chordReplayBtn.addEventListener("click", () => {
      if (!isChordMode() || state.chordTrainingMode !== "ear") return;
      if (!state.currentTarget || state.currentTarget.mode !== "chord-ear") return;
      playChordPrompt(state.currentTarget.chordMidis, state.chordPlaybackMode);
      ui.setMessage(
        state.chordPlaybackMode === "arpeggio"
          ? "Replayed arpeggio."
          : "Replayed chord."
      );
    });
  }
  if (ui.controls.chordReplayOctDownBtn) {
    ui.controls.chordReplayOctDownBtn.addEventListener("click", () => {
      if (!isChordMode() || state.chordTrainingMode !== "ear") return;
      if (!state.currentTarget || state.currentTarget.mode !== "chord-ear") return;
      const shifted = transposeMidisByOctave(state.currentTarget.chordMidis, -1);
      playChordPrompt(shifted, state.chordPlaybackMode);
      ui.setMessage("Replayed same question one octave lower.");
    });
  }
  if (ui.controls.chordReplayOctUpBtn) {
    ui.controls.chordReplayOctUpBtn.addEventListener("click", () => {
      if (!isChordMode() || state.chordTrainingMode !== "ear") return;
      if (!state.currentTarget || state.currentTarget.mode !== "chord-ear") return;
      const shifted = transposeMidisByOctave(state.currentTarget.chordMidis, 1);
      playChordPrompt(shifted, state.chordPlaybackMode);
      ui.setMessage("Replayed same question one octave higher.");
    });
  }
  if (ui.controls.intervalReplayNotesBtn) {
    ui.controls.intervalReplayNotesBtn.addEventListener("click", () => {
      if (state.trainerMode !== "interval" || state.intervalMode !== "ear") return;
      if (!state.currentTarget || state.currentTarget.mode !== "interval-ear") return;
      playEarPrompt(
        state.currentTarget.rootMidi,
        state.currentTarget.earTargetMidis || [state.currentTarget.midi],
        false
      );
      ui.setMessage("Replayed notes only.");
    });
  }

  ui.controls.intervalSelectAllBtn.addEventListener("click", () => {
    state.selectedIntervalKeys = new Set(INTERVALS.map((interval) => interval.key));
    renderIntervalChecklist();
    if (state.trainerMode === "interval") {
      newQuestion();
    }
  });

  ui.controls.intervalSelectNoneBtn.addEventListener("click", () => {
    state.selectedIntervalKeys = new Set();
    renderIntervalChecklist();
    if (state.trainerMode === "interval") {
      newQuestion();
    }
  });

  deviceSelect.addEventListener("change", () => {
    AudioEngine.setDevice(deviceSelect.value);
  });
  if (ui.controls.playbackInstrument) {
    ui.controls.playbackInstrument.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["piano", "rhodes", "pad"].includes(mode)) return;
      state.playbackInstrument = mode;
      stopEarPlayback();
      if (isRandomSongMode() && state.randomSongPlayBarChordsEnabled) {
        const barIndex = Math.floor(Math.max(0, state.songActiveBeat) / STEPS_PER_BAR);
        startRandomSongBarCueLoop(barIndex);
      }
    });
  }
  if (ui.controls.sampleOctaveShift) {
    ui.controls.sampleOctaveShift.addEventListener("change", (event) => {
      const semis = parseInt(event.target.value, 10);
      if (![0, -12].includes(semis)) return;
      state.sampleOctaveShiftSemitones = semis;
      if (isRandomSongMode() && state.randomSongPlayBarChordsEnabled) {
        const barIndex = Math.floor(Math.max(0, state.songActiveBeat) / STEPS_PER_BAR);
        startRandomSongBarCueLoop(barIndex);
      }
    });
  }

  renderSongStepEditor();

  if (ui.controls.songBarSelect) {
    ui.controls.songBarSelect.addEventListener("change", (event) => {
      const { stepInBar } = getSongEditBarAndStepInBar();
      const nextBar = parseInt(event.target.value, 10) || 0;
      applySongEditBarAndStep(nextBar, stepInBar);
      enterCustomEditView();
    });
  }

  if (ui.controls.songBeatSelect) {
    ui.controls.songBeatSelect.addEventListener("change", (event) => {
      const { barIndex } = getSongEditBarAndStepInBar();
      const nextStepInBar = parseInt(event.target.value, 10) || 0;
      applySongEditBarAndStep(barIndex, nextStepInBar);
      enterCustomEditView();
    });
  }

  ui.controls.songStepPrevBtn.addEventListener("click", () => {
    state.songEditStepIndex = Math.max(0, state.songEditStepIndex - 1);
    enterCustomEditView();
  });

  ui.controls.songStepNextBtn.addEventListener("click", () => {
    state.songEditStepIndex = Math.min(SONG_STEPS - 1, state.songEditStepIndex + 1);
    enterCustomEditView();
  });

  ui.controls.songStepNoteSelect.addEventListener("change", () => {
    const idx = state.songEditStepIndex;
    state.songBeats[idx].note = ui.controls.songStepNoteSelect.value;
    clampBarDurations(Math.floor(idx / STEPS_PER_BAR));
    persistCurrentSongModeBeats();
    renderSongStepEditor();
    if (isCustomSongMode()) {
      if (state.songCustomMode === "edit") {
        enterCustomEditView();
      } else {
        startSongTraining();
      }
    }
  });

  if (ui.controls.songViewPrevBtn) {
    ui.controls.songViewPrevBtn.addEventListener("click", () => {
      if (!isSongBrowseMode()) return;
      shiftSongViewWindow(-1);
    });
  }

  if (ui.controls.songViewNextBtn) {
    ui.controls.songViewNextBtn.addEventListener("click", () => {
      if (!isSongBrowseMode()) return;
      shiftSongViewWindow(1);
    });
  }

  if (ui.controls.songViewCurrentBtn) {
    ui.controls.songViewCurrentBtn.addEventListener("click", () => {
      if (!isSongBrowseMode()) return;
      resetSongViewToCurrent();
    });
  }

  if (ui.controls.songFretboardToggleBtn) {
    ui.controls.songFretboardToggleBtn.addEventListener("click", () => {
      if (!isSongMode()) return;
      state.songFretboardHidden = !state.songFretboardHidden;
      refreshModeChrome();
    });
  }

  window.addEventListener("keydown", (event) => {
    const targetTag = (event.target && event.target.tagName) ? event.target.tagName.toUpperCase() : "";
    if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT") return;

    if (isScaleMode() && state.currentTarget?.mode === "scale-write") {
      const letter = event.key.toUpperCase();
      if (["C", "D", "E", "F", "G", "A", "B"].includes(letter)) {
        event.preventDefault();
        setScaleWriteSelectedLetter(letter);
        return;
      }
      if (event.key === "-") {
        event.preventDefault();
        cycleScaleWriteAccidental(-1);
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        cycleScaleWriteAccidental(1);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        moveScaleWriteSelection(1);
        return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "ArrowUp") {
        nudgeScaleWriteSelectedNote(1);
        return;
      }
      if (event.key === "ArrowDown") {
        nudgeScaleWriteSelectedNote(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        moveScaleWriteSelection(1);
        return;
      }
      moveScaleWriteSelection(-1);
      return;
    }

    if (!isCustomSongMode() || state.songCustomMode !== "edit") return;

    const letter = event.key.toUpperCase();
    if (["C", "D", "E", "F", "G", "A", "B"].includes(letter)) {
      event.preventDefault();
      setSelectedSongStepLetter(letter);
      return;
    }

    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;

    event.preventDefault();
    if (event.key === "ArrowUp") {
      nudgeSelectedSongStepNote(1);
      return;
    }
    if (event.key === "ArrowDown") {
      nudgeSelectedSongStepNote(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      moveSelectedSongStep(1);
      return;
    }
    moveSelectedSongStep(-1);
  });

  ui.onSongStepClick((payload) => {
    if (!isCustomSongMode()) return;
    if (state.songCustomMode !== "edit") return;
    const stepIndex = Number.isInteger(payload)
      ? payload
      : (payload && Number.isInteger(payload.stepIndex) ? payload.stepIndex : null);
    if (!Number.isInteger(stepIndex)) return;
    if (stepIndex < 0 || stepIndex >= SONG_STEPS) return;
    state.songEditStepIndex = stepIndex;
    enterCustomEditView();
  });
  ui.onScaleWriteStepClick((index) => {
    if (!isScaleMode() || state.currentTarget?.mode !== "scale-write") return;
    if (!Number.isInteger(index) || index < 1 || index >= state.currentTarget.inputNotes.length) return;
    state.currentTarget.selectedIndex = index;
    if (!(state.currentTarget.visitedIndices instanceof Set)) {
      state.currentTarget.visitedIndices = new Set();
    }
    state.currentTarget.visitedIndices.add(index);
    renderScaleWriteNotation();
    updateScaleWriteAccidentalSwitch();
  });

  ui.controls.randomizeSongBtn.addEventListener("click", () => {
    randomizeSongBeats();
    if (isRandomSongMode()) {
      startSongTraining();
    }
  });
  if (ui.controls.randomSongStartOverBtn) {
    ui.controls.randomSongStartOverBtn.addEventListener("click", () => {
      if (!isRandomSongMode()) return;
      startSongTraining();
      ui.setMessage("Restarted current randomized song.");
    });
  }
  if (ui.controls.randomSongGenerationStyle) {
    ui.controls.randomSongGenerationStyle.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["chord", "counterpoint", "jazz"].includes(mode)) return;
      state.randomSongGenerationStyle = mode;
      if (ui.controls.randomSongCounterpointStrictness) {
        ui.controls.randomSongCounterpointStrictness.disabled = mode !== "counterpoint";
      }
      randomizeSongBeats();
      if (isRandomSongMode()) {
        startSongTraining();
      }
    });
  }
  if (ui.controls.randomSongCounterpointStrictness) {
    ui.controls.randomSongCounterpointStrictness.disabled = state.randomSongGenerationStyle !== "counterpoint";
    ui.controls.randomSongCounterpointStrictness.addEventListener("change", (event) => {
      const mode = event.target.value;
      if (!["light", "strict"].includes(mode)) return;
      state.randomSongCounterpointStrictness = mode;
      if (state.randomSongGenerationStyle !== "counterpoint") return;
      randomizeSongBeats();
      if (isRandomSongMode()) {
        startSongTraining();
      }
    });
  }
  if (ui.controls.randomSongPlayBarChordsToggle) {
    ui.controls.randomSongPlayBarChordsToggle.addEventListener("change", (event) => {
      state.randomSongPlayBarChordsEnabled = !!event.target.checked;
      if (isRandomSongMode() && state.songActiveBeat < state.songBeats.length) {
        const barIndex = Math.floor(state.songActiveBeat / STEPS_PER_BAR);
        if (state.randomSongPlayBarChordsEnabled) {
          startRandomSongBarCueLoop(barIndex);
        } else {
          stopRandomSongBarCueLoop();
        }
      }
    });
  }
  if (ui.controls.randomSongCueTempoSlider) {
    ui.controls.randomSongCueTempoSlider.addEventListener("input", (event) => {
      const bpm = Math.max(40, Math.min(180, parseInt(event.target.value, 10) || 96));
      state.randomSongCueTempoBpm = bpm;
      if (ui.controls.randomSongCueTempoValue) {
        ui.controls.randomSongCueTempoValue.textContent = `${bpm} BPM`;
      }
    });
  }
  if (ui.controls.randomSongCueVolumeSlider) {
    ui.controls.randomSongCueVolumeSlider.addEventListener("input", (event) => {
      const v = Math.max(0, Math.min(100, parseInt(event.target.value, 10) || 0));
      state.randomSongCueVolume = v / 100;
      if (ui.controls.randomSongCueVolumeValue) {
        ui.controls.randomSongCueVolumeValue.textContent = `${v}%`;
      }
    });
  }
  if (ui.controls.randomSongCueVelocitySlider) {
    ui.controls.randomSongCueVelocitySlider.addEventListener("input", (event) => {
      const v = Math.max(0, Math.min(100, parseInt(event.target.value, 10) || 0));
      state.randomSongCueVelocity = v / 100;
      if (ui.controls.randomSongCueVelocityValue) {
        ui.controls.randomSongCueVelocityValue.textContent = `${v}%`;
      }
    });
  }

  ui.controls.songSaveBtn.addEventListener("click", () => {
    const name = ui.controls.songNameInput.value.trim();
    if (!name) {
      ui.setMessage("Enter a song name to save.");
      return;
    }
    const songs = loadSongsFromStorage();
    songs[name] = state.songBeats.map((entry) => ({ ...entry }));
    saveSongsToStorage(songs);
    refreshSongLoadSelect();
    ui.controls.songLoadSelect.value = name;
    ui.setMessage(`Saved song: ${name}`);
  });

  ui.controls.songLoadBtn.addEventListener("click", () => {
    const name = ui.controls.songLoadSelect.value;
    if (!name) return;
    const songs = loadSongsFromStorage();
    const beats = songs[name];
    if (!Array.isArray(beats)) return;
    state.songBeats = normalizeSongBeats(beats);
    state.customSongBeats = cloneSongBeats(state.songBeats);
    state.songViewStartStep = null;
    renderSongStepEditor();
    ui.controls.songNameInput.value = name;
    ui.setMessage(`Loaded song: ${name}`);
    if (isCustomSongMode() && state.songCustomMode === "edit") {
      enterCustomEditView();
    } else if (isSongMode()) {
      startSongTraining();
    }
  });

  ui.controls.songDeleteBtn.addEventListener("click", () => {
    const name = ui.controls.songLoadSelect.value || ui.controls.songNameInput.value.trim();
    if (!name) return;
    const songs = loadSongsFromStorage();
    if (!songs[name]) return;
    delete songs[name];
    saveSongsToStorage(songs);
    refreshSongLoadSelect();
    if (ui.controls.songNameInput.value.trim() === name) {
      ui.controls.songNameInput.value = "";
    }
    ui.setMessage(`Deleted song: ${name}`);
  });

  refreshSongLoadSelect();
  refreshModeChrome();
  refreshSongBrowseState();
}

function setupAudioListener() {
  let lastDetectedText = "";
  if (typeof AudioEngine.onLevel === "function") {
    AudioEngine.onLevel((level) => {
      const numericLevel = Math.max(0, Math.min(1, Number(level) || 0));
      const delta = numericLevel - state.songPrevInputLevel;
      if (isSongMode() && !(isCustomSongMode() && state.songCustomMode === "edit")) {
        if (
          state.songAttackArmed &&
          numericLevel >= 0.18 &&
          delta >= 0.05
        ) {
          state.songAttackReady = true;
          state.songAttackArmed = false;
        }
      }
      state.songPrevInputLevel = numericLevel;
      if (typeof ui.setInputLevel === "function") {
        ui.setInputLevel(numericLevel);
      }
    });
  }

  AudioEngine.onNote(({ note, confidence, freq }) => {
    ui.updateConfidence(confidence, CONFIDENCE_MAX);
    ui.setTunerState({ freq, note, confidence, noteToFreq, centsOff });
    const detectedText = `Detected: ${note || "—"}`;
    if (detectedText !== lastDetectedText) {
      ui.setDetectedNote(detectedText);
      lastDetectedText = detectedText;
    }

    if (isSongMode()) {
      if (isCustomSongMode() && state.songCustomMode === "edit") return;
      if (confidence < 3) return;
      if (state.songActiveBeat >= state.songBeats.length) return;
      const expected = state.songBeats[state.songActiveBeat];
      if (isSilentSongStep(expected)) {
        completeSongStep(null);
        return;
      }
      const detectedMidi = noteToMidi(note);
      const expectedMidi = noteToMidi(expected.note);
      const repeatedExpected =
        expectedMidi !== null &&
        state.songLastAcceptedMidi !== null &&
        expectedMidi === state.songLastAcceptedMidi;
      if (repeatedExpected && !state.songAttackReady) {
        return;
      }
      if (detectedMidi !== null && expectedMidi !== null && detectedMidi === expectedMidi) {
        state.songLastAcceptedMidi = expectedMidi;
        ui.setMessage("🎯 Correct!");
        completeSongStep(findPreferredPositionForMidi(detectedMidi));
      }
      return;
    }
    if (!state.currentTarget) return;
    if (state.questionAnswered) return;
    if (confidence < 3) return;
    if (
      state.currentTarget.mode === "interval-ear"
      && Date.now() < (state.intervalEarIgnoreUntil || 0)
    ) {
      return;
    }

    const detectedMidi = noteToMidi(note);
    if (state.currentTarget.mode === "scale") {
      const idx = state.currentTarget.scaleIndex || 0;
      const expectedMidi = state.currentTarget.scaleMidis?.[idx];
      if (detectedMidi === null || detectedMidi !== expectedMidi) {
        return;
      }
      state.currentTarget.correctPos = findPreferredPositionForMidi(detectedMidi);
      ui.clearCorrectFret();
      if (state.currentTarget.correctPos) {
        ui.highlightCorrectFret(state.currentTarget.correctPos);
      }
      if (idx > 0) {
        state.currentTarget.revealedNotes.push(state.currentTarget.scaleNotes[idx]);
      }
      state.currentTarget.scaleIndex = idx + 1;
      if (state.currentTarget.scaleIndex >= state.currentTarget.scaleMidis.length) {
        state.questionAnswered = true;
        ui.setMessage("🎯 Correct scale!");
        renderScaleProgressNotation();
        setTimeout(() => {
          newQuestion();
        }, 900);
        return;
      }
      state.currentTarget.midi = state.currentTarget.scaleMidis[state.currentTarget.scaleIndex];
      renderScaleProgressNotation();
      ui.setMessage("✅ Correct! Continue scale.");
      return;
    }
    if (state.currentTarget.mode === "scale-write") {
      return;
    }
    if (state.currentTarget.mode === "chord-ear") {
      return;
    }

    if (detectedMidi !== null && detectedMidi === state.currentTarget.midi) {
      if (state.currentTarget.mode === "interval-ear") {
        if (Array.isArray(state.currentTarget.revealedNotes)) {
          state.currentTarget.revealedNotes.push(state.currentTarget.n);
          renderIntervalProgressNotation(state.currentTarget.rootNote);
        }
        state.currentTarget.correctPos = findPreferredPositionForMidi(detectedMidi);
        ui.clearCorrectFret();
        if (state.currentTarget.correctPos) {
          ui.highlightCorrectFret(state.currentTarget.correctPos);
        }
        const currentIdx = state.currentTarget.earIndex || 0;
        const total = state.currentTarget.earTargetMidis?.length || 1;
        if (currentIdx + 1 < total) {
          const nextIdx = currentIdx + 1;
          const nextMidi = state.currentTarget.earTargetMidis[nextIdx];
          const nextChain = state.currentTarget.earChain?.[nextIdx];
          state.currentTarget.earIndex = nextIdx;
          state.currentTarget.midi = nextMidi;
          state.currentTarget.n = midiToQuestionNote(nextMidi);
          state.currentTarget.intervalLabel = nextChain?.interval?.label || state.currentTarget.intervalLabel;
          state.currentTarget.direction = nextChain?.direction || state.currentTarget.direction;
          ui.setMessage(`🎯 Correct (${nextIdx}/${total}) — play next hidden note`);
          return;
        }
      }
      state.questionAnswered = true;
      ui.setMessage("🎯 Correct!");
      if (state.trainerMode === "note") {
        ui.highlightCorrectFret(state.currentTarget);
      } else {
        state.currentTarget.correctPos =
          state.currentTarget.correctPos || findPreferredPositionForMidi(state.currentTarget.midi);
        if (state.currentTarget.correctPos) {
          ui.highlightCorrectFret(state.currentTarget.correctPos);
        }
      }

      setTimeout(() => {
        newQuestion();
      }, 900);
    }
  });
}

function showRuntimeHintIfNeeded() {
  if (location.protocol !== "file:") return;
  ui.showRuntimeHint(
    "Opened as a local file. For reliable microphone/audio, launch Fretboard Trainer Launcher.app (temporary server auto-stops)."
  );
}

function setupBoard() {
  ui.buildFretboard(tuning, handleCellClick);
  requestAnimationFrame(() => {
    ui.addFretMarkers();
  });

  window.addEventListener("resize", () => {
    ui.buildFretboard(tuning, handleCellClick);
    requestAnimationFrame(() => {
      ui.addFretMarkers();
      syncBoard();
    });
  });
}

async function init() {
  state.customSongBeats = createDefaultSongBeats();
  state.songBeats = cloneSongBeats(state.customSongBeats);
  state.randomSongBeats = [];
  try {
    setupControls();
  } catch (err) {
    console.error("Controls setup failed:", err);
  }

  try {
    setupBoard();
  } catch (err) {
    console.error("Fretboard setup failed:", err);
  }

  try {
    setupAudioListener();
  } catch (err) {
    console.error("Audio listener setup failed:", err);
  }
  showRuntimeHintIfNeeded();

  try {
    await loadDevices();
    newQuestion();
  } catch (err) {
    console.error("Audio device initialization failed:", err);
    ui.setMessage("Audio initialization failed. Use Fretboard Trainer Launcher.app and allow microphone access.");
  }
}

init();
