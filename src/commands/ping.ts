import { EOL } from "node:os";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/Command";
import { pingServer } from "../modules/minecraft/ping";
import type { PingResponse } from "../types/minecraft/PingResponse";

export const ping: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Ping a host on a specified port")
		.addStringOption((option) =>
			option
				.setName("hostname")
				.setDescription("IP or hostname of the server to ping")
				.setRequired(true)
				.setAutocomplete(false),
		)
		.addIntegerOption((option) =>
			option
				.setName("port")
				.setDescription("Port of the server to ping")
				.setRequired(true),
		),
	async run(interaction) {
		if (interaction.isChatInputCommand()) {
			await interaction.deferReply();
			console.log(
				`Pinging server ${interaction.options.getString("hostname")} on port ${interaction.options.getInteger("port")}:`,
			);
			const swagResult: PingResponse = await pingServer(
				interaction.options.getString("hostname") || "localhost",
				interaction.options.getInteger("port") || 25565,
			);
			console.log(`Pinged server, returning response: ${swagResult.message}`);
			const pingEmbed = new EmbedBuilder()
				.setColor(0x09999)
				.setTitle(":3 reply")
				.setDescription(["ping ping ping"].join(EOL))
				.setFields([
					{
						name: "Returned",
						value: swagResult.message,
					},
				]);
			pingEmbed.setFooter({
				text: `Version ${process.env.npm_package_version ?? "unknown"} Developed by annie_xo & effie`,
			});
			await interaction.editReply({ embeds: [pingEmbed] });
		}
	},
};
