import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { graphEdges, graphNodes, packageEdges } from "@/components/graph/graph-data";
import { codeSamples } from "@/content/code";
import { docPages, docSections, findDocPage } from "@/content/docs";
import { garageShots, layers, packageIds, packages, products, type PackageId } from "@/content/framework";
import en from "@/i18n/dictionaries/en";

const publicDir = join(process.cwd(), "public");

describe("framework facts", () => {
  it("has the seven supercore packages", () => {
    expect(packageIds).toEqual([
      "after_core",
      "after_ecosystem",
      "after_ai",
      "after_design_system",
      "after_consumer",
      "after_enterprise",
      "after_firebase",
    ]);
  });

  it("only depends on known packages", () => {
    for (const p of packages) for (const d of p.dependsOn) expect(packageIds).toContain(d);
  });

  it("has an acyclic dependency graph rooted at after_core", () => {
    const visiting = new Set<PackageId>();
    const done = new Set<PackageId>();
    const visit = (id: PackageId) => {
      if (done.has(id)) return;
      if (visiting.has(id)) throw new Error(`cycle at ${id}`);
      visiting.add(id);
      for (const d of packages.find((p) => p.id === id)!.dependsOn) visit(d);
      visiting.delete(id);
      done.add(id);
    };
    packageIds.forEach(visit);
    expect(packages.filter((p) => p.dependsOn.length === 0).map((p) => p.id)).toEqual(["after_core"]);
  });

  it("assigns every package to exactly one layer", () => {
    const assigned = layers.flatMap((l) => l.packages);
    expect([...assigned].sort()).toEqual([...packageIds].sort());
  });

  it("references code samples that exist", () => {
    for (const p of packages) if (p.sample) expect(Object.keys(codeSamples)).toContain(p.sample);
  });

  it("only lists verified product dependencies on known packages", () => {
    for (const product of products) for (const d of product.packages ?? []) expect(packageIds).toContain(d);
  });

  it("ships an icon for every product and every SuperGarage screenshot", () => {
    for (const product of products) expect(existsSync(join(publicDir, "products", "icons", `${product.icon}.webp`))).toBe(true);
    for (const shot of garageShots) expect(existsSync(join(publicDir, shot.src))).toBe(true);
  });
});

describe("dependency graph", () => {
  it("mirrors pubspec dependencies exactly", () => {
    const expected = packages.flatMap((p) => p.dependsOn.map((d) => `${p.id}->${d}`)).sort();
    expect(packageEdges.map((e) => `${e.from}->${e.to}`).sort()).toEqual(expected);
  });

  it("only connects nodes that exist", () => {
    const ids = new Set(graphNodes.map((n) => n.id));
    for (const e of graphEdges) {
      expect(ids.has(e.from)).toBe(true);
      expect(ids.has(e.to)).toBe(true);
    }
  });
});

describe("docs", () => {
  it("has unique slugs", () => {
    const slugs = docPages.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has a page per package", () => {
    for (const id of packageIds) expect(findDocPage(`packages/${id}`)).toBeDefined();
  });

  it("gives every page unique, non-empty section ids", () => {
    for (const page of docPages) {
      const sections = docSections(page, en);
      expect(sections.length).toBeGreaterThan(0);
      expect(new Set(sections.map((s) => s.id)).size).toBe(sections.length);
      for (const s of sections) expect(s.title.trim()).not.toBe("");
    }
  });
});
