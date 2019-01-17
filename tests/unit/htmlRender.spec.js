import {mount} from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import {component, root} from './../test-utils.js'

jest.mock('@/clay.js', () => {
    return jest.fn().mockImplementation(() => {
        return Object.defineProperty({}, 'components', {
            get: jest.fn(() => require('./config/clay').default.components),
        });
    });
});

describe('clay-view renders simple HTML Tags', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(clayView, {
            propsData: {blueprint: {}}
        });
    });

    it('correctly', (done) => {
        const blueprint = root(component('div'));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.html()).toBe('<div></div>');
            done();
        }, 0);
    });

    it('with classes in string syntax', (done) => {
        const blueprint = root(component('div', {attributes: {class: 'some-class'}}));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.classes('some-class')).toBe(true);
            done();
        }, 0);
    });

    it('with classes in array syntax', (done) => {
        const blueprint = root(component('div', {attributes: {class: ['some-class']}}));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.classes('some-class')).toBe(true);
            done();
        }, 0);
    });

    it('classes in object syntax', (done) => {
        const blueprint = root(component('div', {attributes: {class: {'some-class': true, 'not-shown-class': false}}}));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.classes('some-class')).toBe(true);
            expect(wrapper.classes('not-shown-class')).toBe(false);
            done();
        }, 0);
    });

    it('with inline styles', (done) => {
        const blueprint = root(component('div', {attributes: {style: {'color': 'red'}}}));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.attributes('style')).toBe('color: red;');
            done();
        }, 0);
    });

    it('with ref styles', (done) => {
        const blueprint = root(component('div', {attributes: {ref: 'ref'}}));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find({ref: 'ref'}).exists()).toBe(true);
            done();
        }, 0);
    });

    it('with child', (done) => {
        const blueprint = root(component('div', {children: [component('span')]}));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('div').contains('span')).toBe(true);
            done();
        }, 0);
    });

    it('with children', (done) => {
        const blueprint = root(component('div', {
            children: [
                component('span'),
                component('p')
            ]
        }));

        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('div').contains('span')).toBe(true);
            expect(wrapper.find('div').contains('p')).toBe(true);
            done();
        }, 0);
    });

    it('with Text', (done) => {
        const blueprint = root(component('div', {
            children: {
                ...component('$text', {value: 'Some Text'}),
            }
        }));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('div').text()).toBe('Some Text');
            done();
        }, 0);
    });

    it.skip('events', (done) => {
    });

    it.skip('v-model', (done) => {
    });

    it.skip('attrs', (done) => {
    });
});

describe('clay-view renders vue component', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(clayView, {
            propsData: {blueprint: {}},
        });
    });

    it('correctly', (done) => {
        const blueprint = root(component('testComponentDiv'));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('*[data-test-div-component]').exists()).toBe(true);
            done();
        }, 0);
    });

    it('with static props', (done) => {
        const blueprint = root(component('testComponentProps', {attributes: {props: {msg: 'propValue'}}}));
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('*[data-test-component-props]').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-props]').text()).toBe('propValue');
            expect(wrapper.vm.$children[0].$props.msg).toBe('propValue');
            done();
        }, 0);
    });

    it('with bound props', (done) => {
        const blueprint = root(
            component(
                'testComponentProps',
                {
                    attributes: {
                        props: {':msg': 'prop'}
                    }
                }
            ),
            {store: {prop: 'propValue'}}
        );
        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('*[data-test-component-props]').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-props]').text()).toBe('propValue');
            expect(wrapper.vm.$children[0].$props.msg).toBe('propValue');
            done();
        }, 0);
    });

    it('with a slot', (done) => {
        const blueprint = root(
            component(
                'testComponentSlot',
                {
                    children: [
                        component('span', {children: 'slot'})
                    ]
                }
            )
        );

        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('*[data-test-component-slot]').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-slot]').find('span').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-slot]').find('span').text()).toBe('slot');
            done();
        }, 0);
    });

    it('with a named slots', (done) => {
        const blueprint = root(
            component(
                'testComponentSlots',
                {
                    children: [
                        component('span', {attributes: {slot: 'slot1'}, children: 'slot1'}),
                        component('span', {attributes: {slot: 'slot2'}, children: 'slot2'})
                    ]
                }
            )
        );

        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('*[data-test-component-slot-1]').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-slot-1]').find('span').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-slot-1]').find('span').text()).toBe('slot1');

            expect(wrapper.find('*[data-test-component-slot-2]').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-slot-2]').find('span').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-slot-2]').find('span').text()).toBe('slot2');
            done();
        }, 0);
    });


    it.skip('with scoped slots', (done) => {
        let scopedComponent = component(
            'testComponentScopedSlot',
            {
                scopedSlots: []
            }
        );
        scopedComponent.scopedSlots.push(
            component('span',
                {
                    children: {...component('$text', {':value': `$_slot_props.${scopedComponent.id}.scopedValue`})},
                }
            )
        );

        const blueprint = root(
            scopedComponent
        );

        wrapper.setProps({blueprint});

        setTimeout(() => {
            expect(wrapper.find('*[data-test-component-scoped-slot]').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').exists()).toBe(true);
            expect(wrapper.find('*[data-test-component-scoped-slot]').find('span').text()).toBe('scopedContent');
            done();
        }, 0);
    });

    it.skip('events', (done) => {
    });

    it.skip('v-model', (done) => {
    });
});

