import mc, { type PingOptions } from "minecraft-protocol";
import { Status } from "../../../generated/prisma/client";
import type { PingResponse } from "../../types/minecraft/PingResponse";

export async function pingServer(
	hostname: string,
	port: number,
): Promise<PingResponse> {
	const pingOptions: PingOptions = {
		host: hostname,
		port: port,
	};

	return new Promise<PingResponse>((resolve) => {
		mc.ping(pingOptions, (error, result) => {
			if (error) {
				console.error("Error pinging the server:", error);
				resolve({
					status: Status.OFFLINE,
					message: `Error pinging the server: ${error.message}`,
				});
			} else {
				let versionInfo: string;
				if (typeof result.version === "string") {
					versionInfo = result.version;
				} else if (result.version && typeof result.version.name === "string") {
					versionInfo = result.version.name;
				} else {
					versionInfo = "Unknown";
				}
				resolve({
					status: Status.ONLINE,
					message: `Server is online! Version: ${versionInfo}`,
				});
			}
		});
	});
}
