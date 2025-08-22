import { World } from "@rbxts/matter";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { MainInputManager } from "client/input-manager";
import { Components } from "shared/components";
import { Routes } from "shared/routes";

const parryAction = new StandardActionBuilder("F").setProcessed(false).setCooldown(0.5);

MainInputManager.bind(parryAction);

export = (world: World) => {
	for (const [id, model, sword, animations] of world.query(
		Components.Model,
		Components.Sword,
		Components.Animations,
	)) {
		const blockAnimation = animations.animations["Block"];
		const blockHoldAnimation = animations.animations["BlockHold"];

		if (blockAnimation && blockHoldAnimation) {
			const block = world.get(id, Components.Blocking);

			if (parryAction.isActive) {
				if (!block) {
					blockAnimation.track!.Play(0.05);
					blockHoldAnimation.track!.Play(0.05);
					Routes.Block.send(true);
				}
			} else {
				if (block) {
					blockHoldAnimation.track!.Stop(0.3);
					Routes.Block.send(false);
				}
			}
		}
	}
};
