/** Clay Renderer convert Json blueprint to Render Function. */

import _ from 'lodash';

const jexl = require('jexl');

const $_SELF = '$_self';
const $_LOOP = 'loop';
const $_LOOP_VALUE = '$_loop_value';
const $_SLOT_PROPS = '$_slot_props';
const REACTIVESTORE = 'clayRenderStore';
const TYPE_TEXT = '$text';

export default class Renderer {
    /**
     * Inject blueprint and VNode function
     *
     * @param {Object} blueprint - Initial json blueprint.
     * @param {function} h - Render function..
     */
    constructor(clayView) {
        this.clayView = clayView;
        this.props = {};
    }

    /**
     * Start render process
     * @param {Object} blueprint - Initial json blueprint.
     * @param {function} h - Render function..
     */
    render(h, {componentTree, store}) {
        this.h = h;

        this.props.clayView = {
            methods: {
                resetStore: this.clayView.resetStore,
            },
        };

        if (_.isUndefined(componentTree)) {
            return {};
        }

        if (!(componentTree instanceof Object) || (componentTree instanceof Array)) {
            throw 'Root Element needs to be an Object';
        }

        this.registerDataStore(store);
        return this.createVNode(componentTree);
    }

    /**
     * Register Datastore
     *
     * @param dataStore
     */
    registerDataStore(dataStore) {
        Object.keys(dataStore).forEach((key) => {
            this.registerData(key, dataStore[key]);
        });
    }

    /**
     * Crates an VModel with a blueprint
     *
     * @param blueprint
     * @returns {*}
     */
    createVNode(blueprint) {
        if (blueprint.if) {
            console.log(this.resolveCondition(blueprint.if));
            if (!this.resolveCondition(blueprint.if)) {
                return null;
            }
        }

        return this.h(
            blueprint.type,
            {
                ...this.createScopedSlots(blueprint),
                ...this.createDataObject(blueprint),
            },
            this.createChildren(blueprint),
        );
    }

    /**
     * Create VNodes from given array with blueprints
     *
     * @param {array|Object} blueprint - Loop through the array and converted Blueprints to VNode.
     * @param {Object} props - Props witch will be passed to scoped slots.
     */
    createVNodes(blueprint) {
        const vNodes = [];

        blueprint.forEach((element) => {
            if (element[$_LOOP]) {
                this.createForNodes(element).forEach(forElement => vNodes.push(forElement));
                return;
            }

            vNodes.push(this.createVNode(element));
        });

        return vNodes;
    }

    /**
     * Creates Nodes in a for loop
     *
     * @param blueprint
     * @returns {Array}
     */
    createForNodes(blueprint) {
        const iterable = this.getBindByRef(blueprint[$_LOOP]);
        const vNodes = [];

        if (_.isObject(iterable) && !(iterable instanceof Array)) {
            Object.keys(iterable).forEach((key, index) => {
                vNodes.push(
                    this.createVNode(
                        this.setForRef(
                            _.cloneDeep(blueprint),
                            key,
                            index,
                        ),
                    ),
                );
            });
            return vNodes;
        }
        if (Array.isArray(iterable)) {
            iterable.forEach((value, index) => {
                vNodes.push(
                    this.createVNode(
                        this.setForRef(
                            _.cloneDeep(blueprint),
                            index,
                            index,
                        ),
                    ),
                );
            });

            return vNodes;
        }

        return vNodes;
    }

    /**
     * Register singel Data container
     *
     * @param id
     * @param data
     */
    registerData(id, data) {
        this.clayView.$set(
            this.clayView[REACTIVESTORE],
            id,
            data,
        );
    }

