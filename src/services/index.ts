/**
 * API Service Configuration
 *
 * This file allows easy switching between mock and real API services.
 * Set USE_REAL_API to true to connect to the Python FastAPI backend.
 */

import { mockApiService } from './mockApi';
import { realApiService } from './realApi';

// Toggle between mock and real API
// Set to true to use Python FastAPI backend
// Set to false to use mock data (for development/testing)
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true' || false;

// Export the appropriate service
export const apiService = USE_REAL_API ? realApiService : mockApiService;

// Export individual services for direct access if needed
export { mockApiService, realApiService };

// Environment info
export const API_CONFIG = {
  isRealAPI: USE_REAL_API,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  mode: USE_REAL_API ? 'Real API (FastAPI Backend)' : 'Mock API (In-Memory)',
};
