import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink, GraphData } from '@/data/graphData';

interface GraphProps {
  data: GraphData;
  selectedNode: GraphNode | null;
  highlightedNodes: Set<string>;
  onNodeClick: (node: GraphNode) => void;
  onNodeExpand: (nodeId: string) => void;
}

export const Graph: React.FC<GraphProps> = ({ 
  data, 
  selectedNode, 
  highlightedNodes, 
  onNodeClick, 
  onNodeExpand 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Handle window resize
  const updateDimensions = useCallback(() => {
    if (svgRef.current) {
      const rect = svgRef.current.parentElement?.getBoundingClientRect();
      if (rect) {
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    const g = svg.append('g');

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(data.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(data.links)
        .id((d) => d.id)
        .distance(100)
        .strength(0.8))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', 'hsl(var(--border))')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.strength * 3));

    // Create link labels
    const linkLabel = g.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(data.links)
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'hsl(var(--muted-foreground))')
      .attr('opacity', 0.7)
      .text((d) => d.relationship);

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add circles to nodes
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d) => d.color)
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))');

    // Add labels to nodes
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', 'hsl(var(--background))')
      .style('pointer-events', 'none')
      .text((d) => d.label.length > 10 ? d.label.substring(0, 8) + '...' : d.label);

    // Add drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    // Handle node clicks
    node.on('click', (event, d) => {
      event.stopPropagation();
      onNodeClick(d);
    });

    // Handle node double clicks for expansion
    node.on('dblclick', (event, d) => {
      event.stopPropagation();
      onNodeExpand(d.id);
    });

    // Add hover effects
    node.on('mouseenter', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 25)
        .style('filter', 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))');
      
      // Highlight connected links
      link.style('stroke-opacity', (l: any) => 
        l.source.id === d.id || l.target.id === d.id ? 1 : 0.1
      );
    });

    node.on('mouseleave', function(event, d) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', 20)
        .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))');
      
      // Reset link opacity
      link.style('stroke-opacity', 0.6);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Clear selection on background click
    svg.on('click', () => {
      onNodeClick(null as any);
    });

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, onNodeClick, onNodeExpand]);

  // Update node highlighting based on search and selection
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll('.node');

    nodes.selectAll('circle')
      .attr('stroke-width', (d: any) => {
        if (selectedNode && d.id === selectedNode.id) return 4;
        if (highlightedNodes.has(d.id)) return 3;
        return 3;
      })
      .attr('stroke', (d: any) => {
        if (selectedNode && d.id === selectedNode.id) return 'hsl(var(--primary))';
        if (highlightedNodes.has(d.id)) return 'hsl(var(--accent))';
        return 'hsl(var(--background))';
      })
      .style('opacity', (d: any) => {
        if (highlightedNodes.size === 0) return 1;
        return highlightedNodes.has(d.id) ? 1 : 0.3;
      });

    nodes.selectAll('text')
      .style('opacity', (d: any) => {
        if (highlightedNodes.size === 0) return 1;
        return highlightedNodes.has(d.id) ? 1 : 0.3;
      });
  }, [selectedNode, highlightedNodes]);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-background via-background to-muted/20">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="overflow-hidden"
      >
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="nodeGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-xs text-muted-foreground max-w-xs">
        <div className="space-y-1">
          <div><strong>Click:</strong> Select node</div>
          <div><strong>Double-click:</strong> Expand node</div>
          <div><strong>Drag:</strong> Move node</div>
          <div><strong>Scroll:</strong> Zoom in/out</div>
        </div>
      </div>
    </div>
  );
};