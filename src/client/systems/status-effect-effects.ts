import { World } from "@rbxts/matter";
import { CollectionService, ReplicatedStorage } from "@rbxts/services";
import { Components } from "shared/components";

const poisonEffect = ReplicatedStorage.WaitForChild("PoisonEffect") as ParticleEmitter;
const burningEffect = ReplicatedStorage.WaitForChild("BurningEffect") as ParticleEmitter;
const smokeEffect = ReplicatedStorage.WaitForChild("SmokeEffect") as ParticleEmitter;
const speedBoostEffect = ReplicatedStorage.WaitForChild("SpeedBoostEffect") as ParticleEmitter;
const jumpPowerBoostEffect = ReplicatedStorage.WaitForChild("JumpPowerBoostEffect") as ParticleEmitter;

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

	for (const [id, record] of world.queryChanged(Components.SpeedBoost)) {
		const model = world.get(id, Components.Model);

		if (model) {
			if (record.new === undefined) {
				for (const instance of model.model.GetDescendants()) {
					if (CollectionService.HasTag(instance, "SpeedBoostEffect")) {
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

			let containsSpeed = false;
			for (const instance of model.model.GetDescendants()) {
				if (CollectionService.HasTag(instance, "SpeedBoostEffect")) {
					containsSpeed = true;
					(instance as ParticleEmitter).Enabled = true;
				}
			}
			if (!containsSpeed) {
				for (const instance of model.model.GetDescendants()) {
					if (instance.IsA("BasePart")) {
						const speedBoostEffectClone = speedBoostEffect.Clone();
						speedBoostEffectClone.Parent = instance;
					}
				}
			}
		}
	}

	for (const [id, record] of world.queryChanged(Components.JumpPowerBoost)) {
		const model = world.get(id, Components.Model);

		if (model) {
			if (record.new === undefined) {
				for (const instance of model.model.GetDescendants()) {
					if (CollectionService.HasTag(instance, "JumpPowerBoostEffect")) {
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

			let containsJumpPower = false;
			for (const instance of model.model.GetDescendants()) {
				if (CollectionService.HasTag(instance, "JumpPowerBoostEffect")) {
					containsJumpPower = true;
					(instance as ParticleEmitter).Enabled = true;
				}
			}
			if (!containsJumpPower) {
				for (const instance of model.model.GetDescendants()) {
					if (instance.IsA("BasePart")) {
						const jumpPowerBoostEffectClone = jumpPowerBoostEffect.Clone();
						jumpPowerBoostEffectClone.Parent = instance;
					}
				}
			}
		}
	}
};
