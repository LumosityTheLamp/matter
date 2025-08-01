import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, health, burning] of world.query(Components.Health, Components.Burning)) {
		world.insert(
			id,
			health.patch({
				health: health.health - burning.damagePerSecond * useDeltaTime(),
			}),
		);
	}
};
