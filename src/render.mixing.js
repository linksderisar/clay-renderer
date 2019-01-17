import _ from 'lodash';

const $_SELF = '$_self';
const $_LOOP = 'loop';
const $_LOOP_VALUE = '$_loop_value';
const $_SLOT_PROPS = '$_slot_props';
const $_SLOT_PROPS_store = 'scopedProps';
const REACTIVESTORE = 'store';
const TYPE_TEXT = '$text';

export default {
    props: {
        components: {
            type: Object,
            default: () => ({}),
        }
    },
    components: {},
    data() {
        return {
            jexl: require('jexl'),
            [REACTIVESTORE]: {},
            renderedBlueprint: {},
            [$_SLOT_PROPS_store]: {},
            scopedSlotsT: {},
        };
    },
    methods: {
        /**
         * Start render process
         * @param {Object} blueprint - Initial json blueprint.
         * @param {function} h - Render function..
         */
        async start_render(h, {componentTree, store}) {

            if (_.isUndefined(componentTree)) {
                return {};
            }

            if (!(componentTree instanceof Object) || (componentTree instanceof Array)) {
                throw 'Root Element needs to be an Object';
            }

            this[REACTIVESTORE] = store;
            return await this.createVNode(componentTree);
        },

        /**
         * Crates an VModel with a blueprint
         *
         * @param blueprint
         * @returns {*}
         */
        async createVNode(blueprint) {

            if (!await this.vIf(blueprint)) {
                return null;
            }

            return this.$createElement(
                blueprint.type,
                {
                    ...await this.createScopedSlots(blueprint),
                    ...await this.createDataObject(blueprint),
                },
                await this.createChildren(blueprint),
            );
        },

        /**
         * Create VNodes from given array with blueprints
         *
         * @param {array|Object} blueprint - Loop through the array and converted Blueprints to VNode.
         * @param {Object} props - Props witch will be passed to scoped slots.
         */
        async createVNodes(blueprint) {
            const vNodes = [];

            await this.asyncForEach(blueprint, async (element) => {
                if (element[$_LOOP]) {
                    await this.asyncForEach(
                        await this.createForNodes(element),
                        forElement => vNodes.push(forElement)
                    );
                    return;
                }

                const vNode = await this.createVNode(element);

                vNodes.push(vNode);
            });

            return vNodes;
        },

        /**
         * Creates Nodes in a for loop
         *
         * @param blueprint
         * @returns {Array}
         */
        async createForNodes(blueprint) {
            const iterable = this.getBindByRef(blueprint[$_LOOP]);
            const vNodes = [];

            if (_.isObject(iterable) && !(iterable instanceof Array)) {
                await Object.keys(iterable).forEach(async (key, index) => {
                    vNodes.push(
                        await this.createVNode(
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
                await this.asyncForEach(iterable, async (value, index) => {
                    vNodes.push(
                        await this.createVNode(
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
        },

        /**
         * Creates the Vue Data object for the render function
         *
         * @param blueprint
         * @returns {*}
         */
        async createDataObject(blueprint) {
            blueprint = _.cloneDeep(blueprint);
            const vShow = await this.vShow(blueprint);

            if (!blueprint.affect && !blueprint.attributes) {
                return {...vShow};
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
                ...vShow.style
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
        },

        async vShow(blueprint) {
            if (blueprint.show) {
                if (!await this.resolveCondition(blueprint.show)) {
                    return {style: {display: 'none'}};
                }
            }
            return {style: {}}
        },

        async vIf(blueprint) {
            if (blueprint.if) {
                return await this.resolveCondition(blueprint.if);
            }
            return true;
        },

        /**
         * Resolves Condition in blueprint if object
         *
         * @param condition
         * @returns {*}
         */
        async resolveCondition(condition) {
            return await this.jexl.eval(condition, this[REACTIVESTORE]);
        },

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
        },

        /**
         * Creates Class Object
         *
         * @param blueprint
         * @returns {*}
         */
        createClass(blueprint) {
            return blueprint.attributes ? this.getValueByKey('class', blueprint.attributes) || {} : {};
        },

        /**
         * Creates Style Object
         *
         * @param blueprint
         * @returns {*}
         */
        createStyle(blueprint) {
            return blueprint.attributes ? this.getValueByKey('style', blueprint.attributes) || {} : {};
        },

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
        },

        /**
         * Creates Slot key
         *
         * @param blueprint
         * @returns {*}
         */
        createSlot(blueprint) {
            return blueprint.attributes ? blueprint.attributes.slot || null : null;
        },

        /**
         * Creates Ref key
         *
         * @param blueprint
         * @returns {*}
         */
        createRef(blueprint) {
            return blueprint.attributes ? blueprint.attributes.ref || null : null;
        },

        /**
         * Creates ref in for key
         *
         * @param blueprint
         * @returns {*}
         */
        createRefInFor(blueprint) {
            return blueprint.attributes ? blueprint.attributes.refInFor || null : null;
        },

        /**
         * Creates key key
         *
         * @param blueprint
         * @returns {*}
         */
        createKey(blueprint) {
            return blueprint.attributes ? blueprint.attributes.key || null : null;
        },

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

            return _.get(this[REACTIVESTORE], ref);
        },

        resolveKeyWords(keyword) {
            if (keyword.indexOf($_SLOT_PROPS) === 0) {
                return _.get(this[$_SLOT_PROPS_store], keyword.split('.').filter(segment => segment !== $_SLOT_PROPS).join('.'));
            }
            return '';
        },

        getEvent(keyword) {
            if (!keyword.indexOf($_SLOT_PROPS) === 0) {
                throw 'You can only use Events from Scoped Slots';
            }
            const parts = keyword.split('(');

            return {
                method: _.get(this[$_SLOT_PROPS_store], parts[0].split('.').filter(segment => segment !== $_SLOT_PROPS).join('.')),
                params: parts[1].slice(0, -1).split(','),
            };
        },

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
        },

        /**
         * Create Child elements
         *
         * @param {Object} blueprint - Blueprint/s will be converted to VNode/s as child components.
         */
        async createChildren({children}) {
            if (children === undefined) {
                return null;
            }

            if (typeof children === 'string' || children instanceof String) {
                return children;
            }

            if (Array.isArray(children)) {
                return await this.createVNodes(children);
            }

            if (children.type === TYPE_TEXT) {
                return this.getValueByKey('value', children);
            }


            return await this.createVNode(children);
        },

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
        },

        /**
         * Create scoped slot elements
         *
         * @param {array|Object} blueprint - Blueprint/s will be converted to VNode/s in scoped Slot.
         */
        async createScopedSlots(blueprint) {
            if (!blueprint) {
                return null;
            }

            if (!blueprint.scopedSlots) {
                return null;
            }

            const scopedSlots = {};

            scopedSlots.default = await (async (props) => {
                const scoped = [];
                this[$_SLOT_PROPS_store][blueprint.id] = props;
                await this.asyncForEach(blueprint.scopedSlots, (async slot => scoped.push(await this.createVNode(slot))));
                return scoped;
            });

            return {scopedSlots};
        },

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
        },

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
        },

        /**
         * Sets Value in Data Store
         *
         * @param ref
         * @param value
         */
        setBindValue(ref, value) {
            _.set(this[REACTIVESTORE], ref, value);
        },

        /**
         * ForEach with async callback
         *
         * @param array
         * @param callback
         */
        async asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        },

        parseMethodSigniture(signature) {
            const parts = signature.split('(');

            return {
                name: parts[0],
                params: parts[1].slice(0, -1).split(','),
            };
        },
    }
}
