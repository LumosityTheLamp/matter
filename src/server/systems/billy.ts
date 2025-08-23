import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, billy, animations, hitboxes] of world.query(
		Components.Billy,
		Components.Animations,
		Components.Hitboxes,
	)) {
		const idle = animations.animations["Idle"];
		const spinHit = hitboxes.hitboxes["Spin"];

		if (idle && spinHit) {
			let state = billy.state;
			let targetPlayer = billy.targetPlayer;
			let stateTimer = billy.stateTimer;

			switch (state) {
				case "FlyingAroundTarget":
					if (!idle.track!.IsPlaying) {
						idle.track!.Play(0.1);
					}
					break;
				case "LookForTarget":
					state = "FlyingAroundTarget";
					break;
				case "default":
					state = "LookForTarget";
					break;
			}

			world.insert(
				id,
				Components.Billy({
					state: state,
					targetPlayer: targetPlayer,
					stateTimer: stateTimer,
				}),
			);
		}
	}
};
