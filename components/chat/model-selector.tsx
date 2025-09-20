
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
        <Button variant="outline" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>{selectedModelData?.name || selectedModel}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuRadioGroup value={selectedModel} onValueChange={setSelectedModel}>
          {Object.entries(modelsByProvider).map(([provider, providerModels], index) => (
            <React.Fragment key={provider}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{provider}</DropdownMenuLabel>
              {providerModels.map((model) => (
                <DropdownMenuRadioItem 
                  key={model.id} 
                  value={model.id}
                  className="pl-6"
                >
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.id}</span>
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
