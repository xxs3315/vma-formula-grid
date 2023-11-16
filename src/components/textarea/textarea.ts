import { ComponentOptions, computed, defineComponent, h, inject, nextTick, onBeforeUnmount, onMounted, PropType, reactive, Ref, ref, resolveComponent, watch } from 'vue';
import { Guid } from '../../utils/guid';
import {
    VmaFormulaGridCompTextareaConstructor,
    VmaFormulaGridCompTextareaEmits,
    VmaFormulaGridCompTextareaMethods,
    VmaFormulaGridCompTextareaPropTypes,
    VmaFormulaGridCompTextareaReactiveData,
    VmaFormulaGridCompTextareaRefs,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods,
} from '../../../types';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { Compartment } from '@codemirror/state';
import { spreadsheet, setAutocompletionIdiom, indentAndCompletionWithTab, tabObservable } from '../../index.common.ts';
import { basicSetup } from 'codemirror';
import { EditorView, keymap, tooltips } from '@codemirror/view';
import { createResizeEvent } from '../../utils/resize.ts';

export default defineComponent({
    name: 'VmaFormulaGridCompTextarea',
    props: {
        type: {
            type: String as PropType<VmaFormulaGridCompTextareaPropTypes.Type>,
            default: 'default',
        },
        modelValue: [String, Number] as PropType<VmaFormulaGridCompTextareaPropTypes.ModelValue>,
        immediate: {
            type: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Immediate>,
            default: false,
        },
        name: String as PropType<VmaFormulaGridCompTextareaPropTypes.Name>,
        readonly: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Readonly>,
        disabled: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Disabled>,
        placeholder: String as PropType<VmaFormulaGridCompTextareaPropTypes.Placeholder>,
        maxlength: [String, Number] as PropType<VmaFormulaGridCompTextareaPropTypes.Maxlength>,
        size: {
            type: String as PropType<VmaFormulaGridCompTextareaPropTypes.Size>,
            default: 'normal',
        },
        rows: {
            type: [String, Number] as PropType<VmaFormulaGridCompTextareaPropTypes.Rows>,
            default: 2,
        },
        wrap: {
            type: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Wrap>,
            default: true,
        },
        autofocus: {
            type: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Autofocus>,
            default: true,
        },
    },
    emits: ['update:modelValue', 'input', 'change', 'focus', 'blur', 'keydown', 'keyup'] as VmaFormulaGridCompTextareaEmits,
    setup(props, context) {
        const { emit } = context;

        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const { currentCellEditorStyle } = $vmaFormulaGrid.reactiveData;

        let resizeObserver: ResizeObserver;

        onMounted(() => {
            const el = refElem.value;
            resizeObserver = createResizeEvent(() => {
                handleResize();
            });
            if (el) {
                resizeObserver.observe(el);
            }
        });

        onBeforeUnmount(() => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        });

        const refElem = ref() as Ref<HTMLDivElement>;
        const refLines = ref() as Ref<HTMLDivElement>;
        const refCountHelper = ref() as Ref<HTMLDivElement>;
        const refCountTargetHelper = ref() as Ref<HTMLDivElement>;
        const refTextareaTarget = ref() as Ref<HTMLTextAreaElement>;

        const CodeMirrorComponent = resolveComponent('VmaFormulaGridCompCodeMirror') as ComponentOptions;

        let cmInstance: any = null;

        const gridTextareaRefs: VmaFormulaGridCompTextareaRefs = {
            refElem,
            refTextarea: refTextareaTarget,
            refLinesDiv: refLines,
            refCountHelperDiv: refCountHelper,
            refCountTargetHelperDiv: refCountTargetHelper,
        };

        const reactiveData = reactive({
            initiated: false,
            isActivated: false,
            inputValue: props.modelValue,
        } as VmaFormulaGridCompTextareaReactiveData);

        const $vmaTextarea = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
            getRefs: () => gridTextareaRefs,
        } as unknown as VmaFormulaGridCompTextareaConstructor & VmaFormulaGridCompTextareaMethods;

        const changeValue = () => {
            // console.log('changeValue')
        };

        watch(
            () => props.modelValue,
            (val) => {
                reactiveData.inputValue = val;
                changeValue();
            },
        );

        const computeInputPlaceholder = computed(() => {
            const { placeholder } = props;
            if (placeholder) {
                return placeholder;
            }
            return '';
        });

        const computeInputImmediate = computed(() => {
            const { immediate } = props;
            return immediate;
        });

        let textareaMethods = {} as VmaFormulaGridCompTextareaMethods;

        textareaMethods = {
            dispatchEvent(type: any, params: any, payload?: any) {
                emit(type, { $input: $vmaTextarea, ...params, payload: payload });
            },

            focus() {
                reactiveData.isActivated = true;
                if (cmInstance) {
                    cmInstance.view.focus();
                    // cmInstance.view.setCursor(cmInstance.view.lineCount(), 0);
                }
                return nextTick();
            },
            blur() {
                if (cmInstance) {
                    cmInstance.view.blur();
                }
                reactiveData.isActivated = false;
                return nextTick();
            },
        };

        Object.assign($vmaTextarea, textareaMethods);

        const emitModelValue = (value: VmaFormulaGridCompTextareaPropTypes.ModelValue) => {
            reactiveData.inputValue = value;
            textareaMethods.dispatchEvent('input', { value });
            emit('update:modelValue', value);
            textareaMethods.dispatchEvent('change', { value });
        };

        const triggerEvent = (type: 'input' | 'change' | 'focus' | 'blur' | 'keydown' | 'keyup', value: any) => {
            const { inputValue } = reactiveData;
            textareaMethods.dispatchEvent(type, { value: inputValue });
        };

        const changeEvent = (value: any) => {
            emitInputEvent(value);
            const inputImmediate = computeInputImmediate.value;
            if (inputImmediate) {
                triggerEvent('change', value);
            } else {
                emitModelValue(reactiveData.inputValue);
            }
        };

        const focusEvent = (value: any) => {
            reactiveData.isActivated = true;
            triggerEvent('focus', value);
        };

        const blurEvent = (value: any, payload: any) => {
            const { inputValue } = reactiveData;
            const inputImmediate = computeInputImmediate.value;
            if (!inputImmediate) {
                emitModelValue(inputValue);
            }
            reactiveData.isActivated = false;
            textareaMethods.dispatchEvent('blur', { value: inputValue }, payload);
        };

        const emitInputEvent = (value: any) => {
            const inputImmediate = computeInputImmediate.value;
            reactiveData.inputValue = value;
            if (inputImmediate) {
                emitModelValue(value);
            } else {
                textareaMethods.dispatchEvent('input', { value });
            }
        };

        const config = reactive({
            indentWithTab: true,
            tabSize: 4,
            backgroundColor: 'white',
            language: '',
            phrases: {},
        });

        const myHighlightStyle = HighlightStyle.define([
            { tag: tags.name, color: 'green' },
            { tag: tags.bool, color: '#A020F0' },
            { tag: tags.color, color: '#0000FF' },
            { tag: tags.invalid, color: '#FA6F66' },
        ]);

        const languageCompartment = new Compartment(),
            autocompleteCompartment = new Compartment();

        const basicExtensions = [
            basicSetup,
            keymap.of([indentAndCompletionWithTab]),
            syntaxHighlighting(myHighlightStyle),
            tabObservable(),
            EditorView.lineWrapping,
            tooltips({
                parent: document.body,
            }),
        ];

        const extensions = computed(() => {
            const result = [...basicExtensions, languageCompartment.of(spreadsheet()), autocompleteCompartment.of([])];
            return result;
        });

        const handleReady = (value: any) => {
            cmInstance = value;
            setAutocompletionIdiom(value.view, autocompleteCompartment);
        };

        const handleResize = () => {
            currentCellEditorStyle.resized = true;
            currentCellEditorStyle.height = `${refElem.value.offsetHeight}px`;
            currentCellEditorStyle.width = `${refElem.value.offsetWidth}px`;
        };

        const renderVN = () => {
            const { inputValue, isActivated } = reactiveData;
            const { disabled, readonly, rows, /* showLines, */ wrap, autofocus } = props;

            const inputPlaceholder = computeInputPlaceholder.value;

            return h(
                'div',
                {
                    ref: refElem,
                    class: [
                        'vma-formula-grid-textarea',
                        props.size,
                        props.type,
                        {
                            'is--active': isActivated,
                            'is--disabled': disabled,
                        },
                    ],
                    onResize: handleResize,
                },
                [
                    h(CodeMirrorComponent, {
                        ref: refTextareaTarget,
                        class: 'codemirror',
                        autofocus: props.autofocus,
                        placeholder: inputPlaceholder,
                        indentWithTab: config.indentWithTab,
                        tabSize: config.tabSize,
                        disabled: props.disabled,
                        style: {
                            backgroundColor: config.backgroundColor,
                            width: '100%',
                            height: '100%',
                        },
                        extensions: extensions.value,
                        modelValue: inputValue === null || inputValue === undefined ? '' : `${inputValue}`,
                        phrases: config.phrases,
                        onReady: handleReady,
                        onChange: changeEvent,
                        onFocus: focusEvent,
                        onBlur: blurEvent,
                    }),
                ],
            );
        };
        $vmaTextarea.renderVN = renderVN;
        return $vmaTextarea;
    },
    render() {
        return this.renderVN();
    },
});
