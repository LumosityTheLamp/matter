import { useDeltaTime, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

let networked: any;
if (RunService.IsClient()) {
	networked = Components.Networked;
}

export = (world: World) => {
	for (const [id, gravity, velocity] of world.query(Components.Gravity, Components.Velocity).without(networked)) {
		world.insert(
			id,
			velocity.patch({
				velocity: new Vector3(
					velocity.velocity.X,
					velocity.velocity.Y + gravity.gravity * useDeltaTime(),
					velocity.velocity.Z,
				),
			}),
		);
	}
};
