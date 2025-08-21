import { Configuration, Route } from "@rbxts/yetanothernet";

const defaultConfiguration: Configuration = {
	Channel: "Reliable",
	Event: "default",
};

export interface ComponentChangesReplication {
	[componentName: string]: {
		data: any;
	};
}

export interface EntityComponentChangesReplication {
	[entityId: string]: ComponentChangesReplication;
}

export namespace Routes {
	export const MatterReplication = new Route<[changes: EntityComponentChangesReplication]>(defaultConfiguration);
	export const Block = new Route<[active: boolean]>(defaultConfiguration);
}
