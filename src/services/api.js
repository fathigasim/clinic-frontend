import axios from 'axios';
import { tokenService } from './tokenService';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let isRedirecting = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const redirectTo = (path) => {
  isRedirecting = true;
  tokenService.clearTokens();
  // window.location.replace(path);
  return new Promise(() => {}); // fine to leave unresolved — we're navigating away
};

// ─── Request Interceptor ─────────────────────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => {
    isRedirecting = false;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Already redirecting — swallow all further errors
    if (isRedirecting) {
      return new Promise(() => {});
    }

    // Skip interceptor for logout requests
    if (
      originalRequest?.url?.includes('/auth/logout') ||
      originalRequest?.url?.includes('/logout')
    ) {
      return Promise.reject(error);
    }

    // No response — network error, let the component handle it
    if (!error.response) {
        window.location.replace('/ServerError');
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 403 Forbidden — redirect to forbidden page
    if (status === 403) {
      isRedirecting = true;
      window.location.replace('/forbidden');
      return new Promise(() => {});
    }

    // Anything other than 401 — just reject
    if (status !== 401) {
      return Promise.reject(error);
    }

    // ─── 401 Handling ────────────────────────────────────────────────────────

    // Don't retry the refresh endpoint itself
    if (originalRequest?.url?.includes('/auth/refresh')) {
      return redirectTo('/auth/login');
    }

    // Already retried this request — give up
    if (originalRequest._retry) {
      return redirectTo('/auth/login');
    
       
    }
    //  console.log('401 on:', originalRequest.url, error.response.data);
     console.log('401 DEBUG on:', originalRequest.url, JSON.stringify(error.response.data));
 //    debugger;
// return Promise.reject(error);
    // Queue concurrent requests while a refresh is in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // api.post sends the current access token via the request interceptor
      // and sends the refresh_token cookie via withCredentials
      // const refreshResponse = await api.post('/auth/refresh');
  const refreshResponse = await axios.post(`${apiUrl}/auth/refresh`, {}, {
    withCredentials: true // sending the HTTP-only cookie safely
  });
      const newAccessToken = refreshResponse.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('No access token in refresh response');
      }

      tokenService.setTokens(newAccessToken);
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      return redirectTo('/auth/login');
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;