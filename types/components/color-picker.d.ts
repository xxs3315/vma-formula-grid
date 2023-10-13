import {RenderFunction, SetupContext} from "vue";
import {ComponentType, SizeType, VmaComponentInstance} from "../grid";
import {VmaFormulaGridCompColorPickerPropTypes, VmaFormulaGridCompColorPickerProps} from "./context-menu";

export namespace VmaFormulaGridCompColorPickerPropTypes {
    export type Size = SizeType
    export type Type = ComponentType
}

export interface VmaFormulaGridCompColorPickerProps {
    size?: VmaFormulaGridCompColorPickerPropTypes.Size
    type?: VmaFormulaGridCompColorPickerPropTypes.Type
}


export interface VmaFormulaGridCompColorPickerMethods {
}

interface VmaFormulaGridCompColorPickerPrivateMethods {
}

export type VmaFormulaGridCompColorPickerOptions = VmaFormulaGridCompColorPickerProps

export type VmaFormulaGridCompColorPickerEmits = []

export interface VmaFormulaGridCompColorPickerReactiveData {}

export interface VmaFormulaGridCompColorPickerRefs {}

export interface VmaFormulaGridCompColorPickerConstructor extends VmaComponentInstance, VmaFormulaGridCompColorPickerMethods, VmaFormulaGridCompColorPickerPrivateMethods {
    props: VmaFormulaGridCompColorPickerOptions
    context: SetupContext<VmaFormulaGridCompColorPickerEmits>
    reactiveData: VmaFormulaGridCompColorPickerReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridCompColorPickerRefs
}

export namespace VmaFormulaGridCompColorPickerPalettePropTypes {
    export type Size = SizeType
    export type Type = ComponentType
}

export interface VmaFormulaGridCompColorPickerPaletteProps {
    size?: VmaFormulaGridCompColorPickerPalettePropTypes.Size
    type?: VmaFormulaGridCompColorPickerPalettePropTypes.Type
}


export interface VmaFormulaGridCompColorPickerPaletteMethods {
}

interface VmaFormulaGridCompColorPickerPalettePrivateMethods {
}

export type VmaFormulaGridCompColorPickerPaletteOptions = VmaFormulaGridCompColorPickerPaletteProps

export type VmaFormulaGridCompColorPickerPaletteEmits = ['change']

export interface VmaFormulaGridCompColorPickerPaletteReactiveData {}

export interface VmaFormulaGridCompColorPickerPaletteRefs {}

export interface VmaFormulaGridCompColorPickerPaletteConstructor extends VmaComponentInstance, VmaFormulaGridCompColorPickerPaletteMethods, VmaFormulaGridCompColorPickerPalettePrivateMethods {
    props: VmaFormulaGridCompColorPickerPaletteOptions
    context: SetupContext<VmaFormulaGridCompColorPickerPaletteEmits>
    reactiveData: VmaFormulaGridCompColorPickerPaletteReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridCompColorPickerPaletteRefs
}


export namespace VmaFormulaGridCompColorPickerLightnessPropTypes {
    export type Size = SizeType
    export type Type = ComponentType
}

export interface VmaFormulaGridCompColorPickerLightnessProps {
    size?: VmaFormulaGridCompColorPickerLightnessPropTypes.Size
    type?: VmaFormulaGridCompColorPickerLightnessPropTypes.Type
}


export interface VmaFormulaGridCompColorPickerLightnessMethods {
}

interface VmaFormulaGridCompColorPickerLightnessPrivateMethods {
}

export type VmaFormulaGridCompColorPickerLightnessOptions = VmaFormulaGridCompColorPickerLightnessProps

export type VmaFormulaGridCompColorPickerLightnessEmits = ['change']

export interface VmaFormulaGridCompColorPickerLightnessReactiveData {}

export interface VmaFormulaGridCompColorPickerLightnessRefs {}

export interface VmaFormulaGridCompColorPickerLightnessConstructor extends VmaComponentInstance, VmaFormulaGridCompColorPickerLightnessMethods, VmaFormulaGridCompColorPickerLightnessPrivateMethods {
    props: VmaFormulaGridCompColorPickerLightnessOptions
    context: SetupContext<VmaFormulaGridCompColorPickerLightnessEmits>
    reactiveData: VmaFormulaGridCompColorPickerLightnessReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridCompColorPickerLightnessRefs
}

export interface DragEventOptions {
    drag?: (event: Event) => void;
    start?: (event: Event) => void;
    end?: (event: Event) => void;
}
