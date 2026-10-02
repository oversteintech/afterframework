/**
 * Code samples shown on the site. Each one is copied from, or reduced from,
 * the file named in `source` (paths relative to the supercore repository).
 */

export type CodeLang = "dart" | "yaml" | "powershell" | "json" | "text";

export interface CodeSample {
  lang: CodeLang;
  source: string;
  code: string;
}

export const codeSamples = {
  coreBootstrap: {
    lang: "dart",
    source: "packages/after_core/README.md",
    code: `import 'package:after_core/after_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();

  runApp(
    ProviderScope(
      overrides: [
        afterSharedPreferencesProvider.overrideWithValue(prefs),
        afterAuthRepositoryProvider.overrideWithValue(MyFirebaseAuthRepository()),
        afterAnalyticsProvider.overrideWithValue(MyFirebaseAnalytics()),
        // ... store-specific adapters
      ],
      child: const MySuperApp(),
    ),
  );
}`,
  },
  consumerComposition: {
    lang: "dart",
    source: "templates/super_app_consumer/after_framework.dart",
    code: `class SuperAppConsumerFramework {
  SuperAppConsumerFramework._();

  static Future<List<Override>> ensureConfigured() async {
    PlatformConfig.current = superAppConsumerManifest;
    final prefs = await SharedPreferences.getInstance();
    return AfterStandardOverrides.create(
      preferences: prefs,
      userAgent:
          '\${superAppConsumerManifest.appName}/\${superAppConsumerManifest.appId}',
    );
  }
}`,
  },
  enterpriseComposition: {
    lang: "dart",
    source: "templates/super_app_enterprise/after_framework.dart",
    code: `static Future<List<Override>> ensureConfigured({
  EnterpriseRepository? enterpriseRepository,
}) async {
  PlatformConfig.current = superAppEnterpriseManifest;
  final prefs = await SharedPreferences.getInstance();
  return [
    ...AfterStandardOverrides.create(
      preferences: prefs,
      userAgent: '\${superAppEnterpriseManifest.appName}/'
          '\${superAppEnterpriseManifest.appId}',
    ),
    enterpriseRepositoryProvider.overrideWithValue(
      enterpriseRepository ?? MockEnterpriseRepository(),
    ),
  ];
}`,
  },
  manifest: {
    lang: "dart",
    source: "docs/AFTER_OS_ARCHITECTURE.md",
    code: `const superHospitalManifest = AppPlatformManifest(
  appName: 'SuperHospital',
  appId: 'super_hospital',
  packageName: 'com.overstein.superhospital',
  androidWidgetProvider: 'com.overstein.superhospital.WidgetProvider',
  iosAppGroupId: 'group.com.overstein.superhospital',
  productLine: AfterProductLine.enterprise,
);`,
  },
  bootstrapMode: {
    lang: "dart",
    source: "packages/after_core/lib/src/bootstrap/after_bootstrap_mode.dart",
    code: `/// Composition safety mode (ADR-007).
///
/// - [scaffold]: in-memory / mock adapters are allowed (templates, tests).
/// - [production]: missing real adapters must throw at startup.
enum AfterBootstrapMode {
  scaffold,
  production,
}`,
  },
  aiProfile: {
    lang: "dart",
    source: "packages/after_ai/README.md",
    code: `// after_framework.dart
afterAiProfileProvider.overrideWithValue(AfterAiProfile.superGarage),

// feature code
final ai = ref.watch(afterAiPlatformProvider);
if (ai.canChat) {
  final reply = await ai.chat(message: input);
}`,
  },
  eventEnvelope: {
    lang: "json",
    source: "docs/AFTER_ECOSYSTEM_PLATFORM.md",
    code: `{
  "id": "evt_…",
  "type": "garage.maintenance.completed",
  "sourceProductId": "super_garage",
  "afterId": "aid_…",
  "organizationId": null,
  "occurredAt": "2026-07-19T20:00:00Z",
  "correlationId": "corr_…",
  "payload": { }
}`,
  },
  themeData: {
    lang: "dart",
    source: "packages/after_design_system/lib/src/foundations/theme.dart",
    code: `abstract final class AfterThemeData {
  static ThemeData light({
    AfterTypography typography = AfterTypography.garage,
    Color? accentOverride,
  }) { … }

  static ThemeData dark({
    AfterTypography typography = AfterTypography.garage,
    Color? accentOverride,
  }) { … }
}

// Product: same family, own accent (spec branding.accent).
MaterialApp(
  theme: AfterThemeData.light(accentOverride: const Color(0xFF22D3EE)),
  darkTheme: AfterThemeData.dark(accentOverride: const Color(0xFF22D3EE)),
);`,
  },
  consumerPubspec: {
    lang: "yaml",
    source: "README.md",
    code: `dependencies:
  after_core:
    path: ../supercore/packages/after_core
  after_consumer:
    path: ../supercore/packages/after_consumer
  after_design_system:
    path: ../supercore/packages/after_design_system`,
  },
  enterprisePubspec: {
    lang: "yaml",
    source: "README.md",
    code: `dependencies:
  after_core:
    path: ../supercore/packages/after_core
  after_enterprise:
    path: ../supercore/packages/after_enterprise
  after_design_system:
    path: ../supercore/packages/after_design_system`,
  },
  firebaseBootstrap: {
    lang: "dart",
    source: "packages/after_firebase/lib/src/after_firebase_bootstrap.dart",
    code: `// Cold start, before ProviderScope. Returns false (no crash) when
// options are null or init fails — auth falls back to prefs adapters.
await AfterFirebaseBootstrap.ensureInitialized(options: firebaseOptions);

final overrides = [
  ...AfterStandardOverrides.create(
    preferences: prefs,
    userAgent: userAgent,
    includeUserBlobSync: false, // Firebase provides blob sync below
  ),
  ...AfterFirebaseBootstrap.overrides(
    preferences: prefs,
    appId: 'super_garage',
  ),
];`,
  },
  enterpriseScope: {
    lang: "dart",
    source: "packages/after_enterprise/lib/src/scope/enterprise_scope.dart",
    code: `/// Fail-closed tenant + actor context for enterprise ports (ADR-002).
class EnterpriseScope {
  final String organizationId;
  final String actorId;
  final PermissionSet permissions;

  /// Throws if [organizationId] is missing/blank — never allow all-tenant lists.
  static String requireOrganizationId(String? organizationId) {
    final id = organizationId?.trim() ?? '';
    if (id.isEmpty) {
      throw StateError(
        'EnterpriseScope: organizationId is required (fail-closed tenancy).',
      );
    }
    return id;
  }
}`,
  },
  productSpec: {
    lang: "yaml",
    source: "docs/PRODUCT_FACTORY.md",
    code: `apiVersion: after.ai/v1
kind: SuperApp

metadata:
  name: SuperAirport              # PascalCase, must start with a capital
  package: super_airport          # snake_case pubspec name
  bundle: com.overstein.superairport
  productLine: enterprise         # consumer | enterprise

spec:
  domain: Airport / aviation operations
  reference: SuperHospital        # SuperGarage | SuperHospital

  features:                       # VERTICAL ONLY. No OS modules here.
    - id: flights
      titleKey: features.flights
      icon: flight_takeoff_outlined
      requiredPermission: airport.flights.read

  navigation:
    tabs:                         # 2–6 tabs, matching family shell
      - id: home
        labelKey: nav.home
      - id: flights
        labelKey: nav.flights
        feature: flights
      - id: tasks
        module: tasks             # inherited OS module — no code emitted

  permissions:
    - airport.flights.read
    - airport.gates.write

  branding:
    accent: "#0EA5E9"
    monogram: SA`,
  },
  validate: {
    lang: "powershell",
    source: "factory/README.md",
    code: `powershell -File scripts\\validate_product_spec.ps1 -SpecPath factory\\specs\\examples\\super_airport.product.spec.yaml`,
  },
  generate: {
    lang: "powershell",
    source: "factory/README.md",
    code: `# From a spec
powershell -File scripts\\generate_product.ps1 -SpecPath factory\\specs\\examples\\super_airport.product.spec.yaml

# From a name only (quick starter)
powershell -File scripts\\generate_product.ps1 -Name SuperAirport -Reference SuperHospital

# Preview without writing files
powershell -File scripts\\generate_product.ps1 -SpecPath factory\\specs\\examples\\super_airport.product.spec.yaml -DryRun`,
  },
  afterGenerate: {
    lang: "powershell",
    source: "scripts/generate_product.ps1",
    code: `cd ..\\superairport
flutter create .
flutter pub get
flutter analyze
flutter test`,
  },
  testing: {
    lang: "powershell",
    source: "scripts/generate_product.ps1 · docs/PLATFORM_DOCTRINE.md",
    code: `dart format --output=none --set-exit-if-changed .
flutter analyze
flutter test --coverage

# Platform doctrine check against a generated product
powershell -File scripts\\check_reuse_contract.ps1 -AppRoot ..\\superairport`,
  },
  packageTests: {
    lang: "powershell",
    source: "README.md",
    code: `cd packages/after_core && flutter pub get && flutter test
cd packages/after_design_system && flutter pub get && flutter test
cd packages/after_consumer && flutter pub get && flutter test
cd packages/after_enterprise && flutter pub get && flutter test`,
  },
  ciWorkflow: {
    lang: "yaml",
    source: "scripts/generate_product.ps1 (.github/workflows/ci.yml)",
    code: `name: analyze-and-test
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  analyze-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Checkout supercore (sibling)
        uses: actions/checkout@v5
        with:
          repository: oversteintech/supercore
          path: ../supercore
      - uses: subosito/flutter-action@v2
        with:
          channel: stable
      - run: dart format --output=none --set-exit-if-changed .
      - run: flutter pub get
      - run: flutter analyze
      - run: flutter test --coverage`,
  },
  signing: {
    lang: "powershell",
    source: "scripts/wire_play_release_signing.ps1",
    code: `# Wires Play release signing for sibling apps; -BuildAab also builds bundles.
# key.properties / *.jks stay local and gitignored.
powershell -File scripts\\wire_play_release_signing.ps1 -BuildAab`,
  },
  appShape: {
    lang: "text",
    source: "docs/PLATFORM_DOCTRINE.md",
    code: `main.dart
  → PlatformConfig.current = manifest
  → ProviderScope(overrides: After*Overrides…)
  → ColdStart (OVERSTEIN splash)
       → AuthGate
            → ProductShell (tabs from platform + spec)
                 → Home = Dashboard Engine (+ plugins)
                 → OS modules = platform screens
                 → Vertical = product feature modules only`,
  },
  siblingLayout: {
    lang: "text",
    source: "README.md",
    code: `HANTURAI/
  supercore/
  supergarage/         # consumer reference
  superhospital/       # enterprise reference
  superhealth/  superfinance/  superhome/  supertravel/  supersports/ …`,
  },
} satisfies Record<string, CodeSample>;

export type CodeSampleId = keyof typeof codeSamples;