    /**
     * Creates the Vue Data object for the render function
     *
     * @param blueprint
     * @returns {*}
     */
    createDataObject(blueprint) {
        blueprint = _.cloneDeep(blueprint);

        if (!blueprint.affect && !blueprint.attributes) {
            return {};
        }

        const on = {
            ...this.affect(blueprint),
            ...this.createEvents(blueprint),
        };

        const props = {
            ...this.createProps(blueprint),
        };

        const classes = this.createClass(blueprint);

        const style = {
            ...this.createStyle(blueprint),
        };

        const attrs = {
            ...this.createAttrs(blueprint),
        };

        const vueData = {};

        const slot = this.createSlot(blueprint);

        if (slot !== null) {
            _.assign(vueData, {slot});
        }

        const ref = this.createRef(blueprint);

        if (ref !== null) {
            _.assign(vueData, {ref});
        }

        const refInFor = this.createRefInFor(blueprint);

        if (refInFor !== null) {
            _.assign(vueData, {refInFor});
        }

        const key = this.createKey(blueprint);
        if (key !== null) {
            _.assign(vueData, {key});
        }

        return {
            props,
            on,
            class: classes,
            style,
            attrs,
            ...vueData,
        };
    }

    /**
     * Resolves Condition in blueprint if object
     *
     * @param condition
     * @returns {*}
     */
    resolveCondition(condition) {
        const result = jexl.eval(condition, this.clayView[REACTIVESTORE])
            .then((result) => {
                return Promise.resolve(result);
            });

        return result;
    }

    /**
     * Create Props object
     *
     * @param blueprint
     * @returns {*}
     */
    createProps(blueprint) {
        if (!blueprint.attributes) {
            return {};
        }

        if (!blueprint.attributes.props) {
            return {};
        }

        const {props} = blueprint.attributes;

        if (!_.isObject(props) || props instanceof Array) {
            return {};
        }


        Object.keys(props).forEach((key) => {
            props[key.replace(':', '')] = this.getValueByKey(key, props);
        });

        return props;
    }

    /**
     * Creates Class Object
     *
     * @param blueprint
     * @returns {*}
     */
    createClass(blueprint) {
        return blueprint.attributes ? this.getValueByKey('class', blueprint.attributes) || {} : {};
    }

    /**
     * Creates Style Object
     *
     * @param blueprint
     * @returns {*}
     */
    createStyle(blueprint) {
        const style = blueprint.attributes ? this.getValueByKey('style', blueprint.attributes) || {} : {};

        if (blueprint.show) {
            if (!this.resolveCondition(blueprint.show)) {
                style.display = 'none';
            }
        }

        return style;
    }

    /**
     * Creates Attrs Object
     *
     * @param blueprint
     * @returns {*}
     */
    createAttrs(blueprint) {
        if (!blueprint.attributes) {
            return {};
        }

        if (!blueprint.attributes.attrs) {
            return {};
        }

        const {attrs} = blueprint.attributes;

        if (!_.isObject(attrs) || attrs instanceof Array) {
            return {};
        }

        Object.keys(attrs).forEach(key => attrs[key.replace(':', '')] = this.getValueByKey(key, attrs));

        return attrs;
    }

    /**
     * Creates Slot key
     *
     * @param blueprint
     * @returns {*}
     */
    createSlot(blueprint) {
        return blueprint.attributes ? blueprint.attributes.slot || null : null;
    }

    /**
     * Creates Ref key
     *
     * @param blueprint
     * @returns {*}
     */
    createRef(blueprint) {
        return blueprint.attributes ? blueprint.attributes.ref || null : null;
    }

    /**
     * Creates ref in for key
     *
     * @param blueprint
     * @returns {*}
     */
    createRefInFor(blueprint) {
        return blueprint.attributes ? blueprint.attributes.refInFor || null : null;
    }

    /**
     * Creates key key
     *
     * @param blueprint
     * @returns {*}
     */
    createKey(blueprint) {
        return blueprint.attributes ? blueprint.attributes.key || null : null;
    }

    /**
     * Get ref value from data store
     *
     * @param {String} ref
     * @param $objStore
     * @returns {*}
     */
    getBindByRef(ref) {
        if (ref.indexOf('$_') === 0) {
            return this.resolveKeyWords(ref);
        }

        return _.get(this.clayView[REACTIVESTORE], ref);
    }

    resolveKeyWords(keyword) {
        if (keyword.indexOf($_SLOT_PROPS) === 0) {
            return _.get(this.props, keyword.split('.').filter(segment => segment !== $_SLOT_PROPS).join('.'));
        }
        return '';
    }

