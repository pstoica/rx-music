import Bacon from 'baconjs';
import Tone from 'tone';

import { Metronome, Synth, Voice, Utils } from 'RM';

const U = Utils;

let m = new Metronome();

let v = [
  new Voice({ scale: 'minor' }).log()
];

let b = U.bus.pool(5);
v[0].plug(Bacon.mergeAll(b));

b[0].plug(
  m.first()
);

b[1].plug(
  b[0].flatMap(U.time.hold('8n'))
    .map(U.note.add(1, 4, 5))
    .map(U.vel.add(0.3))
);

b[0].plug(
  b[1].flatMap(U.time.hold('8n'))
    .map(U.note.add(-2, -6))
    .map(U.vel.add(-0.3))
);


//b[4].plug(
  //b[2].flatMap(U.time.hold('8n'))
    //.map(U.note.add(1))
//);

//b[4].plug(
  //Bacon.mergeAll(
    //b[2].flatMap(U.time.hold('16n'))
      //.map(U.note.add(-1))
  //)
//);

b[2].plug(
  Bacon.mergeAll(
    b[1].flatMap(U.time.hold('8n'))
      .map(U.note.add(3))
      .map(U.vel.add(-0.3)),
    b[1].flatMap(U.time.hold('4n'))
      .map(U.note.add(3))
      .map(U.vel.add(-0.5))
  )
);

Tone.Transport.bpm.value = 140;

setTimeout(() => {
  Tone.Transport.start();
}, 500);

