import Bacon from 'baconjs';

let buses = 0;

export default class Bus {
  constructor() {
    this.bus = new Bacon.Bus();
    this.id = buses++;
    this.counter = 0;
  }

  emit(payload) {
    this.counter++;

    const nextPayload = Object.assign({}, payload, {
      counter: this.counter
    });

    console.log(nextPayload);

    this.bus.push(nextPayload);
  }

  subscribe(handler) {
    return this.bus.subscribe(handler);
  }
}

