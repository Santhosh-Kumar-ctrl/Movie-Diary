import axios from 'axios';
import { supabase } from '@/lib/supabase';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
