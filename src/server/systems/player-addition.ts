import { Entity, useEvent, World } from "@rbxts/matter";
import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { Components } from "shared/components";
import { defaultAnimationsIds } from "shared/util";

const playersFolder = Workspace.WaitForChild("Players") as Folder;

function SetupCharacter(character: Model) {
	character.WaitForChild("Health").Destroy();
	character.WaitForChild("Animate").Destroy();
	character.PrimaryPart = character.WaitForChild("HumanoidRootPart") as Part;

	const rightArm = character.WaitForChild("Right Arm") as Part;

	const rightHandAnchorPoint = new Instance("Part");
	rightHandAnchorPoint.Name = "ObjectAnchorPoint_RightHand";
	rightHandAnchorPoint.BrickColor = new BrickColor("Really red");
	rightHandAnchorPoint.Anchored = false;
	rightHandAnchorPoint.Massless = true;
	rightHandAnchorPoint.Material = Enum.Material.Neon;
	rightHandAnchorPoint.Transparency = 1;
	const rightHandAnchorWeld = new Instance("Weld");
	rightHandAnchorWeld.Name = "Handle";
	rightHandAnchorWeld.C0 = new CFrame(new Vector3(0, 0, 0.14));
	rightHandAnchorWeld.Parent = rightHandAnchorPoint;
	const rightHandAnchorPointMotor = new Instance("Motor6D");
	rightHandAnchorPointMotor.Name = "ObjectAnchorPoint_RightHand";
	rightHandAnchorPointMotor.C0 = new CFrame(new Vector3(0, -1, 0));

	const anchorPointsFolder = new Instance("Folder");
	anchorPointsFolder.Name = "AnchorPoints";
	anchorPointsFolder.Parent = character;
	rightHandAnchorPoint.Parent = anchorPointsFolder;

	rightHandAnchorPointMotor.Parent = rightArm;
	rightHandAnchorPointMotor.Part0 = rightArm;
	rightHandAnchorPointMotor.Part1 = rightHandAnchorPoint;

	const sword = ServerStorage.WaitForChild("Sword").Clone() as Model;
	const swordHandle = sword.WaitForChild("Handle") as Part;

	rightHandAnchorWeld.Part0 = rightHandAnchorPoint;
	rightHandAnchorWeld.Part1 = swordHandle;

	sword.Parent = character;
}

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
					SetupCharacter(character);

					world.insert(
						playerEntity,
						Components.Model({
							instance: character,
						}),
						Components.Sword({
							instance: character.WaitForChild("Sword") as Model,
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
						Components.Animations({
							animations: {
								Idle: {
									id: "rbxassetid://126103463831238",
								},
								Walk: {
									id: "rbxassetid://107728846537781",
								},
								Jump: {
									id: defaultAnimationsIds.Jump,
								},
								Fall: {
									id: defaultAnimationsIds.Fall,
								},
								Climb: {
									id: defaultAnimationsIds.Climb,
								},
								Sit: {
									id: defaultAnimationsIds.Sit,
								},
								Block: {
									id: "rbxassetid://132450631614420",
								},
								BlockHold: {
									id: "rbxassetid://126305655897380",
								},
							},
						}),
						Components.MovementAnimations({
							useDefaults: false,
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
