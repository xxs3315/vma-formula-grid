import { provide, defineComponent, h, PropType } from 'vue';
import { Guid } from '../../utils/guid';
import { VmaFormulaGridCompSelectOptionConstructor, VmaFormulaGridCompSelectOptionMethods } from '../../../types';

export default defineComponent({
    name: 'VmaFormulaGridCompSelectOption',
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
        const { slots, emit } = context;

        const $vmaFormulaGridCompSelectOption = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompSelectOptionConstructor;

        const vmaFormulaGridCompSelectOptionMethods: VmaFormulaGridCompSelectOptionMethods = {
            handleChecked(params: { label: null | string | number }, evnt: Event) {
                const { label } = params;
                emit('update:modelValue', [label]);
                emit('change', params, evnt);
            },
        };

        Object.assign($vmaFormulaGridCompSelectOption, vmaFormulaGridCompSelectOptionMethods);

        provide('$vmaFormulaGridCompSelectOption', $vmaFormulaGridCompSelectOption);

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
