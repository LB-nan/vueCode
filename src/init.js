import { initState } from './state';
import { compileToFunction } from './compiler/index.js';


export function initMixin(Vue) {
  Vue.prototype._init = function(options) {

    // 数据劫持
    const vm = this;
    // vue中使用$options来指代用户传递的属性
    vm.$options = options;

    // 初始化状态
    initState(vm);

    // 挂载元素，如果用户传入了el就要挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    // 优先级：render() => template() => el属性
    if (!options.render) {
      // 如果不存在render方法就走模板编译
      let template = options.template; // 获取模板
      if (!template && el) {
        template = el.outerHTML;
      }
      // 取到模板然后进行编译,编译完成然后渲染
      const render = compileToFunction(template);
      options.render = render;
    }
  }

}