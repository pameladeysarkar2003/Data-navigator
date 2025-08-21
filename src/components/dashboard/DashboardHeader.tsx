import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Download, Upload, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  theme: string;
  onThemeToggle: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  theme,
  onThemeToggle,
  onExport,
  onImport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="glass-panel border-b-widget-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Dashboard Builder
        </h1>
        <div className="text-sm text-muted-foreground">
          Drag, drop, and customize your widgets
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="glass-panel border-widget-border hover:border-primary transition-smooth"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="glass-panel border-widget-border hover:border-primary transition-smooth"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onImport}
          className="hidden"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={onThemeToggle}
          className="glass-panel border-widget-border hover:border-primary transition-smooth"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="glass-panel border-widget-border hover:border-primary transition-smooth"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};