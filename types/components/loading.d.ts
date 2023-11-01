import { RenderFunction, SetupContext } from 'vue';
import { ComponentType, SizeType, VmaComponentInstance } from '../grid';

export namespace VmaFormulaGridCompLoadingPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
    export type Category = 'plane' | 'chase' | 'bounce' | 'wave' | 'pulse' | 'flow' | 'swing' | 'circle' | 'circle-fade' | 'fold';
}

export interface VmaFormulaGridCompLoadingMethods {}

export type VmaFormulaGridCompLoadingEmits = [];

export interface VmaFormulaGridCompLoadingProps {
    size: VmaFormulaGridCompLoadingPropTypes.Size;
    currentColor: boolean;
    vertical: boolean;
    type: VmaFormulaGridCompLoadingPropTypes.Type;
    category: VmaFormulaGridCompLoadingPropTypes.Category;
}

export interface VmaFormulaGridCompLoadingConstructor extends VmaComponentInstance, VmaFormulaGridCompLoadingMethods {
    props: VmaFormulaGridCompLoadingOptions;
    context: SetupContext<VmaFormulaGridCompLoadingEmits>;
    renderVN: RenderFunction;
}
export type VmaFormulaGridCompLoadingOptions = VmaFormulaGridCompLoadingProps;
