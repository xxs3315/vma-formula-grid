import {
  computed,
  defineComponent,
  h,
  nextTick,
  PropType,
  reactive,
  Ref,
  ref,
  watch
} from 'vue'
import { Guid } from '../../utils/guid'
import {
  VmaFormulaGridCompTextareaConstructor,
  VmaFormulaGridCompTextareaEmits,
  VmaFormulaGridCompTextareaMethods,
  VmaFormulaGridCompTextareaPropTypes,
  VmaFormulaGridCompTextareaReactiveData,
  VmaFormulaGridCompTextareaRefs
} from '../../types'

export default defineComponent({
  name: 'VmaFormulaGridCompTextarea',
  props: {
    type: {
      type: String as PropType<VmaFormulaGridCompTextareaPropTypes.Type>,
      default: 'default'
    },
    modelValue: [String, Number] as PropType<VmaFormulaGridCompTextareaPropTypes.ModelValue>,
    immediate: {
      type: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VmaFormulaGridCompTextareaPropTypes.Name>,
    readonly: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Readonly>,
    disabled: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Disabled>,
    placeholder: String as PropType<VmaFormulaGridCompTextareaPropTypes.Placeholder>,
    maxlength: [String, Number] as PropType<VmaFormulaGridCompTextareaPropTypes.Maxlength>,
    size: {
      type: String as PropType<VmaFormulaGridCompTextareaPropTypes.Size>,
      default: 'normal'
    },
    rows: {
      type: [String, Number] as PropType<VmaFormulaGridCompTextareaPropTypes.Rows>,
      default: 2
    },
    wrap: {
      type: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Wrap>,
      default: true
    },
    autofocus: {
      type: Boolean as PropType<VmaFormulaGridCompTextareaPropTypes.Autofocus>,
      default: false
    }
  },
  emits: [
    'update:modelValue',
    'input',
    'change',
    'focus',
    'blur',
    'keydown',
    'keyup'
  ] as VmaFormulaGridCompTextareaEmits,
  setup(props, context) {
    const { emit } = context

    const refElem = ref() as Ref<HTMLDivElement>
    const refLines = ref() as Ref<HTMLDivElement>
    const refCountHelper = ref() as Ref<HTMLDivElement>
    const refCountTargetHelper = ref() as Ref<HTMLDivElement>
    const refTextareaTarget = ref() as Ref<HTMLTextAreaElement>

    const gridTextareaRefs: VmaFormulaGridCompTextareaRefs = {
      refElem,
      refTextarea: refTextareaTarget,
      refLinesDiv: refLines,
      refCountHelperDiv: refCountHelper,
      refCountTargetHelperDiv: refCountTargetHelper
    }

    const reactiveData = reactive({
      initiated: false,
      isActivated: false,
      inputValue: props.modelValue
    } as VmaFormulaGridCompTextareaReactiveData)

    const $vmaTextarea = {
      uId: Guid.create().toString(),
      props,
      context,
      reactiveData,
      getRefs: () => gridTextareaRefs
    } as unknown as VmaFormulaGridCompTextareaConstructor & VmaFormulaGridCompTextareaMethods

    const changeValue = () => {
      // console.log('changeValue')
    }

    watch(
      () => props.modelValue,
      (val) => {
        reactiveData.inputValue = val
        changeValue()
      }
    )

    const computeInputPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return placeholder
      }
      return ''
    })

    const computeInputImmediate = computed(() => {
      const { immediate } = props
      return immediate
    })

    let textareaMethods = {} as VmaFormulaGridCompTextareaMethods

    textareaMethods = {
      dispatchEvent(type: any, params: any, evnt: any) {
        emit(type, { $input: $vmaTextarea, $event: evnt, ...params })
      },

      focus() {
        const textareaElem = refTextareaTarget.value
        reactiveData.isActivated = true
        textareaElem.focus()
        return nextTick()
      },
      blur() {
        const textareaElem = refTextareaTarget.value
        textareaElem.blur()
        reactiveData.isActivated = false
        return nextTick()
      }
    }

    Object.assign($vmaTextarea, textareaMethods)

    const emitModelValue = (
      value: VmaFormulaGridCompTextareaPropTypes.ModelValue,
      evnt: Event | { type: string }
    ) => {
      reactiveData.inputValue = value
      textareaMethods.dispatchEvent('input', { value }, evnt)
      emit('update:modelValue', value)
      textareaMethods.dispatchEvent('change', { value }, evnt)
    }

    const triggerEvent = (
      evnt: Event & {
        type: 'input' | 'change' | 'focus' | 'blur' | 'keydown' | 'keyup'
      }
    ) => {
      const { inputValue } = reactiveData
      textareaMethods.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      const inputImmediate = computeInputImmediate.value
      if (inputImmediate) {
        triggerEvent(evnt)
      } else {
        emitModelValue(reactiveData.inputValue, evnt)
      }
    }

    const focusEvent = (evnt: Event & { type: 'focus' }) => {
      reactiveData.isActivated = true
      triggerEvent(evnt)
    }

    const scrollEvent = (evnt: Event & { type: 'scroll' }) => {
      if (evnt && evnt.target) {
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactiveData
      const inputImmediate = computeInputImmediate.value
      if (!inputImmediate) {
        emitModelValue(inputValue, evnt)
      }
      reactiveData.isActivated = false
      textareaMethods.dispatchEvent('blur', { value: inputValue }, evnt)
    }

    const emitInputEvent = (value: any, evnt: Event) => {
      const inputImmediate = computeInputImmediate.value
      reactiveData.inputValue = value
      if (inputImmediate) {
        emitModelValue(value, evnt)
      } else {
        textareaMethods.dispatchEvent('input', { value }, evnt)
      }
    }

    const inputEvent = (evnt: Event & { type: 'input' }) => {
      const textareaElem = evnt.target as HTMLInputElement
      const { value } = textareaElem
      emitInputEvent(value, evnt)
      // recalculate()
    }

    const keydownEvent = (evnt: KeyboardEvent & { type: 'keydown' }) => {
      triggerEvent(evnt)
    }

    const keyupEvent = (evnt: KeyboardEvent & { type: 'keyup' }) => {
      triggerEvent(evnt)
    }

    const renderVN = () => {
      const { inputValue, isActivated } = reactiveData
      const { disabled, readonly, rows, /* showLines, */ wrap, autofocus } =
        props

      const inputPlaceholder = computeInputPlaceholder.value

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
              'is--disabled': disabled
            }
          ]
        },
        [
          h('textarea', {
            ref: refTextareaTarget,
            class: [
              'inner-textarea',
              {
                'inner-textarea--wrap': wrap,
                'inner-textarea--nowrap': !wrap
              }
            ],
            value: inputValue,
            placeholder: inputPlaceholder,
            disabled,
            readonly,
            rows,
            autofocus,
            onKeydown: keydownEvent,
            onKeyup: keyupEvent,
            onInput: inputEvent,
            onChange: changeEvent,
            onFocus: focusEvent,
            onBlur: blurEvent,
            onScroll: scrollEvent,
            // onMousedown: detectResize,
            style: {
              resize: 'both'
            }
          })
        ]
      )
    }
    $vmaTextarea.renderVN = renderVN
    return $vmaTextarea
  },
  render() {
    return this.renderVN()
  }
})
