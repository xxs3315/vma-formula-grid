import { RenderFunction, SetupContext } from 'vue';
import { ComponentType, SizeType, VmaComponentInstance } from '../grid';
import { VmaFormulaGridCompLoadingPropTypes } from './loading';

export namespace VmaFormulaGridCompCodeMirrorPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompCodeMirrorMethods {}

export type VmaFormulaGridCompCodeMirrorEmits = ['click'];

export interface VmaFormulaGridCompCodeMirrorProps {
    type: VmaFormulaGridCompCodeMirrorPropTypes.Type;
    size: VmaFormulaGridCompCodeMirrorPropTypes.Size;
}

export interface VmaFormulaGridCompCodeMirrorConstructor extends VmaComponentInstance, VmaFormulaGridCompCodeMirrorMethods {
    props: VmaFormulaGridCompCodeMirrorOptions;
    context: SetupContext<VmaFormulaGridCompCodeMirrorEmits>;
    renderVN: RenderFunction;
}
export type VmaFormulaGridCompCodeMirrorOptions = VmaFormulaGridCompCodeMirrorProps;
