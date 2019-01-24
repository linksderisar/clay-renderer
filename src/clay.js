export default class Clay {
  constructor({ id }) {
    this._id = id;
  }

  get id() {
    if (!this._id) {
      console.warn('Component must be rendered with Clay to get an Clay id');
      return null;
    }
    return this._id;
  }
}
