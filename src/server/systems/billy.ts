import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, billy, animations] of world.query(Components.Billy, Components.Animations)) {
		const idle = animations.animations["Idle"];

		if (idle) {
			if (!idle.track!.IsPlaying) {
				idle.track!.Play(0.1);
			}
		}
	}
};
