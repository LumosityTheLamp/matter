import { Debugger, Loop, System } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { MainWorld } from "./world";
import { root } from "@rbxts/vide";
import { RunService } from "@rbxts/services";

export const MainDebugger = new Debugger(Plasma);
MainDebugger.authorize = (player) => {
	if (player.UserId === game.CreatorId || player.UserId === 98166200) {
		return true;
	}
	return false;
};

export const MainScheduler = new Loop(MainWorld);

MainDebugger.autoInitialize(MainScheduler);

export function LoadSystemsInFolder(folder: Instance) {
	const systems: System<[]>[] = [];

	for (const instance of folder.GetChildren()) {
		if (instance.IsA("ModuleScript")) {
			systems.push(require(instance) as System<[]>);
		}
	}

	if (systems.size() > 0) {
		MainScheduler.scheduleSystems(systems);
	}
}

export function LoadGuiFolder(folder: Instance) {
	const systems: System<[]>[] = [];

	for (const instance of folder.GetChildren()) {
		if (instance.IsA("ModuleScript")) {
			root((require(instance) as { gui: () => any })["gui"]);
			systems.push(require(instance) as System<[]>);
		}
	}

	MainScheduler.scheduleSystems(systems);
}

export function BeginScheduler() {
	MainScheduler.begin({
		default: RunService.Heartbeat,
	});
}
