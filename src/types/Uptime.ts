import type { STATUS } from "./minecraft/PingResponse";

export type UptimeData = {
	service: string;
	status: STATUS;
	uptime: string;
	logo: string;
	image: string;
};
