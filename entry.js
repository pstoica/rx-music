import Bacon from 'baconjs';
import Tone from 'tone';
import Metronome from './src/Metronome';
import Node from './src/node';

window.Transport = Tone.Transport;
Tone.Transport.bpm.value = 80;
setTimeout(() => {
  Tone.Transport.start();
}, 500);

let metronome = new Metronome();

let node1 = new Node({
  source: metronome,
  note: 60,
  dur: '16n'
});

let node2 = new Node({
  source: node1,
  note: 69,
  when: '8n',
  dur: '32n'
});

node1.plug({
  source: node2,
  note: 60,
  when: '8n',
  dur: '16n'
});

//var node3 = createNode(node2, {
  //note: 64,
  //when: '2n',
  //dur: '16n'
//});

//var node4 = createNode(node3, {
  //note: 72,
  //when: '4n',
  //dur: '16n'
//});

//var node5 = createNode(node4, {
  //note: 67,
  //when: '2n',
  //dur: '16n'
//});

