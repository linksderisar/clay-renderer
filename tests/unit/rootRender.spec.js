import { createLocalVue, mount } from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import { component, root } from '../test-utils.js';
import components from './config/clay';
import clay from '@/plugin/clay';

describe('clay-view root', () => {
  let wrapper;
  const localVue = createLocalVue();

  // install plugins as normal
  localVue.use(clay, components);

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {}  },
      localVue,
    });
  });


  it('store will be registered', () => {
    wrapper.setProps({
      blueprint: root(component('div', {}), { store: { storeKey: 'value' } }),
    });

    expect(wrapper.vm.store).toEqual({ storeKey: 'value' });
  });
});
