import React, { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, X, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableWidgetProps {
  id: string;
  data: {
    title: string;
    columns: string[];
    rows: string[][];
  };
}

export const TableWidget: React.FC<TableWidgetProps> = memo(({ id, data }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(data);

  const addColumn = () => {
    setConfig(prev => ({
      ...prev,
      columns: [...prev.columns, `Column ${prev.columns.length + 1}`],
      rows: prev.rows.map(row => [...row, ''])
    }));
  };

  const addRow = () => {
    setConfig(prev => ({
      ...prev,
      rows: [...prev.rows, new Array(prev.columns.length).fill('')]
    }));
  };

  const updateColumn = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => i === index ? value : col)
    }));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      rows: prev.rows.map((row, i) => 
        i === rowIndex 
          ? row.map((cell, j) => j === colIndex ? value : cell)
          : row
      )
    }));
  };

  const removeRow = (index: number) => {
    setConfig(prev => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== index)
    }));
  };

  const removeColumn = (index: number) => {
    if (config.columns.length <= 1) return; // Keep at least one column
    
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
      rows: prev.rows.map(row => row.filter((_, i) => i !== index))
    }));
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
        <div className="absolute top-0 left-0 right-0 glass-panel border-widget-border rounded-xl p-4 z-10 animate-scale-in max-h-96 overflow-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Table Settings</h4>
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Columns</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addColumn}
                  className="h-6 text-xs px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              
              {config.columns.map((column, index) => (
                <div key={index} className="flex gap-2 mb-1">
                  <Input
                    value={column}
                    onChange={(e) => updateColumn(index, e.target.value)}
                    className="h-7 text-xs flex-1"
                    placeholder={`Column ${index + 1}`}
                  />
                  {config.columns.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColumn(index)}
                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Data</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRow}
                  className="h-6 text-xs px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Row
                </Button>
              </div>
              
              {config.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 mb-1">
                  {row.map((cell, colIndex) => (
                    <Input
                      key={colIndex}
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="h-7 text-xs flex-1"
                      placeholder={config.columns[colIndex]}
                    />
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(rowIndex)}
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(100%-3rem)] overflow-auto custom-scrollbar">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="border-widget-border">
              {config.columns.map((column, index) => (
                <TableHead key={index} className="text-muted-foreground font-medium py-2">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {config.rows.map((row, index) => (
              <TableRow key={index} className="border-widget-border hover:bg-muted/50">
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="py-2">
                    {cell || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

TableWidget.displayName = 'TableWidget';