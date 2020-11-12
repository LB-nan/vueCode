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
    str += `${attr.name}:${JSON.stringify(attr.value)}`;
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
    let text = node.text;
    return `_v(${text})`;
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
  console.log(code);


  return function render() {

  }
}