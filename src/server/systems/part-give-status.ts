import { useEvent, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import TableUtil from "@rbxts/tableutil";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, part, status] of world.query(Components.Part, Components.GiveStatusEffect)) {
		if (part.part) {
			for (const [index, hit] of useEvent(part.part, "Touched")) {
				for (const [aid, model] of world.query(Components.Model, Components.Humanoid)) {
					if (model.model === hit.Parent) {
						const poison = status.Enter["Poison"];
						if (poison) {
							world.insert(aid, Components.Poison(TableUtil.Copy(poison)));
						}
						const burning = status.Enter["Burning"];
						if (burning) {
							world.insert(aid, Components.Burning(TableUtil.Copy(burning)));
						}
					}
				}
			}
			if (status.Exit) {
				for (const [index, hit] of useEvent(part.part, "TouchEnded")) {
					for (const [aid, model] of world.query(Components.Model, Components.Humanoid)) {
						if (model.model === hit.Parent) {
							const poison = status.Exit["Poison"];
							if (poison) {
								world.insert(aid, Components.Poison(TableUtil.Copy(poison)));
							}
							const burning = status.Exit["Burning"];
							if (burning) {
								world.insert(aid, Components.Burning(TableUtil.Copy(burning)));
							}
						}
					}
				}
			}
		}
	}
};
