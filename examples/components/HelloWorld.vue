<template>
  <fieldset class="fieldset">
    <legend>Select a datasource type:</legend>
    <div>
      <input type="radio" id="datasourceArray" v-model="datasource" value="array"/>
      <label for="datasourceArray">Array</label>
    </div>
    <div>
      <input type="radio" id="datasourceMap" v-model="datasource" value="map" checked/>
      <label for="datasourceMap">Map</label>
    </div>
  </fieldset>

  <fieldset class="fieldset">
    <legend>Select a size type:</legend>
    <div>
      <input type="radio" id="sizeLarge" v-model="size" value="large"/>
      <label for="sizeLarge">Large</label>
    </div>
    <div>
      <input type="radio" id="sizeNormal" v-model="size" value="normal" checked/>
      <label for="sizeNormal">Normal</label>
    </div>
    <div>
      <input type="radio" id="sizeSmall" v-model="size" value="small"/>
      <label for="sizeSmall">Small</label>
    </div>
    <div>
      <input type="radio" id="sizeMini" v-model="size" value="mini"/>
      <label for="sizeMini">Mini</label>
    </div>
  </fieldset>

  <fieldset class="fieldset">
    <legend>Select a theme type:</legend>
    <div>
      <input type="radio" id="themeTypePrimary" v-model="themeType" value="primary" checked/>
      <label for="themeTypePrimary">Primary</label>
    </div>
    <div>
      <input type="radio" id="themeTypeSuccess" v-model="themeType" value="success"/>
      <label for="themeTypeSuccess">Success</label>
    </div>
    <div>
      <input type="radio" id="themeTypeWarning" v-model="themeType" value="warning"/>
      <label for="themeTypeWarning">Warning</label>
    </div>
    <div>
      <input type="radio" id="themeTypeDanger" v-model="themeType" value="danger"/>
      <label for="themeTypeDanger">Danger</label>
    </div>
  </fieldset>


  <vma-formula-grid style="width: 100vw; height: 800px;" :data="data" :size="size" :type="themeType" />
</template>

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
    ])

    const data = reactive({
      type: 'map', // array or map, default value is array
      arrayData: arrayData, // default data
      mapData: mapData
    })

    watch(() => datasource.value, () => {
      console.log(datasource.value)
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
      datasource,
      data,
      size,
      themeType
    }
  }
})
</script>

<style scoped>
.fieldset {
  display: inline-block;
  vertical-align: top; /* enter your desired option */
}
</style>
