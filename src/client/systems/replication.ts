import { AnyComponent, Entity, World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { Components } from "shared/components";
import { Routes } from "shared/routes";

const entityIdMap = new Map<string, Entity>();

export = (world: World) => {
	for (const [index, player, changes] of Routes.MatterReplication.query()) {
		for (const [serverEntityId, componentMap] of pairs(changes)) {
			let clientEntityId = entityIdMap.get(serverEntityId as string);

			if (clientEntityId && next(componentMap) === undefined) {
				world.despawn(clientEntityId);
				entityIdMap.delete(serverEntityId as string);
				continue;
			}

			const componentsToInsert: AnyComponent[] = [];
			const componentsToRemove: AnyComponent[] = [];

			for (const [name, container] of pairs(componentMap)) {
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

				entityIdMap.set(serverEntityId as string, clientEntityId);
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
