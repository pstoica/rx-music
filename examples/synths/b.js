import Tone from 'tone';

export default function () {
  let s = new Tone.PolySynth(12, Tone.MonoSynth);
  s.set({
    oscillator: {
      type: 'triangle'
    },
    filterEnvelope: {
      min: 20000,
      max: 20000
    }
  });

  s.toMaster();
  return s;
}
