import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input: './src/index.js', // 入口
  output: {
    file: 'dist/umd/vue.js', // 出口
    name: 'Vue', // 全局变量名字
    format: 'umd', // 模块规范
    sourcemap: true, // 开启源码调试
  },
  plugins: [
    babel({
      exclude: "node_modules/**", // 不包含node modules下的js文件
    }), 
    // 开发模式下启动这个插件
    process.env.ENV === 'development' ? serve({
      open: true,  // 默认打开
      openPage: '/public/index.html',  // 打开一个默认页面
      port: 3000, // 端口号
      contentBase: '' // 以当前目录为根目录启动
    }) : null
  ]
}