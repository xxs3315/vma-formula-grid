import {RenderFunction, SetupContext} from "vue";
import {ComponentType, SizeType, VmaComponentInstance} from "../grid";

export namespace VmaFormulaGridCompIconPropTypes {
    export type Size = SizeType
    export type Type = ComponentType
}

export interface VmaFormulaGridCompIconProps {
    size?: VmaFormulaGridCompIconPropTypes.Size
    type?: VmaFormulaGridCompIconPropTypes.Type
}

export interface VmaFormulaGridCompIconMethods {
}

interface VmaFormulaGridCompIconPrivateMethods {
}

export type VmaFormulaGridCompIconOptions = VmaFormulaGridCompIconProps

export interface VmaFormulaGridCompIconConstructor extends VmaComponentInstance, VmaFormulaGridCompIconMethods, VmaFormulaGridCompIconPrivateMethods {
    props: VmaFormulaGridCompIconOptions
    context: SetupContext<VmaFormulaGridCompIconEmits>
    reactiveData: VmaFormulaGridCompIconReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridCompIconRefs
}