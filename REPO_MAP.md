# oversteintech — repo map (ready for Super Apps)

Last update: 2026-07-19

## Brand stack

```
Ayhan Uzundal          → ayhanuzundal.com.tr
  └── AfterArtificial  → afterartificial.com
        └── Super* Apps
              └── After Framework  → afterframework.com
                    └── packages   → github.com/oversteintech/supercore
                          └── Built by Overstein Labs → overstein.com
```

## Live sites (Vercel)

| Domain | Project | Repo |
|--------|---------|------|
| afterframework.com | afterframework | oversteintech/afterframework |
| afterartificial.com | afterartificial-web | oversteintech/afterartificial-web |
| overstein.com | overstein-web | oversteintech/overstein-web |
| ayhanuzundal.com.tr | ayhan-portfolio | oversteintech/ayhan-portfolio |

## Flutter / packages

| Repo | Role | Status |
|------|------|--------|
| **supercore** | `after_core` + `after_design_system` | ✅ Source of truth |
| **supergarage** | Flagship Super App | ✅ Consumes `../supercore` |
| **superhealth** | Next Super App scaffold | ✅ Composition root + smoke tests |

## Local workspace layout

```text
HANTURAI/
  supercore/
  supergarage/
  superhealth/
```

## Next Super Apps

1. Clone `supercore` as sibling
2. `flutter create` + depend on `../supercore/packages/*`
3. Copy composition pattern from SuperHealth / SuperGarage
4. Follow [SUPER_APP_CHECKLIST](https://github.com/oversteintech/supercore/blob/main/SUPER_APP_CHECKLIST.md)
