import { App } from 'vue';
import { VmaFormulaGridCore } from './v-m-a-formula-grid';

export function install(app: App): void;

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VMAFormulaGrid: VmaFormulaGridCore;

        VmaFormulaGrid: any;
    }
}

declare global {
    interface Window {
        VMAFormulaGrid: VmaFormulaGridCore;
    }
}

export * from './v-m-a-formula-grid';
export * from './components/icon';
export * from './hooks';
export * from './components/context-menu';
export * from './components/textarea';
export * from './components/color-picker';
export * from './components/select';
export * from './components/input';
export * from './components/button';
export * from './components/loading';
export * from './components/code-mirror';
export * from './components/toolbar';
export * from './grid';
