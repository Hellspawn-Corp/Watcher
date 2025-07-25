export type Service = {
	id: string | undefined;
	service_url: string;
	port: number;
	icon_url: string;
	Uptime: Uptime[];
};

export type Uptime = {
	id: string | undefined;
	serviceId: string;
	timestamp: Date;
};
