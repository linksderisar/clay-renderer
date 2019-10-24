export default class Clay {
  _store;

  constructor({ id, store }) {
    this._id = id;
    this._store = store;
  }

  get id() {
    if (!this._id) {
      console.warn('Component must be rendered with Clay to get an Clay id');
      return null;
    }
    return this._id;
  }

  getStore(id) {
    if (this._store[id] === undefined) {
      throw new Error(`Store for ${id} does not exist!`);
    }

    return this._store[id];
  }
}
