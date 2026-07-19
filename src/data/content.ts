export const site = {
  name: "After Framework",
  tagline: "Shared Super App OS",
  description:
    "After Framework is the shared platform (~70–80%) behind every AfterArtificial Super App — auth, networking, AI, premium, design system. Built by Overstein Labs.",
  url: "https://www.afterframework.com",
  email: "hello@overstein.com",
};

export const links = {
  afterArtificial: "https://www.afterartificial.com",
  overstein: "https://www.overstein.com",
  founder: "https://www.ayhanuzundal.com.tr",
  githubOrg: "https://github.com/oversteintech",
  githubFramework: "https://github.com/oversteintech/afterframework",
  superGarage: "https://www.afterartificial.com/#products",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Standard", href: "/standard" },
  { label: "Start", href: "/start" },
  { label: "Ecosystem", href: "/ecosystem" },
];

export const modules = [
  { id: "auth", label: "Identity & Auth" },
  { id: "http", label: "Hardened networking" },
  { id: "ai", label: "AI BYOK SDK" },
  { id: "premium", label: "Premium entitlements" },
  { id: "flags", label: "Feature flags" },
  { id: "config", label: "Remote config" },
  { id: "analytics", label: "Analytics" },
  { id: "push", label: "Notifications" },
  { id: "links", label: "Deep links" },
  { id: "storage", label: "Secure storage" },
  { id: "di", label: "Riverpod DI" },
  { id: "ui", label: "Design system" },
];

export const packages = [
  {
    name: "after_core",
    role: "Engine",
    description:
      "Auth ports, Dio HTTP, secure storage, Riverpod providers, analytics, flags, remote config, AI BYOK, notifications, deep links, premium entitlements, utilities.",
  },
  {
    name: "after_design_system",
    role: "UI",
    description:
      "Ice-on-graphite tokens, typography, spacing, motion, buttons, cards, dialogs, nav, inputs, charts, empty and loading states.",
  },
];

export const standardHighlights = [
  {
    title: "Composition root",
    body: "Each Super App wires After providers once — adapters for Firebase/store backends, not forks of platform code.",
  },
  {
    title: "70–80% shared",
    body: "New verticals are feature sets + brand manifest + product screens. Auth, AI, premium, and design language ship from the framework.",
  },
  {
    title: "Production gates",
    body: "HTTPS Dio policy, BYOK AI, server-verified entitlements, CI format/analyze/test — Platform Standard MUST rules.",
  },
];

export const startSteps = [
  {
    step: "01",
    title: "Depend on After packages",
    body: "Add after_core and after_design_system to the Super App pubspec (path or published source).",
  },
  {
    step: "02",
    title: "Set AppPlatformManifest",
    body: "Unique appId, package/bundle IDs, store flavors (play / dev / huawei).",
  },
  {
    step: "03",
    title: "Create composition root",
    body: "Mirror SuperGarage: AfterFramework.create*Overrides() + product adapters for auth, analytics, push, entitlements.",
  },
  {
    step: "04",
    title: "Ship vertical features only",
    body: "Business screens under lib/features/. Theme from AfterThemeData; accents via tokens.",
  },
];

export const ecosystem = [
  {
    name: "AfterArtificial",
    role: "Product company",
    url: links.afterArtificial,
    body: "Public AI product company for the Super ecosystem.",
  },
  {
    name: "After Framework",
    role: "Platform",
    url: site.url,
    body: "Shared Super App OS — this site.",
  },
  {
    name: "Overstein Labs",
    role: "Engineering",
    url: links.overstein,
    body: "Engineering brand that builds After Framework and reference apps.",
  },
  {
    name: "Ayhan Uzundal",
    role: "Founder",
    url: links.founder,
    body: "Founder of AfterArtificial · engineering via Overstein Labs.",
  },
];

export const stack = [
  "Flutter",
  "Dart",
  "Riverpod",
  "Dio",
  "Firebase",
  "BYOK AI",
  "Feature flags",
  "Remote Config",
];
