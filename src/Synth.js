import Tone from 'tone';

export default class Synth {
  constructor({ oscillator = { type: 'triangle' } } = {}) {
    this.synth = new Tone.PolySynth(12, Tone.MonoSynth);
    this.synth.set({
      filterEnvelope: {
        min: 20000,
        max: 20000
      },
      filter: {
        type: 'allpass'
      },
      oscillator
    });

    this.synth.toMaster();
    return this.synth;
  }
}

