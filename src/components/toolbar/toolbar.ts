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
} from '../../../types';
import { toolbarButtons } from '../../utils';

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
        const reactiveData = reactive({} as VmaFormulaGridCompToolbarReactiveData);

        const FormulaGridCompToolbarGenericComponent = resolveComponent('VmaFormulaGridCompToolbarGeneric') as ComponentOptions;
        const FormulaGridCompToolbarSeperatorComponent = resolveComponent('VmaFormulaGridCompToolbarSeparator') as ComponentOptions;

        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const gridToolbarRefs: VmaFormulaGridCompToolbarRefs = {};

        let $vmaFormulaGridConnected: VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods;

        const $vmaToolbar = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
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

        return $vmaToolbar;
    },
    render() {
        return this.renderVN();
    },
});
