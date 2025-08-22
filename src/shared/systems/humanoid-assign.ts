import { World } from "@rbxts/matter";
import { Components } from "shared/components";
import { AttemptAssignHumanoid } from "shared/entity-functions";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Humanoid)) {
		if (record.new && !record.old) {
			if (!record.new["instance"]) {
				AttemptAssignHumanoid(world, id);
			}
		}
	}
};
