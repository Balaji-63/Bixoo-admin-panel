import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth & Idempotency Tokens
apiClient.interceptors.request.use(
  (config) => {
    // 1. Attach JWT Authorization
    const token = localStorage.getItem('admin_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Identify Mutation Commands & Ensure Idempotency
    const isMutation = ['post', 'put', 'patch', 'delete'].includes(config.method);
    if (isMutation && !config.headers['X-Idempotency-Key']) {
      console.warn(`[API] Missing Idempotency Key for ${config.method.toUpperCase()} ${config.url}`);
      // Fallback generation if Redux middleware was bypassed
      config.headers['X-Idempotency-Key'] = crypto.randomUUID();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (401, 403, 409)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Handle Session Expiry
        localStorage.removeItem('admin_jwt');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('[API] RBAC Violation: Insufficient Permissions');
      } else if (status === 409) {
        console.error('[API] Idempotency Conflict: Transition already applied');
      }
    }
    return Promise.reject(error);
  }
);