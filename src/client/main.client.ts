import { ReplicatedStorage, StarterGui } from "@rbxts/services";
import { MainInputManager } from "./input-manager";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { BeginScheduler, LoadGuiFolder, LoadSystemsInFolder, MainDebugger } from "shared/scheduler";

StarterGui.SetCoreGuiEnabled("All", false);
StarterGui.SetCoreGuiEnabled("Chat", true);
StarterGui.SetCoreGuiEnabled("PlayerList", true);
StarterGui.SetCoreGuiEnabled("Backpack", true);

LoadSystemsInFolder(script.Parent!.WaitForChild("systems"));
LoadSystemsInFolder(ReplicatedStorage.WaitForChild("TS").WaitForChild("systems"));
LoadGuiFolder(script.Parent!.WaitForChild("gui"));
BeginScheduler();

const debuggerAction = new StandardActionBuilder("F4").setProcessed(false);

debuggerAction.activated.Connect(() => {
	MainDebugger.toggle();
});

MainInputManager.bind(debuggerAction);
