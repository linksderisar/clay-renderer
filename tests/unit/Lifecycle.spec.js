import { createLocalVue, mount } from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import { component, root } from '../test-utils.js';
import components from './config/clay';
import clay from '@/plugin/clay';

describe('Rendere behavior can be injected', () => {
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
