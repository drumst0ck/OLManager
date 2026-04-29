# Data Migration Plan: Football ÔåÆ LoL

> **Estado**: En progreso | **├Ültima actualizaci├│n**: 2026-04-28 | **Responsable**: SDD Architecture

## Resumen Ejecutivo

El proyecto OLManager hered├│ una base de c├│digo de f├║tbol (futbol) y est├í en proceso de migraci├│n hacia League of Legends (LoL). Esta migraci├│n implica renombrar campos, modificar tipos Rust, actualizar esquemas de base de datos y reescribir scripts de generaci├│n de datos.

### Estado actual de la migraci├│n

| Componente | Estado | Notas |
|------------|--------|-------|
| Stats de partido (v020) | Ô£à Hecho | Mapeo `goals` ÔåÆ `kills`, `shots` ÔåÆ `creep_score` |
| Tablas puras LoL (v021) | Ô£à Hecho | `lol_player_match_stats`, `lol_team_match_stats` |
| `football_nation` (v014) | ­ƒö▓ Pendiente | Necesita renombrarse a `region` |
| Position enum ÔåÆ Role | ­ƒö▓ Pendiente | Requiere nuevo enum y migraci├│n de datos |
| Stadium ÔåÆ Arena | ­ƒö▓ Pendiente | Requiere nuevo campo `arena_name` |
| Formation ÔåÆ Composici├│n | ­ƒö▓ Pendiente | Requiere an├ílisis de formato |
| PlayStyle ÔåÆ DraftStrategy | ­ƒö▓ Pendiente | Requiere nuevo enum |

### Objetivo del documento

Proporcionar un plan accionable para que cualquier desarrollador pueda ejecutar la migraci├│n de datos de f├║tbol a LoL de forma sistem├ítica y sin perder informaci├│n existente.

---

## Inventario de Datos

### Base de Datos (SQLite)

Las migraciones de base de datos se encuentran en `src-tauri/crates/db/src/sql/`.

#### Esquema actual (v001)

```sql
-- managers
id, first_name, last_name, date_of_birth, nationality, reputation, satisfaction, fan_approval, team_id, career_stats, career_history

-- teams
id, name, short_name, country, city, stadium_name, stadium_capacity, finance, manager_id, reputation, wage_budget, transfer_budget, season_income, season_expenses, formation, play_style, training_focus, ...

-- players
id, match_name, full_name, date_of_birth, nationality, position, attributes, condition, morale, injury, team_id, traits, ...

-- staff
id, first_name, last_name, date_of_birth, nationality, role, attributes, team_id, specialization, ...
```

#### Migraciones aplicadas

| Migraci├│n | Fecha | Descripci├│n | Estado |
|-----------|-------|-------------|--------|
| v014 | - | Agrega `football_nation`, `birth_country` a managers, teams, players, staff | ÔÜá´©Å Migraci├│n con campos a renombrar |
| v020 | - | Agrega columnas LoL a `player_match_stats` (`kills`, `deaths`, `creep_score`, etc.) y mapea datos existentes | Ô£à Hecho |
| v021 | - | Crea tablas `lol_player_match_stats` y `lol_team_match_stats` con datos migrados | Ô£à Hecho |
| v022-v027 | - | Otras migraciones (potential, scrims, etc.) | Sin cambios relevantes para migraci├│n |

### Tipos Rust (domain crate)

Los tipos de dominio se encuentran en `src-tauri/crates/domain/src/`.

#### Estructuras que necesitan actualizaci├│n

| Archivo | Estructura | Campos a migrar |
|---------|------------|-----------------|
| `player.rs` | `Player` | `football_nation` ÔåÆ `region`, `Position` enum ÔåÆ `Role` enum |
| `team.rs` | `Team` | `football_nation` ÔåÆ `region`, `stadium_name` ÔåÆ `arena_name`, `formation` ÔåÆ team composition |
| `manager.rs` | `Manager` | `football_nation` ÔåÆ `region` |
| `staff.rs` | `Staff` | `football_nation` ÔåÆ `region` |

#### Enums a actualizar

```rust
// player.rs - Position actual
pub enum Position {
    Goalkeeper,
    Defender,
    Midfielder,
    Forward,
    RightBack,
    CenterBack,
    LeftBack,
    RightWingBack,
    LeftWingBack,
    DefensiveMidfielder,
    CentralMidfielder,
    AttackingMidfielder,
    RightMidfielder,
    LeftMidfielder,
    RightWinger,
    LeftWinger,
    Striker,
}

// team.rs - PlayStyle actual
pub enum PlayStyle {
    Balanced,
    Attacking,
    Defensive,
    Possession,
    Counter,
    HighPress,
}
```

