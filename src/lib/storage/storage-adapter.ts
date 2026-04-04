/** Storage adapter interface — swap local/R2/S3/GCS by changing STORAGE_TYPE env */

export interface StorageAdapter {
  /** Write file to storage, return the storage key */
  put(key: string, data: Buffer, contentType: string): Promise<string>;
  /** Read file from storage, return buffer + content type, or null if not found */
  get(key: string): Promise<{ data: Buffer; contentType: string } | null>;
  /** Delete file from storage (no-op if not found) */
  delete(key: string): Promise<void>;
  /** Check if file exists in storage */
  exists(key: string): Promise<boolean>;
}

// Singleton instance
let adapter: StorageAdapter | null = null;

/**
 * Get the configured storage adapter (singleton).
 * Reads STORAGE_TYPE env var: "local" (default) | "r2" | "s3" | "gcs"
 * Future adapters: create new file implementing StorageAdapter, add case here.
 */
export function getStorageAdapter(): StorageAdapter {
  if (adapter) return adapter;

  const type = process.env.STORAGE_TYPE ?? "local";

  switch (type) {
    case "local": {
      // Dynamic import avoided for simplicity — direct instantiation
      const { LocalStorageAdapter } = require("./local-storage-adapter");
      adapter = new LocalStorageAdapter() as StorageAdapter;
      break;
    }
    default:
      throw new Error(`Unknown STORAGE_TYPE: ${type}. Supported: local`);
  }

  return adapter;
}
