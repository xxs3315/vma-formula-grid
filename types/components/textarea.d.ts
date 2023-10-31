import { Ref, RenderFunction, SetupContext } from "vue";
import {
	ComponentType,
	SizeType,
	ValueOf,
	VmaComponentInstance,
} from "../grid";

export namespace VmaFormulaGridCompTextareaPropTypes {
	export type Size = SizeType;
	export type Type = ComponentType;
	export type ModelValue = string | number | null;
	export type Immediate = boolean;
	export type Name = string;
	export type Readonly = boolean;
	export type Disabled = boolean;
	export type Placeholder = string;
	export type Maxlength = string | number;
	export type Rows = string | number;
	export type Wrap = boolean;
	export type Autofocus = boolean;
}

export interface VmaFormulaGridCompTextareaMethods {
	dispatchEvent: (
		type: ValueOf<VmaFormulaGridCompTextareaEmits>,
		params: any,
		evnt?: Event | { type: string },
	) => void;

	/**
	 * 获取焦点
	 */
	focus(): Promise<any>;

	/**
	 * 失去焦点
	 */
	blur(): Promise<any>;
}

export interface VmaFormulaGridCompTextareaReactiveData {
	initiated: boolean;
	isActivated: boolean;
	inputValue: any;
}

export interface VmaFormulaGridCompTextareaRefs {
	refElem: Ref<HTMLDivElement>;
	refTextarea: Ref<HTMLTextAreaElement>;
	refLinesDiv: Ref<HTMLDivElement>;
	refCountHelperDiv: Ref<HTMLDivElement>;
	refCountTargetHelperDiv: Ref<HTMLDivElement>;
}

export interface VmaFormulaGridCompTextareaConstructor
	extends VmaComponentInstance,
		VmaFormulaGridCompTextareaMethods {
	props: VmaFormulaGridCompTextareaOptions;
	context: SetupContext<VmaFormulaGridCompTextareaEmits>;
	reactiveData: VmaFormulaGridCompTextareaReactiveData;
	renderVN: RenderFunction;

	getRefs(): VmaFormulaGridCompTextareaRefs;
}

export type VmaFormulaGridCompTextareaOptions = VmaFormulaGridCompTextareaProps;

export interface VmaFormulaGridCompTextareaProps {
	size: VmaFormulaGridCompTextareaPropTypes.Size;
	type: VmaFormulaGridCompTextareaPropTypes.Type;
	modelValue: boolean;
	label: [string, number];
	indeterminate: boolean;
	title: [string, number];
	content: [string, number];
	disabled: boolean;
}

export type VmaFormulaGridCompTextareaEmits = [
	"update:modelValue",
	"input",
	"change",
	"focus",
	"blur",
	"keydown",
	"keyup",
];
