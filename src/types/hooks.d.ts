import { VmaFormulaGridConstructor } from './grid'

export namespace VmaFormulaGridGlobalHooksHandlers {
    export type name = 'VmaFormulaGrid'
    export interface HookOptions {
        setupGrid?(grid: VmaFormulaGridConstructor): void | { [key: string]: any }
    }
}

export class VmaFormulaGridGlobalHooks {
    add(type: string, options: VmaFormulaGridGlobalHooksHandlers.HookOptions): VmaFormulaGridGlobalHooks
    forEach(callback: (options: VmaFormulaGridGlobalHooksHandlers.HookOptions, type: string) => void): void
}
