import { computed, defineComponent, h, onMounted, PropType, provide, reactive, ref, watch } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { DragEventOptions, VmaFormulaGridCompColorPickerHueConstructor } from '../../../types';
import { Color } from './utils/color.ts';
import { triggerDragEvent } from '../../utils/doms.ts';

export default defineComponent({
    name: 'VmaFormulaGridCompColorPickerHue',
    props: {
        color: Color,
        size: {
            type: String as PropType<'small' | 'default'>,
            default: 'default',
        },
    },
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

        const barElement = ref<HTMLElement | null>(null);
        const cursorElement = ref<HTMLElement | null>(null);

        let color = props.color || new Color();

        const state = reactive({
            hue: color.hue || 0,
        });

        const $vmaFormulaGridCompColorPickerHue = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompColorPickerHueConstructor;

        const onMoveBar = (event: MouseEvent) => {
            event.stopPropagation();
            if (barElement.value && cursorElement.value) {
                const rect = barElement.value.getBoundingClientRect();

                const offsetWidth = cursorElement.value.offsetWidth;

                let left = event.clientX - rect.left;
                left = Math.min(left, rect.width - offsetWidth / 2);
                left = Math.max(offsetWidth / 2, left);

                const hue = Math.round(((left - offsetWidth / 2) / (rect.width - offsetWidth)) * 360);
                color.hue = hue;
                state.hue = hue;
                emit('change', hue);
            }
        };

        const onClickSlider = (event: Event) => {
            const target = event.target;

            if (target !== barElement.value) {
                onMoveBar(event as MouseEvent);
            }
        };

        const getCursorLeft = () => {
            if (barElement.value && cursorElement.value) {
                const rect = barElement.value.getBoundingClientRect();
                const offsetWidth = cursorElement.value.offsetWidth;
                if (state.hue === 360) {
                    return rect.width - offsetWidth / 2;
                }
                return ((state.hue % 360) * (rect.width - offsetWidth)) / 360 + offsetWidth / 2;
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

        const renderVN = () =>
            h(
                'div',
                {
                    class: ['vma-formula-grid-hue-slider'],
                },
                h(
                    'div',
                    {
                        ref: barElement,
                        class: 'vma-formula-grid-hue-slider__bar',
                        onClick: onClickSlider,
                    },
                    h(
                        'div',
                        {
                            class: ['vma-formula-grid-hue-slider__bar-pointer', 'small-slider'],
                            ref: cursorElement,
                            style: getCursorStyle.value,
                        },
                        h('div', {
                            class: 'vma-formula-grid-hue-slider__bar-handle',
                        }),
                    ),
                ),
            );

        watch(
            () => props.color,
            (value) => {
                if (value) {
                    color = value;
                    Object.assign(state, { hue: color.hue });
                }
            },
            { deep: true },
        );

        $vmaFormulaGridCompColorPickerHue.renderVN = renderVN;

        provide('$vmaFormulaGridCompColorPickerHue', $vmaFormulaGridCompColorPickerHue);

        return $vmaFormulaGridCompColorPickerHue;
    },
    render() {
        return this.renderVN();
    },
});
