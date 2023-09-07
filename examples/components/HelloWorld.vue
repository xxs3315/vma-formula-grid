<template>
  <div style="height: 100%;">
    <div style="height: 70px;">
      <fieldset class="fieldset">
        <legend>Select a datasource type:</legend>
        <span>
          <input type="radio" id="datasourceArray" v-model="datasource" value="array" checked/>
          <label for="datasourceArray">Array</label>
        </span>
        <span>
          <input type="radio" id="datasourceMap" v-model="datasource" value="map"/>
          <label for="datasourceMap">Map</label>
        </span>
      </fieldset>

      <fieldset class="fieldset">
        <legend>Select a size type:</legend>
        <span>
          <input type="radio" id="sizeLarge" v-model="size" value="large"/>
          <label for="sizeLarge">Large</label>
        </span>
        <span>
          <input type="radio" id="sizeNormal" v-model="size" value="normal" checked/>
          <label for="sizeNormal">Normal</label>
        </span>
        <span>
          <input type="radio" id="sizeSmall" v-model="size" value="small"/>
          <label for="sizeSmall">Small</label>
        </span>
        <span>
          <input type="radio" id="sizeMini" v-model="size" value="mini"/>
          <label for="sizeMini">Mini</label>
        </span>
      </fieldset>

      <fieldset class="fieldset">
        <legend>Select a theme type:</legend>
        <span>
          <input type="radio" id="themeTypePrimary" v-model="themeType" value="primary" checked/>
          <label for="themeTypePrimary">Primary</label>
        </span>
        <span>
          <input type="radio" id="themeTypeSuccess" v-model="themeType" value="success"/>
          <label for="themeTypeSuccess">Success</label>
        </span>
        <span>
          <input type="radio" id="themeTypeWarning" v-model="themeType" value="warning"/>
          <label for="themeTypeWarning">Warning</label>
        </span>
        <span>
          <input type="radio" id="themeTypeDanger" v-model="themeType" value="danger"/>
          <label for="themeTypeDanger">Danger</label>
        </span>
      </fieldset>
    </div>

    <div style="margin-top: 10px; height: calc(100% - 80px)">
      <splitpanes class="default-theme" style="height: 100%;" @resize="layoutEditor" @ready="layoutEditor">
        <pane min-size="50" size="80">
          <vma-formula-grid style="width: calc(100% - 16px); height: calc(100% - 16px); margin: 8px;" :data="data" :size="size" :type="themeType" />
        </pane>
        <pane size="20" min-size="10">
          <div class="editor" ref="editorRef" style="width: calc(100% - 16px); height: calc(100% - 16px); margin: 8px; border: 1px solid darkgray;" />
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, reactive, ref, toRaw, watch} from "vue";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

export default defineComponent({
  name: "HelloWorld",
  components: { Splitpanes, Pane },
  setup() {
    const datasource = ref('array');
    const size = ref('normal');
    const themeType = ref('primary');

    const editorRef = ref<HTMLElement | null>(null);
    const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null);

    onMounted(() => {
      console.log(data)
      if (editorRef.value && !editorInstance.value) {
        editorInstance.value = monaco.editor.create(editorRef.value, {
          value: ['{', '\t"a": "b"', '}'].join('\n'),
          language: 'json',
          automaticLayout: true,
        });
        // editorInstance.value.layout();
      }
    })

    onUnmounted(() => toRaw(editorInstance.value)?.dispose());

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
        p: 'A20',
        v: '= T20 - 2'
      }, {
        p: 'B1',
        v: '= SUM(A3, 6)'
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
        p: 'T20',
        v: '= A20 + 2'
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
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    ])

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
      rowHide: [9, 15, 16, 17, 18, 19],
      colHide: ['D', 'F', 'G'],
      merges: ['A2:G3', 'A5:A12']
    })

    const data = reactive({
      conf: confs,
      type: 'array', // array or map, default value is array
      arrayData: arrayData, // default data
      mapData: mapData
    })

    const layoutEditor = () => {
      console.log(123)
      // if (editorRef.value && editorInstance.value) {
      //   editorInstance.value.layout();
      // }
    }

    watch(() => datasource.value, () => {
      data.type = datasource.value
    })

    watch(() => size.value, () => {
      console.log(size.value)
    })

    watch(() => data.type, () => {
      console.log(data)
    },{
      deep: true
    })

    return {
      editorRef,
      editorInstance,
      datasource,
      data,
      size,
      themeType,

      layoutEditor
    }
  }
})
</script>

<style scoped>
.fieldset {
  display: inline-block;
  vertical-align: top; /* enter your desired option */

  > span {
    margin-right: 10px;
  }
}

</style>
