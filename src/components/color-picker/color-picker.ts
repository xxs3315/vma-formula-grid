import { ComponentOptions, createCommentVNode, defineComponent, h, inject, onMounted, provide, reactive, ref, resolveComponent, Teleport, watch } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { VmaFormulaGridCompColorPickerConstructor, VmaFormulaGridConstructor, VmaFormulaGridMethods, VmaFormulaGridPrivateMethods } from '../../../types';
import { Color } from './utils/color.ts';
import { assignDeep, getLastZIndex, nextZIndex } from '../../utils';

export default defineComponent({
    name: 'VmaFormulaGridCompColorPicker',
    props: {
        color: Color,
        baseZIndex: {
            type: Number,
            default: 999,
        },
    },
    emits: ['update:color', 'change', 'advanceChange'],
    setup(props, context) {
        const { emit } = context;

        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const { colorPickerStore } = $vmaFormulaGrid.reactiveData;

        const { refGridColorPicker } = $vmaFormulaGrid.getRefs();

        const colorInstance = props.color || new Color();
        const state = reactive({
            color: colorInstance,
            mode: 'normal',
            hex: colorInstance.toHexString(),
            rgb: colorInstance.toRgbString(),
        });

        const VmaFormulaGridCompColorPickerPalette = resolveComponent('VmaFormulaGridCompColorPickerPalette') as ComponentOptions;
        const VmaFormulaGridCompColorPickerBoard = resolveComponent('VmaFormulaGridCompColorPickerBoard') as ComponentOptions;
        const VmaFormulaGridCompColorPickerHue = resolveComponent('VmaFormulaGridCompColorPickerHue') as ComponentOptions;
        const VmaFormulaGridCompColorPickerLightness = resolveComponent('VmaFormulaGridCompColorPickerLightness') as ComponentOptions;
        const VmaFormulaGridCompColorPickerDisplay = resolveComponent('VmaFormulaGridCompColorPickerDisplay') as ComponentOptions;

        const advancePanelShow = ref(false);

        const $vmaFormulaGridCompColorPicker = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompColorPickerConstructor;

        const onBack = () => {
            advancePanelShow.value = false;
            emit('advanceChange', false);
        };

        const onCompactChange = (color: string) => {
            if (color === 'advance') {
                advancePanelShow.value = true;
                state.mode = 'advance';
                emit('advanceChange', true);
            } else if (color === 'transparent') {
                state.color.hex = color;
                state.mode = 'transparent';
                emit('advanceChange', false);
            } else {
                state.color.hex = color;
                state.mode = 'normal';
                emit('advanceChange', false);
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

        const renderVN = () =>
            h(
                Teleport,
                {
                    to: 'body',
                    disabled: false,
                },
                [
                    h(
                        'div',
                        {
                            ref: refGridColorPicker,
                            class: [
                                'vma-formula-grid-fk-colorPicker',
                                {
                                    'is--visible': colorPickerStore.visible,
                                },
                            ],
                            style: colorPickerStore.style ? assignDeep(colorPickerStore.style, colorPickerStore.visible ? { zIndex: getLastZIndex() + 20 } : {}) : {},
                        },
                        h(
                            'div',
                            {
                                class: 'vma-formula-grid-fk-colorPicker__inner',
                            },
                            [
                                h(
                                    'div',
                                    {
                                        class: 'vma-formula-grid-fk-colorPicker__header',
                                    },
                                    advancePanelShow.value
                                        ? h(
                                              'span',
                                              {
                                                  style: {
                                                      cursor: 'pointer',
                                                  },
                                                  onClick: onBack,
                                              },
                                              h('div', {
                                                  class: 'back',
                                              }),
                                          )
                                        : createCommentVNode(),
                                ),
                                !advancePanelShow.value
                                    ? h(VmaFormulaGridCompColorPickerPalette, {
                                          onChange: onCompactChange,
                                          baseZIndex: props.baseZIndex,
                                      })
                                    : createCommentVNode(),
                                advancePanelShow.value
                                    ? h(VmaFormulaGridCompColorPickerBoard, {
                                          color: state.color,
                                          onChange: onBoardChange,
                                      })
                                    : createCommentVNode(),
                                advancePanelShow.value
                                    ? h(VmaFormulaGridCompColorPickerHue, {
                                          color: state.color,
                                          onChange: onHueChange,
                                      })
                                    : createCommentVNode(),
                                !advancePanelShow.value
                                    ? h(VmaFormulaGridCompColorPickerLightness, {
                                          color: state.color,
                                          onChange: onLightChange,
                                      })
                                    : createCommentVNode(),
                                h(VmaFormulaGridCompColorPickerDisplay, {
                                    color: state.color,
                                }),
                            ],
                        ),
                    ),
                ],
            );

        $vmaFormulaGridCompColorPicker.renderVN = renderVN;

        provide('$vmaFormulaGridCompColorPicker', $vmaFormulaGridCompColorPicker);

        watch(
            () => state.color,
            () => {
                state.hex = state.color.hex;
                state.rgb = state.color.toRgbString();
                // updateColorHistoryFn();
                emit('update:color', { color: state.color, mode: state.mode });
                emit('change', { color: state.color, mode: state.mode });
            },
            { deep: true },
        );

        return $vmaFormulaGridCompColorPicker;
    },
    render() {
        return this.renderVN();
    },
});
