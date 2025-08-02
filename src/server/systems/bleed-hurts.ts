import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { DamageEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, health, bleed] of world.query(Components.Health, Components.Bleed)) {
		DamageEntity(world, id, health.maxHealth * bleed.damagePercentage * useDeltaTime());
	}
};
