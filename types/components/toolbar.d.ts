import { ComponentPublicInstance, RenderFunction, SetupContext } from 'vue';
import { ComponentType, SizeType, VmaComponentInstance, VmaFormulaGridConstructor, VmaFormulaGridInstance } from '../grid';
import { VmaFormulaGridCompColorPickerConstructor, VmaFormulaGridCompColorPickerInstance } from './color-picker';

export namespace VmaFormulaGridCompToolbarPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompToolbarProps {
    size?: VmaFormulaGridCompToolbarPropTypes.Size;
    type?: VmaFormulaGridCompToolbarPropTypes.Type;
}

export interface VmaFormulaGridCompToolbarMethods {
    sync(grid: VmaFormulaGridConstructor | VmaFormulaGridInstance, lang: any, colorPicker: any): void;
}

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

export type VmaFormulaGridCompToolbarInstance = ComponentPublicInstance<VmaFormulaGridCompToolbarProps, VmaFormulaGridCompToolbarConstructor>;

export interface VmaFormulaGridCompToolbarSpacerProps {}

export interface VmaFormulaGridCompToolbarSpacerMethods {}

export type VmaFormulaGridCompToolbarSpacerOptions = VmaFormulaGridCompToolbarSpacerProps;

export interface VmaFormulaGridCompToolbarSpacerRefs {}

export interface VmaFormulaGridCompToolbarSpacerReactiveData {}

export type VmaFormulaGridCompToolbarSpacerEmits = [];

export interface VmaFormulaGridCompToolbarSpacerConstructor extends VmaComponentInstance, VmaFormulaGridCompToolbarSpacerMethods {
    props: VmaFormulaGridCompToolbarSpacerOptions;
    context: SetupContext<VmaFormulaGridCompToolbarSpacerEmits>;
    reactiveData: VmaFormulaGridCompToolbarSpacerReactiveData;
    renderVN: RenderFunction;
    getRefs(): VmaFormulaGridCompToolbarSpacerRefs;
}

export interface VmaFormulaGridCompToolbarSeparatorProps {}

export interface VmaFormulaGridCompToolbarSeparatorMethods {}

export type VmaFormulaGridCompToolbarSeparatorOptions = VmaFormulaGridCompToolbarSeparatorProps;

export interface VmaFormulaGridCompToolbarSeparatorRefs {}

export interface VmaFormulaGridCompToolbarSeparatorReactiveData {}

export type VmaFormulaGridCompToolbarSeparatorEmits = [];

export interface VmaFormulaGridCompToolbarSeparatorConstructor extends VmaComponentInstance, VmaFormulaGridCompToolbarSeparatorMethods {
    props: VmaFormulaGridCompToolbarSeparatorOptions;
    context: SetupContext<VmaFormulaGridCompToolbarSeparatorEmits>;
    reactiveData: VmaFormulaGridCompToolbarSeparatorReactiveData;
    renderVN: RenderFunction;
    getRefs(): VmaFormulaGridCompToolbarSeparatorRefs;
}

export interface VmaFormulaGridCompToolbarMenuSeparatorProps {}

export interface VmaFormulaGridCompToolbarMenuSeparatorMethods {}

export type VmaFormulaGridCompToolbarMenuSeparatorOptions = VmaFormulaGridCompToolbarMenuSeparatorProps;

export interface VmaFormulaGridCompToolbarMenuSeparatorRefs {}

export interface VmaFormulaGridCompToolbarMenuSeparatorReactiveData {}

export type VmaFormulaGridCompToolbarMenuSeparatorEmits = [];

export interface VmaFormulaGridCompToolbarMenuSeparatorConstructor extends VmaComponentInstance, VmaFormulaGridCompToolbarMenuSeparatorMethods {
    props: VmaFormulaGridCompToolbarMenuSeparatorOptions;
    context: SetupContext<VmaFormulaGridCompToolbarMenuSeparatorEmits>;
    reactiveData: VmaFormulaGridCompToolbarMenuSeparatorReactiveData;
    renderVN: RenderFunction;
    getRefs(): VmaFormulaGridCompToolbarMenuSeparatorRefs;
}

export interface VmaFormulaGridCompToolbarMenuSeparatorProps {}

export interface VmaFormulaGridCompToolbarGenericMethods {}

export type VmaFormulaGridCompToolbarGenericOptions = VmaFormulaGridCompToolbarGenericProps;

export interface VmaFormulaGridCompToolbarGenericRefs {}

export interface VmaFormulaGridCompToolbarGenericReactiveData {}

export type VmaFormulaGridCompToolbarGenericEmits = [];

export interface VmaFormulaGridCompToolbarGenericConstructor extends VmaComponentInstance, VmaFormulaGridCompToolbarGenericMethods {
    props: VmaFormulaGridCompToolbarGenericOptions;
    context: SetupContext<VmaFormulaGridCompToolbarGenericEmits>;
    reactiveData: VmaFormulaGridCompToolbarGenericReactiveData;
    renderVN: RenderFunction;
    getRefs(): VmaFormulaGridCompToolbarGenericRefs;
}
