import { useDeltaTime, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { SpawnBloodSplat } from "shared/blood-functions";
import { Components } from "shared/components";
import { rng } from "shared/util";

const rayParams = new RaycastParams();
rayParams.FilterDescendantsInstances = [Workspace.WaitForChild("Players")];
rayParams.FilterType = Enum.RaycastFilterType.Exclude;
rayParams.RespectCanCollide = true;

export = (world: World) => {
	for (const [id, bloodParticle, part, velocity] of world.query(
		Components.BloodParticle,
		Components.Part,
		Components.Velocity,
	)) {
		const ray = Workspace.Raycast(part.instance.Position, velocity.velocity.mul(useDeltaTime()), rayParams);
		if (ray) {
			if (ray.Instance.Anchored) {
				const sound = part.instance.FindFirstChild("BloodSplat") as Sound;
				if (sound) {
					sound.PlaybackSpeed = rng.NextNumber(0.8, 1.2);
					sound.Play();
				}
				const billboard = part.instance.FindFirstChild("BillboardGui") as BillboardGui;
				if (billboard) {
					billboard.Enabled = false;
				}
				world.remove(id, Components.Velocity);
				part.instance.Position = ray.Position;
				world.insert(
					id,
					bloodParticle.patch({
						lifetime: 1,
					}),
				);
				SpawnBloodSplat(world, ray.Position, ray.Normal, rng.NextNumber(2, 4), 5);
			}
		}
	}
};
