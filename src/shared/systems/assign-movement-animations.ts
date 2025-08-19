import { World } from "@rbxts/matter";
import { Components } from "shared/components";
import { SetAnimation } from "shared/entity-functions";

const defaultAnimations = {
	Idle: "http://www.roblox.com/asset/?id=180435571",
	Walk: "http://www.roblox.com/asset/?id=180426354",
	Jump: "http://www.roblox.com/asset/?id=125750702",
	Fall: "http://www.roblox.com/asset/?id=180436148",
	Climb: "http://www.roblox.com/asset/?id=180436334",
	Sit: "http://www.roblox.com/asset/?id=178130996",
};

export = {
	system: (world: World) => {
		for (const [id, record] of world.queryChanged(Components.MovementAnimations)) {
			if (world.get(id, Components.Networked)) {
				continue;
			}

			if (record.new) {
				if (record.new.useDefault) {
					for (const [animationName, animationId] of pairs(defaultAnimations)) {
						SetAnimation(world, id, animationName, animationId);
					}
				}
			}
		}
	},
	priority: math.huge,
};
