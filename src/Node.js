import Bacon from 'baconjs';
import Tone from 'tone';
import Bus from './Bus';
import Synth from './Synth';

const tone = new Tone();

function nextNote(previous, next) {
  if (typeof next === 'number') {
    // relative pitch
    return tone.midiToNote(tone.noteToMidi(previous) + next);
  } else {
    return next;
  }
}

export default class Node extends Bus {
  constructor(...connections) {
    super();

    connections.forEach(connection => {
      this.plug(connection);
    });
  }

  plug(options) {
    const { source, note, dur, when = 0 } = options;

    source.subscribe(event => {
      let payload = event.value();
      let { voice, note: previousNote } = payload;

      voice.play({
        note: nextNote(previousNote, note),
        dur: dur,
        when: when
      }, (nextPayload) => {
        this.emit(nextPayload);
      });
    });
  }

  unplug() {

  }
}
