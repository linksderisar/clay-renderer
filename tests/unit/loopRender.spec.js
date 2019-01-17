import {mount} from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import {component, root} from './../test-utils.js'

describe('clay-view renders simple HTML Tags', () => {
    let wrapper;
    const loopArray = ['value_0', 'value_1', 'value_2'];

    beforeEach(() => {
        wrapper = mount(clayView, {
            propsData: {blueprint: {}}
        });
    });

    it('with v-for array', (done) => {
        const blueprint = root(component('div', {
            children: [
                component(
                    'span',
                    {
                        "loop": "loopArray",
                    }
                ),
            ]
        }), {store: {loopArray}});

        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('div').findAll('span').length).toBe(3);
            done();
        }, 0);
    });

    it('with v-for array with loop value', (done) => {
        const blueprint = root(component('div', {
            children: [
                component(
                    'span',
                    {
                        "loop": "loopArray",
                        children: {
                            ...component('$text', {':value': '$_loop_value'}),
                        }
                    }
                ),
            ]
        }), {store: {loopArray}});

        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('div').findAll('span').length).toBe(3);
            wrapper.find('div').findAll('span').wrappers.forEach((span, index) => {
                expect(span.text()).toBe(`value_${index}`);
            });

            done();
        }, 0);
    });

    it('with v-for array with nested loop value', (done) => {
        const blueprint = root(component('div', {
            children: [
                component(
                    'span',
                    {
                        "loop": "loopArray",
                        children: [
                            component(
                                'p',
                                {
                                    children: {...component('$text', {':value': '$_loop_value'})},
                                }
                            ),
                        ]
                    }
                ),
            ]
        }), {store: {loopArray}});

        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('div').findAll('span').length).toBe(3);
            expect(wrapper.find('div').findAll('p').length).toBe(3);
            wrapper.find('div')
                .findAll('span')
                .wrappers
                .forEach((span, index) => {
                    expect(span.find('p').text()).toBe(`value_${index}`);
                });

            done();
        }, 0);
    });

    it.skip('with v-for object', (done) => {
    });

    it.skip('with v-for object with loop value', (done) => {
    });

    it.skip('with v-for object with nested loop value', (done) => {
    });

    it.skip('with v-for and key', (done) => {
    });

    it.skip('with v-for and refInFor', (done) => {
    });
});


describe('clay-view renders vue component', () => {
    let wrapper;
    const loopArray = ['value_0', 'value_1', 'value_2'];

    beforeEach(() => {
        wrapper = mount(clayView, {
            propsData: {blueprint: {}}
        });
    });

    it.skip('with v-for array', (done) => {
    });

    it.skip('with v-for array with loop value', (done) => {
    });

    it.skip('with v-for array with nested loop value', (done) => {
    });

    it.skip('with v-for object', (done) => {
    });

    it.skip('with v-for object with loop value', (done) => {
    });

    it.skip('with v-for object with nested loop value', (done) => {
    });

    it.skip('with v-for and key', (done) => {
    });

    it.skip('with v-for and refInFor', (done) => {
    });
});


