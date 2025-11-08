/**
 * Real API Service - Connects to Python FastAPI Backend
 *
 * This replaces the mockApi.ts service with real HTTP calls to the backend.
 * Backend: Python FastAPI with PostgreSQL (Supabase) + Mailjet email
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  User,
  Entry,
  CreateEntryRequest,
  DashboardStats,
  PassGenerationResponse
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class RealApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    // Add auth token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // FastAPI expects JSON with username and password
      const response = await this.api.post<LoginResponse>('/api/v1/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Entries
  async getMyEntries(): Promise<Entry[]> {
    const response = await this.api.get<Entry[]>('/api/v1/entries/my');
    return response.data;
  }

  async createEntry(entry: CreateEntryRequest): Promise<Entry> {
    const response = await this.api.post<Entry>('/api/v1/entries', entry);
    return response.data;
  }

  async updateEntry(id: number, entry: Partial<CreateEntryRequest>): Promise<Entry> {
    const response = await this.api.put<Entry>(`/api/v1/entries/${id}`, entry);
    return response.data;
  }

  async deleteEntry(id: number): Promise<void> {
    await this.api.delete(`/api/v1/entries/${id}`);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get<DashboardStats>('/api/v1/entries/stats');
    return response.data;
  }

  // Pass Generation
  async generatePasses(entryId: number, sendEmail: boolean = false): Promise<PassGenerationResponse> {
    const response = await this.api.post<PassGenerationResponse>(
      `/api/v1/passes/generate/${entryId}`,
      { send_email: sendEmail },
      { timeout: 120000 } // 2 minute timeout for pass generation + email
    );
    return response.data;
  }

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get<User[]>('/api/v1/admin/users');
    return response.data;
  }

  async getAllEntries(): Promise<Entry[]> {
    const response = await this.api.get<Entry[]>('/api/v1/admin/entries');
    return response.data;
  }

  async createUser(userData: Partial<User> & { password: string }): Promise<User> {
    const response = await this.api.post<User>('/api/v1/admin/users', userData);
    return response.data;
  }

  async updateUser(username: string, userData: Partial<User>): Promise<User> {
    const response = await this.api.put<User>(`/api/v1/admin/users/${username}`, userData);
    return response.data;
  }

  async deleteUser(username: string): Promise<void> {
    await this.api.delete(`/api/v1/admin/users/${username}`);
  }

  // Bulk email
  async sendBulkEmail(entryIds: number[]): Promise<{ success: number; failed: number; }> {
    const response = await this.api.post<{ success: number; failed: number; }>(
      '/api/v1/admin/bulk-email',
      { entry_ids: entryIds },
      { timeout: 600000 } // 10 minute timeout for bulk email
    );
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string; }> {
    const response = await this.api.get<{ status: string; database: string; }>('/health');
    return response.data;
  }
}

export const realApiService = new RealApiService();
