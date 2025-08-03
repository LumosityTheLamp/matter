import { useDeltaTime, World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { Components } from "shared/components";
import { HealEntity } from "shared/entity-functions";
import { GameState } from "shared/game-state";

export = (world: World) => {
	for (const [id, health, naturalRegen] of world
		.query(Components.Health, Components.NaturalRegen)
		.without(Components.Poison)) {
		if (health.health > 0) {
			HealEntity(world, id, (health.maxHealth / 100) * useDeltaTime());
		}
	}
};
