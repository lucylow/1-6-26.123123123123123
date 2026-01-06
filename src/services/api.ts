import type { DashboardData, Match, Player, MotionData, Insight } from '@/types';
import { 
  mockDashboardData, 
  mockPlayers, 
  mockMatches, 
  mockInsights,
  mockMotionData,
  mockPerformanceTrends,
  mockCoachingSuggestions,
} from '@/data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private baseUrl: string;
  private token: string | null = null;
  private useMockData = true; // Toggle for mock vs real API

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Dashboard
  async fetchDashboardData(): Promise<DashboardData> {
    await delay(300); // Simulate network
    return { ...mockDashboardData, last_update: new Date().toISOString() };
  }

  // Match Analysis
  async fetchMatchAnalysis(matchId: string): Promise<Match | null> {
    await delay(200);
    return mockMatches.find(m => m.id === matchId) || null;
  }

  async fetchMatchList(): Promise<Match[]> {
    await delay(250);
    return mockMatches;
  }

  // Player Development
  async fetchPlayerDevelopment(playerId: string): Promise<Player | null> {
    await delay(200);
    return mockPlayers.find(p => p.id === playerId) || null;
  }

  async fetchPlayerList(): Promise<Player[]> {
    await delay(200);
    return mockPlayers;
  }

  // Insights
  async fetchInsights(): Promise<Insight[]> {
    await delay(150);
    return mockInsights;
  }

  async generateInsights(teamId: string): Promise<Insight[]> {
    await delay(500);
    return mockInsights.filter(() => Math.random() > 0.3);
  }

  // Motion Data
  async fetchMotionData(motionId: string): Promise<MotionData> {
    await delay(300);
    return mockMotionData;
  }

  // Performance Trends
  async fetchPerformanceTrends(period: 'weekly' | 'monthly' = 'weekly') {
    await delay(200);
    return mockPerformanceTrends[period];
  }

  // Live Coaching
  async fetchCoachingSuggestions() {
    await delay(100);
    return mockCoachingSuggestions;
  }

  // Coaching Feedback
  async submitCoachingFeedback(data: {
    player_id: string;
    feedback: string;
    priority: 'low' | 'medium' | 'high';
  }): Promise<{ success: boolean }> {
    await delay(300);
    console.log('Feedback submitted:', data);
    return { success: true };
  }

  // Team Stats
  async fetchTeamStats() {
    await delay(200);
    return {
      totalMatches: mockMatches.length,
      wins: mockMatches.filter(m => m.winner === 'Team Alpha').length,
      losses: mockMatches.filter(m => m.winner !== 'Team Alpha').length,
      winRate: Math.round(
        (mockMatches.filter(m => m.winner === 'Team Alpha').length / mockMatches.length) * 100
      ),
      avgScore: mockMatches.reduce((acc, m) => acc + m.score[0], 0) / mockMatches.length,
      bestMap: 'Bind',
      worstMap: 'Split',
    };
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
