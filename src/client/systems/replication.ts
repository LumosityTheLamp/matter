import { AnyComponent, Entity, World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { Components } from "shared/components";
import { Routes } from "shared/routes";

const entityIdMap = new Map<string, Entity>();

export = (world: World) => {
	for (const [index, player, changes] of Routes.MatterReplication.query()) {
		for (const [serverEntityId, componentMap] of changes) {
			let clientEntityId = entityIdMap.get(serverEntityId);

			if (clientEntityId && next(componentMap) === undefined) {
				world.despawn(clientEntityId);
				entityIdMap.delete(serverEntityId);
				continue;
			}

			const componentsToInsert: AnyComponent[] = [];
			const componentsToRemove: AnyComponent[] = [];

			for (const [name, container] of componentMap) {
				if (container.data) {
					componentsToInsert.push(
						(Components as Record<string, (data: unknown) => AnyComponent>)[name](
							container.data,
						) as AnyComponent,
					);
				} else {
					componentsToRemove.push(
						(Components as unknown as Record<string, AnyComponent>)[name] as AnyComponent,
					);
				}
			}

			if (clientEntityId === undefined) {
				clientEntityId = world.spawn();

				for (const c of componentsToInsert) {
					world.insert(clientEntityId, c);
				}

				world.insert(clientEntityId, Components.Networked());

				entityIdMap.set(serverEntityId, clientEntityId);
			} else {
				for (const c of componentsToInsert) {
					world.insert(clientEntityId, c);
				}

				for (const c of componentsToRemove) {
					world.remove(clientEntityId, c as ComponentCtor);
				}
			}
		}
	}
};
