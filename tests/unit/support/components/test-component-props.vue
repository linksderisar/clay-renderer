<template>
    <div data-test-component-props v-text="msg"></div>
</template>

<script>
    export default {
        name: "test-component-props",
        props: ['msg']
    }
</script>

<style scoped>

</style>
