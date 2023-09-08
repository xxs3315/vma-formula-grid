import {CSSProperties, defineComponent, h, PropType, provide} from 'vue'
import {Guid} from "../../utils/guid.ts";
import {VmaFormulaGridCompIconConstructor, VmaFormulaGridCompIconPropTypes} from "../../../types";


export default defineComponent({
    name: 'VmaFormulaGridCompIcon',
    props: {
        type: {
            type: String as PropType<VmaFormulaGridCompIconPropTypes.Type>,
            default: 'default'
        },
        size: {
            type: String as PropType<VmaFormulaGridCompIconPropTypes.Size>,
            default: 'normal'
        },
        name: String,
        color: String,
        rotate: {type: Number, default: 0},
        translateX: {type: Number, default: 0},
        translateY: {type: Number, default: 0},
        scaleX: {type: Number, default: 1},
        scaleY: {type: Number, default: 1}
    },
    setup(props, context) {
        const $vmaFormulaGridCompIcon = {
            uId: Guid.create().toString(),
            props,
            context
        } as unknown as VmaFormulaGridCompIconConstructor

        const getStyle = () => {
            const {color, rotate, translateX, translateY, scaleX, scaleY} = props
            const style: CSSProperties = {}
            if (color) {
                style.color = color
            }
            style.transform = `rotate(${rotate}deg) translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
            return style
        }

        const renderVN = () =>
            h('i', {
                class: [
                    'vma-formula-grid-iconfont',
                    `vma-formula-grid-icon-${props.name}`,
                    'vma-formula-grid-icon',
                    props.size,
                    props.type
                ],
                style: getStyle()
            })

        $vmaFormulaGridCompIcon.renderVN = renderVN

        provide('$vmaFormulaGridCompIcon', $vmaFormulaGridCompIcon)

        return $vmaFormulaGridCompIcon
    },
    render() {
        return this.renderVN()
    }
})
