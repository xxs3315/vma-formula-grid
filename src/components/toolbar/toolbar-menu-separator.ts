import { defineComponent, h, reactive } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { VmaFormulaGridCompToolbarMenuSeparatorReactiveData, VmaFormulaGridCompToolbarMenuSeparatorRefs, VmaFormulaGridCompToolbarMenuSeparatorConstructor } from '../../../types';

export default defineComponent({
    name: 'VmaFormulaGridCompToolbarMenuSeparator',
    setup(props, context) {
        const reactiveData = reactive({} as VmaFormulaGridCompToolbarMenuSeparatorReactiveData);

        const gridToolbarMenuSeparatorRefs: VmaFormulaGridCompToolbarMenuSeparatorRefs = {};

        const $vmaToolbarMenuSeparator = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
            getRefs: () => gridToolbarMenuSeparatorRefs,
        } as unknown as VmaFormulaGridCompToolbarMenuSeparatorConstructor;

        const renderVN = () =>
            h('div', {
                class: 'vma-formula-grid-comp-toolbar-separator',
            });

        $vmaToolbarMenuSeparator.renderVN = renderVN;

        return $vmaToolbarMenuSeparator;
    },
    render() {
        return this.renderVN();
    },
});
