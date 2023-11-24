---
lang: zh-CN
title: 开发指南-快速入门
description: 开发指南-快速入门
---

# 开发指南

## 快速入门

### TS写法

**_参考:_** [TS Demo](https://gitee.com/xxs3315/vma-formula-grid-demo)

::: code-group
```vue
<template>
  <div>
    <vma-formula-grid ref="grid" style="width: 100%; height: 800px;" :data="data" />
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const grid = ref();

    const mapData = reactive({
      data: [{p: 'A1', v: 1}, {p: 'A2', v: 2}, {p: 'A3', v: 3}, {p: 'A4', v: 4}, {p: 'A5', v: '= B5 - 2'}, {p: 'B1', v: '= SUM(A3, 6)'}, {p: 'B2', v: '= A2 + 2 + SQRT(2)'}, {p: 'B3', v: '= A3 + 2'}, {p: 'B4', v: '= A4 + 2'}, {p: 'B5', v: '= SUM(A1:A4)'},]
    });

    const arrayData = reactive([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      ['= A1 + 2', '= B1 + 2', '= C1 + 2', '= D1 + 2', '= E1 + 2', '= F1 + 2', '= G1 + 2', '= H1 + 2', '= I1 + 2', '= J1 + 2', '= K1 + 2', '= L1 + 2', '= M1 + 2', '= N1 + 2', '= O1 + 2', '= P1 + 2', '= Q1 + 2', '= R1 + 2', '= S1 + 2', '= T1 + 2'],
    ])

    const confs = reactive({
    })

    const data = reactive({
      conf: confs,
      type: 'map', // array or map, default value is array
      arrayData: arrayData, // default data
      mapData: mapData
    })

    return {
      grid,
      data,
    }
  }
})
</script>
```
:::

### JS写法

**_参考:_** [JS Demo](https://gitee.com/xxs3315/vma-formula-grid-html-demo)

::: code-group
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vma-formula-grid html demo</title>
    <!-- 引入样式 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vma-formula-grid/dist/index.css">
    <!-- 引入vue -->
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <!-- 引入组件 -->
    <script src="https://cdn.jsdelivr.net/npm/vma-formula-grid"></script>
</head>

<body>
<div id="app">
    <vma-formula-grid ref="grid" style="width: 100%; height: 800px;" :data="data" />
</div>
</body>

<script>
    const { createApp, reactive, ref } = Vue;
    const app = createApp({
        setup() {
            const grid = ref();
            const mapData = reactive({
                data: [{p: 'A1', v: 1}, {p: 'A2', v: 2}, {p: 'A3', v: 3}, {p: 'A4', v: 4}, {p: 'A5', v: '= B5 - 2'}, {p: 'B1', v: '= SUM(A3, 6)'}, {p: 'B2', v: '= A2 + 2 + SQRT(2)'}, {p: 'B3', v: '= A3 + 2'}, {p: 'B4', v: '= A4 + 2'}, {p: 'B5', v: '= SUM(A1:A4)'},]
            });
            const arrayData = reactive([
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
                ['= A1 + 2', '= B1 + 2', '= C1 + 2', '= D1 + 2', '= E1 + 2', '= F1 + 2', '= G1 + 2', '= H1 + 2', '= I1 + 2', '= J1 + 2', '= K1 + 2', '= L1 + 2', '= M1 + 2', '= N1 + 2', '= O1 + 2', '= P1 + 2', '= Q1 + 2', '= R1 + 2', '= S1 + 2', '= T1 + 2'],
            ])

            const confs = reactive({
            })

            const data = reactive({
                conf: confs,
                type: 'map', // array or map, default value is array
                arrayData: arrayData, // default data
                mapData: mapData
            })

            return {
                grid,
                data,
            }
        }
    });
    app.use(VMAFormulaGrid).mount("#app");
</script>
</html>
```
:::