import Clay from "@/clay.js";

const plugin = {};
plugin.install = function (Vue, options) {
    Vue.prototype.$clay = new Clay();
};
export default plugin;
