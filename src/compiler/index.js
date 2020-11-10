const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // abc-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <aaa:asdads>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


function start(tag, attrs) {
  console.log(tag, attrs);
}

function chars(text) {
  console.log('文字', text)
}

function end(tag) {
  console.log('结束：', tag)
}

function parseHTML(html) {
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
      console.log(text);
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


}


export function compileToFunction(template) {
  let root = parseHTML(template);
  return function render() {

  }
}