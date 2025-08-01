import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, health, poison] of world.query(Components.Health, Components.Poison)) {
		world.insert(
			id,
			health.patch({
				health: health.health - poison.damagePerSecond * useDeltaTime(),
			}),
		);
	}
};
