import { useDeltaTime, useEvent, World } from "@rbxts/matter";
import { Components } from "shared/components";

const transition = 0.1;
const fallTransition = 0.3;
const jumpDuration = 0.3;

export = (world: World) => {
	for (const [id, humanoid, animations, movementAnimations] of world.query(
		Components.Humanoid,
		Components.Animations,
		Components.MovementAnimations,
	)) {
		let pose = movementAnimations.pose;
		let jumpTimer = movementAnimations.jumpTimer;

		const idle = animations.animations["Idle"];
		const walk = animations.animations["Walk"];
		const jump = animations.animations["Jump"];
		const fall = animations.animations["Fall"];

		if (idle && walk && jump && fall) {
			for (const [index, speed] of useEvent(humanoid.instance, "Running")) {
				if (speed > 0.01) {
					let divide = 1;
					const model = world.get(id, Components.Model);
					if (model) {
						if (model.instance) {
							divide = model.instance.GetScale();
						}
					}
					walk.track!.AdjustSpeed(speed / divide / 14.5);
					pose = "Walk";
				} else {
					pose = "Idle";
				}
			}

			for (const [index, active] of useEvent(humanoid.instance, "FreeFalling")) {
				if (active) {
					if (jumpTimer <= 0) {
						if (!fall.track!.IsPlaying) {
							walk.track!.Stop(fallTransition);
							idle.track!.Stop(fallTransition);
							jump.track!.Stop(fallTransition);
							fall.track!.Play(fallTransition);
						}
					}

					pose = "FreeFall";
				}
			}

			for (const [index, active] of useEvent(humanoid.instance, "Jumping")) {
				if (active) {
					if (!jump.track!.IsPlaying) {
						walk.track!.Stop(transition);
						idle.track!.Stop(transition);
						fall.track!.Stop(transition);

						jump.track!.Play(transition);
					}

					pose = "Jump";
					jumpTimer = jumpDuration;
				}
			}

			if (jumpTimer) {
				jumpTimer -= useDeltaTime();
			}

			switch (pose) {
				case "Idle":
					if (!idle.track!.IsPlaying) {
						walk.track!.Stop(transition);
						jump.track!.Stop(transition);
						fall.track!.Stop(transition);
						idle.track!.Play(transition);
					}
					break;
				case "Walk":
					if (!walk.track!.IsPlaying) {
						idle.track!.Stop(transition);
						jump.track!.Stop(transition);
						fall.track!.Stop(transition);
						walk.track!.Play(transition);
					}
					break;
				case "Jump":
					if (!jump.track!.IsPlaying) {
						walk.track!.Stop(transition);
						idle.track!.Stop(transition);
						fall.track!.Stop(transition);

						jump.track!.Play(transition);
					}
					break;
				case "FreeFall":
					if (jumpTimer <= 0) {
						if (!fall.track!.IsPlaying) {
							jump.track!.Stop(fallTransition);
							walk.track!.Stop(fallTransition);
							idle.track!.Stop(fallTransition);
							fall.track!.Play(fallTransition);
						}
					}
					break;
				case "Dead":
					walk.track!.Stop();
					idle.track!.Stop();
					jump.track!.Stop();
					fall.track!.Stop();
					break;
				default:
					pose = "Idle";
					break;
			}

			world.insert(
				id,
				movementAnimations.patch({
					pose: pose,
					jumpTimer: jumpTimer,
				}),
			);
		}
	}
};
