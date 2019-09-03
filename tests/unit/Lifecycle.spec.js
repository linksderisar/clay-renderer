import {  mount } from '@vue/test-utils';
import clayView from '@/components/clay-view';
import { component, root } from '../test-utils.js';
import components from './config/clay';

describe('Rendere behavior can be injected', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {}, components },
    });
  });

  it('before render process starts', () => {
    const blueprint = root(component('div'));
    wrapper.setProps({
      blueprint,
      before: (renderBlueprint) => {
        renderBlueprint.store = { before: 'added' };
        return renderBlueprint;
      },
    });

    expect(wrapper.vm.store.before).toBe('added');
  });

  it('after render process finished', () => {
    const blueprint = root(component('div'));
    wrapper.setProps({
      blueprint,
      after: (vNode) => {
        vNode.tag = 'span';
        return vNode;
      },
    });

    expect(wrapper.html()).toBe('<span></span>');
  });

  it('before each component render process', () => {
    const blueprint = root(component('div', { children: [component('div')] }));
    wrapper.setProps({
      blueprint,
      beforeEach: (componentBlueprint) => {
        componentBlueprint.type = 'span';
        return componentBlueprint;
      },
    });

    expect(wrapper.html()).toBe('<span><span></span></span>');
  });

  it('after each component render process', () => {
    const blueprint = root(component('div', { children: [component('div')] }));
    wrapper.setProps({
      blueprint,
      afterEach: (parsedBlueprint) => {
        parsedBlueprint.type = 'span';
        return parsedBlueprint;
      },
    });

    expect(wrapper.html()).toBe('<span><span></span></span>');
  });
});
