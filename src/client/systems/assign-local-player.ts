import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Player)) {
		if (record.new && !record.old) {
			if (record.new.instance) {
				if (record.new.instance === Players.LocalPlayer) {
					world.insert(id, Components.LocalPlayer());
				}
			}
		} else if (!record.new && record.old) {
			if (record.old.instance) {
				if (record.old.instance === Players.LocalPlayer) {
					world.remove(id, Components.LocalPlayer);
				}
			}
		}
	}
};
