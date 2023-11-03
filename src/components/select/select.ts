import {computed, defineComponent, h, provide, ref} from 'vue';
import {Guid} from "../../utils/guid.ts";
import {VmaFormulaGridCompSelectConstructor} from "../../../types";

export default defineComponent({
    name: 'VmaFormulaGridCompSelect',
    props: {
        dir: {
            type: String,
            default: 'auto',
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        noDrop: {
            type: Boolean,
            default: false,
        },
        searchable: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, context) {
        const $vmaFormulaGridCompSelect = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompSelectConstructor;

        let search = ref('')

        const dropdownOpen = computed(() => {
            return false
        })

        const mutableLoading = computed(() => {
            return false
        })

        const renderVN = () => 
            h('div', {
                dir: props.dir,
                class: ['vma-formula-grid-select',
                    {'vs--open': dropdownOpen.value},
                    {'vs--single': !props.multiple},
                    {'vs--multiple': props.multiple},
                    {'vs--searching': search.value && !props.noDrop},
                    {'vs--searchable': props.searchable && !props.noDrop},
                    {'vs--unsearchable': !props.searchable},
                    {'vs--loading': mutableLoading.value},
                    {'vs--disabled': props.disabled},
                ]
            }, [
                h('div')
            ])

        $vmaFormulaGridCompSelect.renderVN = renderVN;

        provide('$vmaFormulaGridCompSelect', $vmaFormulaGridCompSelect);

        return $vmaFormulaGridCompSelect;
    },
    render() {
        return this.renderVN();
    },
});
