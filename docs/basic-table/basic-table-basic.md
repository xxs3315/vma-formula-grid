---
lang: zh-CN
title: 基础表格-基础
description: 基础表格-基础
---

# 基础表格

## 基本用法

<vma-formula-grid
    :data="data" 
    :size="size" 
    :type="themeType" 
    style="width: 100%; height: 800px;"
/>

::: code-group
```vue
    <vma-formula-grid 
        :data="data" 
        :size="size" 
        :type="themeType"
        style="width: 100%; height: 800px;"
/>
```
:::

## 数据格式


<script lang="ts">
import {defineComponent, reactive, ref, watch} from "vue";

export default defineComponent({
  name: "HelloWorld",
  setup(props, context) {
    const datasource = ref('map');
    const size = ref('normal');
    const themeType = ref('primary');

    const mapData = reactive({
      data: [{
        p: 'A1',
        v: 1
      }, {
        p: 'A2',
        v: 2
      }, {
        p: 'A3',
        v: 3
      }, {
        p: 'A4',
        v: 4
      }, {
        p: 'AA100',
        v: 5
      }, {
        p: 'B1',
        v: '= A1 + 123456789012345678901234567890'
      }, {
        p: 'B2',
        v: '= A2 + 2'
      }, {
        p: 'B3',
        v: '= A3 + 2'
      }, {
        p: 'B4',
        v: '= A4 + 2'
      }, {
        p: 'BB100',
        v: '= AA100 + 2'
      },]
    });

    const arrayData = reactive([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [
        '= A20 + 2', '= A1 + 2', '= A2 + 2', '= A3 + 2', '= A4 + 2',
        '= A5 + 2', '= A6 + 2', '= A7 + 2', '= A8 + 2', '= A9 + 2',
        '= A10 + 2', '= A11 + 2', '= A12 + 2', '= A13 + 2', '= A14 + 2',
        '= A15 + 2', '= A16 + 2', '= A17 + 2', '= A18 + 2', '= A19 + 2'
      ],
    ]);

    const data = reactive({
      type: 'map',
      arrayData: arrayData,
      mapData: mapData
    });

    watch(() => datasource.value, () => {
      data.type = datasource.value
    });

    watch(() => size.value, () => {
      console.log(size.value)
    });

    watch(() => data.type, () => {
      console.log(data)
    },{
      deep: true
    });

    return {
      datasource,
      data,
      size,
      themeType
    };
  }
})
</script>
