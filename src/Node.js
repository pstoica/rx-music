import Bacon from 'baconjs';
import Tone from 'tone';
import Bus from './Bus';
import Synth from './Synth';

const tone = new Tone();

export default class Node extends Bus {
  constructor({ notes, edges = [] } = {}) {
    super();

    this.notes = [].concat(notes);

    this.addEdges(edges);
  }

  nextNote(previous) {
    let next = this.notes[this.counter % this.notes.length];

    if (typeof next === 'number') {
      // relative pitch
      return tone.midiToNote(tone.noteToMidi(previous) + next);
    } else {
      return next;
    }
  }

  addEdges(edges) {
    return edges.map(edge => this.addEdge(edge));
  }

  addEdge({ source, dur, when = 0 }) {
    source.subscribe(event => {
      let payload = event.value();
      let { voice, note } = payload;

      voice.play({
        note: this.nextNote(note),
        dur: dur,
        when: when
      }, (nextPayload) => {
        this.emit(nextPayload);
      });
    });
  }
}
