export const defaultAnimationsIds = {
	Idle: "http://www.roblox.com/asset/?id=180435571",
	Walk: "http://www.roblox.com/asset/?id=180426354",
	Jump: "http://www.roblox.com/asset/?id=125750702",
	Fall: "http://www.roblox.com/asset/?id=180436148",
	Climb: "http://www.roblox.com/asset/?id=180436334",
	Sit: "http://www.roblox.com/asset/?id=178130996",
};

export const rng = new Random();

export function RotateVector3(vector: Vector3, angle: number): Vector3 {
	return new Vector3(
		vector.X * math.cos(angle) - vector.Z * math.sin(angle),
		vector.Y,
		vector.X * math.sin(angle) + vector.Z * math.cos(angle),
	);
}

export function RotateVector2(vector: Vector2, angle: number): Vector2 {
	return new Vector2(
		vector.X * math.cos(angle) - vector.Y * math.sin(angle),
		vector.Y * math.sin(angle) + vector.Y * math.cos(angle),
	);
}
