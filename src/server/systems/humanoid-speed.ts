import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, speed, humanoid] of world.query(Components.Speed, Components.Humanoid)) {
		if (humanoid["instance"]) {
			const buff = world.get(id, Components.SpeedBoost);
			humanoid.instance.WalkSpeed = speed.speed * (buff ? buff.multiplier : 1);
		}
	}
};
