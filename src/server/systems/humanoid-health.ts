import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, health, humanoid] of world.query(Components.Health, Components.Humanoid)) {
		humanoid.humanoid.Health = health.health;
		humanoid.humanoid.MaxHealth = health.maxHealth;
	}
};
