import {mount} from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import {component, root} from './../test-utils.js'

describe('clay-view renders simple HTML Tags', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(clayView, {
            propsData: {blueprint: {}}
        });
    });

    // it('correctly', async (done) => {
    //     const blueprint = root(component('div', {children: component('$text', {value: 'bitte bitte'})}));
    //     const wrapper1 = mount(clayView, {
    //         propsData: {blueprint},
    //     });
    //
    //     await flushPromises();
    //     console.log('first', wrapper1.vm.$el);
    //
    // });

    it('correctly', (done) => {
        const blueprint = root(component('div'));
        const wrapper1 = mount(clayView, {
            propsData: {blueprint},
        });

        console.log('inital', 'wrapper1.vm.renderedBlueprint');

setTimeout(()=> {

},0);
        wrapper1.vm.$nextTick(() => {
            console.log('next_tick - blueprint ', wrapper1.vm.blueprint);
            console.log('next_tick - blueprint result ', wrapper1.vm.$el.innerHTML);
            console.log('next_tick - blueprint result ', wrapper1.vm.$el.outerHTML);
            console.log('next_tick - renderedBlueprint', wrapper1.vm.renderedBlueprint);
            done();
        });


    });

    /*    it('with classes in string syntax', () => {
            const blueprint = root(component('div', {attributes: {class: 'some-class'}}));
            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.classes('some-class')).toBe(true);
                done();
            });
        });

        it('with classes in array syntax', () => {
            const blueprint = root(component('div', {attributes: {class: ['some-class']}}));
            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.classes('some-class')).toBe(true);
                done();
            });
        });

        it('classes in object syntax', () => {
            const blueprint = root(component('div', {attributes: {class: {'some-class': true, 'not-shown-class': false}}}));
            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.classes('some-class')).toBe(true);
                expect(wrapper.classes('not-shown-class')).toBe(false);
                done();
            });
        });

        it('with inline styles', () => {
            const blueprint = root(component('div', {attributes: {style: {'color': 'red'}}}));
            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.attributes('style')).toBe('color: red;');
                done();
            });
        });

        it('with ref styles', () => {
            const blueprint = root(component('div', {attributes: {ref: 'ref'}}));
            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.find({ref: 'ref'}).exists()).toBe(true);
                done();
            });
        });

        it('with child', () => {
            const blueprint = root(component('div', {children: [component('span')]}));
            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.find('div').contains('span')).toBe(true);
                done();
            });
        });

        it('with children', () => {
            const blueprint = root(component('div', {
                children: [
                    component('span'),
                    component('p')
                ]
            }));

            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.find('div').contains('span')).toBe(true);
                expect(wrapper.find('div').contains('p')).toBe(true);
                done();
            });
        });

        it('with Text', () => {
            const blueprint = root(component('div', {
                children: {
                    ...component('$text', {value: 'Some Text'}),
                }
            }));
            wrapper.setProps({blueprint});

            wrapper.vm.$nextTick(() => {
                expect(wrapper.find('div').text()).toBe('Some Text');
                done();
            });
        });*/

    /*it('with v-if static condition', () => {
        const blueprint = root(component('div', {
            children: [
                component('span', {if: 'true == false'}),
            ]
        }));
        wrapper.setProps({blueprint});

        expect(wrapper.find('div').contains('span')).toBe(false);
    });*/
});
