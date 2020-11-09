// 把data中的数据做劫持，使用object.defineProperty()重新定义set get
// object.defineProperty()不兼容IE8及以下

import { isObject, def } from '../unit/index';
import { arrayMethods } from './array.js';

class Observer {
  constructor(value) {
    // 监听数据，给数据添加get set方法
    // vue2.x的缺陷：如果数据层数过多，vue需要递龟去解析对象中的属性，一次增加set和get方法
    // vue3开始使用proxy，不需要递龟

    // 给每一个监控过的对象增加一个属性，标识已经被劫持过，可以在其他地方拿到当前的实例
    // 并且这个标识是不可被遍历到也不可以重新配置的。
    def(value, '__ob__', this);

    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods; // 数组操作被监听是因为它的方法是被重写的 

      this.observerArray(value); // 数组监听  不会对索引进行监听，会有性能问题，数组里是对象的话才监听
    } else {
      this.walk(value);
    }
  }

  observerArray(value) {
    // 把用户传入的数组里的每一项进行劫持
    for (var i = 0; i < value.length; i++) {
      observe(value[i]);
    }
  }
  walk(data) {
    let keys = Object.keys(data); // 拿到所有的key
    // 拿到每个key和value，然后对数据里进行劫持
    keys.forEach(key => defineReactive(data, key, data[key]))
  }
}

function defineReactive(data, key, value) {
  observe(value); // 递龟进行深度检测
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      console.log('aaaa')
      observe(newValue); // 如果用户输入的值仍然是对象，继续劫持 
      value = newValue;
    }
  })
}

export function observe(data) {

  let isObj = isObject(data);

  if (!isObj) {
    return;
  }

  return new Observer(data);
}