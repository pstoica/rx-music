import Bus from './Bus';
import Synth from './Synth';
import Tone from 'tone';

const tone = new Tone();

export default class VoiceGroup extends Bus {
  constructor({ source, note = 'c3' }) {
    super();

    this.synth = new Synth();

    source.subscribe(event => {
      this.emit({
        note,
        voice: this
      });
    });
  }

  play(payload, next) {
    let { note, dur, when } = payload;

    Tone.Transport.setTimeout(time => {
      this.synth.play(note, dur, time);

      next({ note, voice: this });
    }, when);
  }
}
