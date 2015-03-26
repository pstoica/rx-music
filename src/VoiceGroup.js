import Teoria from 'teoria';
import Bacon from 'baconjs';

import Synth from './Synth';

export default class VoiceGroup {
  constructor({ root = 'c3', scale = 'major' } = {}) {
    this.bus = new Bacon.Bus();
    this.synth = new Synth();
    this.root = Teoria.note(root);
    this.scale = this.root.scale(scale);

    this.bus.onValue(this.handleValue.bind(this));

    return this.bus;
  }

  handleValue({ note, dur = '32n', time }) {
    this.synth.triggerAttackRelease(this.convertNote(note), dur, time);
  }

  convertNote(note) {
    let downward = note < 0;
    let sign = downward ? -1 : 1;

    let scaleLength = this.scale.scale.length;

    let octave = this.root.octave() + (Math.floor(note / scaleLength));
    let position = (note % scaleLength) + 1;

    let noteName = this.scale.get(position).toString(true) + octave;

    return noteName;
  }
}

