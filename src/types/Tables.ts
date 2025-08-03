import type { Status } from "../../generated/prisma/client";

export type Service = {
	id?: string;
	name: string;
	service_url: string;
	port: number;
	icon_url?: string;
	Uptime?: Uptime[];
};

export type Uptime = {
	id?: string;
	serviceId: string;
	timestamp: Date;
	status: Status;
};
