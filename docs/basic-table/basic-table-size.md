---
lang: zh-CN
title: 基础表格-尺寸
description: 基础表格-尺寸
---

# 尺寸

## 基本用法

<vma-formula-table
    :data="gridData"
    :size="selectedSizeValue"
    :functions="customFunctions"
    :type="selectedThemeValue"
    resizeColumn
    resizeRow
    style="width: 100%; height: 800px;"
/>

<script lang="ts">
  import {defineComponent, reactive, ref} from 'vue';
  import { ComponentType, SizeType } from '../../src/types';
  export default defineComponent({
    name: 'Button',
    setup() {
      const selectedSizeValue = ref<SizeType>('large');
        const selectedThemeValue = ref<ComponentType>('primary');
        
        const customFunctions = reactive({
          CHAR21: () => {}, /* (number) => {          number = FormulaHelpers.accept(number, Types.NUMBER);
                  if (number > 255 || number < 1)
                    throw FormulaError.VALUE;
                  return String.fromCharCode(number + 21);
                }*/
          CHAR22: () => {} /* (number) => {
                  number = FormulaHelpers.accept(number, Types.NUMBER);
                  if (number > 255 || number < 1)
                    throw FormulaError.VALUE;
                  return String.fromCharCode(number + 22);
                }*/
        });
        
        const gridData = reactive([{
          name: 'sheet 1ABC',
          r: 10,
          c: 20,
          status: 0,
          index: 0,
          order: 0,
          hide: 0,
          config: {
            freeze: {
              l: 2,
              t: 3,
              r: 9,
              b: 12
            },
            merge: [{
              r: 2,
              c: 3,
              rs: 3,
              cs: 4
            }],
            rh: [{
              r: 2,
              h: 48
            }, {
              r: 4,
              h: 48
            }],
            cw: [{
              c: 3,
              w: 120
            }, {
              c: 7,
              w: 148
            }],
            rv: [{
              r: 7,
              v: 0
            }, {
              r: 8,
              v: 0
            }],
            cv: [{
              c: 7,
              v: 0
            }],
            border: [{
              type: 'cell',
              r: 7,
              c: 7,
              v: {
                l: {
                  s: 1,
                  cl: 'red'
                },
                r: {
                  s: 1,
                  cl: 'rgba(99,99,99,0.7)'
                },
                t: {
                  s: 1,
                  cl: 'rgb(200,200,200)'
                },
                b: {
                  s: 1,
                  cl: '#56789A'
                }
              }
            }, {
              type: 'range',
              r: [8, 9],
              c: [4, 6],
              bt: 'border-all',
              s: 1,
              cl: 'cyan'
            }]
          },
          data: [
            {
              r: 1,
              c: 2,
              name: 'B1',
              v: '35'
            },
            {
              r: 1,
              c: 3,
              name: 'C1',
              v: '=3 / 10'
            },
            {
              r: 1,
              c: 4,
              name: 'D1',
              v: '= 1 - EXP(C1 ^ 3)'
            },
            {
              r: 10,
              c: 20,
              name: 'T10',
              v: '=D1 + 3'
            },
            {
              r: 2,
              c: 4,
              name: 'D2',
              v: '=SUM(B1, T10) + AD50'
            },
            {
              r: 7,
              c: 4,
              name: 'D7',
              v: '值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1值1'
            },
            {
              r: 50,
              c: 30,
              name: 'AD50',
              v: '=2  *D2 + C1* 1.7'
            },
            {
              r: 36,
              c: 30,
              name: 'AD36',
              v: '=CHAR22(B1)'
            }
          ]
        }, {
          name: 'sheet 2',
          r: 15,
          c: 25,
          status: 0,
          index: 1,
          order: 1,
          hide: 0,
          data: []
        }]);

      return {
        selectedSizeValue,
        selectedThemeValue,
        customFunctions,
        gridData,
      }
    },
  })
</script>
