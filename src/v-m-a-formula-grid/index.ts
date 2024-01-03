import { VmaFormulaGridCore } from '../../types';
import hooks from './hooks.ts';
import VmaFormulaGridCompContextMenuHook from '../components/context-menu/hooks';

export const version = '1.1.13';

const installedPlugins: any[] = [];

export function use(Plugin: any, options?: any) {
    if (Plugin && Plugin.install) {
        if (installedPlugins.indexOf(Plugin) === -1) {
            Plugin.install(VMAFormulaGrid, options);
            installedPlugins.push(Plugin);
        }
    }
    return VMAFormulaGrid;
}

hooks.add('VmaFormulaGridCompContextMenu', VmaFormulaGridCompContextMenuHook);

export const VMAFormulaGrid = {
    version: version,
    hooks,
    use,
} as VmaFormulaGridCore;

export * from './hooks.ts';

export default VMAFormulaGrid;
