import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, Tag, Space, Typography } from 'antd';
import type { GraphNode, GraphLink } from '../mock/data';

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  height?: number;
}

type NodeDatum = GraphNode & d3.SimulationNodeDatum;

const GROUP_COLORS: Record<GraphNode['group'], string> = {
  client: '#1677ff',
  industry: '#722ed1',
  product: '#13c2c2',
  case: '#52c41a',
  person: '#fa8c16',
  cert: '#eb2f96',
};

const GROUP_NAMES: Record<GraphNode['group'], string> = {
  client: '客户',
  industry: '行业',
  product: '产品',
  case: '案例',
  person: '人员',
  cert: '资质',
};

export default function KnowledgeGraph({ nodes, links, height = 520 }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current?.clientWidth ?? 800;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom as any);

    // Arrow markers
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 24)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    const nodeById = new Map<string, GraphNode>(nodes.map((n) => [n.id, n]));

    const typedLinks: d3.SimulationLinkDatum<NodeDatum>[] = links.map((l) => ({
      ...l,
      source: typeof l.source === 'string' ? (nodeById.get(l.source)! as NodeDatum) : (l.source as NodeDatum),
      target: typeof l.target === 'string' ? (nodeById.get(l.target)! as NodeDatum) : (l.target as NodeDatum),
    }));

    const simulation = d3
      .forceSimulation(nodes as NodeDatum[])
      .force(
        'link',
        d3
          .forceLink<NodeDatum, d3.SimulationLinkDatum<NodeDatum>>(typedLinks)
          .id((d) => d.id)
          .distance(120)
      )
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force('collide', d3.forceCollide<NodeDatum>().radius((d) => (d.value ?? 14) + 8));

    const getNode = (ref: string | NodeDatum): NodeDatum =>
      typeof ref === 'string' ? (nodeById.get(ref)! as NodeDatum) : ref;

    // Links
    const link = g
      .append('g')
      .attr('stroke', '#bfbfbf')
      .attr('stroke-opacity', 0.7)
      .selectAll('line')
      .data(typedLinks)
      .join('line')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#1677ff').attr('stroke-width', 3).attr('stroke-opacity', 1);
        setHoveredLink(d as unknown as GraphLink);
        setTooltipPos({ x: event.pageX + 12, y: event.pageY - 12 });
      })
      .on('mousemove', function (event) {
        setTooltipPos({ x: event.pageX + 12, y: event.pageY - 12 });
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#bfbfbf').attr('stroke-width', 1.5).attr('stroke-opacity', 0.7);
        setHoveredLink(null);
      });

    // Link labels
    const linkLabel = g
      .append('g')
      .attr('font-size', 11)
      .attr('fill', '#595959')
      .selectAll('text')
      .data(typedLinks)
      .join('text')
      .text((d) => (d as unknown as GraphLink).relation)
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .attr('pointer-events', 'none')
      .style('user-select', 'none');

    const dragBehavior = d3
      .drag<SVGGElement, NodeDatum>()
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

    // Nodes
    const node = g
      .append('g')
      .selectAll<SVGGElement, NodeDatum>('g')
      .data(nodes as NodeDatum[])
      .join('g')
      .attr('cursor', 'pointer')
      .call(dragBehavior as any);

    node
      .append('circle')
      .attr('r', (d) => d.value ?? 14)
      .attr('fill', (d) => GROUP_COLORS[d.group])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#333').attr('stroke-width', 3);
        setHoveredNode(d);
        setTooltipPos({ x: event.pageX + 12, y: event.pageY - 12 });
      })
      .on('mousemove', function (event) {
        setTooltipPos({ x: event.pageX + 12, y: event.pageY - 12 });
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2);
        setHoveredNode(null);
      });

    node
      .append('text')
      .text((d) => d.label)
      .attr('x', (d) => (d.value ?? 14) + 6)
      .attr('y', 4)
      .attr('font-size', 12)
      .attr('fill', '#262626')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => getNode(d.source as string | NodeDatum).x ?? 0)
        .attr('y1', (d) => getNode(d.source as string | NodeDatum).y ?? 0)
        .attr('x2', (d) => getNode(d.target as string | NodeDatum).x ?? 0)
        .attr('y2', (d) => getNode(d.target as string | NodeDatum).y ?? 0);

      linkLabel
        .attr('x', (d) => {
          const s = getNode(d.source as string | NodeDatum);
          const t = getNode(d.target as string | NodeDatum);
          return ((s.x ?? 0) + (t.x ?? 0)) / 2;
        })
        .attr('y', (d) => {
          const s = getNode(d.source as string | NodeDatum);
          const t = getNode(d.target as string | NodeDatum);
          return ((s.y ?? 0) + (t.y ?? 0)) / 2;
        });

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, height]);

  return (
    <Card size="small" style={{ position: 'relative' }} bodyStyle={{ padding: 0 }}>
      <div ref={containerRef} style={{ width: '100%' }}>
        <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
      </div>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(255,255,255,0.95)',
          padding: '10px 12px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          fontSize: 12,
        }}
      >
        <Space direction="vertical" size={6}>
          {(Object.keys(GROUP_NAMES) as GraphNode['group'][]).map((group) => (
            <div key={group} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: GROUP_COLORS[group],
                  display: 'inline-block',
                }}
              />
              <span>{GROUP_NAMES[group]}</span>
            </div>
          ))}
        </Space>
      </div>

      {/* Tooltip */}
      {(hoveredNode || hoveredLink) && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPos.x,
            top: tooltipPos.y,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 13,
            pointerEvents: 'none',
            maxWidth: 260,
          }}
        >
          {hoveredNode && (
            <Space direction="vertical" size={2}>
              <Typography.Text style={{ color: '#fff', fontWeight: 600 }}>{hoveredNode.label}</Typography.Text>
              <Tag color={GROUP_COLORS[hoveredNode.group]} style={{ color: '#fff', border: 'none' }}>
                {GROUP_NAMES[hoveredNode.group]}
              </Tag>
            </Space>
          )}
          {hoveredLink && (
            <Space direction="vertical" size={2}>
              <Typography.Text style={{ color: '#fff' }}>
                {(hoveredLink.source as GraphNode).label} <span style={{ color: '#aaa' }}>→</span>{' '}
                {(hoveredLink.target as GraphNode).label}
              </Typography.Text>
              <Typography.Text style={{ color: '#bae0ff' }}>{hoveredLink.relation}</Typography.Text>
            </Space>
          )}
        </div>
      )}
    </Card>
  );
}
