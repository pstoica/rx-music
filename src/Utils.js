import Bacon from 'baconjs';
import Tone from 'tone';

const tone = new Tone();

function transportDelay(delay) {
  return Bacon.fromBinder(sink => {
    sink(true);

    Tone.Transport.setTimeout(() => {
      sink(false);
      sink(new Bacon.End());
    }, delay);
  });
}

function clone(event) {
  return Object.assign({}, event);
}

exports.bus = {
  pool(n = 5) {
    const buses = [];

    for (let i = 0; i < n; i++) {
      buses.push(new Bacon.Bus());
    }

    return buses;
  }
};

exports.time = {
  add(add) {
    return (event) => {
      let result = clone(event);
      result.time += tone.notationToSeconds(add);
      return result;
    };
  },

  hold(duration) {
    return (event) => {
      return Bacon.once(event)
        .map(this.add(duration))
        .delay(0)
        .holdWhen(transportDelay(duration));
    };
  }
};

exports.note = {
  add(...addable) {
    let tick = 0;

    return (event) => {
      let add = addable[tick++ % addable.length];

      let result = clone(event);
      result.note = Math.max(0, result.note + add);
      return result;
    };
  },

  set(note) {
    return (event) => {
      let result = clone(event);
      result.note = note;
      return result;
    };
  },

  stack(...notes) {
    return (event) => {
      return Bacon.fromArray(notes)
        .flatMap(note => {
          return Bacon.once(event).map(this.add(note));
        });
    };
  }
};

exports.vel = {
  add(x) {
    return (event) => {
      let result = clone(event);
      result.vel += x;

      return result;
    };
  },

  multiply(x) {
    return (event) => {
      let result = clone(event);
      result.vel *= x;

      return result;
    };
  }
};

