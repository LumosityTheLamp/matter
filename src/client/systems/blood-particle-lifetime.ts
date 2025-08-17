import { useDeltaTime, World } from "@rbxts/matter";
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
				part.instance.Destroy();
			}
			world.despawn(id);
		}
	}
};
