<script>
import jexl from 'jexl';
import _ from 'lodash';

const $_SELF = '$_self';
const $_LOOP = 'loop';
const $_LOOP_VALUE = '$_loop_value';
const $_SLOT_PROPS = '$_slot_props';
const SCOPEDPROPS = 'scopedProps';
const REACTIVESTORE = 'store';
const TYPE_TEXT = '$text';

export default {

  props: {
    blueprint: {
      type: Object,
      required: true,
    },
    before: {
      type: Function,
      default: blueprint => blueprint,
    },
    after: {
      type: Function,
      default: vNode => vNode,
    },
    beforeEach: {
      type: Function,
      default: blueprint => blueprint,
    },
    afterEach: {
      type: Function,
      default: parsed => parsed,
    },
  },

  data() {
    return {
      jexl,
      [REACTIVESTORE]: {},
      [SCOPEDPROPS]: {},
    };
  },

  computed: {
    renderedBlueprint() {
      const { componentTree, store } = this.before(_.clone(this.blueprint));

      if (_.isUndefined(componentTree)) {
        return {};
      }

      if (!(componentTree instanceof Object) || (componentTree instanceof Array)) {
        throw 'Root Element needs to be an Object';
      }

      this[REACTIVESTORE] = store;
      return this.after(this.createVNode(componentTree));
    },
  },

  methods: {

    /**
       * Crates an VModel with a blueprint
       *
       * @param blueprint
       * @returns {*}
       */
    createVNode(blueprint) {
      const componentBlueprint = this.beforeEach(blueprint);

      if (!this.vIf(componentBlueprint)) {
        return null;
      }

      let parsedBlueprint = {
        type: componentBlueprint.type,
        attributes: {
          ...this.createScopedSlots(componentBlueprint),
          ...this.createDataObject(componentBlueprint),
        },
        children: this.createChildren(componentBlueprint),
      };

      parsedBlueprint = this.afterEach(parsedBlueprint, componentBlueprint);

      return this.$createElement(
        parsedBlueprint.type,
        parsedBlueprint.attributes,
        parsedBlueprint.children,
      );
    },

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
          this.createForNodes(element)
            .forEach(
              forElement => vNodes.push(forElement),
            );
          return;
        }

        const vNode = this.createVNode(element);

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
    createForNodes(blueprint) {
      const iterable = this.getBindByRef(blueprint[$_LOOP]);
      const vNodes = [];

      if (_.isObject(iterable) && !(iterable instanceof Array)) {
        Object.keys(iterable)
          .forEach((key, index) => {
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
    },

    /**
       * Creates the Vue Data object for the render function
       *
       * @param blueprint
       * @returns {*}
       */
    createDataObject(blueprint) {
      blueprint = _.cloneDeep(blueprint);
      const vShow = this.vShow(blueprint);

      let props = {
        ...this.createSystemProps(blueprint),
      };

      if (!blueprint.affect && !blueprint.attributes) {
        return { ...vShow, props };
      }

      const on = {
        ...this.affect(blueprint),
        ...this.createEvents(blueprint),
      };

      props = { ...props, ...this.createProps(blueprint) };

      const domProps = {
        ...this.createDomProps(blueprint),
      };

      const classes = this.createClass(blueprint);

      const style = {
        ...this.createStyle(blueprint),
        ...vShow.style,
      };

      const attrs = {
        ...this.createAttrs(blueprint),
      };

      const vueData = {};

      const slot = this.createSlot(blueprint);

      if (slot !== null) {
        _.assign(vueData, { slot });
      }

      const ref = this.createRef(blueprint);

      if (ref !== null) {
        _.assign(vueData, { ref });
      }

      const refInFor = this.createRefInFor(blueprint);

      if (refInFor !== null) {
        _.assign(vueData, { refInFor });
      }

      const key = this.createKey(blueprint);
      if (key !== null) {
        _.assign(vueData, { key });
      }

      return {
        props,
        domProps,
        on,
        class: classes,
        style,
        attrs,
        ...vueData,
      };
    },

    vShow(blueprint) {
      if (blueprint.show) {
        if (!this.resolveCondition(blueprint.show)) {
          return { style: { display: 'none' } };
        }
      }
      return { style: {} };
    },

    vIf(blueprint) {
      if (blueprint.if) {
        return this.resolveCondition(blueprint.if);
      }
      return true;
    },

    /**
       * Resolves Condition in blueprint if object
       *
       * @param condition
       * @returns {*}
       */
    resolveCondition(condition) {
      return this.jexl.evalSync(condition, this[REACTIVESTORE]);
    },

    /**
       * Create Props object
       *
       * @param blueprint
       * @returns {{}}
       */
    createProps(blueprint) {
      if (!blueprint.attributes) {
        return {};
      }

      if (!blueprint.attributes.props) {
        return {};
      }

      const { props } = blueprint.attributes;

      if (!_.isObject(props) || props instanceof Array) {
        return {};
      }


      Object.keys(props)
        .forEach((key) => {
          props[key.replace(':', '')] = this.getValueByKey(key, props);
        });

      return props;
    },

    /**
     * Create System props
     *
     * @param blueprint
     * @returns {{}}
     */
    createSystemProps(blueprint) {
      return {
        clay: {
          id: () => blueprint.id,
        },
      };
    },

    /**
       * Create Props object
       *
       * @param blueprint
       * @returns {*}
       */
    createDomProps(blueprint) {
      if (!blueprint.attributes) {
        return {};
      }

      if (!blueprint.attributes.domProps) {
        return {};
      }

      const { domProps } = blueprint.attributes;

      if (!_.isObject(domProps) || domProps instanceof Array) {
        return {};
      }


      Object.keys(domProps)
        .forEach((key) => {
          domProps[key.replace(':', '')] = this.getValueByKey(key, domProps);
        });

      return domProps;
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

      const { attrs } = blueprint.attributes;

      if (!_.isObject(attrs) || attrs instanceof Array) {
        return {};
      }

      Object.keys(attrs)
        .forEach(key => attrs[key.replace(':', '')] = this.getValueByKey(key, attrs));

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
      return blueprint.attributes ? this.getValueByKey('key', blueprint.attributes) || null : null;
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
        return _.get(this[SCOPEDPROPS], keyword.split('.')
          .filter(segment => segment !== $_SLOT_PROPS)
          .join('.'));
      }
      return '';
    },

    getEvent(keyword) {
      if (!keyword.indexOf($_SLOT_PROPS) === 0) {
        throw 'You can only use Events from Scoped Slots';
      }
      const parts = keyword.split('(');

      return {
        method: _.get(this[SCOPEDPROPS], parts[0].split('.')
          .filter(segment => segment !== $_SLOT_PROPS)
          .join('.')),
        params: parts[1].slice(0, -1)
          .split(','),
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
    createChildren({ children }) {
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

      blueprint = JSON.stringify(blueprint)
        .split($_LOOP_VALUE)
        .join(`${blueprint[$_LOOP]}[${key}]`);
      blueprint = JSON.parse(blueprint);
      blueprint.id = `${blueprint.id}-${index}`;

      return blueprint;
    },

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
        this[SCOPEDPROPS][blueprint.id] = props;
        blueprint.scopedSlots.forEach(slot => scoped.push(this.createVNode(slot)));
        return scoped;
      });

      return { scopedSlots };
    },

    createEvents(blueprint) {
      if (!blueprint.attributes) {
        return {};
      }

      if (blueprint.attributes.on === undefined) {
        return null;
      }

      const on = {};

      Object.keys(blueprint.attributes.on)
        .forEach((key) => {
          const { method, params } = this.getEvent(blueprint.attributes.on[key]);
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
      const { affect } = blueprint;

      return {
        input: (event) => {
          $self.setBindValue(
            affect.split('.')[0] === $_SELF
              ? affect.replace($_SELF, `${blueprint.id}.`)
              : affect,
            event.target.value,
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

  },

  render(h) {
    return this.renderedBlueprint;
  },
};
</script>
