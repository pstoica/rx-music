import Bacon from 'baconjs';
import Tone from 'tone';

import { Metronome, Synth, Voice, Utils } from 'RM';

const U = Utils;

let m = new Metronome();

let v = [
  new Voice({
    scale: 'minor',
    synth: new Synth({
      oscillator: { type: 'triangle' }
    })
  }),
  new Voice({
    scale: 'minor',
    synth: new Synth({
      oscillator: { type: 'sine' }
    })
  })
];

let b = U.bus.pool(5);
v[0].plug(
  Bacon
    .mergeAll(b)
    .map(U.note.add, 12)
);

var high = b[1]
  .map(U.note.add, 12)
  .map(U.random(U.note.add, 2, 4))
  .map(U.random(U.vel.set, 0.5, 0.3));

v[1].plug(
  Bacon.mergeAll(
    high
      .flatMap(U.time.delay, '32n'),
    high
      .flatMap(U.time.delay, '4n')
      .map(U.vel.add, -0.2)
      .map(U.dur.set, '8n')
  )
);

b[0].plug(
  m
    .map(U.random(U.note.add, 0, 1, 3, 6))
    .map(U.random(U.vel.set, 1, 0.5, 0.3))
    .map(U.dur.set('16n'))
);

b[1].plug(
  Bacon.mergeAll(
    b[0].flatMap(U.time.delay('8n'))
      .map(U.cycle(U.note.add, 2, 4)),
    b[0].flatMap(U.time.delay('4n'))
      .map(U.cycle(U.note.add, 3, 5))
  )
);

b[2].plug(
  b[0].flatMap(U.stack(U.note.add, 3, 5))
    .map(U.vel.set(0.2))
);

U.start();
