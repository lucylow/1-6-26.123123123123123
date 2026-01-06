import type { DashboardData, Match, Player, MotionData, Insight } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

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
    // Mock data for demo
    return {
      live_matches: [],
      recent_matches: [],
      team_stats: {
        win_rate: 67,
        avg_round_time: 85,
        map_performance: [
          { map: 'Bind', wins: 12, losses: 3 },
          { map: 'Haven', wins: 8, losses: 5 },
          { map: 'Split', wins: 5, losses: 8 },
          { map: 'Ascent', wins: 10, losses: 4 },
        ],
      },
      insights: [
        {
          id: '1',
          type: 'warning',
          title: 'Eco Round Win Rate Low',
          description: 'Team wins only 23% of eco rounds. Consider adjusting eco strategies.',
          priority: 'high',
          created_at: new Date().toISOString(),
          actionable: true,
        },
        {
          id: '2',
          type: 'improvement',
          title: 'A-Site Executes Improving',
          description: 'A-site execute success rate increased by 15% this week.',
          priority: 'medium',
          created_at: new Date().toISOString(),
          actionable: false,
        },
        {
          id: '3',
          type: 'success',
          title: 'Player OXY: Clutch King',
          description: 'OXY has won 78% of 1v1 clutches this month.',
          priority: 'low',
          created_at: new Date().toISOString(),
          actionable: false,
        },
      ],
      role_distribution: [
        { name: 'Duelist', value: 25 },
        { name: 'Initiator', value: 20 },
        { name: 'Controller', value: 20 },
        { name: 'Sentinel', value: 20 },
        { name: 'IGL', value: 15 },
      ],
      last_update: new Date().toISOString(),
    };
  }

  // Match Analysis
  async fetchMatchAnalysis(matchId: string): Promise<Match> {
    return this.request<Match>(`/matches/${matchId}/analysis`);
  }

  async fetchMatchList(): Promise<Match[]> {
    // Mock data
    return [
      {
        id: 'match_001',
        team_a: { id: 't1', name: 'Team Alpha', players: [] },
        team_b: { id: 't2', name: 'Team Beta', players: [] },
        map: 'Bind',
        score: [13, 9],
        duration: 42,
        winner: 'Team Alpha',
        rounds: [],
        created_at: new Date().toISOString(),
      },
      {
        id: 'match_002',
        team_a: { id: 't1', name: 'Team Alpha', players: [] },
        team_b: { id: 't3', name: 'Team Gamma', players: [] },
        map: 'Haven',
        score: [11, 13],
        duration: 48,
        winner: 'Team Gamma',
        rounds: [],
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  // Player Development
  async fetchPlayerDevelopment(playerId: string): Promise<Player> {
    return this.request<Player>(`/players/${playerId}/development`);
  }

  async fetchPlayerList(): Promise<Player[]> {
    return [
      { id: 'p1', name: 'OXY', team_id: 't1', role: 'duelist', stats: { kd_ratio: 1.32, adr: 165, hs_percentage: 28, first_bloods: 45, clutches_won: 12, kast: 78 } },
      { id: 'p2', name: 'NOVA', team_id: 't1', role: 'initiator', stats: { kd_ratio: 1.15, adr: 142, hs_percentage: 24, first_bloods: 22, clutches_won: 8, kast: 82 } },
      { id: 'p3', name: 'SAGE', team_id: 't1', role: 'sentinel', stats: { kd_ratio: 0.98, adr: 128, hs_percentage: 22, first_bloods: 15, clutches_won: 10, kast: 85 } },
      { id: 'p4', name: 'SMOKE', team_id: 't1', role: 'controller', stats: { kd_ratio: 1.05, adr: 135, hs_percentage: 26, first_bloods: 18, clutches_won: 6, kast: 80 } },
      { id: 'p5', name: 'CHIEF', team_id: 't1', role: 'igl', stats: { kd_ratio: 0.92, adr: 118, hs_percentage: 20, first_bloods: 12, clutches_won: 9, kast: 76 } },
    ];
  }

  // Insights
  async generateInsights(teamId: string): Promise<Insight[]> {
    return this.request<Insight[]>(`/insights/generate`, {
      method: 'POST',
      body: JSON.stringify({ team_id: teamId }),
    });
  }

  // Motion Data
  async fetchMotionData(motionId: string): Promise<MotionData> {
    return this.request<MotionData>(`/motion/${motionId}`);
  }

  // Coaching Feedback
  async submitCoachingFeedback(data: {
    player_id: string;
    feedback: string;
    priority: 'low' | 'medium' | 'high';
  }): Promise<{ success: boolean }> {
    return this.request('/coaching/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
