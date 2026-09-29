import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useNetwork() {
  // Server snapshot assumes online to avoid hydration mismatch; the client
  // snapshot reads the real value through the external store subscription.
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );
}
