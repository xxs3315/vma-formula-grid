import {
    ComponentOptions,
    createCommentVNode,
    defineComponent,
    h, inject,
    onMounted,
    provide,
    reactive,
    ref,
    resolveComponent, Teleport
} from "vue";
import {Guid} from "../../utils/guid.ts";
import {
    VmaFormulaGridCompColorPickerConstructor,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods, VmaFormulaGridPrivateMethods
} from "../../../types";
import {Color} from "./utils/color.ts";
import propTypes from "vue-types";

export default defineComponent({
    name: 'VmaFormulaGridCompColorPicker',
    props: {
        color: propTypes.instanceOf(Color),
    },
    emits: ["update:color", "change", "advanceChange"],
    setup(props, context) {
        const { emit } = context

        onMounted( () => {
            console.log(advancePanelShow.value)
        })

        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const { colorPickerStore } = $vmaFormulaGrid.reactiveData

        const {refGridColorPicker} = $vmaFormulaGrid.getRefs()

        const colorInstance = props.color || new Color();
        const state = reactive({
            color: colorInstance,
            hex: colorInstance.toHexString(),
            rgb: colorInstance.toRgbString(),
        });

        const VmaFormulaGridCompColorPickerPalette = resolveComponent('VmaFormulaGridCompColorPickerPalette') as ComponentOptions
        const VmaFormulaGridCompColorPickerBoard = resolveComponent('VmaFormulaGridCompColorPickerBoard') as ComponentOptions
        const VmaFormulaGridCompColorPickerHue = resolveComponent('VmaFormulaGridCompColorPickerHue') as ComponentOptions
        const VmaFormulaGridCompColorPickerLightness = resolveComponent('VmaFormulaGridCompColorPickerLightness') as ComponentOptions
        const VmaFormulaGridCompColorPickerDisplay = resolveComponent('VmaFormulaGridCompColorPickerDisplay') as ComponentOptions

        const advancePanelShow = ref(false);

        const $vmaFormulaGridCompColorPicker = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompColorPickerConstructor

        const onBack = () => {
            advancePanelShow.value = false;
            emit("advanceChange", false);
        };

        const onCompactChange = (color: string) => {
            console.log('onCompactChange')
            console.log(color)
            console.log(advancePanelShow.value)
            if (color === "advance") {
                advancePanelShow.value = true;
                emit("advanceChange", true);
            } else {
                state.color.hex = color;
                emit("advanceChange", false);
            }
        };

        const onBoardChange = (saturation: number, brightness: number) => {
            state.color.saturation = saturation;
            state.color.brightness = brightness;
        };

        const onHueChange = (hue: number) => {
            state.color.hue = hue;
        };

        const onLightChange = (light: number) => {
            state.color.lightness = light;
        };

        const renderVN = () => h(Teleport,
            {
                to: 'body',
                disabled: false
            },
            [h('div', {
                ref: refGridColorPicker,
                class: ['vma-formula-grid-fk-colorPicker',
                    {
                        'is--visible': colorPickerStore.visible
                    }],
                style: colorPickerStore.style
            }, h('div', {
                class: 'vma-formula-grid-fk-colorPicker__inner'
            }, [
                h('div', {
                    class: 'vma-formula-grid-fk-colorPicker__header'
                }, advancePanelShow.value ? h('span', {
                    style: {
                        cursor: 'pointer'
                    },
                    onClick: onBack
                }) : createCommentVNode()),
                !advancePanelShow.value ? h(VmaFormulaGridCompColorPickerPalette, {
                    onChange: onCompactChange
                }) : createCommentVNode(),
                advancePanelShow.value ? h(VmaFormulaGridCompColorPickerBoard, {
                    color: state.color,
                    onChange: onBoardChange
                }) : createCommentVNode(),
                advancePanelShow.value ? h(VmaFormulaGridCompColorPickerHue, {
                    color: state.color,
                    onChange: onHueChange
                }) : createCommentVNode(),
                !advancePanelShow.value ? h(VmaFormulaGridCompColorPickerLightness, {
                    color: state.color,
                    onChange: onLightChange
                }) : createCommentVNode(),
                advancePanelShow.value ? h(VmaFormulaGridCompColorPickerDisplay, {
                    color: state.color,
                }) : createCommentVNode(),
            ]))])

        $vmaFormulaGridCompColorPicker.renderVN = renderVN

        provide('$vmaFormulaGridCompColorPicker', $vmaFormulaGridCompColorPicker)

        return $vmaFormulaGridCompColorPicker
    },
    render() {
        return this.renderVN()
    },
})