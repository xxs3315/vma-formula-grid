import VmaFormulaGridComp from './grid.ts'
import VmaFormulaGridHeader from './header.ts'
import VmaFormulaGridBody from './body.ts'
import VmaFormulaGridCell from './cell.ts'

import VmaFormulaGridCompIcon from '../icon/icon.ts'
import VmaFormulaGridCompContextMenu from '../context-menu/context-menu.ts'
import VmaFormulaGridCompContextMenuHook from '../context-menu/hooks'
import {ComponentOptions} from "vue";
import VmaFormulaGrid from "../../vma-formula-grid";

// `Vue.use` automatically prevents you from using
// the same plugin more than once,
// so calling it multiple times on the same plugin
// will install the plugin only once
VmaFormulaGridComp.install = (Vue: ComponentOptions) => {
    Vue.component('VmaFormulaGrid', VmaFormulaGridComp)
    Vue.component('VmaFormulaGridHeader', VmaFormulaGridHeader)
    Vue.component('VmaFormulaGridBody', VmaFormulaGridBody)
    Vue.component('VmaFormulaGridCell', VmaFormulaGridCell)
    Vue.component('VmaFormulaGridCompIcon', VmaFormulaGridCompIcon)
    VmaFormulaGrid.hooks.add('VmaFormulaGridCompContextMenu', VmaFormulaGridCompContextMenuHook)
    Vue.component(VmaFormulaGridCompContextMenu.name, VmaFormulaGridCompContextMenu)
}

// // To auto-install when vue is found
// // 如果浏览器环境且拥有全局Vue，则自动安装组件
// declare global {
//     interface Window {
//         Vue?: any;
//     }
// }
//
// if (typeof window !== "undefined" && window.Vue) {
//     window.Vue.use(VmaFormulaGrid);
// }

// To allow use as module (npm/webpack/etc.) export component
// export { dc, dfo, d }
// export { FormulaParser, MAX_ROW, MAX_COLUMN, SSF, DepParser, FormulaError, FormulaHelpers, Types, ReversedTypes, Factorials, WildCard, Criteria, Address }
export default VmaFormulaGridComp
