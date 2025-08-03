import { Status } from "../../../generated/prisma/client";

export type PingResponse = {
	status: Status;
	message: string;
};

// export enum STATUS {
// 	UNKNOWN,
// 	ONLINE,
// 	OFFLINE,
// }
