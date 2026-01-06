import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Lightbulb,
  RefreshCw,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { api } from '@/services/api';
import type { Insight } from '@/types';

export const Insights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await api.fetchDashboardData();
      setInsights(data.insights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    setGenerating(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const newInsights: Insight[] = [
        {
          id: Date.now().toString(),
          type: 'improvement',
          title: 'Crosshair Placement Analysis',
          description: 'OXY\'s crosshair placement improved 12% at head level during the last 5 matches.',
          priority: 'medium',
          created_at: new Date().toISOString(),
          actionable: false,
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'warning',
          title: 'Utility Usage Decline',
          description: 'Team flash efficiency dropped 18% this week. Review flash timing drills.',
          priority: 'high',
          created_at: new Date().toISOString(),
          actionable: true,
        },
      ];
      
      setInsights((prev) => [...newInsights, ...prev]);
    } finally {
      setGenerating(false);
    }
  };

  const filterInsights = (type?: string) => {
    if (!type || type === 'all') return insights;
    return insights.filter((i) => i.type === type);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/app">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AI Insights</h1>
            <p className="text-muted-foreground">
              Intelligent recommendations powered by GRID data
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={loadInsights}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={generateNewInsights} disabled={generating}>
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate New
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Insights</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-destructive">
                  {insights.filter((i) => i.priority === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actionable</p>
                <p className="text-2xl font-bold text-accent">
                  {insights.filter((i) => i.actionable).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-secondary">{insights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              All Insights
            </CardTitle>
            <Button variant="ghost" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="warning">Warnings</TabsTrigger>
              <TabsTrigger value="improvement">Improvements</TabsTrigger>
              <TabsTrigger value="success">Successes</TabsTrigger>
            </TabsList>

            {['all', 'warning', 'improvement', 'success'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {filterInsights(tab === 'all' ? undefined : tab).map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
                {filterInsights(tab === 'all' ? undefined : tab).length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    No insights found
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
