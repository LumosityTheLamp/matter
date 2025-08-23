import { Entity, useDeltaTime, useEvent, World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Components } from "shared/components";
import { DamageEntity, DamageEntityStructure } from "shared/entity-functions";
import { rng, RotateVector3 } from "shared/util";

function GetHitboxHitEntities(world: World, hitbox: Part): Entity[] {
	const entities: Entity[] = [];

	for (const [index, hit] of useEvent(hitbox, "Touched")) {
		if (hit.Parent) {
			if (Players.GetPlayerFromCharacter(hit.Parent)) {
				for (const [id, model] of world.query(Components.Model)) {
					if (model.instance === hit.Parent) {
						if (!entities.includes(id)) {
							entities.push(id);
							break;
						}
					}
				}
			}
		}
	}

	return entities;
}

export = (world: World) => {
	for (const [id, billy, animations, hitboxes, velocity, model] of world.query(
		Components.Billy,
		Components.Animations,
		Components.Hitboxes,
		Components.Velocity,
		Components.Model,
	)) {
		const idle = animations.animations["Idle"];
		const spinHit = hitboxes.hitboxes["Spin"];

		if (idle && spinHit) {
			let state = billy.state;
			let targetPlayer = billy.targetPlayer;
			let stateTimer = billy.stateTimer;
			let flyRotation = billy.flyRotation;
			let vel = velocity.velocity;
			let hitEntities = billy.hitEntities;

			switch (state) {
				case "Parried":
					break;
				case "Spin":
					for (const hitEntity of GetHitboxHitEntities(world, spinHit.instance)) {
						if (!hitEntities.includes(hitEntity)) {
							const block = world.get(hitEntity, Components.Blocking);
							if (!block) {
								DamageEntity(world, hitEntity, 15);
								hitEntities.push(hitEntity);
								state = "LookForTarget";
							} else {
								if (block.parryFrames > 0) {
									state = "Parried";
									DamageEntityStructure(world, hitEntity, 10, false);
								} else {
									DamageEntityStructure(world, hitEntity, 20, true);
								}
							}
						}
					}
					if (targetPlayer) {
						const character = targetPlayer.Character;
						if (character) {
							vel = character
								.PrimaryPart!.Position.sub(model.instance.PrimaryPart!.Position)
								.Unit.mul(200);
						}
					}
					stateTimer -= useDeltaTime();
					if (stateTimer <= 0) {
						state = "LookForTarget";
					}
					break;
				case "FlyingAroundTarget":
					stateTimer -= useDeltaTime();
					if (stateTimer <= 0) {
						if (targetPlayer) {
							const character = targetPlayer.Character;
							if (character) {
								hitEntities = [];
								state = "Spin";
								vel = character
									.PrimaryPart!.Position.sub(model.instance.PrimaryPart!.Position)
									.Unit.mul(200);
								stateTimer = 1;
							}
						}
					}
					if (!idle.track!.IsPlaying) {
						idle.track!.Play(0.1);
					}
					flyRotation += 10 * useDeltaTime();
					if (targetPlayer) {
						const character = targetPlayer.Character;
						if (character) {
							model.instance.PrimaryPart!.CFrame = new CFrame(
								model.instance.PrimaryPart!.Position.Lerp(
									character
										.PrimaryPart!.Position.add(
											RotateVector3(new Vector3(1, 0, 0), math.rad(flyRotation)).mul(100),
										)
										.add(new Vector3(0, 16, 0)),
									0.1,
								),
								character.PrimaryPart!.Position,
							);
						}
					}
					break;
				case "LookForTarget":
					const target = Players.GetPlayers()[rng.NextInteger(0, Players.GetPlayers().size() - 1)];
					if (target) {
						if (target.Character) {
							targetPlayer = target;
							state = "FlyingAroundTarget";
							stateTimer = rng.NextNumber(2, 4);
						}
					}
					break;
				default:
					state = "LookForTarget";
					vel = Vector3.zero;
					break;
			}

			world.insert(
				id,
				Components.Billy({
					state: state,
					targetPlayer: targetPlayer,
					stateTimer: stateTimer,
					flyRotation: flyRotation,
					hitEntities: hitEntities,
				}),
			);
			world.insert(
				id,
				Components.Velocity({
					velocity: vel,
				}),
			);
		}
	}
};
