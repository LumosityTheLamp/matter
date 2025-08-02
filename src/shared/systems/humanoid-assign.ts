import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Humanoid)) {
		if (record.new && !record.old) {
			if (!record.new["humanoid"]) {
				const model = world.get(id, Components.Model);
				if (model) {
					const humanoid = model.model.WaitForChild("Humanoid") as Humanoid;
					if (humanoid) {
						world.insert(
							id,
							Components.Humanoid({
								humanoid: humanoid,
							}),
						);
					}
				}
			}
		}
	}
};
