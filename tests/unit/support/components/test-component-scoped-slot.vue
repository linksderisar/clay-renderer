<template>
    <div data-test-component-scoped-slot>
        <slot :scoped-value="scopedValue" />
    </div>
</template>

<script>
export default {
  name: 'TestComponentScopedSlot',
  data() {
    return {
      scopedValue: 'scopedContent',
    };
  },
};
</script>

<style scoped>

</style>
