/**
 * Verified After Framework facts. Every entry is traceable to the `supercore`
 * repository (package pubspecs, READMEs, docs/ and ADRs). Localized prose lives
 * in the dictionaries; identifiers here are never translated.
 */

export const repo = {
  org: "https://github.com/oversteintech",
  supercore: "https://github.com/oversteintech/supercore",
  site: "https://github.com/oversteintech/afterframework",
  blob: "https://github.com/oversteintech/supercore/blob/main",
  tree: "https://github.com/oversteintech/supercore/tree/main",
} as const;

export const links = {
  afterArtificial: "https://www.afterartificial.com",
  overstein: "https://www.overstein.com",
  founder: "https://www.ayhanuzundal.com.tr",
  email: "hello@overstein.com",
} as const;

export const toolchain = {
  dartSdk: "^3.12.2",
  flutter: ">=3.27.0",
  packageVersion: "1.0.0",
  consumption: "path:",
} as const;

export type PackageId =
  | "after_core"
  | "after_ecosystem"
  | "after_ai"
  | "after_design_system"
  | "after_consumer"
  | "after_enterprise"
  | "after_firebase";

export type LayerId =
  | "product"
  | "ecosystem"
  | "ai"
  | "consumer"
  | "enterprise"
  | "kernel"
  | "design"
  | "firebase";

export interface FrameworkPackage {
  id: PackageId;
  layer: LayerId;
  /** From `packages/<id>/pubspec.yaml` — internal path dependencies only. */
  dependsOn: PackageId[];
  /** Notable third-party dependencies from the same pubspec. */
  external: string[];
  /** Public API identifiers exported by the package barrel / README. */
  apis: string[];
  /** Key into `codeSamples` (src/content/code.ts), when a verified sample exists. */
  sample?: string;
  sourcePath: string;
}

