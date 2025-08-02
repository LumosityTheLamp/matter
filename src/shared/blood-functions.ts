import { World } from "@rbxts/matter";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { Components } from "./components";
import { rng } from "./util";

const bloodParticlePart = ReplicatedStorage.WaitForChild("BloodParticle") as Part;
const bloodParticlesFolder = Workspace.WaitForChild("BloodParticles") as Folder;
const bloodSplatPart = ReplicatedStorage.WaitForChild("BloodSplat") as Part;
const bloodSplatFolder = Workspace.WaitForChild("BloodSplats") as Folder;

export function SpawnBloodParticle(world: World, position: Vector3, velocity: Vector3, lifetime: number) {
	const bloodParticleClone = bloodParticlePart.Clone();
	bloodParticleClone.Position = position;
	bloodParticleClone.Parent = bloodParticlesFolder;

	const entity = world.spawn();

	world.insert(
		entity,
		Components.Part({
			part: bloodParticleClone,
		}),
	);
	world.insert(
		entity,
		Components.Velocity({
			velocity: velocity,
		}),
	);
	world.insert(entity, Components.Gravity());
	world.insert(
		entity,
		Components.BloodParticle({
			lifetime: lifetime,
		}),
	);
}

export function SpawnBloodSplat(world: World, position: Vector3, direction: Vector3, size: number, lifetime: number) {
	const bloodSplatClone = bloodSplatPart.Clone();
	bloodSplatClone.CFrame = new CFrame(position, position.add(direction));
	bloodSplatClone.Size = Vector3.zero;
	bloodSplatClone.Parent = bloodSplatFolder;

	const entity = world.spawn();

	world.insert(
		entity,
		Components.Part({
			part: bloodSplatClone,
		}),
	);
	world.insert(
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
