import { Component, component } from "@rbxts/matter";

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

	export const GiveStatusEffect = component<{ effect: Component<any> }>("GiveStatusEffect");
}