export const packages: FrameworkPackage[] = [
  {
    id: "after_core",
    layer: "kernel",
    dependsOn: [],
    external: ["flutter_riverpod", "dio", "flutter_secure_storage", "shared_preferences", "google_sign_in", "app_links", "flutter_local_notifications"],
    apis: [
      "AppPlatformManifest",
      "PlatformConfig",
      "AfterStandardOverrides",
      "AfterBootstrapMode",
      "AfterAuthRepository",
      "AfterApiClient",
      "AfterHttpClientFactory",
      "AfterFeatureFlags",
      "AfterRemoteConfig",
      "AfterAiCredentialVault",
      "AfterEntitlementEngine",
      "AfterUserPlan",
      "AfterDeepLinkService",
      "DashboardEngine",
      "AfterPluginRegistry",
      "AfterSearchPort",
      "AfterSettingsStore",
      "AfterSupportedLocales",
    ],
    sample: "coreBootstrap",
    sourcePath: "packages/after_core",
  },
  {
    id: "after_ecosystem",
    layer: "ecosystem",
    dependsOn: ["after_core"],
    external: ["flutter_riverpod", "uuid"],
    apis: [
      "AfterEventBus",
      "AfterProductApi",
      "AfterProductApiRegistry",
      "AfterSecureInteropBridge",
      "AfterEcosystemAiContext",
      "afterEcosystemProvider",
    ],
    sample: "eventEnvelope",
    sourcePath: "packages/after_ecosystem",
  },
  {
    id: "after_ai",
    layer: "ai",
    dependsOn: ["after_core"],
    external: ["flutter_riverpod", "uuid"],
    apis: [
      "AfterAiPlatform",
      "AfterAiProfile",
      "AfterAiCapability",
      "AfterAiCapabilityDisabledException",
      "afterAiProfileProvider",
      "afterAiPlatformProvider",
      "AfterToolCallingAi",
      "AfterAiPluginRegistry",
    ],
    sample: "aiProfile",
    sourcePath: "packages/after_ai",
  },
  {
    id: "after_design_system",
    layer: "design",
    dependsOn: ["after_core"],
    external: ["shared_preferences"],
    apis: ["AfterThemeData", "AfterTheme", "AfterColors", "AfterSpacing", "AfterRadius", "AfterMotion", "AfterFadeSlide"],
    sample: "themeData",
    sourcePath: "packages/after_design_system",
  },
  {
    id: "after_consumer",
    layer: "consumer",
    dependsOn: ["after_core", "after_design_system", "after_firebase"],
    external: ["flutter_riverpod", "geolocator", "geocoding", "image_picker", "permission_handler"],
    apis: [
      "ConsumerMembership",
      "ConsumerCoreFeatureId",
      "ConsumerVerticalFeature",
      "PersonalVaultRepository",
      "consumerMembershipProvider",
      "personalVaultRepositoryProvider",
    ],
    sample: "consumerPubspec",
    sourcePath: "packages/after_consumer",
  },
  {
    id: "after_enterprise",
    layer: "enterprise",
    dependsOn: ["after_core", "after_design_system", "after_ecosystem"],
    external: ["flutter_riverpod", "collection", "uuid"],
    apis: [
      "EnterpriseScope",
      "OrganizationRepository",
      "RbacRepository",
      "PermissionSet",
      "WorkflowEngine",
      "TaskRepository",
      "CalendarRepository",
      "DocumentRepository",
      "EnterpriseAiAssistant",
      "AuditLogRepository",
      "OfflineSyncQueue",
      "EnterpriseApiClient",
      "MockEnterpriseRepository",
      "EnterpriseProductRuntime",
    ],
    sample: "enterpriseComposition",
    sourcePath: "packages/after_enterprise",
  },
  {
    id: "after_firebase",
    layer: "firebase",
    dependsOn: ["after_core"],
    external: ["firebase_core", "firebase_auth", "cloud_firestore", "firebase_storage", "google_sign_in"],
    apis: [
      "AfterFirebaseBootstrap",
      "FirebaseAfterAuthRepository",
      "FirestoreAfterUserBlobSync",
      "FirebaseAfterUserMediaSync",
      "AfterFirebaseCloudAvailability",
    ],
    sample: "firebaseBootstrap",
    sourcePath: "packages/after_firebase",
  },
];

export const packageIds = packages.map((p) => p.id);

export function getPackage(id: string): FrameworkPackage | undefined {
  return packages.find((p) => p.id === id);
}

export function dependentsOf(id: PackageId): PackageId[] {
  return packages.filter((p) => p.dependsOn.includes(id)).map((p) => p.id);
}

/** Architecture layers, top to bottom, as described in docs/AFTER_OS_ARCHITECTURE.md. */
export const layers: { id: LayerId; packages: PackageId[]; row: number }[] = [
  { id: "product", packages: [], row: 0 },
  { id: "ecosystem", packages: ["after_ecosystem"], row: 1 },
  { id: "ai", packages: ["after_ai"], row: 1 },
  { id: "consumer", packages: ["after_consumer"], row: 2 },
  { id: "enterprise", packages: ["after_enterprise"], row: 2 },
  { id: "kernel", packages: ["after_core"], row: 3 },
  { id: "design", packages: ["after_design_system"], row: 3 },
  { id: "firebase", packages: ["after_firebase"], row: 4 },
];

export type ProductLine = "consumer" | "enterprise";
export type ProductStatus = "shipping" | "scaffold" | "planned";

export interface Product {
  id: string;
  name: string;
  line: ProductLine;
  role?: "os_shell";
  status: ProductStatus;
  reference?: boolean;
  icon: string;
  /** Only set where the product's pubspec was verified. */
  packages?: PackageId[];
  repo?: string;
}

