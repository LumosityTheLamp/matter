import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, overHealth, health] of world
		.query(Components.OverHealth, Components.Health)
		.without(Components.OverRegen)) {
		world.insert(
			id,
			overHealth.patch({
				health: overHealth.health - (health.maxHealth / 50) * useDeltaTime(),
			}),
		);
		if (overHealth.health <= 0) {
			world.remove(id, Components.OverHealth);
		}
	}
};
