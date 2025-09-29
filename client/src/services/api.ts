import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  validateStatus: (status) => {
    return status !== 401 && status !== 403;
  },

  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (request) => {
    console.log('Request sent:', request.method?.toUpperCase(), request.url);
    return request;
  },
  async (err) => {
    console.log('error', err);
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log('response working');

    return response;
  },
  async (err) => {
    const originalRequest = err.config;
    console.log('Api interceptor triggered');

    if (err.response?.status === 401) {
      toast.error(err.response.data.message);
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
      let redirectTo = '/login';
      if (pathname.startsWith('/agency')) {
        redirectTo = '/agency/restricted';
      } else if (pathname.startsWith('/hotel')) {
        redirectTo = '/hotel/restricted';
      } else if (pathname.startsWith('/restaurant')) {
        redirectTo = '/restaurant/restricted';
      } else if (pathname.startsWith('/admin')) {
        redirectTo = '/admin/login';
      }

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 2000);
    }

    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          'http://localhost:5000/api/user/refresh',
          {},
          { withCredentials: true },
        );

        const accessToken = refreshRes.data.data;
        console.log('refreshRes.data:', refreshRes.data);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        // Optionally logout user here
      }
    }

    return Promise.reject(err);
  },
);

export default api;
