# OLManager Roadmap

> Open League Manager ÔÇö Manager de Esports para League of Legends

[![Discord](https://img.shields.io/discord/placeholder?label=Discord&style=social)](https://discord.gg placeholder)
[![GitHub Stars](https://img.shields.io/github/stars/placeholder?label=Stars&style=social)](https://github.com/placeholder)

## Visi├│n General

OLManager es un manager de esports para League of Legends dise├▒ado para simular la gesti├│n de equipos en competencias profesionales tipo LEC (League of Legends European Championship). El proyecto transita desde su origen en f├║tbol (OpenFootManager) hacia un sistema completo de gesti├│n de equipos de esports.

**Objetivo estrat├®gico:** Construir una plataforma modular y extensible que permita a los usuarios gestionar equipos, jugadores, presupuestos, estrategias de juego y estad├¡sticas en un entorno de simulaci├│n realista.

---

## Estado Actual

| M├®trica | Valor |
|--------|-------|
| **Versi├│n** | 0.1.1 (pre-alpha) |
| **Stack** | React 19 + TypeScript 6.0 + Vite 8 + TailwindCSS 4 + Tauri v2 (Rust) |
| **DB** | SQLite (27 migraciones) |
| **Test Files** | 106 frontend + 21 backend Rust |
| **i18n** | 7 idiomas configurados |
| **Commits** | Conventional commits |

### Deuda T├®cnica Identificada

- ÔÜá´©Å Herencia de nombres/estructuras del proyecto original de f├║tbol
- ÔÜá´©Å Documentaci├│n legacy en `docs/legacy/inherited-docs/`
- ÔÜá´©Å 2 TODOs pendientes en `lol_sim_v2.rs` (sistema de movimiento)
- ÔÜá´©Å Tests de Rust marcados como "experimental" en CI

---

## Fases del Roadmap

### Fase 1: Limpieza y Foundation ÔÇö Corto Plazo (v0.2 Alpha)

**Objetivo:** Eliminar la deuda t├®cnica de la transici├│n f├║tbolÔåÆLoL y establecer las bases para desarrollo estable.

**Prioridad:** ­ƒö┤ Alta

#### ­ƒÄ» Hitos

- [ ] Ô£à ~~Completar auditor├¡a de documentaci├│n heredada~~ (existe: `INHERITED_DOCS_AUDIT.md`)
- [ ] ­ƒö▓ Finalizar limpieza de nombres y estructuras de f├║tbol
- [ ] ­ƒö▓ Documentar Provenance de datos heredados (`DATA_PROVENANCE.md` completo)
- [ ] ­ƒö▓ Eliminar TODOs pendientes en `lol_sim_v2.rs`
- [ ] ­ƒö▓ Establecer CI estable (resolver tests "experimentales")

#### ­ƒôï Tareas

- [ ] Renombrar tipos domain de "Player/Team/Football" a terminolog├¡a LoL
- [ ] Actualizar migraciones SQLite con prefijos o limpieza
- [ ] Revisar `docs/legacy/inherited-docs/` y marcar lo obsoleto
- [ ] Completar puerto de sistema de movimiento en lol_sim_v2.rs
- [ ] Habilitar `cargo clippy` y `cargo test` en CI principal
- [ ] Crear documento de migraci├│n de datos (f├║tbol ÔåÆ LoL)
- [ ] **Migraci├│n de identidad**: `football_nation` ÔåÆ `nationality_code` + `competitive_region`
  - [ ] Crear migraci├│n SQL v028 (RENAME COLUMN + nuevo campo competitive_region)
  - [ ] Actualizar tipos Rust (`Player`, `Team`, `Manager`, `Staff`)
  - [ ] Actualizar frontend (tipos TypeScript, componentes UI)
  - [ ] Actualizar scripts de generaci├│n (`generate-lec-world.mjs`)

#### M├®tricas de ├ëxito

- Ô£à 0 TODOs activos en c├│digo de producci├│n
- Ô£à 100% coverage en CI (no m├ís "experimental")
- Ô£à Documentaci├│n heredada auditada y categorizada

---

### Fase 2: Estabilizaci├│n y Features Core ÔÇö Mediano Plazo (v0.3 Beta)

**Objetivo:** Implementar funcionalidades core del manager y estabilizar el producto para uso interno.

**Prioridad:** ­ƒƒí Media

#### ­ƒÄ» Hitos

- [ ] ­ƒö▓ Sistema de roster/plantel completo (contratar/despedir jugadores)
- [ ] ­ƒö▓ Simulaci├│n de partidos funcional (m├ís all├í de LoL-sim v2)
- [ ] ­ƒö▓ Sistema de finanzas (presupuesto, salarios, patrocinadores)
- [ ] ­ƒö▓ Dashboard de estad├¡sticas del equipo
- [ ] ­ƒö▓ Primera release beta (v0.3.0-beta)

#### ­ƒôï Tareas

- [ ] Implementar modelo de jugador con stats LoL (KDA, rol, divisi├│n)
- [ ] Crear sistema de contratos y salarios
- [ ] Desarrollar motor de simulaci├│n de partidos
- [ ] Implementar sistema de calendario de temporadas
- [ ] A├▒adir visualizaci├│n de estad├¡sticas en tiempo real
- [ ] Configurar logging estructurado para debugging
- [ ] Documentar API de comandos Tauri

#### M├®tricas de ├ëxito

- Ô£à Usuario puede crear equipo, gestionar roster y simular partido
- Ô£à Sistema de finances funcional (presupuesto > 0 despu├®s de gastos)
- Ô£à Release beta publicada ytaggeada

---

### Fase 3: Ecosistema y Comunidad ÔÇö Largo Plazo (v1.0 Stable)

**Objetivo:** Construir ecosistema completo, abrir a comunidad y alcanzar estabilidad de producci├│n.

**Prioridad:** ­ƒƒó Baja

#### ­ƒÄ» Hitos

- [ ] ­ƒö▓ Sistema de scouting (buscar jugadores en el mercado)
- [ ] ­ƒö▓ Competiciones y rankings (simular temporadas LEC-style)
- [ ] ­ƒö▓ Modo multijugador b├ísico (comparte equipos)
- [ ] ­ƒö▓ Documentaci├│n completa para contribuyentes
- [ ] ­ƒö▓ Primera release estable (v1.0.0)
- [ ] ­ƒö▓ Publicaci├│n OSS (anuncio oficial)

#### ­ƒôï Tareas

- [ ] Implementar mercado de transferencias
- [ ] Crear sistema de ligas/torneos con estad├¡sticas
- [ ] A├▒adir modexpansions (otras regiones: LCK, LCS, LPL)
- [ ] Desarrollar API REST p├║blica (opcional)
- [ ] Configurar containerizaci├│n (Docker)
- [ ] Setup CI/CD completo con releases autom├íticas
- [ ] Escribir CONTRIBUTING.md
- [ ] Audit de seguridad y hardening

#### M├®tricas de ├ëxito

- Ô£à Comunidad puede contribuir siguiendo flow issue-first
- Ô£à v1.0.0 publicada con changelog completo
- Ô£à docs/ actualizada para usuarios y desarrolladores

---

## Proceso de Trabajo

### Flujo Issue-First

Siguiendo [`GOVERNANCE.md`](docs/GOVERNANCE.md), el desarrollo sigue este flujo:

```
1. Abrir issue con template ÔåÆ 2. Review de maintainer ÔåÆ 3. Apply label status:approved
4. Crear branch desde development ÔåÆ 5. Abrir PR con type:* label ÔåÆ 6. Merge a development
```

### Labels Utilizados

| Categor├¡a | Labels |
|-----------|--------|
| **Status** | `status:needs-review`, `status:approved` |
| **Type** | `type:feature`, `type:bug`, `type:docs`, `type:chore`, `type:refactor`, `type:test`, `type:release` |

### Ramas

- `main` ÔÇö Estable, solo releases
- `development` ÔÇö Integraci├│n (default para PRs)
- `type/slug` ÔÇö Ramas de feature/fix/docs/chore

---

## M├®tricas de Progreso

### KPIs por Fase

| Fase | KPI Principal | KPI Secundario |
|------|---------------|----------------|
| **Fase 1** | TODOs remaining: 0 | CI tests: 100% pass |
| **Fase 2** | Features core: 5 | Beta users: N/A |
| **Fase 3** | v1.0.0 released | OSS launch: done |

### Badges de Progreso

```markdown
[![Version](https://img.shields.io/badge/version-0.1.1-blue)](ROADMAP.md)
[![Phase](https://img.shields.io/badge/phase-1-green)](ROADMAP.md)
[![CI Status](https://img.shields.io/github/checks-status/placeholder/development)](actions)
```

---

## C├│mo Seguir el Progreso

- **Roadmap (este archivo)** ÔÇö Estado general y fases
- **GitHub Issues** ÔÇö Tareas individuales con labels
- **GitHub Project Board** ÔÇö Vista kanban del desarrollo
- **GitHub Releases** ÔÇö Changelogs y downloads
- **Discussions** ÔÇö Q&A y feedback comunitario

---

## C├│mo Contribuir

┬íTodas las contribuciones son bienvenidas! Para contribuir:

1. **Revisa issues abiertos** ÔÇö Busca `status:approved` para trabajo confirmado
2. **Abre un issue** ÔÇö Usa el template para bugs o features
3. **Espera approval** ÔÇö Un maintainer revisar├í y aplicar├í `status:approved`
4. **Crea tu branch** ÔÇö Desde `development` con formato `type/slug`
5. **Abre PR** ÔÇö Linkea el issue, a├▒ade un `type:*` label
6. **Pasa CI** ÔÇö Ensure `frontend-install` y `rust-check` pasan

### Requisitos de PR

- [ ] Branch desde `development`
- [ ] Issue linkeado con label `status:approved`
- [ ] Exactly uno `type:*` label
- [ ] Commits conventional
- [ ] Checks: `frontend-install` + `rust-check`

### Configuraci├│n Local

```bash
# Frontend
npm install
npm run dev

# Backend (Rust)
cargo build --workspace
cargo test --workspace

#full CI (experimental)
npm run test
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

---

## Historial de Versiones

| Versi├│n | Fecha | Notas |
|---------|-------|-------|
| 0.1.1 | 2026-04-28 | Pre-alpha actual |
| 0.2.0-alpha | ÔÅ│ Pendiente | Alpha con deuda t├®cnica resuelta |
| 0.3.0-beta | ÔÅ│ Pendiente | Beta con features core |
| 1.0.0 | ÔÅ│ Pendiente | Primera stable |

---

*├Ültima actualizaci├│n: 2026-04-28 ÔÇö Generado desde an├ílisis SDD*
