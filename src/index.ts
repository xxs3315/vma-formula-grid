import VmaFormulaGrid from './components/grid/index.ts'
import {App} from "vue";

import dc, {dfo, d} from "./utils";
import { FormulaParser, MAX_ROW, MAX_COLUMN, SSF, DepParser, FormulaError, FormulaHelpers, Types, ReversedTypes, Factorials, WildCard, Criteria, Address } from './formula'

const components = [
    VmaFormulaGrid,
]
//
// declare module './v-m-a-formula-grid' {
//     interface VmaFormulaGridCore {
//         install: typeof install
//     }
// }

export function install (app: App, options: any) {
    components.forEach(component => component.install(app))
}

// To auto-install when vue is found
// 如果浏览器环境且拥有全局Vue，则自动安装组件
// declare global {
//     interface Window {
//         Vue?: any;
//     }
// }
//
// if (typeof window !== "undefined" && window.Vue) {
//     window.Vue.use(VmaFormulaGrid);
// }

export * from './v-m-a-formula-grid'

export { dc, dfo, d }
export { FormulaParser, MAX_ROW, MAX_COLUMN, SSF, DepParser, FormulaError, FormulaHelpers, Types, ReversedTypes, Factorials, WildCard, Criteria, Address }

export * from './components/grid'
