import { EOL } from "node:os";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Status } from "../../generated/prisma/client";
import { McVars } from "../config/EnvironmentVars";
import { PrismaAdapter } from "../db/adapters/PrismaAdapter";
import { StorageManager } from "../db/StorageManager";
import { pingServer } from "../modules/minecraft/ping";
import type { Command } from "../types/Command";
import type { PingResponse } from "../types/minecraft/PingResponse";
import type { Service, Uptime } from "../types/Tables";
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
				status: Status.UNKNOWN,
				uptime: [],
				logo: "",
				image: "",
			};

			if (text) {
				if (text === "minecraft") {
					const swagResult: PingResponse = await pingServer(
						McVars.hostname!,
						McVars.port!,
					);
					uptime.service = "Minecraft";
					uptime.status = swagResult.status;

					const db = new StorageManager(new PrismaAdapter());
					db.save<Service>("Service", {
						name: "Minecraft",
						service_url: McVars.hostname!,
						port: McVars.port!,
					});
					const mc_service = await db.search<Service>(
						"Service",
						"Minecraft",
						"name",
					);
					if (mc_service) {
						db.save<Uptime>("Uptime", {
							serviceId: mc_service[0].id!,
							timestamp: new Date(Date.now()),
							status: uptime.status,
						});
						const skibidi_uptimes = await db.search<Uptime>(
							"Uptime",
							mc_service[0].id!,
							"serviceId",
						);
						if (skibidi_uptimes) {
							uptime.uptime = skibidi_uptimes.map((u) => u.timestamp);
						}
					}

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
					{ name: "Status", value: `${uptime.status}` },
					{ name: "Total", value: "69hrs (nice)", inline: true },
					{ name: "Avg Up", value: "100% bby", inline: true },
					{ name: "Avg Down", value: "40m", inline: true },
					{ name: "Uptime test lol", value: `${uptime.uptime}` },
				)
				.setImage(uptime.image)
				.setFooter({
					text: `Version ${process.env.npm_package_version ?? "unknown"} Developed by annie_xo & effie`,
				});

			if (uptime.status === Status.ONLINE) {
				uptimeEmbed.setColor(0x28c214);
			} else if (uptime.status === Status.OFFLINE) {
				uptimeEmbed.setColor(0x28c214);
			}
			await interaction.editReply({ embeds: [uptimeEmbed] });
		}
	},
};
