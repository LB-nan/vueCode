import { parseHTML } from './parser-html.js';
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 处理属性
function genProps(attrs) {
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') { // 如果当前属性是css
      let obj = {};
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0,-1)}}`;
}

// 处理子节点
function genChildren(el) {
  let children = el.children;
  if (children && children.length > 0) {
    return `${children.map(child => gen(child)).join(',')}`
  } else {
    return false;
  }
}

function gen(node) {
  if (node.type == 1) {
    // 元素标签
    return generate(node);
  } else {
    // 文本
    let text = node.text; // xxx {{name}} xxx {{age}} => 'xxx' + _s(name) + 'xxx' + _s(age); 
    // 存放匹配的结果
    let tokens = [];
    // 匹配到的值，索引
    let match, index;
    // 索引
    let lastIndex = defaultTagRE.lastIndex = 0;
    while (match = defaultTagRE.exec(text)) {
      // 当前匹配到的位置
      index = match.index;
      // 如果当前截取到的位置大于正则索引位置则把匹配到的那一段数据放到tokens里面
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 匹配到{{age}}的时候把ags放到`_s()`的方法里面
      tokens.push(`_s(${match[1].trim()})`);
      // 然后把当前的正则匹配索引置 为  当前匹配的位置+截取的数据的长度，也就是下一次开始的位置
      lastIndex = index + match[0].length;
    }
    // 如果最后还有剩余，则push到最后面。
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    // 用`+`号连接
    return `_v(${tokens.join('+')})`;

    // 到此为止，拼接完毕

    /*
    HTML模板： 
      <div id="app">
        <p>vvv{{name}}</p>
      </div>

    转化后的字符串： _c("div",{id:"app},_c("p",undefined,_v("vvv"+_s(name))))
    
    */
  }
}

function generate(el) {
  let code = `_c("${el.tag}",${el.attrs.length ? genProps(el.attrs): 'undefined'}${el.children ? `,${genChildren(el)}` : ''})`;
  return code;
}

export function compileToFunction(template) {
  let root = parseHTML(template);

  // ast语法树转成js
  let code = generate(root);
  let renderFn = new Function(`with(this){ return ${code}}`);

  return renderFn;
}