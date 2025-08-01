import { useEvent, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import TableUtil from "@rbxts/tableutil";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, part, giveStatusEffect] of world.query(Components.Part, Components.GiveStatusEffect)) {
		if (part.part) {
			for (const hit of Workspace.GetPartsInPart(part.part)) {
				for (const [aid, model, health] of world.query(Components.Model, Components.Humanoid)) {
					if (model.model === hit.Parent) {
						world.insert(aid, TableUtil.Copy(giveStatusEffect.effect));
					}
				}
			}
		}
	}
};
