import { component } from "@rbxts/matter";

export namespace Components {
	export const Health = component<{
		value: number;
		maxValue: number;
	}>("Health");

	export const Humanoid = component<{
		instance: Humanoid;
	}>("Humanoid");

	export const Animations = component<{
		animations: {
			[animationName: string]: {
				id: ContentId;
				track?: AnimationTrack | undefined;
			};
		};
	}>("Animations");

	export const MovementAnimations = component<{
		useDefaults: boolean;
		pose: string;
		jumpTimer: number;
	}>("MovementAnimations");

	export const Model = component<{
		instance: Model;
	}>("Model");

	export const Part = component<{
		instance: BasePart;
	}>("Part");

	export const Sword = component<{
		instance: Model;
	}>("Sword");

	export const Blocking = component<{
		active: boolean;
		parryFrames: number;
	}>("Blocking");

	export const Billy = component<{}>("Billy");

	export const Boss = component<{
		name: string;
	}>("Boss");

	export const NaturalRegen = component("NaturalRegen");

	export const Player = component<{
		instance: Player;
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
		value: number;
	}>("Speed");

	export const JumpPower = component<{
		value: number;
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

	export const Regen = component<{
		regenPerSecond: number;
		duration: number;
	}>("Regen");

	export const OverHealth = component<{
		value: number;
	}>("OverHealth");

	export const OverRegen = component<{
		regenPerSecond: number;
		duration: number;
	}>("OverRegen");

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
		Regen?: {
			regenPerSecond: number;
			duration: number;
		};
		OverRegen?: {
			regenPerSecond: number;
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

	export const LocalPlayer = component("LocalPlayer");
}
