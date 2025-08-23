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
						value: math.clamp(overHealth.value - amount, 0, health.maxValue),
					}),
				);
				if (overHealth.value <= 0) {
					world.remove(entityId, Components.OverHealth);
				}
			} else {
				world.insert(
					entityId,
					health.patch({
						value: math.clamp(health.value - amount, 0, health.maxValue),
					}),
				);
			}
		}
	}
}

export function DamageEntityStructure(
	world: World,
	entityId: Entity,
	amount: number,
	shouldBreak?: boolean | undefined,
) {
	if (world.contains(entityId)) {
		const structure = world.get(entityId, Components.Structure);

		if (structure) {
			if (math.clamp(structure.value - amount, 0, structure.maxValue) <= 0 && shouldBreak) {
				world.insert(
					entityId,
					structure.patch({
						broken: 5,
					}),
				);
			}
			world.insert(
				entityId,
				structure.patch({
					value: math.clamp(structure.value - amount, 0, structure.maxValue),
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
					value: math.clamp(health.value + amount, 0, health.maxValue),
				}),
			);
		}
	}
}

export function HealEntityStructure(world: World, entityId: Entity, amount: number) {
	if (world.contains(entityId)) {
		const structure = world.get(entityId, Components.Structure);

		if (structure) {
			world.insert(
				entityId,
				structure.patch({
					value: math.clamp(structure.value + amount, 0, structure.maxValue),
				}),
			);
		}
	}
}

export function OverHealEntity(world: World, entityId: Entity, amount: number) {
	if (world.contains(entityId)) {
		const health = world.get(entityId, Components.Health);

		if (health) {
			const overheal = math.clamp(health.value + amount - health.maxValue, 0, health.maxValue);
			world.insert(
				entityId,
				health.patch({
					value: math.clamp(health.value + amount, 0, health.maxValue),
				}),
			);
			if (overheal > 0) {
				const currentOverhealth = world.get(entityId, Components.OverHealth);
				if (currentOverhealth) {
					world.insert(
						entityId,
						currentOverhealth.patch({
							value: math.clamp(currentOverhealth.value + overheal, 0, health.maxValue),
						}),
					);
				} else {
					world.insert(
						entityId,
						Components.OverHealth({
							value: overheal,
						}),
					);
				}
			}
		}
	}
}

export function AttemptAssignHumanoid(world: World, entityId: Entity) {
	const model = world.get(entityId, Components.Model);

	if (model) {
		if (model.instance) {
			const humanoid = model.instance.FindFirstChildOfClass("Humanoid") as Humanoid;
			if (humanoid) {
				world.insert(
					entityId,
					Components.Humanoid({
						instance: humanoid,
					}),
				);
			}
		}
	}
}

export function SetAnimation(world: World, entityId: Entity, animationName: string, animation: ContentId | Animation) {
	if (world.contains(entityId)) {
		let animations = world.get(entityId, Components.Animations);
		if (!animations) {
			world.insert(entityId, Components.Animations({ animations: {} }));
			animations = world.get(entityId, Components.Animations);
		}
		let humanoid = world.get(entityId, Components.Humanoid);

		if (humanoid) {
			if (!humanoid.instance) {
				AttemptAssignHumanoid(world, entityId);
				humanoid = world.get(entityId, Components.Humanoid);
			}

			if (humanoid) {
				if (humanoid.instance) {
					const animator = humanoid.instance.WaitForChild("Animator") as Animator;

					let zeanimation = animation;

					if (typeOf(zeanimation) === "string") {
						zeanimation = new Instance("Animation");
						zeanimation.AnimationId = animation as string;
					}

					const ahem = animations!.animations;
					ahem[animationName] = {
						id: (zeanimation as Animation).AnimationId,
						track: animator.LoadAnimation(zeanimation as Animation),
					};

					world.insert(
						entityId,
						animations!.patch({
							animations: ahem,
						}),
					);

					(zeanimation as Instance).Destroy();
				}
			}
		}
	}
}
