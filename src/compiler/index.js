import { parseHTML } from './parser-html.js'

export function compileToFunction(template) {
  let root = parseHTML(template);
  console.log(root);
  return function render() {

  }
}