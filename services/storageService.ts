
import { ProdutoAnalise, Fornecedor } from '../types';

const DB_NAME = 'MLAnalyzerDB';
const DB_VERSION = 1;
const STORES = {
  ANALYSES: 'analyses',
  PROVIDERS: 'providers'
};

class StorageService {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
          this.dbPromise = null;
          reject(request.error);
        };
        
        request.onsuccess = () => {
          this.db = request.result;
          this.dbPromise = null;
          resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORES.ANALYSES)) {
            db.createObjectStore(STORES.ANALYSES, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.PROVIDERS)) {
            db.createObjectStore(STORES.PROVIDERS, { keyPath: 'id' });
          }
        };
      } catch (err) {
        reject(err);
      }
    });

    return this.dbPromise;
  }

  async getAll(): Promise<ProdutoAnalise[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.ANALYSES, 'readonly');
      const store = transaction.objectStore(STORES.ANALYSES);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async save(analise: ProdutoAnalise): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.ANALYSES, 'readwrite');
      const store = transaction.objectStore(STORES.ANALYSES);
      store.put(analise);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction(STORES.ANALYSES, 'readwrite');
        const store = transaction.objectStore(STORES.ANALYSES);
        
        if (!id) {
          return reject(new Error("ID inválido"));
        }

        store.delete(id);
        
        transaction.oncomplete = () => {
          console.log(`IDB: Item ${id} excluído permanentemente.`);
          resolve();
        };
        
        transaction.onerror = () => reject(transaction.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Fornecedores
  async getFornecedores(): Promise<Fornecedor[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROVIDERS, 'readonly');
      const store = transaction.objectStore(STORES.PROVIDERS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveFornecedor(f: Fornecedor): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROVIDERS, 'readwrite');
      const store = transaction.objectStore(STORES.PROVIDERS);
      store.put(f);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async deleteFornecedor(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROVIDERS, 'readwrite');
      const store = transaction.objectStore(STORES.PROVIDERS);
      store.delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const storageService = new StorageService();
