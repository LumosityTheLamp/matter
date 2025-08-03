import Signal from "@rbxts/lemon-signal";
import { useDeltaTime, World } from "@rbxts/matter";
import { useEffect } from "@rbxts/plasma/src/Runtime";
import { useMotion } from "@rbxts/pretty-vide-utils";
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
const burning = source({
	damagePerSecond: 0,
	duration: 0,
});
const bleed = source({
	damagePercentage: 0,
	duration: 0,
});

let damageThingValue = 1;
let damageTimer = 0;

const setSignal = new Signal();
const smoothSignal = new Signal();

function GetTotal(): number {
	return (
		poison().damagePerSecond * poison().duration +
		burning().damagePerSecond * burning().duration +
		health().maxHealth * bleed().damagePercentage * bleed().duration
	);
}

export = {
	system: (world: World) => {
		for (const [id, zahealth] of world.query(Components.Health, Components.LocalPlayer)) {
			if (health().health > zahealth.health) {
				damageTimer = 2;
			}

			if (health().health < zahealth.health && damageThingValue < zahealth.health / zahealth.maxHealth) {
				setSignal.Fire();
			}
			health(zahealth);
		}

		for (const [id, zapoison] of world.query(Components.Poison, Components.LocalPlayer)) {
			poison(zapoison);
		}

		for (const [id, zaburning] of world.query(Components.Burning, Components.LocalPlayer)) {
			burning(zaburning);
		}

		for (const [id, zableed] of world.query(Components.Bleed, Components.LocalPlayer)) {
			bleed(zableed);
		}

		if (damageTimer > 0) {
			damageTimer -= useDeltaTime();

			if (damageTimer <= 0) {
				smoothSignal.Fire();
			}
		}
	},
	gui: () => {
		const [damageThingSource, damageThingMotion] = useMotion(1);

		setSignal.Connect(() => {
			damageThingMotion.immediate(health().health / health().maxHealth);
		});

		smoothSignal.Connect(() => {
			damageThingMotion.linear(health().health / health().maxHealth);
		});

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
						Size={() => {
							damageThingValue = damageThingSource();
							return new UDim2(damageThingSource(), 0, 1, 0);
						}}
						BackgroundColor3={new Color3(1, 0.5, 0)}
					>
						<uicorner CornerRadius={new UDim(0, 8)} />
					</frame>
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
								GetTotal() >= health().maxHealth
									? health().health / health().maxHealth
									: GetTotal() / health().maxHealth,
								0,
								1,
								0,
							)
						}
						BackgroundColor3={new Color3(0.5, 0, 0)}
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
