import Bacon from 'baconjs';
import Tone from 'tone';
import React from 'react';

import { Metronome, Synth, Voice, Utils } from 'RM';
import Visualizer from './Visualizer';
import Synth1 from './synths/a';
import Synth2 from './synths/b';

const U = Utils;

let m = new Metronome();
let b = U.bus.pool(3);
let v = [
  new Voice({
    scale: 'major',
    synth: new Synth2()
  }),
  new Voice({
    scale: 'major',
    synth: new Synth1()
  })
];


function* tutorial() {
  U.start(30);

  yield true;

  // Copy metronome stream
  b[0].plug(m);
  yield true;

  v[0].plug(
    // merge all buses into one
    Bacon.mergeAll(b)
  );

  yield true;

  b[1].plug(
    b[0]
      // take only one event
      .first()
      // move event by 8th note
      .flatMap(U.time.delay('8n'))
      // play note 0 + 2
      .map(U.note.add, 2)
  );

  b[2].plug(
    b[1]
      // delay by 8th note
      .flatMap(U.time.delay('8n'))
      // cycle between:
      //   note + 2
      //   note - 2
      .map(
        U.cycle(U.note.add, 2, -2)
      )
  );

  b[1].plug(
    b[2]
      .flatMap(U.time.delay('8n'))
      // cycle between:
      //   note - 2
      //   note + 2
      .map(
        U.cycle(U.note.add, 2, -2)
      )
  );

  yield true;

  v[1].plug(
    v[0]
      .flatMap(U.time.delay('16n'))
      // up one octave
      .map(U.note.add, 12)
      // make a chord
      .flatMap(U.stack(U.note.add, 2, 4))
      // randomize the amplitude
      .map(U.random(U.vel.set, 0.4, 0.6, 0.8))
  );
  yield true;
}

React.render(<Visualizer tutorial={tutorial} metronome={[m]} buses={b} voices={v} />, document.body);

