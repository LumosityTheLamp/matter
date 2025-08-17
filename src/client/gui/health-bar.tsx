import Signal from "@rbxts/lemon-signal";
import { useDeltaTime, useEvent, World } from "@rbxts/matter";
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
const regen = source({
	regenPerSecond: 0,
	duration: 0,
});
const overRegen = source({
	regenPerSecond: 0,
	duration: 0,
});

const overHealth = source({
	health: 0,
});

const damageThing = source(1);
const healThing = source(1);

function GetDebuffDamage(): number {
	return (
		math.min(
			poison().damagePerSecond * poison().duration,
			health().health - math.max(health().maxHealth / 100, 1),
		) +
		burning().damagePerSecond * burning().duration +
		health().maxHealth * bleed().damagePercentage * bleed().duration
	);
}

function GetBuffHeal(): number {
	return regen().regenPerSecond * regen().duration + overRegen().regenPerSecond * overRegen().duration;
}

function GetTotal(): number {
	return math.clamp(GetDebuffDamage() - overHealth().health, 0, health().maxHealth);
}

function GetHealTotal(): number {
	return math.clamp(GetBuffHeal(), 0, health().maxHealth);
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
			health: 0,
		});

		for (const [id, zahealth] of world.query(Components.Health, Components.LocalPlayer)) {
			if (health().health < zahealth.health && damageThing() < zahealth.health / zahealth.maxHealth) {
				damageThing(zahealth.health / zahealth.maxHealth);
			}
			if (health().health > zahealth.health && healThing() > zahealth.health / zahealth.maxHealth) {
				healThing(zahealth.health / zahealth.maxHealth);
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

		for (const [id, zaoverHealth] of world.query(Components.OverHealth, Components.LocalPlayer)) {
			overHealth(zaoverHealth);
		}

		for (const [id, zaregen] of world.query(Components.Regen, Components.LocalPlayer)) {
			regen(zaregen);
		}

		for (const [id, zaoverregen] of world.query(Components.OverRegen, Components.LocalPlayer)) {
			overRegen(zaoverregen);
		}

		damageThing(math.lerp(damageThing(), health().health / health().maxHealth, 0.1));
		healThing(math.lerp(healThing(), health().health / health().maxHealth, 0.1));
	},
	gui: () => {
		return (
			<screengui Parent={Players.LocalPlayer.WaitForChild("PlayerGui")} ResetOnSpawn={false}>
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
						Size={() =>
							new UDim2((health().health + GetHealTotal() - GetTotal()) / health().maxHealth, 0, 1, 0)
						}
						BackgroundColor3={new Color3(0, 1, 0)}
					></frame>
					<frame
						Size={() => new UDim2(healThing() - GetTotal() / health().maxHealth, 0, 1, 0)}
						BackgroundColor3={new Color3(1, 0, 0)}
					></frame>
					<frame
						Position={() => new UDim2(healThing() - GetTotal() / health().maxHealth, 0, 0, 0)}
						AnchorPoint={new Vector2(1, 0)}
						Size={() => new UDim2(0.1, 0, 1, 0)}
						BackgroundColor3={new Color3(0.5, 0, 0)}
					></frame>
					<frame
						Size={() => new UDim2(overHealth().health / health().maxHealth, 0, 1, 0)}
						BackgroundColor3={new Color3(1, 1, 0)}
					></frame>
				</frame>
			</screengui>
		);
	},
	priority: math.huge,
};
