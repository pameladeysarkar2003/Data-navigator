import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Filter, Upload, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Graph } from './Graph';
import { SearchBar } from './SearchBar';
import { Sidebar } from './Sidebar';
import { GraphNode, GraphData, initialGraphData, expandedNodes, expandedLinks } from '@/data/graphData';

export const Layout: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>(initialGraphData);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Filter and search logic
  const { filteredData, highlightedNodes } = useMemo(() => {
    let nodes = [...graphData.nodes];
    let links = [...graphData.links];

    // Apply category filter
    if (categoryFilter !== 'all') {
      nodes = nodes.filter(node => node.category === categoryFilter);
      const nodeIds = new Set(nodes.map(n => n.id));
      links = links.filter(link => {
        const sourceId = typeof link.source === 'string' ? link.source : (link.source as any).id;
        const targetId = typeof link.target === 'string' ? link.target : (link.target as any).id;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      });
    }

    // Create highlighted nodes set based on search
    const highlighted = new Set<string>();
    if (searchTerm) {
      nodes.forEach(node => {
        if (node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          highlighted.add(node.id);
        }
      });
    }

    return {
      filteredData: { nodes, links },
      highlightedNodes: highlighted
    };
  }, [graphData, categoryFilter, searchTerm]);

  const handleNodeClick = useCallback((node: GraphNode | null) => {
    setSelectedNode(node);
  }, []);

  const handleNodeExpand = useCallback((nodeId: string) => {
    if (expandedNodeIds.has(nodeId)) {
      toast({
        title: "Node already expanded",
        description: `${nodeId} has already been expanded.`,
      });
      return;
    }

    const newNodes = expandedNodes[nodeId] || [];
    const newLinks = expandedLinks[nodeId] || [];

    if (newNodes.length === 0) {
      toast({
        title: "No additional nodes",
        description: `No additional nodes available for ${nodeId}.`,
      });
      return;
    }

    setGraphData(prev => ({
      nodes: [...prev.nodes, ...newNodes],
      links: [...prev.links, ...newLinks]
    }));

    setExpandedNodeIds(prev => new Set([...prev, nodeId]));

    toast({
      title: "Node expanded",
      description: `Added ${newNodes.length} related nodes for ${nodeId}.`,
    });
  }, [expandedNodeIds, toast]);

  const handleReset = useCallback(() => {
    setGraphData(initialGraphData);
    setExpandedNodeIds(new Set());
    setSelectedNode(null);
    setSearchTerm('');
    setCategoryFilter('all');
    toast({
      title: "Graph reset",
      description: "Graph has been reset to initial state.",
    });
  }, [toast]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.nodes || !data.links || !Array.isArray(data.nodes) || !Array.isArray(data.links)) {
          throw new Error('Invalid data structure');
        }

        setGraphData(data);
        setExpandedNodeIds(new Set());
        setSelectedNode(null);
        
        toast({
          title: "Data imported",
          description: `Successfully loaded ${data.nodes.length} nodes and ${data.links.length} links.`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to parse JSON file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  }, [toast]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'knowledge-graph.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Graph data has been downloaded as JSON.",
    });
  }, [graphData, toast]);

  const categories = ['all', 'technology', 'language', 'framework', 'concept'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Knowledge Graph Explorer
              </h1>
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-background/50 backdrop-blur-sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="bg-background/50 backdrop-blur-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-background/50 backdrop-blur-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div className="h-[calc(100vh-73px)] relative">
          <Card className="h-full m-4 border-border/50 bg-background/30 backdrop-blur-sm">
            <CardContent className="p-0 h-full">
              <Graph
                data={filteredData}
                selectedNode={selectedNode}
                highlightedNodes={highlightedNodes}
                onNodeClick={handleNodeClick}
                onNodeExpand={handleNodeExpand}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <Sidebar
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
        />

        {/* Stats Panel */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-sm space-y-1">
          <div className="font-semibold text-primary">Graph Stats</div>
          <div>Nodes: {filteredData.nodes.length}</div>
          <div>Links: {filteredData.links.length}</div>
          <div>Categories: {new Set(filteredData.nodes.map(n => n.category)).size}</div>
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};