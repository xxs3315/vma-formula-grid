import { computed, CSSProperties, defineComponent, h, onMounted, provide, reactive, ref, watch } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { DragEventOptions, VmaFormulaGridCompColorPickerLightnessConstructor } from '../../../types';
import tinycolor from 'tinycolor2';
import { Color } from './utils/color.ts';
import propTypes from 'vue-types';
import { triggerDragEvent } from '../../utils/doms.ts';

export default defineComponent({
    name: 'VmaFormulaGridCompColorPickerLightness',
    props: {
        color: propTypes.instanceOf(Color),
    },
    emits: ['change'],
    setup(props, context) {
        const { emit } = context;

        onMounted(() => {
            const dragConfig: DragEventOptions = {
                drag: (event: Event) => {
                    onMoveBar(event as MouseEvent);
                },
                end: (event: Event) => {
                    onMoveBar(event as MouseEvent);
                },
            };

            if (barElement.value && cursorElement.value) {
                triggerDragEvent(barElement.value, dragConfig);
            }
        });

        watch(
            () => props.color,
            (value) => {
                if (value) {
                    color = value;
                    const [hue, saturation, lightness] = color.HSL;
                    Object.assign(state, {
                        hue,
                        saturation,
                        lightness,
                    });
                }
            },
            { deep: true },
        );

        const barElement = ref<HTMLElement | null>(null);
        const cursorElement = ref<HTMLElement | null>(null);

        const $vmaFormulaGridCompColorPickerLightness = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompColorPickerLightnessConstructor;

        let color: any = props.color || new Color();
        const [hue, s, l] = color.HSL;

        const state = reactive({
            hue: hue,
            saturation: s,
            lightness: l,
        });

        const getBackgroundStyle = computed(() => {
            const color1 = tinycolor({
                h: state.hue,
                s: state.saturation,
                l: 0.8,
            }).toPercentageRgbString();
            const color2 = tinycolor({
                h: state.hue,
                s: state.saturation,
                l: 0.6,
            }).toPercentageRgbString();
            const color3 = tinycolor({
                h: state.hue,
                s: state.saturation,
                l: 0.4,
            }).toPercentageRgbString();
            const color4 = tinycolor({
                h: state.hue,
                s: state.saturation,
                l: 0.2,
            }).toPercentageRgbString();
            return {
                background: [
                    `linear-gradient(to right, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
                    `-webkit-linear-gradient(left, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
                    `-moz-linear-gradient(left, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
                    `-ms-linear-gradient(left, rgb(255, 255, 255), ${color1}, ${color2}, ${color3}, ${color4}, rgb(0, 0, 0))`,
                ],
            } as any as CSSProperties;
        });

        const getCursorLeft = () => {
            if (barElement.value && cursorElement.value) {
                const lightness = state.lightness;
                const rect = barElement.value.getBoundingClientRect();
                const offsetWidth = cursorElement.value.offsetWidth;

                return (1 - lightness) * (rect.width - offsetWidth) + offsetWidth / 2;
            }

            return 0;
        };

        const getCursorStyle = computed(() => {
            const left = getCursorLeft();
            return {
                left: left + 'px',
                top: 0,
            };
        });

        const onMoveBar = (event: MouseEvent) => {
            event.stopPropagation();
            if (barElement.value && cursorElement.value) {
                const rect = barElement.value.getBoundingClientRect();

                const offsetWidth = cursorElement.value.offsetWidth;

                let left = event.clientX - rect.left;
                left = Math.max(offsetWidth / 2, left);
                left = Math.min(left, rect.width - offsetWidth / 2);

                const light = 1 - (left - offsetWidth / 2) / (rect.width - offsetWidth);
                color.lightness = light;
                emit('change', light);
            }
        };

        const onClickSlider = (event: Event) => {
            const target = event.target;
            if (target !== barElement.value) {
                onMoveBar(event as MouseEvent);
            }
        };

        const renderVN = () =>
            h(
                'div',
                {
                    class: ['vma-formula-grid-lightness-slider'],
                },
                h(
                    'div',
                    {
                        ref: barElement,
                        class: 'vma-formula-grid-lightness-slider__bar',
                        style: getBackgroundStyle.value,
                        onClick: onClickSlider,
                    },
                    h(
                        'div',
                        {
                            ref: cursorElement,
                            class: ['vma-formula-grid-lightness-slider__bar-pointer', 'small-slider'],
                            style: getCursorStyle.value,
                        },
                        h('div', {
                            class: 'vma-formula-grid-lightness-slider__bar-handle',
                        }),
                    ),
                ),
            );

        $vmaFormulaGridCompColorPickerLightness.renderVN = renderVN;

        provide('$vmaFormulaGridCompColorPickerLightness', $vmaFormulaGridCompColorPickerLightness);

        return $vmaFormulaGridCompColorPickerLightness;
    },
    render() {
        return this.renderVN();
    },
});
