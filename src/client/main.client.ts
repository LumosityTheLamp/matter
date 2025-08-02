import { AnyComponent, Debugger, Entity, Loop, System, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { ReplicatedStorage, RunService, StarterGui } from "@rbxts/services";
import { GameState } from "shared/game-state";
import { MainInputManager } from "./input-manager";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Remotes } from "shared/remotes";
import { Components } from "shared/components";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { root } from "@rbxts/vide";

StarterGui.SetCoreGuiEnabled("All", false);
StarterGui.SetCoreGuiEnabled("Chat", true);
StarterGui.SetCoreGuiEnabled("PlayerList", true);
StarterGui.SetCoreGuiEnabled("Backpack", true);

const debuga = new Debugger(Plasma);
debuga.authorize = (player) => {
	if (player.UserId === game.CreatorId || player.UserId === 98166200) {
		return true;
	}
	return false;
};
const widgets = debuga.getWidgets();

const mainWorld = new World();
const gameState: GameState = {};
const mainLoop = new Loop(mainWorld, gameState, widgets);
debuga.autoInitialize(mainLoop);

const sharedSystems = ReplicatedStorage.WaitForChild("TS").WaitForChild("systems");
const systemsFolder = script.Parent?.WaitForChild("systems");
const guiFolder = script.Parent?.WaitForChild("gui");

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

if (guiFolder) {
	for (const instance of guiFolder.GetChildren()) {
		if (instance.IsA("ModuleScript")) {
			systems.push(
				(require(instance) as { system: System<[World]>; gui: () => void })["system"] as System<[World]>,
			);
			root((require(instance) as { system: System<[World]>; gui: () => void })["gui"]);
		}
	}
}

mainLoop.scheduleSystems(systems);

mainLoop.begin({
	default: RunService.Heartbeat,
});

const debuggerAction = new StandardActionBuilder("F4").setProcessed(false);

debuggerAction.activated.Connect(() => {
	debuga.toggle();
});

MainInputManager.bind(debuggerAction);

const entityIdMap = new Map<string, Entity>();

Remotes.ReplicateComponents.connect((changes) => {
	for (const [serverEntityId, componentMap] of changes) {
		let clientEntityId = entityIdMap.get(serverEntityId);

		if (clientEntityId && next(componentMap) === undefined) {
			mainWorld.despawn(clientEntityId);
			entityIdMap.delete(serverEntityId);
			continue;
		}

		const componentsToInsert: AnyComponent[] = [];
		const componentsToRemove: AnyComponent[] = [];

		for (const [name, container] of componentMap) {
			if (container.data) {
				componentsToInsert.push(
					(Components as Record<string, (data: unknown) => AnyComponent>)[name](
						container.data,
					) as AnyComponent,
				);
			} else {
				componentsToRemove.push((Components as unknown as Record<string, AnyComponent>)[name] as AnyComponent);
			}
		}

		if (clientEntityId === undefined) {
			clientEntityId = mainWorld.spawn();

			for (const c of componentsToInsert) {
				mainWorld.insert(clientEntityId, c);
			}

			mainWorld.insert(clientEntityId, Components.Networked());

			entityIdMap.set(serverEntityId, clientEntityId);
		} else {
			for (const c of componentsToInsert) {
				mainWorld.insert(clientEntityId, c);
			}

			for (const c of componentsToRemove) {
				mainWorld.remove(clientEntityId, c as ComponentCtor);
			}
		}
	}
});
