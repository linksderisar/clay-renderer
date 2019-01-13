export const root = rootBlueprint;
export const component = componentBlueprint;

function rootBlueprint(component, {store, meta, head} = {}) {
    return {
        "store": optional(store, {}),
        "componentTree": component,
        "meta": optional(meta, {"version": "1.0.0"}),
        "head": optional(head, {})
    }
}

function componentBlueprint(type, attributes = {}) {
    return {
        id: Math.random(),
        type: type,
        ...attributes
    }
}

function optional(variable, defaultValue) {
    return variable ? variable : defaultValue;
}
