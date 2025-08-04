import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { OverHealEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, overRegen] of world.query(Components.OverRegen)) {
		const health = world.get(id, Components.Health);
		if (health) {
			OverHealEntity(world, id, overRegen.regenPerSecond * useDeltaTime());
		}
		world.insert(
			id,
			overRegen.patch({
				duration: overRegen.duration - useDeltaTime(),
			}),
		);
		if (overRegen.duration <= 0) {
			world.remove(id, Components.OverRegen);
		}
	}
};
