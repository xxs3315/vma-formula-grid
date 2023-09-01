import VmaFormulaGrid from "./vma-formula-grid";
import VmaFormulaGridComponent from './components/grid/index.ts'
import {App} from "vue";

import dc, {dfo, d} from "./utils";
import { FormulaParser, MAX_ROW, MAX_COLUMN, SSF, DepParser, FormulaError, FormulaHelpers, Types, ReversedTypes, Factorials, WildCard, Criteria, Address } from './formula'

const components = [
    VmaFormulaGridComponent,
]

function install(app: App) {
    components.forEach((component) => component.install(app))
    // pluginComponents.forEach((pluginComponent) => pluginComponent.install(app))
}

declare module './vma-formula-grid' {
    interface VmaFormulaGridInstance {
        install: typeof install
    }
}

VmaFormulaGrid.install = install

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
export { dc, dfo, d }
export { FormulaParser, MAX_ROW, MAX_COLUMN, SSF, DepParser, FormulaError, FormulaHelpers, Types, ReversedTypes, Factorials, WildCard, Criteria, Address }
export default VmaFormulaGrid
