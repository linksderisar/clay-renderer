import {mount} from '@vue/test-utils';
import clayView from '@/components/clay-view.vue';
import {component, root} from './../test-utils.js'

describe('clay-view renders conditions', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(clayView, {
            propsData: {blueprint: {}}
        });
    });

    it('with static v-if success', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {if: 'true == true'}),
                ]
            }))
        });

        setTimeout(() => {
            expect(wrapper.find('div').contains('span')).toBe(true);
            done();
        }, 0);
    });

    it('with static v-if fail', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {if: 'true == false'}),
                ]
            }))
        });

        setTimeout(() => {
            expect(wrapper.find('div').contains('span')).toBe(false);
            done();
        }, 0);
    });

    it('with dynamic v-if success', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {if: 'true == compareValue'}),
                ]
            }), {store: {compareValue: true}})
        });

        setTimeout(() => {
            expect(wrapper.find('div').contains('span')).toBe(true);
            done();
        }, 0);
    });

    it('with dynamic v-if fail', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {if: 'true == compareValue'}),
                ]
            }), {store: {compareValue: false}})
        });

        setTimeout(() => {
            expect(wrapper.find('div').contains('span')).toBe(false);
            done();
        }, 0);
    });

    it('with static v-show condition success', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {show: 'true == true'}),
                ]
            }))
        });

        setTimeout(() => {
            expect(wrapper.find('div').find('span').isVisible()).toBe(true);
            done();
        }, 0);
    });

    it('with static v-show fail', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {show: 'true == false'}),
                ]
            }))
        });

        setTimeout(() => {
            expect(wrapper.find('div').find('span').isVisible()).toBe(false);
            done();
        }, 0);
    });

    it('with dynamic v-show success', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {show: 'true == compareValue'}),
                ]
            }), {store: {compareValue: true}})
        });

        setTimeout(() => {
            expect(wrapper.find('div').find('span').isVisible()).toBe(true);
            done();
        }, 0);
    });

    it('with dynamic v-show fail', (done) => {
        wrapper.setProps({
            blueprint: root(component('div', {
                children: [
                    component('span', {show: 'true == compareValue'}),
                ]
            }), {store: {compareValue: false}})
        });

        setTimeout(() => {
            expect(wrapper.find('div').find('span').isVisible()).toBe(false);
            done();
        }, 0);
    });
});
