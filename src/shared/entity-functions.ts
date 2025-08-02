import { Entity, World } from "@rbxts/matter";
import { Components } from "./components";

export function DamageEntity(world: World, entityId: Entity, amount: number) {
	if (world.contains(entityId)) {
		const health = world.get(entityId, Components.Health);

		if (health) {
			world.insert(
				entityId,
				health.patch({
					health: math.clamp(health.health - amount, 0, health.maxHealth),
				}),
			);
		}
	}
}

export function HealEntity(world: World, entityId: Entity, amount: number) {
	if (world.contains(entityId)) {
		const health = world.get(entityId, Components.Health);

		if (health) {
			world.insert(
				entityId,
				health.patch({
					health: math.clamp(health.health + amount, 0, health.maxHealth),
				}),
			);
		}
	}
}
