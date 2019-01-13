<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <clay-view :blueprint="root(component('div', {
            children: [
                component('span', {if: 'true == false'}),
            ]
        }))"/>
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
        computed:{
            root(){
                return root;
            },
            component(){
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
