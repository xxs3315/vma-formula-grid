import { defineComponent, provide } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { VmaFormulaGridCompCodeMirrorConstructor } from '../../../types';

export default defineComponent({
    name: 'VmaFormulaGridCompCodeMirror',
    props: {},
    setup(props, context) {
        const $vmaFormulaGridCompCodeMirror = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompCodeMirrorConstructor;

        const renderVN = () => h('div');

        $vmaFormulaGridCompCodeMirror.renderVN = renderVN;

        provide('$vmaFormulaGridCompCodeMirror', $vmaFormulaGridCompCodeMirror);

        return $vmaFormulaGridCompCodeMirror;
    },
    render() {
        return this.renderVN();
    },
});
