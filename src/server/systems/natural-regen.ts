import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { HealEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, health, naturalRegen] of world
		.query(Components.Health, Components.NaturalRegen)
		.without(Components.Poison)) {
		if (health.value > 0) {
			HealEntity(world, id, (health.maxValue / 100) * useDeltaTime());
		}
	}
};
