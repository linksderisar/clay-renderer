import ClayView from '@/components/clay-view';
import Clay from '../clay';
import _ from 'lodash';

function registerComponents(view, components = {}) {
  const feedView = _.cloneDeep(view);
  feedView.components = components;
  return feedView;
}

function registerClayView(Vue, components = {}) {
  Object.keys(components).forEach((key) => {
    const view = registerComponents(ClayView, components[key]);
    if (key === 'default') {
      Vue.component('clay-view', view);
      return;
    }

    Vue.component(`clay-${key}-view`, view);
  });
}

const plugin = {};
plugin.install = (Vue, { components }) => {
  registerClayView(Vue, components);

  Vue.mixin({
    props: {
      /* eslint-disable */
      $clay: {
      /* eslint-enable */
        type: Clay,
        default: () => new Clay({}),
      },
    },
  });
};


export default plugin;
