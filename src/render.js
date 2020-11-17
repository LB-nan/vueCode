import { createElement, createTextNode } from './vdom/create-element.js';

export function renderMixin(Vue) {

  // 创建节点
  Vue.prototype._c = function() {
      return createElement(...arguments);
    }
    // 创建文字节点
  Vue.prototype._v = function(text) {
      return createTextNode(text);
    }
    // json.stringify()
  Vue.prototype._s = function(val) {
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }

  Vue.prototype._render = function() {
    const vm = this;
    const { render } = vm.$options;
    let vnode = render.call(vm);
    return vnode;
  }
}