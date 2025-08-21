import React, { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, X, Edit3 } from 'lucide-react';

interface NotesWidgetProps {
  id: string;
  data: {
    title: string;
    content: string;
  };
}

export const NotesWidget: React.FC<NotesWidgetProps> = memo(({ id, data }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState(data);

  return (
    <div className="widget-card rounded-xl p-4 h-full relative group animate-fade-in">
      <NodeResizer 
        minWidth={200} 
        minHeight={150}
        isVisible={true}
        lineClassName="border-primary"
        handleClassName="w-3 h-3 bg-primary border-2 border-primary-foreground"
      />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{config.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {isConfigOpen && (
        <div className="absolute top-0 left-0 right-0 glass-panel border-widget-border rounded-xl p-4 z-10 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Notes Settings</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfigOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Title</label>
              <Input
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground">Content</label>
              <Textarea
                value={config.content}
                onChange={(e) => setConfig(prev => ({ ...prev, content: e.target.value }))}
                className="text-sm resize-none"
                rows={4}
                placeholder="Enter your notes..."
              />
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100%-3rem)] overflow-hidden">
        {isEditing ? (
          <div className="h-full space-y-2">
            <Input
              value={config.title}
              onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
              className="h-8 text-sm font-medium"
              placeholder="Note title..."
            />
            <Textarea
              value={config.content}
              onChange={(e) => setConfig(prev => ({ ...prev, content: e.target.value }))}
              className="flex-1 h-[calc(100%-2.5rem)] text-sm resize-none border-dashed"
              placeholder="Click to start writing..."
            />
          </div>
        ) : (
          <div 
            className="h-full overflow-auto custom-scrollbar cursor-text p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {config.content || 'Click to start writing...'}
            </div>
          </div>
        )}
      </div>

      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-primary border-2 border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-primary border-2 border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
});

NotesWidget.displayName = 'NotesWidget';