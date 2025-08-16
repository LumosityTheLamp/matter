import { Debugger, Loop, System } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { MainWorld } from "./world";
import { root } from "@rbxts/vide";
import { RunService } from "@rbxts/services";
import Net from "@rbxts/yetanothernet";
import { Routes } from "./routes";
import Signal from "@rbxts/lemon-signal";

export const MainDebugger = new Debugger(Plasma);
MainDebugger.authorize = (player) => {
	if (player.UserId === game.CreatorId || player.UserId === 98166200) {
		return true;
	}
	return false;
};

export const MainScheduler = new Loop(MainWorld);
Net.start(MainScheduler, Routes);
print("Net Started");

MainDebugger.autoInitialize(MainScheduler);
print("Debugger Started");

export function LoadSystemsInFolder(folder: Instance) {
	const systems: System<[]>[] = [];

	for (const instance of folder.GetChildren()) {
		if (instance.IsA("ModuleScript")) {
			systems.push(require(instance) as System<[]>);
		}
	}

	if (systems.size() > 0) {
		MainScheduler.scheduleSystems(systems);
		print(`Loaded ${systems.size()} Systems`);
	}
}

export function LoadGuiFolder(folder: Instance) {
	const systems: System<[]>[] = [];

	for (const instance of folder.GetChildren()) {
		if (instance.IsA("ModuleScript")) {
			root((require(instance) as { gui: () => any })["gui"]);
			systems.push(require(instance) as System<[]>);
			print(`Loaded Gui: ${instance.Name}`);
		}
	}

	MainScheduler.scheduleSystems(systems);
}

export function BeginScheduler() {
	MainScheduler.begin({
		default: RunService.Heartbeat,
	});
	print(`Scheduler Started`);
}
