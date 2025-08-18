import { World } from "@rbxts/matter";
import { Components } from "shared/components";
import { SetAnimation } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Animations)) {
		if (record.new) {
			for (const [animationName, data] of pairs(record.new.animations)) {
				if (!data.track) {
					SetAnimation(world, id, animationName as string, data.id);
				}
			}
		}
	}
};
