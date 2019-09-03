<template>
    <clay-view
        :blueprint="blueprint"
        :components="components"
    />
</template>

<script>
import ClayView from '@/components/clay-view.vue';

export default {
  name: 'ClayViewTest',
  components: {
    ClayView,
  },
  props: {
    blueprint: {
      type: Object,
      required: true,
    },
    components: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
