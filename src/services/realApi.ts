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
      // FastAPI expects form data for OAuth2 password flow
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await this.api.post<LoginResponse>('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
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
    const response = await this.api.get<Entry[]>('/api/entries/my');
    return response.data;
  }

  async createEntry(entry: CreateEntryRequest): Promise<Entry> {
    const response = await this.api.post<Entry>('/api/entries', entry);
    return response.data;
  }

  async updateEntry(id: number, entry: Partial<CreateEntryRequest>): Promise<Entry> {
    const response = await this.api.put<Entry>(`/api/entries/${id}`, entry);
    return response.data;
  }

  async deleteEntry(id: number): Promise<void> {
    await this.api.delete(`/api/entries/${id}`);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get<DashboardStats>('/api/entries/stats');
    return response.data;
  }

  // Pass Generation
  async generatePasses(entryId: number, sendEmail: boolean = false): Promise<PassGenerationResponse> {
    const response = await this.api.post<PassGenerationResponse>(
      `/api/passes/generate/${entryId}`,
      { send_email: sendEmail },
      { timeout: 120000 } // 2 minute timeout for pass generation + email
    );
    return response.data;
  }

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get<User[]>('/api/admin/users');
    return response.data;
  }

  async getAllEntries(): Promise<Entry[]> {
    const response = await this.api.get<Entry[]>('/api/admin/entries');
    return response.data;
  }

  async createUser(userData: Partial<User> & { password: string }): Promise<User> {
    const response = await this.api.post<User>('/api/admin/users', userData);
    return response.data;
  }

  async updateUser(username: string, userData: Partial<User>): Promise<User> {
    const response = await this.api.put<User>(`/api/admin/users/${username}`, userData);
    return response.data;
  }

  async deleteUser(username: string): Promise<void> {
    await this.api.delete(`/api/admin/users/${username}`);
  }

  // Bulk email
  async sendBulkEmail(entryIds: number[]): Promise<{ success: number; failed: number; }> {
    const response = await this.api.post<{ success: number; failed: number; }>(
      '/api/admin/bulk-email',
      { entry_ids: entryIds },
      { timeout: 600000 } // 10 minute timeout for bulk email
    );
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string; }> {
    const response = await this.api.get<{ status: string; database: string; }>('/api/health');
    return response.data;
  }
}

export const realApiService = new RealApiService();
