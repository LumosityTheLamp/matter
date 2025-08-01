import { useDeltaTime, World } from "@rbxts/matter";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, burning] of world.query(Components.Burning).without(Components.GiveStatusEffect)) {
		world.insert(
			id,
			burning.patch({
				duration: burning.duration - useDeltaTime(),
			}),
		);
		if (burning.duration <= 0) {
			world.remove(id, Components.Burning);
		}
	}
};
