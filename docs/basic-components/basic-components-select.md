---
lang: zh-CN
title: 基础表格-基础
description: 基础表格-基础
---

# 基础表格

## 基本用法

<p><vma-formula-grid-comp-select size="mini" :options="list42" v-model="val42" @change="changeEvent" /></p>

::: code-group
```vue
    <vma-formula-grid-comp-formula-grid 
        :data="data" 
        :size="size" 
        :type="themeType"
        style="width: 100%; height: 800px;"
/>
```
:::

## 数据格式


<script lang="ts">
import {defineComponent, onMounted, reactive, ref, watch} from "vue";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const val42 = ref('2');
      const val43 = ref();
      const val44 = ref();
      const val45 = ref();

      const changeEvent = (obj) => {
        console.log(obj);
      };

      return {
        changeEvent,
        val42,
        list42: [
          { label: '1111', value: '1', disabled: true },
          { label: '2222', value: '2', disabled: false },
          { label: '3333', value: '3', disabled: false },
          { label: '4444', value: '4', disabled: false },
          { label: '5555', value: '5', disabled: true },
          { label: '6666', value: '6', disabled: true },
          { label: '7777', value: '7', disabled: false },
          { label: '8888', value: '8', disabled: false },
          { label: '9999', value: '9', disabled: false },
          { label: '1010', value: '10', disabled: false },
          { label: '1111', value: '11', disabled: false },
        ],
        val43,
        list43: [
          {
            label: '组1',
            disabled: true,
            options: [
              { label: '1-1', value: '11', disabled: false },
              { label: '1-2', value: '10', disabled: false },
            ],
          },
          {
            label: '组2',
            disabled: false,
            options: [
              { label: '2-1', value: '21', disabled: true },
              { label: '2-2', value: '22', disabled: false },
            ],
          },
          {
            label: '组3',
            disabled: false,
            options: [
              { label: '3-1', value: '31', disabled: false },
              { label: '3-2', value: '32', disabled: false },
            ],
          },
        ],
        val44,
        list44: [
          { label: '1111', value: '1', disabled: true },
          { label: '2222', value: '2', disabled: false },
          { label: '3333', value: '3', disabled: false },
          { label: '4444', value: '4', disabled: false },
          { label: '5555', value: '5', disabled: true },
          { label: '6666', value: '6', disabled: true },
          { label: '7777', value: '7', disabled: false },
          { label: '8888', value: '8', disabled: false },
          { label: '9999', value: '9', disabled: false },
          { label: '1010', value: '10', disabled: false },
          { label: '1111', value: '11', disabled: false },
        ],
        val45,
        list45: [
          { label: '1111', value: '1', disabled: true },
          { label: '2222', value: '2', disabled: false },
          { label: '3333', value: '3', disabled: false },
          { label: '4444', value: '4', disabled: false },
          { label: '5555', value: '5', disabled: true },
          { label: '6666', value: '6', disabled: true },
          { label: '7777', value: '7', disabled: false },
          { label: '8888', value: '8', disabled: false },
          { label: '9999', value: '9', disabled: false },
          { label: '1010', value: '10', disabled: false },
          { label: '1111', value: '11', disabled: false },
        ],
      }
  }
})
</script>
