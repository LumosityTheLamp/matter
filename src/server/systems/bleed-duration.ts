import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";
import { rng } from "shared/util";

export = (world: World) => {
	for (const [id, bleed] of world.query(Components.Bleed)) {
		world.insert(
			id,
			bleed.patch({
				duration: bleed.duration - useDeltaTime(),
			}),
		);
		if (bleed.duration <= 0) {
			world.remove(id, Components.Bleed);
		}
	}
};
