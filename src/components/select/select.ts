import { provide, defineComponent, h, PropType, Teleport, ref, Ref, resolveComponent, ComponentOptions, reactive, computed, nextTick, onUnmounted, watch } from 'vue';
import { Guid } from '../../utils/guid';
import {
    VmaFormulaGridCompSelectConstructor,
    VmaFormulaGridCompSelectEmits,
    VmaFormulaGridCompSelectMethods,
    VmaFormulaGridCompSelectPrivateMethods,
    VmaFormulaGridCompSelectPrivateRef,
    VmaFormulaGridCompSelectPropTypes,
    VmaFormulaGridCompSelectReactiveData,
} from '../../../types';
import { VmaFormulaGridCompGlobalRendererHandles } from '../../../types';
import { DomTools } from '../../utils/doms';
import GlobalEvent from '../../utils/events';
import { getLastZIndex, nextZIndex, toNumber, toString } from '../../utils';

export default defineComponent({
    name: 'VmaFormulaGridCompSelect',
    props: {
        modelValue: null,
        disabled: Boolean,
        clearable: Boolean,
        multiple: Boolean,
        placeholder: String,
        prefixIcon: String,
        placement: String,
        emptyText: String,
        multiCharOverflow: { type: [Number, String] },
        options: Array as PropType<any[]>,
        optionProps: Object as PropType<VmaFormulaGridCompGlobalRendererHandles.RenderOptionProps>,
        optionGroups: Array as PropType<any[]>,
        optionGroupProps: Object as PropType<VmaFormulaGridCompGlobalRendererHandles.RenderOptionGroupProps>,
        optionId: String,
        size: {
            type: String as PropType<VmaFormulaGridCompSelectPropTypes.Size>,
            default: 'normal',
        },
        type: {
            type: String,
            default: 'text',
        },
        transfer: { type: Boolean, default: false },
        optionKey: Boolean,
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emits: ['update:modelValue', 'change', 'clear'] as VmaFormulaGridCompSelectEmits,
    setup(props, context) {
        const { emit } = context;

        const InputComponent = resolveComponent('VmaFormulaGridCompInput') as ComponentOptions;

        const refSelect = ref() as Ref<HTMLDivElement>;
        const refOptionWrapper = ref() as Ref<HTMLDivElement>;
        const refOptionPanel = ref() as Ref<HTMLDivElement>;

        const reactiveData = reactive({
            initiated: false,
            staticOptions: [],
            fullGroupList: [],
            fullOptionList: [],
            visibleGroupList: [],
            visibleOptionList: [],
            panelIndex: 999,
            panelStyle: {},
            panelPlacement: null,
            currentValue: null,
            visiblePanel: false,
            animateVisible: false,
            isActivated: false,
        } as VmaFormulaGridCompSelectReactiveData);

        const selectRefs: VmaFormulaGridCompSelectPrivateRef = {
            refSelect,
        };

        const $vmaFormulaGridCompSelect = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData: reactiveData,
            getRefMaps: () => selectRefs,
        } as unknown as VmaFormulaGridCompSelectConstructor;

        const computeMultiMaxCharNum = computed(() => {
            return toNumber(props.multiCharOverflow);
        });

        const getOptkey = () => {
            return props.optionId || '_XID';
        };

        const getOptid = (option: any) => {
            const optid = option[getOptkey()];
            return optid ? encodeURIComponent(optid) : '';
        };

        const computeIsGroup = computed(() => {
            return reactiveData.fullGroupList.some((item) => item.options && item.options.length);
        });

        const computePropsOpts = computed(() => {
            return props.optionProps;
        });

        const computeValueField = computed(() => {
            const propsOpts = computePropsOpts.value;
            return propsOpts ? propsOpts.value || 'value' : 'value';
        });

        const computeLabelField = computed(() => {
            const propsOpts = computePropsOpts.value;
            return propsOpts ? propsOpts.label || 'label' : 'value';
        });

        const setCurrentOption = (option: any) => {
            const valueField = computeValueField.value;
            if (option) {
                reactiveData.currentValue = option[valueField];
            }
        };

        const computeGroupPropsOpts = computed(() => {
            return props.optionGroupProps;
        });

        const computeGroupLabelField = computed(() => {
            const groupPropsOpts = computeGroupPropsOpts.value;
            return groupPropsOpts ? groupPropsOpts.label || 'label' : 'label';
        });

        const computeGroupOptionsField = computed(() => {
            const groupPropsOpts = computeGroupPropsOpts.value;
            return groupPropsOpts ? groupPropsOpts.options || 'options' : 'options';
        });

        const findOption = (optionValue: any) => {
            const { fullOptionList, fullGroupList } = reactiveData;
            const isGroup = computeIsGroup.value;
            const valueField = computeValueField.value;
            if (isGroup) {
                for (let gIndex = 0; gIndex < fullGroupList.length; gIndex++) {
                    const group = fullGroupList[gIndex];
                    if (group.options) {
                        for (let index = 0; index < group.options.length; index++) {
                            const option = group.options[index];
                            if (optionValue === option[valueField]) {
                                return option;
                            }
                        }
                    }
                }
            }
            return fullOptionList.find((item: any) => optionValue === item[valueField]);
        };

        const getSelectLabel = (value: any) => {
            const labelField = computeLabelField.value;
            const item = findOption(value);
            return toString(item ? item[labelField] : value);
        };

        const computeSelectLabel = computed(() => {
            const { modelValue, multiple } = props;
            const multiMaxCharNum = computeMultiMaxCharNum.value;

            if (modelValue && multiple) {
                return modelValue
                    .map((val: any) => {
                        const label = getSelectLabel(val);
                        if (multiMaxCharNum > 0 && label.length > multiMaxCharNum) {
                            return `${label.substring(0, multiMaxCharNum)}...`;
                        }
                        return label;
                    })
                    .join(', ');
            }
            return getSelectLabel(modelValue);
        });

        const vmaSelectMethods: VmaFormulaGridCompSelectMethods = {
            dispatchEvent(type, params, evnt) {
                emit(type, Object.assign({ $select: $vmaFormulaGridCompSelect, $event: evnt }, params));
            },
        };

        const isOptionVisible = (option: any) => {
            return option.visible !== false;
        };

        const scrollToOption = (option: any, isAlignBottom?: any) => {
            return nextTick().then(() => {
                if (option) {
                    const optWrapperElem = refOptionWrapper.value;
                    const panelElem = refOptionPanel.value;
                    const optElem = panelElem.querySelector(`[optid='${getOptid(option)}']`) as HTMLElement;
                    if (optWrapperElem && optElem) {
                        const wrapperHeight = optWrapperElem.offsetHeight;
                        const offsetPadding = 5;
                        if (isAlignBottom) {
                            if (optElem.offsetTop + optElem.offsetHeight - optWrapperElem.scrollTop > wrapperHeight) {
                                optWrapperElem.scrollTop = optElem.offsetTop + optElem.offsetHeight - wrapperHeight;
                            }
                        } else {
                            if (
                                optElem.offsetTop + offsetPadding < optWrapperElem.scrollTop ||
                                optElem.offsetTop + offsetPadding > optWrapperElem.scrollTop + optWrapperElem.clientHeight
                            ) {
                                optWrapperElem.scrollTop = optElem.offsetTop - offsetPadding;
                            }
                        }
                    }
                }
            });
        };

        const updatePlacement = () => {
            return nextTick().then(() => {
                const { transfer, placement } = props;
                const { panelIndex } = reactiveData;
                const el = refSelect.value;
                const panelElem = refOptionPanel.value;
                if (panelElem && el) {
                    const targetHeight = el.offsetHeight;
                    const targetWidth = el.offsetWidth;
                    const panelHeight = panelElem.offsetHeight;
                    const panelWidth = panelElem.offsetWidth;
                    const marginSize = 5;
                    const panelStyle: { [key: string]: any } = {
                        zIndex: panelIndex,
                    };
                    const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = DomTools.getAbsolutePos(el);
                    let panelPlacement = 'bottom';
                    if (transfer) {
                        let left = boundingLeft;
                        let top = boundingTop + targetHeight;
                        if (placement === 'top') {
                            panelPlacement = 'top';
                            top = boundingTop - panelHeight;
                        } else if (!placement) {
                            // 如果下面不够放，则向上
                            if (top + panelHeight + marginSize > Number(visibleHeight)) {
                                panelPlacement = 'top';
                                top = boundingTop - panelHeight;
                            }
                            // 如果上面不够放，则向下（优先）
                            if (top < marginSize) {
                                panelPlacement = 'bottom';
                                top = boundingTop + targetHeight;
                            }
                        }
                        // 如果溢出右边
                        if (left + panelWidth + marginSize > Number(visibleWidth)) {
                            left -= left + panelWidth + marginSize - Number(visibleWidth);
                        }
                        // 如果溢出左边
                        if (left < marginSize) {
                            left = marginSize;
                        }
                        Object.assign(panelStyle, {
                            left: `${left}px`,
                            top: `${top}px`,
                            minWidth: `${targetWidth}px`,
                        });
                    } else {
                        if (placement === 'top') {
                            panelPlacement = 'top';
                            panelStyle.bottom = `${targetHeight}px`;
                        } else if (!placement) {
                            // 如果下面不够放，则向上
                            if (boundingTop + targetHeight + panelHeight > Number(visibleHeight)) {
                                // 如果上面不够放，则向下（优先）
                                if (boundingTop - targetHeight - panelHeight > marginSize) {
                                    panelPlacement = 'top';
                                    panelStyle.bottom = `${targetHeight}px`;
                                }
                            }
                        }
                    }
                    reactiveData.panelStyle = panelStyle;
                    reactiveData.panelPlacement = panelPlacement;
                    return nextTick();
                }
            });
        };

        let hidePanelTimeout: number;

        const hideOptionPanel = () => {
            reactiveData.visiblePanel = false;
            hidePanelTimeout = window.setTimeout(() => {
                reactiveData.animateVisible = false;
            }, 350);
        };

        const showOptionPanel = () => {
            if (!props.disabled) {
                clearTimeout(hidePanelTimeout);
                if (!reactiveData.initiated) {
                    reactiveData.initiated = true;
                }
                reactiveData.isActivated = true;
                reactiveData.animateVisible = true;
                setTimeout(() => {
                    const { modelValue, multiple } = props;
                    const currOption = findOption(multiple && modelValue ? modelValue[0] : modelValue);
                    reactiveData.visiblePanel = true;
                    if (currOption) {
                        setCurrentOption(currOption);
                        scrollToOption(currOption);
                    }
                }, 10);
                updateZIndex();
                updatePlacement();
            }
        };

        const updateZIndex = () => {
            if (reactiveData.panelIndex < getLastZIndex()) {
                reactiveData.panelIndex = nextZIndex();
            }
        };

        const findOffsetOption = (optionValue: any, isUpArrow: any) => {
            const { visibleOptionList, visibleGroupList } = reactiveData;
            const isGroup = computeIsGroup.value;
            const valueField = computeValueField.value;
            const groupOptionsField = computeGroupOptionsField.value;
            let firstOption;
            let prevOption;
            let nextOption;
            let currOption;
            if (isGroup) {
                for (let gIndex = 0; gIndex < visibleGroupList.length; gIndex++) {
                    const group = visibleGroupList[gIndex];
                    const groupOptionList = group[groupOptionsField];
                    const isGroupDisabled = group.disabled;
                    if (groupOptionList) {
                        for (let index = 0; index < groupOptionList.length; index++) {
                            const option = groupOptionList[index];
                            const isVisible = isOptionVisible(option);
                            const isDisabled = isGroupDisabled || option.disabled;
                            if (!firstOption && !isDisabled) {
                                firstOption = option;
                            }
                            if (currOption) {
                                if (isVisible && !isDisabled) {
                                    nextOption = option;
                                    if (!isUpArrow) {
                                        return { offsetOption: nextOption };
                                    }
                                }
                            }
                            if (optionValue === option[valueField]) {
                                currOption = option;
                                if (isUpArrow) {
                                    return { offsetOption: prevOption };
                                }
                            } else {
                                if (isVisible && !isDisabled) {
                                    prevOption = option;
                                }
                            }
                        }
                    }
                }
            } else {
                for (let index = 0; index < visibleOptionList.length; index++) {
                    const option = visibleOptionList[index];
                    const isDisabled = option.disabled;
                    if (!firstOption && !isDisabled) {
                        firstOption = option;
                    }
                    if (currOption) {
                        if (!isDisabled) {
                            nextOption = option;
                            if (!isUpArrow) {
                                return { offsetOption: nextOption };
                            }
                        }
                    }
                    if (optionValue === option[valueField]) {
                        currOption = option;
                        if (isUpArrow) {
                            return { offsetOption: prevOption };
                        }
                    } else {
                        if (!isDisabled) {
                            prevOption = option;
                        }
                    }
                }
            }
            return { firstOption };
        };

        const focusEvent = () => {
            if (!props.disabled) {
                reactiveData.isActivated = true;
            }
        };

        const blurEvent = () => {
            reactiveData.isActivated = false;
        };

        const togglePanelEvent = (params: any) => {
            const { $event } = params;
            $event.preventDefault();
            if (reactiveData.visiblePanel) {
                hideOptionPanel();
            } else {
                showOptionPanel();
            }
        };

        const changeEvent = (evnt: Event, selectValue: any) => {
            if (selectValue !== props.modelValue) {
                emit('update:modelValue', selectValue);
                vmaSelectMethods.dispatchEvent('change', { value: selectValue }, evnt);
            }
        };

        const clearValueEvent = (evnt: Event, selectValue: any) => {
            changeEvent(evnt, selectValue);
            vmaSelectMethods.dispatchEvent('clear', { value: selectValue }, evnt);
        };

        const handleGlobalMousewheelEvent = (evnt: any) => {
            const { disabled } = props;
            const { visiblePanel } = reactiveData;
            if (!disabled) {
                if (visiblePanel) {
                    const panelElem = refOptionPanel.value;
                    if (DomTools.getEventTargetNode(evnt, panelElem).flag) {
                        updatePlacement();
                    } else {
                        hideOptionPanel();
                    }
                }
            }
        };

        const handleGlobalMousedownEvent = (evnt: any) => {
            const { disabled } = props;
            const { visiblePanel } = reactiveData;
            if (!disabled) {
                const el = refSelect.value;
                const panelElem = refOptionPanel.value;
                reactiveData.isActivated = DomTools.getEventTargetNode(evnt, el).flag || DomTools.getEventTargetNode(evnt, panelElem).flag;
                if (visiblePanel && !reactiveData.isActivated) {
                    hideOptionPanel();
                }
            }
        };

        const changeOptionEvent = (evnt: any, selectValue: any) => {
            const { modelValue, multiple } = props;
            if (multiple) {
                let multipleValue;
                if (modelValue) {
                    if (modelValue.indexOf(selectValue) === -1) {
                        multipleValue = modelValue.concat([selectValue]);
                    } else {
                        multipleValue = modelValue.filter((val: any) => val !== selectValue);
                    }
                } else {
                    multipleValue = [selectValue];
                }
                changeEvent(evnt, multipleValue);
            } else {
                changeEvent(evnt, selectValue);
                hideOptionPanel();
            }
        };

        const renderOption = (list: any, group?: any) => {
            const { optionKey, modelValue, multiple } = props;
            const { currentValue } = reactiveData;
            const labelField = computeLabelField.value;
            const valueField = computeValueField.value;
            const isGroup = computeIsGroup.value;
            return list.map((option: any, cIndex: any) => {
                const isVisible = !isGroup || isOptionVisible(option);
                const isDisabled = (group && group.disabled) || option.disabled;
                const optionValue = option[valueField];
                const optid = getOptid(option);
                return isVisible
                    ? h(
                          'div',
                          {
                              key: optionKey ? optid : cIndex,
                              class: [
                                  'vma-formula-grid-select-option',
                                  {
                                      'is--disabled': isDisabled,
                                      'is--selected': multiple ? modelValue && modelValue.indexOf(optionValue) > -1 : modelValue === optionValue,
                                      'is--hover': currentValue === optionValue,
                                  },
                              ],
                              // attrs
                              optid: optid,
                              // event
                              onClick: (evnt: any) => {
                                  if (!isDisabled) {
                                      changeOptionEvent(evnt, optionValue);
                                  }
                              },
                              onMouseenter: () => {
                                  if (!isDisabled) {
                                      setCurrentOption(option);
                                  }
                              },
                          },
                          option[labelField],
                      )
                    : null;
            });
        };

        const renderOptgroup = () => {
            const { optionKey } = props;
            const { visibleGroupList } = reactiveData;
            const groupLabelField = computeGroupLabelField.value;
            const groupOptionsField = computeGroupOptionsField.value;
            return visibleGroupList.map((group: any, gIndex: any) => {
                const optid = getOptid(group);
                const isGroupDisabled = group.disabled;
                return h(
                    'div',
                    {
                        key: optionKey ? optid : gIndex,
                        class: [
                            'vma-formula-grid-optgroup',
                            {
                                'is--disabled': isGroupDisabled,
                            },
                        ],
                        // attrs
                        optid: optid,
                    },
                    [
                        h(
                            'div',
                            {
                                class: 'vma-formula-grid-optgroup--title',
                            },
                            group[groupLabelField],
                        ),
                        h(
                            'div',
                            {
                                class: 'vma-formula-grid-optgroup--wrapper',
                            },
                            renderOption(group[groupOptionsField], group),
                        ),
                    ],
                );
            });
        };

        const renderOpts = () => {
            const { visibleGroupList, visibleOptionList } = reactiveData;
            const isGroup = computeIsGroup.value;
            if (isGroup) {
                if (visibleGroupList.length) {
                    return renderOptgroup();
                }
            } else {
                if (visibleOptionList.length) {
                    return renderOption(visibleOptionList);
                }
            }
            return [
                h(
                    'div',
                    {
                        class: 'vma-formula-grid-select--empty-placeholder',
                    },
                    props.emptyText || '暂无数据',
                ),
            ];
        };

        /**
         * 刷新选项，当选项被动态显示/隐藏时可能会用到
         */
        const refreshOption = () => {
            const { fullOptionList, fullGroupList } = reactiveData;
            const isGroup = computeIsGroup.value;
            if (isGroup) {
                reactiveData.visibleGroupList = fullGroupList.filter(isOptionVisible);
            } else {
                reactiveData.visibleOptionList = fullOptionList.filter(isOptionVisible);
            }
            return nextTick();
        };

        const updateCache = () => {
            const { fullOptionList, fullGroupList } = reactiveData;
            const groupOptionsField = computeGroupOptionsField.value;
            const key = getOptkey();
            const handleOptis = (item: any) => {
                if (!getOptid(item)) {
                    item[key] = Guid.create().toString();
                }
            };
            if (fullGroupList.length) {
                fullGroupList.forEach((group: any) => {
                    handleOptis(group);
                    if (group[groupOptionsField]) {
                        group[groupOptionsField].forEach(handleOptis);
                    }
                });
            } else if (fullOptionList.length) {
                fullOptionList.forEach(handleOptis);
            }
            refreshOption();
        };

        const handleGlobalKeydownEvent = (evnt: any) => {
            const { clearable, disabled } = props;
            const { visiblePanel, currentValue } = reactiveData;
            if (!disabled) {
                const keyCode = evnt.keyCode;
                const isTab = keyCode === 9;
                const isEnter = keyCode === 13;
                const isEsc = keyCode === 27;
                const isUpArrow = keyCode === 38;
                const isDwArrow = keyCode === 40;
                const isDel = keyCode === 46;
                const isSpacebar = keyCode === 32;
                if (isTab) {
                    reactiveData.isActivated = false;
                }
                if (visiblePanel) {
                    if (isEsc || isTab) {
                        hideOptionPanel();
                    } else if (isEnter) {
                        evnt.preventDefault();
                        evnt.stopPropagation();
                        changeOptionEvent(evnt, currentValue);
                    } else if (isUpArrow || isDwArrow) {
                        evnt.preventDefault();
                        let { offsetOption } = findOffsetOption(currentValue, isUpArrow);
                        const { firstOption } = findOffsetOption(currentValue, isUpArrow);
                        if (!offsetOption && !findOption(currentValue)) {
                            offsetOption = firstOption;
                        }
                        setCurrentOption(offsetOption);
                        scrollToOption(offsetOption, isDwArrow);
                    } else if (isSpacebar) {
                        evnt.preventDefault();
                    }
                } else if ((isUpArrow || isDwArrow || isEnter || isSpacebar) && reactiveData.isActivated) {
                    evnt.preventDefault();
                    showOptionPanel();
                }
                if (reactiveData.isActivated) {
                    if (isDel && clearable) {
                        clearValueEvent(evnt, null);
                    }
                }
            }
        };

        const handleGlobalBlurEvent = () => {
            hideOptionPanel();
        };

        const clearEvent = (params: any, evnt: any) => {
            clearValueEvent(evnt, null);
            hideOptionPanel();
        };

        const renderVN = () => {
            const { initiated, visiblePanel } = reactiveData;
            const { transfer, disabled } = props;
            const selectLabel = computeSelectLabel.value;
            return h(
                'div',
                {
                    ref: refSelect,
                    class: 'vma-formula-grid-select',
                },
                [
                    h(InputComponent, {
                        clearable: props.clearable,
                        placeholder: props.placeholder,
                        readonly: true,
                        prefixIcon: props.prefixIcon,
                        suffixIcon: visiblePanel ? 'angle-up' : 'angle-down',
                        size: props.size,
                        disabled: disabled,
                        modelValue: selectLabel,
                        onClear: clearEvent,
                        onClick: togglePanelEvent,
                        onFocus: focusEvent,
                        onBlur: blurEvent,
                        onSuffixClick: togglePanelEvent,
                    }),
                    h(Teleport, { to: 'body', disabled: transfer ? !initiated : true }, [
                        h(
                            'div',
                            {
                                ref: refOptionPanel,
                                class: [
                                    'vma-formula-grid-select--panel',
                                    'vma-formula-grid-select--' + props.size,
                                    {
                                        'is--transfer': transfer,
                                        'animate--leave': reactiveData.animateVisible,
                                        'animate--enter': visiblePanel,
                                    },
                                ],
                                placement: reactiveData.panelPlacement,
                                style: reactiveData.panelStyle,
                            },
                            initiated
                                ? [
                                      h(
                                          'div',
                                          {
                                              ref: refOptionWrapper,
                                              class: 'vma-formula-grid-select-option--wrapper',
                                          },
                                          renderOpts(),
                                      ),
                                  ]
                                : [],
                        ),
                    ]),
                ],
            );
        };

        Object.assign($vmaFormulaGridCompSelect, vmaSelectMethods);

        $vmaFormulaGridCompSelect.renderVN = renderVN;

        provide('$vmaFormulaGridCompSelect', $vmaFormulaGridCompSelect);

        watch(
            () => props.options,
            (value) => {
                reactiveData.fullGroupList = [];
                reactiveData.fullOptionList = value || [];
                updateCache();
            },
        );

        watch(
            () => props.optionGroups,
            (value) => {
                reactiveData.fullOptionList = [];
                reactiveData.fullGroupList = value || [];
                updateCache();
            },
        );

        nextTick(() => {
            const { options, optionGroups } = props;
            if (optionGroups) {
                reactiveData.fullGroupList = optionGroups;
            } else if (options) {
                reactiveData.fullOptionList = options;
            }
            updateCache();

            GlobalEvent.on($vmaFormulaGridCompSelect, 'mousewheel', handleGlobalMousewheelEvent);
            GlobalEvent.on($vmaFormulaGridCompSelect, 'mousedown', handleGlobalMousedownEvent);
            GlobalEvent.on($vmaFormulaGridCompSelect, 'keydown', handleGlobalKeydownEvent);
            GlobalEvent.on($vmaFormulaGridCompSelect, 'blur', handleGlobalBlurEvent);
        });

        onUnmounted(() => {
            GlobalEvent.off($vmaFormulaGridCompSelect, 'mousewheel');
            GlobalEvent.off($vmaFormulaGridCompSelect, 'mousedown');
            GlobalEvent.off($vmaFormulaGridCompSelect, 'keydown');
            GlobalEvent.off($vmaFormulaGridCompSelect, 'blur');
        });

        return $vmaFormulaGridCompSelect;
    },
    render() {
        return this.renderVN();
    },
});
