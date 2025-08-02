import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import Vide, { root } from "@rbxts/vide";

export = (world: World) => {
	function Gui() {
		return <screengui Parent={Players.LocalPlayer.WaitForChild("PlayerGui")}></screengui>;
	}
	root(Gui);
};
