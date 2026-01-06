import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileVideo,
  Layers,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionViewer } from '@/components/motion/MotionViewer';

export const MotionStudio: React.FC = () => {
  const [selectedMotion, setSelectedMotion] = useState<string | null>('demo');

  const mockMotions = [
    { id: 'demo', name: 'Round 5 - A Execute', duration: '12s', type: 'Execute' },
    { id: 'motion2', name: 'Round 8 - Retake B', duration: '8s', type: 'Retake' },
    { id: 'motion3', name: 'Round 12 - Eco Push', duration: '15s', type: 'Economy' },
  ];

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
            <h1 className="text-2xl font-bold">Motion Studio</h1>
            <p className="text-muted-foreground">
              3D player movement analysis powered by HY-Motion 1.0
            </p>
          </div>
        </div>

        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Import Motion Data
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Motion List */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5" />
              Motion Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockMotions.map((motion) => (
              <div
                key={motion.id}
                onClick={() => setSelectedMotion(motion.id)}
                className={`cursor-pointer rounded-lg border p-3 transition-all hover:bg-muted/50 ${
                  selectedMotion === motion.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileVideo className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{motion.name}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{motion.duration}</span>
                      <span>•</span>
                      <span>{motion.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 3D Viewer */}
        <div className="lg:col-span-3">
          <MotionViewer />

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Analysis
            </Button>
            <Button variant="outline">Share with Team</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
