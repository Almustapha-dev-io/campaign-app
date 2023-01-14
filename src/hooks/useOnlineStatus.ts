import { useEffect, useState } from 'react';

export default function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setOnline(navigator.onLine), 200);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return online;
}

/* 
 const [online, setOnline] = useState(true);

  useEffect(() => {    
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);
*/
