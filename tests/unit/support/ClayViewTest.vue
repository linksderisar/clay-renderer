<template>
    <clay-view :blueprint="blueprint" />
</template>

<script>
export default {
  name: 'ClayViewTest',
  props: {
    blueprint: {
      type: Object,
      required: true,
    },
  },
};
</script>
