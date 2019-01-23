export const root = rootBlueprint;
export const component = componentBlueprint;
export const nextTick = waitOnNextTick;
export const randomStr = makeid;

function rootBlueprint(component, { store, meta, head } = {}) {
  return {
    store: optional(store, {}),
    componentTree: component,
    meta: optional(meta, { version: '1.0.0' }),
    head: optional(head, {}),
  };
}

function componentBlueprint(type, attributes = {}) {
  return {
    id: makeid(),
    type,
    ...attributes,
  };
}

function waitOnNextTick(callback) {
  setTimeout(callback, 0);
}

function optional(variable, defaultValue) {
  return variable || defaultValue;
}

function makeid(length = 8) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
