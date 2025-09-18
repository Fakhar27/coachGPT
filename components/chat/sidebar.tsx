
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react'; // Placeholder for coach icon

export interface Coach {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
}

interface SidebarProps {
  coaches: Coach[];
  selectedCoach: Coach | null;
  onCoachSelect: (coach: Coach) => void;
  onNewChat: () => void;
}

export function Sidebar({ coaches, selectedCoach, onCoachSelect, onNewChat }: SidebarProps) {
  return (
    <div className="flex flex-col h-full p-2 bg-gray-50 dark:bg-gray-900/50 border-r">
      <Button variant="outline" onClick={onNewChat} className="mb-4">
        New Chat
      </Button>
      <div className="flex-grow overflow-y-auto space-y-2">
        {coaches.map((coach) => (
          <Card
            key={coach.id}
            onClick={() => onCoachSelect(coach)}
            className={`cursor-pointer ${
              selectedCoach?.id === coach.id ? 'border-primary' : ''
            }`}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <div className="p-2 bg-primary/10 rounded-full">
                {/* Using a generic icon as a placeholder */}
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-base">{coach.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
              {coach.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
