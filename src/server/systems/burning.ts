import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { DamageEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, burning] of world.query(Components.Burning)) {
		const health = world.get(id, Components.Health);
		if (health) {
			DamageEntity(world, id, burning.damagePerSecond * useDeltaTime());
		}
		world.insert(
			id,
			burning.patch({
				duration: burning.duration - useDeltaTime(),
			}),
		);
		if (burning.duration <= 0) {
			world.remove(id, Components.Burning);
		}
	}
};
