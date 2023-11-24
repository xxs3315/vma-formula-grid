import VmaFormulaGrid from './components/grid/index.ts';
import { App } from 'vue';

import dc, { dfo, d } from './utils';
import { FormulaParser, MAX_ROW, MAX_COLUMN, SSF, DepParser, FormulaError, FormulaHelpers, Types, ReversedTypes, Factorials, WildCard, Criteria, Address } from './formula';

const components = [VmaFormulaGrid];

export function install(app: App) {
    components.forEach((component) => component.install(app));
}

export * from './v-m-a-formula-grid';

export { dc, dfo, d };
export { FormulaParser, MAX_ROW, MAX_COLUMN, SSF, DepParser, FormulaError, FormulaHelpers, Types, ReversedTypes, Factorials, WildCard, Criteria, Address };
export * from './components/code-mirror/lang';
export * from './components/code-mirror/extensions/auto-completion.ts';
export * from './components/code-mirror/extensions/indent-completion-tab.ts';

export * from './components/grid';
