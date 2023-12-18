import { defineComponent, h, reactive, ComponentOptions, PropType, resolveComponent, ref, computed, Ref, nextTick } from 'vue';
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
import { DomTools, getAbsolutePos } from '../../utils/doms.ts';

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
        let $vmaFormulaGridCompColorPicker = ref();

        const toolbarMethods = {
            sync: (grid: VmaFormulaGridConstructor | VmaFormulaGridInstance, lang: any, colorPicker: any) => {
                $vmaFormulaGridConnected.value = grid;
                $vmaFormulaGridLangConnected.value = lang;
                $vmaFormulaGridCompColorPicker = colorPicker;
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
        let formatterValue: Ref<any> = ref('');

        let currencyValue: any = ref('');

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

        const formatterSelectOptions = computed(() => {
            return $vmaFormulaGridConnected.value
                ? $vmaFormulaGridConnected.value.reactiveData.supportedFormatters.map((formatter: any) => {
                      return {
                          value: formatter === 'formatCurrency' ? 'formatCurrencyCNY' : formatter,
                          label: $vmaFormulaGridLangConnected.value.lang[formatter],
                          disabled: false,
                      };
                  })
                : [];
        });

        const currencySelectOptions = computed(() => {
            const others: any[] = [];
            if (
                $vmaFormulaGridConnected.value &&
                $vmaFormulaGridConnected.value.reactiveData.global &&
                $vmaFormulaGridConnected.value.reactiveData.global.formats &&
                $vmaFormulaGridConnected.value.reactiveData.global.formats.c &&
                $vmaFormulaGridConnected.value.reactiveData.global.formats.c.others &&
                $vmaFormulaGridConnected.value.reactiveData.global.formats.c.others.length > 0
            ) {
                $vmaFormulaGridConnected.value.reactiveData.global.formats.c.others.map((item: any) => {
                    others.push({
                        label: item.label,
                        value: item.value,
                        disabled: false,
                    });
                });
            }
            return $vmaFormulaGridConnected.value
                ? [
                      { label: $vmaFormulaGridLangConnected.value.lang['formatCurrencyCNY'], value: 'formatCurrencyCNY', disabled: false },
                      { label: $vmaFormulaGridLangConnected.value.lang['formatCurrencyUSD'], value: 'formatCurrencyUSD', disabled: false },
                      { label: $vmaFormulaGridLangConnected.value.lang['formatCurrencyEuro'], value: 'formatCurrencyEuro', disabled: false },
                  ].concat(others)
                : [];
        });

        const fontSelectPlaceholder = computed(() => {
            return $vmaFormulaGridLangConnected.value ? $vmaFormulaGridLangConnected.value.lang.fontSelect : '';
        });

        const fontSizeSelectPlaceholder = computed(() => {
            return $vmaFormulaGridLangConnected.value ? $vmaFormulaGridLangConnected.value.lang.fontSizeSelect : '';
        });

        const formatterSelectPlaceholder = computed(() => {
            return $vmaFormulaGridLangConnected.value ? $vmaFormulaGridLangConnected.value.lang.formatterSelect : '';
        });

        const currencySelectPlaceholder = computed(() => {
            return $vmaFormulaGridLangConnected.value ? $vmaFormulaGridLangConnected.value.lang.formatterCurrencySelect : '';
        });

        const sizes = ['xxx-large', 'xx-large', 'x-large', 'large', 'normal', 'small', 'mini'];

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
                                    if ($vmaFormulaGridConnected.value) $vmaFormulaGridConnected.value.setFontStyle('cells', 'fontSizeSelect', event.value);
                                },
                            }),
                        );
                    } else if (item.is === 'formatterSelect') {
                        buttons.push(
                            h(GridCompSelectComponent, {
                                modelValue: formatterValue.value,
                                placeholder: formatterSelectPlaceholder.value,
                                'onUpdate:modelValue': (value: any) => {
                                    formatterValue.value = value;
                                },
                                style: {
                                    width: '150px',
                                    flex: '0 1 auto',
                                },
                                options: formatterSelectOptions.value,
                                onChange: (_: any) => {
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
                                    if ($vmaFormulaGridConnected.value) $vmaFormulaGridConnected.value.setCellFormat('cells', formatterValue.value, null);
                                },
                            }),
                        );
                    } else if (item.is === 'currencySelect') {
                        buttons.push(
                            h(GridCompSelectComponent, {
                                modelValue: currencyValue.value,
                                placeholder: currencySelectPlaceholder.value,
                                'onUpdate:modelValue': (value: any) => {
                                    currencyValue.value = value;
                                },
                                style: {
                                    width: '150px',
                                    flex: '0 1 auto',
                                },
                                options: currencySelectOptions.value,
                                onChange: (_: any) => {
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
                                    if ($vmaFormulaGridConnected.value)
                                        $vmaFormulaGridConnected.value.setCellFormat(
                                            'cells',
                                            currencyValue.value.startsWith('formatCurrency') ? currencyValue.value : 'formatCurrencyOthers',
                                            currencyValue.value,
                                        );
                                },
                            }),
                        );
                    }
                } else {
                    buttons.push(
                        h(FormulaGridCompToolbarGenericComponent, {
                            item: item,
                            onClick: (event: any) => {
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
                                if (item.code === 'fillColor') {
                                    const menuElem = event.currentTarget;
                                    if (menuElem !== null && $vmaFormulaGridConnected.value && $vmaFormulaGridCompColorPicker.value) {
                                        event.preventDefault();
                                        event.stopPropagation();

                                        const { scrollTop, scrollLeft } = DomTools.getDomNode();
                                        const { boundingTop, boundingLeft } = getAbsolutePos(menuElem);
                                        const posTop = boundingTop + menuElem.offsetHeight;
                                        const posLeft = boundingLeft;
                                        const top = posTop + scrollTop;
                                        const left = posLeft + scrollLeft;
                                        Object.assign($vmaFormulaGridConnected.value.reactiveData.colorPickerStore, {
                                            visible: true,
                                            selected: { code: 'backgroundColor' },
                                            selectValue: null,
                                            style: {
                                                top: `${top}px`,
                                                left: `${left}px`,
                                            },
                                        });
                                        nextTick(() => {
                                            const { scrollTop, scrollLeft, visibleHeight, visibleWidth } = DomTools.getDomNode();
                                            const { boundingTop: menuBoundingTop, boundingLeft: menuBoundingLeft } = getAbsolutePos(menuElem);
                                            const top = menuBoundingTop + scrollTop;
                                            const left = menuBoundingLeft + scrollLeft;
                                            const colorPickerElem = $vmaFormulaGridCompColorPicker.value;
                                            const clientHeight = colorPickerElem.clientHeight;
                                            const clientWidth = colorPickerElem.clientWidth;
                                            const { boundingTop, boundingLeft } = getAbsolutePos(colorPickerElem);
                                            const offsetTop = boundingTop + clientHeight - visibleHeight;
                                            const offsetLeft = boundingLeft + clientWidth - visibleWidth;
                                            if (offsetTop > -10 && $vmaFormulaGridConnected.value) {
                                                $vmaFormulaGridConnected.value.reactiveData.colorPickerStore.style.top = `${Math.max(scrollTop + 2, top - clientHeight - 2)}px`;
                                            }
                                            if (offsetLeft > -10 && $vmaFormulaGridConnected.value) {
                                                $vmaFormulaGridConnected.value.reactiveData.colorPickerStore.style.left = `${Math.max(scrollLeft + 2, left - clientWidth - 2)}px`;
                                            }
                                        });
                                    }
                                }
                                if (item.code === 'fontColor') {
                                    const menuElem = event.currentTarget;
                                    if (menuElem !== null && $vmaFormulaGridConnected.value && $vmaFormulaGridCompColorPicker.value) {
                                        event.preventDefault();
                                        event.stopPropagation();

                                        const { scrollTop, scrollLeft } = DomTools.getDomNode();
                                        const { boundingTop, boundingLeft } = getAbsolutePos(menuElem);
                                        const posTop = boundingTop + menuElem.offsetHeight;
                                        const posLeft = boundingLeft;
                                        const top = posTop + scrollTop;
                                        const left = posLeft + scrollLeft;
                                        Object.assign($vmaFormulaGridConnected.value.reactiveData.colorPickerStore, {
                                            visible: true,
                                            selected: { code: 'fontColor' },
                                            selectValue: null,
                                            style: {
                                                top: `${top}px`,
                                                left: `${left}px`,
                                            },
                                        });
                                        nextTick(() => {
                                            const { scrollTop, scrollLeft, visibleHeight, visibleWidth } = DomTools.getDomNode();
                                            const { boundingTop: menuBoundingTop, boundingLeft: menuBoundingLeft } = getAbsolutePos(menuElem);
                                            const top = menuBoundingTop + scrollTop;
                                            const left = menuBoundingLeft + scrollLeft;
                                            const colorPickerElem = $vmaFormulaGridCompColorPicker.value;
                                            const clientHeight = colorPickerElem.clientHeight;
                                            const clientWidth = colorPickerElem.clientWidth;
                                            const { boundingTop, boundingLeft } = getAbsolutePos(colorPickerElem);
                                            const offsetTop = boundingTop + clientHeight - visibleHeight;
                                            const offsetLeft = boundingLeft + clientWidth - visibleWidth;
                                            if (offsetTop > -10 && $vmaFormulaGridConnected.value) {
                                                $vmaFormulaGridConnected.value.reactiveData.colorPickerStore.style.top = `${Math.max(scrollTop + 2, top - clientHeight - 2)}px`;
                                            }
                                            if (offsetLeft > -10 && $vmaFormulaGridConnected.value) {
                                                $vmaFormulaGridConnected.value.reactiveData.colorPickerStore.style.left = `${Math.max(scrollLeft + 2, left - clientWidth - 2)}px`;
                                            }
                                        });
                                    }
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
                                if (item.code === 'cellMerge') {
                                    $vmaFormulaGridConnected.value.mergeCells();
                                }
                                if (item.code === 'cellUnmerge') {
                                    $vmaFormulaGridConnected.value.unmergeCells();
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
                                if (item.code === 'borderFull') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 'full');
                                }
                                if (item.code === 'borderNone') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 'none');
                                }
                                if (item.code === 'borderOuter') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 'outer');
                                }
                                if (item.code === 'borderInner') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 'inner');
                                }
                                if (item.code === 'borderLeft') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 'l');
                                }
                                if (item.code === 'borderRight') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 'r');
                                }
                                if (item.code === 'borderTop') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 't');
                                }
                                if (item.code === 'borderBottom') {
                                    $vmaFormulaGridConnected.value.setCellBorder('cells', 'b');
                                }
                                if (item.code === 'formatNumberPercent') {
                                    $vmaFormulaGridConnected.value.setCellFormat('cells', 'formatNumberPercent', null);
                                }
                                if (item.code === 'formatNumberFraction') {
                                    $vmaFormulaGridConnected.value.setCellFormat('cells', 'formatNumberFraction', null);
                                }
                                if (item.code === 'formatNumberThousands') {
                                    $vmaFormulaGridConnected.value.setCellFormat('cells', 'formatNumberThousands', null);
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
