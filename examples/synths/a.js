import Tone from 'tone';

export default function () {
  let s = new Tone.PolySynth(6, Tone.DuoSynth);
  s.set({
    vibratoAmount: 0.2,
    vibratoRate: 5,
    harmonicity: 1,
    voice0: {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        release: 1
      },
      filter: {
        type: 'lowpass'
      },
      filterEnvelope: {
        min: 20000,
        max: 20000
      }
    },
    voice1: {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        release: 1
      },
      filter: {
        type: 'lowpass'
      },
      filterEnvelope: {
        min: 20000,
        max: 20000
      }
    }
  });

  s.toMaster();
  return s;
}
