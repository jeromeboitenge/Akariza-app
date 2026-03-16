import AsyncStorage from '@react-native-async-storage/async-storage';
import { salesApi, purchasesApi, productsApi } from '../api';
import { useDataStore } from '../store/dataStore';

interface SyncQueue {
  id: string;
  type: 'sale' | 'purchase' | 'product';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

const SYNC_QUEUE_KEY = 'sync_queue';
const MAX_RETRIES = 3;
const SYNC_INTERVAL = 30000; // 30 seconds

export class SyncService {
  private static syncInterval: NodeJS.Timeout | null = null;
  private static isSyncing = false;

  /**
   * Initialize sync service with periodic syncing
   */
  static async initialize(): Promise<void> {
    console.log('🔄 Initializing sync service...');
    
    // Sync immediately on startup
    await this.syncQueue();
    
    // Set up periodic syncing
    this.syncInterval = setInterval(() => {
      this.syncQueue();
    }, SYNC_INTERVAL);
  }

  /**
   * Stop the sync service
   */
  static stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('🛑 Sync service stopped');
    }
  }

  /**
   * Add item to sync queue
   */
  static async addToQueue(
    type: 'sale' | 'purchase' | 'product',
    action: 'create' | 'update' | 'delete',
    data: any
  ): Promise<void> {
    try {
      const queue = await this.getQueue();
      const item: SyncQueue = {
        id: `${type}_${Date.now()}_${Math.random()}`,
        type,
        action,
        data,
        timestamp: Date.now(),
        retries: 0,
      };
      
      queue.push(item);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
      console.log(`📝 Added to sync queue: ${type} ${action}`, item.id);
    } catch (error) {
      console.error('❌ Error adding to sync queue:', error);
    }
  }

  /**
   * Get current sync queue
   */
  static async getQueue(): Promise<SyncQueue[]> {
    try {
      const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('❌ Error reading sync queue:', error);
      return [];
    }
  }

  /**
   * Process sync queue
   */
  static async syncQueue(): Promise<void> {
    if (this.isSyncing) {
      console.log('⏳ Sync already in progress...');
      return;
    }

    this.isSyncing = true;
    try {
      const queue = await this.getQueue();
      
      if (queue.length === 0) {
        console.log('✅ Sync queue is empty');
        this.isSyncing = false;
        return;
      }

      console.log(`🔄 Processing ${queue.length} items in sync queue...`);

      const updatedQueue: SyncQueue[] = [];

      for (const item of queue) {
        try {
          await this.processQueueItem(item);
          console.log(`✅ Synced: ${item.type} ${item.action} (${item.id})`);
        } catch (error: any) {
          item.retries++;
          
          if (item.retries < MAX_RETRIES) {
            console.log(`🔄 Retry ${item.retries}/${MAX_RETRIES} for ${item.id}`);
            updatedQueue.push(item);
          } else {
            console.error(`❌ Max retries exceeded for ${item.id}:`, error.message);
            // Keep failed items for manual review
            updatedQueue.push(item);
          }
        }
      }

      // Update queue with remaining items
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
      console.log(`✅ Sync complete. ${updatedQueue.length} items remaining in queue`);
    } catch (error) {
      console.error('❌ Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Process individual queue item
   */
  private static async processQueueItem(item: SyncQueue): Promise<void> {
    switch (item.type) {
      case 'sale':
        await this.syncSale(item);
        break;
      case 'purchase':
        await this.syncPurchase(item);
        break;
      case 'product':
        await this.syncProduct(item);
        break;
      default:
        throw new Error(`Unknown sync type: ${item.type}`);
    }
  }

  /**
   * Sync sale
   */
  private static async syncSale(item: SyncQueue): Promise<void> {
    switch (item.action) {
      case 'create':
        await salesApi.create(item.data);
        break;
      default:
        throw new Error(`Unsupported sale action: ${item.action}`);
    }
  }

  /**
   * Sync purchase
   */
  private static async syncPurchase(item: SyncQueue): Promise<void> {
    switch (item.action) {
      case 'create':
        await purchasesApi.create(item.data);
        break;
      default:
        throw new Error(`Unsupported purchase action: ${item.action}`);
    }
  }

  /**
   * Sync product
   */
  private static async syncProduct(item: SyncQueue): Promise<void> {
    switch (item.action) {
      case 'create':
        await productsApi.create(item.data);
        break;
      case 'update':
        await productsApi.update(item.data.id, item.data);
        break;
      case 'delete':
        await productsApi.delete(item.data.id);
        break;
      default:
        throw new Error(`Unsupported product action: ${item.action}`);
    }
  }

  /**
   * Clear sync queue
   */
  static async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
      console.log('🗑️ Sync queue cleared');
    } catch (error) {
      console.error('❌ Error clearing sync queue:', error);
    }
  }

  /**
   * Get sync queue status
   */
  static async getQueueStatus(): Promise<{
    total: number;
    pending: number;
    failed: number;
    isSyncing: boolean;
  }> {
    const queue = await this.getQueue();
    const failed = queue.filter((item) => item.retries >= MAX_RETRIES).length;
    const pending = queue.filter((item) => item.retries < MAX_RETRIES).length;

    return {
      total: queue.length,
      pending,
      failed,
      isSyncing: this.isSyncing,
    };
  }
}
