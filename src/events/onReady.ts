import type { Client } from "discord.js";
import { REST, Routes } from "discord.js";
import { commandList } from "../commands/_CommandList";
import { BotVars } from "../config/EnvironmentVars";
import { pingServer } from "../modules/minecraft/ping";

export const onReady = async (BOT: Client) => {
	const rest = new REST({ version: "10" }).setToken(BotVars.BOT_TOKEN!);

	const commandData = commandList.map((command) => command.data.toJSON());

	await rest.put(Routes.applicationCommands(BOT.user?.id ?? "missing id"), {
		body: commandData,
	});

	console.log("ready!");

	pingServer("10.0.1.35", 25566);
};
