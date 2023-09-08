import {VmaFormulaGridGlobalHooks} from "../hooks";

export interface VmaFormulaGridPluginObject {
    install(vmaFormulaGrid: VmaFormulaGridCore, ...options: any[]): void
    [key: string]: any
}

export type VmaFormulaGridGlobalUse = (plugin: VmaFormulaGridPluginObject, ...options: any[]) => VmaFormulaGridCore

export interface VmaFormulaGridCore {
    version: string

    hooks: VmaFormulaGridGlobalHooks

    use: VmaFormulaGridGlobalUse
}

export const VMAFormulaGrid: VmaFormulaGridCore

export * from './all'

export default VMAFormulaGrid