import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('akariza.db');

export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          organizationId TEXT NOT NULL,
          name TEXT NOT NULL,
          sku TEXT NOT NULL,
          category TEXT,
          unit TEXT,
          costPrice REAL,
          sellingPrice REAL,
          currentStock REAL,
          minStockLevel REAL,
          isActive INTEGER DEFAULT 1,
          lastSyncedAt INTEGER
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sales (
          id TEXT PRIMARY KEY,
          organizationId TEXT NOT NULL,
          saleNumber TEXT,
          totalAmount REAL,
          paymentMethod TEXT,
          customerName TEXT,
          createdBy TEXT,
          createdAt INTEGER,
          syncStatus TEXT DEFAULT 'PENDING',
          serverSaleId TEXT,
          lastSyncAttempt INTEGER
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sale_items (
          id TEXT PRIMARY KEY,
          saleId TEXT NOT NULL,
          productId TEXT NOT NULL,
          quantity REAL,
          sellingPrice REAL,
          costPrice REAL,
          total REAL,
          FOREIGN KEY (saleId) REFERENCES sales(id)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS purchases (
          id TEXT PRIMARY KEY,
          organizationId TEXT NOT NULL,
          purchaseNumber TEXT,
          supplierId TEXT,
          totalAmount REAL,
          paymentStatus TEXT,
          amountPaid REAL,
          notes TEXT,
          createdBy TEXT,
          createdAt INTEGER,
          syncStatus TEXT DEFAULT 'PENDING',
          serverPurchaseId TEXT,
          lastSyncAttempt INTEGER
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS purchase_items (
          id TEXT PRIMARY KEY,
          purchaseId TEXT NOT NULL,
          productId TEXT NOT NULL,
          quantity REAL,
          costPrice REAL,
          total REAL,
          FOREIGN KEY (purchaseId) REFERENCES purchases(id)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS suppliers (
          id TEXT PRIMARY KEY,
          organizationId TEXT NOT NULL,
          name TEXT NOT NULL,
          contactPerson TEXT,
          phone TEXT,
          email TEXT,
          address TEXT,
          isActive INTEGER DEFAULT 1,
          lastSyncedAt INTEGER
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sync_metadata (
          key TEXT PRIMARY KEY,
          value TEXT
        );`
      );
    }, reject, resolve);
  });
};

export default db;
