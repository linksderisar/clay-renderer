<template>
    <clay-named-view :blueprint="blueprint" />
</template>

<script>
export default {
  name: 'ClayNamedViewTest',
  props: {
    blueprint: {
      type: Object,
      required: true,
    },
  },
};
</script>
