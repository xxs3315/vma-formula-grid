import {defineComponent, h, provide} from "vue";
import {Guid} from "../../utils/guid.ts";
import {VmaFormulaGridCompColorPickerConstructor} from "../../../types";

export default defineComponent({
    name: 'VmaFormulaGridCompColorPicker',
    props: {},
    setup(props, context) {

        const $vmaFormulaGridCompColorPicker = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompColorPickerConstructor
        
        const renderVN = () => h('div')

        $vmaFormulaGridCompColorPicker.renderVN = renderVN

        provide('$vmaFormulaGridCompColorPicker', $vmaFormulaGridCompColorPicker)

        return $vmaFormulaGridCompColorPicker
    },
    render() {
        return this.renderVN()
    },
})