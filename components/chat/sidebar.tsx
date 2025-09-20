
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react'; // Placeholder for coach icon

export interface Coach {
  id: string;
  name: string;
  description: string;
  instructions?: string;
  icon?: string;
  icon_url?: string | null;
}

interface SidebarProps {
  coaches: Coach[];
  selectedCoach: Coach | null;
  onCoachSelect: (coach: Coach) => void;
  onNewChat: () => void;
}

export function Sidebar({ coaches, selectedCoach, onCoachSelect, onNewChat }: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900/50 border-r">
      <div className="flex-shrink-0 p-3 border-b">
        <Button variant="outline" onClick={onNewChat} className="w-full">
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {coaches.map((coach) => (
            <Card
              key={coach.id}
              onClick={() => onCoachSelect(coach)}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                selectedCoach?.id === coach.id ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 text-2xl">
                    {coach.icon || '🤝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate">
                      {coach.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {coach.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
