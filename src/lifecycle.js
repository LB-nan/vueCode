import Watcher from './observer/watcher.js';
import { patch } from './vdom/patch.js';

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this;
    // 通过虚拟节点渲染出真实dom 替换掉 原来的真实的dom
    vm.$el = patch(vm.$el, vnode);
  }
}


export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el;
  // watcher 用来渲染
  // vm._render 通过解析的render方法，渲染出虚拟dom
  // vm._update 通过虚拟dom，创建真实dom

  // 渲染页面
  let updateComponent = () => {
    vm._update(vm._render());
  }

  // 渲染watcher，每个组件都有一个watcher，   true表示是一个渲染watcher
  new Watcher(vm, updateComponent, () => {}, true);
}