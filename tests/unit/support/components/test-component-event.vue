<template>
    <div data-test-component-event>
        <slot :event="event" />
        <p v-text="eventResult" />
    </div>
</template>

<script>
export default {
  name: 'TestComponentEvent',
  data() {
    return {
      eventResult: 'not yet',
    };
  },
  methods: {
    event() {
      this.eventResult = 'works';
    },
  },
};
</script>

<style scoped>

</style>
