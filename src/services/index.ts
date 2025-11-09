/**
 * API Service Configuration
 *
 * Production-only: Uses real FastAPI backend
 */

import { realApiService } from './realApi';

// Export the real API service
export const apiService = realApiService;

// Environment info
export const API_CONFIG = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  mode: 'Real API (FastAPI Backend)',
};
