import Bacon from 'baconjs';
import Tone from 'tone';

export default function Metronome(subdivision = '4n') {
  return Bacon.fromBinder(sink => {
    Tone.Transport.setInterval(time => {
      sink({ time });
    }, subdivision);
  });
}
