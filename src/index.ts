import { ActivityType, Client } from "discord.js";
import { intentOptions } from "./config/IntentOptions";
import { validateEnv } from "./utils/validateEnv";
import { BotVars } from "./config/EnvironmentVars";
import { onReady } from "./events/onReady";

(async () => {
	validateEnv();
	const bot = new Client({ intents: intentOptions });
	bot.on("ready", async () => onReady(bot));
	await bot.login(BotVars.BOT_TOKEN).then(() => {
		bot.user?.setPresence({
			activities: [{ name: "Skrrt Skrrrt", type: ActivityType.Playing }],
			status: "online",
		});
		console.log("logged in!");
	});
})();

