import Bacon from 'baconjs';
import Tone from 'tone';
import Metronome from './src/Metronome';
import VoiceGroup from './src/VoiceGroup';
import Node from './src/node';

window.Transport = Tone.Transport;
Tone.Transport.bpm.value = 80;

setTimeout(() => {
  Tone.Transport.start();
}, 500);

let metronome = new Metronome();

let voice1 = new VoiceGroup({
  source: metronome
});

let node1 = new Node({
  source: voice1,
  note: 'c3',
  dur: '16n'
});

let node2 = new Node({
  source: node1,
  note: +1,
  when: '8n',
  dur: '32n'
});

node1.plug({
  source: node2,
  note: +1,
  when: '8n',
  dur: '16n'
});
