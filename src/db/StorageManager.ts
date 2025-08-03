export interface TableHandler<T> {
	save(data: T): Promise<void>;
	update(id: string, data: T): Promise<void>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<T | null>;
	findAll(): Promise<T[]>;

	search(query: string, field: string): Promise<T[] | null>;
}

export interface Adapter {
	getHandler<T>(table: string): TableHandler<T>;
}

export class StorageManager {
	private adapter: Adapter;
	constructor(adapter: Adapter) {
		this.adapter = adapter;
	}
	async save<T>(table: string, data: T): Promise<void> {
		const handler = this.adapter.getHandler<T>(table);
		await handler.save(data);
	}

	async update<T>(table: string, id: string, data: T): Promise<void> {
		const handler = this.adapter.getHandler<T>(table);
		await handler.update(id, data);
	}

	async delete<T>(table: string, id: string): Promise<void> {
		const handler = this.adapter.getHandler<T>(table);
		await handler.delete(id);
	}

	async findById<T>(table: string, id: string): Promise<T | null> {
		const handler = this.adapter.getHandler<T>(table);
		return handler.findById(id);
	}

	async findAll<T>(table: string): Promise<T[]> {
		const handler = this.adapter.getHandler<T>(table);
		return handler.findAll();
	}

	async search<T>(
		table: string,
		query: string,
		field: string,
	): Promise<T[] | null> {
		const handler = this.adapter.getHandler<T>(table);
		return handler.search(query, field);
	}
}
