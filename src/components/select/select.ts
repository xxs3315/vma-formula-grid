import {defineComponent, provide} from "vue/dist/vue";
import {Guid} from "../../utils/guid.ts";
import {VmaFormulaGridCompSelectConstructor} from "../../../types";
import {h} from "vue";

export default defineComponent({
    name: 'VmaFormulaGridCompSelect',
    props: {},
    emits: [
        'update:modelValue',
        'change',
        'clear',
        'blur',
        'focus'
    ],
    setup(props, context) {
        const { slots, emit } = context

        const $vmaFormulaGridCompSelect = {
            uId: Guid.create().toString(),
            props,
            context
        } as unknown as VmaFormulaGridCompSelectConstructor

        const renderVN = () => h('div')

        $vmaFormulaGridCompSelect.renderVN = renderVN

        provide('$vmaFormulaGridCompSelect', $vmaFormulaGridCompSelect)

        return $vmaFormulaGridCompSelect
    },
    render() {
        return this.renderVN()
    }
})