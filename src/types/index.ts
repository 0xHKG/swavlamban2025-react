// Type definitions for Swavlamban 2025

export interface User {
  username: string;
  organization: string;
  role: 'admin' | 'user';
  max_entries: number;
  allowed_passes: {
    exhibition_day1: boolean;
    exhibition_day2: boolean;
    interactive_sessions: boolean;
    plenary: boolean;
  };
  is_active: boolean;
  created_at?: string;
  last_login?: string;
}

export interface Entry {
  id: number;
  username: string;
  name: string;
  phone: string;
  email: string;
  id_type: string;
  id_number: string;
  photo_url?: string;
  exhibition_day1: boolean;
  exhibition_day2: boolean;
  interactive_sessions: boolean;
  plenary: boolean;
  pass_generated_exhibition_day1: boolean;
  pass_generated_exhibition_day2: boolean;
  pass_generated_interactive_sessions: boolean;
  pass_generated_plenary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEntryRequest {
  name: string;
  phone: string;
  email: string;
  id_type: string;
  id_number: string;
  photo_url?: string;
  exhibition_day1: boolean;
  exhibition_day2: boolean;
  interactive_sessions: boolean;
  plenary: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface DashboardStats {
  total_entries: number;
  max_entries: number;
  remaining_quota: number;
  passes_generated: number;
  exhibition_day1_count: number;
  exhibition_day2_count: number;
  interactive_sessions_count: number;
  plenary_count: number;
}

export interface PassGenerationResponse {
  pass_files: string[];
  email_sent: boolean;
  message: string;
}
