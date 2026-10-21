import { getSavedProducts, saveProductsToStorage, Product } from '../data/storeData.ts';

export interface InventorySyncStatus {
  isSyncing: boolean;
  lastSyncTime: number | null;
  lastSyncFormatted: string;
  syncedCount: number;
  outOfStockCount: number;
  outOfStockProducts: { id: string; name: string }[];
  nextSyncCountdown: number; // Seconds remaining in current 60s cycle
  enabled: boolean;
  error: string | null;
}

const SYNC_INTERVAL_SECONDS = 60;
const STORAGE_STATUS_KEY = 'ling_inventory_sync_status';

let currentStatus: InventorySyncStatus = {
  isSyncing: false,
  lastSyncTime: null,
  lastSyncFormatted: '--:--:--',
  syncedCount: 34,
  outOfStockCount: 1,
  outOfStockProducts: [{ id: '2040471', name: 'Puppy Pads XL Pee Pads for Dogs 28"x34"' }],
  nextSyncCountdown: SYNC_INTERVAL_SECONDS,
  enabled: true,
  error: null,
};

// Initialize cached status from storage if available
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_STATUS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      currentStatus = {
        ...currentStatus,
        ...parsed,
        isSyncing: false,
        nextSyncCountdown: SYNC_INTERVAL_SECONDS,
      };
    }
  } catch (e) {
    // ignore
  }
}

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('ling_inventory_sync_tick', { detail: { ...currentStatus } })
    );
  }
}

function saveStatusToStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_STATUS_KEY,
        JSON.stringify({
          lastSyncTime: currentStatus.lastSyncTime,
          lastSyncFormatted: currentStatus.lastSyncFormatted,
          syncedCount: currentStatus.syncedCount,
          outOfStockCount: currentStatus.outOfStockCount,
          outOfStockProducts: currentStatus.outOfStockProducts,
          enabled: currentStatus.enabled,
        })
      );
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Triggers a real-time sync with the Zendrop Supplier API
 * Updates all product stock counts in storeData storage
 */
export async function syncInventoryWithSupplier(force: boolean = false): Promise<InventorySyncStatus> {
  if (currentStatus.isSyncing) {
    return currentStatus;
  }

  currentStatus.isSyncing = true;
  currentStatus.error = null;
  notifySubscribers();

  try {
    const res = await fetch('/api/zendrop/sync-all-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    });

    const data = await res.json();

    if (data.success && data.stocks) {
      const currentProducts = getSavedProducts();
      let hasChanges = false;

      const updatedProducts = currentProducts.map((p) => {
        const zdId = p.id.replace('zendrop-', '');
        const stockInfo = data.stocks[zdId];
        if (stockInfo) {
          const newStockCount = stockInfo.stockCount;
          const newInStock = stockInfo.inStock;
          if (p.stockCount !== newStockCount || p.inStockAustin !== newInStock) {
            hasChanges = true;
            return {
              ...p,
              stockCount: newStockCount,
              inStockAustin: newInStock,
            };
          }
        }
        return p;
      });

      if (hasChanges) {
        saveProductsToStorage(updatedProducts);
      }

      const now = new Date();
      currentStatus.lastSyncTime = now.getTime();
      currentStatus.lastSyncFormatted = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      currentStatus.syncedCount = data.syncedCount || Object.keys(data.stocks).length;
      currentStatus.outOfStockCount = data.outOfStockCount ?? 0;
      currentStatus.outOfStockProducts = data.outOfStockProducts || [];
      currentStatus.nextSyncCountdown = SYNC_INTERVAL_SECONDS;
      currentStatus.error = null;

      saveStatusToStorage();
    } else {
      currentStatus.error = data.error || 'Falha ao processar resposta do fornecedor.';
    }
  } catch (err: any) {
    currentStatus.error = err.message || 'Erro de conexão com o servidor de estoque.';
  } finally {
    currentStatus.isSyncing = false;
    notifySubscribers();
  }

  return currentStatus;
}

// Global timer controller to prevent duplicated intervals
let intervalStarted = false;
let secondTicker: any = null;

/**
 * Initializes the automated 60-second synchronization ticker.
 * Automatically ticks countdown and executes sync every 60 seconds.
 */
export function initAutomatedInventorySync(): () => void {
  if (typeof window === 'undefined' || intervalStarted) {
    return () => {};
  }

  intervalStarted = true;

  // Run immediate sync on boot if not synced recently (> 60s ago)
  const timeSinceLast = currentStatus.lastSyncTime ? Date.now() - currentStatus.lastSyncTime : Infinity;
  if (timeSinceLast > SYNC_INTERVAL_SECONDS * 1000) {
    syncInventoryWithSupplier(false).catch(() => {});
  }

  // 1-second ticker for precise countdown and 60-second cycle execution
  secondTicker = setInterval(() => {
    if (!currentStatus.enabled) {
      return;
    }

    if (currentStatus.isSyncing) {
      return;
    }

    currentStatus.nextSyncCountdown -= 1;

    if (currentStatus.nextSyncCountdown <= 0) {
      currentStatus.nextSyncCountdown = SYNC_INTERVAL_SECONDS;
      syncInventoryWithSupplier(false).catch(() => {});
    }

    notifySubscribers();
  }, 1000);

  // Sync on window focus if tab was in background for > 60s
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && currentStatus.enabled) {
      const elapsed = currentStatus.lastSyncTime ? Date.now() - currentStatus.lastSyncTime : Infinity;
      if (elapsed > SYNC_INTERVAL_SECONDS * 1000) {
        currentStatus.nextSyncCountdown = SYNC_INTERVAL_SECONDS;
        syncInventoryWithSupplier(false).catch(() => {});
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    if (secondTicker) clearInterval(secondTicker);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    intervalStarted = false;
  };
}

export function toggleAutoSync(enable?: boolean): boolean {
  if (typeof enable === 'boolean') {
    currentStatus.enabled = enable;
  } else {
    currentStatus.enabled = !currentStatus.enabled;
  }
  if (currentStatus.enabled && currentStatus.nextSyncCountdown <= 0) {
    currentStatus.nextSyncCountdown = SYNC_INTERVAL_SECONDS;
  }
  saveStatusToStorage();
  notifySubscribers();
  return currentStatus.enabled;
}

export function getCurrentSyncStatus(): InventorySyncStatus {
  return { ...currentStatus };
}
