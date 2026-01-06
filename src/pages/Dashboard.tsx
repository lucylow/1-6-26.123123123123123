import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Clock,
  Users,
  RefreshCw,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { PlayerCard } from '@/components/dashboard/PlayerCard';
import { DashboardSkeleton } from '@/components/ui/shimmer-skeleton';
import { useDashboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { api } from '@/services/api';
import { useAppStore } from '@/store/useAppStore';
import type { DashboardData, Player } from '@/types';

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const { setDashboardData: storeSetDashboard } = useAppStore();
  const navigate = useNavigate();

  // Keyboard shortcuts for navigation
  useDashboardShortcuts(navigate);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashboard, playerList] = await Promise.all([
        api.fetchDashboardData(),
        api.fetchPlayerList(),
      ]);
      setDashboardData(dashboard);
      setPlayers(playerList);
      storeSetDashboard(dashboard);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Coach</h1>
          <p className="text-muted-foreground">
            {dashboardData?.last_update
              ? `Last updated: ${new Date(dashboardData.last_update).toLocaleTimeString()}`
              : 'Real-time analytics dashboard'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/app/live">
              <Radio className="mr-2 h-4 w-4" />
              Go Live
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Win Rate"
          value={`${dashboardData?.team_stats.win_rate || 0}%`}
          icon={Trophy}
          trend="up"
          trendValue="+5.2%"
          color="accent"
        />
        <StatsCard
          title="Avg Round Time"
          value={`${dashboardData?.team_stats.avg_round_time || 0}s`}
          icon={Clock}
          trend="down"
          trendValue="-3s"
          color="secondary"
        />
        <StatsCard
          title="Total Matches"
          value="47"
          subtitle="This month"
          icon={Target}
          color="primary"
        />
        <StatsCard
          title="Active Players"
          value={players.length}
          subtitle="In roster"
          icon={Users}
          color="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart
            data={dashboardData?.team_stats.map_performance || []}
            title="Win Rate by Map"
          />
        </div>

        {/* Team Roster */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Team Roster</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/player">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {players.slice(0, 3).map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="gradient-text">AI Insights & Recommendations</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Powered by GRID data analysis
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {dashboardData?.insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onAction={insight.actionable ? () => {} : undefined}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
