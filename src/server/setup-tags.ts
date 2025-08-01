import { Component, Entity, World } from "@rbxts/matter";
import { CollectionService } from "@rbxts/services";
import TableUtil from "@rbxts/tableutil";
import { Components } from "shared/components";

const zeTags = new Map<string, Component<any>[]>([
	[
		"GivePoison",
		[
			Components.GiveStatusEffect({
				effect: Components.Poison({
					damagePerSecond: 5,
					duration: 4,
				}),
			}),
		],
	],
]);

export function SetupTags(world: World) {
	function spawnEntity(instance: Instance, component: Component<any>[]) {
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

		for (const dacomponent of component) {
			world.insert(id, TableUtil.Copy(dacomponent));
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
