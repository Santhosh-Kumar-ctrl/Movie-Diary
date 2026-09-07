import axios from 'axios';
import NodeCache from 'node-cache';
import { env } from './env.js';

export const tmdbClient = axios.create({
  baseURL: env.TMDB_BASE_URL,
  params: {
    api_key: env.TMDB_API_KEY,
  },
});

export const tmdbCache = new NodeCache({
  stdTTL: 3600,
  maxKeys: 500,
  checkperiod: 120,
});
