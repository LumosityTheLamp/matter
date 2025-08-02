import { Component, component } from "@rbxts/matter";
import table from "@rbxts/plasma/src/widgets/table";

export namespace Components {
	export const Health = component<{
		health: number;
		maxHealth: number;
	}>("Health");

	export const Humanoid = component<{
		humanoid: Humanoid;
	}>("Humanoid");

	export const Model = component<{
		model: Model;
	}>("Model");

	export const Part = component<{
		part: BasePart;
	}>("Part");

	export const NaturalRegen = component("NaturalRegen");

	export const Player = component<{
		player: Player;
	}>("Player");

	export const Poison = component<{
		damagePerSecond: number;
		duration: number;
	}>("Poison");

	export const Burning = component<{
		damagePerSecond: number;
		duration: number;
	}>("Burning");

	export const Speed = component<{
		speed: number;
	}>("Speed");

	export const JumpPower = component<{
		power: number;
	}>("JumpPower");

	export const SpeedBoost = component<{
		multiplier: number;
		duration: number;
	}>("SpeedBoost");

	export const JumpPowerBoost = component<{
		multiplier: number;
		duration: number;
	}>("JumpPowerBoost");

	export const Bleed = component<{
		damagePercentage: number;
		duration: number;
	}>("Bleed");

	export const BleedParticleEmitter = component<{
		bloodParticleTimer: number;
	}>("BleedParticleEmitter");

	interface GiveStatusEffects {
		Poison?: {
			damagePerSecond: number;
			duration: number;
		};
		Burning?: {
			damagePerSecond: number;
			duration: number;
		};
		SpeedBoost?: {
			multiplier: number;
			duration: number;
		};
		JumpPowerBoost?: {
			multiplier: number;
			duration: number;
		};
		Bleed?: {
			damagePercentage: number;
			duration: number;
		};
	}

	export const GiveStatusEffect = component<{
		Enter: GiveStatusEffects;
		Exit?: GiveStatusEffects;
	}>("GiveStatusEffect");

	export const BloodParticle = component<{
		lifetime: number;
	}>("BloodParticle");

	export const BloodSplat = component<{
		lifetime: number;
	}>("BloodSplat");

	export const Velocity = component<{
		velocity: Vector3;
	}>("Velocity");

	export const Gravity = component("Gravity");

	export const Networked = component("Networked");
}
