import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, X, RefreshCw, Activity, AlertCircle } from 'lucide-react';

interface APIFeedWidgetProps {
  id: string;
  data: {
    title: string;
    apiUrl: string;
    refreshInterval: number;
  };
}

interface FeedItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type?: string;
}

export const APIFeedWidget: React.FC<APIFeedWidgetProps> = memo(({ id, data }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(data);
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    if (config.apiUrl) {
      fetchData();
      
      if (config.refreshInterval > 0) {
        const interval = setInterval(fetchData, config.refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [config.apiUrl, config.refreshInterval]);

  const fetchData = async () => {
    if (!config.apiUrl) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll use sample data
      // In a real app, you'd make the actual API call
      if (config.apiUrl.includes('github.com')) {
        // Simulate GitHub API response
        const mockData: FeedItem[] = [
          {
            id: '1',
            title: 'Pushed to main branch',
            description: 'Updated dashboard widgets with new features',
            timestamp: new Date().toISOString(),
            type: 'push'
          },
          {
            id: '2',
            title: 'Created new pull request',
            description: 'Add dark mode support to dashboard',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            type: 'pull_request'
          },
          {
            id: '3',
            title: 'Issue opened',
            description: 'Widget resizing not working properly',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            type: 'issue'
          }
        ];
        setFeedData(mockData);
      } else {
        // Generic API response
        const mockData: FeedItem[] = [
          {
            id: '1',
            title: 'System Update',
            description: 'New data available',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Alert',
            description: 'Memory usage is high',
            timestamp: new Date(Date.now() - 1800000).toISOString()
          }
        ];
        setFeedData(mockData);
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to fetch data');
      console.error('API fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'push':
        return '📤';
      case 'pull_request':
        return '🔄';
      case 'issue':
        return '🐛';
      default:
        return '📊';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="widget-card rounded-xl p-4 h-full relative group animate-fade-in">
      <NodeResizer 
        minWidth={300} 
        minHeight={200}
        isVisible={true}
        lineClassName="border-primary"
        handleClassName="w-3 h-3 bg-primary border-2 border-primary-foreground"
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{config.title}</h3>
          {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <RefreshCw className="h-3 w-3" />
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
            <h4 className="font-medium">API Feed Settings</h4>
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
              <label className="text-xs font-medium text-muted-foreground">API URL</label>
              <Input
                value={config.apiUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                className="h-8 text-sm"
                placeholder="https://api.example.com/data"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground">Refresh Interval</label>
              <Select
                value={config.refreshInterval.toString()}
                onValueChange={(value) => setConfig(prev => ({ ...prev, refreshInterval: parseInt(value) }))}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Manual only</SelectItem>
                  <SelectItem value="30000">30 seconds</SelectItem>
                  <SelectItem value="60000">1 minute</SelectItem>
                  <SelectItem value="300000">5 minutes</SelectItem>
                  <SelectItem value="900000">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100%-3rem)] flex flex-col">
        {lastRefresh && (
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
            <Activity className="h-3 w-3" />
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        )}
        
        {error && (
          <div className="text-xs text-destructive mb-2 flex items-center gap-2">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}
        
        <div className="flex-1 overflow-auto custom-scrollbar space-y-2">
          {feedData.length === 0 && !isLoading && !error ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              {config.apiUrl ? 'No data available' : 'Configure API URL to start'}
            </div>
          ) : (
            feedData.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors border border-widget-border/50"
              >
                <div className="flex items-start gap-2">
                  <span className="text-sm">{getTypeIcon(item.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </div>
                    <div className="text-xs text-primary mt-1">
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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

APIFeedWidget.displayName = 'APIFeedWidget';