### Datos JSON/Externos

#### Archivos de datos

| Archivo | Descripci├│n | Uso actual |
|---------|-------------|------------|
| `data/lec/seed.teams-players.json` | Equipos y jugadores LEC | Generaci├│n de mundo inicial |
| `data/lec/draft/players.json` | Datos crudos de jugadores | Generaci├│n avanzada |
| `data/lec/draft/teams.json` | Datos crudos de equipos | Generaci├│n avanzada |
| `data/lec/draft/champions.json` | Lista de campeones | Simulaci├│n |
| `src-tauri/data/default_teams.json` | Equipos por defecto | Inicializaci├│n |
| `src-tauri/data/default_names.json` | Nombres por defecto | Generaci├│n |

#### Scripts de generaci├│n

| Script | Descripci├│n | Estado |
|--------|-------------|--------|
| `scripts/generate-lec-world.mjs` | Genera mundo LEC con mapeo de roles | Usa mapeo antiguo (TopÔåÆDefender, etc.) |
| `scripts/fetch-leaguepedia-dobs.mjs` | Busca fechas de nacimiento | Dependiente de fuente externa |
| `scripts/ml/tune-lol-thresholds.mjs` | Ajusta umbrales de simulaci├│n | Listo para LoL |

---

## Mapeo de Campos

### Tabla de mapeo completa

| Entidad | Campo Actual | Campo Destino | Tipo Actual | Tipo Destino | Estado | Migraci├│n SQL |
|---------|--------------|---------------|-------------|--------------|--------|---------------|
| players | `football_nation` | `region` | TEXT | TEXT | ­ƒö▓ Pendiente | v028 |
| teams | `football_nation` | `region` | TEXT | TEXT | ­ƒö▓ Pendiente | v028 |
| managers | `football_nation` | `region` | TEXT | TEXT | ­ƒö▓ Pendiente | v028 |
| staff | `football_nation` | `region` | TEXT | TEXT | ­ƒö▓ Pendiente | v028 |
| players | `Position` enum | `Role` enum | enum | enum | ­ƒö▓ Pendiente | C├│digo |
| teams | `stadium_name` | `arena_name` | TEXT | TEXT | ­ƒö▓ Pendiente | v029 |
| teams | `stadium_capacity` | `arena_capacity` | INTEGER | INTEGER | ­ƒö▓ Pendiente | v029 |
| teams | `formation` | `team_composition` | STRING | STRING | ­ƒö▓ Pendiente | C├│digo |
| teams | `play_style` | `draft_strategy` | enum | enum | ­ƒö▓ Pendiente | C├│digo |
| player_match_stats | `goals` ÔåÆ `kills` | ÔÇö | INTEGER | INTEGER | Ô£à Hecho | v020 |
| player_match_stats | `shots` ÔåÆ `creep_score` | ÔÇö | INTEGER | INTEGER | Ô£à Hecho | v020 |
| player_match_stats | `shots_on_target` ÔåÆ `deaths` | ÔÇö | INTEGER | INTEGER | Ô£à Hecho | v020 |
| player_match_stats | `passes_completed` ÔåÆ `vision_score` | ÔÇö | INTEGER | INTEGER | Ô£à Hecho | v020 |
| player_match_stats | `passes_attempted` ÔåÆ `wards_placed` | ÔÇö | INTEGER | INTEGER | Ô£à Hecho | v020 |

### Mapeo de Posiciones de F├║tbol a Roles LoL

El script `scripts/generate-lec-world.mjs` ya tiene un mapeo, pero necesita actualizarse:

