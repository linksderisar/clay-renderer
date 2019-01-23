<template>
    <div>
        <div data-test-component-slot-1>
            <slot name="slot1" />
        </div>
        <div data-test-component-slot-2>
            <slot name="slot2" />
        </div>
    </div>
</template>

<script>
export default {
  name: 'TestComponentSlots',
};
</script>

<style scoped>

</style>
