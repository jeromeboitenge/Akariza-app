import db from './index';
import { Sale } from '../types';

export const salesDb = {
  create: (sale: Sale, items: any[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO sales (id, organizationId, saleNumber, totalAmount, paymentMethod, customerName, createdBy, createdAt, syncStatus)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [sale.id, sale.organizationId, sale.saleNumber, sale.totalAmount, sale.paymentMethod, sale.customerName, '', sale.createdAt, 'PENDING']
        );

        items.forEach(item => {
          tx.executeSql(
            `INSERT INTO sale_items (id, saleId, productId, quantity, sellingPrice, costPrice, total)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [item.id, sale.id, item.productId, item.quantity, item.sellingPrice, item.costPrice, item.total]
          );
        });
      }, reject, resolve);
    });
  },

  getPendingSales: (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT s.*, GROUP_CONCAT(
            json_object(
              'productId', si.productId,
              'quantity', si.quantity,
              'sellingPrice', si.sellingPrice,
              'costPrice', si.costPrice,
              'total', si.total
            )
          ) as items
          FROM sales s
          LEFT JOIN sale_items si ON s.id = si.saleId
          WHERE s.syncStatus = 'PENDING'
          GROUP BY s.id`,
          [],
          (_, { rows }) => {
            const sales = rows._array.map(row => ({
              ...row,
              items: row.items ? JSON.parse(`[${row.items}]`) : []
            }));
            resolve(sales);
          },
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  markAsSynced: (localId: string, serverId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE sales SET syncStatus = ?, serverSaleId = ? WHERE id = ?',
          ['SYNCED', serverId, localId],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  updateSyncAttempt: (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE sales SET lastSyncAttempt = ? WHERE id = ?',
          [Date.now(), id],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
};
