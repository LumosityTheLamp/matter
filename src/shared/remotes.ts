import { Client, createRemotes, remote } from "@rbxts/remo";

export const Remotes = createRemotes({
	ReplicateComponents: remote<Client, [changes: Map<string, Map<string, { data: any }>>]>(),
});
