<template>
    <div>
        <div data-test-component-slot-1>
            <slot name="slot1"></slot>
        </div>
        <div data-test-component-slot-2>
            <slot name="slot2"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "test-component-slots",
    }
</script>

<style scoped>

</style>
