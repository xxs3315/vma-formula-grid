import { Guid } from '../../utils/guid.ts';
import {
    VmaFormulaGridCompContextMenuConstructor,
    VmaFormulaGridCompContextMenuPropTypes,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods,
} from '../../../types';
import { ComponentOptions, createCommentVNode, defineComponent, h, inject, PropType, provide, ref, resolveComponent, Teleport } from 'vue';
import { getDefaultFontSize } from '../../utils';

export default defineComponent({
    name: 'VmaFormulaGridCompContextMenu',
    props: {
        type: {
            type: String as PropType<VmaFormulaGridCompContextMenuPropTypes.Type>,
            default: 'default',
        },
        size: {
            type: String as PropType<VmaFormulaGridCompContextMenuPropTypes.Size>,
            default: 'normal',
        },
    },
    setup(props, context) {
        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const GridCompIconComponent = resolveComponent('VmaFormulaGridCompIcon') as ComponentOptions;
        const GridCompButtonComponent = resolveComponent('VmaFormulaGridCompButton') as ComponentOptions;
        const GridCompSelectComponent = resolveComponent('VmaFormulaGridCompSelect') as ComponentOptions;

        const { refGridContextMenu } = $vmaFormulaGrid.getRefs();

        const { ctxMenuStore } = $vmaFormulaGrid.reactiveData;

        const $vmaFormulaGridCompContextMenu = {
            uId: Guid.create().toString(),
            props,
            context,
        } as unknown as VmaFormulaGridCompContextMenuConstructor;

        const rendererSuffixComp = (comp: string, menu: any) => {
            console.log(comp, menu);
            return createCommentVNode();
        };

        let fontValue = ref('');
        let fontSizeValue = ref<number>();

        const renderVN = () =>
            h(
                Teleport,
                {
                    to: 'body',
                    disabled: false,
                },
                [
                    h(
                        'div',
                        {
                            ref: refGridContextMenu,
                            class: [
                                'vma-formula-grid-context-menu',
                                {
                                    'is--visible': ctxMenuStore.visible,
                                },
                            ],
                            style: ctxMenuStore.style,
                        },
                        ctxMenuStore.list.map((options: any, optionsIndex: any) =>
                            h(
                                'ul',
                                {
                                    class: 'group-wrapper',
                                    key: optionsIndex,
                                },
                                options.map((option: any, optionIndex: any) => {
                                    const hasChildMenus = (option.children && option.children.length) || (option.type && option.type === 'colorPicker');
                                    return !option.visible
                                        ? null
                                        : h(
                                              'li',
                                              {
                                                  class: [
                                                      {
                                                          'link--disabled': option.disabled,
                                                          'link--active': option === ctxMenuStore.selected,
                                                      },
                                                  ],
                                                  key: `${optionsIndex}_${optionIndex}`,
                                              },
                                              [
                                                  h(
                                                      'a',
                                                      {
                                                          class: 'link',
                                                          onClick(event: Event) {
                                                              if ($vmaFormulaGrid.ctxMenuLinkEvent) {
                                                                  $vmaFormulaGrid.ctxMenuLinkEvent(event, option);
                                                              }
                                                          },
                                                          onMouseover(event: Event) {
                                                              if ($vmaFormulaGrid.ctxMenuMouseoverEvent) {
                                                                  $vmaFormulaGrid.ctxMenuMouseoverEvent(event, option);
                                                              }
                                                          },
                                                          onMouseout(event: Event) {
                                                              if ($vmaFormulaGrid.ctxMenuMouseoutEvent) {
                                                                  $vmaFormulaGrid.ctxMenuMouseoutEvent(event, option);
                                                              }
                                                          },
                                                      },
                                                      [
                                                          h(
                                                              'i',
                                                              {
                                                                  class: ['link-prefix', option.prefixIcon],
                                                              },
                                                              option.prefixIcon
                                                                  ? h(GridCompIconComponent, {
                                                                        name: option.prefixIcon,
                                                                        size: 'mini',
                                                                        translateY: 1,
                                                                    })
                                                                  : createCommentVNode(),
                                                          ),
                                                          h(
                                                              'span',
                                                              {
                                                                  class: 'link-content',
                                                              },
                                                              option.name,
                                                          ),
                                                          h(
                                                              'i',
                                                              {
                                                                  class: ['link-suffix', hasChildMenus ? option.suffixIcon || 'angle-right' : option.suffixIcon],
                                                              },
                                                              [
                                                                  option.suffixComp ? rendererSuffixComp(option.suffixComp, option) : createCommentVNode(),
                                                                  hasChildMenus
                                                                      ? h(GridCompIconComponent, {
                                                                            name: option.suffixIcon || 'angle-right',
                                                                            size: 'mini',
                                                                            translateY: 1,
                                                                        })
                                                                      : option.suffixIcon
                                                                      ? h(GridCompIconComponent, {
                                                                            name: option.suffixIcon,
                                                                            size: 'mini',
                                                                            translateY: 1,
                                                                        })
                                                                      : createCommentVNode(),
                                                              ],
                                                          ),
                                                      ],
                                                  ),
                                                  hasChildMenus && !(option.type && option.type === 'colorPicker')
                                                      ? h(
                                                            'ul',
                                                            {
                                                                class: [
                                                                    'sub-group-wrapper',
                                                                    {
                                                                        'is--show': option === ctxMenuStore.selected,
                                                                    },
                                                                ],
                                                            },
                                                            option.children.map((child: any, cIndex: any) => {
                                                                if (child.type === 'fontSelect') {
                                                                    return child.visible
                                                                        ? h(
                                                                              'li',
                                                                              {
                                                                                  class: [
                                                                                      {
                                                                                          'link--disabled': child.disabled,
                                                                                          'link--active': child === ctxMenuStore.selectChild,
                                                                                      },
                                                                                  ],
                                                                                  key: `${optionsIndex}_${optionIndex}_${cIndex}`,
                                                                              },
                                                                              h(
                                                                                  'a',
                                                                                  {
                                                                                      class: 'link',
                                                                                  },
                                                                                  [
                                                                                      h(
                                                                                          'i',
                                                                                          {
                                                                                              class: ['link-prefix', child.prefixIcon],
                                                                                          },
                                                                                          child.prefixIcon
                                                                                              ? h(GridCompIconComponent, {
                                                                                                    name: child.prefixIcon,
                                                                                                    size: 'mini',
                                                                                                    translateY: 1,
                                                                                                })
                                                                                              : createCommentVNode(),
                                                                                      ),
                                                                                      h(GridCompSelectComponent, {
                                                                                          size: 'mini',
                                                                                          modelValue: fontValue.value,
                                                                                          'onUpdate:modelValue': (value: any) => {
                                                                                              fontValue.value = value;
                                                                                          },
                                                                                          options: $vmaFormulaGrid.reactiveData.supportedFonts.map((font: any) => {
                                                                                              return {
                                                                                                  value: font.en,
                                                                                                  label: font.ch,
                                                                                                  disabled: false,
                                                                                              };
                                                                                          }),
                                                                                          onChange: (event: any) => {
                                                                                              $vmaFormulaGrid.setFontStyle('cells', 'fontSelect', event.value);
                                                                                          },
                                                                                      }),
                                                                                      h('i', {
                                                                                          class: ['link-suffix', option.suffixIcon],
                                                                                      }),
                                                                                  ],
                                                                              ),
                                                                          )
                                                                        : null;
                                                                } else if (child.type === 'fontSizeSelect') {
                                                                    return child.visible
                                                                        ? h(
                                                                              'li',
                                                                              {
                                                                                  class: [
                                                                                      {
                                                                                          'link--disabled': child.disabled,
                                                                                          'link--active': child === ctxMenuStore.selectChild,
                                                                                      },
                                                                                  ],
                                                                                  key: `${optionsIndex}_${optionIndex}_${cIndex}`,
                                                                              },
                                                                              h(
                                                                                  'a',
                                                                                  {
                                                                                      class: 'link',
                                                                                  },
                                                                                  [
                                                                                      h(
                                                                                          'i',
                                                                                          {
                                                                                              class: ['link-prefix', child.prefixIcon],
                                                                                          },
                                                                                          child.prefixIcon
                                                                                              ? h(GridCompIconComponent, {
                                                                                                    name: child.prefixIcon,
                                                                                                    size: 'mini',
                                                                                                    translateY: 1,
                                                                                                })
                                                                                              : createCommentVNode(),
                                                                                      ),
                                                                                      h(
                                                                                          'div',
                                                                                          {
                                                                                              style: {
                                                                                                  display: 'flex',
                                                                                                  alignItems: 'center',
                                                                                                  justifyContent: 'center',
                                                                                                  flexWrap: 'nowrap',
                                                                                              },
                                                                                          },
                                                                                          [
                                                                                              h(GridCompSelectComponent, {
                                                                                                  modelValue: fontSizeValue.value,
                                                                                                  'onUpdate:modelValue': (value: any) => {
                                                                                                      fontSizeValue.value = Number(value);
                                                                                                  },
                                                                                                  size: 'mini',
                                                                                                  style: {
                                                                                                      width: '100px',
                                                                                                      flex: '0 1 auto',
                                                                                                  },
                                                                                                  options: $vmaFormulaGrid.reactiveData.supportedFontSizes.map((fontSize: any) => {
                                                                                                      return {
                                                                                                          value: fontSize,
                                                                                                          label: fontSize,
                                                                                                          disabled: false,
                                                                                                      };
                                                                                                  }),
                                                                                                  onChange: (event: any) => {
                                                                                                      $vmaFormulaGrid.setFontStyle('cells', 'fontSizeSelect', event.value);
                                                                                                  },
                                                                                              }),
                                                                                              h(GridCompButtonComponent, {
                                                                                                  icon: 'font_size_up',
                                                                                                  type: 'primary',
                                                                                                  size: 'mini',
                                                                                                  style: {
                                                                                                      marginLeft: '4px',
                                                                                                  },
                                                                                                  onClick: (_: any) => {
                                                                                                      let initValue =
                                                                                                          $vmaFormulaGrid.reactiveData.currentSheetData[
                                                                                                              $vmaFormulaGrid.reactiveData.currentAreaSri
                                                                                                          ][$vmaFormulaGrid.reactiveData.currentAreaSci + 1].fs;
                                                                                                      if (initValue === null || initValue === '') {
                                                                                                          initValue = getDefaultFontSize($vmaFormulaGrid.props.size!);
                                                                                                      }
                                                                                                      $vmaFormulaGrid.setFontStyle('cells', 'fontSizeUp', initValue);
                                                                                                  },
                                                                                              }),
                                                                                              h(GridCompButtonComponent, {
                                                                                                  icon: 'font_size_down',
                                                                                                  type: 'primary',
                                                                                                  size: 'mini',
                                                                                                  style: {
                                                                                                      marginLeft: '4px',
                                                                                                  },
                                                                                                  onClick: (_: any) => {
                                                                                                      let initValue =
                                                                                                          $vmaFormulaGrid.reactiveData.currentSheetData[
                                                                                                              $vmaFormulaGrid.reactiveData.currentAreaSri
                                                                                                          ][$vmaFormulaGrid.reactiveData.currentAreaSci + 1].fs;
                                                                                                      if (initValue === null || initValue === '') {
                                                                                                          initValue = getDefaultFontSize($vmaFormulaGrid.props.size!);
                                                                                                      }
                                                                                                      $vmaFormulaGrid.setFontStyle('cells', 'fontSizeDown', initValue);
                                                                                                  },
                                                                                              }),
                                                                                          ],
                                                                                      ),
                                                                                      h('i', {
                                                                                          class: ['link-suffix', option.suffixIcon],
                                                                                      }),
                                                                                  ],
                                                                              ),
                                                                          )
                                                                        : null;
                                                                } else {
                                                                    return child.visible
                                                                        ? h(
                                                                              'li',
                                                                              {
                                                                                  class: [
                                                                                      {
                                                                                          'link--disabled': child.disabled,
                                                                                          'link--active': child === ctxMenuStore.selectChild,
                                                                                      },
                                                                                  ],
                                                                                  key: `${optionsIndex}_${optionIndex}_${cIndex}`,
                                                                              },
                                                                              h(
                                                                                  'a',
                                                                                  {
                                                                                      class: 'link',
                                                                                      onClick(event: Event) {
                                                                                          if ($vmaFormulaGrid.ctxMenuLinkEvent) {
                                                                                              $vmaFormulaGrid.ctxMenuLinkEvent(event, child);
                                                                                          }
                                                                                      },
                                                                                      onMouseover(event: Event) {
                                                                                          if ($vmaFormulaGrid.ctxMenuMouseoverEvent) {
                                                                                              $vmaFormulaGrid.ctxMenuMouseoverEvent(event, option, child);
                                                                                          }
                                                                                      },
                                                                                      onMouseout(event: Event) {
                                                                                          if ($vmaFormulaGrid.ctxMenuMouseoutEvent) {
                                                                                              $vmaFormulaGrid.ctxMenuMouseoutEvent(event, option);
                                                                                          }
                                                                                      },
                                                                                  },
                                                                                  [
                                                                                      h(
                                                                                          'i',
                                                                                          {
                                                                                              class: ['link-prefix', child.prefixIcon],
                                                                                          },
                                                                                          child.prefixIcon
                                                                                              ? h(GridCompIconComponent, {
                                                                                                    name: child.prefixIcon,
                                                                                                    size: 'mini',
                                                                                                    translateY: 1,
                                                                                                })
                                                                                              : createCommentVNode(),
                                                                                      ),
                                                                                      h(
                                                                                          'span',
                                                                                          {
                                                                                              class: 'link-content',
                                                                                              style: {
                                                                                                  fontFamily: child.item,
                                                                                              },
                                                                                          },
                                                                                          child.name,
                                                                                      ),
                                                                                      h('i', {
                                                                                          class: ['link-suffix', option.suffixIcon],
                                                                                      }),
                                                                                  ],
                                                                              ),
                                                                          )
                                                                        : null;
                                                                }
                                                            }),
                                                        )
                                                      : null,
                                              ],
                                          );
                                }),
                            ),
                        ),
                    ),
                ],
            );

        $vmaFormulaGridCompContextMenu.renderVN = renderVN;

        provide('$vmaFormulaGridCompContextMenu', $vmaFormulaGridCompContextMenu);

        return $vmaFormulaGridCompContextMenu;
    },
    render() {
        return this.renderVN();
    },
});
