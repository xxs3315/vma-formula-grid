import { SizeType, VmaFormulaGridCompComponentInstance } from './grid';
import { Ref, RenderFunction, SetupContext } from 'vue';
import { ComponentType } from '../grid';

export interface VmaFormulaGridCompInputConstructor extends VmaFormulaGridCompComponentInstance, VmaFormulaGridCompInputMethods {
    props: VmaFormulaGridCompInputProps;
    context: SetupContext<VmaFormulaGridCompInputEmits>;
    reactiveData: VmaFormulaGridCompInputReactiveData;
    getRefMaps(): VmaFormulaGridCompInputPrivateRef;
    renderVN: RenderFunction;
}

export interface VmaFormulaGridCompInputProps {
    size?: VmaFormulaGridCompInputPropTypes.Size;
    type?: VmaFormulaGridCompInputPropTypes.Type;
    modelValue?: VmaFormulaGridCompInputPropTypes.ModelValue;
    immediate?: VmaFormulaGridCompInputPropTypes.Immediate;
    name?: VmaFormulaGridCompInputPropTypes.Name;
    category?: VmaFormulaGridCompInputPropTypes.Category;
    clearable?: VmaFormulaGridCompInputPropTypes.Clearable;
    readonly?: VmaFormulaGridCompInputPropTypes.Readonly;
    disabled?: VmaFormulaGridCompInputPropTypes.Disabled;
    placeholder?: VmaFormulaGridCompInputPropTypes.Placeholder;
    maxlength?: VmaFormulaGridCompInputPropTypes.Maxlength;
    autocomplete?: VmaFormulaGridCompInputPropTypes.Autocomplete;
    align?: VmaFormulaGridCompInputPropTypes.Align;

    // number、integer、float
    min?: VmaFormulaGridCompInputPropTypes.Min;
    max?: VmaFormulaGridCompInputPropTypes.Max;
    step?: VmaFormulaGridCompInputPropTypes.Step;

    // number、integer、float、password
    controls?: VmaFormulaGridCompInputPropTypes.Controls;

    // float
    digits?: VmaFormulaGridCompInputPropTypes.Digits;

    prefixIcon?: VmaFormulaGridCompInputPropTypes.PrefixIcon;
    suffixIcon?: VmaFormulaGridCompInputPropTypes.SuffixIcon;
    placement?: VmaFormulaGridCompInputPropTypes.Placement;
}

export namespace VmaFormulaGridCompInputPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
    export type ModelValue = string | number | Date | null;
    export type Immediate = boolean;
    export type Name = string;
    export type Category = 'text' | 'search' | 'number' | 'integer' | 'float' | 'password';
    export type Clearable = boolean;
    export type Readonly = boolean;
    export type Disabled = boolean;
    export type Placeholder = string;
    export type Maxlength = string | number;
    export type Autocomplete = string;
    export type Align = string;
    export type Min = string | number;
    export type Max = string | number;
    export type Step = string | number;
    export type Controls = boolean;
    export type Digits = string | number;
    export type PrefixIcon = string;
    export type SuffixIcon = string;
    export type Placement = 'top' | 'bottom' | '' | null;
}

export type VmaFormulaGridCompInputEmits = [
    'update:modelValue',
    'input',
    'change',
    'keydown',
    'keyup',
    'mousewheel',
    'click',
    'focus',
    'blur',
    'clear',
    'search-click',
    'toggle-visible',
    'prev-number',
    'next-number',
    'prefix-click',
    'suffix-click',
];

export interface VmaFormulaGridCompInputReactiveData {
    initiated: boolean;
    panelIndex: number;
    showPwd: boolean;
    isActivated: boolean;
    inputValue: any;
}

export interface VmaFormulaGridCompInputPrivateRef {
    refElem: Ref<HTMLDivElement>;
    refInput: Ref<HTMLInputElement>;
}

export interface VmaFormulaGridCompInputMethods {
    dispatchEvent: (type: ValueOf<VmaFormulaGridCompInputEmits>, params: any, evnt?: Event | { type: string }) => void;
    /**
     * 获取焦点
     */
    focus(): Promise<any>;
    /**
     * 失去焦点
     */
    blur(): Promise<any>;
}
