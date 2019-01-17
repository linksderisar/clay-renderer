<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <clay-view :blueprint="blueprint"/>
    </div>
</template>

<script>
    import clayView from './components/clay-view.vue';
    import {component, root} from '@/../tests/test-utils.js'

    export default {
        name: 'app',
        components: {
            clayView,
        },
        data() {
            return {
                blueprint: root(component('div',{children:[component('div',{children: 'asjdasd', if:'true == false'})]}))
            }
        },
        computed: {
            root() {
                return root;
            },
            component() {
                return component;
            }
        }
    };
</script>