    getEvent(keyword) {
        if (!keyword.indexOf($_SLOT_PROPS) === 0) {
            throw 'You can only use Events from Scoped Slots';
        }
        const parts = keyword.split('(');

        return {
            method: _.get(this.props, parts[0].split('.').filter(segment => segment !== $_SLOT_PROPS).join('.')),
            params: parts[1].slice(0, -1).split(','),
        };
    }

    /**
     * Get Value by object key. If value is bind the binding will be resolved
     *
     * @param key
     * @param object
     * @param blueprint
     * @param resolveBind
     * @returns {*}
     */
    getValueByKey(key, object, resolveBind = true) {
        object = _.cloneDeep(object);

        if (object[key] === undefined) {
            if (object[`:${key}`]) {
                return resolveBind
                    ? this.getBindByRef(object[`:${key}`])
                    : object[`${key}`];
            }

            return '';
        }

        if (key[0] === ':') {
            return resolveBind
                ? this.getBindByRef(object[`${key}`])
                : object[`${key}`];
        }

        return object[key];
    }

    /**
     * Create Child elements
     *
     * @param {Object} blueprint - Blueprint/s will be converted to VNode/s as child components.
     */
    createChildren({children}) {
        if (children === undefined) {
            return null;
        }

        if (typeof children === 'string' || children instanceof String) {
            return children;
        }

        if (Array.isArray(children)) {
            return this.createVNodes(children);
        }

        if (children.type === TYPE_TEXT) {
            return this.getValueByKey('value', children);
        }

        return this.createVNode(children);
    }

    /**
     * Resolve Ref in for loop
     *
     * @param blueprint
     * @param key
     * @param index
     * @returns {*}
     */
    setForRef(blueprint, key, index) {
        blueprint.id = `${blueprint.id}-${index}`;

        if (blueprint.children && (blueprint.children.type === TYPE_TEXT)) {
            blueprint.children[':value'] = blueprint.children[':value'].replace($_LOOP_VALUE, `${blueprint[$_LOOP]}[${key}]`);
            blueprint.children.id = `${blueprint.children.id}-${index}`;

            return blueprint;
        }

        blueprint = JSON.stringify(blueprint).split($_LOOP_VALUE).join(`${blueprint[$_LOOP]}[${key}]`);
        blueprint = JSON.parse(blueprint);
        blueprint.id = `${blueprint.id}-${index}`;

        return blueprint;
    }

    /**
     * Create scoped slot elements
     *
     * @param {array|Object} blueprint - Blueprint/s will be converted to VNode/s in scoped Slot.
     */
    createScopedSlots(blueprint) {
        if (!blueprint) {
            return null;
        }

        if (!blueprint.scopedSlots) {
            return null;
        }

        const scopedSlots = {};

        scopedSlots.default = ((props) => {
            const scoped = [];
            this.props[blueprint.id] = props;
            blueprint.scopedSlots.forEach(slot => scoped.push(this.createVNode(slot)));
            return scoped;
        });

        return {scopedSlots};
    }

    createEvents(blueprint) {
        if (!blueprint.attributes) {
            return {};
        }

        if (blueprint.attributes.on === undefined) {
            return null;
        }

        const on = {};

        Object.keys(blueprint.attributes.on).forEach((key) => {
            const {method, params} = this.getEvent(blueprint.attributes.on[key]);
            on[key] = (value) => {
                method(value, ...params);
            };
        });

        return on;
    }

    /**
     * Sets the input event for reactivity
     *
     * @param blueprint
     * @returns {*}
     */
    affect(blueprint) {
        const $self = this;

        if (!blueprint.affect) {
            return {};
        }
        const {affect} = blueprint;

        return {
            input: (event) => {
                $self.setBindValue(
                    affect.split('.')[0] === $_SELF
                        ? affect.replace($_SELF, `${blueprint.id}.`)
                        : affect,
                    event,
                );
            },
        };
    }

    /**
     * Sets Value in Data Store
     *
     * @param ref
     * @param value
     */
    setBindValue(ref, value) {
        _.set(this.clayView[REACTIVESTORE], ref, value);
    }

    parseMethodSigniture(signature) {
        const parts = signature.split('(');

        return {
            name: parts[0],
            params: parts[1].slice(0, -1).split(','),
        };
    }
}
