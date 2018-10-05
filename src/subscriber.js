const activeListeners = {
  mutation: {},
};

const registeredStores = {};
const subscriber = function subscriber(mutation) {
  const {type} = mutation; // endpoint

  if (type !== 'Requests/updateRequest') {
    return;
  }

  const {uuid, status, endpoint, response} = mutation.payload;
  const listeners = activeListeners.mutation[endpoint] && activeListeners.mutation[endpoint][uuid];

  if (!listeners) {
    return;
  }

  if (status === 'success') {
    const successIteratee = function successIteratee({callbacks}) {
      if (callbacks.onSuccess) {
        callbacks.onSuccess(response.id);
      }
    };

    listeners.forEach(successIteratee);
  } else if (status === 'timeout' || status === 'failed') {
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

const connectStore = function connectStore(store, stores) {
  if (stores[store]) {
    return;
  }

  stores[store] = store.subscribe(subscriber);
};

export default class Subscriber {
  constructor(endpoint, uuid, store) {
    this.endpoint = endpoint;
    this.uuid = uuid;
    this.callbacks = {};
    this.store = store;
    connectStore(store, registeredStores);
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
