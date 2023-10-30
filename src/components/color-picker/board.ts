import {
	computed,
	defineComponent,
	getCurrentInstance,
	h,
	nextTick,
	onMounted,
	provide,
	reactive,
	ref,
	watch,
} from "vue";
import { Guid } from "../../utils/guid.ts";
import { VmaFormulaGridCompColorPickerBoardConstructor } from "../../../types";
import propTypes from "vue-types";
import { clamp, Color } from "./utils/color.ts";
import { triggerDragEvent } from "../../utils/doms.ts";

export default defineComponent({
	name: "VmaFormulaGridCompColorPickerBoard",
	props: {
		color: propTypes.instanceOf(Color),
		round: propTypes.bool.def(false),
		hide: propTypes.bool.def(true),
	},
	emits: ["change"],
	setup(props, context) {
		const { emit } = context;

		const cursorElement = ref<HTMLElement | null>();
		const boardElement = ref<HTMLElement | null>();

		const cursorTop = ref(0);
		const cursorLeft = ref(0);

		const instance = getCurrentInstance();

		const hueHsv = {
			h: props.color?.hue || 0,
			s: 1,
			v: 1,
		};

		const hueColor = new Color(hueHsv).toHexString();

		const state = reactive({
			hueColor,
			saturation: props.color?.saturation || 0,
			brightness: props.color?.brightness || 0,
		});

		const handleDrag = (event: MouseEvent) => {
			if (instance) {
				const el = instance.vnode.el;
				const rect = el?.getBoundingClientRect();

				let left = event.clientX - rect.left;
				let top = event.clientY - rect.top;

				left = clamp(left, 0, rect.width);
				top = clamp(top, 0, rect.height);

				const saturation = left / rect.width;
				const bright = clamp(-(top / rect.height) + 1, 0, 1);

				cursorLeft.value = left;
				cursorTop.value = top;

				state.saturation = saturation;
				state.brightness = bright;

				emit("change", saturation, bright);
			}
		};

		const onClickBoard = (event: Event) => {
			const target = event.target;

			if (target !== boardElement.value) {
				handleDrag(event as MouseEvent);
			}
		};

		const getCursorStyle = computed(() => {
			return {
				top: cursorTop.value + "px",
				left: cursorLeft.value + "px",
			};
		});

		const updatePosition = () => {
			if (instance) {
				const el = instance.vnode.el;
				cursorLeft.value = state.saturation * el?.clientWidth;
				cursorTop.value = (1 - state.brightness) * el?.clientHeight;
			}
		};

		const $vmaFormulaGridCompColorPickerBoard = {
			uId: Guid.create().toString(),
			props,
			context,
		} as unknown as VmaFormulaGridCompColorPickerBoardConstructor;

		const renderVN = () =>
			h(
				"div",
				{
					ref: boardElement,
					class: [
						"vma-formula-grid-saturation",
						{
							"vma-formula-grid-saturation__chrome": props.round,
							"vma-formula-grid-saturation__hidden": props.hide,
						},
					],
					style: {
						backgroundColor: state.hueColor,
					},
					onClick: onClickBoard,
				},
				[
					h("div", {
						class: "vma-formula-grid-saturation__white",
					}),
					h("div", {
						class: "vma-formula-grid-saturation__black",
					}),
					h(
						"div",
						{
							ref: cursorElement,
							class: "vma-formula-grid-saturation__cursor",
							style: getCursorStyle.value,
						},
						h("div"),
					),
				],
			);

		onMounted(() => {
			if (instance && instance.vnode.el && cursorElement.value) {
				triggerDragEvent(cursorElement.value, {
					drag: (event: Event) => {
						handleDrag(event as MouseEvent);
					},
					end: (event: Event) => {
						handleDrag(event as MouseEvent);
					},
				});

				nextTick(() => {
					updatePosition();
				});
			}
		});

		watch(
			() => props.color,
			(value) => {
				Object.assign(state, {
					hueColor: new Color({ h: value!.hue, s: 1, v: 1 }).toHexString(),
					saturation: value!.saturation,
					brightness: value!.brightness,
				});
				updatePosition();
			},
			{ deep: true },
		);

		$vmaFormulaGridCompColorPickerBoard.renderVN = renderVN;

		provide(
			"$vmaFormulaGridCompColorPickerBoard",
			$vmaFormulaGridCompColorPickerBoard,
		);

		return $vmaFormulaGridCompColorPickerBoard;
	},
	render() {
		return this.renderVN();
	},
});
