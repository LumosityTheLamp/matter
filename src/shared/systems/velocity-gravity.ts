import { useDeltaTime, World } from "@rbxts/matter";
import { RunService, Workspace } from "@rbxts/services";
import { Components } from "shared/components";

let networked: any;
if (RunService.IsClient()) {
	networked = Components.Networked;
}

export = (world: World) => {
	for (const [id, velocity] of world.query(Components.Velocity, Components.Gravity).without(networked)) {
		world.insert(
			id,
			velocity.patch({
				velocity: new Vector3(
					velocity.velocity.X,
					velocity.velocity.Y + Workspace.Gravity * useDeltaTime(),
					velocity.velocity.Z,
				),
			}),
		);
	}
};
