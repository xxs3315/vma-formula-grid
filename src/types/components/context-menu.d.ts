import {RenderFunction, SetupContext} from "vue";
import {ComponentType, SizeType, VmaComponentInstance} from "../grid";

export namespace VmaFormulaGridCompContextMenuPropTypes {
    export type Size = SizeType
    export type Type = ComponentType
}

export interface VmaFormulaGridCompContextMenuProps {
    size?: VmaFormulaGridCompContextMenuPropTypes.Size
    type?: VmaFormulaGridCompContextMenuPropTypes.Type
}

export interface VmaFormulaGridCompContextMenuMethods {
}

interface VmaFormulaGridCompContextMenuPrivateMethods {
}

export type VmaFormulaGridCompContextMenuOptions = VmaFormulaGridCompContextMenuProps

export type VmaFormulaGridCompContextMenuEmits = []

export interface VmaFormulaGridCompContextMenuReactiveData {}

export interface VmaFormulaGridCompContextMenuRefs {}

export interface VmaFormulaGridCompContextMenuConstructor extends VmaComponentInstance, VmaFormulaGridCompContextMenuMethods, VmaFormulaGridCompContextMenuPrivateMethods {
    props: VmaFormulaGridCompContextMenuOptions
    context: SetupContext<VmaFormulaGridCompContextMenuEmits>
    reactiveData: VmaFormulaGridCompContextMenuReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridCompContextMenuRefs
}