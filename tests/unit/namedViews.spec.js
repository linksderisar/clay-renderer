import { mount, createLocalVue } from '@vue/test-utils';
import clayView from './support/ClayNamedViewTest';
import testComponentDiv from './support/components/test-component-div';
import clay from '@/plugin/clay';
import { component, root } from '../test-utils.js';

describe('clay-view renders vue component', () => {
  let wrapper;
  const localVue = createLocalVue();

  // install plugins as normal
  localVue.use(clay, { components: { named: { testComponentDiv } } });

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
});
