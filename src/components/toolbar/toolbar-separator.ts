import { defineComponent, h, reactive } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { VmaFormulaGridCompToolbarSeparatorReactiveData, VmaFormulaGridCompToolbarSeparatorRefs, VmaFormulaGridCompToolbarSeparatorConstructor } from '../../../types';

export default defineComponent({
    name: 'VmaFormulaGridCompToolbarSeparator',
    setup(props, context) {
        const reactiveData = reactive({} as VmaFormulaGridCompToolbarSeparatorReactiveData);

        const gridToolbarSeparatorRefs: VmaFormulaGridCompToolbarSeparatorRefs = {};

        const $vmaToolbarSeparator = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
            getRefs: () => gridToolbarSeparatorRefs,
        } as unknown as VmaFormulaGridCompToolbarSeparatorConstructor;

        const renderVN = () =>
            h('div', {
                class: 'vma-formula-grid-comp-toolbar-separator',
            });

        $vmaToolbarSeparator.renderVN = renderVN;

        return $vmaToolbarSeparator;
    },
    render() {
        return this.renderVN();
    },
});