```javascript
// Mapeo ACTUAL (incorrecto para LoL)
function roleToPosition(role) {
  case "top":       return "Defender";
  case "jungle":    return "Midfielder";
  case "mid":       return "AttackingMidfielder";
  case "bot":       return "Forward";
  case "support":   return "DefensiveMidfielder";
}

// Mapeo PROPUESTO (correcto para LoL)
function footballPositionToLolRole(position) {
  switch (position) {
    case "Goalkeeper":       return "Support";  // GK ÔåÆ Support (µèñþø¥Þ¥àÕè®)
    case "Defender":
    case "RightBack":
    case "CenterBack":
    case "LeftBack":
    case "RightWingBack":
    case "LeftWingBack":     return "Top";     // Defensores ÔåÆ Top (solo lane)
    case "Midfielder":
    case "DefensiveMidfielder":
    case "CentralMidfielder": return "Mid";    // Centrocampistas ÔåÆ Mid
    case "AttackingMidfielder":
    case "RightMidfielder":
    case "LeftMidfielder":  return "Mid";     // Medias ÔåÆ Mid
    case "Forward":
    case "RightWinger":
    case "LeftWinger":
    case "Striker":          return "ADC";     // Delanteros ÔåÆ ADC (Bot)
  }
}
```

### Mapeo de PlayStyle a DraftStrategy

```rust
// PlayStyle actual
pub enum PlayStyle {
    Balanced,    // ÔåÆ Balanced
    Attacking,   // ÔåÆ Aggressive
    Defensive,    // ÔåÆ Passive
    Possession,   // ÔåÆ Scaling
    Counter,      // ÔåÆ CounterPick
    HighPress,    // ÔåÆ Aggressive
}

// Nuevo enum DraftStrategy (propuesto)
pub enum DraftStrategy {
    Balanced,     // Equipo balanceado
    Aggressive,   //early game focus
    Passive,       // Late game focus
    Scaling,       // Farm heavy
    CounterPick,  // Counter pick strategy
    PriorityBans, // Ban priority targets
}
```

---

## Migraciones de Base de Datos Pendientes

### v028: Renombrar football_nation ÔåÆ region

```sql
-- Rename football_nation to region in all tables

-- Players
ALTER TABLE players RENAME COLUMN football_nation TO region;

-- Teams
ALTER TABLE teams RENAME COLUMN football_nation TO region;

-- Managers
ALTER TABLE managers RENAME COLUMN football_nation TO region;

-- Staff
ALTER TABLE staff RENAME COLUMN football_nation TO region;

-- Update sequences/metadata if needed
INSERT INTO db_sequence (name, value) VALUES ('schema_version', 28)
ON CONFLICT(name) DO UPDATE SET value = 28;
```

**Notas**:
- SQLite soporta `RENAME COLUMN` desde 3.25.0 (2018)
- Verificar que no haya foreign keys que referencien `football_nation`
- Backup de la base de datos antes de ejecutar

### v029: Migrar stadium ÔåÆ arena

```sql
-- Add arena columns
ALTER TABLE teams ADD COLUMN arena_name TEXT;
ALTER TABLE teams ADD COLUMN arena_capacity INTEGER;

-- Copy data from stadium columns
UPDATE teams SET arena_name = stadium_name, arena_capacity = stadium_capacity;

-- Note: Keep stadium columns for backward compatibility during transition
-- They can be removed in a future migration (v032+)

INSERT INTO db_sequence (name, value) VALUES ('schema_version', 29)
ON CONFLICT(name) DO UPDATE SET value = 29;
```

### v030: Agregar team_composition

```sql
-- Add team composition field (stores 5 roles as JSON array)
ALTER TABLE teams ADD COLUMN team_composition TEXT DEFAULT '[]';

-- Convert existing formations to team compositions
-- 4-4-2: ["Top", "Jungle", "Mid", "ADC", "Support"]
-- 4-3-3: ["Top", "Jungle", "Mid", "ADC", "Support"]
-- 5-3-2: ["Top", "Jungle", "Mid", "ADC", "Support"]
-- etc.

UPDATE teams SET team_composition = 
  CASE 
    WHEN formation LIKE '%4-4-2%' THEN '["Top","Jungle","Mid","ADC","Support"]'
    WHEN formation LIKE '%4-3-3%' THEN '["Top","Jungle","Mid","ADC","Support"]'
    WHEN formation LIKE '%5-3-2%' THEN '["Top","Jungle","Mid","ADC","Support"]'
    WHEN formation LIKE '%3-5-2%' THEN '["Top","Jungle","Mid","ADC","Support"]'
    ELSE '["Top","Jungle","Mid","ADC","Support"]'
  END;

INSERT INTO db_sequence (name, value) VALUES ('schema_version', 30)
ON CONFLICT(name) DO UPDATE SET value = 30;
```

### v031: Agregar draft_strategy

