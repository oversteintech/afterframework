# oversteintech — repo map & gaps

Last audit: 2026-07-19

## Live sites (Vercel · team `overstein`)

| Domain | Vercel project | GitHub | Status |
|--------|----------------|--------|--------|
| afterframework.com | `afterframework` | `oversteintech/afterframework` | ✅ Live |
| afterartificial.com | `afterartificial-web` | `oversteintech/afterartificial-web` (private) | ✅ Live |
| overstein.com | `overstein-web` | `oversteintech/overstein-web` (private) | ✅ Live |
| ayhanuzundal.com.tr | `ayhan-portfolio` | local → `auzundal/ayhan-portfolio`; org copy stale | ⚠️ Sync needed |

## Public GitHub (`oversteintech`)

| Repo | Content | Gap |
|------|---------|-----|
| **afterframework** | Next.js docs site | ✅ Seeded & deployed |
| **supercore** | Empty → README scaffold | Extract `after_*` packages from SuperGarage |
| **superhealth** | Only `.gitignore` → README scaffold | Flutter Super App shell when ready |
| **ayhan-portfolio** | Old static HTML (Jul 3) | Replace with Next.js from local `ayhan-portfolio` |

## Private (exist via local remotes; not public API)

| Repo | Local | Notes |
|------|-------|-------|
| **supergarage** | `D:\Projects\HANTURAI\supergarage` | Flagship + `packages/after_core` + `after_design_system` |
| **overstein-web** | `C:\Users\a00929216\Projects\overstein-web` | Brand updates pending push |
| **afterartificial-web** | `C:\Users\a00929216\Projects\afterartificial-web` | Brand updates pending push |

## Missing repos (recommended)

| Repo | Purpose |
|------|---------|
| `superfinance` | Future Super App placeholder |
| `after-design-system` | Optional split if not using monolithic `supercore` |
| `platform-standard` | Or keep docs only on afterframework.com + SuperGarage `/docs` |

## Standardization before new apps

1. ✅ afterframework.com live + linked in ecosystem
2. ⬜ Push brand updates for overstein / afterartificial / ayhan Next sites
3. ⬜ Populate `supercore` from SuperGarage packages (single source of truth)
4. ⬜ SuperGarage consumes `supercore` (path or git dep)
5. ⬜ SuperHealth scaffold from Platform Standard checklist
6. ⬜ Sync `oversteintech/ayhan-portfolio` with Next.js portfolio
7. ⬜ Retire/redirect Vercel `after-artificial` duplicate if unused

## Brand hierarchy

```
Ayhan Uzundal
  └── AfterArtificial          afterartificial.com
        └── Super* Apps
              └── After Framework   afterframework.com
                    └── Overstein Labs   overstein.com
```
