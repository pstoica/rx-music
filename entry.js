var Rx = require('rx');
var Tone = require('tone');
var WAAClock = require('waaclock');

var tone = new Tone();

var audioContext = new AudioContext();
var clock = new WAAClock(audioContext);
clock.start();

var metronome = new Rx.Subject();

clock.callbackAtTime(function() {
  metronome.onNext({
    playbackTime: audioContext.currentTime
  });
}, 1).repeat(1);


function createNode(source, options) {
  var synth = new Tone.MonoSynth({
    filterEnvelope: {
      min: 2000,
      max: 2000
    },
    oscillator: {
      type: "square"
    }
  });

  synth.toMaster();

  function play(e, options, onEnd) {
    var note = options.note;
    var dur = options.dur;
    var at = options.at;

    clock.callbackAtTime(function () {
      onEnd({
        playbackTime: audioContext.currentTime
      });
      synth.triggerAttackRelease(tone.midiToNote(note), dur);
    }, e.playbackTime + at);
  }

  var subject = new Rx.Subject();

  source.subscribe(function (e) {
    console.log('observer');
    play(e, options, function (e) {
      subject.onNext(e);
    });
  });

  return subject;
}

// Create observable to handle the messages

var node1 = createNode(metronome, {
  note: 60,
  at: 0.5,
  dur: 0.1
});

var node2 = createNode(node1, {
  note: 62,
  at: 0.5,
  dur: 0.1
});

var node3 = createNode(node2, {
  note: 64,
  at: 0.75,
  dur: 0.1
});

var node4 = createNode(node3, {
  note: 72,
  at: 0.25,
  dur: 0.1
});

var node5 = createNode(node4, {
  note: 67,
  at: 0.125,
  dur: 0.1
});

