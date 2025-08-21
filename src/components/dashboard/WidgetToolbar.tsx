import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Table, StickyNote, Rss, Plus } from 'lucide-react';

interface WidgetToolbarProps {
  onAddWidget: (type: string) => void;
}

export const WidgetToolbar: React.FC<WidgetToolbarProps> = ({ onAddWidget }) => {
  const widgets = [
    {
      type: 'chart',
      icon: BarChart3,
      label: 'Chart',
      description: 'Add interactive charts'
    },
    {
      type: 'table',
      icon: Table,
      label: 'Table',
      description: 'Display tabular data'
    },
    {
      type: 'notes',
      icon: StickyNote,
      label: 'Notes',
      description: 'Add text notes'
    },
    {
      type: 'apiFeed',
      icon: Rss,
      label: 'API Feed',
      description: 'Connect to APIs'
    }
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="glass-panel border-widget-border p-3 rounded-xl space-y-2 animate-fade-in">
        <div className="text-xs font-medium text-muted-foreground px-2 pb-2 border-b border-widget-border">
          Add Widget
        </div>
        
        {widgets.map((widget) => {
          const Icon = widget.icon;
          return (
            <Button
              key={widget.type}
              variant="ghost"
              size="sm"
              onClick={() => onAddWidget(widget.type)}
              className="w-full justify-start gap-2 hover:bg-primary/10 hover:text-primary transition-smooth group"
              title={widget.description}
            >
              <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              {widget.label}
            </Button>
          );
        })}
        
        <div className="pt-2 border-t border-widget-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddWidget('chart')}
            className="w-full justify-center gap-2 glass-panel border-primary/30 hover:border-primary hover:glow-effect transition-smooth"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>
    </div>
  );
};