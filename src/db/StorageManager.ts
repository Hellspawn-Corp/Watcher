import type { PrismaClient } from "../../generated/prisma";
import type { Service, Uptime } from "../types/Service";

interface TableHandler<T> {
	save(data: T): Promise<void>;
	update(id: string, data: T): Promise<void>;
}

class ServiceHandler implements TableHandler<Service> {
	async save(data: Service): Promise<void> {
		// Logic to save a Service
	}

	async update(id: string, data: Service): Promise<void> {
		// Logic to update a Service
	}
}

class UptimeHandler implements TableHandler<Uptime> {
	async save(data: Uptime): Promise<void> {
		// Logic to save an Uptime entry
	}

	async update(id: string, data: Uptime): Promise<void> {
		// Logic to update an Uptime entry
	}
}

class HandlerFactory {
	private handlers: Record<string, TableHandler<any>> = {};

	constructor() {
		this.handlers["Service"] = new ServiceHandler();
		this.handlers["Uptime"] = new UptimeHandler();
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
}

class PrismaStorage implements StorageManager {
	client: PrismaClient;

	constructor(private prismaClient: PrismaClient) {
		this.client = prismaClient;
	}
	async save(value: Service | Uptime): Promise<void> {
		this.client.service.create({
			data: {},
		});
	}
	async update(id: string, value: Service | Uptime): Promise<void> {}
	async search(
		searchTerm: string,
		searchField: keyof Service | keyof Uptime,
	): Promise<Service | Uptime | null> {}
	async delete(id: string): Promise<void> {}
}
