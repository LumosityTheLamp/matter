import Signal from "@rbxts/lemon-signal";
import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import Vide, { source } from "@rbxts/vide";
import { Components } from "shared/components";

const health = source({
	health: 100,
	maxHealth: 100,
});
const poison = source({
	damagePerSecond: 0,
	duration: 0,
});

export = {
	system: (world: World) => {
		for (const [id, zahealth] of world.query(Components.Health, Components.LocalPlayer)) {
			health(zahealth);
		}

		for (const [id, zapoison] of world.query(Components.Poison, Components.LocalPlayer)) {
			poison({
				damagePerSecond: zapoison.damagePerSecond,
				duration: zapoison.duration,
			});
		}
	},
	gui: () => {
		return (
			<screengui Parent={Players.LocalPlayer.WaitForChild("PlayerGui")} ResetOnSpawn={false}>
				<uipadding PaddingBottom={new UDim(0.1, 0)} />
				<frame
					Size={new UDim2(0.5, 0, 0, 32)}
					Position={new UDim2(0.5, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 1)}
					BackgroundColor3={new Color3(0, 0, 0)}
					ClipsDescendants={true}
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
					<uistroke Color={new Color3(0, 0, 0)} Thickness={4} />
					<frame
						Size={() => new UDim2(health().health / health().maxHealth, 0, 1, 0)}
						BackgroundColor3={new Color3(1, 0, 0)}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
					</frame>
					<frame
						Position={() => new UDim2(health().health / health().maxHealth, 0, 0, 0)}
						AnchorPoint={new Vector2(1, 0)}
						Size={() =>
							new UDim2(
								poison().damagePerSecond * poison().duration >= health().maxHealth
									? 1
									: (poison().damagePerSecond * poison().duration) / health().maxHealth,
								0,
								1,
								0,
							)
						}
						BackgroundColor3={new Color3(0, 1, 0)}
						BackgroundTransparency={() => (poison().duration > 0 ? 0 : 1)}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
					</frame>
					<textlabel
						Size={new UDim2(1, 0, 1, 0)}
						BackgroundTransparency={1}
						TextSize={24}
						Text={() => `${math.ceil(health().health)} / ${math.ceil(health().maxHealth)}`}
						TextColor3={new Color3(1, 1, 1)}
						TextStrokeColor3={new Color3(0, 0, 0)}
						TextStrokeTransparency={0}
						Font={"Oswald"}
					/>
				</frame>
			</screengui>
		);
	},
};
