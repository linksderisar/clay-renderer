import { mount } from '@vue/test-utils';
import clayView from './support/ClayViewTest.vue';
import { component, root } from '../test-utils.js';
import components from './config/clay';

describe('clay-view renders conditions', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {}, components },
    });
  });


  it('with static v-if success', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { if: 'true == true' }),
        ],
      })),
    });

    expect(wrapper.find('div').contains('span')).toBe(true);
  });

  it('with static v-if fail', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { if: 'true == false' }),
        ],
      })),
    });

    expect(wrapper.find('div').contains('span')).toBe(false);
  });

  it('with dynamic v-if success', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { if: 'true == compareValue' }),
        ],
      }), { store: { compareValue: true } }),
    });

    expect(wrapper.find('div').contains('span')).toBe(true);
  });

  it('with dynamic v-if fail', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { if: 'true == compareValue' }),
        ],
      }), { store: { compareValue: false } }),
    });

    expect(wrapper.find('div').contains('span')).toBe(false);
  });

  it('with static v-show condition success', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { show: 'true == true' }),
        ],
      })),
    });

    expect(wrapper.find('div').find('span').isVisible()).toBe(true);
  });

  it('with static v-show fail', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { show: 'true == false' }),
        ],
      })),
    });

    expect(wrapper.find('div').find('span').isVisible()).toBe(false);
  });

  it('with dynamic v-show success', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { show: 'true == compareValue' }),
        ],
      }), { store: { compareValue: true } }),
    });

    expect(wrapper.find('div').find('span').isVisible()).toBe(true);
  });

  it('with dynamic v-show fail', () => {
    wrapper.setProps({
      blueprint: root(component('div', {
        children: [
          component('span', { show: 'true == compareValue' }),
        ],
      }), { store: { compareValue: false } }),
    });

    expect(wrapper.find('div').find('span').isVisible()).toBe(false);
  });


  // Scoped Slots

  it('with static v-if in Scoped Slots success', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          if: 'true == true',
        }),
    );

    const blueprint = root(
      scopedComponent,
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').exists()).toBe(true);
  });

  it('with static v-if in Scoped Slots fail', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          if: 'true == false',
        }),
    );

    const blueprint = root(
      scopedComponent,
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').exists()).toBe(false);
  });

  it('with dynamic v-if in Scoped Slots success', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          if: 'true == compareValue',
        }),
    );

    const blueprint = root(
      scopedComponent,
      { store: { compareValue: true } },
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').exists()).toBe(true);
  });

  it('with dynamic v-if in Scoped Slots fail', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          if: 'true == compareValue',
        }),
    );

    const blueprint = root(
      scopedComponent,
      { store: { compareValue: false } },
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').exists()).toBe(false);
  });

  it('with static v-show in Scoped Slots success', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          show: 'true == true',
        }),
    );

    const blueprint = root(
      scopedComponent,
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').isVisible()).toBe(true);
  });

  it('with static v-show in Scoped Slots fail', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          show: 'true == false',
        }),
    );

    const blueprint = root(
      scopedComponent,
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').isVisible()).toBe(false);
  });

  it('with dynamic v-show in Scoped Slots success', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          show: 'true == compareValue',
        }),
    );

    const blueprint = root(
      scopedComponent,
      { store: { compareValue: true } },
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').isVisible()).toBe(true);
  });

  it('with dynamic v-show in Scoped Slots fail', () => {
    const scopedComponent = component(
      'testComponentScopedSlot',
      {
        scopedSlots: [],
      },
    );
    scopedComponent.scopedSlots.push(
      component('span',
        {
          show: 'true == compareValue',
        }),
    );

    const blueprint = root(
      scopedComponent,
      { store: { compareValue: false } },
    );

    wrapper.setProps({ blueprint });

    expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
    expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').isVisible()).toBe(false);
  });
});
