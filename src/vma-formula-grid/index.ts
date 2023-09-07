import hooks from './hooks'

export class VmaFormulaGridInstance {
    readonly version = '1.0.4'

    readonly hooks = hooks
}

export const VmaFormulaGrid = new VmaFormulaGridInstance()

export default VmaFormulaGrid
