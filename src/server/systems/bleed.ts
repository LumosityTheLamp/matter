import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { DamageEntity } from "shared/entity-functions";
import { rng } from "shared/util";

export = (world: World) => {
	for (const [id, bleed] of world.query(Components.Bleed)) {
		const health = world.get(id, Components.Health);
		if (health) {
			DamageEntity(world, id, health.maxHealth * bleed.damagePercentage * useDeltaTime());
		}
		world.insert(
			id,
			bleed.patch({
				duration: bleed.duration - useDeltaTime(),
			}),
		);
		if (bleed.duration <= 0) {
			world.remove(id, Components.Bleed);
		}
	}
};
