import { Configuration, Route } from "@rbxts/yetanothernet";

const defaultConfiguration: Configuration = {
	Channel: "Reliable",
	Event: "default",
};

export namespace Routes {
	export const MatterReplication = new Route<[changes: Map<string, Map<string, { data: any }>>]>(
		defaultConfiguration,
	);
}
