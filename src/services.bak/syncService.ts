import NetInfo from '@react-native-community/netinfo';
import { salesDb } from '../database/salesDb';
import { productsDb } from '../database/productsDb';
import { suppliersDb } from '../database/suppliersDb';
import { syncApi } from '../api/syncApi';
import { useSyncStore } from '../store/syncStore';
import db from '../database';

export class SyncService {
  private static instance: SyncService;
  private isSyncing = false;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SyncService();
    }
    return this.instance;
  }

  async startAutoSync() {
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isSyncing) {
        this.syncAll();
      }
    });
  }

  async syncAll() {
    if (this.isSyncing) return;
    
    this.isSyncing = true;
    useSyncStore.getState().setIsSyncing(true);

    try {
      await this.syncSales();
      await this.pullProducts();
      await this.pullSuppliers();
      
      useSyncStore.getState().setLastSyncTime(Date.now());
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.isSyncing = false;
      useSyncStore.getState().setIsSyncing(false);
    }
  }

  async syncSales() {
    const pendingSales = await salesDb.getPendingSales();
    if (pendingSales.length === 0) return;

    const batch = pendingSales.map(sale => ({
      items: typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items,
      totalAmount: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
      customerName: sale.customerName,
      mobileRecordId: sale.id,
      createdAt: sale.createdAt
    }));

    try {
      const response = await syncApi.syncSales(batch);
      
      for (let i = 0; i < pendingSales.length; i++) {
        const localSale = pendingSales[i];
        const serverSale = response.data.synced[i];
        
        if (serverSale) {
          await salesDb.markAsSynced(localSale.id, serverSale._id);
        }
      }
    } catch (error) {
      console.error('Sync sales failed:', error);
      for (const sale of pendingSales) {
        await salesDb.updateSyncAttempt(sale.id);
      }
    }
  }

  async pullProducts() {
    const lastSync = await this.getLastSyncTime('products');
    const response = await syncApi.getProducts(lastSync);
    
    for (const product of response.data.products) {
      await productsDb.upsert(product);
    }
    
    await this.setLastSyncTime('products', Date.now());
  }

  async pullSuppliers() {
    const lastSync = await this.getLastSyncTime('suppliers');
    const response = await syncApi.getSuppliers(lastSync);
    
    for (const supplier of response.data.suppliers) {
      await suppliersDb.upsert(supplier);
    }
    
    await this.setLastSyncTime('suppliers', Date.now());
  }

  private async getLastSyncTime(key: string): Promise<number | undefined> {
    return new Promise((resolve) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT value FROM sync_metadata WHERE key = ?',
          [key],
          (_, { rows }) => {
            const value = rows._array[0]?.value;
            resolve(value ? parseInt(value) : undefined);
          },
          () => { resolve(undefined); return false; }
        );
      });
    });
  }

  private async setLastSyncTime(key: string, time: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO sync_metadata (key, value) VALUES (?, ?)',
          [key, time.toString()],
          () => resolve(),
          (_, error) => { reject(error); return false; }
        );
      });
    });
  }
}
