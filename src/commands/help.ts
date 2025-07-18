import { EOL } from "node:os";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/Command";

export const help: Command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("le ebic watcher help :3"),
	async run(interaction) {
		if (interaction.isChatInputCommand()) {
			await interaction.deferReply();
			const helpEmbed = new EmbedBuilder()
				.setColor(0x09999)
				.setTitle("Watcher Help")
				.setDescription(
					["Watcher is a swag infra bot", "Annie please help"].join(EOL),
				)
				.addFields(
					{
						name: "Help",
						value: "blep",
					},
					{ name: "Help", value: "Shows this message." },
				)
				.setFooter({
					text: `Version ${process.env.npm_package_version ?? "unknown"} Developed by annie_xo & effie`,
				});
			await interaction.editReply({ embeds: [helpEmbed] });
		}
	},
};
