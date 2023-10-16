import {defineComponent, h, provide} from "vue";
import {Guid} from "../../utils/guid.ts";
import {VmaFormulaGridCompColorPickerHueConstructor} from "../../../types";

export default defineComponent({
    name: 'VmaFormulaGridCompColorPickerHue',
    props: {},
    setup(props, context) {

        const $vmaFormulaGridCompColorPickerHue = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompColorPickerHueConstructor

        const renderVN = () => h('div')

        $vmaFormulaGridCompColorPickerHue.renderVN = renderVN

        provide('$vmaFormulaGridCompColorPickerHue', $vmaFormulaGridCompColorPickerHue)

        return $vmaFormulaGridCompColorPickerHue
    },
    render() {
        return this.renderVN()
    },
})