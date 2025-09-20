
'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Sparkles } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  models: Model[];
}

export function ModelSelector({ selectedModel, setSelectedModel, models }: ModelSelectorProps) {
  const selectedModelData = models.find(m => m.id === selectedModel);
  
  // Group models by provider
  const modelsByProvider = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, Model[]>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="max-w-[150px] truncate">
            {selectedModelData?.name || selectedModel}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-[400px] overflow-y-auto">
        <DropdownMenuRadioGroup value={selectedModel} onValueChange={setSelectedModel}>
          {Object.entries(modelsByProvider).map(([provider, providerModels], index) => (
            <React.Fragment key={provider}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                {provider}
              </DropdownMenuLabel>
              {providerModels.map((model) => (
                <DropdownMenuRadioItem 
                  key={model.id} 
                  value={model.id}
                  className="pl-6 py-1.5"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm">{model.name}</span>
                    <span className="text-[10px] text-muted-foreground">{model.id}</span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </React.Fragment>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
