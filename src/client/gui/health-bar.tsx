import Signal from "@rbxts/lemon-signal";
import { useDeltaTime, useEvent, World } from "@rbxts/matter";
import { useEffect } from "@rbxts/plasma/src/Runtime";
import { useMotion } from "@rbxts/pretty-vide-utils";
import { Players } from "@rbxts/services";
import Vide, { source } from "@rbxts/vide";
import { Components } from "shared/components";

const health = source({
	value: 100,
	maxValue: 100,
});

const overHealth = source({
	value: 0,
});

const damageThing = source(1);
const healThing = source(1);

export = {
	system: (world: World) => {
		for (const [id, zahealth] of world.query(Components.Health, Components.LocalPlayer)) {
			if (health().value < zahealth.value && damageThing() < zahealth.value / zahealth.maxValue) {
				damageThing(zahealth.value / zahealth.maxValue);
			}
			if (health().value > zahealth.value && healThing() > zahealth.value / zahealth.maxValue) {
				healThing(zahealth.value / zahealth.maxValue);
			}
			health(zahealth);
		}

		for (const [id, zaoverHealth] of world.query(Components.OverHealth, Components.LocalPlayer)) {
			overHealth(zaoverHealth);
		}

		damageThing(math.lerp(damageThing(), health().value / health().maxValue, 0.1));
		healThing(math.lerp(healThing(), health().value / health().maxValue, 0.1));
	},
	gui: () => {
		return (
			<screengui
				Parent={Players.LocalPlayer.WaitForChild("PlayerGui")}
				ResetOnSpawn={false}
				IgnoreGuiInset={true}
			>
				<uipadding PaddingBottom={new UDim(0.1, 0)} PaddingLeft={new UDim(0.05, 0)} />
				<frame
					Size={new UDim2(0.2, 0, 0, 16)}
					Position={new UDim2(0, 0, 1, 0)}
					AnchorPoint={new Vector2(0, 1)}
					BackgroundColor3={new Color3(0, 0, 0)}
					ClipsDescendants={true}
				>
					<uistroke Color={new Color3(0, 0, 0)} Thickness={2} LineJoinMode={"Miter"} />
					<frame
						Size={() => {
							return new UDim2(damageThing(), 0, 1, 0);
						}}
						BackgroundColor3={new Color3(1, 1, 1)}
					></frame>
					<frame
						Size={() => new UDim2(health().value / health().maxValue, 0, 1, 0)}
						BackgroundColor3={new Color3(0, 1, 0)}
					></frame>
					<frame Size={() => new UDim2(healThing(), 0, 1, 0)} BackgroundColor3={new Color3(1, 0, 0)}></frame>
					<frame
						Position={() => new UDim2(healThing(), 0, 0, 0)}
						AnchorPoint={new Vector2(1, 0)}
						Size={() => new UDim2(0.1, 0, 1, 0)}
						BackgroundColor3={new Color3(0.5, 0, 0)}
					></frame>
					<frame
						Size={() => new UDim2(overHealth().value / health().maxValue, 0, 1, 0)}
						BackgroundColor3={new Color3(1, 1, 0)}
					></frame>
				</frame>
			</screengui>
		);
	},
	priority: math.huge,
};
