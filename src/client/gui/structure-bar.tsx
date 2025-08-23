import Signal from "@rbxts/lemon-signal";
import { useDeltaTime, useEvent, World } from "@rbxts/matter";
import { useEffect } from "@rbxts/plasma/src/Runtime";
import { useMotion } from "@rbxts/pretty-vide-utils";
import { Players } from "@rbxts/services";
import Vide, { source } from "@rbxts/vide";
import { Components } from "shared/components";

const structure = source({
	value: 100,
	maxValue: 100,
	broken: 0,
});

export = {
	system: (world: World) => {
		for (const [id, zastructure] of world.query(Components.Structure, Components.LocalPlayer)) {
			structure(zastructure);
		}
	},
	gui: () => {
		return (
			<screengui
				Parent={Players.LocalPlayer.WaitForChild("PlayerGui")}
				ResetOnSpawn={false}
				IgnoreGuiInset={true}
			>
				<uipadding PaddingBottom={new UDim(0.25, 0)} />
				<frame
					Size={new UDim2(0.4, 0, 0, 16)}
					Position={new UDim2(0.5, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 1)}
					BackgroundColor3={new Color3(0.25, 0.125, 0)}
					ClipsDescendants={true}
				>
					<uistroke Color={new Color3(0, 0, 0)} Thickness={2} LineJoinMode={"Miter"} />
					<frame
						Position={new UDim2(0.5, 0, 0, 0)}
						AnchorPoint={new Vector2(0.5, 0)}
						Size={() => new UDim2(-(structure().value / structure().maxValue) + 1, 0, 1, 0)}
						BackgroundColor3={new Color3(1, structure().value / structure().maxValue, 0)}
					></frame>
				</frame>
			</screengui>
		);
	},
	priority: math.huge,
};
