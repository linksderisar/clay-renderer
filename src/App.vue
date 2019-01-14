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
                blueprint: root(component('div', {
                    children: [
                        component('span'),
                    ],
                    attributes: {
                        class: 'lala'
                    }
                }))
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

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
