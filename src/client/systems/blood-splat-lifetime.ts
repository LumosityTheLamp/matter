import { useDeltaTime, World } from "@rbxts/matter";
import { RunService, TweenService } from "@rbxts/services";
import { Components } from "shared/components";

export = (world: World) => {
	for (const [id, bloodSplat] of world.query(Components.BloodSplat)) {
		world.insert(
			id,
			bloodSplat.patch({
				lifetime: bloodSplat.lifetime - useDeltaTime(),
			}),
		);
		if (bloodSplat.lifetime <= 0) {
			const part = world.get(id, Components.Part);
			if (part) {
				const surfaceGui = part.part.FindFirstChild("SurfaceGui") as SurfaceGui;
				if (surfaceGui) {
					const image = surfaceGui.FindFirstChild("ImageLabel") as ImageLabel;

					if (image) {
						world.insert(
							id,
							bloodSplat.patch({
								lifetime: math.huge,
							}),
						);
						const tween = TweenService.Create(image, new TweenInfo(1), {
							ImageTransparency: 1,
						});
						tween.Completed.Once(() => {
							part.part.Destroy();
							world.despawn(id);
						});
						tween.Play();
						continue;
					}
				}
				part.part.Destroy();
			}
			world.despawn(id);
		}
	}
};
