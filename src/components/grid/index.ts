import VmaFormulaGridComp from "./grid.ts";
import VmaFormulaGridHeader from "./header.ts";
import VmaFormulaGridBody from "./body.ts";

import VmaFormulaGridCompIcon from "../icon/icon.ts";
import VmaFormulaGridCompContextMenu from "../context-menu/context-menu.ts";
import VmaFormulaGridCompTextarea from "../textarea/textarea.ts";
import VmaFormulaGridCompButton from "../button/button.ts";
import VmaFormulaGridCompLoading from "../loading/loading.ts";
import VmaFormulaGridCompColorPicker from "../color-picker/color-picker.ts";
import VmaFormulaGridCompColorPickerBoard from "../color-picker/board.ts";
import VmaFormulaGridCompColorPickerDisplay from "../color-picker/display.ts";
import VmaFormulaGridCompColorPickerHue from "../color-picker/hue.ts";
import VmaFormulaGridCompColorPickerLightness from "../color-picker/lightness.ts";
import VmaFormulaGridCompColorPickerPalette from "../color-picker/palette.ts";
import { App } from "vue";

export const VmaFormulaGrid = Object.assign(VmaFormulaGridComp, {
	install: function (app: App) {
		app.component("VmaFormulaGrid", VmaFormulaGridComp);
		app.component("VmaFormulaGridHeader", VmaFormulaGridHeader);
		app.component("VmaFormulaGridBody", VmaFormulaGridBody);
		app.component("VmaFormulaGridCompIcon", VmaFormulaGridCompIcon);
		app.component("VmaFormulaGridCompTextarea", VmaFormulaGridCompTextarea);
		app.component("VmaFormulaGridCompButton", VmaFormulaGridCompButton);
		app.component("VmaFormulaGridCompLoading", VmaFormulaGridCompLoading);
		app.component(
			"VmaFormulaGridCompContextMenu",
			VmaFormulaGridCompContextMenu,
		);
		app.component(
			"VmaFormulaGridCompColorPickerBoard",
			VmaFormulaGridCompColorPickerBoard,
		);
		app.component(
			"VmaFormulaGridCompColorPickerDisplay",
			VmaFormulaGridCompColorPickerDisplay,
		);
		app.component(
			"VmaFormulaGridCompColorPickerHue",
			VmaFormulaGridCompColorPickerHue,
		);
		app.component(
			"VmaFormulaGridCompColorPickerLightness",
			VmaFormulaGridCompColorPickerLightness,
		);
		app.component(
			"VmaFormulaGridCompColorPickerPalette",
			VmaFormulaGridCompColorPickerPalette,
		);
		app.component(
			"VmaFormulaGridCompColorPicker",
			VmaFormulaGridCompColorPicker,
		);
	},
});

export default VmaFormulaGrid;
