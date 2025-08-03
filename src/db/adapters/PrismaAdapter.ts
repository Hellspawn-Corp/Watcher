import type { PrismaClient } from "../../../generated/prisma";
import type { Service, Uptime } from "../../types/Tables";
import { prisma } from "../init";
import type { Adapter, TableHandler } from "../StorageManager";

const client = prisma;

class PrismaServiceHandler implements TableHandler<Service> {
	client: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.client = prismaClient;
	}

	async save(data: Service): Promise<void> {
		await this.client.service.create({
			data: {
				id: data.id,
				name: data.name,
				service_url: data.service_url,
				port: data.port,
				icon_url: data.icon_url!,
				Uptime: {
					create: data.Uptime!.map((u) => ({
						id: u.id,
						serviceId: u.serviceId,
						timestamp: u.timestamp,
						status: u.status,
					})),
				},
			},
		});
	}

	async update(id: string, data: Service): Promise<void> {
		await this.client.service.update({
			where: { id },
			data: {
				service_url: data.service_url,
				port: data.port,
				icon_url: data.icon_url,
				Uptime: {
					deleteMany: { serviceId: id },
					create: data.Uptime!.map((u) => ({
						id: u.id,
						serviceId: u.serviceId,
						timestamp: u.timestamp,
						status: u.status,
					})),
				},
			},
		});
	}

	async delete(id: string): Promise<void> {
		await this.client.service.delete({
			where: { id },
		});
	}

	async findById(id: string): Promise<Service | null> {
		const result = await this.client.service.findUnique({
			where: { id },
			include: { Uptime: true },
		});
		if (!result) return null;
		return {
			id: result.id,
			name: result.name,
			service_url: result.service_url,
			port: result.port,
			icon_url: result.icon_url,
			Uptime: result.Uptime.map((u: any) => ({
				id: u.id,
				serviceId: u.serviceId,
				timestamp:
					u.timestamp instanceof Date ? u.timestamp : new Date(u.timestamp),
				status: u.status,
			})),
		};
	}

	async findAll(): Promise<Service[]> {
		const results = await this.client.service.findMany({
			include: { Uptime: true },
		});
		return results.map((result: any) => ({
			id: result.id,
			name: result.name,
			service_url: result.service_url,
			port: result.port,
			icon_url: result.icon_url,
			Uptime: result.Uptime.map((u: any) => ({
				id: u.id,
				serviceId: u.serviceId,
				timestamp:
					u.timestamp instanceof Date ? u.timestamp : new Date(u.timestamp),
			})),
		}));
	}

	async search(): Promise<Service[] | null> {
		return null;
	}
}

class PrismaUptimeHandler implements TableHandler<Uptime> {
	client: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.client = prismaClient;
	}

	async save(data: Uptime): Promise<void> {
		await this.client.uptime.create({
			data: {
				id: data.id,
				serviceId: data.serviceId,
				timestamp: data.timestamp,
				status: data.status,
			},
		});
	}

	async update(id: string, data: Uptime): Promise<void> {
		await this.client.uptime.update({
			where: { id },
			data: {
				serviceId: data.serviceId,
				timestamp: data.timestamp,
			},
		});
	}

	async delete(id: string): Promise<void> {
		await this.client.uptime.delete({
			where: { id },
		});
	}

	async findById(id: string): Promise<Uptime | null> {
		const result = await this.client.uptime.findUnique({
			where: { id },
		});
		if (!result) return null;
		return {
			id: result.id,
			serviceId: result.serviceId,
			timestamp:
				result.timestamp instanceof Date
					? result.timestamp
					: new Date(result.timestamp),
			status: result.status,
		};
	}

	async findByServiceId(serviceId: string): Promise<Uptime[]> {
		const results = await this.client.uptime.findMany({
			where: { serviceId },
		});
		return results.map((u: any) => ({
			id: u.id,
			serviceId: u.serviceId,
			timestamp:
				u.timestamp instanceof Date ? u.timestamp : new Date(u.timestamp),
			status: u.status,
		}));
	}

	async findAll(): Promise<Uptime[]> {
		const results = await this.client.uptime.findMany();
		return results.map((u: any) => ({
			id: u.id,
			serviceId: u.serviceId,
			timestamp:
				u.timestamp instanceof Date ? u.timestamp : new Date(u.timestamp),
			status: u.status,
		}));
	}

	async search(query: string, field: string): Promise<Uptime[] | null> {
		return await this.client.uptime.findMany({
			where: { [field]: { contains: query } },
		});
	}
}

export class PrismaAdapter implements Adapter {
	private handlers: Record<string, TableHandler<any>> = {};

	constructor() {
		this.handlers["Service"] = new PrismaServiceHandler(client);
		this.handlers["Uptime"] = new PrismaUptimeHandler(client);
	}

	getHandler<T>(table: string): TableHandler<T> {
		const handler = this.handlers[table];
		if (!handler) {
			throw new Error(`No handler found for table: ${table}`);
		}
		return handler as TableHandler<T>;
	}
}
