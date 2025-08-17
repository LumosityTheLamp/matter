import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

const name = RunService.IsServer() ? "serverEntityId" : "clientEntityId";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Player)) {
		if (record.new && !record.old) {
			if (record.new.instance) {
				record.new.instance.SetAttribute(name, id);
			}
		}
	}
};
