import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

const name = RunService.IsServer() ? "serverEntityId" : "clientEntityId";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Model)) {
		if (record.new && !record.old) {
			if (record.new.instance) {
				record.new.instance.SetAttribute(name, id);
				if (record.new.instance.FindFirstChild("Hitboxes")) {
					const data: {
						[instanceName: string]: {
							instance: Part;
						};
					} = {};
					for (const instance of record.new.instance.WaitForChild("Hitboxes").GetChildren()) {
						data[instance.Name] = { instance: instance as Part };
					}
					world.insert(
						id,
						Components.Hitboxes({
							hitboxes: data,
						}),
					);
				}
			}
		}
	}
};
