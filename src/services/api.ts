import axios, { AxiosInstance } from 'axios';
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

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 errors (logout)
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await this.api.post<LoginResponse>('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
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
    const response = await this.api.post<PassGenerationResponse>(`/api/passes/generate/${entryId}`, {
      send_email: sendEmail
    });
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

  async createUser(user: Partial<User> & { password: string }): Promise<User> {
    const response = await this.api.post<User>('/api/admin/users', user);
    return response.data;
  }

  async updateUser(username: string, user: Partial<User>): Promise<User> {
    const response = await this.api.put<User>(`/api/admin/users/${username}`, user);
    return response.data;
  }

  async deleteUser(username: string): Promise<void> {
    await this.api.delete(`/api/admin/users/${username}`);
  }

  // Bulk email
  async sendBulkEmail(entryIds: number[]): Promise<{ success: number; failed: number; }> {
    const response = await this.api.post('/api/admin/bulk-email', { entry_ids: entryIds });
    return response.data;
  }
}

export const apiService = new ApiService();
