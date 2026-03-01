import db from './index';
import { Supplier } from '../types';

export const suppliersDb = {
  getAll: (): Promise<Supplier[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM suppliers WHERE isActive = 1',
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  },

  upsert: (supplier: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO suppliers 
          (id, organizationId, name, contactPerson, phone, email, address, lastSyncedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            supplier._id || supplier.id,
            supplier.organizationId,
            supplier.name,
            supplier.contactPerson,
            supplier.phone,
            supplier.email,
            supplier.address,
            Date.now()
          ],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
};
