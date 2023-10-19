import {computed, createCommentVNode, defineComponent, h, provide, reactive, ref} from "vue";
import {Guid} from "../../utils/guid.ts";
import {VmaFormulaGridCompColorPickerDisplayConstructor} from "../../../types";
import propTypes from "vue-types";
import {Color} from "./utils/color.ts";
import tinycolor from "tinycolor2";
import {debounce} from "../../utils/debounce.ts";

export default defineComponent({
    name: 'VmaFormulaGridCompColorPickerDisplay',
    props: {
        color: propTypes.instanceOf(Color),
    },
    setup(props, context) {
        const{ emit } = context

        const inputType = ref<"hex" | "rgba">("hex");

        const $vmaFormulaGridCompColorPickerDisplay = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompColorPickerDisplayConstructor

        const state = reactive({
            color: props.color,
            hex: props.color?.hex,
            alpha: props.color?.alpha + "%",
            rgba: props.color?.RGB,
            previewBgColor: props.color?.toRgbString(),
        });

        const getBgColorStyle = computed(() => {
            return {
                background: state.previewBgColor,
            };
        });

        const onInputChange = debounce((event: any, key?: number) => {
            if (!event.target.value) {
                return;
            }

            if (inputType.value === "hex") {
                const _hex = event.target.value.replace("#", "");
                if (tinycolor(_hex).isValid() && state.color) {
                    state.color.hex = _hex;
                }
            } else if (key !== undefined && state.rgba && state.color) {
                if (event.target.value < 0) {
                    event.target.value = 0;
                }

                if (key === 3 && event.target.value > 1) {
                    event.target.value = 1;
                }

                if (key < 3 && event.target.value > 255) {
                    event.target.value = 255;
                }

                state.rgba[key] = Number(event.target.value);
                const [r, g, b, a] = state.rgba;
                state.color.hex = tinycolor({ r, g, b }).toHex();
                state.color.alpha = Math.floor(a * 100);
            }

            emit("update:color", state.color);
            emit("change", state.color);
        }, 200);

        const onInputTypeChange = () => {
            inputType.value = inputType.value === "rgba" ? "hex" : "rgba";
        };

        const renderVN = () => h('div',
            {
                class: 'vma-formula-grid-display'
            },
            [h('div', {
                    class: ['vma-formula-grid-current-color', 'vma-formula-grid-transparent']
                },
                h('div', {
                    class: 'color-cube',
                    style: getBgColorStyle
                })),
            inputType.value === 'hex' ?
                h('div', {
                        style: 'display: flex; flex: 1; gap: 4px; height: 100%'
                    },
                    [h('div', {
                            class: 'vma-formula-grid-color-input'
                        },
                        h('input', {
                            value: state.hex,
                            onInput: onInputChange
                        }))
                    ])
                : createCommentVNode(),
            inputType.value === 'rgba' && state.rgba ?
                h('div', {
                        style: 'display: flex; flex: 1; gap: 4px; height: 100%'
                    },

                    state.rgba.map((item: any, index: number) => {
                        if (index < state.rgba!.length - 1) {
                            h('div', {
                                style: 'vma-formula-grid-rgb-input'
                            }, h('div', {}, h('input', {
                                value: item,
                                onInput: (e: Event) => onInputChange(e, index)
                            })))
                        }
                    }))
                : createCommentVNode(),
            h('div', {
                class: 'vma-formula-grid-input-toggle',
                onClick: onInputTypeChange
            })
            ])

        $vmaFormulaGridCompColorPickerDisplay.renderVN = renderVN

        provide('$vmaFormulaGridCompColorPickerDisplay', $vmaFormulaGridCompColorPickerDisplay)

        return $vmaFormulaGridCompColorPickerDisplay
    },
    render() {
        return this.renderVN()
    },
})