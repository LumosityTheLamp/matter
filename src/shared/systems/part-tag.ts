import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

const name = RunService.IsServer() ? "serverEntityId" : "clientEntityId";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Part)) {
		if (record.new && !record.old) {
			if (record.new.part) {
				record.new.part.SetAttribute(name, id);
			}
		}
	}
};
