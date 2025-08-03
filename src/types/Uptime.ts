import { Status } from "../../generated/prisma/client";

export type UptimeData = {
	service: string;
	status: Status;
	uptime: Date[];
	logo: string;
	image: string;
};
