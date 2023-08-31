import {Guid} from "../../utils/guid.ts";
import {
    VmaFormulaGridCompContextMenuConstructor,
    VmaFormulaGridCompContextMenuPropTypes,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods
} from "../../types";
import {defineComponent, h, inject, PropType, provide, Teleport} from "vue";

export default defineComponent({
    name: 'VmaFormulaGridCompContextMenu',
    props: {
        type: {
            type: String as PropType<VmaFormulaGridCompContextMenuPropTypes.Type>,
            default: 'default'
        },
        size: {
            type: String as PropType<VmaFormulaGridCompContextMenuPropTypes.Size>,
            default: 'normal'
        },
    },
    setup(props, context) {
        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const { refGridContextMenu } = $vmaFormulaGrid.getRefs()

        const { ctxMenuStore } = $vmaFormulaGrid.reactiveData

        const $vmaFormulaGridCompContextMenu = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompContextMenuConstructor

        const renderVN = () =>
            h(Teleport,
                {
                    to: 'body',
                    disabled: false
                },
                [
                    h('div', {
                        ref: refGridContextMenu,
                        class: [
                            'vma-formula-grid-context-menu',
                            {
                                'is--visible': ctxMenuStore.visible,
                            },
                        ],
                        style: ctxMenuStore.style,
                    })
                ]
            )

        $vmaFormulaGridCompContextMenu.renderVN = renderVN

        provide('$vmaFormulaGridCompContextMenu', $vmaFormulaGridCompContextMenu)

        return $vmaFormulaGridCompContextMenu
    },
    render() {
        return this.renderVN()
    },
})