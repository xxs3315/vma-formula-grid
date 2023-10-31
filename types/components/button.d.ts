import { RenderFunction, SetupContext } from "vue";
import { ComponentType, SizeType, VmaComponentInstance } from "../grid";
import { VmaFormulaGridCompLoadingPropTypes } from "./loading";

export namespace VmaFormulaGridCompButtonPropTypes {
	export type Size = SizeType;
	export type Type = ComponentType;
	export type IconPosition = "left" | "right";
}

export interface VmaFormulaGridCompButtonMethods {}

export type VmaFormulaGridCompButtonEmits = ["click"];

export interface VmaFormulaGridCompButtonProps {
	text: string;
	icon: string;
	color: string;
	block: boolean;
	plain: boolean;
	round: boolean;
	square: boolean;
	loading: boolean;
	disabled: boolean;
	iconPrefix: string;
	loadingText: string;
	loadingCategory: VmaFormulaGridCompLoadingPropTypes.Category;
	type: VmaFormulaGridCompButtonPropTypes.Type;
	size: VmaFormulaGridCompButtonPropTypes.Size;
	iconPosition: VmaFormulaGridCompButtonPropTypes.IconPosition;
}

export interface VmaFormulaGridCompButtonConstructor
	extends VmaComponentInstance,
		VmaFormulaGridCompButtonMethods {
	props: VmaFormulaGridCompButtonOptions;
	context: SetupContext<VmaFormulaGridCompButtonEmits>;
	renderVN: RenderFunction;
}
export type VmaFormulaGridCompButtonOptions = VmaFormulaGridCompButtonProps;