```sql
-- Add draft_strategy field
ALTER TABLE teams ADD COLUMN draft_strategy TEXT DEFAULT 'Balanced';

-- Migrate play_style to draft_strategy
UPDATE teams SET draft_strategy =
  CASE play_style
    WHEN 'Balanced' THEN 'Balanced'
    WHEN 'Attacking' THEN 'Aggressive'
    WHEN 'Defensive' THEN 'Passive'
    WHEN 'Possession' THEN 'Scaling'
    WHEN 'Counter' THEN 'CounterPick'
    WHEN 'HighPress' THEN 'Aggressive'
    ELSE 'Balanced'
  END;

INSERT INTO db_sequence (name, value) VALUES ('schema_version', 31)
ON CONFLICT(name) DO UPDATE SET value = 31;
```

---

## Tipos Rust a Actualizar

### domain/src/player.rs

```rust
// AGREGAR: Role enum (nuevo)
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Role {
    Top,
    Jungle,
    Mid,
    ADC,
    Support,
}

impl Position {
    // AGREGAR: M├®todo de conversi├│n
    pub fn to_lol_role(&self) -> Role {
        match self {
            Position::Goalkeeper => Role::Support,
            Position::Defender | Position::RightBack | Position::CenterBack 
            | Position::LeftBack | Position::RightWingBack | Position::LeftWingBack => Role::Top,
            Position::Midfielder | Position::DefensiveMidfielder 
            | Position::CentralMidfielder | Position::RightMidfielder 
            | Position::LeftMidfielder | Position::AttackingMidfielder => Role::Mid,
            Position::Forward | Position::RightWinger | Position::LeftWinger 
            | Position::Striker => Role::ADC,
        }
    }
}

// MODIFICAR: Struct Player
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    // ... campos existentes ...
    #[serde(default)]
    pub football_nation: String,  // ÔåÉ CAMBIAR a: pub region: String,
    // ... 
}

// AGREGAR: backwards compatibility con serde
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Player {
    #[serde(default, alias = "football_nation")]
    pub region: String,
}
```

### domain/src/team.rs

```rust
// AGREGAR: DraftStrategy enum (nuevo)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Default)]
pub enum DraftStrategy {
    #[default]
    Balanced,
    Aggressive,
    Passive,
    Scaling,
    CounterPick,
    PriorityBans,
}

// MODIFICAR: Struct Team
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Team {
    // ... campos existentes ...
    #[serde(default)]
    pub football_nation: String,  // ÔåÉ CAMBIAR a: pub region: String,
    
    #[serde(default)]
    pub stadium_name: String,      // ÔåÉ CAMBIAR a: pub arena_name: String,
    pub stadium_capacity: u32,     // ÔåÉ CAMBIAR a: pub arena_capacity: u32,
    
    pub formation: String,        // ÔåÉ CAMBIAR a: pub team_composition: Vec<String>,
    pub play_style: PlayStyle,    // ÔåÉ CAMBIAR a: pub draft_strategy: DraftStrategy,
    // ...
}

// AGREGAR: backwards compatibility
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Team {
    #[serde(default, alias = "football_nation")]
    pub region: String,
    #[serde(default, alias = "stadium_name")]
    pub arena_name: String,
    #[serde(default, alias = "stadium_capacity")]
    pub arena_capacity: u32,
    #[serde(default, alias = "formation")]
    pub team_composition: Vec<String>,
    #[serde(default, alias = "play_style")]
    pub draft_strategy: DraftStrategy,
}
```

### domain/src/manager.rs

```rust
// MODIFICAR: Struct Manager
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manager {
    // ... campos existentes ...
    #[serde(default)]
    pub football_nation: String,  // ÔåÉ CAMBIAR a: pub region: String,
    // ...
}

// AGREGAR: backwards compatibility
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Manager {
    #[serde(default, alias = "football_nation")]
    pub region: String,
}
```

### domain/src/staff.rs

```rust
// MODIFICAR: Struct Staff
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Staff {
    // ... campos existentes ...
    #[serde(default)]
    pub football_nation: String,  // ÔåÉ CAMBIAR a: pub region: String,
    // ...
}

// AGREGAR: backwards compatibility
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Staff {
    #[serde(default, alias = "football_nation")]
    pub region: String,
}
```

---

## Scripts de Migraci├│n

### generate-lol-roles.mjs (nuevo)

Script para migrar posiciones de jugadores existentes a roles LoL.

