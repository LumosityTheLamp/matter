import { World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { CollectionService, ReplicatedStorage } from "@rbxts/services";
import { Components } from "shared/components";

interface FullBodyEffect {
	type: "FullBodyEffect";
	effects: Instance[];
}

const componentToEffect: {
	[componentName: string]: FullBodyEffect;
} = {
	Poison: {
		type: "FullBodyEffect",
		effects: [ReplicatedStorage.WaitForChild("PoisonEffect") as ParticleEmitter],
	},
	Burning: {
		type: "FullBodyEffect",
		effects: [
			ReplicatedStorage.WaitForChild("BurningEffect") as ParticleEmitter,
			ReplicatedStorage.WaitForChild("SmokeEffect") as ParticleEmitter,
		],
	},
	SpeedBoost: {
		type: "FullBodyEffect",
		effects: [ReplicatedStorage.WaitForChild("SpeedBoostEffect") as ParticleEmitter],
	},
	JumpPowerBoost: {
		type: "FullBodyEffect",
		effects: [ReplicatedStorage.WaitForChild("JumpPowerBoostEffect") as ParticleEmitter],
	},
	Regen: {
		type: "FullBodyEffect",
		effects: [ReplicatedStorage.WaitForChild("RegenEffect") as ParticleEmitter],
	},
	OverRegen: {
		type: "FullBodyEffect",
		effects: [ReplicatedStorage.WaitForChild("OverRegenEffect") as ParticleEmitter],
	},
};

export = (world: World) => {
	for (const [componentName, effect] of pairs(componentToEffect)) {
		for (const [id, record] of world.queryChanged(
			(Components as unknown as Record<string, ComponentCtor>)[componentName] as ComponentCtor,
		)) {
			if (effect.type === "FullBodyEffect") {
				const model = world.get(id, Components.Model);

				if (model) {
					if (record.new === undefined) {
						for (const [index, subeffect] of ipairs(effect.effects)) {
							for (const instance of model.instance.GetDescendants()) {
								if (
									CollectionService.HasTag(
										instance,
										`${model.instance.Name} | ${componentName} | ${subeffect.Name} | ${index}`,
									)
								) {
									if (instance.IsA("ParticleEmitter")) {
										task.spawn(() => {
											instance.Enabled = false;
											task.wait(instance.Lifetime.Max);
											if (instance.Enabled === false) {
												instance.Destroy();
											}
										});
									}
								}
							}
						}
						continue;
					}
					for (const [index, subeffect] of ipairs(effect.effects)) {
						let contains = false;
						for (const instance of model.instance.GetDescendants()) {
							if (
								CollectionService.HasTag(
									instance,
									`${model.instance.Name} | ${componentName} | ${subeffect.Name} | ${index}`,
								)
							) {
								contains = true;
								if (instance.IsA("ParticleEmitter")) {
									instance.Enabled = true;
								}
							}
						}
						if (!contains) {
							for (const instance of model.instance.GetDescendants()) {
								if (instance.IsA("BasePart")) {
									const subEffectClone = subeffect.Clone();
									CollectionService.AddTag(
										subEffectClone,
										`${model.instance.Name} | ${componentName} | ${subeffect.Name} | ${index}`,
									);
									subEffectClone.Parent = instance;
									if (instance.IsA("ParticleEmitter")) {
										instance.Enabled = true;
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
