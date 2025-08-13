import { ReplicatedStorage } from "@rbxts/services";
import { BeginScheduler, LoadSystemsInFolder } from "shared/scheduler";
import { SetupTags } from "./setup-tags";
import { MainWorld } from "shared/world";

SetupTags(MainWorld);
LoadSystemsInFolder(script.Parent!.WaitForChild("systems"));
LoadSystemsInFolder(ReplicatedStorage.WaitForChild("TS").WaitForChild("systems"));
BeginScheduler();
