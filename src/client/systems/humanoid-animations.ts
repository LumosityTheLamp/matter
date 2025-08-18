import { useEvent, World } from "@rbxts/matter";
import { Components } from "shared/components";

const transition = 0.1;

export = (world: World) => {
	for (const [id, humanoid, animations] of world.query(Components.Humanoid, Components.Animations)) {
		const idle = animations.animations["Idle"];
		const walk = animations.animations["Walk"];
		const jump = animations.animations["Jump"];
		const fall = animations.animations["Fall"];

		if (idle && walk && jump && fall) {
			for (const [index, speed] of useEvent(humanoid.instance, "Running")) {
				if (speed > 0.01) {
					idle.track.Stop();
					jump.track.Stop();
					fall.track.Stop();

					walk.track.AdjustSpeed(speed / 14.5);
					if (!walk.track.IsPlaying) {
						walk.track.Play(transition);
					}
				} else {
					walk.track.Stop();
					jump.track.Stop();
					fall.track.Stop();

					idle.track.Play(transition);
				}
			}

			for (const [index, active] of useEvent(humanoid.instance, "Jumping")) {
				if (active) {
					walk.track.Stop();
					idle.track.Stop();
					fall.track.Stop();

					jump.track.Play(transition);
				}
			}

			for (const [index, active] of useEvent(humanoid.instance, "FreeFalling")) {
				if (active) {
					walk.track.Stop();
					idle.track.Stop();

					fall.track.Play(jump.track.Length / 2);
				}
			}
		}
	}
};
