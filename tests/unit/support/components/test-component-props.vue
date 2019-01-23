<template>
    <div
        data-test-component-props
        v-text="msg"
    />
</template>

<script>
export default {
  name: 'TestComponentProps',
  props: ['msg'],
};
</script>

<style scoped>

</style>