/** From supercore/catalog/products.yaml (status as recorded there). */
export const products: Product[] = [
  {
    id: "supergarage",
    name: "SuperGarage",
    line: "consumer",
    status: "shipping",
    reference: true,
    icon: "garage",
    packages: ["after_core", "after_design_system", "after_firebase", "after_consumer"],
    repo: "https://github.com/oversteintech/supergarage",
  },
  {
    id: "afterhub",
    name: "AfterHub",
    line: "consumer",
    role: "os_shell",
    status: "scaffold",
    icon: "hub",
    packages: ["after_ai", "after_consumer", "after_core", "after_firebase", "after_design_system", "after_ecosystem"],
  },
  { id: "superhospital", name: "SuperHospital", line: "enterprise", status: "scaffold", reference: true, icon: "hospital" },
  { id: "superhealth", name: "SuperHealth", line: "consumer", status: "scaffold", icon: "health", repo: "https://github.com/oversteintech/superhealth" },
  { id: "superfinance", name: "SuperFinance", line: "consumer", status: "scaffold", icon: "finance" },
  { id: "superhome", name: "SuperHome", line: "consumer", status: "scaffold", icon: "home" },
  { id: "supertravel", name: "SuperTravel", line: "consumer", status: "scaffold", icon: "travel" },
  { id: "superpet", name: "SuperPet", line: "consumer", status: "scaffold", icon: "pet" },
  { id: "supernews", name: "SuperNews", line: "consumer", status: "scaffold", icon: "news", repo: "https://github.com/oversteintech/supernews" },
  { id: "supersports", name: "SuperSports", line: "consumer", status: "scaffold", icon: "sports", repo: "https://github.com/oversteintech/supersports" },
  { id: "superairport", name: "SuperAirport", line: "enterprise", status: "scaffold", icon: "airport" },
  { id: "supermaritime", name: "SuperMaritime", line: "enterprise", status: "scaffold", icon: "maritime" },
  { id: "superfactory", name: "SuperFactory", line: "enterprise", status: "scaffold", icon: "factory" },
  { id: "superfarm", name: "SuperFarm", line: "enterprise", status: "scaffold", icon: "farm" },
];

/**
 * Real SuperGarage store screenshots (supergarage/store/screenshots/phone), each tied
 * to identifiers that SuperGarage's lib/ actually imports.
 */
export const garageShots = [
  { id: "health", src: "/products/supergarage/08_garage_bmw_health.webp", platform: ["AfterUserPlan", "AfterLocalNotifications"], product: ["lib/features/dashboard", "lib/features/maintenance"] },
  { id: "ai", src: "/products/supergarage/01_ai_vehicle_advisor.webp", platform: ["AfterAiCredentialVault"], product: ["lib/features/assistant"] },
  { id: "obd", src: "/products/supergarage/14_live_obd_engine.webp", platform: [], product: ["lib/features/obd"] },
  { id: "spending", src: "/products/supergarage/16_vehicle_spending.webp", platform: ["FamilyShellHeader", "AfterRegionalLocation"], product: ["lib/features/expenses"] },
] as const;

export type GarageShotId = (typeof garageShots)[number]["id"];

/** Platform identifiers imported by supergarage/lib, grouped by owning package. */
export const garageCapabilities: { pkg: PackageId | "product"; items: string[] }[] = [
  { pkg: "after_core", items: ["AfterUserPlan", "AfterAiCredentialVault", "AfterLocalNotifications"] },
  { pkg: "after_consumer", items: ["FamilyShellHeader", "AfterRegionalLocation"] },
  { pkg: "after_firebase", items: ["AfterFirebaseBootstrap"] },
  { pkg: "product", items: ["vehicle", "maintenance", "obd", "expenses", "fleet", "trips", "assistant", "community"] },
];

/** Branding values from supercore/factory/specs/examples/*.product.spec.yaml. */
export const specBranding = [
  { name: "SuperGarage", accent: "#22D3EE", monogram: "SG", line: "consumer" },
  { name: "SuperKids", accent: "#F472B6", monogram: "SK", line: "consumer" },
  { name: "SuperHospital", accent: "#F43F5E", monogram: "SH", line: "enterprise" },
  { name: "SuperFactory", accent: "#F59E0B", monogram: "SF", line: "enterprise" },
] as const;

