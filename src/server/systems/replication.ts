import { useEvent, World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Components } from "shared/components";
import { ComponentChangesReplication, EntityComponentChangesReplication, Routes } from "shared/routes";

const replicatedComponents = [
	Components.Health,
	Components.Model,
	Components.Humanoid,
	Components.Part,
	Components.Burning,
	Components.Poison,
	Components.GiveStatusEffect,
	Components.JumpPower,
	Components.JumpPowerBoost,
	Components.NaturalRegen,
	Components.Player,
	Components.Speed,
	Components.SpeedBoost,
	Components.Bleed,
	Components.BloodParticle,
	Components.Velocity,
	Components.Gravity,
	Components.Regen,
	Components.OverHealth,
	Components.OverRegen,
	Components.Animations,
	Components.MovementAnimations,
	Components.Sword,
	Components.Blocking,
	Components.Billy,
	Components.Boss,
];

export = {
	system: (world: World) => {
		const changes: EntityComponentChangesReplication = {};

		for (const component of replicatedComponents) {
			for (const [id, record] of world.queryChanged(component)) {
				const key = tostring(id);
				const name = tostring(component);

				if (changes[key] === undefined) {
					changes[key] = {};
				}

				if (world.contains(id)) {
					changes[key][name] = { data: record.new };
				}
			}
		}

		if (next(changes)) {
			Routes.MatterReplication.send(changes);
		}

		for (const [index, player] of useEvent(Players, "PlayerAdded")) {
			const payload: EntityComponentChangesReplication = {};

			for (const [id, entityData] of world) {
				let entityPayload: ComponentChangesReplication = {};

				for (const [component, componentData] of entityData) {
					if (replicatedComponents.indexOf(component) !== -1) {
						entityPayload[tostring(component)] = { data: componentData };
					}
				}

				payload[tostring(id)] = entityPayload;
			}

			Routes.MatterReplication.send(payload).to(player);
		}
	},
	priority: math.huge,
};
