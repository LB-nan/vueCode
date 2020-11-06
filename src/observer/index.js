// 把data中的数据做劫持，使用object.defineProperty()重新定义set get
// object.defineProperty()不兼容IE8及以下

import { isObject } from '../unit/index';

class Observer {
  constructor(value) {
    // 监听数据，给数据添加get set方法
    // vue2.x的缺陷：如果数据层数过多，vue需要递龟去解析对象中的属性，一次增加set和get方法
    // vue3开始使用proxy，不需要递龟
    this.walk(value);
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