import { useState, useEffect } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'Notification' in window && 'serviceWorker' in navigator;
      setIsSupported(supported);
      if (supported) {
        setPermission(Notification.permission);
      }
      
      // Extended check for iOS including newer iPads
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(ios);

      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return 'default';
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm;
    } catch (e) {
      console.error('Error requesting notification permission:', e);
      return 'default';
    }
  };

  const sendTestNotification = async () => {
    if (permission !== 'granted') return;
    
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification('KENZA — Rappel de révision', {
          body: '5 mots vous attendent dans votre SRS aujourd\'hui ! 📚',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          data: { url: '/?tab=srs' },
          vibrate: [200, 100, 200],
        });
      } catch (e) {
        console.error('Failed to send test notification:', e);
      }
    }
  };

  return { 
    isSupported, 
    permission, 
    isIOS, 
    isStandalone, 
    requestPermission, 
    sendTestNotification 
  };
}
