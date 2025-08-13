import { AnyComponent, Entity, World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { Components } from "shared/components";
import { Remotes } from "shared/remotes";
import { MainWorld } from "shared/world";

const entityIdMap = new Map<string, Entity>();

Remotes.ReplicateComponents.connect((changes) => {
	for (const [serverEntityId, componentMap] of changes) {
		let clientEntityId = entityIdMap.get(serverEntityId);

		if (clientEntityId && next(componentMap) === undefined) {
			MainWorld.despawn(clientEntityId);
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
				componentsToRemove.push((Components as unknown as Record<string, AnyComponent>)[name] as AnyComponent);
			}
		}

		if (clientEntityId === undefined) {
			clientEntityId = MainWorld.spawn();

			for (const c of componentsToInsert) {
				MainWorld.insert(clientEntityId, c);
			}

			MainWorld.insert(clientEntityId, Components.Networked());

			entityIdMap.set(serverEntityId, clientEntityId);
		} else {
			for (const c of componentsToInsert) {
				MainWorld.insert(clientEntityId, c);
			}

			for (const c of componentsToRemove) {
				MainWorld.remove(clientEntityId, c as ComponentCtor);
			}
		}
	}
});
