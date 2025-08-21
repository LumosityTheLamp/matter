import Signal from "@rbxts/lemon-signal";
import { useDeltaTime, useEvent, World } from "@rbxts/matter";
import { useEffect } from "@rbxts/plasma/src/Runtime";
import { useMotion } from "@rbxts/pretty-vide-utils";
import { Players } from "@rbxts/services";
import Vide, { source } from "@rbxts/vide";
import { Components } from "shared/components";

const bossName = source("");
const health = source({
	value: 100,
	maxValue: 100,
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
const regen = source({
	regenPerSecond: 0,
	duration: 0,
});
const overRegen = source({
	regenPerSecond: 0,
	duration: 0,
});

const overHealth = source({
	value: 0,
});

const damageThing = source(1);
const healThing = source(1);

function GetDebuffDamage(): number {
	return (
		math.min(poison().damagePerSecond * poison().duration, health().value - math.max(health().maxValue / 100, 1)) +
		burning().damagePerSecond * burning().duration +
		health().maxValue * bleed().damagePercentage * bleed().duration
	);
}

function GetBuffHeal(): number {
	return regen().regenPerSecond * regen().duration + overRegen().regenPerSecond * overRegen().duration;
}

function GetTotal(): number {
	return math.clamp(GetDebuffDamage() - overHealth().value, 0, health().maxValue);
}

function GetHealTotal(): number {
	return math.clamp(GetBuffHeal(), 0, health().maxValue);
}

export = {
	system: (world: World) => {
		poison({
			damagePerSecond: 0,
			duration: 0,
		});
		burning({
			damagePerSecond: 0,
			duration: 0,
		});
		bleed({
			damagePercentage: 0,
			duration: 0,
		});
		overHealth({
			value: 0,
		});

		for (const [id, boss] of world.query(Components.Boss)) {
			bossName(boss.name);
		}

		for (const [id, zahealth] of world.query(Components.Health, Components.Boss)) {
			if (health().value < zahealth.value && damageThing() < zahealth.value / zahealth.maxValue) {
				damageThing(zahealth.value / zahealth.maxValue);
			}
			if (health().value > zahealth.value && healThing() > zahealth.value / zahealth.maxValue) {
				healThing(zahealth.value / zahealth.maxValue);
			}
			health(zahealth);
		}

		for (const [id, zapoison] of world.query(Components.Poison, Components.Boss)) {
			poison(zapoison);
		}

		for (const [id, zaburning] of world.query(Components.Burning, Components.Boss)) {
			burning(zaburning);
		}

		for (const [id, zableed] of world.query(Components.Bleed, Components.Boss)) {
			bleed(zableed);
		}

		for (const [id, zaoverHealth] of world.query(Components.OverHealth, Components.Boss)) {
			overHealth(zaoverHealth);
		}

		for (const [id, zaregen] of world.query(Components.Regen, Components.Boss)) {
			regen(zaregen);
		}

		for (const [id, zaoverregen] of world.query(Components.OverRegen, Components.Boss)) {
			overRegen(zaoverregen);
		}

		damageThing(math.lerp(damageThing(), health().value / health().maxValue, 0.1));
		healThing(math.lerp(healThing(), health().value / health().maxValue, 0.1));
	},
	gui: () => {
		return (
			<screengui
				Parent={Players.LocalPlayer.WaitForChild("PlayerGui")}
				ResetOnSpawn={false}
				IgnoreGuiInset={false}
			>
				<uipadding PaddingTop={new UDim(0.1, 0)} PaddingLeft={new UDim(0.05, 0)} />
				<textlabel
					Position={new UDim2(0, 0, 0, -40)}
					Size={new UDim2(1, 0, 0, 16)}
					TextStrokeColor3={new Color3(0, 0, 0)}
					TextStrokeTransparency={0}
					Text={bossName}
					TextColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					TextXAlignment={"Left"}
					TextYAlignment={"Top"}
					TextSize={28}
					Font={"Fondamento"}
				></textlabel>
				<frame
					Size={new UDim2(0.2, 0, 0, 16)}
					Position={new UDim2(0, 0, 0, 8)}
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
						Size={() =>
							new UDim2((health().value + GetHealTotal() - GetTotal()) / health().maxValue, 0, 1, 0)
						}
						BackgroundColor3={new Color3(0, 1, 0)}
					></frame>
					<frame
						Size={() => new UDim2(healThing() - GetTotal() / health().maxValue, 0, 1, 0)}
						BackgroundColor3={new Color3(1, 0, 0)}
					></frame>
					<frame
						Position={() => new UDim2(healThing() - GetTotal() / health().maxValue, 0, 0, 0)}
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
