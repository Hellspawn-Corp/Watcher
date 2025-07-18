import { EOL } from "node:os";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types/Command";

export const uptime: Command = {
	data: new SlashCommandBuilder()
		.setName("uptime")
		.setDescription("Show uptime information about service.")
		.addStringOption((option) =>
			option
				.setName("service_name")
				.setDescription("Name of the service to query for uptime info.")
				.setRequired(false)
				.setAutocomplete(false),
		),
	async run(interaction) {
		if (interaction.isChatInputCommand()) {
			await interaction.deferReply();
			const uptimeEmbed = new EmbedBuilder()
				.setColor(0x09999)
				.setTitle("Watcher Uptime")
				.setDescription([""].join(EOL))
				.setFooter({
					text: `Version ${process.env.npm_package_version ?? "unknown"} Developed by annie_xo & effie`,
				});
			await interaction.editReply({ embeds: [uptimeEmbed] });
		}
	},
};
