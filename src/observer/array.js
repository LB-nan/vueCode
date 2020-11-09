// 只劫持会修改原数组的方法： push  shift unshift  pop reverse sort splice

let oldArrayMethods = Array.prototype;

export const arrayMethods = Object.create(oldArrayMethods);


const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    let result = oldArrayMethods[method].apply(this, args);
    let inserted;
    let ob = this.__ob__;
    // 当原数组有新增的时候,需要重新判断监听新增的值是否需要劫持
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
      default:
        break;
    }

    // 如果数组有新增，则对新增的值进行劫持
    if (inserted) ob.observerArray(inserted);
    return result;
  }
})