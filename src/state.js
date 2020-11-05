import { observe } from './observer/index.js';

export function initState(vm) {
  const opts = vm.$options;

  // 初始化 属性 方法 数据 计算属性 watch
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethods(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initProps(vm) {};

function initMethods(vm) {};

function initData(vm) {
  // 数据的初始化
  let data = vm.$options.data;
  // vm._data: 暴露出去给用户使用
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 对象劫持  用户修改了数据可以得到通知，进行一系列操作，如更新视图
  // MVVM模式  数据变化可以驱动视图变化
  // 响应式
  observe(data);
};

function initComputed(vm) {};

function initWatch(vm) {};