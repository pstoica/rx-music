## WIP

## Setting Up (this was done beforehand)
```
let U = ReactiveMusic.Utils;

// make some buses
let b = U.bus.pool(3);

// make some voices
let v = [
  new Voice({
    scale: 'major',
    synth: new Synth2()
  }),
  new Voice({
    scale: 'major',
    synth: new Synth1()
  }),
];
```

## Click to see each of these steps

## Metronome
```
// sends note 0 every quarter note
let m = new Metronome();

// start tickin
U.start();
```

## First Bus
```
// Copy metronome stream
// Plays note 0 every quarter note
// m -> b0
b[0].plug(m);
```

## Back and Forth
```
// b0 -> b1
b[1].plug(
  b[0]
    // take only one event
    .first()
    // move event by 8th note
    .flatMap(U.time.delay('8n'))
    // play note 0 + 2
    .map(U.note.add, 2)
);

// b1 -> b2
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

// b2 -> b1
b[1].plug(
  b[2]
    // do the same as b1 -> b2
    // this time: b2 -> b1
    .flatMap(U.time.delay('8n'))
    .map(
      U.cycle(U.note.add, 2, -2)
    )
);
```

## First Voice
```
// [b0, b1, b2] -> v0
v[0].plug(
  // merge all buses into one
  Bacon.mergeAll(b)
);
```

## Second Voice
```
// v0 -> v1
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
```
