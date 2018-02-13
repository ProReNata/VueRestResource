const activeListeners = {
  mutation: {},
};

/*
const unsubscribe = store.subscribe((mutation, state) => {
  const {type} = mutation; // endpoint
  if (type !== 'Requests/updateRequest') return;

  const {
    uuid, status, endpoint, response,
  } = mutation.payload;
  const listeners = activeListeners.mutation[endpoint] && activeListeners.mutation[endpoint][uuid];
  if (!listeners) return;

  if (status === 'success') {
    listeners.forEach(({callbacks}) => callbacks.onSuccess && callbacks.onSuccess(response.id));
  } else if (status === 'timeout' || status === 'failed') {
    listeners.forEach(({callbacks}) => callbacks.onFail && callbacks.onFail(status, mutation.payload));
  } else if (status === 'slow') {
    listeners.forEach(({callbacks}) => callbacks.onSlow && callbacks.onSlow());
  }
});
*/

export default class Subscriber{
  constructor(endpoint, uuid, store){
    this.endpoint = endpoint;
    this.uuid = uuid;
    this.callbacks = {};
    this.store = store;
    this.registerListener();
    return this;
  }

  registerListener(){
    if (!activeListeners.mutation[this.endpoint]) {
      activeListeners.mutation[this.endpoint] = {};
    }
    if (!activeListeners.mutation[this.endpoint][this.uuid]) {
      activeListeners.mutation[this.endpoint][this.uuid] = [];
    }

    activeListeners.mutation[this.endpoint][this.uuid].push(this);
  }

  unregisterListener(){
    const index = activeListeners.mutation[this.endpoint][this.uuid].indexOf(this);
    activeListeners.mutation[this.endpoint][this.uuid].splice(index, 1);
  }

  onSuccess(fn){
    this.callbacks.onSuccess = (id) => {
      fn(id);
      this.unregisterListener();
    };
    return this;
  }

  onSlow(fn){
    this.callbacks.onSlow = fn;
    return this;
  }

  onFail(fn){
    this.callbacks.onFail = (status, requestData) => {
      fn(status, requestData);
      this.unregisterListener();
    };
    return this;
  }
}
