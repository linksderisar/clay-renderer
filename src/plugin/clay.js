import ClayView from '@/components/clay-view';

const plugin = {};
plugin.install = function (Vue, { components }) {
  Vue.component('clay-view', ClayView);

  Object.keys(components).forEach((widgetKey) => {
    Vue.component(widgetKey, components[widgetKey]);
  });
  // 3. inject some component options
  Vue.mixin({
    props: {
      clay: {
        type: Object,
        default: () => ({ id: () => console.warn('Component must be rendered with Clay to get Clay id') }),
      },
    },
  });
};
export default plugin;
