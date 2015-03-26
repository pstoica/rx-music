import Bacon from 'baconjs';
import Tone from 'tone';

export default class Metronome {
  constructor({ div = '4n', note = 12,
                dur = '64n', vel = 1 } = {}) {
    return Bacon.fromBinder(sink => {
      Tone.Transport.setInterval(time => {
        sink({ time, note, dur, vel });
      }, div);
    });
  }
}
