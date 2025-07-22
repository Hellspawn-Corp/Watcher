import { ActivityType, Client } from "discord.js";
import { BotVars } from "./config/EnvironmentVars";
import { intentOptions } from "./config/IntentOptions";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";
import { validateEnv } from "./utils/validateEnv";

(async () => {
	validateEnv();
	const bot = new Client({ intents: intentOptions });

	bot.on("ready", async () => onReady(bot));

	bot.on("interactionCreate", async (interaction) =>
		onInteraction(interaction),
	);

	await bot.login(BotVars.BOT_TOKEN).then(() => {
		bot.user?.setPresence({
			activities: [{ name: "Skrrt Skrrrt", type: ActivityType.Playing }],
			status: "online",
		});
		console.log("logged in!");
	});
})();
