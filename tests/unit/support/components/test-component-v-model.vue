<template>
    <div data-test-component-v-model>
        <slot />
        <p v-text="eventResult" />
    </div>
</template>

<script>
export default {
  name: 'TestComponentVModel',
  data() {
    return {
      bind: 'default',
    };
  },
  methods: {
  },
};
</script>

<style scoped>

</style>
