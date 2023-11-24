---
lang: zh-CN
title: 开发指南-安装
description: 开发指南-安装
---

# 开发指南

## 安装

::: code-group
```npm
npm i vma-formula-grid
```
```pnpm
pnpm i vma-formula-grid
```
:::

::: code-group
```ts
import { createApp } from 'vue'
import App from './App.vue'
import VMAFormulaGrid from 'vma-formula-grid'
import 'vma-formula-grid/dist/index.css'

createApp(App).use(VMAFormulaGrid).mount('#app')
```
:::

## CDN

- 可以通过 [unpkg](https://unpkg.com/vma-formula-grid/) 或 [cdnjs](https://cdn.jsdelivr.net/npm/vma-formula-grid/) 获取到最新版本的资源，并在页面上引入即可

**_注意:_** 不建议将不受信任的CDN地址用于生产，因为该连接随时都可能会失效，导致页面无法正常使用；使用CDN方式记得锁定版本号，锁定版本的方法请查看 [unpkg](https://unpkg.com/) 或 [cdnjs](https://www.jsdelivr.com/documentation#id-npm)

::: code-group
```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vma-formula-grid/dist/index.css">
<!-- 引入vue -->
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<!-- 引入组件 -->
<script src="https://cdn.jsdelivr.net/npm/vma-formula-grid"></script>
```
:::