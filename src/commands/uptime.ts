import { EOL } from "node:os";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { pingServer } from "../modules/minecraft/ping";
import type { Command } from "../types/Command";
import { type PingResponse, STATUS } from "../types/minecraft/PingResponse";
import type { UptimeData } from "../types/Uptime";

export const uptime: Command = {
	data: new SlashCommandBuilder()
		.setName("uptime")
		.setDescription("Show uptime information about service.")
		.addStringOption((option) =>
			option
				.setName("service")
				.setDescription("Name of the service to query for uptime info.")
				.setRequired(false)
				.setAutocomplete(false),
		),
	async run(interaction) {
		if (interaction.isChatInputCommand()) {
			await interaction.deferReply();

			const text: string | null = interaction.options.getString("service");

			const uptime: UptimeData = {
				service: "",
				status: STATUS.UNKNOWN,
				uptime: "",
				logo: "",
				image: "",
			};

			if (text) {
				if (text === "minecraft") {
					const swagResult: PingResponse = await pingServer();
					uptime.service = "Minecraft";
					uptime.status = swagResult.status;
					// TODO: Get uptime stuff from DB <20-07-25, Effie2096 havealittlefaith2096@gmail.com>
					uptime.logo =
						"https://minecraft.wiki/images/Minecraft_social_icon.png";
					uptime.image = "https://i.imgflip.com/8k9aot.jpg";
				}
			}

			const uptimeEmbed = new EmbedBuilder()
				.setColor(0x09999)
				.setThumbnail(uptime.logo)
				.setTitle(`Watcher: ${uptime.service} Uptime`)
				.setDescription(["you know type shi yeag"].join(EOL))
				.setFields(
					{ name: "Status", value: `${STATUS[uptime.status]}` },
					{ name: "Total", value: "69hrs (nice)", inline: true },
					{ name: "Avg Up", value: "100% bby", inline: true },
					{ name: "Avg Down", value: "40m", inline: true },
				)
				.setImage(uptime.image)
				.setFooter({
					text: `Version ${process.env.npm_package_version ?? "unknown"} Developed by annie_xo & effie`,
				});

			if (uptime.status === STATUS.ONLINE) {
				uptimeEmbed.setColor(0x28c214);
			} else if (uptime.status === STATUS.OFFLINE) {
				uptimeEmbed.setColor(0x28c214);
			}
			await interaction.editReply({ embeds: [uptimeEmbed] });
		}
	},
};
