import { World } from "@rbxts/matter";
import { Components } from "shared/components";
import { Routes } from "shared/routes";

export = (world: World) => {
	for (const [index, player, active] of Routes.Block.query()) {
		if (active) {
			for (const [pid, cplayer] of world.query(Components.Player)) {
				if (player === cplayer.instance) {
					world.insert(
						pid,
						Components.Blocking({
							active: true,
							parryFrames: 10,
						}),
					);
				}
			}
		} else {
			for (const [pid, cplayer, blocking] of world.query(Components.Player, Components.Blocking)) {
				if (player === cplayer.instance) {
					world.insert(
						pid,
						blocking.patch({
							active: false,
						}),
					);
				}
			}
		}
	}

	for (const [id, blocking] of world.query(Components.Blocking)) {
		if (blocking.parryFrames > 0) {
			world.insert(
				id,
				blocking.patch({
					parryFrames: blocking.parryFrames - 1,
				}),
			);
		} else {
			if (!blocking.active) {
				world.remove(id, Components.Blocking);
			}
		}
	}
};
