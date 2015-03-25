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
  notes: 0,
  edges: [
    { source: voice1 }
  ]
});

let node2 = new Node({
  notes: [1],
  edges: [
    { source: node1, when: '8n' }
  ]
});

let node3 = new Node({
  notes: [1, -1],
  edges: [
    {
      source: node2,
      when: '8n',
      dur: '16n',
      filter: (counter) => counter % 2 === 0
    }
  ]
});

node2.addEdge({ source: node3, when: '16n' });

let node4 = new Node({
  notes: [1, -1],
  edges: [
    { source: node3, when: '8n' }
  ]
});

node3.addEdge({
  source: node4,
  when: '16n',
  filter: (counter) => counter % 2 !== 0
});

setTimeout(() => {
  Tone.Transport.start();
}, 500);

