import { Players } from "@rbxts/services";
import Vide, { root } from "@rbxts/vide";

function Gui() {
	return <screengui Parent={Players.LocalPlayer.WaitForChild("PlayerGui")}></screengui>;
}

const gui = root(Gui);
