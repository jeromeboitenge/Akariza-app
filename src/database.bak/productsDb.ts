import db from './index';
import { Product } from '../types';

export const productsDb = {
  getAll: (): Promise<Product[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM products WHERE isActive = 1',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  upsert: (product: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO products 
          (id, organizationId, name, sku, category, unit, costPrice, sellingPrice, currentStock, minStockLevel, lastSyncedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product._id || product.id,
            product.organizationId,
            product.name,
            product.sku,
            product.category,
            product.unit,
            product.costPrice,
            product.sellingPrice,
            product.currentStock,
            product.minStockLevel,
            Date.now()
          ],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  getById: (id: string): Promise<Product | null> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM products WHERE id = ?',
          [id],
          (_, { rows }) => resolve(rows._array[0] || null),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
};
