"use client";

import { useId, useState } from "react";
import {
  edgePath,
  graphEdges,
  graphNodes,
  NODE_H,
  nodeById,
  packageEdges,
  VIEW_H,
  VIEW_W,
  type GraphNodeId,
} from "./graph-data";

export interface DependencyGraphProps {
  label: string;
  /** Include product nodes (hero) or packages only (explorer / docs). */
  withProducts?: boolean;
  selected?: GraphNodeId | null;
  mirror?: boolean;
  animate?: boolean;
  interactive?: boolean;
  onSelect?: (id: GraphNodeId) => void;
  className?: string;
}

export function DependencyGraph({
  label,
  withProducts = false,
  selected = null,
  mirror = false,
  animate = false,
  interactive = false,
  onSelect,
  className,
}: DependencyGraphProps) {
  const [hovered, setHovered] = useState<GraphNodeId | null>(null);
  const uid = useId().replace(/:/g, "");
  const focus = hovered ?? selected;

  const nodes = withProducts ? graphNodes : graphNodes.filter((n) => n.kind === "package");
  const edges = withProducts ? graphEdges : packageEdges;
  const topOffset = withProducts ? 0 : 110;

  const related = new Set<GraphNodeId>();
  if (focus) {
    related.add(focus);
    for (const e of edges) {
      if (e.from === focus) related.add(e.to);
      if (e.to === focus) related.add(e.from);
    }
  }

  return (
    <svg
      viewBox={`0 ${topOffset} ${VIEW_W} ${VIEW_H - topOffset}`}
      role="img"
      aria-label={label}
      className={`${animate ? "graph-animate" : ""} ${className ?? ""} h-auto w-full select-none`}
    >
      <defs>
        <marker id={`${uid}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 8 4 0 8z" fill="var(--line-strong)" />
        </marker>
        <marker id={`${uid}-dep`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 8 4 0 8z" fill="var(--accent)" />
        </marker>
        <marker id={`${uid}-use`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 8 4 0 8z" fill="var(--signal)" />
        </marker>
      </defs>

      <g fill="none" strokeWidth="1.4">
        {edges.map((e) => {
          const from = nodeById(e.from);
          const to = nodeById(e.to);
          const d = edgePath(from, to, mirror);
          const isDep = focus !== null && e.from === focus;
          const isUse = focus !== null && e.to === focus;
          const dim = focus !== null && !isDep && !isUse;
          const stroke = isDep ? "var(--accent)" : isUse ? "var(--signal)" : "var(--line-strong)";
          const marker = isDep ? `${uid}-dep` : isUse ? `${uid}-use` : `${uid}-a`;
          const delay = 120 + Math.min(from.order, to.order) * 180 + 140;
          return (
            <g key={`${e.from}-${e.to}`}>
              <path
                d={d}
                pathLength={e.kind === "pubspec" ? 1 : undefined}
                className={e.kind === "pubspec" ? "graph-edge" : "graph-node"}
                stroke={stroke}
                strokeOpacity={dim ? 0.25 : 1}
                strokeDasharray={e.kind === "documented" ? "5 5" : undefined}
                markerEnd={`url(#${marker})`}
                style={{ ["--len" as string]: 1, ["--delay" as string]: `${delay}ms`, transition: "stroke 200ms, stroke-opacity 200ms" }}
              />
              {animate && (isDep || isUse || focus === null) && e.kind === "pubspec" ? (
                <path d={d} className="graph-pulse" stroke="var(--accent)" strokeOpacity={focus ? 0.9 : 0.35} strokeWidth="2" />
              ) : null}
            </g>
          );
        })}
      </g>

      <g>
        {nodes.map((n) => {
          const x = mirror ? VIEW_W - n.x : n.x;
          const isFocus = focus === n.id;
          const dim = focus !== null && !related.has(n.id);
          const isProduct = n.kind === "product";
          const handlers = interactive
            ? {
                onMouseEnter: () => setHovered(n.id),
                onMouseLeave: () => setHovered(null),
                onClick: () => onSelect?.(n.id),
                style: { cursor: onSelect ? "pointer" : "default", ["--delay" as string]: `${n.order * 180}ms` },
              }
            : { style: { ["--delay" as string]: `${n.order * 180}ms` } };
          return (
            <g key={n.id} className="graph-node" opacity={dim ? 0.35 : 1} {...handlers}>
              <rect
                x={x - n.w / 2}
                y={n.y - NODE_H / 2}
                width={n.w}
                height={NODE_H}
                rx={isProduct ? 17 : 6}
                fill={isFocus ? "var(--accent-soft)" : isProduct ? "var(--surface-2)" : "var(--surface)"}
                stroke={isFocus ? "var(--accent)" : isProduct ? "var(--signal)" : "var(--line-strong)"}
                strokeWidth={isFocus ? 1.6 : 1}
                strokeDasharray={n.id === "superhospital" ? "4 3" : undefined}
              />
              <text
                x={x}
                y={n.y + 4.5}
                textAnchor="middle"
                direction="ltr"
                fontSize="13"
                fontFamily={isProduct ? "var(--font-body)" : "var(--font-code)"}
                fontWeight={isProduct ? 600 : 500}
                fill={isFocus ? "var(--fg)" : isProduct ? "var(--fg)" : "var(--fg-muted)"}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
