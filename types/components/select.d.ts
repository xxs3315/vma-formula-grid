import {ComponentType, SizeType, VmaComponentInstance} from "../grid";
import {RenderFunction, SetupContext} from "vue/dist/vue";

export namespace VmaFormulaGridCompSelectPropTypes {
    export type Size = SizeType
    export type Type = ComponentType
}

export interface VmaFormulaGridCompSelectProps {
    size?: VmaFormulaGridCompSelectPropTypes.Size
    type?: VmaFormulaGridCompSelectPropTypes.Type
}


export interface VmaFormulaGridCompSelectMethods {
}

interface VmaFormulaGridCompSelectPrivateMethods {
}

export type VmaFormulaGridCompSelectOptions = VmaFormulaGridCompSelectProps

export type VmaFormulaGridCompSelectEmits = ['update:modelValue', 'change', 'clear', 'blur', 'focus']

export interface VmaFormulaGridCompSelectReactiveData {}

export interface VmaFormulaGridCompSelectRefs {}

export interface VmaFormulaGridCompSelectConstructor extends VmaComponentInstance, VmaFormulaGridCompSelectMethods, VmaFormulaGridCompSelectPrivateMethods {
    props: VmaFormulaGridCompSelectOptions
    context: SetupContext<VmaFormulaGridCompSelectEmits>
    reactiveData: VmaFormulaGridCompSelectReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridCompSelectRefs
}