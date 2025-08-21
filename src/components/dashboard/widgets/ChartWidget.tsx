import React, { memo, useState, useMemo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, X } from 'lucide-react';

interface ChartWidgetProps {
  id: string;
  data: {
    title: string;
    chartType: 'line' | 'bar';
    dataSource: string;
  };
}

const sampleData = [
  { name: 'Jan', value: 400, sales: 240 },
  { name: 'Feb', value: 300, sales: 139 },
  { name: 'Mar', value: 200, sales: 980 },
  { name: 'Apr', value: 278, sales: 390 },
  { name: 'May', value: 189, sales: 480 },
  { name: 'Jun', value: 239, sales: 380 },
];

export const ChartWidget: React.FC<ChartWidgetProps> = memo(({ id, data }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(data);

  const chartData = useMemo(() => {
    // In a real app, you'd fetch data based on config.dataSource
    return sampleData;
  }, [config.dataSource]);

  const renderChart = () => {
    const chartProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    if (config.chartType === 'bar') {
      return (
        <BarChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'calc(var(--radius) - 2px)'
            }}
          />
          <Legend />
          <Bar dataKey="value" fill="hsl(var(--primary))" />
          <Bar dataKey="sales" fill="hsl(var(--primary-glow))" />
        </BarChart>
      );
    }

    return (
      <LineChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'calc(var(--radius) - 2px)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))' }}
        />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="hsl(var(--primary-glow))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary-glow))' }}
        />
      </LineChart>
    );
  };

  return (
    <div className="widget-card rounded-xl p-4 h-full relative group animate-fade-in">
      <NodeResizer 
        minWidth={250} 
        minHeight={200}
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
            <h4 className="font-medium">Chart Settings</h4>
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
              <label className="text-xs font-medium text-muted-foreground">Chart Type</label>
              <Select
                value={config.chartType}
                onValueChange={(value: 'line' | 'bar') => setConfig(prev => ({ ...prev, chartType: value }))}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100%-3rem)] min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
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

ChartWidget.displayName = 'ChartWidget';