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
import {defineComponent, onMounted, reactive, ref, watch} from "vue";
import Immutable from 'immutable';
import {getColumnSymbol} from "../../src/utils";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const datasource = ref('map');
    const size = ref('normal');
    const themeType = ref('primary');

    onMounted(() => {
      console.log(data)
    });

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
        v: '= BB100 - 2'
      }, {
        p: 'B1',
        v: '= SUM(A1, 6)'
      }, {
        p: 'B2',
        v: '= A2 + 2 + SQRT(2)'
      }, {
        p: 'B3',
        v: '= A3 + 2'
      }, {
        p: 'B4',
        v: '= A4 + 2'
      }, {
        p: 'B5',
        v: '= SUM(A1:A4)'
      }, {
        p: 'BB100',
        v: '= AA100 + 2'
      },]
    });

    const arrayData = reactive([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [
        '= A1 + 2', '= B1 + 2', '= C1 + 2', '= D1 + 2', '= E1 + 2',
        '= F1 + 2', '= G1 + 2', '= H1 + 2', '= I1 + 2', '= J1 + 2',
        '= K1 + 2', '= L1 + 2', '= M1 + 2', '= N1 + 2', '= O1 + 2',
        '= P1 + 2', '= Q1 + 2', '= R1 + 2', '= S1 + 2', '= T1 + 2'
      ],
    ]);

    const confs = reactive({
      rowHeight: [{
        row: 2,
        height: 48,
      }, {
        row: 4,
        height: 96,
      }],
      colWidth: [{
        col: 'B',
        width: 200,
      }, {
        col: 'H',
        width: 200,
      }],
      rowHide: [9, ...Immutable.Range(15, 21).toArray()],
      colHide: ['D', ...Immutable.Range(6, 8).map((value, _) => {
        return getColumnSymbol(value)
      }).toArray()]
    });

    const data = reactive({
      conf: confs,
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
    }
  }
})
</script>
