import type { PrismaClient } from "../../generated/prisma";
import type { Service, Uptime } from "../types/Service";

interface TableHandler<T> {
	save(data: T): Promise<void>;
	update(id: string, data: T): Promise<void>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<T | null>;
	findAll(): Promise<T[]>;
}

class ServiceHandler implements TableHandler<Service> {
	async save(data: Service): Promise<void> {
		// Logic to save a Service
	}

	async update(id: string, data: Service): Promise<void> {
		// Logic to update a Service
	}

	async delete(id: string): Promise<void> {
		// Logic to delete a Service
	}

	async findById(id: string): Promise<Service | null> {
		// Logic to find a Service by ID
		return null; // Placeholder return
	}

	async findAll(): Promise<Service[]> {
		// Logic to find all Services
		return []; // Placeholder return
	}
}

class PrismaServiceHandler implements ServiceHandler {
	client: PrismaClient;

	constructor(private prismaClient: PrismaClient) {
		this.client = prismaClient;
	}

	async save(data: Service): Promise<void> {
		await this.client.service.create({
			data: {
				id: data.id,
				service_url: data.service_url,
				port: data.port,
				icon_url: data.icon_url,
				Uptime: {
					create: data.Uptime.map((u) => ({
						id: u.id,
						serviceId: u.serviceId,
						timestamp: u.timestamp,
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
					create: data.Uptime.map((u) => ({
						id: u.id,
						serviceId: u.serviceId,
						timestamp: u.timestamp,
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
			service_url: result.service_url,
			port: result.port,
			icon_url: result.icon_url,
			Uptime: result.Uptime.map((u: any) => ({
				id: u.id,
				serviceId: u.serviceId,
				timestamp:
					u.timestamp instanceof Date ? u.timestamp : new Date(u.timestamp),
			})),
		};
	}

	async findAll(): Promise<Service[]> {
		const results = await this.client.service.findMany({
			include: { Uptime: true },
		});
		return results.map((result: any) => ({
			id: result.id,
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
}

class UptimeHandler implements TableHandler<Uptime> {
	async save(data: Uptime): Promise<void> {
		// Logic to save an Uptime entry
	}

	async update(id: string, data: Uptime): Promise<void> {
		// Logic to update an Uptime entry
	}

	async delete(id: string): Promise<void> {
		// Logic to delete an Uptime entry
	}

	async findById(id: string): Promise<Uptime | null> {
		// Logic to find an Uptime entry by ID
		return null; // Placeholder return
	}

	async findByServiceId(serviceId: string): Promise<Uptime[]> {
		// Logic to find Uptime entries by serviceId
		return [];
	}

	async findAll(): Promise<Uptime[]> {
		// Logic to find all Uptime entries
		return [];
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
		}));
	}

	async findAll(): Promise<Uptime[]> {
		const results = await this.client.uptime.findMany();
		return results.map((u: any) => ({
			id: u.id,
			serviceId: u.serviceId,
			timestamp:
				u.timestamp instanceof Date ? u.timestamp : new Date(u.timestamp),
		}));
	}
}
class HandlerFactory {
	private handlers: Record<
		string,
		TableHandler<Service> | TableHandler<Uptime>
	> = {};

	constructor() {
		this.handlers.Service = new ServiceHandler();
		this.handlers.Uptime = new UptimeHandler();
	}

	getHandler<T>(table: string): TableHandler<T> {
		const handler = this.handlers[table];
		if (!handler) {
			throw new Error(`No handler found for table: ${table}`);
		}
		return handler as TableHandler<T>;
	}
}

class StorageManager {
	private handlerFactory = new HandlerFactory();

	async save<T>(table: string, data: T): Promise<void> {
		const handler = this.handlerFactory.getHandler<T>(table);
		await handler.save(data);
	}

	async update<T>(table: string, id: string, data: T): Promise<void> {
		const handler = this.handlerFactory.getHandler<T>(table);
		await handler.update(id, data);
	}

	async delete<T>(table: string, id: string): Promise<void> {
		const handler = this.handlerFactory.getHandler<T>(table);
		await handler.delete(id);
	}

	async findById<T>(table: string, id: string): Promise<T | null> {
		const handler = this.handlerFactory.getHandler<T>(table);
		return handler.findById(id);
	}

	async findAll<T>(table: string): Promise<T[]> {
		const handler = this.handlerFactory.getHandler<T>(table);
		return handler.findAll();
	}
}
