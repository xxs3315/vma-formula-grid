import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  plugins: [
    vue(),
    viteMockServe({
      mockPath: "./mock/", // mock文件地址
      localEnabled: true, // 开发打包开关
      prodEnabled: true, // 生产打包开关 这样可以控制关闭 mock 的时候不让 mock 打包到最终代码内
      injectCode: ` import { setupProdMockServer } from './mock/createProductionServer'; setupProdMockServer(); `,
      logger: true, //是否在控制台显示请求日志
    }),
  ],
})
