import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { DamageEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, poison] of world.query(Components.Poison)) {
		const health = world.get(id, Components.Health);
		if (health) {
			DamageEntity(world, id, (health.health > 1 ? poison.damagePerSecond : 0) * useDeltaTime());
		}
		world.insert(
			id,
			poison.patch({
				duration: poison.duration - useDeltaTime(),
			}),
		);
		if (poison.duration <= 0) {
			world.remove(id, Components.Poison);
		}
	}
};
