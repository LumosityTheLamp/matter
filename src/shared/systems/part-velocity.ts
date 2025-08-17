import { useDeltaTime, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

let networked: any;
if (RunService.IsClient()) {
	networked = Components.Networked;
}

export = (world: World) => {
	for (const [id, part, velocity] of world.query(Components.Part, Components.Velocity).without(networked)) {
		part.instance.Position = part.instance.Position.add(velocity.velocity.mul(useDeltaTime()));
	}
};
