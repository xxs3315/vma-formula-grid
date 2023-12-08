import { defineComponent, h, reactive, inject, createCommentVNode, ComponentOptions, PropType, resolveComponent, ref, computed, watch, watchEffect, Ref } from 'vue';
import { Guid } from '../../utils/guid.ts';
import {
    VmaFormulaGridCompToolbarReactiveData,
    VmaFormulaGridCompToolbarRefs,
    VmaFormulaGridCompToolbarConstructor,
    VmaFormulaGridCompToolbarMethods,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods,
    VmaFormulaGridCompTextareaPropTypes,
    VmaFormulaGridInstance,
    SizeType,
} from '../../../types';
import { checkCellInMerges, getDefaultFontSize, toolbarButtons } from '../../utils';

export default defineComponent({
    name: 'VmaFormulaGridCompToolbar',
    props: {
        type: {
            type: String as PropType<VmaFormulaGridCompTextareaPropTypes.Type>,
            default: 'default',
        },
        size: {
            type: String as PropType<VmaFormulaGridCompTextareaPropTypes.Size>,
            default: 'normal',
        },
        content: [] as PropType<any[]>,
    },
    setup(props, context) {
        const toolbarReactiveData = reactive({} as VmaFormulaGridCompToolbarReactiveData);

        const FormulaGridCompToolbarGenericComponent = resolveComponent('VmaFormulaGridCompToolbarGeneric') as ComponentOptions;
        const FormulaGridCompToolbarSeparatorComponent = resolveComponent('VmaFormulaGridCompToolbarSeparator') as ComponentOptions;

        const GridCompSelectComponent = resolveComponent('VmaFormulaGridCompSelect') as ComponentOptions;

        const gridToolbarRefs: VmaFormulaGridCompToolbarRefs = {};

        let $vmaFormulaGridConnected: Ref<(VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods) | undefined> = ref<
            VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods
        >();

        let $vmaFormulaGridLangConnected = ref();

        const toolbarMethods = {
            sync: (grid: VmaFormulaGridConstructor | VmaFormulaGridInstance, lang: any) => {
                $vmaFormulaGridConnected.value = grid;
                $vmaFormulaGridLangConnected.value = lang;
            },
        } as VmaFormulaGridCompToolbarMethods;

        const $vmaToolbar = {
            uId: Guid.create().toString(),
            props,
            context,
            toolbarReactiveData,
            getRefs: () => gridToolbarRefs,
        } as unknown as VmaFormulaGridCompToolbarConstructor & VmaFormulaGridCompToolbarMethods;

        let fontValue = ref('');
        let fontSizeValue = ref<number>();

        const fontSelectOptions = computed(() => {
            return $vmaFormulaGridConnected.value
                ? $vmaFormulaGridConnected.value.reactiveData.supportedFonts.map((font: any) => {
                      return {
                          value: font.en,
                          label: font.ch,
                          ff: font.en,
                          disabled: false,
                      };
                  })
                : [];
        });

        const fontSizeSelectOptions = computed(() => {
            return $vmaFormulaGridConnected.value
                ? $vmaFormulaGridConnected.value.reactiveData.supportedFontSizes.map((fontSize: any) => {
                      return {
                          value: fontSize,
                          label: fontSize,
                          disabled: false,
                      };
                  })
                : [];
        });

        const fontSelectPlaceholder = computed(() => {
            return $vmaFormulaGridLangConnected.value ? $vmaFormulaGridLangConnected.value.lang.fontSelect : '';
        });

        const fontSizeSelectPlaceholder = computed(() => {
            return $vmaFormulaGridLangConnected.value ? $vmaFormulaGridLangConnected.value.lang.fontSizeSelect : '';
        });

        const sizes = ['large', 'normal', 'small', 'mini'];

        const generateToolbar = () => {
            const buttons: any[] = [];
            toolbarButtons().map((item: any) => {
                if (item && item.is && typeof item.is === 'string') {
                    if (item.is === 'Separator') {
                        buttons.push(h(FormulaGridCompToolbarSeparatorComponent));
                    } else if (item.is === 'fontSelect') {
                        buttons.push(
                            h(GridCompSelectComponent, {
                                modelValue: fontValue.value,
                                placeholder: fontSelectPlaceholder.value,
                                'onUpdate:modelValue': (value: any) => {
                                    fontValue.value = value;
                                },
                                style: {
                                    width: '180px',
                                    flex: '0 1 auto',
                                },
                                options: fontSelectOptions.value,
                                onChange: (event: any) => {
                                    if ($vmaFormulaGridConnected.value) $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontSelect', event.value);
                                },
                            }),
                        );
                    } else if (item.is === 'fontSizeSelect') {
                        buttons.push(
                            h(GridCompSelectComponent, {
                                modelValue: fontSizeValue.value,
                                placeholder: fontSizeSelectPlaceholder.value,
                                'onUpdate:modelValue': (value: any) => {
                                    fontSizeValue.value = value;
                                },
                                style: {
                                    width: '150px',
                                    flex: '0 1 auto',
                                },
                                options: fontSizeSelectOptions.value,
                                onChange: (event: any) => {
                                    if ($vmaFormulaGridConnected.value) $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontSizeSelect', event.value);
                                },
                            }),
                        );
                    }
                } else {
                    buttons.push(
                        h(FormulaGridCompToolbarGenericComponent, {
                            item: item,
                            onClick: (_: Event) => {
                                if (item.code === 'zoomIn') {
                                    if ($vmaFormulaGridConnected.value) {
                                        let currentSize = sizes.indexOf($vmaFormulaGridConnected.value.reactiveData.size);
                                        const targetSize = Math.max(0, currentSize - 1);
                                        $vmaFormulaGridConnected.value.setGridSize(sizes[targetSize] as SizeType);
                                    }
                                }
                                if (item.code === 'zoomOut') {
                                    if ($vmaFormulaGridConnected.value) {
                                        let currentSize = sizes.indexOf($vmaFormulaGridConnected.value.reactiveData.size);
                                        const targetSize = Math.min(sizes.length - 1, currentSize + 1);
                                        $vmaFormulaGridConnected.value.setGridSize(sizes[targetSize] as SizeType);
                                    }
                                }
                                if (item.code === 'zoomReset') {
                                    if ($vmaFormulaGridConnected.value) $vmaFormulaGridConnected.value.setGridSize('normal');
                                }
                                if (
                                    !(
                                        $vmaFormulaGridConnected.value &&
                                        $vmaFormulaGridConnected.value.reactiveData.currentAreaSci >= 0 &&
                                        $vmaFormulaGridConnected.value.reactiveData.currentAreaEci >= 0 &&
                                        $vmaFormulaGridConnected.value.reactiveData.currentAreaSri >= 0 &&
                                        $vmaFormulaGridConnected.value.reactiveData.currentAreaEri >= 0
                                    )
                                ) {
                                    return;
                                }
                                if (item.code === 'bold') {
                                    let initValue = false;
                                    for (
                                        let col = $vmaFormulaGridConnected.value.reactiveData.currentAreaSci;
                                        col <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEci;
                                        col++
                                    ) {
                                        for (
                                            let row = $vmaFormulaGridConnected.value.reactiveData.currentAreaSri;
                                            row <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEri;
                                            row++
                                        ) {
                                            if (
                                                $vmaFormulaGridConnected.value.reactiveData.currentSheetData[row][col + 1].b &&
                                                !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.value.reactiveData.merges)
                                            ) {
                                                initValue = true;
                                                break;
                                            }
                                        }
                                    }
                                    $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontBold', initValue);
                                }
                                if (item.code === 'italic') {
                                    let initValue = false;
                                    for (
                                        let col = $vmaFormulaGridConnected.value.reactiveData.currentAreaSci;
                                        col <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEci;
                                        col++
                                    ) {
                                        for (
                                            let row = $vmaFormulaGridConnected.value.reactiveData.currentAreaSri;
                                            row <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEri;
                                            row++
                                        ) {
                                            if (
                                                $vmaFormulaGridConnected.value.reactiveData.currentSheetData[row][col + 1].i &&
                                                !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.value.reactiveData.merges)
                                            ) {
                                                initValue = true;
                                                break;
                                            }
                                        }
                                    }
                                    $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontItalic', initValue);
                                }
                                if (item.code === 'underline') {
                                    let initValue = false;
                                    for (
                                        let col = $vmaFormulaGridConnected.value.reactiveData.currentAreaSci;
                                        col <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEci;
                                        col++
                                    ) {
                                        for (
                                            let row = $vmaFormulaGridConnected.value.reactiveData.currentAreaSri;
                                            row <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEri;
                                            row++
                                        ) {
                                            if (
                                                $vmaFormulaGridConnected.value.reactiveData.currentSheetData[row][col + 1].u &&
                                                !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.value.reactiveData.merges)
                                            ) {
                                                initValue = true;
                                                break;
                                            }
                                        }
                                    }
                                    $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontUnderline', initValue);
                                }
                                if (item.code === 'alignLeft') {
                                    $vmaFormulaGridConnected.value.setCellAlign('cells', 'l');
                                }
                                if (item.code === 'alignCenter') {
                                    $vmaFormulaGridConnected.value.setCellAlign('cells', 'c');
                                }
                                if (item.code === 'alignRight') {
                                    $vmaFormulaGridConnected.value.setCellAlign('cells', 'r');
                                }
                                if (item.code === 'alignTop') {
                                    $vmaFormulaGridConnected.value.setCellAlign('cells', 't');
                                }
                                if (item.code === 'alignMiddle') {
                                    $vmaFormulaGridConnected.value.setCellAlign('cells', 'm');
                                }
                                if (item.code === 'alignBottom') {
                                    $vmaFormulaGridConnected.value.setCellAlign('cells', 'b');
                                }
                                if (item.code === 'fontSizeUp') {
                                    let initValue =
                                        $vmaFormulaGridConnected.value.reactiveData.currentSheetData[$vmaFormulaGridConnected.value.reactiveData.currentAreaSri][
                                            $vmaFormulaGridConnected.value.reactiveData.currentAreaSci + 1
                                        ].fs;
                                    if (initValue === null || initValue === '') {
                                        initValue = getDefaultFontSize($vmaFormulaGridConnected.value.reactiveData.size);
                                    }
                                    $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontSizeUp', initValue);
                                }
                                if (item.code === 'fontSizeDown') {
                                    let initValue =
                                        $vmaFormulaGridConnected.value.reactiveData.currentSheetData[$vmaFormulaGridConnected.value.reactiveData.currentAreaSri][
                                            $vmaFormulaGridConnected.value.reactiveData.currentAreaSci + 1
                                        ].fs;
                                    if (initValue === null || initValue === '') {
                                        initValue = getDefaultFontSize($vmaFormulaGridConnected.value.reactiveData.size);
                                    }
                                    $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontSizeDown', initValue);
                                }
                                if (item.code === 'wrapText') {
                                    let initValue = false;
                                    for (
                                        let col = $vmaFormulaGridConnected.value.reactiveData.currentAreaSci;
                                        col <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEci;
                                        col++
                                    ) {
                                        for (
                                            let row = $vmaFormulaGridConnected.value.reactiveData.currentAreaSri;
                                            row <= $vmaFormulaGridConnected.value.reactiveData.currentAreaEri;
                                            row++
                                        ) {
                                            if (
                                                $vmaFormulaGridConnected.value.reactiveData.currentSheetData[row][col + 1].tw &&
                                                !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.value.reactiveData.merges)
                                            ) {
                                                initValue = true;
                                                break;
                                            }
                                        }
                                    }
                                    $vmaFormulaGridConnected.value.setCellWrap('cells', initValue);
                                }
                            },
                        }),
                    );
                }
            });
            return buttons;
        };

        const renderVN = () =>
            h(
                'div',
                {
                    class: 'vma-formula-grid-comp-toolbar',
                },
                generateToolbar(),
            );

        $vmaToolbar.renderVN = renderVN;
        Object.assign($vmaToolbar, toolbarMethods);

        return $vmaToolbar;
    },
    render() {
        return this.renderVN();
    },
});
