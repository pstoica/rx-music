import Bus from './Bus';
import Synth from './Synth';
import Tone from 'tone';
import Teoria from 'teoria';

const tone = new Tone();

export default class VoiceGroup extends Bus {
  constructor({ source, note = 'c3', scale = 'major' }) {
    super();

    this.synth = new Synth();
    this.note = Teoria.note(note);
    this.scale = this.note.scale(scale);

    source.subscribe(event => {
      this.emit({
        note: this.note,
        voice: this
      });
    });
  }

  play(payload, next) {
    let { note, duration, when } = payload;

    Tone.Transport.setTimeout(time => {
      this.synth.play(note.toString(), duration, time);

      next({ note, voice: this });
    }, when);
  }
}
