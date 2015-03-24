import Tone from 'tone';

export default class Synth {
  constructor() {
    this.synth = new Tone.PolySynth(6, Tone.MonoSynth);
    this.synth.set({
      filterEnvelope: {
        min: 20000,
        max: 20000
      },
      filter: {
        type: 'allpass'
      },
      oscillator: {
        type: 'triangle'
      }
    });

    this.synth.toMaster();
  }

  play() {
    this.synth.triggerAttackRelease(...arguments);
  }
}

