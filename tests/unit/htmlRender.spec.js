import { mount, createLocalVue } from '@vue/test-utils';
import clayView from './support/ClayViewTest';
import components from './config/clay';
import clay from '@/plugin/clay';
import { component, root } from '../test-utils.js';

describe('clay-view renders simple HTML Tags', () => {
  let wrapper;
  const localVue = createLocalVue();

  // install plugins as normal
  localVue.use(clay, components);

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {} },
      localVue,
    });
  });

  it('correctly', () => {
    const blueprint = root(component('div'));
    wrapper.setProps({ blueprint });

    expect(wrapper.html()).toBe('<div></div>');
  });

  it('with classes in string syntax', () => {
    const blueprint = root(component('div', { attributes: { class: 'some-class' } }));
    wrapper.setProps({ blueprint });

    expect(wrapper.classes('some-class')).toBe(true);
  });

  it('with classes in array syntax', () => {
    const blueprint = root(component('div', { attributes: { class: ['some-class'] } }));
    wrapper.setProps({ blueprint });

    expect(wrapper.classes('some-class')).toBe(true);
  });

  it('classes in object syntax', () => {
    const blueprint = root(component('div', { attributes: { class: { 'some-class': true, 'not-shown-class': false } } }));
    wrapper.setProps({ blueprint });

    expect(wrapper.classes('some-class')).toBe(true);
    expect(wrapper.classes('not-shown-class')).toBe(false);
  });

  it('with inline styles', () => {
    const blueprint = root(component('div', { attributes: { style: { color: 'red' } } }));
    wrapper.setProps({ blueprint });

    expect(wrapper.attributes('style')).toBe('color: red;');
  });

  it('with ref styles', () => {
    const blueprint = root(component('div', { attributes: { ref: 'refKey' } }));
    wrapper.setProps({ blueprint });

    expect(Object.keys(wrapper.vm.$children[0].$refs)[0]).toBe('refKey');
  });

  it('with child', () => {
    const blueprint = root(component('div', { children: [component('span')] }));
    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').contains('span')).toBe(true);
  });

  it('with children', () => {
    const blueprint = root(component('div', {
      children: [
        component('span'),
        component('p'),
      ],
    }));

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').contains('span')).toBe(true);
    expect(wrapper.find('div').contains('p')).toBe(true);
  });

  it('with Text', () => {
    const blueprint = root(component('div', {
      children: {
        ...component('$text', { value: 'Some Text' }),
      },
    }));
    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').text()).toBe('Some Text');
  });

  it('with normal html attrs', () => {
    const blueprint = root(component('div', {
      attributes: {
        attrs: {
          id: 'someId',
        },
      },
    }));
    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.attributes('id')).toBe('someId');
  });

  it('with normal domProps attrs', () => {
    const blueprint = root(component('input', {
      attributes: {
        attrs: {
          value: 'default',
        },
        domProps: {
          value: 'domValue',
        },
      },
    }));

    wrapper.setProps({ blueprint });

    expect(wrapper.find('input').exists()).toBe(true);
    expect(wrapper.find('input').element.getAttribute('value')).toBe('default');
    expect(wrapper.find('input').element.value).toBe('domValue');
  });
});

describe('clay-view renders vue component', () => {
  let wrapper;
  const localVue = createLocalVue();

  // install plugins as normal
  localVue.use(clay, components);

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {} },
      localVue,
    });
  });

  it('correctly', () => {
    const blueprint = root(component('testComponentDiv'));
    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-div-component]').exists()).toBe(true);
  });

  it('with static props', () => {
    const blueprint = root(component('testComponentProps', { attributes: { props: { msg: 'propValue' } } }));
    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-props]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-props]').text()).toBe('propValue');
    expect(wrapper.vm.$children[0].$children[0].$props.msg).toBe('propValue');
  });

  it('with bound props', () => {
    const blueprint = root(
      component(
        'testComponentProps',
        {
          attributes: {
            props: { ':msg': 'prop' },
          },
        },
      ),
      { store: { prop: 'propValue' } },
    );
    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-props]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-props]').text()).toBe('propValue');
    expect(wrapper.vm.$children[0].$children[0].$props.msg).toBe('propValue');
  });

  it('with a slot', () => {
    const blueprint = root(
      component(
        'testComponentSlot',
        {
          children: [
            component('span', { children: 'slot' }),
          ],
        },
      ),
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-slot]').find('span').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-slot]').find('span').text()).toBe('slot');
  });

  it('with a named slots', () => {
    const blueprint = root(
      component(
        'testComponentSlots',
        {
          children: [
            component('span', { attributes: { slot: 'slot1' }, children: 'slot1' }),
            component('span', { attributes: { slot: 'slot2' }, children: 'slot2' }),
          ],
        },
      ),
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-slot-1]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-slot-1]').find('span').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-slot-1]').find('span').text()).toBe('slot1');

    expect(wrapper.find('*[data-test-component-slot-2]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-slot-2]').find('span').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-slot-2]').find('span').text()).toBe('slot2');
  });


  it('with scoped slots', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          children: { ...component('$text', { ':value': `$_slot_props.${scopedComponent.id}.scopedValue` }) },
        }),
    );

    const blueprint = root(
      scopedComponent,
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').text()).toBe('scopedContent');
  });

  it('with custom events in scoped slots', () => {
    const scopedComponent = component(
      'testComponentEvent',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          attributes: {
            on: {
              click: `$_slot_props.${scopedComponent.id}.event()`,
            },
          },
        }),
    );

    const blueprint = root(
      scopedComponent,
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-event]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-event]').find('p').text()).toBe('not yet');
    expect(wrapper.find('*[data-test-component-event]').find('span').exists()).toBe(true);

    wrapper.find('*[data-test-component-event]').find('span').trigger('click');

    expect(wrapper.find('*[data-test-component-event]').find('p').text()).toBe('works');
  });

  it('with v-model', () => {
    const blueprint = root(
      component('input', {
        affect: 'boundValue',
        attributes: {
          domProps: {
            ':value': 'boundValue',
            type: 'text',
          },
        },
      }),
      {
        store: {
          boundValue: 'default',
        },
      },
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('input').exists()).toBe(true);

    expect(wrapper.vm.$children[0].store.boundValue).toBe('default');
    expect(wrapper.find('input').element.value).toBe('default');

    wrapper.vm.$children[0].store.boundValue = 'new value';

    expect(wrapper.vm.$children[0].store.boundValue).toBe('new value');
    expect(wrapper.find('input').element.value).toBe('new value');

    wrapper.find('input').setValue('new input');

    expect(wrapper.vm.$children[0].store.boundValue).toBe('new input');
    expect(wrapper.find('input').element.value).toBe('new input');
  });


  it('with system props', () => {
    const blueprintComponent = component('testComponentSystemProps');
    const blueprint = root(blueprintComponent);

    wrapper.setProps({ blueprint });

    expect(wrapper.text()).toBe(blueprintComponent.id);
  });
});
