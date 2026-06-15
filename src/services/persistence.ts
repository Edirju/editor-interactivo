import { get, set, del } from 'idb-keyval';

export interface PersistenceService {
  save(id: string, content: string): Promise<void>;
  load(id: string): Promise<string | null>;
  delete(id: string): Promise<void>;
}

export class IndexedDBPersistence implements PersistenceService {
  async save(id: string, content: string): Promise<void> {
    await set(id, content);
  }

  async load(id: string): Promise<string | null> {
    return (await get(id)) ?? null;
  }

  async delete(id: string): Promise<void> {
    await del(id);
  }
}

export const persistenceService = new IndexedDBPersistence();
