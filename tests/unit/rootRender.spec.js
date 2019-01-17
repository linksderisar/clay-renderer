import {mount} from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import {component, root} from './../test-utils.js'

describe('clay-view root', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(clayView, {
            propsData: {blueprint: {}}
        });
    });

    it('store will be registered', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {}), {store: {storeKey: 'value'}})
        });

        setTimeout(() => {
            expect(wrapper.vm.store).toEqual({storeKey: 'value'});
            done();
        }, 0);
    });

});