/** From packages/after_design_system/lib/src/foundations/*.dart */
export const designTokens = {
  colors: [
    { token: "AfterColors.accent", value: "#38BDF8" },
    { token: "AfterColors.accentDeep", value: "#0284C7" },
    { token: "AfterColors.graphite950", value: "#0B0C0F" },
    { token: "AfterColors.graphite800", value: "#222831" },
    { token: "AfterColors.steel", value: "#8A919D" },
    { token: "AfterColors.lightBackground", value: "#FAFBFC" },
    { token: "AfterColors.success", value: "#22C55E" },
    { token: "AfterColors.warning", value: "#F59E0B" },
    { token: "AfterColors.danger", value: "#EF4444" },
  ],
  spacing: [
    { token: "xs", value: 4 },
    { token: "sm", value: 8 },
    { token: "md", value: 12 },
    { token: "lg", value: 16 },
    { token: "xxl", value: 24 },
    { token: "xxxl", value: 32 },
    { token: "massive", value: 48 },
    { token: "hero", value: 64 },
  ],
  radius: [
    { token: "xs", value: 6 },
    { token: "sm · control", value: 8 },
    { token: "md · surface", value: 12 },
    { token: "lg · panel", value: 16 },
    { token: "xl · media", value: 20 },
  ],
  motion: [
    { token: "instant", value: 100 },
    { token: "fast · micro", value: 180 },
    { token: "normal · page", value: 280 },
    { token: "slow · modal", value: 420 },
    { token: "emphasis", value: 560 },
  ],
  /** AfterSpacing.contentMaxWidthFor breakpoints. */
  responsive: [
    { width: "< 360", max: "width", padding: "14 / 10 / 14 / 28" },
    { width: "360 – 419", max: "520", padding: "16 / 12 / 16 / 28" },
    { width: "420 – 719", max: "640", padding: "20 / 12 / 20 / 28" },
    { width: "≥ 720", max: "760", padding: "20 / 12 / 20 / 28" },
  ],
} as const;

export const components = [
  "buttons",
  "cards",
  "inputs",
  "navigation_bar",
  "dialogs",
  "charts",
  "dashboard",
  "empty_states",
  "loading",
  "settings_section",
  "shell_top_bar",
] as const;

/** ADRs cited on the site (supercore/docs/adr). */
export const adrs = {
  scope: { id: "ADR-002", file: "docs/adr/ADR-002-enterprise-scope.md" },
  interop: { id: "ADR-006", file: "docs/adr/ADR-006-secure-interop-only.md" },
  bootstrap: { id: "ADR-007", file: "docs/adr/ADR-007-bootstrap-mode.md" },
} as const;

/** Tooling that exists in supercore/scripts — there is no packaged CLI binary. */
export const tools = [
  { id: "validate", file: "scripts/validate_product_spec.ps1" },
  { id: "generate", file: "scripts/generate_product.ps1" },
  { id: "reuse", file: "scripts/check_reuse_contract.ps1" },
  { id: "signing", file: "scripts/wire_play_release_signing.ps1" },
] as const;

export const docsSources = {
  architecture: "docs/AFTER_OS_ARCHITECTURE.md",
  factory: "docs/PRODUCT_FACTORY.md",
  doctrine: "docs/PLATFORM_DOCTRINE.md",
  ecosystem: "docs/AFTER_ECOSYSTEM_PLATFORM.md",
  ai: "docs/AFTER_AI_PLATFORM.md",
  enterprise: "docs/ENTERPRISE_FRAMEWORK.md",
  standardApis: "STANDARD_APIS.md",
  checklist: "SUPER_APP_CHECKLIST.md",
  catalog: "catalog/products.yaml",
  schema: "factory/schema/product.spec.schema.json",
} as const;
