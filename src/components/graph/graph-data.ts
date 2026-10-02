import { packages, products, type PackageId } from "@/content/framework";

export type GraphNodeId = PackageId | "supergarage" | "afterhub" | "superhospital";

export interface GraphNode {
  id: GraphNodeId;
  label: string;
  kind: "product" | "package";
  x: number;
  y: number;
  w: number;
  /** Bottom-up assembly order (0 = kernel). */
  order: number;
}

export interface GraphEdge {
  from: GraphNodeId;
  to: GraphNodeId;
  /** pubspec-verified, or taken from the documented reference stack. */
  kind: "pubspec" | "documented";
}

export const VIEW_W = 800;
export const VIEW_H = 470;
export const NODE_H = 34;

export const graphNodes: GraphNode[] = [
  { id: "supergarage", label: "SuperGarage", kind: "product", x: 150, y: 44, w: 132, order: 4 },
  { id: "afterhub", label: "AfterHub", kind: "product", x: 400, y: 44, w: 116, order: 4 },
  { id: "superhospital", label: "SuperHospital", kind: "product", x: 650, y: 44, w: 140, order: 4 },
  { id: "after_ecosystem", label: "after_ecosystem", kind: "package", x: 280, y: 160, w: 150, order: 3 },
  { id: "after_ai", label: "after_ai", kind: "package", x: 540, y: 160, w: 110, order: 3 },
  { id: "after_consumer", label: "after_consumer", kind: "package", x: 140, y: 280, w: 150, order: 2 },
  { id: "after_enterprise", label: "after_enterprise", kind: "package", x: 660, y: 280, w: 160, order: 2 },
  { id: "after_firebase", label: "after_firebase", kind: "package", x: 400, y: 320, w: 150, order: 1 },
  { id: "after_core", label: "after_core", kind: "package", x: 270, y: 426, w: 124, order: 0 },
  { id: "after_design_system", label: "after_design_system", kind: "package", x: 540, y: 426, w: 186, order: 0 },
];

const productEdges: GraphEdge[] = products.flatMap((p) =>
  (p.packages ?? []).map<GraphEdge>((to) => ({ from: p.id as GraphNodeId, to, kind: "pubspec" })),
);

/** docs/ENTERPRISE_FRAMEWORK.md: Industry Domain product → after_ecosystem + after_ai + after_enterprise. */
const documentedEdges: GraphEdge[] = (["after_ecosystem", "after_ai", "after_enterprise"] as const).map((to) => ({
  from: "superhospital",
  to,
  kind: "documented",
}));

export const packageEdges: GraphEdge[] = packages.flatMap((p) =>
  p.dependsOn.map<GraphEdge>((to) => ({ from: p.id, to, kind: "pubspec" })),
);

export const graphEdges: GraphEdge[] = [...packageEdges, ...productEdges, ...documentedEdges];

export function nodeById(id: GraphNodeId) {
  const node = graphNodes.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown graph node ${id}`);
  return node;
}

/** Cubic path between the facing sides of two nodes. */
export function edgePath(from: GraphNode, to: GraphNode, mirror: boolean): string {
  const fx = mirror ? VIEW_W - from.x : from.x;
  const tx = mirror ? VIEW_W - to.x : to.x;
  const dy = to.y - from.y;
  if (Math.abs(dy) < 40) {
    const dir = tx > fx ? 1 : -1;
    const x1 = fx + (dir * from.w) / 2;
    const x2 = tx - (dir * to.w) / 2;
    const mid = (x1 + x2) / 2;
    return `M${x1} ${from.y} C${mid} ${from.y} ${mid} ${to.y} ${x2} ${to.y}`;
  }
  const down = dy > 0 ? 1 : -1;
  const y1 = from.y + (down * NODE_H) / 2;
  const y2 = to.y - (down * NODE_H) / 2;
  const bend = (y2 - y1) * 0.5;
  return `M${fx} ${y1} C${fx} ${y1 + bend} ${tx} ${y2 - bend} ${tx} ${y2}`;
}
