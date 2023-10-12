import {RenderFunction, SetupContext} from "vue";
import {ComponentType, SizeType, VmaComponentInstance} from "../grid";
import {VmaFormulaGridCompColorPickerPropTypes, VmaFormulaGridCompColorPickerProps} from "./context-menu";

export namespace VmaFormulaGridCompColorPickerPropTypes {
    export type Size = SizeType
    export type Type = ComponentType
}

export interface VmaFormulaGridCompColorPickerProps {
    size?: VmaFormulaGridCompColorPickerPropTypes.Size
    type?: VmaFormulaGridCompColorPickerPropTypes.Type
}


export interface VmaFormulaGridCompColorPickerMethods {
}

interface VmaFormulaGridCompColorPickerPrivateMethods {
}

export type VmaFormulaGridCompColorPickerOptions = VmaFormulaGridCompColorPickerProps

export type VmaFormulaGridCompColorPickerEmits = []

export interface VmaFormulaGridCompColorPickerReactiveData {}

export interface VmaFormulaGridCompColorPickerRefs {}

export interface VmaFormulaGridCompColorPickerConstructor extends VmaComponentInstance, VmaFormulaGridCompColorPickerMethods, VmaFormulaGridCompColorPickerPrivateMethods {
    props: VmaFormulaGridCompColorPickerOptions
    context: SetupContext<VmaFormulaGridCompColorPickerEmits>
    reactiveData: VmaFormulaGridCompColorPickerReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridCompColorPickerRefs
}