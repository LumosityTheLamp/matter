import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { DamageEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, health, poison] of world.query(Components.Health, Components.Poison)) {
		DamageEntity(world, id, (health.health > 1 ? poison.damagePerSecond : 0) * useDeltaTime());
	}
};
