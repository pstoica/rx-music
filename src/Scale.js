import Tone from 'tone';

import Note from './Note';
import scales from './utils/scales';

const tone = new Tone();

export default class Scale {
  constructor(root = 'c3', scale = 'major') {
    if (typeof root === 'string') {
      this.root = tone.noteToMidi(root);
    } else {
      this.root = root;
    }

    if (typeof scale === 'string') {
      this.degrees = scales[scale] || scales.major;
    } else {
      this.degrees = scale;
    }
  }

  degreeToSemitones(d, note) {
    let result = 0;
    let degrees = this.degrees;

    if (d < 0) {
      // goin backwards
      d = -d;

      degrees = [].concat(degrees).map(x => {
        return x - 12;
      });
    }

    for (let i = note && note.degree || 0; i < d; i++) {
      result += degrees[i % degrees.length];
    }

    //console.log(result);

    return result;
  }

  degreeToNote(d, note) {
    if (note && note.degree) {
      d = d + note.degree;
    }
    console.log(d);

    let semitones = this.degreeToSemitones(d, note);
    return new Note(this.root + semitones, d);
  }
}
