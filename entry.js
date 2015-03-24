import Bacon from 'baconjs';
import Tone from 'tone';
import Metronome from './src/Metronome';
import VoiceGroup from './src/VoiceGroup';
import Node from './src/Node';

window.Transport = Tone.Transport;
Tone.Transport.bpm.value = 80;

let metronome = new Metronome();

let voice1 = new VoiceGroup({
  source: metronome
});

let node1 = new Node({
  notes: [1, -1],
  edges: [
    { source: voice1, dur: '16n' }
  ]
});

let node2 = new Node({
  notes: [2, -2, 4],
  edges: [
    { source: node1, when: '8n', dur: '32n' }
  ]
});

node1.addEdge({ source: node2, when: '8n', dur: '16n' });

setTimeout(() => {
  Tone.Transport.start();
}, 500);

