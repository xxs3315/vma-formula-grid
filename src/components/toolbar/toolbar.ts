import { defineComponent, reactive } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { VmaFormulaGridCompToolbarReactiveData, VmaFormulaGridCompToolbarRefs, VmaFormulaGridCompToolbarConstructor, VmaFormulaGridCompToolbarMethods } from '../../../types';

export default defineComponent({
    name: 'VmaFormulaGridCompToolbar',
    props: {},
    setup(props, context) {
        const reactiveData = reactive({} as VmaFormulaGridCompToolbarReactiveData);

        const gridToolbarRefs: VmaFormulaGridCompToolbarRefs = {};

        const $vmaToolbar = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
            getRefs: () => gridToolbarRefs,
        } as unknown as VmaFormulaGridCompToolbarConstructor & VmaFormulaGridCompToolbarMethods;
        return $vmaToolbar;
    },
    render() {
        return this.renderVN();
    },
});
