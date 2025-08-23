import { useDeltaTime, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

export = (world: World) => {
	if (RunService.IsClient()) {
		for (const [id, model, velocity] of world
			.query(Components.Model, Components.Velocity)
			.without(Components.Networked)) {
			if (model.instance) {
				model.instance.PivotTo(
					new CFrame(model.instance.GetPivot().Position.add(velocity.velocity.mul(useDeltaTime()))).mul(
						model.instance.GetPivot().Rotation,
					),
				);
			}
		}
	}
	if (RunService.IsServer()) {
		for (const [id, model, velocity] of world.query(Components.Model, Components.Velocity)) {
			if (model.instance) {
				model.instance.PivotTo(
					new CFrame(model.instance.GetPivot().Position.add(velocity.velocity.mul(useDeltaTime()))).mul(
						model.instance.GetPivot().Rotation,
					),
				);
			}
		}
	}
};
