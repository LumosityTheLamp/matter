import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, health, humanoid] of world.query(Components.Health, Components.Humanoid)) {
		if (humanoid["instance"]) {
			humanoid.instance.Health = health.value;
			humanoid.instance.MaxHealth = health.maxValue;
		}
	}
};
