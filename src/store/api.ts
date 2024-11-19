// src/config/api.ts or similar file
export const API_CONFIG = {
    // Get the base URL from environment variable with fallback
    BASE_URL: import.meta.env.VITE_LOCAL_PORT || 'https://www.zenvogue.online/',
    
    // API paths
    PATHS: {
      USER: '/api/user',
      AGENT: '/api/agent',
      ADMIN: '/api/admin'
    }
  };
  
  // Helper to create full URLs
  export const createApiUrl = (basePath: string) => {
    return `${API_CONFIG.BASE_URL}${basePath}`.replace(/\/+$/, '');
  };
  
  // Export specific API URLs
  export const baseurluser = createApiUrl(API_CONFIG.PATHS.USER);
  export const baseurlagent = createApiUrl(API_CONFIG.PATHS.AGENT);
  export const basseurladmin = createApiUrl(API_CONFIG.PATHS.ADMIN);