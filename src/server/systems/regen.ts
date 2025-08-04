import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { DamageEntity, HealEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, regen] of world.query(Components.Regen).without(Components.Poison)) {
		const health = world.get(id, Components.Health);
		if (health) {
			HealEntity(world, id, regen.regenPerSecond * useDeltaTime());
		}
		world.insert(
			id,
			regen.patch({
				duration: regen.duration - useDeltaTime(),
			}),
		);
		if (regen.duration <= 0) {
			world.remove(id, Components.Regen);
		}
	}
};
