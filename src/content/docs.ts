import type { Dictionary } from "@/i18n/types";
import { fmt } from "@/i18n/format";
import { adrs, docsSources, packages, type PackageId } from "./framework";

export type DocKey =
  | "overview"
  | "gettingStarted"
  | "architecture"
  | "enterprise"
  | "packages"
  | "packageDetail"
  | "factory"
  | "tooling"
  | "designSystem"
  | "glossary";

export type DocGroup = keyof Dictionary["docs"]["ui"]["groups"];

export interface DocPage {
  /** Path segment under /docs; "" is the docs home. */
  slug: string;
  key: DocKey;
  group: DocGroup;
  pkg?: PackageId;
  /** Source files in supercore the page is derived from. */
  sources: string[];
}

export const docPages: DocPage[] = [
  { slug: "", key: "overview", group: "start", sources: ["README.md", docsSources.doctrine] },
  { slug: "getting-started", key: "gettingStarted", group: "start", sources: ["README.md", docsSources.checklist, "templates/super_app_consumer/after_framework.dart"] },
  { slug: "architecture", key: "architecture", group: "architecture", sources: [docsSources.architecture, docsSources.doctrine] },
  { slug: "enterprise", key: "enterprise", group: "architecture", sources: [docsSources.enterprise, adrs.scope.file, adrs.interop.file, adrs.bootstrap.file] },
  { slug: "packages", key: "packages", group: "packages", sources: ["README.md", docsSources.architecture] },
  ...packages.map<DocPage>((p) => ({
    slug: `packages/${p.id}`,
    key: "packageDetail",
    group: "packages",
    pkg: p.id,
    sources: [`${p.sourcePath}/pubspec.yaml`, `${p.sourcePath}/lib/${p.id}.dart`],
  })),
  { slug: "product-factory", key: "factory", group: "build", sources: [docsSources.factory, "factory/README.md", docsSources.schema] },
  { slug: "tooling", key: "tooling", group: "build", sources: ["scripts/generate_product.ps1", "scripts/validate_product_spec.ps1", "scripts/check_reuse_contract.ps1"] },
  { slug: "design-system", key: "designSystem", group: "reference", sources: ["packages/after_design_system/lib/src/foundations"] },
  { slug: "glossary", key: "glossary", group: "reference", sources: [] },
];

export const docGroups: DocGroup[] = ["start", "architecture", "packages", "build", "reference"];

export function findDocPage(slug: string): DocPage | undefined {
  return docPages.find((p) => p.slug === slug);
}

export function docPath(page: DocPage) {
  return page.slug ? `/docs/${page.slug}` : "/docs";
}

export function docTitle(page: DocPage, d: Dictionary): string {
  if (page.key === "packageDetail" && page.pkg) return page.pkg;
  return d.docs.pages[page.key as Exclude<DocKey, "packageDetail">].title;
}

export function docDescription(page: DocPage, d: Dictionary): string {
  if (page.key === "packageDetail" && page.pkg) {
    return fmt(d.docs.pages.packageDetail.description, {
      role: d.packages.items[page.pkg].role,
      name: page.pkg,
    });
  }
  return d.docs.pages[page.key as Exclude<DocKey, "packageDetail">].description;
}

export interface DocSection {
  id: string;
  title: string;
}

/** Section ids and titles — drives headings, the table of contents and the search index. */
export function docSections(page: DocPage, d: Dictionary): DocSection[] {
  const p = d.docs.pages;
  switch (page.key) {
    case "overview":
      return [
        { id: "what", title: p.overview.whatTitle },
        { id: "layers", title: p.overview.layersTitle },
        { id: "doctrine", title: p.overview.doctrineTitle },
        { id: "ecosystem", title: p.overview.ecosystemTitle },
      ];
    case "gettingStarted":
      return [
        { id: "requirements", title: p.gettingStarted.requirementsTitle },
        { id: "sibling-checkout", title: p.gettingStarted.layoutTitle },
        { id: "dependencies", title: p.gettingStarted.dependenciesTitle },
        { id: "composition-root", title: p.gettingStarted.compositionTitle },
        { id: "checklist", title: p.gettingStarted.checklistTitle },
      ];
    case "architecture":
      return [
        { id: "layers", title: p.architecture.layersTitle },
        { id: "dependency-rule", title: p.architecture.ruleTitle },
        { id: "principles", title: p.architecture.principlesTitle },
        { id: "app-shape", title: p.architecture.shapeTitle },
      ];
    case "enterprise":
      return [
        { id: "scope", title: p.enterprise.scopeTitle },
        { id: "rbac-audit", title: p.enterprise.rbacTitle },
        { id: "interop", title: p.enterprise.interopTitle },
        { id: "bootstrap", title: p.enterprise.bootstrapTitle },
        { id: "ports", title: p.enterprise.portsTitle },
      ];
    case "packages":
      return [
        { id: "graph", title: p.packages.graphTitle },
        { id: "index", title: p.packages.tableTitle },
      ];
    case "packageDetail":
      return [
        { id: "purpose", title: p.packageDetail.purposeTitle },
        { id: "dependencies", title: p.packageDetail.dependenciesTitle },
        { id: "apis", title: p.packageDetail.apisTitle },
        { id: "example", title: p.packageDetail.exampleTitle },
      ];
    case "factory":
      return [
        { id: "pipeline", title: p.factory.pipelineTitle },
        { id: "spec", title: p.factory.specTitle },
        { id: "ownership", title: p.factory.ownershipTitle },
        { id: "commands", title: p.factory.commandsTitle },
        { id: "regeneration", title: p.factory.regenTitle },
      ];
    case "tooling":
      return [
        { id: "cli", title: p.tooling.noCliTitle },
        { id: "scripts", title: p.tooling.scriptsTitle },
        { id: "flutter", title: p.tooling.flutterTitle },
        { id: "package-tests", title: p.tooling.packagesTitle },
        { id: "ci", title: p.tooling.ciTitle },
      ];
    case "designSystem":
      return [
        { id: "theme", title: p.designSystem.themeTitle },
        { id: "tokens", title: p.designSystem.tokensTitle },
        { id: "components", title: p.designSystem.componentsTitle },
        { id: "brand", title: p.designSystem.brandTitle },
      ];
    case "glossary":
      return Object.entries(d.glossary).map(([id, entry]) => ({ id, title: entry.term }));
  }
}
