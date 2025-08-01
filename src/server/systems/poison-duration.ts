import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, poison] of world.query(Components.Poison)) {
		poison.patch({
			duration: poison.duration - useDeltaTime(),
		});
		if (poison.duration <= 0) {
			world.remove(id, Components.Poison);
		}
	}
};
