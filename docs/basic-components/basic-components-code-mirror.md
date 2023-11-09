---
lang: zh-CN
title: 基础表格-基础
description: 基础表格-基础
---

# 基础表格

## 基本用法

<p>

<vma-formula-grid-comp-code-mirror
    class="codemirror"
    ref="cm"
    :autofocus="config.autofocus"
    :placeholder="config.placeholder"
    :indentWithTab="config.indentWithTab"
    :tabSize="config.tabSize"
    :disabled="config.disabled"
    :style="{ backgroundColor: config.backgroundColor }"
    :extensions="extensions"
    :phrases="config.phrases"
    v-model="code"
    @ready="handleReady"
    @change="consoleLog('change', $event)"
    @focus="consoleLog('focus', $event)"
    @blur="consoleLog('blur', $event)"
    />
</p>

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


<script setup lang="ts">
  import { reactive, shallowRef, computed, onMounted } from 'vue';

  const consoleLog = console.log;
  const code = shallowRef(`console.log('Hello World')`);
  const view = shallowRef();
  const config = reactive({
    disabled: false,
    indentWithTab: true,
    tabSize: 4,
    autofocus: true,
    placeholder: 'input...',
    backgroundColor: 'lightgrey',
    language: '',
    phrases: 'en-us'
  });

  const handleReady = (payload) => {
    console.log('handleReady payload:', payload)
  };

  const extensions = computed(() => {
    const result = [];
    return result
  });

  onMounted(() => {
    console.log('mounted view:', view);
  });

  
</script>
