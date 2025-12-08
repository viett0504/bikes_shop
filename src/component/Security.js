// src/components/SecureApp.js
import React, { useEffect } from 'react';

export default function SecureApp({ children }) {
  useEffect(() => {
    // 🔥 FIX: Dynamically set referrer policy
    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return <>{children}</>;
}