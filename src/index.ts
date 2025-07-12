import {ActivityType, Client} from 'discord.js';
import {intentOptions} from './config/IntentOptions';
import {validateEnv} from './utils/validateEnv';

(async () => {
	validateEnv();
	const bot = new Client({intents: intentOptions});

	await bot.login(process.env.BOT_TOKEN).then(() => {
		bot.user?.setPresence({activities: [{name: 'Skrrt Skrrrt', type: ActivityType.Playing}], status: 'online'});
		console.log('logged in!');
	});
})();