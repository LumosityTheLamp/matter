import { World } from "@rbxts/matter";
import { CollectionService, ServerStorage } from "@rbxts/services";
import { Components } from "shared/components";

const poisonEffect = ServerStorage.WaitForChild("PoisonEffect") as ParticleEmitter;
const burningEffect = ServerStorage.WaitForChild("BurningEffect") as ParticleEmitter;
const smokeEffect = ServerStorage.WaitForChild("SmokeEffect") as ParticleEmitter;

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Poison)) {
		const model = world.get(id, Components.Model);

		if (model) {
			if (record.new === undefined) {
				for (const instance of model.model.GetDescendants()) {
					if (CollectionService.HasTag(instance, "PoisonEffect")) {
						task.spawn(() => {
							(instance as ParticleEmitter).Enabled = false;
							task.wait((instance as ParticleEmitter).Lifetime.Max);
							if ((instance as ParticleEmitter).Enabled === false) {
								instance.Destroy();
							}
						});
					}
				}
				continue;
			}

			let containsPoison = false;
			for (const instance of model.model.GetDescendants()) {
				if (CollectionService.HasTag(instance, "PoisonEffect")) {
					containsPoison = true;
					(instance as ParticleEmitter).Enabled = true;
				}
			}
			if (!containsPoison) {
				for (const instance of model.model.GetDescendants()) {
					if (instance.IsA("BasePart")) {
						const poisonEffectClone = poisonEffect.Clone();
						poisonEffectClone.Parent = instance;
					}
				}
			}
		}
	}

	for (const [id, record] of world.queryChanged(Components.Burning)) {
		const model = world.get(id, Components.Model);

		if (model) {
			if (record.new === undefined) {
				for (const instance of model.model.GetDescendants()) {
					if (CollectionService.HasTag(instance, "BurningEffect")) {
						task.spawn(() => {
							(instance as ParticleEmitter).Enabled = false;
							task.wait((instance as ParticleEmitter).Lifetime.Max);
							if ((instance as ParticleEmitter).Enabled === false) {
								instance.Destroy();
							}
						});
					}
					if (CollectionService.HasTag(instance, "SmokeEffect")) {
						task.spawn(() => {
							(instance as ParticleEmitter).Enabled = false;
							task.wait((instance as ParticleEmitter).Lifetime.Max);
							if ((instance as ParticleEmitter).Enabled === false) {
								instance.Destroy();
							}
						});
					}
				}
				continue;
			}

			let containsBurning = false;
			let containsSmoke = false;
			for (const instance of model.model.GetDescendants()) {
				if (CollectionService.HasTag(instance, "BurningEffect")) {
					containsBurning = true;
					(instance as ParticleEmitter).Enabled = true;
				}
				if (CollectionService.HasTag(instance, "SmokeEffect")) {
					containsSmoke = true;
					(instance as ParticleEmitter).Enabled = true;
				}
			}
			if (!containsBurning) {
				for (const instance of model.model.GetDescendants()) {
					if (instance.IsA("BasePart")) {
						const burningEffectClone = burningEffect.Clone();
						burningEffectClone.Parent = instance;
					}
				}
			}
			if (!containsSmoke) {
				for (const instance of model.model.GetDescendants()) {
					if (instance.IsA("BasePart")) {
						const smokeEffectClone = smokeEffect.Clone();
						smokeEffectClone.Parent = instance;
					}
				}
			}
		}
	}
};
