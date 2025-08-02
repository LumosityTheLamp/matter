import { World } from "@rbxts/matter";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { Components } from "./components";
import { rng } from "./util";
import { mainWorld } from "./world";

const bloodParticlePart = ReplicatedStorage.WaitForChild("BloodParticle") as Part;
const bloodParticlesFolder = Workspace.WaitForChild("BloodParticles") as Folder;
const bloodSplatPart = ReplicatedStorage.WaitForChild("BloodSplat") as Part;
const bloodSplatFolder = Workspace.WaitForChild("BloodSplats") as Folder;

export function SpawnBloodParticle(position: Vector3, velocity: Vector3, lifetime: number) {
	const bloodParticleClone = bloodParticlePart.Clone();
	bloodParticleClone.Position = position;
	bloodParticleClone.Parent = bloodParticlesFolder;

	const entity = mainWorld.spawn();

	mainWorld.insert(
		entity,
		Components.Part({
			part: bloodParticleClone,
		}),
	);
	mainWorld.insert(
		entity,
		Components.Velocity({
			velocity: velocity,
		}),
	);
	mainWorld.insert(
		entity,
		Components.Gravity({
			gravity: -9.8,
		}),
	);
	mainWorld.insert(
		entity,
		Components.BloodParticle({
			lifetime: lifetime,
		}),
	);
}

export function SpawnBloodSplat(position: Vector3, direction: Vector3, size: number, lifetime: number) {
	const bloodSplatClone = bloodSplatPart.Clone();
	bloodSplatClone.CFrame = new CFrame(position, position.add(direction));
	bloodSplatClone.Size = Vector3.zero;
	bloodSplatClone.Parent = bloodSplatFolder;

	const entity = mainWorld.spawn();

	mainWorld.insert(
		entity,
		Components.Part({
			part: bloodSplatClone,
		}),
	);
	mainWorld.insert(
		entity,
		Components.BloodSplat({
			lifetime: lifetime,
		}),
	);

	const tween = TweenService.Create(bloodSplatClone, new TweenInfo(1), {
		Size: new Vector3(size, size, 0),
	});
	tween.Play();
}
