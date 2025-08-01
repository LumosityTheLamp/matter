import { Component, Entity, World } from "@rbxts/matter";
import { CollectionService } from "@rbxts/services";
import TableUtil from "@rbxts/tableutil";
import { Components } from "shared/components";

const zeTags = new Map<string, Component<any>[]>([
	[
		"GivePoison",
		[
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
						duration: 4,
					},
				},
			}),
		],
	],
	[
		"GiveBurning",
		[
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
						duration: 4,
					},
				},
			}),
		],
	],
	[
		"GiveSpeedBoost",
		[
			Components.GiveStatusEffect({
				Enter: {
					SpeedBoost: {
						multiplier: 2,
						duration: math.huge,
					},
				},
				Exit: {
					SpeedBoost: {
						multiplier: 1.5,
						duration: 5,
					},
				},
			}),
		],
	],
	[
		"GiveJumpPowerBoost",
		[
			Components.GiveStatusEffect({
				Enter: {
					JumpPowerBoost: {
						multiplier: 2,
						duration: math.huge,
					},
				},
				Exit: {
					JumpPowerBoost: {
						multiplier: 1.5,
						duration: 5,
					},
				},
			}),
		],
	],
	[
		"Gas",
		[
			Components.GiveStatusEffect({
				Enter: {
					Poison: {
						damagePerSecond: 1,
						duration: math.huge,
					},
				},
				Exit: {
					Poison: {
						damagePerSecond: 0.5,
						duration: 1,
					},
				},
			}),
		],
	],
	[
		"Billy",
		[
			Components.Humanoid(),
			Components.Health({
				health: 100,
				maxHealth: 100,
			}),
			Components.NaturalRegen(),
			Components.Speed({
				speed: 16,
			}),
			Components.JumpPower({
				power: 50,
			}),
		],
	],
]);

export function SetupTags(world: World) {
	function spawnEntity(instance: Instance, components: Component<any>[]) {
		const id = world.spawn();

		if (instance.IsA("BasePart")) {
			world.insert(
				id,
				Components.Part({
					part: instance,
				}),
			);
		}

		if (instance.IsA("Model")) {
			world.insert(
				id,
				Components.Model({
					model: instance,
				}),
			);
		}

		for (const dacomponent of components) {
			world.insert(id, dacomponent);
		}

		instance.SetAttribute("tagEntityId", id);
	}

	zeTags.forEach((component, tagName) => {
		for (const instance of CollectionService.GetTagged(tagName)) {
			spawnEntity(instance, component);
		}

		CollectionService.GetInstanceAddedSignal(tagName).Connect((instance) => {
			spawnEntity(instance, component);
		});

		CollectionService.GetInstanceRemovedSignal(tagName).Connect((instance) => {
			const id = instance.GetAttribute("tagEntityId") as Entity;
			if (id) {
				world.despawn(id);
			}
		});
	});
}
