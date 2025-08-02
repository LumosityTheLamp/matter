import { useDeltaTime, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, bloodParticle] of world.query(Components.BloodParticle)) {
		world.insert(
			id,
			bloodParticle.patch({
				lifetime: bloodParticle.lifetime - useDeltaTime(),
			}),
		);
		if (bloodParticle.lifetime <= 0) {
			const part = world.get(id, Components.Part);
			if (part) {
				part.part.Destroy();
			}
			world.despawn(id);
		}
	}
};
