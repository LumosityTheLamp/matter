import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";
import { GameState } from "shared/game-state";

const name = RunService.IsServer() ? "serverEntityId" : "clientEntityId";

export = {
	system: (world: World) => {
		for (const [id, record] of world.queryChanged(Components.Part)) {
			if (record.new) {
				if (record.new.part) {
					record.new.part.SetAttribute(name, id);
				}
			}
		}
	},
	priority: math.huge,
};
