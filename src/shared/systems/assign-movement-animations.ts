import { World } from "@rbxts/matter";
import { Components } from "shared/components";
import { SetAnimation } from "shared/entity-functions";
import { defaultAnimationsIds } from "shared/util";

export = {
	system: (world: World) => {
		for (const [id, record] of world.queryChanged(Components.MovementAnimations)) {
			if (world.get(id, Components.Networked)) {
				continue;
			}

			if (record.new) {
				if (record.new.useDefaults) {
					for (const [animationName, animationId] of pairs(defaultAnimationsIds)) {
						SetAnimation(world, id, animationName, animationId);
					}
				}
			}
		}
	},
	priority: math.huge,
};
