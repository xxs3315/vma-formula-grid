import { RenderFunction, SetupContext } from 'vue';
import { ComponentType, SizeType, VmaComponentInstance } from '../grid';

export namespace VmaFormulaGridCompCodeMirrorPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompCodeMirrorProps {
    size?: VmaFormulaGridCompCodeMirrorPropTypes.Size;
    type?: VmaFormulaGridCompCodeMirrorPropTypes.Type;
}

export interface VmaFormulaGridCompCodeMirrorMethods {}

interface VmaFormulaGridCompCodeMirrorPrivateMethods {}

export type VmaFormulaGridCompCodeMirrorOptions = VmaFormulaGridCompCodeMirrorProps;

export type VmaFormulaGridCompCodeMirrorEmits = ['change', 'update', 'focus', 'blur', 'ready', 'update:modelValue'];

export interface VmaFormulaGridCompCodeMirrorReactiveData {}

export interface VmaFormulaGridCompCodeMirrorRefs {}

export interface VmaFormulaGridCompCodeMirrorConstructor extends VmaComponentInstance, VmaFormulaGridCompCodeMirrorMethods, VmaFormulaGridCompCodeMirrorPrivateMethods {
    props: VmaFormulaGridCompCodeMirrorOptions;
    context: SetupContext<VmaFormulaGridCompCodeMirrorEmits>;
    reactiveData: VmaFormulaGridCompCodeMirrorReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompCodeMirrorRefs;
}
