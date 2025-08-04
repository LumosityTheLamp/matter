import { Entity, World } from "@rbxts/matter";
import { Components } from "./components";

export function DamageEntity(world: World, entityId: Entity, amount: number) {
	if (world.contains(entityId)) {
		const health = world.get(entityId, Components.Health);

		if (health) {
			const overHealth = world.get(entityId, Components.OverHealth);

			if (overHealth) {
				world.insert(
					entityId,
					overHealth.patch({
						health: math.clamp(overHealth.health - amount, 0, health.maxHealth),
					}),
				);
				if (overHealth.health <= 0) {
					world.remove(entityId, Components.OverHealth);
				}
			} else {
				world.insert(
					entityId,
					health.patch({
						health: math.clamp(health.health - amount, 0, health.maxHealth),
					}),
				);
			}
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

export function OverHealEntity(world: World, entityId: Entity, amount: number) {
	if (world.contains(entityId)) {
		const health = world.get(entityId, Components.Health);

		if (health) {
			const overheal = math.clamp(health.health + amount - health.maxHealth, 0, health.maxHealth);
			world.insert(
				entityId,
				health.patch({
					health: math.clamp(health.health + amount, 0, health.maxHealth),
				}),
			);
			if (overheal > 0) {
				const currentOverhealth = world.get(entityId, Components.OverHealth);
				if (currentOverhealth) {
					world.insert(
						entityId,
						currentOverhealth.patch({
							health: math.clamp(currentOverhealth.health + overheal, 0, health.maxHealth),
						}),
					);
				} else {
					world.insert(
						entityId,
						Components.OverHealth({
							health: overheal,
						}),
					);
				}
			}
		}
	}
}
