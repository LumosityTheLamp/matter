import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, jumpPower, humanoid] of world.query(Components.JumpPower, Components.Humanoid)) {
		if (humanoid["instance"]) {
			const buff = world.get(id, Components.JumpPowerBoost);
			humanoid.instance.JumpPower = jumpPower.power * (buff ? buff.multiplier : 1);
		}
	}
};
