import { useDeltaTime, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

let networked: any;
if (RunService.IsClient()) {
	networked = Components.Networked;
}

export = (world: World) => {
	for (const [id, part, velocity] of world.query(Components.Part, Components.Velocity).without(networked)) {
		part.part.Position = part.part.Position.add(velocity.velocity.mul(useDeltaTime()));
	}
};
