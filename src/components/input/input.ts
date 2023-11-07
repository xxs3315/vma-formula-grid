import { ComponentOptions, computed, defineComponent, h, nextTick, PropType, reactive, Ref, ref, resolveComponent, watch } from 'vue';
import {
    VmaFormulaGridCompButtonPropTypes,
    VmaFormulaGridCompInputConstructor,
    VmaFormulaGridCompInputEmits,
    VmaFormulaGridCompInputMethods,
    VmaFormulaGridCompInputPrivateRef,
    VmaFormulaGridCompInputPropTypes,
    VmaFormulaGridCompInputReactiveData,
} from '../../../types';
import { Guid } from '../../utils/guid';
import { DomTools } from '../../utils/doms';
import { floor, toInteger, toNumber, toString } from '../../utils';

export default defineComponent({
    name: 'VmaFormulaGridCompInput',
    props: {
        modelValue: [String, Number, Date] as PropType<VmaFormulaGridCompInputPropTypes.ModelValue>,
        immediate: { type: Boolean as PropType<VmaFormulaGridCompInputPropTypes.Immediate>, default: true },
        name: String as PropType<VmaFormulaGridCompInputPropTypes.Name>,
        category: { type: String as PropType<VmaFormulaGridCompInputPropTypes.Category>, default: 'text' },
        clearable: { type: Boolean as PropType<VmaFormulaGridCompInputPropTypes.Clearable> },
        readonly: Boolean as PropType<VmaFormulaGridCompInputPropTypes.Readonly>,
        disabled: Boolean as PropType<VmaFormulaGridCompInputPropTypes.Disabled>,
        placeholder: String as PropType<VmaFormulaGridCompInputPropTypes.Placeholder>,
        maxlength: [String, Number] as PropType<VmaFormulaGridCompInputPropTypes.Maxlength>,
        size: { type: String as PropType<VmaFormulaGridCompInputPropTypes.Size>, default: 'normal' },
        type: {
            type: String as PropType<VmaFormulaGridCompButtonPropTypes.Type>,
            default: 'default',
        },

        // number、integer、float
        min: { type: [String, Number] as PropType<VmaFormulaGridCompInputPropTypes.Min>, default: null },
        max: { type: [String, Number] as PropType<VmaFormulaGridCompInputPropTypes.Max>, default: null },
        step: [String, Number] as PropType<VmaFormulaGridCompInputPropTypes.Step>,

        controls: { type: Boolean as PropType<VmaFormulaGridCompInputPropTypes.Controls> },

        // float
        digits: { type: [String, Number] as PropType<VmaFormulaGridCompInputPropTypes.Digits> },

        prefixIcon: { type: String as PropType<VmaFormulaGridCompInputPropTypes.PrefixIcon> },
        suffixIcon: { type: String as PropType<VmaFormulaGridCompInputPropTypes.SuffixIcon> },

        placement: { type: String as PropType<VmaFormulaGridCompInputPropTypes.Placement> },
    },
    emits: [
        'update:modelValue',
        'input',
        'change',
        'keydown',
        'keyup',
        'mousewheel',
        'click',
        'focus',
        'blur',
        'clear',
        'search-click',
        'toggle-visible',
        'prev-number',
        'next-number',
        'prefix-click',
        'suffix-click',
    ] as VmaFormulaGridCompInputEmits,
    setup(props, context) {
        const { slots, emit } = context;

        const IconComponent = resolveComponent('VmaFormulaGridCompIcon') as ComponentOptions;

        const refElem = ref() as Ref<HTMLDivElement>;
        const refInputTarget = ref() as Ref<HTMLInputElement>;

        const refMaps: VmaFormulaGridCompInputPrivateRef = {
            refElem,
            refInput: refInputTarget,
        };

        const reactiveData = reactive({
            initiated: false,
            panelIndex: 0,
            showPwd: false,
            isActivated: false,
            inputValue: props.modelValue,
        } as VmaFormulaGridCompInputReactiveData);

        const $vmaFormulaGridCompInput = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData,
            getRefMaps: () => refMaps,
        } as unknown as VmaFormulaGridCompInputConstructor;

        let inputMethods = {} as VmaFormulaGridCompInputMethods;

        inputMethods = {
            dispatchEvent(type, params, event) {
                emit(type, Object.assign({ $input: $vmaFormulaGridCompInput, $event: event }, params));
            },

            focus() {
                const inputElem = refInputTarget.value;
                reactiveData.isActivated = true;
                inputElem.focus();
                return nextTick();
            },
            blur() {
                const inputElem = refInputTarget.value;
                inputElem.blur();
                reactiveData.isActivated = false;
                return nextTick();
            },
        };

        Object.assign($vmaFormulaGridCompInput, inputMethods);

        const computeInputPlaceholder = computed(() => {
            const { placeholder } = props;
            if (placeholder) {
                return placeholder;
            }
            return '';
        });

        const computeIsNumType = computed(() => {
            return ['number', 'integer', 'float'].indexOf(props.category) > -1;
        });

        const computeIsPasswordType = computed(() => {
            return props.category === 'password';
        });

        const computeIsClearable = computed(() => {
            const { category } = props;
            const isNumType = computeIsNumType.value;
            const isPasswordType = computeIsPasswordType.value;
            return props.clearable && (isPasswordType || isNumType || category === 'text' || category === 'search');
        });

        const computeInputImmediate = computed(() => {
            const { category, immediate } = props;
            return immediate || !(category === 'text' || category === 'number' || category === 'integer' || category === 'float');
        });

        const computeIsReadonly = computed(() => {
            const { readonly } = props;
            return readonly;
        });

        const computeDigitsValue = computed(() => {
            return toInteger(props.digits) || 1;
        });

        const validMaxNum = (num: number) => {
            return props.max === null || num <= toNumber(props.max);
        };

        const validMinNum = (num: number) => {
            return props.min === null || num >= toNumber(props.min);
        };

        function getNumberValue(val: any) {
            const { category } = props;
            const digitsValue = computeDigitsValue.value;
            return category === 'float' ? floor(toNumber(val), digitsValue).toFixed(digitsValue) : toString(val);
        }

        const emitModelValue = (value: VmaFormulaGridCompInputPropTypes.ModelValue, event: Event | { type: string }) => {
            reactiveData.inputValue = value;
            inputMethods.dispatchEvent('input', { value }, event);
            emit('update:modelValue', value);
            inputMethods.dispatchEvent('change', { value }, event);
        };

        const emitInputEvent = (value: any, event: Event) => {
            const inputImmediate = computeInputImmediate.value;
            reactiveData.inputValue = value;
            if (inputImmediate) {
                emitModelValue(value, event);
            } else {
                inputMethods.dispatchEvent('input', { value }, event);
            }
        };

        const computeStepValue = computed(() => {
            const { category } = props;
            const digitsValue = computeDigitsValue.value;
            const step = props.step;
            if (category === 'integer') {
                return toInteger(step) || 1;
            } else if (category === 'float') {
                return toNumber(step) || 1 / Math.pow(10, digitsValue);
            }
            return toNumber(step) || 1;
        });

        // 数值
        const numberChange = (isPlus: boolean, event: Event) => {
            const { min, max, category } = props;
            const { inputValue } = reactiveData;
            const stepValue = computeStepValue.value;
            const numValue = category === 'integer' ? toInteger(inputValue) : toNumber(inputValue);
            const newValue = isPlus ? numValue + stepValue : numValue - stepValue;
            let restNum: number | string;
            if (!validMinNum(newValue)) {
                restNum = min;
            } else if (!validMaxNum(newValue)) {
                restNum = max;
            } else {
                restNum = newValue;
            }
            emitInputEvent(getNumberValue(restNum), event as Event & { type: 'input' });
        };

        let downbumTimeout: number;

        const numberNextEvent = (event: Event) => {
            const { disabled } = props;
            const isReadonly = computeIsReadonly.value;
            clearTimeout(downbumTimeout);
            if (!disabled && !isReadonly) {
                numberChange(false, event);
            }
            inputMethods.dispatchEvent('next-number', {}, event);
        };

        // const numberDownNextEvent = (event: Event) => {
        //   downbumTimeout = window.setTimeout(() => {
        //     numberNextEvent(event)
        //     numberDownNextEvent(event)
        //   }, 60)
        // }

        const numberPrevEvent = (event: Event) => {
            const { disabled } = props;
            const isReadonly = computeIsReadonly.value;
            clearTimeout(downbumTimeout);
            if (!disabled && !isReadonly) {
                numberChange(true, event);
            }
            inputMethods.dispatchEvent('prev-number', {}, event);
        };

        const numberKeydownEvent = (event: KeyboardEvent) => {
            const { keyCode } = event;
            const isUpArrow = keyCode === 38;
            const isDwArrow = keyCode === 40;
            if (isUpArrow || isDwArrow) {
                event.preventDefault();
                if (isUpArrow) {
                    numberPrevEvent(event);
                } else {
                    numberNextEvent(event);
                }
            }
        };

        /**
         * 值变化时处理
         */
        const changeValue = () => {
            // const isDatePickerType = computeIsDatePickerType.value
            // const { inputValue } = reactiveData
            // if (isDatePickerType) {
            //   // TODO
            //   // dateParseValue(inputValue)
            //   // reactiveData.inputValue = reactData.datePanelLabel
            // }
        };

        watch(
            () => props.modelValue,
            (val) => {
                reactiveData.inputValue = val;
                changeValue();
            },
        );

        const triggerEvent = (
            event: Event & {
                type: 'input' | 'change' | 'keydown' | 'keyup' | 'mousewheel' | 'click' | 'focus' | 'blur';
            },
        ) => {
            const { inputValue } = reactiveData;
            inputMethods.dispatchEvent(event.type, { value: inputValue }, event);
        };

        const clearValueEvent = (event: Event, value: VmaFormulaGridCompInputPropTypes.ModelValue) => {
            const { type } = props;
            const isNumType = computeIsNumType.value;
            if (isNumType || ['text', 'search', 'password'].indexOf(type) > -1) {
                focus();
            }
            inputMethods.dispatchEvent('clear', { value }, event);
        };

        const clickPrefixEvent = (event: Event) => {
            const { disabled } = props;
            if (!disabled) {
                const { inputValue } = reactiveData;
                inputMethods.dispatchEvent('prefix-click', { value: inputValue }, event);
            }
        };

        const clickSuffixEvent = (event: Event) => {
            const { disabled } = props;
            if (!disabled) {
                if (DomTools.hasClass(event.currentTarget, 'is--clear')) {
                    emitModelValue('', event);
                    clearValueEvent(event, '');
                } else {
                    const { inputValue } = reactiveData;
                    inputMethods.dispatchEvent('suffix-click', { value: inputValue }, event);
                }
            }
        };

        // const clearEvent = (params: any, event: any) => {
        //   clearValueEvent(event, null)
        //   // TODO hideOptionPanel()
        // }

        const changeEvent = (event: Event & { type: 'change' }) => {
            const inputImmediate = computeInputImmediate.value;
            if (inputImmediate) {
                triggerEvent(event);
            } else {
                emitModelValue(reactiveData.inputValue, event);
            }
        };

        const focusEvent = (event: Event & { type: 'focus' }) => {
            reactiveData.isActivated = true;
            triggerEvent(event);
        };

        const blurEvent = (event: Event & { type: 'blur' }) => {
            const { inputValue } = reactiveData;
            const inputImmediate = computeInputImmediate.value;
            if (!inputImmediate) {
                emitModelValue(inputValue, event);
            }
            reactiveData.isActivated = false
            inputMethods.dispatchEvent('blur', { value: inputValue }, event);
        };

        const mousewheelEvent = (
            event: MouseEvent & {
                type: 'mousewheel';
                wheelDelta: number;
            },
        ) => {
            const isNumType = computeIsNumType.value;
            if (isNumType && props.controls) {
                if (reactiveData.isActivated) {
                    const delta = -event.wheelDelta || event.detail;
                    if (delta > 0) {
                        numberNextEvent(event);
                    } else if (delta < 0) {
                        numberPrevEvent(event);
                    }
                    event.preventDefault();
                }
            }
            triggerEvent(event);
        };

        const clickEvent = (event: Event & { type: 'click' }) => {
            triggerEvent(event);
        };

        const inputEvent = (event: Event & { type: 'input' }) => {
            const inputElem = event.target as HTMLInputElement;
            const value = inputElem.value;
            emitInputEvent(value, event);
        };

        const keydownEvent = (event: KeyboardEvent & { type: 'keydown' }) => {
            const isNumType = computeIsNumType.value;
            if (isNumType) {
                const isCtrlKey = event.ctrlKey;
                const isShiftKey = event.shiftKey;
                const isAltKey = event.altKey;
                const keyCode = event.keyCode;
                if (!isCtrlKey && !isShiftKey && !isAltKey && (keyCode === 32 || (keyCode >= 65 && keyCode <= 90))) {
                    event.preventDefault();
                }
                numberKeydownEvent(event);
            }
            triggerEvent(event);
        };

        const keyupEvent = (event: KeyboardEvent & { type: 'keyup' }) => {
            triggerEvent(event);
        };

        const renderPrefixIcon = () => {
            const { prefixIcon } = props;
            const icons = [];
            if (slots.prefix) {
                icons.push(
                    h(
                        'span',
                        {
                            class: 'vma-formula-grid-input--prefix-icon',
                        },
                        slots.prefix({}),
                    ),
                );
            } else if (prefixIcon) {
                icons.push(
                    // h('i', {
                    //   class: ['vma-formula-grid-input--prefix-icon', prefixIcon]
                    // }),
                    h(IconComponent, {
                        class: ['vma-formula-grid-input--prefix-icon'],
                        name: props.prefixIcon,
                        size: props.size,
                        color: 'currentColor',
                        // translateX: getInputIconTranslateX(props.size, 'left'),
                        // translateY: getInputIconTranslateY(props.size),
                    }),
                );
            }
            return icons.length
                ? h(
                      'span',
                      {
                          class: 'vma-formula-grid-input--prefix',
                          onClick: clickPrefixEvent,
                      },
                      icons,
                  )
                : null;
        };

        const renderSuffixIcon = () => {
            const { disabled, suffixIcon } = props;
            const { inputValue } = reactiveData;
            const isClearable = computeIsClearable.value;
            const icons = [];
            if (slots.suffix) {
                icons.push(
                    h(
                        'span',
                        {
                            class: 'vma-formula-grid-input--suffix-icon',
                        },
                        slots.suffix({}),
                    ),
                );
            } else if (suffixIcon) {
                icons.push(
                    h(IconComponent, {
                        class: ['vma-formula-grid-input--suffix-icon'],
                        name: props.suffixIcon,
                        size: props.size,
                        color: 'currentColor',
                        // translateX: getInputIconTranslateX(props.size, 'right'),
                        // translateY: getInputIconTranslateY(props.size),
                    }),
                );
            }
            if (isClearable) {
                icons.push(
                    h(IconComponent, {
                        class: ['vma-formula-grid-input--suffix-clear-icon'],
                        name: 'close',
                        size: props.size,
                        color: 'currentColor',
                        // translateX: getInputIconTranslateX(props.size, 'right'),
                        // translateY: getInputIconTranslateY(props.size),
                    }),
                );
            }
            return icons.length
                ? h(
                      'span',
                      {
                          class: [
                              'vma-formula-grid-input--suffix',
                              {
                                  'is--clear': isClearable && !disabled && !(inputValue === '' || inputValue === null || typeof inputValue === 'undefined'),
                              },
                          ],
                          onClick: clickSuffixEvent,
                      },
                      icons,
                  )
                : null;
        };

        const renderVN = () => {
            const prefixIcon = renderPrefixIcon();
            const suffixIcon = renderSuffixIcon();

            const { inputValue, isActivated } = reactiveData;
            const { disabled, readonly } = props;
            // const inputType = computeInputType.value

            const inputPlaceholder = computeInputPlaceholder.value;

            const childrenElements = [];

            if (prefixIcon) {
                childrenElements.push(prefixIcon);
            }

            childrenElements.push(
                h('input', {
                    ref: refInputTarget,
                    class: 'vma-formula-grid-input--inner-input',
                    value: inputValue,
                    placeholder: inputPlaceholder,
                    disabled,
                    readonly,
                    onKeydown: keydownEvent,
                    onKeyup: keyupEvent,
                    onMousewheel: mousewheelEvent,
                    onClick: clickEvent,
                    onInput: inputEvent,
                    onChange: changeEvent,
                    onFocus: focusEvent,
                    onBlur: blurEvent,
                }),
            );

            if (suffixIcon) {
                childrenElements.push(suffixIcon);
            }

            return h(
                'div',
                {
                    ref: refElem,
                    class: [
                        'vma-formula-grid-input',
                        'vma-formula-grid-input--' + props.size,
                        {
                            'is--active': isActivated,
                            'is--prefix': !!prefixIcon,
                            'is--suffix': !!suffixIcon,
                            'is--disabled': disabled,
                        },
                    ],
                },
                childrenElements,
            );
        };
        $vmaFormulaGridCompInput.renderVN = renderVN;

        return $vmaFormulaGridCompInput;
    },
    render() {
        return this.renderVN();
    },
});
