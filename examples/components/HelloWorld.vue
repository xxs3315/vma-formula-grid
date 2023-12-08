<template>
    <div style="height: 100%">
        <div style="height: 200px">
            <fieldset class="fieldset">
                <legend>Select a datasource type:</legend>
                <span>
                    <input type="radio" id="datasourceArray" v-model="datasource" value="array" checked />
                    <label for="datasourceArray">Array</label>
                </span>
                <span>
                    <input type="radio" id="datasourceMap" v-model="datasource" value="map" />
                    <label for="datasourceMap">Map</label>
                </span>
            </fieldset>

            <fieldset class="fieldset">
                <legend>Select a size type:</legend>
                <span>
                    <input type="radio" id="sizeLarge" v-model="size" value="large" />
                    <label for="sizeLarge">Large</label>
                </span>
                <span>
                    <input type="radio" id="sizeNormal" v-model="size" value="normal" checked />
                    <label for="sizeNormal">Normal</label>
                </span>
                <span>
                    <input type="radio" id="sizeSmall" v-model="size" value="small" />
                    <label for="sizeSmall">Small</label>
                </span>
                <span>
                    <input type="radio" id="sizeMini" v-model="size" value="mini" />
                    <label for="sizeMini">Mini</label>
                </span>
            </fieldset>

            <fieldset class="fieldset">
                <legend>Select a theme type:</legend>
                <span>
                    <input type="radio" id="themeTypePrimary" v-model="themeType" value="primary" checked />
                    <label for="themeTypePrimary">Primary</label>
                </span>
                <span>
                    <input type="radio" id="themeTypeSuccess" v-model="themeType" value="success" />
                    <label for="themeTypeSuccess">Success</label>
                </span>
                <span>
                    <input type="radio" id="themeTypeWarning" v-model="themeType" value="warning" />
                    <label for="themeTypeWarning">Warning</label>
                </span>
                <span>
                    <input type="radio" id="themeTypeDanger" v-model="themeType" value="danger" />
                    <label for="themeTypeDanger">Danger</label>
                </span>
            </fieldset>

            <fieldset class="fieldset">
                <legend>Toolbar:</legend>
                <span>
                    <vma-formula-grid-comp-toolbar ref="vfgt" />
                </span>
            </fieldset>

            <fieldset class="fieldset">
                <legend>Select horizontal virtual scroll:</legend>
                <span>
                    <input type="radio" id="virtualScrollXTrue" v-model="virtualScrollX" :value="true" checked />
                    <label for="virtualScrollXTrue">True</label>
                </span>
                <span>
                    <input type="radio" id="virtualScrollXFalse" v-model="virtualScrollX" :value="false" />
                    <label for="virtualScrollXFalse">False</label>
                </span>
            </fieldset>

            <fieldset class="fieldset">
                <legend>Select vertical virtual scroll:</legend>
                <span>
                    <input type="radio" id="virtualScrollYTrue" v-model="virtualScrollY" :value="true" checked />
                    <label for="virtualScrollYTrue">True</label>
                </span>
                <span>
                    <input type="radio" id="virtualScrollYFalse" v-model="virtualScrollY" :value="false" />
                    <label for="virtualScrollYFalse">False</label>
                </span>
            </fieldset>

            <fieldset class="fieldset">
                <legend>Select a locale type:</legend>
                <span>
                    <input type="radio" id="localeCn" v-model="locale" value="ZH-cn" checked />
                    <label for="localeCn">ZH-cn</label>
                </span>
                <span>
                    <input type="radio" id="localeEn" v-model="locale" value="En" />
                    <label for="localeEn">En</label>
                </span>
            </fieldset>

            <fieldset class="fieldset">
                <legend>Get current grid conf & data:</legend>
                <span>
                    <input type="button" @click="getCurrentGridConfData" value="Get!" />
                </span>
            </fieldset>
        </div>

        <div style="margin-top: 10px; height: calc(100% - 210px)">
            <splitpanes class="default-theme" style="height: 100%">
                <pane min-size="50" size="60">
                    <vma-formula-grid
                        ref="vfg"
                        style="width: calc(100% - 16px); height: calc(100% - 16px); margin: 8px"
                        :data="data"
                        :size="size"
                        :type="themeType"
                        :lang="locale"
                        :virtual-scroll-x="virtualScrollX"
                        :virtual-scroll-y="virtualScrollY"
                        :functions="customFunctions"
                    />
                </pane>
                <pane size="20" min-size="10">
                    <vue-json-pretty
                        :data="state.data"
                        :deep="state.deep"
                        :path-collapsible="state.setPathCollapsible ? pathCollapsible : undefined"
                        :show-double-quotes="state.showDoubleQuotes"
                        :show-length="state.showLength"
                        :show-line="state.showLine"
                        :show-line-number="state.showLineNumber"
                        :collapsed-on-click-brackets="state.collapsedOnClickBrackets"
                        :show-icon="state.showIcon"
                        :show-key-value-space="state.showKeyValueSpace"
                        style="width: calc(100% - 16px); height: calc(100% - 16px); margin: 8px; border: 1px solid darkgray; overflow: auto; background-color: darkgray"
                    >
                        <template v-if="state.useRenderNodeKeySlot" #renderNodeKey="{ node, defaultKey }">
                            <template v-if="node.key === 'title'">
                                <a>"{{ node.key }}"</a>
                            </template>
                            <template v-else>{{ defaultKey }}</template>
                        </template>

                        <template v-if="state.useRenderNodeValueSlot" #renderNodeValue="{ node, defaultValue }">
                            <template v-if="typeof node.content === 'string' && node.content.startsWith('http://')">
                                <a :href="node.content" target="_blank">{{ node.content }}</a>
                            </template>
                            <template v-else>{{ defaultValue }}</template>
                        </template>
                    </vue-json-pretty>
                </pane>
            </splitpanes>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { FormulaError, FormulaHelpers, Types } from '../../src/all';
