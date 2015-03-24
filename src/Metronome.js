import Bacon from 'baconjs';
import Tone from 'tone';

import Bus from './Bus';

export default class Metronome extends Bus {
  constructor() {
    super();

    Tone.Transport.setInterval(() => {
      this.emit();
    }, '4n');
  }

  subscribe(handler) {
    this.bus.subscribe(event => {
      handler(event);
      return Bacon.noMore;
    });
  }
}

export default Metronome;
