import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, speedBoost] of world.query(Components.SpeedBoost).without(Components.GiveStatusEffect)) {
		world.insert(
			id,
			speedBoost.patch({
				duration: speedBoost.duration - useDeltaTime(),
			}),
		);
		if (speedBoost.duration <= 0) {
			world.remove(id, Components.SpeedBoost);
		}
	}
};
