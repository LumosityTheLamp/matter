import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, speed, humanoid] of world.query(Components.Speed, Components.Humanoid)) {
		if (humanoid["instance"]) {
			let mult = 1;
			const buff = world.get(id, Components.SpeedBoost);
			if (buff) {
				mult *= buff.multiplier;
			}
			const blocking = world.get(id, Components.Blocking);
			if (blocking) {
				mult = 0;
			}
			humanoid.instance.WalkSpeed = speed.value * mult;
		}
	}
};
