<template>
    <div data-test-component-scoped-slot>
        <slot :scoped-value="scopedValue"></slot>
    </div>
</template>

<script>
    export default {
        name: "test-component-scoped-slot",
        data() {
            return {
                scopedValue: 'scopedContent'
            }
        }
    }
</script>

<style scoped>

</style>
