import VmaFormulaGridComp from './grid.ts'
import VmaFormulaGridHeader from './header.ts'
import VmaFormulaGridBody from './body.ts'

import VmaFormulaGridCompIcon from '../icon/icon.ts'
import VmaFormulaGridCompContextMenu from '../context-menu/context-menu.ts'
import VmaFormulaGridCompTextarea from '../textarea/textarea.ts'
import {App} from "vue";


export const VmaFormulaGrid = Object.assign(VmaFormulaGridComp, {
    install: function (app: App) {
        app.component('VmaFormulaGrid', VmaFormulaGridComp)
        app.component('VmaFormulaGridHeader', VmaFormulaGridHeader)
        app.component('VmaFormulaGridBody', VmaFormulaGridBody)
        app.component('VmaFormulaGridCompIcon', VmaFormulaGridCompIcon)
        app.component('VmaFormulaGridCompTextarea', VmaFormulaGridCompTextarea)
        app.component('VmaFormulaGridCompContextMenu', VmaFormulaGridCompContextMenu)
    }
})

export default VmaFormulaGrid
