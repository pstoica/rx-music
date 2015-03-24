var Rx = require('rx');
var Tone = require('tone');

var tone = new Tone();
Tone.Transport.bpm.value = 80;
Tone.Transport.start();

var metronome = new Rx.Subject();
metronome.subscribe(() => {
  console.log('tick');
});

Tone.Transport.setInterval(function(time){
  metronome.onNext(time);
}, "4n");

function createSynth() {
  var synth = new Tone.MonoSynth({
    filter: {
      type: 'allpass'
    },
    oscillator: {
      type: 'triangle'
    }
  });

  synth.toMaster();
  return synth;
}

let _nodes = 0;

function createNode(source, options) {
  const id = _nodes++;
  const synth = createSynth();
  const subject = new Rx.Subject();
  const { note, dur, when } = options;

  source.subscribe(function (time) {
    Tone.Transport.setTimeout(time => {
      console.log(id);
      subject.onNext(time);

      synth.triggerAttackRelease(tone.midiToNote(note + 12), dur, time);
    }, when);
  });

  return subject;
}


var node1 = createNode(metronome, {
  note: 60,
  when: '8n',
  dur: '8n'
});

var node2 = createNode(node1, {
  note: 62,
  when: '16n',
  dur: '8n'
});

var node3 = createNode(node2, {
  note: 64,
  when: '16n',
  dur: '8n'
});

var node4 = createNode(node3, {
  note: 72,
  when: '8n',
  dur: '8n'
});

var node5 = createNode(node4, {
  note: 67,
  when: '4n',
  dur: '8n'
});

