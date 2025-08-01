import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, jumpPowerBoost] of world.query(Components.JumpPowerBoost).without(Components.GiveStatusEffect)) {
		world.insert(
			id,
			jumpPowerBoost.patch({
				duration: jumpPowerBoost.duration - useDeltaTime(),
			}),
		);
		if (jumpPowerBoost.duration <= 0) {
			world.remove(id, Components.JumpPowerBoost);
		}
	}
};
