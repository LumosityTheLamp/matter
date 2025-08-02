import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, health, bleed] of world.query(Components.Health, Components.Bleed)) {
		world.insert(
			id,
			health.patch({
				health: health.health - health.maxHealth * bleed.damagePercentage * useDeltaTime(),
			}),
		);
	}
};
