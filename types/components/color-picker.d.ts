import { ComponentPublicInstance, RenderFunction, SetupContext } from 'vue';
import { ComponentType, SizeType, VmaComponentInstance, VmaFormulaGridConstructor, VmaFormulaGridProps } from '../grid';
import { VmaFormulaGridCompColorPickerPropTypes, VmaFormulaGridCompColorPickerProps } from './context-menu';

export namespace VmaFormulaGridCompColorPickerPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompColorPickerProps {
    size?: VmaFormulaGridCompColorPickerPropTypes.Size;
    type?: VmaFormulaGridCompColorPickerPropTypes.Type;
}

export interface VmaFormulaGridCompColorPickerMethods {}

interface VmaFormulaGridCompColorPickerPrivateMethods {}

export type VmaFormulaGridCompColorPickerOptions = VmaFormulaGridCompColorPickerProps;

export type VmaFormulaGridCompColorPickerEmits = ['update:color', 'change', 'advanceChange'];

export interface VmaFormulaGridCompColorPickerReactiveData {}

export interface VmaFormulaGridCompColorPickerRefs {}

export type VmaFormulaGridCompColorPickerInstance = ComponentPublicInstance<VmaFormulaGridCompColorPickerProps, VmaFormulaGridCompColorPickerConstructor>;

export interface VmaFormulaGridCompColorPickerConstructor extends VmaComponentInstance, VmaFormulaGridCompColorPickerMethods, VmaFormulaGridCompColorPickerPrivateMethods {
    props: VmaFormulaGridCompColorPickerOptions;
    context: SetupContext<VmaFormulaGridCompColorPickerEmits>;
    reactiveData: VmaFormulaGridCompColorPickerReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompColorPickerRefs;
}

export namespace VmaFormulaGridCompColorPickerPalettePropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompColorPickerPaletteProps {
    size?: VmaFormulaGridCompColorPickerPalettePropTypes.Size;
    type?: VmaFormulaGridCompColorPickerPalettePropTypes.Type;
}

export interface VmaFormulaGridCompColorPickerPaletteMethods {}

interface VmaFormulaGridCompColorPickerPalettePrivateMethods {}

export type VmaFormulaGridCompColorPickerPaletteOptions = VmaFormulaGridCompColorPickerPaletteProps;

export type VmaFormulaGridCompColorPickerPaletteEmits = ['change'];

export interface VmaFormulaGridCompColorPickerPaletteReactiveData {}

export interface VmaFormulaGridCompColorPickerPaletteRefs {}

export interface VmaFormulaGridCompColorPickerPaletteConstructor
    extends VmaComponentInstance,
        VmaFormulaGridCompColorPickerPaletteMethods,
        VmaFormulaGridCompColorPickerPalettePrivateMethods {
    props: VmaFormulaGridCompColorPickerPaletteOptions;
    context: SetupContext<VmaFormulaGridCompColorPickerPaletteEmits>;
    reactiveData: VmaFormulaGridCompColorPickerPaletteReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompColorPickerPaletteRefs;
}

export namespace VmaFormulaGridCompColorPickerLightnessPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompColorPickerLightnessProps {
    size?: VmaFormulaGridCompColorPickerLightnessPropTypes.Size;
    type?: VmaFormulaGridCompColorPickerLightnessPropTypes.Type;
}

export interface VmaFormulaGridCompColorPickerLightnessMethods {}

interface VmaFormulaGridCompColorPickerLightnessPrivateMethods {}

export type VmaFormulaGridCompColorPickerLightnessOptions = VmaFormulaGridCompColorPickerLightnessProps;

export type VmaFormulaGridCompColorPickerLightnessEmits = ['change'];

export interface VmaFormulaGridCompColorPickerLightnessReactiveData {}

export interface VmaFormulaGridCompColorPickerLightnessRefs {}

export interface VmaFormulaGridCompColorPickerLightnessConstructor
    extends VmaComponentInstance,
        VmaFormulaGridCompColorPickerLightnessMethods,
        VmaFormulaGridCompColorPickerLightnessPrivateMethods {
    props: VmaFormulaGridCompColorPickerLightnessOptions;
    context: SetupContext<VmaFormulaGridCompColorPickerLightnessEmits>;
    reactiveData: VmaFormulaGridCompColorPickerLightnessReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompColorPickerLightnessRefs;
}

