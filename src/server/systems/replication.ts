import { useEvent, World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { Components } from "shared/components";
import { Remotes } from "shared/remotes";

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
];

export = {
	system: (world: World) => {
		const changes = new Map<string, Map<string, { data: any }>>();

		for (const component of replicatedComponents) {
			for (const [id, record] of world.queryChanged(component)) {
				const key = tostring(id);
				const name = tostring(component);

				if (changes.get(key) === undefined) {
					changes.set(key, new Map());
				}

				if (world.contains(id)) {
					changes.get(key)!.set(name, { data: record.new });
				}
			}
		}

		if (next(changes)) {
			Remotes.ReplicateComponents.fireAll(changes);
		}

		for (const [index, player] of useEvent(Players, "PlayerAdded")) {
			const payload = new Map<string, Map<string, { data: any }>>();

			for (const [id, entityData] of world) {
				let entityPayload = new Map<string, { data: any }>();

				for (const [component, componentData] of entityData) {
					if (replicatedComponents.indexOf(component) !== -1) {
						entityPayload.set(tostring(component), { data: componentData });
					}
				}

				payload.set(tostring(id), entityPayload);
			}

			Remotes.ReplicateComponents.fireAll(payload);
		}
	},
	priority: math.huge,
};
