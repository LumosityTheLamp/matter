import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";
import { Components } from "shared/components";
import { GameState } from "shared/game-state";

const name = RunService.IsServer() ? "serverEntityId" : "clientEntityId";

export = (world: World) => {
	for (const [id, record] of world.queryChanged(Components.Bleed)) {
		if (record.new && !record.old) {
			world.insert(
				id,
				Components.BleedParticleEmitter({
					bloodParticleTimer: 0,
				}),
			);
		} else if (!record.new && record.old) {
			world.remove(id, Components.BleedParticleEmitter);
		}
	}
};
