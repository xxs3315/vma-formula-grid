import {
	ComponentOptions,
	computed,
	createCommentVNode,
	CSSProperties,
	defineComponent,
	h,
	PropType,
	provide,
	resolveComponent,
} from "vue";

import { Guid } from "../../utils/guid";
import { VmaFormulaGridCompLoadingPropTypes } from "../../../types";
import {
	VmaFormulaGridCompButtonConstructor,
	VmaFormulaGridCompButtonPropTypes,
} from "../../../types";

export default defineComponent({
	name: "VmaFormulaGridCompButton",
	props: {
		text: String,
		icon: String,
		color: String,
		block: Boolean,
		plain: Boolean,
		round: Boolean,
		square: Boolean,
		loading: Boolean,
		disabled: Boolean,
		iconPrefix: String,
		loadingText: String,
		loadingCategory:
			String as PropType<VmaFormulaGridCompLoadingPropTypes.Category>,
		type: {
			type: String as PropType<VmaFormulaGridCompButtonPropTypes.Type>,
			default: "default",
		},
		size: {
			type: String as PropType<VmaFormulaGridCompButtonPropTypes.Size>,
			default: "normal",
		},
		iconPosition: {
			type: String as PropType<VmaFormulaGridCompButtonPropTypes.IconPosition>,
			default: "left",
		},
	},
	emits: ["click"],
	setup(props, context) {
		const { slots, emit } = context;

		const $vmaFormulaGridCompButton = {
			uId: Guid.create().toString(),
			props,
			context,
		} as unknown as VmaFormulaGridCompButtonConstructor;

		const LoadingComponent = resolveComponent(
			"VmaFormulaGridCompLoading",
		) as ComponentOptions;

		const IconComponent = resolveComponent(
			"VmaFormulaGridCompIcon",
		) as ComponentOptions;

		const renderText = () => {
			let text;
			if (props.loading) {
				text = props.loadingText;
			} else {
				text = slots.default ? slots.default({}) : () => props.text;
			}

			if (text) {
				return h(
					"span",
					{
						class: ["text"],
					},
					text,
				);
			}
			return h("span", {
				class: ["text"],
			});
		};
		const renderLoadingIcon = () => {
			if (slots.loading) {
				return slots.loading();
			}

			return h(LoadingComponent, {
				// class: 'loading',
				size: props.size,
				type: props.type,
				category: props.loadingCategory,
				style: {
					// color: 'currentColor',
					display: "inline-block",
				},
				currentColor: true,
			});
		};

		const renderIcon = () => {
			if (props.loading) {
				return renderLoadingIcon();
			}

			if (props.icon) {
				return h(IconComponent, {
					name: props.icon,
					size: props.size,
					type: props.type,
					color: "currentColor",
				});
			}
			return createCommentVNode();
		};

		const getStyle = () => {
			const { color, plain } = props;
			if (color) {
				const style: CSSProperties = {};

				style.color = plain ? color : "white";

				if (!plain) {
					// Use background instead of backgroundColor to make linear-gradient work
					style.background = color;
				}

				// hide border when color is linear-gradient
				if (color.indexOf("gradient") !== -1) {
					style.border = 0;
				} else {
					style.borderColor = color;
				}

				return style;
			}
			return {};
		};

		const onClick = (event: MouseEvent) => {
			if (!props.loading && !props.disabled) {
				emit("click", event);
			}
		};

		const classNames = computed(() => {
			const cns = ["vma-grid-button", props.size, props.type];
			if (props.plain) {
				cns.push("plain");
			}
			if (props.block) {
				cns.push("block");
			}
			if (props.round) {
				cns.push("round");
			}
			if (props.square) {
				cns.push("square");
			}
			if (props.loading) {
				cns.push("loading");
			}
			if (props.disabled) {
				cns.push("disabled");
			}
			return cns;
		});

		const renderVN = () =>
			h(
				"button",
				{
					class: classNames.value,
					style: getStyle(),
					disabled: props.disabled,
					onClick,
				},
				[
					h(
						"div",
						{
							class: ["content"],
						},
						[
							props.iconPosition === "left" && renderIcon(),
							renderText(),
							props.iconPosition === "right" && renderIcon(),
						],
					),
				],
			);
		$vmaFormulaGridCompButton.renderVN = renderVN;

		provide("$vmaFormulaGridCompButton", $vmaFormulaGridCompButton);

		return $vmaFormulaGridCompButton;
	},
	render() {
		return this.renderVN();
	},
});
