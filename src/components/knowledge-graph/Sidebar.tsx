import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraphNode } from '@/data/graphData';

interface SidebarProps {
  selectedNode: GraphNode | null;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technology':
        return 'bg-blue-500/20 text-blue-700 border-blue-300';
      case 'language':
        return 'bg-green-500/20 text-green-700 border-green-300';
      case 'framework':
        return 'bg-purple-500/20 text-purple-700 border-purple-300';
      case 'concept':
        return 'bg-orange-500/20 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background/95 backdrop-blur-sm border-l border-border shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Node Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedNode.color }}
              />
              <CardTitle className="text-xl">{selectedNode.label}</CardTitle>
            </div>
            <Badge 
              variant="outline" 
              className={getCategoryColor(selectedNode.category)}
            >
              {selectedNode.category}
            </Badge>
          </CardHeader>
          
          <CardContent>
            <CardDescription className="text-sm leading-relaxed">
              {selectedNode.description}
            </CardDescription>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Node ID:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {selectedNode.id}
                </code>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span className="capitalize font-medium">{selectedNode.category}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Color:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-border"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  <code className="text-xs">{selectedNode.color}</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Expand Related Nodes
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Hide Node
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              View Connections
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};