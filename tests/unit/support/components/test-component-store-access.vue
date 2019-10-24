<template>
    <div
        data-test-component-store-access
        v-text="$clay.getStore($clay.id)"
    />
</template>

<script>
export default {
  name: 'TestComponentWithStoreAccess',
};
</script>
