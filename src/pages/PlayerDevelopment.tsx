import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Crosshair,
  Shield,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayerCard } from '@/components/dashboard/PlayerCard';
import { api } from '@/services/api';
import type { Player } from '@/types';

export const PlayerDevelopment: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const playerList = await api.fetchPlayerList();
      setPlayers(playerList);
      if (playerList.length > 0) {
        setSelectedPlayer(playerList[0]);
      }
    } catch (error) {
      console.error('Failed to load players:', error);
    } finally {
      setLoading(false);
    }
  };

  const skillMetrics = selectedPlayer
    ? [
        { name: 'Aim Accuracy', value: selectedPlayer.stats.hs_percentage * 3, icon: Crosshair, color: 'primary' },
        { name: 'Survivability', value: selectedPlayer.stats.kast, icon: Shield, color: 'accent' },
        { name: 'Impact', value: Math.min(selectedPlayer.stats.adr / 2, 100), icon: Zap, color: 'secondary' },
        { name: 'Consistency', value: selectedPlayer.stats.kd_ratio * 50, icon: Target, color: 'primary' },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Player Development</h1>
          <p className="text-muted-foreground">
            Track individual player growth and skills
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Player List */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Team Roster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                selected={selectedPlayer?.id === player.id}
                onClick={() => setSelectedPlayer(player)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Player Details */}
        <div className="space-y-6 lg:col-span-2">
          {selectedPlayer ? (
            <>
              {/* Stats Overview */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-white">
                      {selectedPlayer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedPlayer.name}</CardTitle>
                      <p className="capitalize text-muted-foreground">
                        {selectedPlayer.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <p className="text-3xl font-bold text-primary">
                        {selectedPlayer.stats.kd_ratio}
                      </p>
                      <p className="text-sm text-muted-foreground">K/D Ratio</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <p className="text-3xl font-bold text-secondary">
                        {selectedPlayer.stats.adr}
                      </p>
                      <p className="text-sm text-muted-foreground">ADR</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <p className="text-3xl font-bold text-accent">
                        {selectedPlayer.stats.kast}%
                      </p>
                      <p className="text-sm text-muted-foreground">KAST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Breakdown */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Skill Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {skillMetrics.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <skill.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{skill.name}</span>
                        </div>
                        <span className="font-bold">{Math.round(skill.value)}%</span>
                      </div>
                      <Progress value={skill.value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Additional Stats */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">First Bloods</p>
                        <p className="text-2xl font-bold">{selectedPlayer.stats.first_bloods}</p>
                      </div>
                      <Crosshair className="h-8 w-8 text-primary/50" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Clutches Won</p>
                        <p className="text-2xl font-bold">{selectedPlayer.stats.clutches_won}</p>
                      </div>
                      <Shield className="h-8 w-8 text-accent/50" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="glass-card">
              <CardContent className="flex h-[400px] items-center justify-center">
                <p className="text-muted-foreground">Select a player to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};
