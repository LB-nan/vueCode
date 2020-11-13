export function lifecycleMixin(Vue){
  Vue.prototype._update = function(){
    
  }
}


export function mountComponent(vm, el) {
  const options = vm.$options;
  vm.$el = el;

  // 渲染页面
  let updateComponent = () => {
    vm._update(vm._render());
  }

  new Watcher(vm, updateComponent, () => {}, true);
}