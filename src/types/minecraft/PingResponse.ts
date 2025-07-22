export type PingResponse = {
	status: STATUS;
	message: string;
};

export enum STATUS {
	UNKNOWN,
	ONLINE,
	OFFLINE,
}
