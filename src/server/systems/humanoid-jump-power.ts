import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, jumpPower, humanoid] of world.query(Components.JumpPower, Components.Humanoid)) {
		if (humanoid["instance"]) {
			let mult = 1;
			const buff = world.get(id, Components.JumpPowerBoost);
			if (buff) {
				mult *= buff.multiplier;
			}
			const blocking = world.get(id, Components.Blocking);
			if (blocking) {
				mult = 0;
			}
			humanoid.instance.JumpPower = jumpPower.value * mult;
		}
	}
};
