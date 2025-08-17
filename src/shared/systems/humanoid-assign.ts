import { World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Humanoid)) {
		if (record.new && !record.old) {
			if (!record.new["instance"]) {
				const model = world.get(id, Components.Model);
				if (model) {
					const humanoid = model.instance.WaitForChild("Humanoid") as Humanoid;
					if (humanoid) {
						world.insert(
							id,
							Components.Humanoid({
								instance: humanoid,
							}),
						);
					}
				}
			}
		}
	}
};
