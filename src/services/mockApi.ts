// Mock API Service for Demo
import type {
  LoginRequest,
  LoginResponse,
  User,
  Entry,
  CreateEntryRequest,
  DashboardStats,
  PassGenerationResponse
} from '../types';

// Mock data storage
let mockUsers: User[] = [
  {
    username: 'admin',
    organization: 'TDAC',
    role: 'admin',
    max_entries: 999,
    quota_ex_day1: 999,
    quota_ex_day2: 999,
    quota_interactive: 999,
    quota_plenary: 999,
    allowed_passes: {
      exhibition_day1: true,
      exhibition_day2: true,
      interactive_sessions: true,
      plenary: true,
    },
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
  },
  {
    username: 'iitdelhi',
    organization: 'IIT Delhi',
    role: 'user',
    max_entries: 50,
    quota_ex_day1: 30,
    quota_ex_day2: 25,
    quota_interactive: 15,
    quota_plenary: 10,
    allowed_passes: {
      exhibition_day1: true,
      exhibition_day2: true,
      interactive_sessions: true,
      plenary: false,
    },
    is_active: true,
    created_at: '2025-01-02T00:00:00Z',
  },
];

let mockEntries: Entry[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Abhishek Vardhan',
    phone: '+91-9876543210',
    email: 'abhishek@navy.gov.in',
    id_type: 'Aadhaar',
    id_number: '1111-2222-3333',
    exhibition_day1: true,
    exhibition_day2: true,
    interactive_sessions: true,
    plenary: true,
    pass_generated_exhibition_day1: true,
    pass_generated_exhibition_day2: true,
    pass_generated_interactive_sessions: true,
    pass_generated_plenary: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'admin',
    name: 'Rajesh Kumar',
    phone: '+91-9876543211',
    email: 'rajesh@navy.gov.in',
    id_type: 'PAN',
    id_number: 'ABCDE1234F',
    exhibition_day1: true,
    exhibition_day2: false,
    interactive_sessions: false,
    plenary: false,
    pass_generated_exhibition_day1: false,
    pass_generated_exhibition_day2: false,
    pass_generated_interactive_sessions: false,
    pass_generated_plenary: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Helper to simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay();

    // Simple mock authentication
    const user = mockUsers.find(u => u.username === credentials.username);
    if (!user || credentials.password !== 'admin123') {
      throw { response: { data: { detail: 'Invalid credentials' }, status: 401 } };
    }

    return {
      access_token: 'mock-jwt-token-' + Date.now(),
      token_type: 'bearer',
      user,
    };
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Entries
  async getMyEntries(): Promise<Entry[]> {
    await delay();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return mockEntries.filter(e => e.username === user.username);
  }

  async createEntry(entry: CreateEntryRequest): Promise<Entry> {
    await delay();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const newEntry: Entry = {
      id: mockEntries.length + 1,
      username: user.username,
      ...entry,
      pass_generated_exhibition_day1: false,
      pass_generated_exhibition_day2: false,
      pass_generated_interactive_sessions: false,
      pass_generated_plenary: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockEntries.push(newEntry);
    return newEntry;
  }

  async updateEntry(id: number, entry: Partial<CreateEntryRequest>): Promise<Entry> {
    await delay();
    const index = mockEntries.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Entry not found');

    mockEntries[index] = {
      ...mockEntries[index],
      ...entry,
      updated_at: new Date().toISOString(),
    };

    return mockEntries[index];
  }

  async deleteEntry(id: number): Promise<void> {
    await delay();
    mockEntries = mockEntries.filter(e => e.id !== id);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    await delay();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userEntries = mockEntries.filter(e => e.username === user.username);

    return {
      total_entries: userEntries.length,
      max_entries: user.max_entries,
      remaining_quota: user.max_entries - userEntries.length,
      passes_generated: userEntries.filter(e =>
        e.pass_generated_exhibition_day1 ||
        e.pass_generated_exhibition_day2 ||
        e.pass_generated_interactive_sessions ||
        e.pass_generated_plenary
      ).length,
      exhibition_day1_count: userEntries.filter(e => e.exhibition_day1).length,
      exhibition_day2_count: userEntries.filter(e => e.exhibition_day2).length,
      interactive_sessions_count: userEntries.filter(e => e.interactive_sessions).length,
      plenary_count: userEntries.filter(e => e.plenary).length,
    };
  }

  // Pass Generation
  async generatePasses(entryId: number, sendEmail: boolean = false): Promise<PassGenerationResponse> {
    await delay(1500); // Simulate pass generation delay

    const entry = mockEntries.find(e => e.id === entryId);
    if (!entry) throw new Error('Entry not found');

    // Mark passes as generated
    if (entry.exhibition_day1) entry.pass_generated_exhibition_day1 = true;
    if (entry.exhibition_day2) entry.pass_generated_exhibition_day2 = true;
    if (entry.interactive_sessions) entry.pass_generated_interactive_sessions = true;
    if (entry.plenary) entry.pass_generated_plenary = true;

    const passFiles: string[] = [];
    if (entry.exhibition_day1) passFiles.push('EP-25.png');
    if (entry.exhibition_day2) passFiles.push('EP-26.png');
    if (entry.interactive_sessions) passFiles.push('EP-INTERACTIVE.png');
    if (entry.plenary) passFiles.push('EP-PLENARY.png');

    return {
      pass_files: passFiles,
      email_sent: sendEmail,
      message: sendEmail
        ? `Passes generated and email sent to ${entry.email}`
        : 'Passes generated successfully',
    };
  }

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    await delay();
    return mockUsers;
  }

  async getAllEntries(): Promise<Entry[]> {
    await delay();
    return mockEntries;
  }

  async createUser(userData: Partial<User> & { password: string }): Promise<User> {
    await delay();
    const newUser: User = {
      username: userData.username || '',
      organization: userData.organization || '',
      role: userData.role || 'user',
      max_entries: userData.max_entries || 50,
      quota_ex_day1: userData.quota_ex_day1 || 0,
      quota_ex_day2: userData.quota_ex_day2 || 0,
      quota_interactive: userData.quota_interactive || 0,
      quota_plenary: userData.quota_plenary || 0,
      allowed_passes: userData.allowed_passes || {
        exhibition_day1: true,
        exhibition_day2: true,
        interactive_sessions: false,
        plenary: false,
      },
      is_active: true,
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    return newUser;
  }

  async updateUser(username: string, userData: Partial<User>): Promise<User> {
    await delay();
    const index = mockUsers.findIndex(u => u.username === username);
    if (index === -1) throw new Error('User not found');

    mockUsers[index] = { ...mockUsers[index], ...userData };
    return mockUsers[index];
  }

  async deleteUser(username: string): Promise<void> {
    await delay();
    mockUsers = mockUsers.filter(u => u.username !== username);
  }

  // Bulk email
  async sendBulkEmail(entryIds: number[]): Promise<{ success: number; failed: number; }> {
    await delay(2000);
    return {
      success: entryIds.length,
      failed: 0,
    };
  }
}

export const mockApiService = new MockApiService();
