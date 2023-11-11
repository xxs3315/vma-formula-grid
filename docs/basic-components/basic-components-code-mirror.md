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
    ref="view"
    :options="viewOptions"
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
  import {spreadsheet, setAutocompletionIdiom, indentAndCompletionWithTab, tabObservable} from "../../src/index.common";
  import { basicSetup } from 'codemirror';
  import { EditorView, keymap } from '@codemirror/view';
  import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
  import { tags } from '@lezer/highlight';
  import { Compartment } from '@codemirror/state';

  const consoleLog = console.log;
  const code = shallowRef(`= A1 * 6`);
  const view = shallowRef();
  const viewOptions = reactive({
    lineNumbers: false,
    foldGutter: true,
  });
  const config = reactive({
    disabled: false,
    indentWithTab: true,
    tabSize: 4,
    autofocus: true,
    placeholder: 'input...',
    backgroundColor: 'white',
    language: '',
    phrases: {}
  });

  const myHighlightStyle = HighlightStyle.define([
    { tag: tags.name, color: 'green' },
    { tag: tags.bool, color: '#A020F0' },
    { tag: tags.color, color: '#0000FF' },
    { tag: tags.invalid, color: '#FA6F66' }
  ]);

  const languageCompartment = new Compartment(),
    autocompleteCompartment = new Compartment();

  const basicExtensions = [
    basicSetup,
    keymap.of([indentAndCompletionWithTab]),
    syntaxHighlighting(myHighlightStyle),
    tabObservable(),
    EditorView.lineWrapping,
  ];

  const handleReady = (payload) => {
    console.log('handleReady payload:', payload);
    setAutocompletionIdiom(payload.view, autocompleteCompartment);
  };

  const extensions = computed(() => {
    const result = [
      ...basicExtensions,
      languageCompartment.of(spreadsheet()),
      autocompleteCompartment.of([]),
    ];
    return result
  });

  

  onMounted(() => {
    console.log('mounted view:', view.value);
  });

  
</script>
