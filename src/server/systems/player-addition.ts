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
				instance: player,
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
					character.WaitForChild("Animate").Destroy();

					world.insert(
						playerEntity,
						Components.Model({
							instance: character,
						}),
						Components.Humanoid(),
						Components.Speed({
							value: 16,
						}),
						Components.JumpPower({
							value: 50,
						}),
						Components.Health({
							value: 100,
							maxValue: 100,
						}),
						Components.NaturalRegen(),
						Components.MovementAnimations({
							useDefault: true,
							pose: "",
							jumpTimer: 0,
						}),
					);
				});
			}

			for (const [index, character] of useEvent(player, "CharacterRemoving")) {
				world.replace(
					playerEntity,
					Components.Player({
						instance: player,
					}),
				);
			}
		}
	}
};
