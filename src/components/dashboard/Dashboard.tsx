import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ChartWidget } from './widgets/ChartWidget';
import { TableWidget } from './widgets/TableWidget';
import { NotesWidget } from './widgets/NotesWidget';
import { APIFeedWidget } from './widgets/APIFeedWidget';
import { DashboardHeader } from './DashboardHeader';
import { WidgetToolbar } from './WidgetToolbar';
import { useLocalStorage } from 'react-use';

const nodeTypes: NodeTypes = {
  chart: ChartWidget,
  table: TableWidget,
  notes: NotesWidget,
  apiFeed: APIFeedWidget,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'chart',
    position: { x: 250, y: 100 },
    data: { 
      title: 'Sample Chart',
      chartType: 'line',
      dataSource: 'sample'
    },
    style: { width: 400, height: 300 }
  },
  {
    id: '2',
    type: 'table',
    position: { x: 700, y: 100 },
    data: { 
      title: 'Data Table',
      columns: ['Name', 'Value', 'Status'],
      rows: [
        ['Item 1', '100', 'Active'],
        ['Item 2', '200', 'Inactive'],
        ['Item 3', '150', 'Active']
      ]
    },
    style: { width: 350, height: 250 }
  },
  {
    id: '3',
    type: 'notes',
    position: { x: 250, y: 450 },
    data: { 
      title: 'Quick Notes',
      content: 'Welcome to your dashboard! Start customizing by dragging widgets around.'
    },
    style: { width: 300, height: 200 }
  },
  {
    id: '4',
    type: 'apiFeed',
    position: { x: 600, y: 400 },
    data: { 
      title: 'GitHub Activity',
      apiUrl: 'https://api.github.com/users/octocat/events',
      refreshInterval: 30000
    },
    style: { width: 400, height: 300 }
  }
];

export const Dashboard: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [theme, setTheme] = useLocalStorage('dashboard-theme', 'dark');
  const [savedDashboard, setSavedDashboard] = useLocalStorage('dashboard-layout', null);

  // Load saved layout on mount
  useEffect(() => {
    if (savedDashboard) {
      setNodes(savedDashboard.nodes || initialNodes);
      setEdges(savedDashboard.edges || []);
    }
  }, [savedDashboard, setNodes, setEdges]);

  // Save layout whenever nodes or edges change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSavedDashboard({
        nodes,
        edges,
        timestamp: Date.now()
      });
    }, 1000); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, setSavedDashboard]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addWidget = useCallback((type: string) => {
    const newNode: Node = {
      id: `widget-${Date.now()}`,
      type,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: getDefaultWidgetData(type),
      style: { width: 300, height: 250 }
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const updateWidget = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, [setNodes]);

  const deleteWidget = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const exportDashboard = useCallback(() => {
    const exportData = {
      nodes,
      edges,
      theme,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [nodes, edges, theme]);

  const importDashboard = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setNodes(importedData.nodes || []);
        setEdges(importedData.edges || []);
        if (importedData.theme) setTheme(importedData.theme);
      } catch (error) {
        console.error('Failed to import dashboard:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  }, [setNodes, setEdges, setTheme]);

  return (
    <div className={`h-screen w-screen ${theme}`}>
      <div className="dashboard-bg h-full flex flex-col">
        <DashboardHeader 
          theme={theme}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          onExport={exportDashboard}
          onImport={importDashboard}
        />
        
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-transparent"
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              className="opacity-30"
            />
            <Controls 
              className="react-flow__controls glass-panel border-widget-border"
              showZoom={true}
              showFitView={true}
              showInteractive={false}
            />
            <MiniMap 
              className="glass-panel border-widget-border"
              nodeStrokeWidth={3}
              pannable
              zoomable
            />
          </ReactFlow>
          
          <WidgetToolbar onAddWidget={addWidget} />
        </div>
      </div>
    </div>
  );
};

function getDefaultWidgetData(type: string) {
  switch (type) {
    case 'chart':
      return {
        title: 'New Chart',
        chartType: 'line',
        dataSource: 'sample'
      };
    case 'table':
      return {
        title: 'New Table',
        columns: ['Column 1', 'Column 2'],
        rows: [['Row 1', 'Data 1'], ['Row 2', 'Data 2']]
      };
    case 'notes':
      return {
        title: 'New Notes',
        content: 'Click to edit your notes...'
      };
    case 'apiFeed':
      return {
        title: 'API Feed',
        apiUrl: '',
        refreshInterval: 30000
      };
    default:
      return {};
  }
}