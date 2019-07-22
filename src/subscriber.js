const activeListeners = {
  mutation: {},
};

const registeredStores = new Map();

const subscriber = function subscriber(vrrStoreUpdatePath, mutation) {
  const {type} = mutation; // endpoint

  if (type !== vrrStoreUpdatePath) {
    return;
  }

  const {id, status, endpoint} = mutation.payload;
  const listeners = activeListeners.mutation[endpoint] && activeListeners.mutation[endpoint][id];

  if (!listeners) {
    return;
  }

  if (status === 'success') {
    const successIteratee = function successIteratee({callbacks}) {
      if (callbacks.onSuccess) {
        callbacks.onSuccess(id);
      }
    };

    listeners.forEach(successIteratee);
  } else if (status === 'timeout' || status === 'failed' || status === 'canceled') {
    const timeoutIteratee = function timeoutIteratee({callbacks}) {
      if (callbacks.onFail) {
        callbacks.onFail(mutation.payload);
      }
    };

    listeners.forEach(timeoutIteratee);
  } else if (status === 'slow') {
    const slowIteratee = function slowIteratee({callbacks}) {
      if (callbacks.onSlow) {
        callbacks.onSlow();
      }
    };

    listeners.forEach(slowIteratee);
  }
};

export default class Subscriber {
  constructor(endpoint, uuid, store, vrrStoreUpdatePath) {
    this.endpoint = endpoint;
    this.uuid = uuid;
    this.callbacks = {};
    this.store = store;

    if (!registeredStores.get(store)) {
      const unsubscriber = store.subscribe(subscriber.bind(null, vrrStoreUpdatePath));
      registeredStores.set(store, unsubscriber);
      // NOTE: if needed we can call "unsubscriber", but probably we never un-mount VRR
    }

    this.registerListener();

    return this;
  }

  registerListener() {
    if (!activeListeners.mutation[this.endpoint]) {
      activeListeners.mutation[this.endpoint] = {};
    }

    if (!activeListeners.mutation[this.endpoint][this.uuid]) {
      activeListeners.mutation[this.endpoint][this.uuid] = [];
    }

    activeListeners.mutation[this.endpoint][this.uuid].push(this);
  }

  unregisterListener() {
    const index = activeListeners.mutation[this.endpoint][this.uuid].indexOf(this);
    activeListeners.mutation[this.endpoint][this.uuid].splice(index, 1);
  }

  onSuccess(fn) {
    this.callbacks.onSuccess = (id) => {
      fn(id);
      this.unregisterListener();
    };

    return this;
  }

  onSlow(fn) {
    this.callbacks.onSlow = fn;

    return this;
  }

  onFail(fn) {
    this.callbacks.onFail = (requestData) => {
      fn(requestData);
      this.unregisterListener();
    };

    return this;
  }
}
