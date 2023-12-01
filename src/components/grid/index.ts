import VmaFormulaGridComp from './grid.ts';
import VmaFormulaGridHeader from './header.ts';
import VmaFormulaGridBody from './body.ts';

import VmaFormulaGridCompIcon from '../icon/icon.ts';
import VmaFormulaGridCompContextMenu from '../context-menu/context-menu.ts';
import VmaFormulaGridCompTextarea from '../textarea/textarea.ts';
import VmaFormulaGridCompButton from '../button/button.ts';
import VmaFormulaGridCompLoading from '../loading/loading.ts';
import VmaFormulaGridCompColorPicker from '../color-picker/color-picker.ts';
import VmaFormulaGridCompColorPickerBoard from '../color-picker/board.ts';
import VmaFormulaGridCompColorPickerDisplay from '../color-picker/display.ts';
import VmaFormulaGridCompColorPickerHue from '../color-picker/hue.ts';
import VmaFormulaGridCompColorPickerLightness from '../color-picker/lightness.ts';
import VmaFormulaGridCompColorPickerPalette from '../color-picker/palette.ts';
import VmaFormulaGridCompInput from '../input/input.ts';
import VmaFormulaGridCompCodeMirror from '../code-mirror/code-mirror.ts';
import VmaFormulaGridCompSelect from '../select/select.ts';
import VmaFormulaGridCompSelectOptionGroup from '../select/option-group.ts';
import VmaFormulaGridCompSelectOption from '../select/option.ts';
import VmaFormulaGridCompToolbar from '../toolbar/toolbar.ts';
import { App } from 'vue';
import { injectGlobalConfig } from '../code-mirror/config.ts';
import { Props } from '../code-mirror/props.ts';

export const VmaFormulaGrid = Object.assign(VmaFormulaGridComp, {
    install: function (app: App, defaultConfig?: Props) {
        app.component('VmaFormulaGrid', VmaFormulaGridComp);
        app.component('VmaFormulaGridHeader', VmaFormulaGridHeader);
        app.component('VmaFormulaGridBody', VmaFormulaGridBody);
        app.component('VmaFormulaGridCompIcon', VmaFormulaGridCompIcon);
        app.component('VmaFormulaGridCompTextarea', VmaFormulaGridCompTextarea);
        app.component('VmaFormulaGridCompButton', VmaFormulaGridCompButton);
        app.component('VmaFormulaGridCompLoading', VmaFormulaGridCompLoading);
        app.component('VmaFormulaGridCompContextMenu', VmaFormulaGridCompContextMenu);
        app.component('VmaFormulaGridCompColorPickerBoard', VmaFormulaGridCompColorPickerBoard);
        app.component('VmaFormulaGridCompColorPickerDisplay', VmaFormulaGridCompColorPickerDisplay);
        app.component('VmaFormulaGridCompColorPickerHue', VmaFormulaGridCompColorPickerHue);
        app.component('VmaFormulaGridCompColorPickerLightness', VmaFormulaGridCompColorPickerLightness);
        app.component('VmaFormulaGridCompColorPickerPalette', VmaFormulaGridCompColorPickerPalette);
        app.component('VmaFormulaGridCompColorPicker', VmaFormulaGridCompColorPicker);
        app.component('VmaFormulaGridCompInput', VmaFormulaGridCompInput);
        app.component('VmaFormulaGridCompCodeMirror', VmaFormulaGridCompCodeMirror);
        app.component('VmaFormulaGridCompSelect', VmaFormulaGridCompSelect);
        app.component('VmaFormulaGridCompSelectOptionGroup', VmaFormulaGridCompSelectOptionGroup);
        app.component('VmaFormulaGridCompSelectOption', VmaFormulaGridCompSelectOption);
        app.component('VmaFormulaGridCompToolbar', VmaFormulaGridCompToolbar);
        injectGlobalConfig(app, defaultConfig);
    },
});

export default VmaFormulaGrid;
