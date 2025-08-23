import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { HealEntityStructure } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, structure] of world.query(Components.Structure)) {
		if (structure.broken <= 0) {
			HealEntityStructure(world, id, useDeltaTime());
		} else {
			world.insert(
				id,
				structure.patch({
					broken: structure.broken - useDeltaTime(),
				}),
			);
		}
	}
};
