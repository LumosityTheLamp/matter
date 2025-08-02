import { useDeltaTime, World } from "@rbxts/matter";
import { Widgets } from "@rbxts/plasma";
import { Components } from "shared/components";
import { GameState } from "shared/game-state";

export = (world: World) => {
	for (const [id, health, naturalRegen] of world.query(Components.Health, Components.NaturalRegen)) {
		world.insert(
			id,
			health.patch({
				health: math.clamp(health.health + (health.maxHealth / 100) * useDeltaTime(), 0, health.maxHealth),
			}),
		);
	}
};
