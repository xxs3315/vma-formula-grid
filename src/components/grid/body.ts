import { ComponentOptions, createCommentVNode, defineComponent, h, inject, nextTick, onBeforeUnmount, onMounted, PropType, reactive, resolveComponent } from 'vue';
import {
    VmaFormulaGridBodyConstructor,
    VmaFormulaGridBodyMethods,
    VmaFormulaGridBodyPrivateMethods,
    VmaFormulaGridBodyPropTypes,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods,
} from '../../../types';
import { Guid } from '../../utils/guid.ts';
import { checkCellInMerges, getRealArea, getRenderDefaultRowHeight, getYSpaceFromRowHeights, isNumeric } from '../../utils';
import { Cell } from './internals/cell.ts';
import { DomTools } from '../../utils/doms.ts';

export default defineComponent({
    name: 'VmaFormulaGridBody',
    props: {
        fixed: {
            type: String as PropType<VmaFormulaGridBodyPropTypes.Fixed>,
            default: 'center',
        },
    },
    setup(props, context) {
        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const GridCompIconComponent = resolveComponent('VmaFormulaGridCompIcon') as ComponentOptions;

        const TextareaComponent = resolveComponent('VmaFormulaGridCompTextarea') as ComponentOptions;

        const gridBodyReactiveData = reactive({});

        onMounted(() => {
            nextTick(() => {
                if (props.fixed === 'left') {
                    refGridBodyTableWrapperDiv.value.onscroll = null;
                    refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = scrollEvent;
                } else if (props.fixed === 'center') {
                    refGridBodyTableWrapperDiv.value.onscroll = scrollEvent;
                    refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = null;
                }
            });
        });

        onBeforeUnmount(() => {
            if (refGridBodyTableWrapperDiv && refGridBodyTableWrapperDiv.value) {
                refGridBodyTableWrapperDiv.value.onscroll = null;
            }
            if (refGridBodyLeftFixedScrollWrapperDiv && refGridBodyLeftFixedScrollWrapperDiv.value) {
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = null;
            }
        });

        const {
            refGridDiv,
            refGridBodyTable,
            refGridBodyTableWrapperDiv,
            refGridBodyLeftFixedTable,
            refGridBodyLeftFixedTableWrapperDiv,
            refGridBodyXLineDiv,
            refGridBodyYLineDiv,
            refGridBodyLeftFixedXLineDiv,
            refGridBodyLeftFixedYLineDiv,
            refGridBodyLeftFixedScrollWrapperDiv,
            refGridBodyTableColgroup,
            refGridBodyLeftFixedTableColgroup,
            renderDefaultColWidth,
            renderDefaultRowHeight,
            refGridHeaderTableWrapperDiv,
            refCurrentCellEditor,
            refCurrentCellBorderTop,
            refCurrentCellBorderRight,
            refCurrentCellBorderBottom,
            refCurrentCellBorderLeft,
            refCurrentCellBorderCorner,
            refCurrentAreaBorderTop,
            refCurrentAreaBorderRight,
            refCurrentAreaBorderBottom,
            refCurrentAreaBorderLeft,
            refCurrentAreaBorderCorner,
            refRowResizeBarDiv,
        } = $vmaFormulaGrid.getRefs();

        const renderVN = () =>
            h(
                'div',
                {
                    ref: props.fixed === 'center' ? refGridBodyTableWrapperDiv : refGridBodyLeftFixedTableWrapperDiv,
                    class: ['body-wrapper'],
                    ...{
                        onWheel: wheelEvent,
                    },
                },
                props.fixed === 'center'
                    ? [
                          h('div', {
                              ref: refGridBodyXLineDiv,
                              style: {
                                  float: 'left',
                                  height: `1px`,
                                  marginTop: `-1px`,
                              },
                          }),
                          h('div', {
                              ref: refGridBodyYLineDiv,
                              style: {
                                  float: 'left',
                                  width: `1px`,
                                  marginLeft: `-1px`,
                              },
                          }),
                          h(
                              'table',
                              {
                                  ref: refGridBodyTable,
                                  class: ['body'],
                              },
                              [
                                  h(
                                      'colgroup',
                                      {
                                          ref: refGridBodyTableColgroup,
                                      },
                                      renderBodyColgroup(),
                                  ),
                                  h('tbody', {}, renderBodyRows()),
                              ],
                          ),
                          h(TextareaComponent, {
                              ref: refCurrentCellEditor,
                              class: ['cell-editor'],
                              size: $vmaFormulaGrid.props.size,
                              type: $vmaFormulaGrid.props.type,
                              modelValue: $vmaFormulaGrid.reactiveData.currentCellEditorContent,
                              'onUpdate:modelValue': (value: any) => {
                                  $vmaFormulaGrid.reactiveData.currentCellEditorContent = value;
                              },
                              style: {
                                  display: $vmaFormulaGrid.reactiveData.currentCellEditorStyle.display,
                                  transform: $vmaFormulaGrid.reactiveData.currentCellEditorStyle.transform,
                                  height: $vmaFormulaGrid.reactiveData.currentCellEditorStyle.height,
                                  width: $vmaFormulaGrid.reactiveData.currentCellEditorStyle.width,
                                  left: $vmaFormulaGrid.reactiveData.currentCellEditorStyle.left,
                                  top: $vmaFormulaGrid.reactiveData.currentCellEditorStyle.top,
                              },
                              onChange: () => {
                                  $vmaFormulaGrid.reactiveData.currentCell.v = isNumeric($vmaFormulaGrid.reactiveData.currentCellEditorContent)
                                      ? Number($vmaFormulaGrid.reactiveData.currentCellEditorContent)
                                      : $vmaFormulaGrid.reactiveData.currentCellEditorContent;
                              },
                              onBlur: () => {
                                  // 重新计算
                                  nextTick(() => {
                                      $vmaFormulaGrid.calc();
                                  });
                              },
                          }),
                          h('div', {
                              ref: refCurrentCellBorderLeft,
                              class: ['current-cell-border', 'left', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.left,
                                  top: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.top,
                                  height: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.height,
                                  display: $vmaFormulaGrid.reactiveData.currentCell && Object.keys($vmaFormulaGrid.reactiveData.currentCell).length > 0 ? 'none' : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentCellBorderTop,
                              class: ['current-cell-border', 'top', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.left,
                                  top: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.top,
                                  width: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.width,
                                  display: $vmaFormulaGrid.reactiveData.currentCell && Object.keys($vmaFormulaGrid.reactiveData.currentCell).length > 0 ? 'none' : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentCellBorderRight,
                              class: ['current-cell-border', 'right', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.left + $vmaFormulaGrid.reactiveData.currentCellBorderStyle.width,
                                  top: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.top,
                                  height: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.height,
                                  display: $vmaFormulaGrid.reactiveData.currentCell && Object.keys($vmaFormulaGrid.reactiveData.currentCell).length > 0 ? 'none' : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentCellBorderBottom,
                              class: ['current-cell-border', 'bottom', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.left,
                                  top: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.top + $vmaFormulaGrid.reactiveData.currentCellBorderStyle.height,
                                  width: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.width,
                                  display: $vmaFormulaGrid.reactiveData.currentCell && Object.keys($vmaFormulaGrid.reactiveData.currentCell).length > 0 ? 'none' : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentCellBorderCorner,
                              class: ['current-cell-border', 'corner', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentCellBorderStyle.transform,
                                  left: `calc(${$vmaFormulaGrid.reactiveData.currentCellBorderStyle.left + $vmaFormulaGrid.reactiveData.currentCellBorderStyle.width} - 3px)`,
                                  top: `calc(${$vmaFormulaGrid.reactiveData.currentCellBorderStyle.top + $vmaFormulaGrid.reactiveData.currentCellBorderStyle.height} - 3px)`,
                                  display: $vmaFormulaGrid.reactiveData.currentCell && Object.keys($vmaFormulaGrid.reactiveData.currentCell).length > 0 ? 'none' : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentAreaBorderLeft,
                              class: ['current-area-border', 'left', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.left,
                                  top: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.top,
                                  height: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.height,
                                  display:
                                      $vmaFormulaGrid.reactiveData.currentArea &&
                                      $vmaFormulaGrid.reactiveData.currentArea.start !== null &&
                                      $vmaFormulaGrid.reactiveData.currentArea.end !== null
                                          ? 'block'
                                          : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentAreaBorderTop,
                              class: ['current-area-border', 'top', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.left,
                                  top: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.top,
                                  width: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.width,
                                  display:
                                      $vmaFormulaGrid.reactiveData.currentArea &&
                                      $vmaFormulaGrid.reactiveData.currentArea.start !== null &&
                                      $vmaFormulaGrid.reactiveData.currentArea.end !== null
                                          ? 'block'
                                          : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentAreaBorderRight,
                              class: ['current-area-border', 'right', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.left + $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.width,
                                  top: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.top,
                                  height: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.height,
                                  display:
                                      $vmaFormulaGrid.reactiveData.currentArea &&
                                      $vmaFormulaGrid.reactiveData.currentArea.start !== null &&
                                      $vmaFormulaGrid.reactiveData.currentArea.end !== null
                                          ? 'block'
                                          : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentAreaBorderBottom,
                              class: ['current-area-border', 'bottom', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.transform,
                                  left: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.left,
                                  top: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.top + $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.height,
                                  width: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.width,
                                  display:
                                      $vmaFormulaGrid.reactiveData.currentArea &&
                                      $vmaFormulaGrid.reactiveData.currentArea.start !== null &&
                                      $vmaFormulaGrid.reactiveData.currentArea.end !== null
                                          ? 'block'
                                          : 'none',
                              },
                          }),
                          h('div', {
                              ref: refCurrentAreaBorderCorner,
                              class: ['current-area-border', 'corner', `${$vmaFormulaGrid.props.type}`],
                              style: {
                                  transform: $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.transform,
                                  left: `calc(${$vmaFormulaGrid.reactiveData.currentAreaBorderStyle.left + $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.width} - 3px)`,
                                  top: `calc(${$vmaFormulaGrid.reactiveData.currentAreaBorderStyle.top + $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.height} - 3px)`,
                                  display:
                                      $vmaFormulaGrid.reactiveData.currentArea &&
                                      $vmaFormulaGrid.reactiveData.currentArea.start !== null &&
                                      $vmaFormulaGrid.reactiveData.currentArea.end !== null
                                          ? 'block'
                                          : 'none',
                              },
                          }),
                      ]
                    : props.fixed === 'left'
                    ? h(
                          'div',
                          {
                              ref: refGridBodyLeftFixedScrollWrapperDiv,
                              class: ['fixed-wrapper'],
                              style: {
                                  height: `${$vmaFormulaGrid.reactiveData.gridBodyHeight - $vmaFormulaGrid.reactiveData.scrollbarHeight}px`,
                              },
                          },
                          [
                              h('div', {
                                  ref: refGridBodyLeftFixedYLineDiv,
                                  style: {
                                      float: 'left',
                                      width: `1px`,
                                      marginLeft: `-1px`,
                                  },
                              }),
                              h('div', {
                                  ref: refGridBodyLeftFixedXLineDiv,
                                  style: {
                                      float: 'left',
                                      height: `1px`,
                                      marginTop: `-1px`,
                                  },
                              }),
                              h(
                                  'table',
                                  {
                                      ref: refGridBodyLeftFixedTable,
                                      class: ['body'],
                                  },
                                  [
                                      h(
                                          'colgroup',
                                          {
                                              ref: refGridBodyLeftFixedTableColgroup,
                                          },
                                          renderBodyColgroup(),
                                      ),
                                      h('tbody', {}, renderBodyRows()),
                                  ],
                              ),
                          ],
                      )
                    : createCommentVNode(),
            );

        const renderCellContentWithFormat = (cell: Cell) => {
            // TODO 加入数据格式处理
            return cell.mv;
        };

        const getCellContent = (cell: Cell) => {
            if (cell && cell.v) {
                return renderCellContentWithFormat(cell);
            }
            return null;
        };

        const resizeRowMousedown = (event: MouseEvent) => {
            const { clientY: dragClientY } = event;
            const domMousemove = document.onmousemove;
            const domMouseup = document.onmouseup;
            const dragBtnElem = event.target as HTMLDivElement;
            const wrapperElem = refGridBodyLeftFixedTableWrapperDiv.value;
            const pos = DomTools.getOffsetPos(dragBtnElem, wrapperElem);
            const dragBtnHeight = dragBtnElem.clientHeight;
            const rowHeight = getRenderDefaultRowHeight($vmaFormulaGrid.props.defaultRowHeight, $vmaFormulaGrid.props.size!);
            const topSpaceHeight = getYSpaceFromRowHeights(
                $vmaFormulaGrid.reactiveData.yStart,
                renderDefaultRowHeight.value,
                $vmaFormulaGrid.reactiveData.rowHeightsChanged,
                $vmaFormulaGrid.reactiveData.rowHidesChanged,
            );
            const dragBtnOffsetHeight = dragBtnHeight;
            const dragPosTop = pos.top + Math.floor(dragBtnOffsetHeight) + topSpaceHeight;
            const cell = dragBtnElem.parentNode as HTMLTableCellElement;
            const dragMinTop = Math.max(pos.top - cell.clientHeight + dragBtnOffsetHeight, 0);
            let dragTop = 0;
            const resizeBarElem = refRowResizeBarDiv.value;
            resizeBarElem.style.top = `${pos.top + refGridHeaderTableWrapperDiv.value.clientHeight + dragBtnOffsetHeight + topSpaceHeight}px`;
            resizeBarElem.style.display = 'block';

            // 处理拖动事件
            const updateEvent = (event: MouseEvent) => {
                event.stopPropagation();
                event.preventDefault();
                const offsetY = event.clientY - dragClientY;
                const top = dragPosTop + offsetY;
                dragTop = Math.max(top, dragMinTop);
                resizeBarElem.style.top = `${dragTop + refGridHeaderTableWrapperDiv.value.clientHeight}px`;
            };

            document.onmousemove = updateEvent;

            document.onmouseup = () => {
                document.onmousemove = domMousemove;
                document.onmouseup = domMouseup;
                resizeBarElem.style.display = 'none';
                if (dragBtnElem.parentElement!.getAttribute('data-row')) {
                    const rowConfig = $vmaFormulaGrid.reactiveData.rowConfs.find((item) => item.index === parseInt(dragBtnElem.parentElement!.getAttribute('data-row')!, 10));
                    if (rowConfig) {
                        rowConfig.height = Math.max(dragBtnElem.parentElement!.clientHeight + dragTop - dragPosTop, 6);
                        $vmaFormulaGrid.reactiveData.rowHeightsChanged[`${rowConfig.index + 1}`] = rowConfig.height;
                        $vmaFormulaGrid.reactiveData.gridHeight += rowConfig.height - rowHeight;
                    }
                }

                dragBtnElem.parentElement!.parentElement!.style.height = `${Math.max(dragBtnElem.parentElement!.clientHeight + dragTop - dragPosTop, 6)}px`;
                $vmaFormulaGrid.recalculate(true).then(() => {
                    nextTick(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle();
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay();
                        $vmaFormulaGrid.reCalcCurrentAreaPos();
                        $vmaFormulaGrid.updateCurrentAreaStyle();
                    });
                });
            };
        };

        const mousemoveHandler = (event: MouseEvent) => {
            const eventTargetNode: any = DomTools.getEventTargetNode(
                event,
                refGridBodyTable,
                `normal`,
                (target: any) => target.attributes.hasOwnProperty('data-row') && target.attributes.hasOwnProperty('data-col'),
            );
            if (eventTargetNode && eventTargetNode.flag) {
                const targetElem: any = eventTargetNode.targetElem;
                if (
                    $vmaFormulaGrid.reactiveData.currentArea.end === null ||
                    !(
                        $vmaFormulaGrid.reactiveData.currentArea.end.row === Number(targetElem.attributes['data-row'].value) &&
                        $vmaFormulaGrid.reactiveData.currentArea.end.col === Number(targetElem.attributes['data-col'].value)
                    )
                ) {
                    $vmaFormulaGrid.reactiveData.currentArea.end =
                        $vmaFormulaGrid.reactiveData.currentSheetData[Number(targetElem.attributes['data-row'].value)][Number(targetElem.attributes['data-col'].value) + 1];
                    $vmaFormulaGrid.reCalcCurrentAreaPos();
                    $vmaFormulaGrid.updateCurrentAreaStyle();
                }
            }
        };

        const resizeCurrentSelectArea = (event: MouseEvent) => {
            const domMousemove = document.onmousemove;
            const domMouseup = document.onmouseup;

            const eventTargetNode: any = DomTools.getEventTargetNode(
                event,
                refGridBodyTable,
                `normal`,
                (target: any) => target.attributes.hasOwnProperty('data-row') && target.attributes.hasOwnProperty('data-col'),
            );

            const updateEvent = (event: MouseEvent) => {
                event.stopPropagation();
                event.preventDefault();
                mousemoveHandler(event);
            };

            if (eventTargetNode && eventTargetNode.flag) {
                const targetElem: any = eventTargetNode.targetElem;
                $vmaFormulaGrid.reactiveData.currentArea.end =
                    $vmaFormulaGrid.reactiveData.currentSheetData[Number(targetElem.attributes['data-row'].value)][Number(targetElem.attributes['data-col'].value) + 1];
                $vmaFormulaGrid.reCalcCurrentAreaPos();
                $vmaFormulaGrid.updateCurrentAreaStyle();
            }

            document.onmousemove = updateEvent;

            document.onmouseup = (event: MouseEvent) => {
                document.onmousemove = domMousemove;
                document.onmouseup = domMouseup;
                const eventTargetNode: any = DomTools.getEventTargetNode(
                    event,
                    refGridBodyTable,
                    `normal`,
                    (target: any) => target.attributes.hasOwnProperty('data-row') && target.attributes.hasOwnProperty('data-col'),
                );
                if (eventTargetNode && eventTargetNode.flag) {
                    const targetElem: any = eventTargetNode.targetElem;
                    $vmaFormulaGrid.reactiveData.currentArea.end =
                        $vmaFormulaGrid.reactiveData.currentSheetData[Number(targetElem.attributes['data-row'].value)][Number(targetElem.attributes['data-col'].value) + 1];
                    $vmaFormulaGrid.reCalcCurrentAreaPos();
                    $vmaFormulaGrid.updateCurrentAreaStyle();
                }
            };
        };

        const isCellActive = (col: number, row: number): boolean => {
            return (
                col >= $vmaFormulaGrid.reactiveData.currentAreaSci &&
                col <= $vmaFormulaGrid.reactiveData.currentAreaEci &&
                row >= $vmaFormulaGrid.reactiveData.currentAreaSri &&
                row <= $vmaFormulaGrid.reactiveData.currentAreaEri
            );
        };

        const isRowIndicatorActive = (row: number): boolean => {
            return row >= $vmaFormulaGrid.reactiveData.currentAreaSri && row <= $vmaFormulaGrid.reactiveData.currentAreaEri;
        };

        const renderBodyRows = () => {
            const trs: any = [];
            for (let index = $vmaFormulaGrid.reactiveData.yStart; index <= $vmaFormulaGrid.reactiveData.yEnd; index++) {
                if (index > $vmaFormulaGrid.reactiveData.rowConfs.length - 1) {
                    break;
                }
                const rf: any = $vmaFormulaGrid.reactiveData.rowConfs[index];

                const cols: any = [];
                if ($vmaFormulaGrid.reactiveData.xStart !== -1) {
                    cols.push(
                        h(
                            'td',
                            {
                                'data-cat': 'row-indicator',
                                'data-type': `${$vmaFormulaGrid.props.type}`,
                                'data-row': rf.index,
                                'data-col': -1,
                                class: ['row-indicator', `${$vmaFormulaGrid.props.type}`, { 'row-indicator-active': isRowIndicatorActive(rf.index) }],
                                style: {
                                    overflow: 'hidden',
                                    height: 'inherit',
                                    width: 'inherit',
                                },
                            },
                            [
                                h(
                                    'div',
                                    {
                                        class: ['cell', `${$vmaFormulaGrid.props.type}`],
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        },
                                    },
                                    h(
                                        'div',
                                        {
                                            class: ['cell-content'],
                                        },
                                        (rf.index + 1).toString(),
                                    ),
                                ),
                                $vmaFormulaGrid.props.rowResizable
                                    ? h('div', {
                                          class: ['row-resize-handler', `${$vmaFormulaGrid.props.type}`],
                                          onMousedown: (event: MouseEvent) => {
                                              resizeRowMousedown(event);
                                              event.stopPropagation();
                                          },
                                      })
                                    : createCommentVNode(),
                                $vmaFormulaGrid.reactiveData.rowHidesChanged &&
                                Object.keys($vmaFormulaGrid.reactiveData.rowHidesChanged).length > 0 &&
                                $vmaFormulaGrid.reactiveData.rowHidesChanged.hasOwnProperty(`${rf.index}`)
                                    ? h(
                                          'div',
                                          {
                                              class: ['row-hide-info-upward'],
                                              onClick: (event: MouseEvent) => {
                                                  event.stopPropagation();
                                                  const refGridDivElem = refGridDiv.value;
                                                  const rowHideInfoUpwardTargetNode = DomTools.getEventTargetNode(event, refGridDivElem, `row-hide-info-upward`, (target: any) => {
                                                      const elem = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                                                      return elem !== document && elem.getAttribute('data-uid') === $vmaFormulaGrid.uId;
                                                  });
                                                  if (rowHideInfoUpwardTargetNode.flag) {
                                                      const elem = rowHideInfoUpwardTargetNode.targetElem;
                                                      const targetElem: any = elem.parentElement!;
                                                      $vmaFormulaGrid.updateRowVisible(
                                                          'showUpRows',
                                                          targetElem.attributes['data-row'].value,
                                                          targetElem.attributes['data-row'].value,
                                                      );
                                                  }
                                              },
                                          },
                                          h(GridCompIconComponent, {
                                              name: 'ellipsis-v',
                                              size: $vmaFormulaGrid.props.size,
                                              scaleX: 0.7,
                                              scaleY: 0.7,
                                          }),
                                      )
                                    : createCommentVNode(),
                                $vmaFormulaGrid.reactiveData.rowHidesChanged &&
                                Object.keys($vmaFormulaGrid.reactiveData.rowHidesChanged).length > 0 &&
                                $vmaFormulaGrid.reactiveData.rowHidesChanged.hasOwnProperty(`${rf.index + 1 + 1}`)
                                    ? h(
                                          'div',
                                          {
                                              class: ['row-hide-info-downward'],
                                              onClick: (event: MouseEvent) => {
                                                  event.stopPropagation();
                                                  const refGridDivElem = refGridDiv.value;
                                                  const rowHideInfoDownwardTargetNode = DomTools.getEventTargetNode(
                                                      event,
                                                      refGridDivElem,
                                                      `row-hide-info-downward`,
                                                      (target: any) => {
                                                          const elem = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                                                          return elem !== document && elem.getAttribute('data-uid') === $vmaFormulaGrid.uId;
                                                      },
                                                  );
                                                  if (rowHideInfoDownwardTargetNode.flag) {
                                                      const elem = rowHideInfoDownwardTargetNode.targetElem;
                                                      const targetElem: any = elem.parentElement!;
                                                      $vmaFormulaGrid.updateRowVisible(
                                                          'showDownRows',
                                                          targetElem.attributes['data-row'].value,
                                                          targetElem.attributes['data-row'].value,
                                                      );
                                                  }
                                              },
                                          },
                                          h(GridCompIconComponent, {
                                              name: 'ellipsis-v',
                                              size: $vmaFormulaGrid.props.size,
                                              scaleX: 0.7,
                                              scaleY: 0.7,
                                          }),
                                      )
                                    : createCommentVNode(),
                            ],
                        ),
                    );
                }
                if (props.fixed === 'center') {
                    for (let indexCol = $vmaFormulaGrid.reactiveData.xStart; indexCol <= $vmaFormulaGrid.reactiveData.xEnd; indexCol++) {
                        if (indexCol >= $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                            break;
                        }
                        if (indexCol === -1) {
                            cols.push(
                                h(
                                    'td',
                                    {
                                        'data-cat': 'row-indicator',
                                        'data-type': `${$vmaFormulaGrid.props.type}`,
                                        'data-row': rf.index,
                                        'data-col': -1,
                                        'data-id': `${rf.index}_-1`,
                                        class: ['row-indicator', `${$vmaFormulaGrid.props.type}`],
                                        style: {
                                            overflow: 'hidden',
                                            height: 'inherit',
                                            width: 'inherit',
                                        },
                                    },
                                    h(
                                        'div',
                                        {
                                            class: ['cell', `${$vmaFormulaGrid.props.type}`],
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            },
                                        },
                                        h(
                                            'div',
                                            {
                                                class: ['cell-content'],
                                            },
                                            (rf.index + 1).toString(),
                                        ),
                                    ),
                                ),
                            );
                        } else {
                            const cf: any = $vmaFormulaGrid.reactiveData.colConfs[indexCol + 1];
                            if (!checkCellInMerges(cf.index + 1, rf.index + 1, $vmaFormulaGrid.reactiveData.merges)) {
                                const cell = $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1];
                                cols.push(
                                    h(
                                        'td',
                                        {
                                            'data-cat': 'normal',
                                            'data-type': `${$vmaFormulaGrid.props.type}`,
                                            'data-row': rf.index,
                                            'data-col': cf.index,
                                            'data-id': `${rf.index}_${cf.index}`,
                                            rowspan: cell.rowSpan,
                                            colspan: cell.colSpan,
                                            class: ['normal', `${$vmaFormulaGrid.props.type}`, `cell-bg-${cell.bgt}`, { 'cell-active': isCellActive(cf.index, rf.index) }],
                                            style: {
                                                // overflow: 'hidden',
                                                height: cell.rowSpan! > 1 ? '100%' : 'inherit',
                                                width: cell.colSpan! > 1 ? '100%' : 'inherit',
                                                '--cellBgCustom': cell.bg,
                                                color: cell.fg,
                                                fontWeight: cell.b ? 'bold' : 'normal',
                                                textDecoration: cell.u ? 'underline' : 'none',
                                                fontFamily: cell.ff,
                                                fontSize: cell.fs ? cell.fs + 'px' : null,
                                            },
                                            onMouseup: (_: MouseEvent) => {
                                                $vmaFormulaGrid.reactiveData.currentAreaStatus = false;
                                                $vmaFormulaGrid.reCalcCurrentAreaPos();
                                                $vmaFormulaGrid.updateCurrentAreaStyle();
                                            },
                                            onMousedown: (event: MouseEvent) => {
                                                if (event) {
                                                    if (event.button === 0) {
                                                        if (cf.index >= 0) {
                                                            $vmaFormulaGrid.reactiveData.currentCellEditorActive = false;
                                                            $vmaFormulaGrid.reactiveData.currentCell = $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1];
                                                            $vmaFormulaGrid.reactiveData.currentCellEditorContent =
                                                                $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1].v;

                                                            $vmaFormulaGrid.reactiveData.currentAreaStatus = true;
                                                            $vmaFormulaGrid.reactiveData.currentArea = {
                                                                start: $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1],
                                                                end: null,
                                                            };
                                                            nextTick(() => {
                                                                resizeCurrentSelectArea(event);
                                                            });
                                                        }
                                                    } else if (event.button === 2) {
                                                        if (cf.index >= 0) {
                                                            if (
                                                                $vmaFormulaGrid.reactiveData.currentArea &&
                                                                $vmaFormulaGrid.reactiveData.currentArea.start !== null &&
                                                                $vmaFormulaGrid.reactiveData.currentArea.end != null
                                                            ) {
                                                                const { sci, eci, sri, eri } = getRealArea(
                                                                    renderDefaultColWidth.value,
                                                                    $vmaFormulaGrid.reactiveData.columnWidthsChanged,
                                                                    $vmaFormulaGrid.reactiveData.columnHidesChanged,
                                                                    renderDefaultRowHeight.value,
                                                                    $vmaFormulaGrid.reactiveData.rowHeightsChanged,
                                                                    $vmaFormulaGrid.reactiveData.rowHidesChanged,
                                                                    $vmaFormulaGrid.reactiveData.merges,
                                                                    $vmaFormulaGrid.reactiveData.currentArea,
                                                                );
                                                                if (!(rf.index >= sri && rf.index <= eri && cf.index >= sci && cf.index <= eci)) {
                                                                    $vmaFormulaGrid.reactiveData.currentCellEditorActive = false;
                                                                    $vmaFormulaGrid.reactiveData.currentCell =
                                                                        $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1];
                                                                    $vmaFormulaGrid.reactiveData.currentCellEditorContent =
                                                                        $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1].v;

                                                                    $vmaFormulaGrid.reactiveData.currentAreaStatus = true;
                                                                    $vmaFormulaGrid.reactiveData.currentArea = {
                                                                        start: $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1],
                                                                        end: $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1],
                                                                    };
                                                                }
                                                            } else {
                                                                $vmaFormulaGrid.reactiveData.currentCellEditorActive = false;
                                                                $vmaFormulaGrid.reactiveData.currentCell = $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1];
                                                                $vmaFormulaGrid.reactiveData.currentCellEditorContent =
                                                                    $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1].v;

                                                                $vmaFormulaGrid.reactiveData.currentAreaStatus = true;
                                                                $vmaFormulaGrid.reactiveData.currentArea = {
                                                                    start: $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1],
                                                                    end: $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index + 1],
                                                                };
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            onDblclick: (_: MouseEvent) => {
                                                if (cf.index >= 0) {
                                                    $vmaFormulaGrid.reactiveData.currentCellEditorActive = true;
                                                    nextTick(() => {
                                                        refCurrentCellEditor.value.$el.querySelectorAll(`textarea`).forEach((elem: HTMLTextAreaElement) => {
                                                            elem.focus();
                                                        });
                                                    });
                                                }
                                            },
                                        },
                                        h(
                                            'div',
                                            {
                                                class: ['cell', `${$vmaFormulaGrid.props.type}`],
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                },
                                            },
                                            h(
                                                'span',
                                                {
                                                    class: [
                                                        'cell-content',
                                                        {
                                                            italic: cell.i,
                                                        },
                                                    ],
                                                },
                                                getCellContent(cell),
                                            ),
                                        ),
                                    ),
                                );
                            }
                        }
                    }
                }

                trs.push(
                    h(
                        'tr',
                        {
                            'data-row': index,
                            style: {
                                height: rf.visible ? (typeof rf.height === 'string' ? `${renderDefaultRowHeight.value}px` : `${rf.height}px`) : 0,
                            },
                        },
                        cols,
                    ),
                );
            }
            return trs;
        };

        const renderBodyColgroup = () => {
            const cols: any = [];
            if ($vmaFormulaGrid.reactiveData.xStart !== -1) {
                cols.push(
                    h('col', {
                        idx: -1,
                    }),
                );
            }
            for (let index = $vmaFormulaGrid.reactiveData.xStart; index <= $vmaFormulaGrid.reactiveData.xEnd; index++) {
                if (index >= $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                    break;
                }
                cols.push(
                    h('col', {
                        idx: index,
                    }),
                );
            }
            return cols;
        };

        const scrollEvent = (event: Event) => {
            if (props.fixed === 'center') {
                refGridHeaderTableWrapperDiv.value.scrollLeft = refGridBodyTableWrapperDiv.value.scrollLeft;
                refGridBodyLeftFixedScrollWrapperDiv.value.scrollTop = refGridBodyTableWrapperDiv.value.scrollTop;
            } else if (props.fixed === 'left') {
                refGridBodyTableWrapperDiv.value.scrollTop = refGridBodyLeftFixedScrollWrapperDiv.value.scrollTop;
            }
            $vmaFormulaGrid.triggerScrollXEvent(event);
            $vmaFormulaGrid.triggerScrollYEvent(event);
        };

        const wheelEvent = (_: WheelEvent) => {
            if (props.fixed === 'center') {
                refGridBodyTableWrapperDiv.value.onscroll = scrollEvent;
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = null;
            } else if (props.fixed === 'left') {
                refGridBodyTableWrapperDiv.value.onscroll = null;
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = scrollEvent;
            }
        };

        const $vmaFormulaGridBody = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData: gridBodyReactiveData,
            renderVN: renderVN,
        } as unknown as VmaFormulaGridBodyConstructor & VmaFormulaGridBodyMethods & VmaFormulaGridBodyPrivateMethods;

        return $vmaFormulaGridBody;
    },
    render() {
        return this.renderVN();
    },
});
