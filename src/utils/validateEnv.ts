import { BotVars } from "../config/EnvironmentVars";

export const validateEnv = () => {
	const envs = ["BOT_TOKEN"];

	envs.forEach((env) => {
		if (!process.env[env]) {
			throw new Error(`${env} is not defined`);
		}
		BotVars[env] = process.env[env];
	});
};
