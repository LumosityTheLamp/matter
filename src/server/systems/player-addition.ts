import { Entity, useEvent, World } from "@rbxts/matter";
import { Players, Workspace } from "@rbxts/services";
import { Components } from "shared/components";

const playersFolder = Workspace.WaitForChild("Players") as Folder;

export = (world: World) => {
	for (const [index, player] of useEvent(Players, "PlayerAdded")) {
		const playerEntity = world.spawn();
		world.insert(
			playerEntity,
			Components.Player({
				player: player,
			}),
		);
	}

	for (const player of Players.GetPlayers()) {
		const playerEntity = player.GetAttribute("serverEntityId") as Entity;

		if (playerEntity) {
			for (const [index, character] of useEvent(player, "CharacterAdded")) {
				task.spawn(() => {
					task.wait(0.5);
					character.Parent = playersFolder;
					character.WaitForChild("Health").Destroy();

					world.insert(
						playerEntity,
						Components.Model({
							model: character,
						}),
					);

					const humanoid = character.FindFirstChildOfClass("Humanoid");
					if (humanoid) {
						world.insert(
							playerEntity,
							Components.Humanoid({
								humanoid: humanoid,
							}),
						);
					}

					world.insert(
						playerEntity,
						Components.Speed({
							speed: 16,
						}),
					);

					world.insert(
						playerEntity,
						Components.JumpPower({
							power: 50,
						}),
					);

					world.insert(
						playerEntity,
						Components.Health({
							health: 100,
							maxHealth: 100,
						}),
						Components.NaturalRegen(),
					);
				});
			}

			for (const [index, character] of useEvent(player, "CharacterRemoving")) {
				world.replace(
					playerEntity,
					Components.Player({
						player: player,
					}),
				);
			}
		}
	}
};
