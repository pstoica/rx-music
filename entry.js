import Bacon from 'baconjs';
import Tone from 'tone';
import Metronome from './src/Metronome';
import VoiceGroup from './src/VoiceGroup';
import Teoria from 'teoria';

//Tone.Transport.bpm.value = 80;

var tone = new Tone();

//create one of Tone's built-in synthesizers
var synth = new Tone.MonoSynth();

//connect the synth to the master output channel
synth.toMaster();

function transportDelay(delay) {
  return Bacon.fromBinder(sink => {
    sink(true);

    Tone.Transport.setTimeout(() => {
      sink(false);
      sink(new Bacon.End());
    }, delay);
  });
}

function clone(event) {
  return Object.assign({}, event);
}

function addTime(add) {
  return (event) => {
    let result = clone(event);
    result.time += tone.notationToSeconds(add);
    return result;
  };
}

function addNote(...addable) {
  let tick = 0;

  return (event) => {
    let add = addable[tick++ % addable.length];

    let result = clone(event);
    result.note = Math.max(0, result.note + add);
    return result;
  };
}

function setNote(note) {
  return (event) => {
    let result = clone(event);
    result.note = note;
    return result;
  };
}

function changeVel(mul) {
  return (event) => {
    let result = clone(event);
    result.note *= mul;
    return result;
  };
}

function holdFor(duration) {
  return (event) => {
    return Bacon.once(event)
      .map(addTime(duration))
      .delay(0)
      .holdWhen(transportDelay(duration));
  };
}

function everyN(n, a, b, x) {
  return x % n === 0 ? a : b;
}

let v1 = new VoiceGroup({ scale: 'minor' });

let b1 = new Bacon.Bus().log();
let b2 = new Bacon.Bus().log();
let b3 = new Bacon.Bus();
let b4 = new Bacon.Bus();
let b5 = new Bacon.Bus();

v1.plug(Bacon.mergeAll(b1, b2, b5));

let metronome = new Metronome();

b1.plug(
  metronome.first()
);

b2.plug(
  b1.flatMap(holdFor('8n'))
    .map(addNote(1, 4, 5))
);

b1.plug(
  b2.flatMap(holdFor('8n'))
    .map(addNote(-2, -6))
);

b3.plug(
  b1.merge(b2).flatMap(stackNotes(2, 4))
);

b4.plug(
  b2.flatMap(holdFor('8n'))
    .map(addNote(1))
);

b4.plug(
  Bacon.mergeAll(
    b2.flatMap(holdFor('16n'))
      .map(addNote(-1))
  )
);

b5.plug(
  Bacon.mergeAll(
    b2.flatMap(holdFor('8n'))
      .map(addNote(3)),
    b2.flatMap(holdFor('4n'))
      .map(addNote(3))
  )
);

function stackNotes(...notes) {
  return (event) => {
    return Bacon.fromArray(notes)
      .flatMap(note => {
        return Bacon.once(event).map(addNote(note));
      });
  };
}


setTimeout(() => {
  Tone.Transport.start();
}, 500);

