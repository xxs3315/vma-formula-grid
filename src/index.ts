import VmaFormulaGrid from './grid'
import VmaFormulaGridHeader from './header.ts'
import VmaFormulaGridBody from './body.ts'
import VmaFormulaGridCell from './cell.ts'
import {ComponentOptions} from "vue";

// `Vue.use` automatically prevents you from using
// the same plugin more than once,
// so calling it multiple times on the same plugin
// will install the plugin only once
VmaFormulaGrid.install = (Vue: ComponentOptions) => {
    Vue.component('VmaFormulaGrid', VmaFormulaGrid)
    Vue.component('VmaFormulaGridHeader', VmaFormulaGridHeader)
    Vue.component('VmaFormulaGridBody', VmaFormulaGridBody)
    Vue.component('VmaFormulaGridCell', VmaFormulaGridCell)
}

// To auto-install when vue is found
// 如果浏览器环境且拥有全局Vue，则自动安装组件
declare global {
    interface Window {
        Vue?: any;
    }
}

if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(VmaFormulaGrid);
}

// To allow use as module (npm/webpack/etc.) export component
export default VmaFormulaGrid
