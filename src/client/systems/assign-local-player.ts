import { World } from "@rbxts/matter";
import { Players, RunService } from "@rbxts/services";
import { Components } from "shared/components";
import { GameState } from "shared/game-state";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Player)) {
		if (record.new && !record.old) {
			if (record.new.player) {
				if (record.new.player === Players.LocalPlayer) {
					world.insert(id, Components.LocalPlayer());
				}
			}
		} else if (!record.new && record.old) {
			if (record.old.player) {
				if (record.old.player === Players.LocalPlayer) {
					world.remove(id, Components.LocalPlayer);
				}
			}
		}
	}
};
