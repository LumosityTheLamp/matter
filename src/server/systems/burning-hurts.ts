import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { DamageEntity } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, health, burning] of world.query(Components.Health, Components.Burning)) {
		DamageEntity(world, id, burning.damagePerSecond * useDeltaTime());
	}
};
