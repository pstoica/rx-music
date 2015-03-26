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

exports.cycle = function (transform, ...items) {
  let tick = 0;

  return (event) => {
    let item = items[tick++];
    tick = tick % items.length;

    return transform(item)(event);
  };
};

exports.random = function (transform, ...items) {
  return (event) => {
    let position = Math.floor(Math.random() * items.length);
    let item = items[position];

    return transform(item)(event);
  };
};

exports.stack = function (transform, ...items) {
  return (event) => {
    return Bacon.fromArray(items)
      .flatMap(item => {
        return transform(item)(event);
      });
  };
};

exports.passThrough = function (x) {
  return () => x;
};

function mappable(fn) {
  return (x, event) => {
    return event ?
      fn(x, clone(event)) :
      (event) => fn(x, clone(event));
  };
}

exports.time = {
  add: mappable((x, event) => {
    event.time += tone.notationToSeconds(x);
    return event;
  }),

  delay: mappable((x, event) => {
    return Bacon.once(event)
      .map(exports.time.add(x))
      .delay(0)
      .holdWhen(transportDelay(x));
  })
};

exports.note = {
  add: mappable((x, event) => {
    event.note = Math.max(0, event.note + x);
    return event;
  }),

  set: mappable((x, event) => {
    event.note = x;
    return event;
  })
};

exports.dur = {
  set: mappable((x, event) => {
    event.dur = x;
    return event;
  })
};

exports.vel = {
  add: mappable((x, event) => {
    event.vel += x;
    return event;
  }),

  multiply: mappable((x, event) => {
    event.vel *= x;
    return event;
  }),

  set: mappable((x, event) => {
    event.vel = x;
    return event;
  })
};

exports.start = function (bpm = 140) {
  Tone.Transport.bpm.value = bpm;

  setTimeout(() => {
    Tone.Transport.start();
  }, 500);
};
