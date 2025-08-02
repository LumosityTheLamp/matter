import { useDeltaTime, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { SpawnBloodParticle } from "shared/blood-functions";
import { Components } from "shared/components";
import { rng } from "shared/util";

export = (world: World) => {
	for (const [id, bleedParticleEmitter, bleed] of world.query(Components.BleedParticleEmitter, Components.Bleed)) {
		world.insert(
			id,
			bleedParticleEmitter.patch({
				bloodParticleTimer: bleedParticleEmitter.bloodParticleTimer - useDeltaTime(),
			}),
		);
		if (bleedParticleEmitter.bloodParticleTimer <= 0) {
			world.insert(
				id,
				bleedParticleEmitter.patch({
					bloodParticleTimer: rng.NextNumber(0.01 / bleed.damagePercentage, 0.02 / bleed.damagePercentage),
				}),
			);
			const model = world.get(id, Components.Model);

			if (model) {
				const instances: BasePart[] = [];
				for (const instance of model.model.GetDescendants()) {
					if (instance.IsA("BasePart")) {
						instances.push(instance);
					}
				}

				const finalInstance = instances[rng.NextInteger(0, instances.size() - 1)];

				SpawnBloodParticle(
					finalInstance.Position.add(
						new Vector3(
							rng.NextNumber(-finalInstance.Size.X / 2, finalInstance.Size.X / 2),
							rng.NextNumber(-finalInstance.Size.Y / 2, finalInstance.Size.Y / 2),
							rng.NextNumber(-finalInstance.Size.Z / 2, finalInstance.Size.Z / 2),
						),
					),
					Vector3.zero,
					5,
				);
			}
		}
	}
};
