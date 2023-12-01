import { RenderFunction, SetupContext } from 'vue';
import { ComponentType, SizeType, VmaComponentInstance } from '../grid';

export namespace VmaFormulaGridCompToolbarPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompToolbarProps {
    size?: VmaFormulaGridCompToolbarPropTypes.Size;
    type?: VmaFormulaGridCompToolbarPropTypes.Type;
}

export interface VmaFormulaGridCompToolbarMethods {}

interface VmaFormulaGridCompToolbarPrivateMethods {}

export type VmaFormulaGridCompToolbarOptions = VmaFormulaGridCompToolbarProps;

export type VmaFormulaGridCompToolbarEmits = [];

export interface VmaFormulaGridCompToolbarReactiveData {}

export interface VmaFormulaGridCompToolbarRefs {}

export interface VmaFormulaGridCompToolbarConstructor extends VmaComponentInstance, VmaFormulaGridCompToolbarMethods, VmaFormulaGridCompToolbarPrivateMethods {
    props: VmaFormulaGridCompToolbarOptions;
    context: SetupContext<VmaFormulaGridCompToolbarEmits>;
    reactiveData: VmaFormulaGridCompToolbarReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompToolbarRefs;
}
