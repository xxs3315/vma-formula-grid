import { defineComponent, h, reactive } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { VmaFormulaGridCompToolbarSpacerReactiveData, VmaFormulaGridCompToolbarSpacerRefs, VmaFormulaGridCompToolbarSpacerConstructor } from '../../../types';

export default defineComponent({
    name: 'VmaFormulaGridCompToolbarSpacer',
    setup(props, context) {
        const reactiveData = reactive({} as VmaFormulaGridCompToolbarSpacerReactiveData);

        const gridToolbarSpacerRefs: VmaFormulaGridCompToolbarSpacerRefs = {};

        const $vmaToolbarSpacer = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
            getRefs: () => gridToolbarSpacerRefs,
        } as unknown as VmaFormulaGridCompToolbarSpacerConstructor;

        const renderVN = () =>
            h('div', {
                class: 'vma-formula-grid-comp-toolbar-spacer',
            });

        $vmaToolbarSpacer.renderVN = renderVN;

        return $vmaToolbarSpacer;
    },
    render() {
        return this.renderVN();
    },
});
