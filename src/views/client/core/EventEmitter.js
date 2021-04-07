class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, cb) {
    if (this.events[type] === undefined) {
      this.events[type] = [];
    }

    this.events[type].push(cb);
  }

  emit(type, ...args) {
    const fns = this.events[type];
    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = fns.length; i < l; i++) {
      fns[i](...args);
    }
  }
}

export default EventEmitter;
