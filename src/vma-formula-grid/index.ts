import hooks from './hooks'

export class VmaFormulaGridInstance {
    readonly version = '1.0.2'

    readonly hooks = hooks
}

export const VmaFormulaGrid = new VmaFormulaGridInstance()

export default VmaFormulaGrid