```javascript
// scripts/migrate-lol-roles.mjs

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const savePath = resolve(ROOT, "src-tauri/databases/default.db");

function footballPositionToLolRole(position) {
  const pos = String(position).toLowerCase();
  if (pos.includes("goalkeeper")) return "Support";
  if (pos.includes("defender") || pos.includes("back")) return "Top";
  if (pos.includes("midfielder") || pos.includes("mid")) return "Mid";
  if (pos.includes("forward") || pos.includes("winger") || pos.includes("striker")) return "ADC";
  return "ADC";
}

async function migrate() {
  console.log("Migrating player positions to LoL roles...");
  // Read save file
  // Update each player's position
  // Write back
  console.log("Migration complete");
}

migrate().catch(console.error);
```

### migrate-existing-saves.mjs (nuevo)

Script para migrar guardados existentes (JSON o SQLite).

```javascript
// scripts/migrate-existing-saves.mjs

import { readFile, writeFile, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";

const ROOT = resolve(process.cwd());

const FIELD_MAPPINGS = {
  football_nation: "region",
  stadium_name: "arena_name",
  stadium_capacity: "arena_capacity",
  play_style: "draft_strategy",
};

async function migrateJsonFile(filePath) {
  const content = await readFile(filePath, "utf-8");
  const data = JSON.parse(content);
  
  // Recursively rename fields
  function renameFields(obj) {
    if (Array.isArray(obj)) return obj.map(renameFields);
    if (typeof obj !== "object" || obj === null) return obj;
    
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = FIELD_MAPPINGS[key] || key;
      result[newKey] = renameFields(value);
    }
    return result;
  }
  
  const migrated = renameFields(data);
  await writeFile(filePath, JSON.stringify(migrated, null, 2));
  console.log(`Migrated: ${filePath}`);
}

async function main() {
  const databasesDir = resolve(ROOT, "src-tauri/databases");
  // Find and migrate all save files
  console.log("Migration complete");
}

main().catch(console.error);
```

### generate-lec-world.mjs (actualizar)

El script existente necesita actualizaci├│n del mapeo de roles:

```javascript
// ACTUAL (l├¡neas 96-114)
function roleToPosition(role) {
  // Mapeo incorrecto para LoL
}

// NUEVO
function roleToPosition(role) {
  switch (String(role || "").toLowerCase()) {
    case "top":       return "Top";
    case "jungle":    return "Jungle";
    case "mid":       return "Mid";
    case "bot":
    case "adc":       return "ADC";
    case "support":
    case "sup":       return "Support";
    default:          return "Mid";
  }
}
```

---

## Cronograma

### Fase 1: Base de Datos (Semana 1)

| Tarea | Estimaci├│n | Dependencias | Estado |
|-------|------------|--------------|--------|
| v028: Renombrar `football_nation` ÔåÆ `region` | 2 horas | Ninguna | ­ƒö▓ Pendiente |
| v029: Migrar stadium ÔåÆ arena | 2 horas | v028 | ­ƒö▓ Pendiente |
| v030: Agregar team_composition | 2 horas | v029 | ­ƒö▓ Pendiente |
| v031: Agregar draft_strategy | 2 horas | v030 | ­ƒö▓ Pendiente |
| Test de migraci├│n en SQLite | 4 horas | v031 | ­ƒö▓ Pendiente |

### Fase 2: Tipos Rust (Semana 1-2)

| Tarea | Estimaci├│n | Dependencias | Estado |
|-------|------------|--------------|--------|
| Agregar `Role` enum en player.rs | 4 horas | Ninguna | ­ƒö▓ Pendiente |
| Actualizar `Player` struct con backwards compatibility | 4 horas | Role enum | ­ƒö▓ Pendiente |
| Agregar `DraftStrategy` enum en team.rs | 4 horas | Ninguna | ­ƒö▓ Pendiente |
| Actualizar `Team` struct con backwards compatibility | 4 horas | DraftStrategy | ­ƒö▓ Pendiente |
| Actualizar `Manager` struct | 2 horas | Ninguna | ­ƒö▓ Pendiente |
| Actualizar `Staff` struct | 2 horas | Ninguna | ­ƒö▓ Pendiente |
| Compilaci├│n y tests | 4 horas | Todos los cambios | ­ƒö▓ Pendiente |

### Fase 3: Scripts de Generaci├│n (Semana 2)

