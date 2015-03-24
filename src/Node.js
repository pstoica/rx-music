import Bacon from 'baconjs';
import Tone from 'tone';
import Bus from './Bus';
import Synth from './Synth';
import tone from './tone';

let count = 0;

function getID(node) {
  const id = ++count;

  return id;
}

export default class Node extends Bus {
  constructor(...connections) {
    super();
    this.id = getID(this);
    this.state = {
      counter: 0
    };

    connections.forEach(connection => {
      this.plug(connection);
    });
  }

  emit(state) {
    let nextState = state;

    if (typeof state === 'function') {
      nextState = state(this.state);
    }

    this.state = Object.assign(this.state, nextState);
    this.bus.push(this.state);
  }

  plug(options) {
    const synth = new Synth();
    const { source, note, dur, when = 0 } = options;

    source.subscribe(event => {
      Tone.Transport.setTimeout(time => {
        this.emit();

        synth.play(tone.midiToNote(note + 12), dur, time);
      }, when);
    });
  }

  unplug() {

  }
}
