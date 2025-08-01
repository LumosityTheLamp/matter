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
						damagePerSecond: 5,
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
						damagePerSecond: 5,
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
		"Gas",
		[
			Components.GiveStatusEffect({
				Enter: {
					Poison: {
						damagePerSecond: 0.1,
						duration: math.huge,
					},
				},
				Exit: {
					Poison: {
						damagePerSecond: 0.1,
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
