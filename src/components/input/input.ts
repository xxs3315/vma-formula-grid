import { defineComponent, h, ref, Ref, computed, reactive, inject, nextTick, watch, onUnmounted, PropType } from 'vue'

export default defineComponent({
  name: 'VmaFormulaGridCompIcon',
  props: {
    modelValue: [String, Number, Date] as PropType<VmaInputPropTypes.ModelValue>,
    immediate: { type: Boolean as PropType<VmaInputPropTypes.Immediate>, default: true },
    name: String as PropType<VmaInputPropTypes.Name>,
    type: { type: String as PropType<VmaInputPropTypes.Type>, default: 'text' },
    clearable: { type: Boolean as PropType<VmaInputPropTypes.Clearable>, default: () => GlobalConfig.input.clearable },
    readonly: Boolean as PropType<VmaInputPropTypes.Readonly>,
    disabled: Boolean as PropType<VmaInputPropTypes.Disabled>,
    placeholder: String as PropType<VmaInputPropTypes.Placeholder>,
    maxlength: [String, Number] as PropType<VmaInputPropTypes.Maxlength>,
    autocomplete: { type: String as PropType<VmaInputPropTypes.Autocomplete>, default: 'off' },
    align: String as PropType<VmaInputPropTypes.Align>,
    className: String as PropType<VmaInputPropTypes.ClassName>,
    size: { type: String as PropType<VmaInputPropTypes.Size>, default: () => GlobalConfig.input.size || GlobalConfig.size },
    multiple: Boolean as PropType<VmaInputPropTypes.Multiple>,

    // number、integer、float
    min: { type: [String, Number] as PropType<VmaInputPropTypes.Min>, default: null },
    max: { type: [String, Number] as PropType<VmaInputPropTypes.Max>, default: null },
    step: [String, Number] as PropType<VmaInputPropTypes.Step>,
    exponential: { type: Boolean as PropType<VmaInputPropTypes.Exponential>, default: () => GlobalConfig.input.exponential },

    // number、integer、float、password
    controls: { type: Boolean as PropType<VmaInputPropTypes.Controls>, default: () => GlobalConfig.input.controls },

    // float
    digits: { type: [String, Number] as PropType<VmaInputPropTypes.Digits>, default: () => GlobalConfig.input.digits },

    prefixIcon: String as PropType<VmaInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VmaInputPropTypes.SuffixIcon>,
    placement: String as PropType<VmaInputPropTypes.Placement>,
    transfer: { type: Boolean as PropType<VmaInputPropTypes.Transfer>, default: () => GlobalConfig.input.transfer }
  },
  emits: [
    'update:modelValue',
    'input',
    'change',
    'keydown',
    'keyup',
    'wheel',
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
  ] as VmaInputEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = uniqueId()

    const computeSize = useSize(props)

    const reactData = reactive<InputReactData>({
      inited: false,
      panelIndex: 0,
      showPwd: false,
      visiblePanel: false,
      animatVisible: false,
      panelStyle: null,
      panelPlacement: '',
      isActivated: false,
      inputValue: props.modelValue,
    })

    const refElem = ref() as Ref<HTMLDivElement>
    const refInputTarget = ref() as Ref<HTMLInputElement>
    const refInputPanel = ref() as Ref<HTMLDivElement>
    const refInputTimeBody = ref() as Ref<HTMLDivElement>

    const refMaps: InputPrivateRef = {
      refElem,
      refInput: refInputTarget
    }

    const $xeinput = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VmaInputConstructor

    let inputMethods = {} as InputMethods

    const computeIsNumType = computed(() => {
      return ['number', 'integer', 'float'].indexOf(props.type) > -1
    })

    const computeIsPawdType = computed(() => {
      return props.type === 'password'
    })

    const computeIsSearchType = computed(() => {
      return props.type === 'search'
    })

    const computeDigitsValue = computed(() => {
      return toInteger(props.digits) || 1
    })

    const computeStepValue = computed(() => {
      const { type } = props
      const digitsValue = computeDigitsValue.value
      const step = props.step
      if (type === 'integer') {
        return toInteger(step) || 1
      } else if (type === 'float') {
        return toNumber(step) || (1 / Math.pow(10, digitsValue))
      }
      return toNumber(step) || 1
    })

    const computeIsClearable = computed(() => {
      const { type } = props
      const isNumType = computeIsNumType.value
      const isPawdType = computeIsPawdType.value
      return props.clearable && (isPawdType || isNumType || type === 'text' || type === 'search')
    })

    const computeInpReadonly = computed(() => {
      const { type, readonly, editable, multiple } = props
      return readonly || multiple || !editable || type === 'week' || type === 'quarter'
    })

    const computeInputType = computed(() => {
      const { type } = props
      const { showPwd } = reactData
      const isNumType = computeIsNumType.value
      const isPawdType = computeIsPawdType.value
      if (isNumType || (isPawdType && showPwd) || type === 'number') {
        return 'text'
      }
      return type
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      return ''
    })

    const computeInpMaxlength = computed(() => {
      const { maxlength } = props
      const isNumType = computeIsNumType.value
      // 数值最大长度限制 16 位，包含小数
      return isNumType && !toNumber(maxlength) ? 16 : maxlength
    })

    const computeInpImmediate = computed(() => {
      const { type, immediate } = props
      return immediate || !(type === 'text' || type === 'number' || type === 'integer' || type === 'float')
    })

    const computeNumValue = computed(() => {
      const { type } = props
      const { inputValue } = reactData
      const isNumType = computeIsNumType.value
      if (isNumType) {
        return type === 'integer' ? toInteger(handleNumber(inputValue)) : toNumber(handleNumber(inputValue))
      }
      return 0
    })

    const computeIsDisabledSubtractNumber = computed(() => {
      const { min } = props
      const { inputValue } = reactData
      const isNumType = computeIsNumType.value
      const numValue = computeNumValue.value
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && isNumType && min !== null) {
        return numValue <= toNumber(min)
      }
      return false
    })

    const computeIsDisabledAddNumber = computed(() => {
      const { max } = props
      const { inputValue } = reactData
      const isNumType = computeIsNumType.value
      const numValue = computeNumValue.value
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && isNumType && max !== null) {
        return numValue >= toNumber(max)
      }
      return false
    })

    const getNumberValue = (val: any) => {
      const { type, exponential } = props
      const inpMaxlength = computeInpMaxlength.value
      const digitsValue = computeDigitsValue.value
      const restVal = (type === 'float' ? toFloatValueFixed(val, digitsValue) : toValueString(val))
      if (exponential && (val === restVal || toValueString(val).toLowerCase() === toNumber(restVal).toExponential())) {
        return val
      }
      return restVal.slice(0, inpMaxlength)
    }

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'wheel' | 'click' | 'focus' | 'blur' }) => {
      const { inputValue } = reactData
      inputMethods.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const emitModel = (value: string, evnt: Event | { type: string }) => {
      reactData.inputValue = value
      emit('update:modelValue', value)
      inputMethods.dispatchEvent('input', { value }, evnt)
      if (toValueString(props.modelValue) !== value) {
        inputMethods.dispatchEvent('change', { value }, evnt)
      }
    }

    const emitInputEvent = (value: any, evnt: Event) => {
      const inpImmediate = computeInpImmediate.value
      reactData.inputValue = value
      if (inpImmediate) {
        emitModel(value, evnt)
      } else {
        inputMethods.dispatchEvent('input', { value }, evnt)
      }
    }

    const inputEvent = (evnt: Event & { type: 'input' }) => {
      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      emitInputEvent(value, evnt)
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        triggerEvent(evnt)
      }
    }

    const focusEvent = (evnt: Event & { type: 'focus' }) => {
      reactData.isActivated = true
      triggerEvent(evnt)
    }

    const clickPrefixEvent = (evnt: Event) => {
      const { disabled } = props
      if (!disabled) {
        const { inputValue } = reactData
        inputMethods.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    }

    const clearValueEvent = (evnt: Event, value: VmaInputPropTypes.ModelValue) => {
      const { type } = props
      const isNumType = computeIsNumType.value
      if (isNumType || ['text', 'search', 'password'].indexOf(type) > -1) {
        focus()
      }
      inputMethods.dispatchEvent('clear', { value }, evnt)
    }

    const clickSuffixEvent = (evnt: Event) => {
      const { disabled } = props
      if (!disabled) {
        if (hasClass(evnt.currentTarget, 'is--clear')) {
          emitModel('', evnt)
          clearValueEvent(evnt, '')
        } else {
          const { inputValue } = reactData
          inputMethods.dispatchEvent('suffix-click', { value: inputValue }, evnt)
        }
      }
    }

    /**
     * 值变化时处理
     */
    const changeValue = () => {
      const { inputValue } = reactData
    }

    /**
     * 检查初始值
     */
    const initValue = () => {
      const { type } = props
      const { inputValue } = reactData
      const digitsValue = computeDigitsValue.value
      if (type === 'float') {
        if (inputValue) {
          const validValue = toFloatValueFixed(inputValue, digitsValue)
          if (inputValue !== validValue) {
            emitModel(validValue, { type: 'init' })
          }
        }
      }
    }

    const vaildMaxNum = (num: number | string) => {
      return props.max === null || toNumber(num) <= toNumber(props.max)
    }

    const vaildMinNum = (num: number | string) => {
      return props.min === null || toNumber(num) >= toNumber(props.min)
    }

    const afterCheckValue = () => {
      const { type, min, max, exponential } = props
      const { inputValue, datetimePanelValue } = reactData
      const isNumType = computeIsNumType.value
      const inpReadonly = computeInpReadonly.value
      if (!inpReadonly) {
        if (isNumType) {
          if (inputValue) {
            let inpNumVal: number | string = type === 'integer' ? toInteger(handleNumber(inputValue)) : toNumber(handleNumber(inputValue))
            if (!vaildMinNum(inpNumVal)) {
              inpNumVal = min
            } else if (!vaildMaxNum(inpNumVal)) {
              inpNumVal = max
            }
            if (exponential) {
              const inpStringVal = toValueString(inputValue).toLowerCase()
              if (inpStringVal === toNumber(inpNumVal).toExponential()) {
                inpNumVal = inpStringVal
              }
            }
            emitModel(getNumberValue(inpNumVal), { type: 'check' })
          }
        }
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactData
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        emitModel(inputValue, evnt)
      }
      afterCheckValue()
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      inputMethods.dispatchEvent('blur', { value: inputValue }, evnt)
    }

    // 密码
    const passwordToggleEvent = (evnt: Event) => {
      const { readonly, disabled } = props
      const { showPwd } = reactData
      if (!disabled && !readonly) {
        reactData.showPwd = !showPwd
      }
      inputMethods.dispatchEvent('toggle-visible', { visible: reactData.showPwd }, evnt)
    }
    // 密码

    // 搜索
    const searchEvent = (evnt: Event) => {
      inputMethods.dispatchEvent('search-click', {}, evnt)
    }
    // 搜索

    // 数值
    const numberChange = (isPlus: boolean, evnt: Event) => {
      const { min, max, type } = props
      const { inputValue } = reactData
      const stepValue = computeStepValue.value
      const numValue = type === 'integer' ? toInteger(handleNumber(inputValue)) : toNumber(handleNumber(inputValue))
      const newValue = isPlus ? add(numValue, stepValue) : subtract(numValue, stepValue)
      let restNum: number | string
      if (!vaildMinNum(newValue)) {
        restNum = min
      } else if (!vaildMaxNum(newValue)) {
        restNum = max
      } else {
        restNum = newValue
      }
      emitInputEvent(getNumberValue(restNum), evnt as (Event & { type: 'input' }))
    }

    let downbumTimeout: number

    const numberNextEvent = (evnt: Event) => {
      const { readonly, disabled } = props
      const isDisabledSubtractNumber = computeIsDisabledSubtractNumber.value
      clearTimeout(downbumTimeout)
      if (!disabled && !readonly && !isDisabledSubtractNumber) {
        numberChange(false, evnt)
      }
      inputMethods.dispatchEvent('next-number', {}, evnt)
    }

    const numberDownNextEvent = (evnt: Event) => {
      downbumTimeout = window.setTimeout(() => {
        numberNextEvent(evnt)
        numberDownNextEvent(evnt)
      }, 60)
    }

    const numberPrevEvent = (evnt: Event) => {
      const { readonly, disabled } = props
      const isDisabledAddNumber = computeIsDisabledAddNumber.value
      clearTimeout(downbumTimeout)
      if (!disabled && !readonly && !isDisabledAddNumber) {
        numberChange(true, evnt)
      }
      inputMethods.dispatchEvent('prev-number', {}, evnt)
    }

    const numberKeydownEvent = (evnt: KeyboardEvent) => {
      const isUpArrow = hasEventKey(evnt, EVENT_KEYS.ARROW_UP)
      const isDwArrow = hasEventKey(evnt, EVENT_KEYS.ARROW_DOWN)
      if (isUpArrow || isDwArrow) {
        evnt.preventDefault()
        if (isUpArrow) {
          numberPrevEvent(evnt)
        } else {
          numberNextEvent(evnt)
        }
      }
    }

    const keydownEvent = (evnt: KeyboardEvent & { type: 'keydown' }) => {
      const { exponential, controls } = props
      const isNumType = computeIsNumType.value
      if (isNumType) {
        const isCtrlKey = evnt.ctrlKey
        const isShiftKey = evnt.shiftKey
        const isAltKey = evnt.altKey
        const keyCode = evnt.keyCode
        if (!isCtrlKey && !isShiftKey && !isAltKey && (hasEventKey(evnt, EVENT_KEYS.SPACEBAR) || ((!exponential || keyCode !== 69) && (keyCode >= 65 && keyCode <= 90)) || (keyCode >= 186 && keyCode <= 188) || keyCode >= 191)) {
          evnt.preventDefault()
        }
        if (controls) {
          numberKeydownEvent(evnt)
        }
      }
      triggerEvent(evnt)
    }

    const keyupEvent = (evnt: KeyboardEvent & { type: 'keyup' }) => {
      triggerEvent(evnt)
    }

    // 数值

    const numberStopDown = () => {
      clearTimeout(downbumTimeout)
    }

    const numberDownPrevEvent = (evnt: Event) => {
      downbumTimeout = window.setTimeout(() => {
        numberPrevEvent(evnt)
        numberDownPrevEvent(evnt)
      }, 60)
    }

    const numberMousedownEvent = (evnt: MouseEvent) => {
      numberStopDown()
      if (evnt.button === 0) {
        const isPrevNumber = hasClass(evnt.currentTarget, 'is--prev')
        if (isPrevNumber) {
          numberPrevEvent(evnt)
        } else {
          numberNextEvent(evnt)
        }
        downbumTimeout = window.setTimeout(() => {
          if (isPrevNumber) {
            numberDownPrevEvent(evnt)
          } else {
            numberDownNextEvent(evnt)
          }
        }, 500)
      }
    }

    const wheelEvent = (evnt: WheelEvent & {
      type: 'wheel';
      wheelDelta: number;
    }) => {
      const isNumType = computeIsNumType.value
      if (isNumType && props.controls) {
        if (reactData.isActivated) {
          const delta = evnt.deltaY
          if (delta > 0) {
            numberNextEvent(evnt)
          } else if (delta < 0) {
            numberPrevEvent(evnt)
          }
          evnt.preventDefault()
        }
      }
      triggerEvent(evnt)
    }

    // 弹出面板
    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      return nextTick().then(() => {
        const { transfer, placement } = props
        const { panelIndex } = reactData
        const targetElem = refInputTarget.value
        const panelElem = refInputPanel.value
        if (targetElem && panelElem) {
          const targetHeight = targetElem.offsetHeight
          const targetWidth = targetElem.offsetWidth
          const panelHeight = panelElem.offsetHeight
          const panelWidth = panelElem.offsetWidth
          const marginSize = 5
          const panelStyle: VNodeStyle = {
            zIndex: panelIndex
          }
          const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = getAbsolutePos(targetElem)
          let panelPlacement: VmaInputPropTypes.Placement = 'bottom'
          if (transfer) {
            let left = boundingLeft
            let top = boundingTop + targetHeight
            if (placement === 'top') {
              panelPlacement = 'top'
              top = boundingTop - panelHeight
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (top + panelHeight + marginSize > visibleHeight) {
                panelPlacement = 'top'
                top = boundingTop - panelHeight
              }
              // 如果上面不够放，则向下（优先）
              if (top < marginSize) {
                panelPlacement = 'bottom'
                top = boundingTop + targetHeight
              }
            }
            // 如果溢出右边
            if (left + panelWidth + marginSize > visibleWidth) {
              left -= left + panelWidth + marginSize - visibleWidth
            }
            // 如果溢出左边
            if (left < marginSize) {
              left = marginSize
            }
            Object.assign(panelStyle, {
              left: `${left}px`,
              top: `${top}px`,
              minWidth: `${targetWidth}px`
            })
          } else {
            if (placement === 'top') {
              panelPlacement = 'top'
              panelStyle.bottom = `${targetHeight}px`
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                // 如果上面不够放，则向下（优先）
                if (boundingTop - targetHeight - panelHeight > marginSize) {
                  panelPlacement = 'top'
                  panelStyle.bottom = `${targetHeight}px`
                }
              }
            }
          }
          reactData.panelStyle = panelStyle
          reactData.panelPlacement = panelPlacement
          return nextTick()
        }
      })
    }

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    // 弹出面板

    // 全局事件
    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel, isActivated } = reactData
      const el = refElem.value
      const panelElem = refInputPanel.value
      if (!disabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (!reactData.isActivated) {
            afterCheckValue()
        }
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { clearable, disabled } = props
      const { visiblePanel } = reactData
      if (!disabled) {
        const isTab = hasEventKey(evnt, EVENT_KEYS.TAB)
        const isDel = hasEventKey(evnt, EVENT_KEYS.DELETE)
        const isEsc = hasEventKey(evnt, EVENT_KEYS.ESCAPE)
        const isEnter = hasEventKey(evnt, EVENT_KEYS.ENTER)
        const isLeftArrow = hasEventKey(evnt, EVENT_KEYS.ARROW_LEFT)
        const isUpArrow = hasEventKey(evnt, EVENT_KEYS.ARROW_UP)
        const isRightArrow = hasEventKey(evnt, EVENT_KEYS.ARROW_RIGHT)
        const isDwArrow = hasEventKey(evnt, EVENT_KEYS.ARROW_DOWN)
        const isPgUp = hasEventKey(evnt, EVENT_KEYS.PAGE_UP)
        const isPgDn = hasEventKey(evnt, EVENT_KEYS.PAGE_DOWN)
        const operArrow = isLeftArrow || isUpArrow || isRightArrow || isDwArrow
        let isActivated = reactData.isActivated
        if (isTab) {
          if (isActivated) {
            afterCheckValue()
          }
          isActivated = false
          reactData.isActivated = isActivated
        } else if (operArrow) {
        } else if (isEnter) {
        } else if (isPgUp || isPgDn) {
        }
        if (isTab || isEsc) {
          if (visiblePanel) {
          }
        } else if (isDel && clearable) {
          if (isActivated) {
            clearValueEvent(evnt, null)
          }
        }
      }
    }

    const handleGlobalMousewheelEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel } = reactData
      if (!disabled) {
        if (visiblePanel) {
          const panelElem = refInputPanel.value
          if (getEventTargetNode(evnt, panelElem).flag) {
            updatePlacement()
          } else {
            afterCheckValue()
          }
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      const { isActivated } = reactData
      if (isActivated) {
        afterCheckValue()
      }
    }


    const renderPanel = () => {
      return null
    }

    const renderNumberIcon = () => {
      const isDisabledAddNumber = computeIsDisabledAddNumber.value
      const isDisabledSubtractNumber = computeIsDisabledSubtractNumber.value
      return h('span', {
        class: 'vma-input--number-suffix'
      }, [
        h('span', {
          class: ['vma-input--number-prev is--prev', {
            'is--disabled': isDisabledAddNumber
          }],
          onMousedown: numberMousedownEvent,
          onMouseup: numberStopDown,
          onMouseleave: numberStopDown
        }, [
          h('i', {
            class: ['vma-input--number-prev-icon', GlobalConfig.icon.INPUT_PREV_NUM]
          })
        ]),
        h('span', {
          class: ['vma-input--number-next is--next', {
            'is--disabled': isDisabledSubtractNumber
          }],
          onMousedown: numberMousedownEvent,
          onMouseup: numberStopDown,
          onMouseleave: numberStopDown
        }, [
          h('i', {
            class: ['vma-input--number-next-icon', GlobalConfig.icon.INPUT_NEXT_NUM]
          })
        ])
      ])
    }

    const renderSearchIcon = () => {
      return h('span', {
        class: 'vma-input--search-suffix',
        onClick: searchEvent
      }, [
        h('i', {
          class: ['vma-input--search-icon', GlobalConfig.icon.INPUT_SEARCH]
        })
      ])
    }

    const renderPasswordIcon = () => {
      const { showPwd } = reactData
      return h('span', {
        class: 'vma-input--password-suffix',
        onClick: passwordToggleEvent
      }, [
        h('i', {
          class: ['vma-input--password-icon', showPwd ? GlobalConfig.icon.INPUT_SHOW_PWD : GlobalConfig.icon.INPUT_PWD]
        })
      ])
    }

    const rendePrefixIcon = () => {
      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      const icons = []
      if (prefixSlot) {
        icons.push(
          h('span', {
            class: 'vma-input--prefix-icon'
          }, prefixSlot({}))
        )
      } else if (prefixIcon) {
        icons.push(
          h('i', {
            class: ['vma-input--prefix-icon', prefixIcon]
          })
        )
      }
      return icons.length ? h('span', {
        class: 'vma-input--prefix',
        onClick: clickPrefixEvent
      }, icons) : null
    }

    const renderSuffixIcon = () => {
      const { disabled, suffixIcon } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isClearable = computeIsClearable.value
      const icons = []
      if (suffixSlot) {
        icons.push(
          h('span', {
            class: 'vma-input--suffix-icon'
          }, suffixSlot({}))
        )
      } else if (suffixIcon) {
        icons.push(
          h('i', {
            class: ['vma-input--suffix-icon', suffixIcon]
          })
        )
      }
      if (isClearable) {
        icons.push(
          h('i', {
            class: ['vma-input--clear-icon', GlobalConfig.icon.INPUT_CLEAR]
          })
        )
      }
      return icons.length ? h('span', {
        class: ['vma-input--suffix', {
          'is--clear': isClearable && !disabled && !(inputValue === '' || eqNull(inputValue))
        }],
        onClick: clickSuffixEvent
      }, icons) : null
    }

    const renderExtraSuffixIcon = () => {
      const { controls } = props
      const isNumType = computeIsNumType.value
      const isPawdType = computeIsPawdType.value
      const isSearchType = computeIsSearchType.value
      let icons
      if (isPawdType) {
        icons = renderPasswordIcon()
      } else if (isNumType) {
        if (controls) {
          icons = renderNumberIcon()
        }
      } else if (isSearchType) {
        icons = renderSearchIcon()
      }
      return icons ? h('span', {
        class: 'vma-input--extra-suffix'
      }, [icons]) : null
    }

    inputMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, Object.assign({ $input: $xeinput, $event: evnt }, params))
      },

      focus () {
        const inputElem = refInputTarget.value
        reactData.isActivated = true
        inputElem.focus()
        return nextTick()
      },
      blur () {
        const inputElem = refInputTarget.value
        inputElem.blur()
        reactData.isActivated = false
        return nextTick()
      },
      updatePlacement
    }

    Object.assign($xeinput, inputMethods)

    watch(() => props.modelValue, (val) => {
      reactData.inputValue = val
      changeValue()
    })

    watch(() => props.type, () => {
      // 切换类型是重置内置变量
      Object.assign(reactData, {
        inputValue: props.modelValue,
        datetimePanelValue: null,
        datePanelValue: null,
        datePanelLabel: '',
        datePanelType: 'day',
        selectMonth: null,
        currentDate: null
      })
      initValue()
    })

    nextTick(() => {
      GlobalEvent.on($xeinput, 'mousewheel', handleGlobalMousewheelEvent)
      GlobalEvent.on($xeinput, 'mousedown', handleGlobalMousedownEvent)
      GlobalEvent.on($xeinput, 'keydown', handleGlobalKeydownEvent)
      GlobalEvent.on($xeinput, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      numberStopDown()
      GlobalEvent.off($xeinput, 'mousewheel')
      GlobalEvent.off($xeinput, 'mousedown')
      GlobalEvent.off($xeinput, 'keydown')
      GlobalEvent.off($xeinput, 'blur')
    })

    initValue()

    const renderVN = () => {
      const { className, controls, type, align, name, disabled, readonly, autocomplete } = props
      const { inputValue, visiblePanel, isActivated } = reactData
      const vSize = computeSize.value
      const inpReadonly = computeInpReadonly.value
      const inpMaxlength = computeInpMaxlength.value
      const inputType = computeInputType.value
      const inpPlaceholder = computeInpPlaceholder.value
      const childs = []
      const prefix = rendePrefixIcon()
      const suffix = renderSuffixIcon()
      // 前缀图标
      if (prefix) {
        childs.push(prefix)
      }
      // 输入框
      childs.push(
        h('input', {
          ref: refInputTarget,
          class: 'vma-input--inner',
          value: inputValue,
          name,
          type: inputType,
          placeholder: inpPlaceholder,
          maxlength: inpMaxlength,
          readonly: inpReadonly,
          disabled,
          autocomplete,
          onKeydown: keydownEvent,
          onKeyup: keyupEvent,
          onWheel: wheelEvent,
          onClick: clickEvent,
          onInput: inputEvent,
          onChange: changeEvent,
          onFocus: focusEvent,
          onBlur: blurEvent
        })
      )
      // 后缀图标
      if (suffix) {
        childs.push(suffix)
      }
      // 特殊功能图标
      childs.push(renderExtraSuffixIcon())
      return h('div', {
        ref: refElem,
        class: ['vma-input', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--controls': controls,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--readonly': readonly,
          'is--visivle': visiblePanel,
          'is--disabled': disabled,
          'is--active': isActivated
        }]
      }, childs)
    }

    $xeinput.renderVN = renderVN

    return $xeinput
  },
  render () {
    return this.renderVN()
  }
})
