import ClayView from '@/components/clay-view';
import Clay from '../clay';

const plugin = {};
plugin.install = function (Vue, { components }) {
  Vue.component('clay-view', ClayView);

  Object.keys(components).forEach((widgetKey) => {
    Vue.component(widgetKey, components[widgetKey]);
  });
  // 3. inject some component options
  Vue.mixin({
    props: {
      $clay: {
        type: Clay,
        default: () => new Clay({}),
      },
    },
  });
};
export default plugin;
