import { Component, Entity, World } from "@rbxts/matter";
import { CollectionService } from "@rbxts/services";
import { Components } from "shared/components";

const zeTags: {
	[tag: string]: Component<any>[];
} = {
	GivePoison: [
		Components.GiveStatusEffect({
			Enter: {
				Poison: {
					damagePerSecond: 10,
					duration: math.huge,
				},
			},
			Exit: {
				Poison: {
					damagePerSecond: 5,
					duration: 2,
				},
			},
		}),
	],
	GiveBurning: [
		Components.GiveStatusEffect({
			Enter: {
				Burning: {
					damagePerSecond: 10,
					duration: math.huge,
				},
			},
			Exit: {
				Burning: {
					damagePerSecond: 5,
					duration: 2,
				},
			},
		}),
	],
	GiveSpeedBoost: [
		Components.GiveStatusEffect({
			Enter: {
				SpeedBoost: {
					multiplier: 1.75,
					duration: math.huge,
				},
			},
			Exit: {
				SpeedBoost: {
					multiplier: 1.5,
					duration: 2,
				},
			},
		}),
	],
	GiveJumpPowerBoost: [
		Components.GiveStatusEffect({
			Enter: {
				JumpPowerBoost: {
					multiplier: 1.75,
					duration: math.huge,
				},
			},
			Exit: {
				JumpPowerBoost: {
					multiplier: 1.5,
					duration: 2,
				},
			},
		}),
	],
	GiveBleed: [
		Components.GiveStatusEffect({
			Enter: {
				Bleed: {
					damagePercentage: 0.2,
					duration: math.huge,
				},
			},
			Exit: {
				Bleed: {
					damagePercentage: 0.1,
					duration: 2,
				},
			},
		}),
	],
	GiveRegen: [
		Components.GiveStatusEffect({
			Enter: {
				Regen: {
					regenPerSecond: 10,
					duration: math.huge,
				},
			},
			Exit: {
				Regen: {
					regenPerSecond: 5,
					duration: 2,
				},
			},
		}),
	],
	GiveOverRegen: [
		Components.GiveStatusEffect({
			Enter: {
				OverRegen: {
					regenPerSecond: 20,
					duration: math.huge,
				},
			},
			Exit: {
				OverRegen: {
					regenPerSecond: 10,
					duration: 2,
				},
			},
		}),
	],
	ToxicGas: [
		Components.GiveStatusEffect({
			Enter: {
				Poison: {
					damagePerSecond: 2,
					duration: math.huge,
				},
			},
			Exit: {
				Poison: {
					damagePerSecond: 1,
					duration: 1,
				},
			},
		}),
	],
	Billy: [
		Components.Humanoid(),
		Components.Health({
			value: 100,
			maxValue: 100,
		}),
		Components.NaturalRegen(),
		Components.Speed({
			value: 16,
		}),
		Components.JumpPower({
			value: 50,
		}),
	],
};

export function SetupTags(world: World) {
	function spawnEntity(instance: Instance, components: Component<any>[]) {
		const id = world.spawn();

		if (instance.IsA("BasePart")) {
			world.insert(
				id,
				Components.Part({
					instance: instance,
				}),
			);
		}

		if (instance.IsA("Model")) {
			world.insert(
				id,
				Components.Model({
					instance: instance,
				}),
			);
		}

		for (const dacomponent of components) {
			world.insert(id, dacomponent);
		}

		instance.SetAttribute("tagEntityId", id);
	}

	for (const [tag, component] of pairs(zeTags)) {
		for (const instance of CollectionService.GetTagged(tag as string)) {
			spawnEntity(instance, component);
		}

		CollectionService.GetInstanceAddedSignal(tag as string).Connect((instance) => {
			spawnEntity(instance, component);
		});

		CollectionService.GetInstanceRemovedSignal(tag as string).Connect((instance) => {
			const id = instance.GetAttribute("tagEntityId") as Entity;
			if (id) {
				world.despawn(id);
			}
		});
	}
}
