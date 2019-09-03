import { mount } from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import { component, root } from '../test-utils.js';
import components from './config/clay';

describe('clay-view root', () => {
  let wrapper;

  // install plugins as normal

  beforeEach(() => {
    wrapper = mount(clayView, {
      propsData: { blueprint: {}, components },
    });
  });


  it('store will be registered', () => {
    wrapper.setProps({
      blueprint: root(component('div', {}), { store: { storeKey: 'value' } }),
    });

    expect(wrapper.vm.store).toEqual({ storeKey: 'value' });
  });
});
