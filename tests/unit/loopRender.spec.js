import { mount } from '@vue/test-utils';
import clayView from './support/ClayViewTest';
import { component, root } from '../test-utils.js';
import components from './config/clay';

const loopArray = ['value_0', 'value_1', 'value_2'];
const loopObject = { key_0: 'value_0', key_1: 'value_1', key_2: 'value_2' };

describe('clay-view renders simple HTML Tags', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {}, components },
    });
  });

  it('with v-for array', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
  });

  it('with v-for array with loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            loop: 'loopArray',
            children: {
              ...component('$text', { ':value': '$_loop_value' }),
            },
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
    wrapper.find('div').findAll('span').wrappers.forEach((span, index) => {
      expect(span.text()).toBe(`value_${index}`);
    });
  });

  it('with v-for array with nested loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            loop: 'loopArray',
            children: [
              component(
                'p',
                {
                  children: { ...component('$text', { ':value': '$_loop_value' }) },
                },
              ),
            ],
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
    expect(wrapper.find('div').findAll('p').length).toBe(3);
    wrapper.find('div')
      .findAll('span')
      .wrappers
      .forEach((span, index) => {
        expect(span.find('p').text()).toBe(`value_${index}`);
      });
  });

  it('with v-for object', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            loop: 'loopObject',
          },
        ),
      ],
    }), { store: { loopObject } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
  });

  it('with v-for object with loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            loop: 'loopObject',
            children:
                                component('$text', { ':value': '$_loop_value' }),

          },
        ),
      ],
    }),
    { store: { loopObject } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
    wrapper.find('div').findAll('span').wrappers.forEach((span, index) => {
      expect(span.text()).toBe(`value_${index}`);
    });
  });

  it('with v-for object with nested loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            loop: 'loopObject',
            children: [
              component(
                'p',
                {
                  children: { ...component('$text', { ':value': '$_loop_value' }) },
                },
              ),
            ],
          },
        ),
      ],
    }), { store: { loopObject } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
    expect(wrapper.find('div').findAll('p').length).toBe(3);
    wrapper.find('div')
      .findAll('span')
      .wrappers
      .forEach((span, index) => {
        expect(span.find('p').text()).toBe(`value_${index}`);
      });
  });

  it('with v-for and key', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            attributes: {
              key: 'duplicate',
            },
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
    expect(wrapper.vm.$children[0].renderedBlueprint.children[0].key).toBe('duplicate');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[1].key).toBe('duplicate');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[2].key).toBe('duplicate');
  });

  it('with v-for and bound key', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            attributes: {
              ':key': '$_loop_value',
            },
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
    expect(wrapper.vm.$children[0].renderedBlueprint.children[0].key).toBe('value_0');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[1].key).toBe('value_1');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[2].key).toBe('value_2');
  });

  it('with v-for and refInFor', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'span',
          {
            attributes: {
              refInFor: true,
              ref: 'ref',
            },
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('span').length).toBe(3);
    expect(wrapper.vm.$children[0].$refs.ref.length).toBe(3);
  });
});


describe('clay-view renders vue component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {}, components },
    });
  });

  it('with v-for array', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentDiv',
          {
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-div-component]').length).toBe(3);
  });

  it('with v-for array with loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentSlot',
          {
            loop: 'loopArray',
            children: {
              ...component('$text', { ':value': '$_loop_value' }),
            },
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-component-slot]').length).toBe(3);
    wrapper.find('div').findAll('*[data-test-component-slot]').wrappers.forEach((span, index) => {
      expect(span.text()).toBe(`value_${index}`);
    });
  });

  it('with v-for array with nested loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentSlot',
          {
            loop: 'loopArray',
            children: [
              component(
                'p',
                {
                  children: { ...component('$text', { ':value': '$_loop_value' }) },
                },
              ),
            ],
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-component-slot]').length).toBe(3);
    expect(wrapper.find('div').findAll('p').length).toBe(3);
    wrapper.find('div')
      .findAll('*[data-test-component-slot]')
      .wrappers
      .forEach((span, index) => {
        expect(span.find('p').text()).toBe(`value_${index}`);
      });
  });

  it('with v-for object', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentDiv',
          {
            loop: 'loopObject',
          },
        ),
      ],
    }), { store: { loopObject } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-div-component]').length).toBe(3);
  });

  it('with v-for object with loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentSlot',
          {
            loop: 'loopObject',
            children:
                                component('$text', { ':value': '$_loop_value' }),

          },
        ),
      ],
    }),
    { store: { loopObject } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-component-slot]').length).toBe(3);
    wrapper.find('div').findAll('*[data-test-component-slot]').wrappers.forEach((span, index) => {
      expect(span.text()).toBe(`value_${index}`);
    });
  });

  it('with v-for object with nested loop value', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentSlot',
          {
            loop: 'loopObject',
            children: [
              component(
                'p',
                {
                  children: { ...component('$text', { ':value': '$_loop_value' }) },
                },
              ),
            ],
          },
        ),
      ],
    }), { store: { loopObject } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-component-slot]').length).toBe(3);
    expect(wrapper.find('div').findAll('p').length).toBe(3);
    wrapper.find('div')
      .findAll('*[data-test-component-slot]')
      .wrappers
      .forEach((span, index) => {
        expect(span.find('p').text()).toBe(`value_${index}`);
      });
  });

  it('with v-for and key', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentSlot',
          {
            attributes: {
              key: 'duplicate',
            },
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-component-slot]').length).toBe(3);
    expect(wrapper.vm.$children[0].renderedBlueprint.children[0].key).toBe('duplicate');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[1].key).toBe('duplicate');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[2].key).toBe('duplicate');
  });

  it('with v-for and bound key', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentSlot',
          {
            attributes: {
              ':key': '$_loop_value',
            },
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-component-slot]').length).toBe(3);
    expect(wrapper.vm.$children[0].renderedBlueprint.children[0].key).toBe('value_0');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[1].key).toBe('value_1');
    expect(wrapper.vm.$children[0].renderedBlueprint.children[2].key).toBe('value_2');
  });

  it('with v-for and refInFor', () => {
    const blueprint = root(component('div', {
      children: [
        component(
          'testComponentSlot',
          {
            attributes: {
              refInFor: true,
              ref: 'ref',
            },
            loop: 'loopArray',
          },
        ),
      ],
    }), { store: { loopArray } });

    wrapper.setProps({ blueprint });

    expect(wrapper.find('div').findAll('*[data-test-component-slot]').length).toBe(3);
    expect(wrapper.vm.$children[0].$refs.ref.length).toBe(3);
  });
});
