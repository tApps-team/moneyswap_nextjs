// Утилита для отладки заголовков запросов
export const logRequestHeaders = (url: string, headers: HeadersInit) => {
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('🔍 Request headers for:', url);
  //   console.log('Headers:', headers);
    
  //   // Проверяем User-Agent
  //   const userAgent = typeof headers === 'object' && headers && 'User-Agent' in headers 
  //     ? headers['User-Agent'] 
  //     : 'Not set';
  //   console.log('User-Agent:', userAgent);
    
  //   // Проверяем Referer
  //   const referer = typeof headers === 'object' && headers && 'Referer' in headers 
  //     ? headers['Referer'] 
  //     : 'Not set';
  //   console.log('Referer:', referer);
    
  //   // Проверяем X-Requested-By
  //   const requestedBy = typeof headers === 'object' && headers && 'X-Requested-By' in headers 
  //     ? headers['X-Requested-By'] 
  //     : 'Not set';
  //   console.log('X-Requested-By:', requestedBy);
  // }
};

// Утилита для создания стандартных заголовков
export const createStandardHeaders = (additionalHeaders: Record<string, string> = {}) => {
  const isServer = typeof window === 'undefined';
  
  return {
    'User-Agent': 'moneyswap-frontend/1.0',
    'X-Requested-By': 'moneyswap-frontend',
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
};

