import { provide, defineComponent, h, PropType } from 'vue';
import { Guid } from '../../utils/guid';
import { VmaFormulaGridCompSelectOptionGroupConstructor, VmaFormulaGridCompSelectOptionGroupMethods } from '../../../types';

export default defineComponent({
    name: 'VmaFormulaGridCompSelectOptionGroup',
    props: {
        modelValue: null,
        disabled: Boolean,
        clearable: Boolean,
        multiple: Boolean,
        placeholder: String,
        size: {
            type: String,
            default: 'normal',
        },
        type: {
            type: String,
            default: 'default',
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emits: ['update:modelValue', 'change'],
    setup(props, context) {
        const { emit } = context;

        const $vmaFormulaGridCompSelectOptionGroup = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompSelectOptionGroupConstructor;

        const vmaFormulaGridCompSelectOptionGroupMethods: VmaFormulaGridCompSelectOptionGroupMethods = {
            handleChecked(params: { label: null | string | number }, event: Event) {
                const { label } = params;
                emit('update:modelValue', [label]);
                emit('change', params, event);
            },
        };

        Object.assign($vmaFormulaGridCompSelectOptionGroup, vmaFormulaGridCompSelectOptionGroupMethods);

        provide('$vmaFormulaGridCompSelectOptionGroup', $vmaFormulaGridCompSelectOptionGroup);

        return () => {
            return h(
                'div',
                {
                    class: 'vma-formula-grid-select',
                },
                [h('div', { class: ['select-input--prefix'] }), h('input', { class: ['select-input--inner'] }), h('div', { class: ['select-input--suffix'] })],
            );
        };
    },
});
