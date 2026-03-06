// Mock data for development - allows viewing all screens without backend
export const mockUser = {
  id: '1',
  email: 'boss@store.com',
  fullName: 'John Doe',
  role: 'BOSS', // Can be: BOSS, MANAGER, CASHIER, SYSTEM_ADMIN
  organizationId: '1',
  branchId: '1',
};

export const mockDashboardStats = {
  todaySales: 12500,
  todayProfit: 4200,
  todayTransactions: 45,
  totalRevenue: 125430,
  totalSales: 342,
  totalPurchases: 85200,
  totalExpenses: 12500,
  totalBranches: 3,
  totalEmployees: 12,
  totalCustomers: 156,
  totalProducts: 342,
  lowStockCount: 8,
  pendingTasks: 5,
  topProduct: {
    name: 'iPhone 14 Pro',
    soldCount: 45,
    revenue: 49500,
  },
};

export const mockProducts = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    sku: 'LAP-001',
    category: 'Electronics',
    costPrice: 1200,
    sellingPrice: 1500,
    currentStock: 15,
    minStockLevel: 5,
    unit: 'piece',
    isActive: true,
    barcode: '1234567890123',
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    sku: 'PHN-001',
    category: 'Electronics',
    costPrice: 900,
    sellingPrice: 1100,
    currentStock: 25,
    minStockLevel: 10,
    unit: 'piece',
    isActive: true,
    barcode: '1234567890124',
  },
  {
    id: '3',
    name: 'Samsung Galaxy S23',
    sku: 'PHN-002',
    category: 'Electronics',
    costPrice: 700,
    sellingPrice: 850,
    currentStock: 3,
    minStockLevel: 8,
    unit: 'piece',
    isActive: true,
    barcode: '1234567890125',
  },
  {
    id: '4',
    name: 'Wireless Mouse',
    sku: 'ACC-001',
    category: 'Accessories',
    costPrice: 15,
    sellingPrice: 25,
    currentStock: 50,
    minStockLevel: 20,
    unit: 'piece',
    isActive: true,
    barcode: '1234567890126',
  },
];

export const mockCustomers = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+250788123456',
    address: 'KG 123 St, Kigali',
    customerType: 'VIP',
    loyaltyPoints: 1250,
    creditLimit: 5000,
    currentDebt: 0,
    isActive: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+250788234567',
    address: 'KN 456 Ave, Kigali',
    customerType: 'REGULAR',
    loyaltyPoints: 450,
    creditLimit: 2000,
    currentDebt: 500,
    isActive: true,
  },
];

export const mockSuppliers = [
  {
    id: '1',
    name: 'Tech Supplies Ltd',
    contactPerson: 'David Brown',
    phone: '+250788456789',
    email: 'david@techsupplies.com',
    address: 'Industrial Area, Kigali',
    rating: 4.5,
    creditLimit: 50000,
    paymentTerms: 'Net 30',
    isActive: true,
  },
  {
    id: '2',
    name: 'Global Electronics',
    contactPerson: 'Emma Wilson',
    phone: '+250788567890',
    email: 'emma@globalelec.com',
    address: 'Downtown, Kigali',
    rating: 4.8,
    creditLimit: 75000,
    paymentTerms: 'Net 45',
    isActive: true,
  },
];

export const mockSales = [
  {
    id: '1',
    saleNumber: 'SAL-2024-001',
    customerName: 'Alice Johnson',
    totalAmount: 1500,
    finalAmount: 1500,
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString(),
    items: [
      {
        productName: 'Laptop Dell XPS 15',
        quantity: 1,
        sellingPrice: 1500,
        total: 1500,
      },
    ],
  },
  {
    id: '2',
    saleNumber: 'SAL-2024-002',
    customerName: 'Bob Smith',
    totalAmount: 1100,
    finalAmount: 1100,
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    items: [
      {
        productName: 'iPhone 14 Pro',
        quantity: 1,
        sellingPrice: 1100,
        total: 1100,
      },
    ],
  },
];

export const mockPurchases = [
  {
    id: '1',
    purchaseNumber: 'PUR-2024-001',
    supplier: {
      name: 'Tech Supplies Ltd',
    },
    totalAmount: 12000,
    finalAmount: 12000,
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    purchaseNumber: 'PUR-2024-002',
    supplier: {
      name: 'Global Electronics',
    },
    totalAmount: 25000,
    finalAmount: 25000,
    paymentStatus: 'PARTIAL',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const mockSalesTrends = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [1200, 1800, 1500, 2200, 1900, 2500, 2100],
};

export const mockBranches = [
  {
    id: '1',
    name: 'Main Branch',
    address: 'KG 123 St, Kigali',
    phone: '+250788123456',
    isActive: true,
    employeeCount: 8,
  },
  {
    id: '2',
    name: 'Downtown Branch',
    address: 'KN 456 Ave, Kigali',
    phone: '+250788234567',
    isActive: true,
    employeeCount: 5,
  },
];

export const mockEmployees = [
  {
    id: '1',
    fullName: 'Jane Manager',
    email: 'manager@store.com',
    phone: '+250788345678',
    role: 'MANAGER',
    branchName: 'Main Branch',
    isActive: true,
  },
  {
    id: '2',
    fullName: 'Mike Cashier',
    email: 'cashier@store.com',
    phone: '+250788456789',
    role: 'CASHIER',
    branchName: 'Main Branch',
    isActive: true,
  },
];
