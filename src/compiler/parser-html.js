const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>


let root = null; // 根节点
let currentParent = null;
// 栈，存储标签名称，做对比，标签是否合法，从头push，遇到一个push一个
// 当遇到挨着的重复的就出栈一个作为一个正常闭合的标签。当栈空就说明数据合法，完成还有剩余说明有标签不合法，未闭合或输错其他
let stack = [];
const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs: attrs,
    parent: null
  }
}


function start(tagName, attrs) {
  // 遇到开始标签开始创建ast树
  let element = createASTElement(tagName, attrs);
  if (!root) {
    root = element;
  }
  currentParent = element;
  stack.push(element);
}

function chars(text) {
  text = text.replace(/\s/g, '');
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE
    })
  }
}


function end(tagName) {
  // 把当前的最后一个出栈，如果传入的tag和element相同，则合法，是一个闭合的标签
  let element = stack.pop();
  if (tagName == element.tag) {
    // 当前元素的父级肯定是他前面的那个元素
    currentParent = stack[stack.length - 1];
    // 如果有父级
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }
}

export function parseHTML(html) {
  // 不停的去解析html字符串
  while (html) {
    let textEnd = html.indexOf('<');
    if (textEnd === 0) {
      // 如果当前索引为0，肯定是一个标签  解析标签
      let startTagMatch = parseStartTag();
      if (startTagMatch) { // 如果开始标签匹配完毕，然后还需要匹配结束标签
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      let endTagMatch = html.match(endTag);
      if (endTagMatch) { // 如果匹配到结束标签，则继续截取
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }
  }

  function advance(n) {
    html = html.substring(n);
  }

  function parseStartTag() {
    // 匹配当前标签，匹配到之后把原数据`html`截取，保留后面的  例如： <div id="app"><p>aaa</p></div>
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
          tagName: start[1],
          attrs: []
        }
        // 用匹配到的标签的长度去截取  | 变成 id="app"><p>aaa</p></div>
      advance(start[0].length);

      // 匹配属性，当有属性的时候就进行截取，直到没有 | 变成 ><p>aaa</p></div>
      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        // 把取到的属性存到match里面
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
      }

      // 去掉 >   还是使用截取
      if (end) {
        advance(end[0].length);
        return match;
      }
    }
  }
  return root;
}