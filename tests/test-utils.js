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
        id: makeid(),
        type: type,
        ...attributes
    }
}

function optional(variable, defaultValue) {
    return variable ? variable : defaultValue;
}

function makeid(length = 8) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