export namespace VmaFormulaGridCompColorPickerDisplayPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompColorPickerDisplayProps {
    size?: VmaFormulaGridCompColorPickerDisplayPropTypes.Size;
    type?: VmaFormulaGridCompColorPickerDisplayPropTypes.Type;
}

export interface VmaFormulaGridCompColorPickerDisplayMethods {}

interface VmaFormulaGridCompColorPickerDisplayPrivateMethods {}

export type VmaFormulaGridCompColorPickerDisplayOptions = VmaFormulaGridCompColorPickerDisplayProps;

export type VmaFormulaGridCompColorPickerDisplayEmits = ['change'];

export interface VmaFormulaGridCompColorPickerDisplayReactiveData {}

export interface VmaFormulaGridCompColorPickerDisplayRefs {}

export interface VmaFormulaGridCompColorPickerDisplayConstructor
    extends VmaComponentInstance,
        VmaFormulaGridCompColorPickerDisplayMethods,
        VmaFormulaGridCompColorPickerDisplayPrivateMethods {
    props: VmaFormulaGridCompColorPickerDisplayOptions;
    context: SetupContext<VmaFormulaGridCompColorPickerDisplayEmits>;
    reactiveData: VmaFormulaGridCompColorPickerDisplayReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompColorPickerDisplayRefs;
}

export namespace VmaFormulaGridCompColorPickerBoardPropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompColorPickerBoardProps {
    size?: VmaFormulaGridCompColorPickerBoardPropTypes.Size;
    type?: VmaFormulaGridCompColorPickerBoardPropTypes.Type;
}

export interface VmaFormulaGridCompColorPickerBoardMethods {}

interface VmaFormulaGridCompColorPickerBoardPrivateMethods {}

export type VmaFormulaGridCompColorPickerBoardOptions = VmaFormulaGridCompColorPickerBoardProps;

export type VmaFormulaGridCompColorPickerBoardEmits = ['change'];

export interface VmaFormulaGridCompColorPickerBoardReactiveData {}

export interface VmaFormulaGridCompColorPickerBoardRefs {}

export interface VmaFormulaGridCompColorPickerBoardConstructor
    extends VmaComponentInstance,
        VmaFormulaGridCompColorPickerBoardMethods,
        VmaFormulaGridCompColorPickerBoardPrivateMethods {
    props: VmaFormulaGridCompColorPickerBoardOptions;
    context: SetupContext<VmaFormulaGridCompColorPickerBoardEmits>;
    reactiveData: VmaFormulaGridCompColorPickerBoardReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompColorPickerBoardRefs;
}

export namespace VmaFormulaGridCompColorPickerHuePropTypes {
    export type Size = SizeType;
    export type Type = ComponentType;
}

export interface VmaFormulaGridCompColorPickerHueProps {
    size?: VmaFormulaGridCompColorPickerHuePropTypes.Size;
    type?: VmaFormulaGridCompColorPickerHuePropTypes.Type;
}

export interface VmaFormulaGridCompColorPickerHueMethods {}

interface VmaFormulaGridCompColorPickerHuePrivateMethods {}

export type VmaFormulaGridCompColorPickerHueOptions = VmaFormulaGridCompColorPickerHueProps;

export type VmaFormulaGridCompColorPickerHueEmits = ['change'];

export interface VmaFormulaGridCompColorPickerHueReactiveData {}

export interface VmaFormulaGridCompColorPickerHueRefs {}

export interface VmaFormulaGridCompColorPickerHueConstructor extends VmaComponentInstance, VmaFormulaGridCompColorPickerHueMethods, VmaFormulaGridCompColorPickerHuePrivateMethods {
    props: VmaFormulaGridCompColorPickerHueOptions;
    context: SetupContext<VmaFormulaGridCompColorPickerHueEmits>;
    reactiveData: VmaFormulaGridCompColorPickerHueReactiveData;
    renderVN: RenderFunction;

    getRefs(): VmaFormulaGridCompColorPickerHueRefs;
}
