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
						const speedBoost = status.Enter["SpeedBoost"];
						if (speedBoost) {
							world.insert(aid, Components.SpeedBoost(TableUtil.Copy(speedBoost)));
						}
						const jumpPowerBoost = status.Enter["JumpPowerBoost"];
						if (jumpPowerBoost) {
							world.insert(aid, Components.JumpPowerBoost(TableUtil.Copy(jumpPowerBoost)));
						}
						const bleed = status.Enter["Bleed"];
						if (bleed) {
							world.insert(aid, Components.Bleed(TableUtil.Copy(bleed)));
						}
						const regen = status.Enter["Regen"];
						if (regen) {
							world.insert(aid, Components.Regen(TableUtil.Copy(regen)));
						}
						const overRegen = status.Enter["OverRegen"];
						if (overRegen) {
							world.insert(aid, Components.OverRegen(TableUtil.Copy(overRegen)));
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
							const speedBoost = status.Exit["SpeedBoost"];
							if (speedBoost) {
								world.insert(aid, Components.SpeedBoost(TableUtil.Copy(speedBoost)));
							}
							const jumpPowerBoost = status.Exit["JumpPowerBoost"];
							if (jumpPowerBoost) {
								world.insert(aid, Components.JumpPowerBoost(TableUtil.Copy(jumpPowerBoost)));
							}
							const bleed = status.Exit["Bleed"];
							if (bleed) {
								world.insert(aid, Components.Bleed(TableUtil.Copy(bleed)));
							}
							const regen = status.Exit["Regen"];
							if (regen) {
								world.insert(aid, Components.Regen(TableUtil.Copy(regen)));
							}
							const overRegen = status.Exit["OverRegen"];
							if (overRegen) {
								world.insert(aid, Components.OverRegen(TableUtil.Copy(overRegen)));
							}
						}
					}
				}
			}
		}
	}
};
