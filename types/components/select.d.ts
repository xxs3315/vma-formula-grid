import { ComponentPublicInstance, Ref, RenderFunction, SetupContext } from 'vue';
import { SizeType, ValueOf, VmaComponentInstance } from '../grid';

export type VmaFormulaGridCompSelectInstance = ComponentPublicInstance<VmaFormulaGridCompSelectProps, VmaFormulaGridCompSelectConstructor>;

export interface VmaFormulaGridCompSelectReactiveData {
    initiated: boolean;
    staticOptions: any[];
    fullGroupList: any[];
    fullOptionList: any[];
    visibleGroupList: any[];
    visibleOptionList: any[];
    panelIndex: number;
    panelStyle: VNodeStyle;
    panelPlacement: any;
    currentValue: any;
    visiblePanel: boolean;
    animateVisible: boolean;
    isActivated: boolean;
}

export interface SelectPrivateRef {
    refSelect: Ref<HTMLDivElement>;
}
export interface VmaFormulaGridCompSelectPrivateRef extends SelectPrivateRef {}

export namespace VmaFormulaGridCompSelectPropTypes {
    export type Size = SizeType;
}

export type VmaFormulaGridCompSelectEmits = ['update:modelValue', 'change', 'clear'];

export interface VmaFormulaGridCompSelectProps {
    size?: SizeType;
    modelValue: any;
    clearable: boolean;
    placeholder: string;
    disabled: boolean;
    multiple: boolean;
    prefixIcon: string;
    placement: string;
    options: any[];
    emptyText: string;
}

export interface VmaFormulaGridCompSelectMethods {
    dispatchEvent(type: ValueOf<VmaFormulaGridCompSelectEmits>, params: any, evnt?: Event): void;
}

export interface VmaFormulaGridCompSelectPrivateMethods {
    // handleFilterEvent(evnt: any): void
    // filterMouseoverEvent(evnt: any, item: any, child?: any): void
    // filterMouseoutEvent(evnt: any, item: any): void
    // filterLinkEvent(evnt: any, menu: any): void
}

export interface VmaFormulaGridCompSelectConstructor extends VmaComponentInstance, VmaFormulaGridCompSelectMethods, VmaFormulaGridCompSelectPrivateMethods {
    props: VmaFormulaGridCompSelectProps;
    context: SetupContext<VmaFormulaGridCompSelectEmits>;
    getRefMaps(): VmaFormulaGridCompSelectPrivateRef;
    reactiveData: VmaFormulaGridCompSelectReactiveData;
    renderVN: RenderFunction;
}

export interface VmaFormulaGridCompSelectOptionGroupMethods {
    handleChecked(params: { label: null | string | number }, evnt: Event): void;
}

export interface VmaFormulaGridCompSelectOptionGroupConstructor extends VmaComponentInstance, VmaFormulaGridCompSelectOptionGroupMethods {
    props: VmaFormulaGridCompSelectOptionGroupOptions;
    context: SetupContext<VmaFormulaGridCompSelectOptionGroupEmits>;
}
export type VmaFormulaGridCompSelectOptionGroupOptions = VmaFormulaGridCompSelectOptionGroupProps;

export interface VmaFormulaGridCompSelectOptionGroupProps {
    size?: VmaFormulaGridCompSelectOptionPropTypes.Size;
    type?: VmaFormulaGridCompSelectOptionPropTypes.Type;
    modelValue?: any[];
    disabled?: boolean;
}

export type VmaFormulaGridCompSelectOptionGroupEmits = ['update:modelValue', 'change'];

export interface VmaFormulaGridCompSelectOptionGroupMethods {
    handleChecked(params: { label: null | string | number }, evnt: Event): void;
}

export interface VmaFormulaGridCompSelectOptionConstructor extends VmaComponentInstance, VmaFormulaGridCompSelectOptionMethods {
    props: VmaFormulaGridCompSelectOptionOptions;
    context: SetupContext<VmaFormulaGridCompSelectOptionEmits>;
}
export type VmaFormulaGridCompSelectOptionOptions = VmaFormulaGridCompSelectOptionProps;

export interface VmaFormulaGridCompSelectOptionProps {
    size?: VmaFormulaGridCompSelectOptionPropTypes.Size;
    type?: VmaFormulaGridCompSelectOptionPropTypes.Type;
    modelValue?: any[];
    disabled?: boolean;
}

export type VmaFormulaGridCompSelectOptionEmits = ['update:modelValue', 'change'];

export interface VmaFormulaGridCompSelectOptionMethods {
    handleChecked(params: { label: null | string | number }, evnt: Event): void;
}
