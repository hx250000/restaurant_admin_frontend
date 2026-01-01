const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/admin/',
  transpileDependencies: true,
  devServer: {
    port: 8080, // 设置为你想要的端口号
    open: false  // 启动后是否自动打开浏览器（可选）
  }
})
