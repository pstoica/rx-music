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

function addTime(time, notation) {
  return time + tone.notationToSeconds(notation);
}

function holdFor(duration) {
  return (x) => {
    let newVal = Object.assign({}, x, {
      time: addTime(x.time, duration)
    });

    return Bacon.later(0, newVal)
      .holdWhen(transportDelay(duration));
  };
}

function tick(x) {
  return Object.assign({}, x, {
    tick: (x.tick || 0) + 1
  });
}

function setNote(note, usePrev = false) {
  return (x) => Object.assign({}, x, {
    note: usePrev ?
      x.note + note :
      note
  });
}

function modNote(note) {
  return setNote(note, true);
}

function setDur(dur, usePrev = false) {
  return (x) => (
    Object.assign({}, x, {
    dur: usePrev ?
      x.dur + dur :
      dur
    })
  );
}

function modDur(dur) {
  return setDur(dur, true);
}

let v1 = new VoiceGroup();
v1.log();

let b1 = new Bacon.Bus();
let b2 = new Bacon.Bus();

v1.plug(b1);
v1.plug(b2);

let metronome = new Metronome();

b1.plug(
  metronome
    .first()
    .map(tick)
    .map(setNote(0))
    .map(setDur('16n'))
);

b2.plug(
  b1.flatMap(holdFor('8n'))
    .map(tick)
    .map(modNote(1))
    .map(setDur('32n'))
);

b1.plug(
  b2.flatMap(holdFor('4n'))
    .map(tick)
    .map(modNote(-1))
    .map(setDur('16n'))
);




setTimeout(() => {
  Tone.Transport.start();
}, 500);

