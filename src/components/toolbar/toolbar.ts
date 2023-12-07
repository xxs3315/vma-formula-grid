import { defineComponent, h, reactive, inject, createCommentVNode, ComponentOptions, PropType, resolveComponent } from 'vue';
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
} from '../../../types';
import { checkCellInMerges, toolbarButtons } from '../../utils';

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
        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const toolbarReactiveData = reactive({} as VmaFormulaGridCompToolbarReactiveData);

        const { uId, reactiveData } = $vmaFormulaGrid;

        const FormulaGridCompToolbarGenericComponent = resolveComponent('VmaFormulaGridCompToolbarGeneric') as ComponentOptions;
        const FormulaGridCompToolbarSeperatorComponent = resolveComponent('VmaFormulaGridCompToolbarSeparator') as ComponentOptions;

        const gridToolbarRefs: VmaFormulaGridCompToolbarRefs = {};

        let $vmaFormulaGridConnected: VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods;

        const toolbarMethods = {
            sync: (grid: VmaFormulaGridConstructor | VmaFormulaGridInstance) => {
                $vmaFormulaGridConnected = grid;
            },
        } as VmaFormulaGridCompToolbarMethods;

        const $vmaToolbar = {
            uId: uId,
            props,
            context,
            toolbarReactiveData,
            getRefs: () => gridToolbarRefs,
        } as unknown as VmaFormulaGridCompToolbarConstructor & VmaFormulaGridCompToolbarMethods;

        const generateToolbar = () => {
            const bottons: any[] = [];
            toolbarButtons().map((item: any) => {
                if (item && item.is && typeof item.is === 'string') {
                    bottons.push(item.is === 'Separator' ? h(FormulaGridCompToolbarSeperatorComponent) : createCommentVNode());
                } else {
                    bottons.push(
                        h(FormulaGridCompToolbarGenericComponent, {
                            item: item,
                            onClick: (_: Event) => {
                                if (item.code === 'bold') {
                                    if (
                                        $vmaFormulaGridConnected &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaSci >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaEci >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaSri >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaEri >= 0
                                    ) {
                                        let initValue = false;
                                        for (let col = $vmaFormulaGridConnected.reactiveData.currentAreaSci; col <= $vmaFormulaGridConnected.reactiveData.currentAreaEci; col++) {
                                            for (
                                                let row = $vmaFormulaGridConnected.reactiveData.currentAreaSri;
                                                row <= $vmaFormulaGridConnected.reactiveData.currentAreaEri;
                                                row++
                                            ) {
                                                if (
                                                    $vmaFormulaGridConnected.reactiveData.currentSheetData[row][col + 1].b &&
                                                    !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.reactiveData.merges)
                                                ) {
                                                    initValue = true;
                                                    break;
                                                }
                                            }
                                        }
                                        $vmaFormulaGridConnected.setFontStyle('cells', 'fontBold', initValue);
                                    }
                                }
                                if (item.code === 'italic') {
                                    if (
                                        $vmaFormulaGridConnected &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaSci >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaEci >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaSri >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaEri >= 0
                                    ) {
                                        let initValue = false;
                                        for (let col = $vmaFormulaGridConnected.reactiveData.currentAreaSci; col <= $vmaFormulaGridConnected.reactiveData.currentAreaEci; col++) {
                                            for (
                                                let row = $vmaFormulaGridConnected.reactiveData.currentAreaSri;
                                                row <= $vmaFormulaGridConnected.reactiveData.currentAreaEri;
                                                row++
                                            ) {
                                                if (
                                                    $vmaFormulaGridConnected.reactiveData.currentSheetData[row][col + 1].i &&
                                                    !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.reactiveData.merges)
                                                ) {
                                                    initValue = true;
                                                    break;
                                                }
                                            }
                                        }
                                        $vmaFormulaGridConnected.setFontStyle('cells', 'fontItalic', initValue);
                                    }
                                }
                                if (item.code === 'underline') {
                                    if (
                                        $vmaFormulaGridConnected &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaSci >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaEci >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaSri >= 0 &&
                                        $vmaFormulaGridConnected.reactiveData.currentAreaEri >= 0
                                    ) {
                                        let initValue = false;
                                        for (let col = $vmaFormulaGridConnected.reactiveData.currentAreaSci; col <= $vmaFormulaGridConnected.reactiveData.currentAreaEci; col++) {
                                            for (
                                                let row = $vmaFormulaGridConnected.reactiveData.currentAreaSri;
                                                row <= $vmaFormulaGridConnected.reactiveData.currentAreaEri;
                                                row++
                                            ) {
                                                if (
                                                    $vmaFormulaGridConnected.reactiveData.currentSheetData[row][col + 1].u &&
                                                    !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.reactiveData.merges)
                                                ) {
                                                    initValue = true;
                                                    break;
                                                }
                                            }
                                        }
                                        $vmaFormulaGridConnected.setFontStyle('cells', 'fontUnderline', initValue);
                                    }
                                }
                                if (item.code === 'alignLeft') {
                                    $vmaFormulaGridConnected.setCellAlign('cells', 'l');
                                }
                                if (item.code === 'alignCenter') {
                                    $vmaFormulaGridConnected.setCellAlign('cells', 'c');
                                }
                                if (item.code === 'alignRight') {
                                    $vmaFormulaGridConnected.setCellAlign('cells', 'r');
                                }
                                if (item.code === 'alignTop') {
                                    $vmaFormulaGridConnected.setCellAlign('cells', 't');
                                }
                                if (item.code === 'alignMiddle') {
                                    $vmaFormulaGridConnected.setCellAlign('cells', 'm');
                                }
                                if (item.code === 'alignBottom') {
                                    $vmaFormulaGridConnected.setCellAlign('cells', 'b');
                                }
                                if (item.code === 'zoomIn') {
                                    // todo
                                }
                                if (item.code === 'zoomOut') {
                                    // todo
                                }
                                if (item.code === 'zoomReset') {
                                    $vmaFormulaGridConnected.setGridSize('normal');
                                }
                                if (item.code === 'wrapText') {
                                    let initValue = false;
                                    for (let col = $vmaFormulaGridConnected.reactiveData.currentAreaSci; col <= $vmaFormulaGridConnected.reactiveData.currentAreaEci; col++) {
                                        for (let row = $vmaFormulaGridConnected.reactiveData.currentAreaSri; row <= $vmaFormulaGridConnected.reactiveData.currentAreaEri; row++) {
                                            if (
                                                $vmaFormulaGridConnected.reactiveData.currentSheetData[row][col + 1].tw &&
                                                !checkCellInMerges(col + 1, row + 1, $vmaFormulaGridConnected.reactiveData.merges)
                                            ) {
                                                initValue = true;
                                                break;
                                            }
                                        }
                                    }
                                    $vmaFormulaGridConnected.setCellWrap('cells', initValue);
                                }
                            },
                        }),
                    );
                }
            });
            return bottons;
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
