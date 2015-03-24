import Bacon from 'baconjs';

let buses = 0;

export default class Bus {
  constructor() {
    this.bus = new Bacon.Bus();
    this.id = buses++;
    this.state = {
      counter: 0
    };
  }

  emit(state) {
    let nextState = state;

    if (typeof state === 'function') {
      nextState = state(this.state);
    }

    this.state = Object.assign(this.state, nextState, {
      counter: this.state.counter + 1
    });

    this.bus.push(this.state);
  }

  subscribe(handler) {
    return this.bus.subscribe(handler);
  }
}

