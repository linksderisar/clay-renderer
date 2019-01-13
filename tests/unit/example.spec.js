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

    it('correctly', () => {
        const blueprint = root(component('div'));

        wrapper.setProps({blueprint});
        expect(wrapper.html()).toMatch('<div></div>');
    });

    it('with classes in string syntax', () => {
        const blueprint = root(component('div', {attributes: {class: 'some-class'}}));
        wrapper.setProps({blueprint});

        expect(wrapper.classes('some-class')).toBe(true);
    });

    it('with classes in array syntax', () => {
        const blueprint = root(component('div', {attributes: {class: ['some-class']}}));
        wrapper.setProps({blueprint});

        expect(wrapper.classes('some-class')).toBe(true);
    });

    it('classes in object syntax', () => {
        const blueprint = root(component('div', {attributes: {class: {'some-class': true, 'not-shown-class': false}}}));
        wrapper.setProps({blueprint});

        expect(wrapper.classes('some-class')).toBe(true);
        expect(wrapper.classes('not-shown-class')).toBe(false);
    });

    it('with inline styles', () => {
        const blueprint = root(component('div', {attributes: {style: {'color': 'red'}}}));
        wrapper.setProps({blueprint});

        expect(wrapper.attributes('style')).toBe('color: red;');
    });

    it('with ref styles', () => {
        const blueprint = root(component('div', {attributes: {ref: 'ref'}}));
        wrapper.setProps({blueprint});

        expect(wrapper.find({ref: 'ref'}).exists()).toBe(true);
    });

    it('with child', () => {
        const blueprint = root(component('div', {children: [component('span')]}));
        wrapper.setProps({blueprint});

        expect(wrapper.find('div').contains('span')).toBe(true);
    });

    it('with children', () => {
        const blueprint = root(component('div', {
            children: [
                component('span'),
                component('p')
            ]
        }));
        wrapper.setProps({blueprint});

        expect(wrapper.find('div').contains('span')).toBe(true);
        expect(wrapper.find('div').contains('p')).toBe(true);
    });

    it('with Text', () => {
        const blueprint = root(component('div', {
            children: {
                ...component('$text', {value: 'Some Text'}),
            }
        }));
        wrapper.setProps({blueprint});

        expect(wrapper.find('div').text()).toBe('Some Text');
    });

    it('with v-if static condition', () => {
        const blueprint = root(component('div', {
            children: [
                component('span', {if: 'true == false'}),
            ]
        }));
        wrapper.setProps({blueprint});

        expect(wrapper.find('div').contains('span')).toBe(false);
    });
});
