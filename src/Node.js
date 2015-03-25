import Bacon from 'baconjs';
import Teoria from 'teoria';
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

  nextNote({ note, voice }) {
    let scale = voice.scale;
    let next = this.notes[this.counter % this.notes.length].toString().split(':');
    let result;

    if (!isNaN(next[0])) {
      // relative pitch
      let octave = note.octave();
      let name = note.toString(true);
      let scaleNotes = scale.simple();
      let scaleLength = scaleNotes.length;
      let lastPosition = scaleLength - 1;
      let position = scaleNotes.indexOf(name);

      let down = next < 0;
      let up = !down;

      for (let i = Math.abs(next); i > 0; i--) {
        position += (down ? -1 : 1);

        if (down && position < 0) {
          position = lastPosition;
          octave--;
        } else if (up && position > lastPosition) {
          position = 0;
          octave++;
        }
      }

      result = Teoria.note(scaleNotes[position] + octave);
    } else {
      result = Teoria.note(next[0]);
    }

    result.duration = next[1];
    return result;
  }

  addEdges(edges) {
    return edges.map(edge => this.addEdge(edge));
  }

  addEdge({ filter, source, when = 0 }) {
    source.subscribe(event => {
      let payload = event.value();
      let { voice } = payload;

      if (filter && !filter(this.counter)) {
        return;
      }

      let nextNote = this.nextNote(payload);

      voice.play({
        note: nextNote,
        duration: nextNote.duration || '16n',
        when: when
      }, (nextPayload) => {
        this.emit(nextPayload);
      });
    });
  }
}