import { VmaFormulaGridCompToolbarInstance, VmaFormulaGridInstance } from '../../types';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import axios from 'axios';
import VmaFormulaGridCompToolbar from '../../src/components/toolbar/toolbar';

export default defineComponent({
    name: 'HelloWorld',
    components: { VmaFormulaGridCompToolbar, Splitpanes, Pane, VueJsonPretty },
    setup() {
        const datasource = ref('array');
        const size = ref('normal');
        const themeType = ref('primary');
        const virtualScrollX = ref(true);
        const virtualScrollY = ref(true);
        const locale = ref('ZH-cn');

        const vfg = ref<VmaFormulaGridInstance>();
        const vfgt = ref<VmaFormulaGridCompToolbarInstance>();

        onMounted(() => {});

        onUnmounted(() => {});

        const customFunctions = reactive({
            CUSTOM_FUN_1: (number: any) => {
                number = FormulaHelpers.accept(number, Types.NUMBER);
                if (number > 255 || number < 1) throw FormulaError.VALUE;
                return String.fromCharCode(number + 24);
            },
            CUSTOM_FUN_2: (number: any) => {
                // async remote request support
                number = FormulaHelpers.accept(number, Types.NUMBER);
                return new Promise((resolve, reject) => {
                    axios.get('/mock/api/getStatusList').then((res) => {
                        console.log('mock response: ' + res.data.data[1].value);
                        resolve(number + Number(res.data.data[1].value) + 76);
                    });
                });
            },
        });

        const mapData = reactive({
            data: [
                {
                    p: 'A1',
                    v: 1,
                },
                {
                    p: 'A2',
                    v: 2,
                },
                {
                    p: 'A3',
                    v: 3,
                },
                {
                    p: 'A4',
                    v: 4,
                },
                {
                    p: 'A20',
                    v: '= F20 - 2',
                },
                {
                    p: 'B1',
                    v: '= SUM(A3, 6)',
                },
                {
                    p: 'B2',
                    v: '= A2 + 2 + SQRT(2)',
                },
                {
                    p: 'B3',
                    v: '= A3 + 2',
                },
                {
                    p: 'B4',
                    v: '= A4 + 2',
                },
                {
                    p: 'B5',
                    v: '= SUM(A1:A4)',
                },
                {
                    p: 'F20',
                    v: '= A20 + 2',
                },
                {
                    p: 'B25',
                    v: '= A20 + 2',
                },
            ],
        });

        const arrayData = reactive([
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [
                '= A1 + 2',
                '= B1 + 2',
                '= C1 + 2',
                '= D1 + 2',
                '= E1 + 2',
                '= F1 + 2',
                '= G1 + 2',
                '= H1 + 2',
                '= I1 + 2',
                '= J1 + 2',
                '= K1 + 2',
                '= L1 + 2',
                '= M1 + 2',
                '= N1 + 2',
                '= O1 + 2',
                '= P1 + 2',
                '= Q1 + 2',
                '= CUSTOM_FUN_1(R1)',
                '= CUSTOM_FUN_2(S1) + 2',
                '= T1 + 2',
            ],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        ]);

        const confs = reactive({
            global: {
                formats: {
                    n: {
                        general: '0.00',
                        percent: '0.00%',
                        science: '0.00E+0',
                        fraction: '0/0',
                        thousands: '###,###',
                    },
                    d: {
                        time: 'hh:mm:ss AM/PM',
                        shortDate: 'yyyy-mm-dd dddd',
                        longDate: 'yyyy-mm-dd hh:mm:ss AM/PM',
                    },
                    c: {
                        cny: '#,##0.00" ¥"',
                        usd: '$#,##0.00',
                        euro: '#,##0" €"',
                        others: [
                            { key: '英镑', value: '"£ "#,##0.00' },
                            { key: '韩元', value: '"₩ "#,##0.00' },
                        ],
                    },
                },
            },
            rowHeight: [
                { row: 2, height: 48 },
                { row: 4, height: 96 },
                { row: 17, height: 196 },
            ],
            colWidth: [
                { col: 'B', width: 200 },
                { col: 'H', width: 200 },
            ],
            rowHide: [9, '15:19'],
            colHide: ['D:F', 'H'],
            merges: ['A1:I3', 'A4:A12', 'A120:A165'],
            styles: {
                bgc: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', color: 'grey' },
                    { p: ['B', 'D', 'F'], type: 'columns', color: 'lightblue' },
                    { p: [1, 3, 5], type: 'rows', color: '#FCCC99' },
                    { p: [10, 11, 12, '23:27'], type: 'rows', color: '#88EEFF' },
                    { p: 'L26:G7', type: 'cells', color: 'rgba(66, 88, 99, 0.5)' },
                    { p: 'J20', type: 'cells', color: '#88EEFF' },
                    { p: 'J23', type: 'cells', color: 'none' },
                ],
                fgc: [
                    { p: ['A', 'C', 'D', 'o:r'], color: 'red', type: 'columns' },
                    { p: ['B', 'D', 'F'], color: 'red', type: 'columns' },
                    { p: [1, 3, 5], color: '#FF5599', type: 'rows' },
                    { p: [10, 11, 12, '23:27'], color: '#CC5599', type: 'rows' },
                    { p: 'J28', color: 'rgba(200, 48, 46, 0.8)', type: 'cells' },
                    { p: 'G7:L26', color: 'rgba(220, 48, 46, 0.8)', type: 'cells' },
                    { p: 'J20', type: 'cells', color: 'none' },
                    { p: 'J23', type: 'cells', color: '#88EEFF' },
                ],
                b: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: true },
                    { p: ['B', 'D', 'F'], type: 'columns', v: true },
                    { p: [1, 3, 5], type: 'rows', v: true },
                    { p: [10, 11, 12, '23:27'], type: 'rows', v: true },
                    { p: 'L26:G7', type: 'cells', v: true },
                    { p: 'J20', type: 'cells', v: true },
                    { p: 'J23', type: 'cells', v: true },
                ],
                i: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: true },
                    { p: ['B', 'D', 'F'], type: 'columns', v: true },
                    { p: [1, 3, 5], type: 'rows', v: true },
                    { p: [10, 11, 12, '23:27'], type: 'rows', v: true },
                    { p: 'L26:G7', type: 'cells', v: true },
                    { p: 'J20', type: 'cells', v: true },
                    { p: 'J23', type: 'cells', v: true },
                ],
                u: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: true },
                    { p: ['B', 'D', 'F'], type: 'columns', v: true },
                    { p: [1, 3, 5], type: 'rows', v: true },
                    { p: [10, 11, 12, '23:27'], type: 'rows', v: true },
                    { p: 'L26:G7', type: 'cells', v: true },
                    { p: 'J20', type: 'cells', v: true },
                    { p: 'J23', type: 'cells', v: true },
                ],
                fs: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: 12 },
                    { p: ['B', 'D', 'F'], type: 'columns', v: 18 },
                    { p: [1, 3, 5], type: 'rows', v: 18 },
                    { p: [10, 11, 12, '23:27'], type: 'rows', v: 16 },
                    { p: 'L26:G7', type: 'cells', v: 28 },
                    { p: 'J20', type: 'cells', v: 'none' },
                    { p: 'J23', type: 'cells', v: 36 },
                ],
                ff: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: '黑体' },
                    { p: ['B', 'D', 'F'], type: 'columns', v: '楷体' },
                    { p: [1, 3, 5], type: 'rows', v: '微软雅黑' },
                    { p: [10, 11, 12, '23:27'], type: 'rows', v: '微软雅黑' },
                    { p: 'L26:G7', type: 'cells', v: '微软雅黑' },
                    { p: 'J20', type: 'cells', v: 'none' },
                    { p: 'J23', type: 'cells', v: '仿宋' },
                ],
            },
            aligns: {
                h: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: 'left' },
                    { p: ['B', 'D', 'F'], type: 'columns', v: 'right' },
                    { p: [1, 3, 5], type: 'rows', v: 'left' },
                    { p: [10, 11, 12, '23:27'], type: 'rows', v: 'center' },
                    { p: 'L26:G7', type: 'cells', v: 'left' },
                    { p: 'J20', type: 'cells', v: 'none' },
                    { p: 'J23', type: 'cells', v: 'center' },
                ],
                v: [
                    { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: 'bottom' },
                    { p: ['B', 'D', 'F'], type: 'columns', v: 'middle' },
                    { p: [1, 4, 3, 5], type: 'rows', v: 'bottom' },
                    { p: [10, 11, 12, '23:27'], type: 'rows', v: 'bottom' },
                    { p: 'L26:G7', type: 'cells', v: 'top' },
                    { p: 'J20', type: 'cells', v: 'none' },
                    { p: 'J23', type: 'cells', v: 'bottom' },
                ],
            },
            wraps: [
                { p: ['A', 'C', 'D', 'o:r'], type: 'columns', v: true },
                { p: ['B', 'D', 'F'], type: 'columns', v: false },
                { p: [1, 4, 3, 5], type: 'rows', v: true },
                { p: [10, 11, 12, '23:27'], type: 'rows', v: true },
                { p: 'L26:G7', type: 'cells', v: true },
                { p: 'J20', type: 'cells', v: false },
                { p: 'J17', type: 'cells', v: true },
            ],
            formats: [
                { p: ['A', 'C', 'D', 'o:q'], type: 'columns', details: { type: 'g' } },
                { p: 'B4:E8', type: 'cells', details: { type: 'n', v: '##.00' } },
                { p: 'C15:D17', type: 'cells', details: { type: 'n', v: '###,###.00' } },
                { p: 'J28', type: 'cells', details: { type: 'n', v: '##0/##0' } },
                { p: 'G7:K26', type: 'cells', details: { type: 'n', v: '0.0%' } },
                { p: [1, 5, 6, 7, 8], type: 'rows', details: { type: 'c', v: '$#,##0.00' } },
                { p: 'L61', type: 'cells', details: { type: 'c', v: '#,##0.00" ¥"' } },
                { p: 'C6:D7', type: 'cells', details: { type: 'd', v: 'yyyy-mm-dd dddd' } },
                { p: 'E10:F17', type: 'cells', details: { type: 'd', v: 'yyyy-mm-dd hh:mm AM/PM' } },
            ],
            borders: [
                { p: ['A', 'C', 'D', 'o:q'], type: 'columns', details: { full: true } },
                { p: ['A'], type: 'columns', details: { none: true } },
                { p: ['G'], type: 'columns', details: { left: true, top: true, bottom: true } },
                { p: ['J', 'K', 'L'], type: 'columns', details: { outer: true } },
                { p: 'B4:E8', type: 'cells', details: { full: true } },
                { p: 'C5:D7', type: 'cells', details: { none: true } },
                { p: [1, 5, 6, 7, 8], type: 'rows', details: { full: true } },
                { p: [25, 26, '40:40'], type: 'rows', details: { outer: true } },
                { p: 'J28', details: {}, type: 'cells' },
                { p: 'G7:K26', details: { full: true }, type: 'cells' },
                { p: 'J24:N30', details: { outer: true }, type: 'cells' },
                { p: 'J62:H60', details: { outer: true }, type: 'cells' },
            ],
        });

        const data = reactive({
            conf: confs,
            type: 'array', // array or map, default value is array
            arrayData: arrayData, // default data
            mapData: mapData,
        });

        const state = reactive({
            val: JSON.stringify(data),
            data: data,
            showLength: true,
            showLine: true,
            showLineNumber: false,
            showDoubleQuotes: true,
            collapsedOnClickBrackets: true,
            useRenderNodeKeySlot: false,
            useRenderNodeValueSlot: false,
            deep: 2,
            setPathCollapsible: false,
            showIcon: true,
            showKeyValueSpace: true,
        });

        const getCurrentGridConfData = () => {
            vfg.value.getCurrentGridData();
        };

        const pathCollapsible = (node) => {
            return node.key === 'members';
        };

        watch(
            () => datasource.value,
            () => {
                data.type = datasource.value;
            },
        );

        watch(
            () => size.value,
            () => {
                console.log(size.value);
            },
        );

        watch(
            () => data.type,
            () => {
                console.log(data);
            },
            {
                deep: true,
            },
        );

        watch(
            () => state.val,
            (newVal) => {
                try {
                    state.data = JSON.parse(newVal);
                } catch (err) {
                    // console.log('JSON ERROR');
                }
            },
        );

        nextTick(() => {
            vfg.value.connectToolbar(vfgt.value);
        });

        return {
            datasource,
            data,
            size,
            themeType,
            virtualScrollX,
            virtualScrollY,
            customFunctions,
            vfg,
            vfgt,
            locale,
            state,
            pathCollapsible,
            getCurrentGridConfData,
        };
    },
});
</script>

<style scoped>
.fieldset {
    display: inline-block;
    vertical-align: top; /* enter your desired option */

    > span {
        margin-right: 10px;
    }
}
</style>
