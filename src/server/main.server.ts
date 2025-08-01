import { Debugger, Loop, System, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { ReplicatedStorage, RunService, UserInputService } from "@rbxts/services";
import { GameState } from "shared/game-state";
import { SetupTags } from "./setup-tags";

const debuga = new Debugger(Plasma);
const widgets = debuga.getWidgets();

const mainWorld = new World();
const gameState: GameState = {};
const mainLoop = new Loop(mainWorld, gameState, widgets);
debuga.autoInitialize(mainLoop);

const sharedSystems = ReplicatedStorage.WaitForChild("TS").WaitForChild("systems");
const systemsFolder = script.Parent?.WaitForChild("systems");

const systems: System<[World]>[] = [];

if (systemsFolder) {
	for (const instance of systemsFolder.GetChildren()) {
		if (instance.IsA("ModuleScript")) {
			systems.push(require(instance) as System<[World]>);
		}
	}
}

if (sharedSystems) {
	for (const instance of sharedSystems.GetChildren()) {
		if (instance.IsA("ModuleScript")) {
			systems.push(require(instance) as System<[World]>);
		}
	}
}

mainLoop.scheduleSystems(systems);

mainLoop.begin({
	default: RunService.Heartbeat,
});

SetupTags(mainWorld);
