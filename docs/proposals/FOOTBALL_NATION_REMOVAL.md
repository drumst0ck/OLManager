# Plan: Eliminar `football_nation` de domain types y activar V39

**Issue:** #85 (Database Defutbolization)  
**Branch:** `feat/85-remove-football-nation`  
**Migración:** V39 (deshabilitada — SQL listo en `sql/v039_drop_football_nation.sql`)

---

## Contexto

El campo `football_nation` es un legacy de la migración desde OpenFootManager (fútbol → LoL). Fue reemplazado por `nationality_code` + `competitive_region` pero nunca se eliminó de las tablas ni de los tipos domain.

Eliminarlo requiere un refactor coordenado en **3 capas**: domain types, repositorios DB, y código de orquestación.

---

## Plan de Ejecución

### Paso 1: Domain Types (4 archivos)

Eliminar el campo `football_nation: String` de:

| Archivo | Campo a eliminar |
|---------|-----------------|
| `domain/src/player.rs` | L11: `pub football_nation: String` |
| `domain/src/team.rs` | L10: `pub football_nation: String` |
| `domain/src/manager.rs` | L21: `pub football_nation: String` |
| `domain/src/staff.rs` | L11: `pub football_nation: String` |

En cada archivo también eliminar:
- La inicialización en `new()` / constructor
- El `let football_nation = normalize(...)` si existe
- Actualizar el struct literal

**Verificación:** `cargo build -p domain` debe compilar.

---

### Paso 2: Identity Upgrade (1 archivo)

`ofm_core/src/identity_upgrade.rs` es el módulo que normalizaba `football_nation` a partir de `nationality`. Con el campo eliminado, este módulo debe:

1. Eliminar todas las referencias a `football_nation`
2. Mantener solo la lógica de `birth_country` (sigue siendo relevante)
3. Simplificar `build_team_nation_map` para no depender de `football_nation`

**Verificación:** `cargo build -p ofm_core` debe compilar.

---

### Paso 3: DB Repositories (4 archivos)

Eliminar `football_nation` de todos los INSERT/SELECT/params en:

| Archivo | Lo que debe cambiar |
|---------|-------------------|
| `db/src/repositories/player_repo.rs` | INSERT columns, VALUES count (?33→?32), params, SELECT, row parser |
| `db/src/repositories/team_repo.rs` | INSERT columns, params, SELECT, row parser |
| `db/src/repositories/manager_repo.rs` | INSERT columns, VALUES count (?16→?15), params, SELECT |
| `db/src/repositories/staff_repo.rs` | INSERT columns, params, SELECT, row parser |

**Regla:** Cada cambio en INSERT requiere:
1. Eliminar `football_nation` de la lista de columnas
2. Eliminar el `?N` correspondiente de VALUES
3. Eliminar `x.football_nation` del array params![...]

Cada cambio en SELECT requiere:
1. Eliminar `football_nation` de la lista de columnas
2. Eliminar `football_nation: row.get(N)?,` del struct parser

**Verificación:** `cargo build -p db` debe compilar.

---

### Paso 4: Tests y World Export (4 archivos)

Eliminar referencias a `football_nation` en tests:

| Archivo | Cambios |
|---------|---------|
| `db/src/save_manager.rs` | Test `test_identity_upgrade_*`: eliminar `.football_nation.clear()` y asserts |
| `db/src/repositories/player_repo.rs` | Tests: eliminar `player.football_nation = "ENG"` y asserts |
| `db/src/repositories/team_repo.rs` | Tests: eliminar asserts |
| `db/src/repositories/staff_repo.rs` | Tests: eliminar `staff.football_nation = "SCO"` y asserts |
| `db/src/repositories/manager_repo.rs` | Tests: eliminar `assert_eq!(loaded.football_nation, "GB")` |
| `db/tests/academy_team_persistence.rs` | Test SQL INSERT: eliminar `football_nation` de columnas |
| `ofm_core/src/generator/world_io.rs` | Tests: eliminar `world.teams[0].football_nation.clear()` y asserts |
| `src/commands/world.rs` | Tests: eliminar `.football_nation.clear()` y asserts |

**Verificación:** `cargo test -p domain -p db -p ofm_core` debe pasar.

---

### Paso 5: Activar V39

1. En `migrations.rs`:
   - Cambiar `// V39: (reserved — remove football_nation from tables)` a `M::up_with_hook("SELECT 1;", migrate_drop_football_nation),`
   - Incrementar `MIGRATION_COUNT` de 40 a 41

2. La función hook `migrate_drop_football_nation` ya existe en `migrations.rs`
   (agrega columnas faltantes + ejecuta `v039_drop_football_nation.sql`)

**Verificación:** `cargo test -p db` debe pasar (123 tests, V39 crea las tablas sin football_nation).

---

### Paso 6: Cleanup de identity.rs

`domain/src/identity.rs` contiene `normalize_football_nation_code()` que ya no se usa desde domain types. Se puede mantener como utilidad o eliminar si nada más la referencia.

**Verificación:** `cargo build --workspace` sin warnings de unused functions.

---

## Orden de commits sugerido

```
1. feat(domain): remove football_nation field from Player, Team, Manager, Staff
2. feat(core): simplify identity_upgrade.rs without football_nation
3. feat(db): remove football_nation from repository INSERT/SELECT
4. fix(tests): update test assertions without football_nation
5. feat(db): enable V39 migration to drop football_nation column
6. chore(domain): cleanup unused normalize_football_nation_code
```

## Tiempo estimado

| Paso | Archivos | Esfuerzo |
|------|----------|----------|
| 1. Domain types | 4 | 15 min |
| 2. Identity upgrade | 1 | 10 min |
| 3. DB repositories | 4 | 30 min |
| 4. Tests | 8 | 20 min |
| 5. Activar V39 | 1 | 5 min |
| 6. Cleanup | 1 | 5 min |
| **Total** | **19** | **~1.5 horas** |
