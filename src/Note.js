import Tone from 'tone';

const tone = new Tone();

export default class Note {
  constructor(note, degree) {
    this.degree = degree;

    if (typeof note === 'string') {
      this.midi = tone.noteToMidi(note);
      this.note = note;
    } else {
      this.midi = note;
      this.note = tone.midiToNote(note);
    }
  }
}

