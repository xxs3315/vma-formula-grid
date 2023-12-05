import { defineComponent, h, reactive, ComponentOptions, resolveComponent, computed } from 'vue';
import { Guid } from '../../utils/guid.ts';
import { VmaFormulaGridCompToolbarGenericReactiveData, VmaFormulaGridCompToolbarGenericRefs, VmaFormulaGridCompToolbarGenericConstructor } from '../../../types';
import { isMacLike } from '../../utils';

export default defineComponent({
    name: 'VmaFormulaGridCompToolbarGeneric',
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    setup(props, context) {
        const reactiveData = reactive({} as VmaFormulaGridCompToolbarGenericReactiveData);

        const gridToolbarGenericRefs: VmaFormulaGridCompToolbarGenericRefs = {};

        const GridCompButtonComponent = resolveComponent('VmaFormulaGridCompButton') as ComponentOptions;

        const $vmaToolbarGeneric = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
            getRefs: () => gridToolbarGenericRefs,
        } as unknown as VmaFormulaGridCompToolbarGenericConstructor;

        const hotkey = computed(() => {
            let s = props.item.hotkey;
            if (typeof s != 'string') return false;
            s = s.toUpperCase();
            s = s.replace(/(shift|⇧)\+/gi, isMacLike ? '⇧' : 'Shift+');
            s = s.replace(/(control|ctrl|⌃)\+/gi, isMacLike ? '⌃' : 'Ctrl+');
            s = s.replace(/(option|alt|⌥)\+/gi, isMacLike ? '⌥' : 'Alt+');
            s = s.replace(/(cmd|command|⌘)\+/gi, isMacLike ? '⌘' : 'Cmd+');
            return s;
        });

        const title = computed(() => {
            if (props.item.title) {
                let title = props.item.title;
                if (hotkey.value) title += ' (' + hotkey.value + ')';
                return title;
            } else return null;
        });

        const renderVN = () =>
            h(GridCompButtonComponent, {
                icon: props.item.icon,
                type: 'primary',
                size: 'small',
                title: title.value,
                class: 'vma-formula-grid-comp-toolbar-button',
            });

        $vmaToolbarGeneric.renderVN = renderVN;

        return $vmaToolbarGeneric;
    },
    render() {
        return this.renderVN();
    },
});