| Tarea | Estimaci├│n | Dependencias | Estado |
|-------|------------|--------------|--------|
| Actualizar `generate-lec-world.mjs` | 4 horas | Tipos Rust | ­ƒö▓ Pendiente |
| Crear `migrate-existing-saves.mjs` | 8 horas | v028-v031 | ­ƒö▓ Pendiente |
| Test de generaci├│n de mundo | 4 horas | Scripts | ­ƒö▓ Pendiente |

### Fase 4: Limpieza (Semana 3)

| Tarea | Estimaci├│n | Dependencias | Estado |
|-------|------------|--------------|--------|
| Remover aliases de backwards compatibility | 4 horas | Migraci├│n completa | ­ƒö▓ Pendiente |
| Documentar cambios en CHANGELOG.md | 2 horas | Ninguna | ­ƒö▓ Pendiente |
| Test de regression | 8 horas | Todo | ­ƒö▓ Pendiente |

---

## Riesgos y Mitigaci├│n

| Riesgo | Impacto | Probabilidad | Mitigaci├│n |
|--------|---------|--------------|------------|
| **P├®rdida de datos en migraci├│n** | Cr├¡tico | Media | 1. Full backup antes de cada migraci├│n 2. Tests automatizados de verificaci├│n post-migraci├│n 3. Mantener campos old durante transici├│n |
| **Incompatibilidad con guardados existentes** | Alto | Media | Usar aliases de serde para backwards compatibility durante transici├│n |
| **Errores en mapeo de posiciones** | Alto | Baja | Documentar mapeo expl├¡cito, agregar tests unitarios |
| **SQLite no soporta RENAME COLUMN** | Medio | Baja | Verificar versi├│n de SQLite en runtime, fallback a COPY+DROP |
| **Scripts de migraci├│n fallan en datos edge case** | Medio | Media | 1. Validar datos antes de migraci├│n 2. Loguear errores y continuar 3. Reporte de auditor├¡a post-migraci├│n |
| **µÇºÞâ¢ regresi├│n por nuevos campos** | Bajo | Baja | Benchmarks antes y despu├®s, optimize queries si es necesario |

### Estrategia de Rollback

Para cada migraci├│n SQL:
1. Crear tabla backup antes de modificar
2. Generar script de rollback SQL
3. En caso de falla, ejecutar rollback y notificar al usuario

```sql
-- Template de backup
CREATE TABLE teams_backup AS SELECT * FROM teams;
-- Para rollback:
-- DROP TABLE teams;
-- ALTER TABLE teams_backup RENAME TO teams;
```

---

## Referencias

- [DATA_PROVENANCE.md](./DATA_PROVENANCE.md) - Pol├¡tica de datos externos
- [INHERITED_DOCS_AUDIT.md](./INHERITED_DOCS_AUDIT.md) - Auditor├¡a de documentaci├│n heredada
- Migraciones en `src-tauri/crates/db/src/sql/`
  - v014: `football_identity.sql`
  - v020: `lol_stats_schema.sql`
  - v021: `lol_pure_stats_tables.sql`
- Tipos domain en `src-tauri/crates/domain/src/`
  - `player.rs`
  - `team.rs`
  - `manager.rs`
  - `staff.rs`
- Scripts de generaci├│n:
  - `scripts/generate-lec-world.mjs`
  - `scripts/fetch-leaguepedia-dobs.mjs`

---

## Notas Adicionales

### Sobre backwards compatibility

Se recomienda mantener los nombres de campos old con aliases de serde durante al menos 2-3 versiones para permitir que los usuarios migren sus guardados gradualmente. Despu├®s de eso, se pueden remover en una major release.

### Sobre la conversi├│n de formaciones

Las formaciones de f├║tbol (4-4-2, 4-3-3, etc.) no tienen una correspondencia directa 1:1 con equipos LoL. Se propone:
- Por defecto, usar 5 roles b├ísicos: `["Top", "Jungle", "Mid", "ADC", "Support"]`
- Allow custom team compositions en el futuro
- La formaci├│n old se puede Ðüð¥ÐàÐÇð░ð¢ð©ÐéÐî como referencia hist├│rica

### Orden de ejecuci├│n

1. **Primero**: Migraciones de base de datos (SQL)
2. **Segundo**: Tipos Rust con backwards compatibility
3. **Tercero**: Scripts de generaci├│n
4. **Cuarto**: Tests de integraci├│n
5. **Quinto**: Cleanup y documentaci├│n
