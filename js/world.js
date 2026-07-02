// =============================================================
// worldGen.js  —  World Generation
// =============================================================

'use strict';

const {
  BLOCKS, BLOCK_DEFS,
  ITEMS,
  BIOMES, BIOME_DEFS,
  STRUCTURES,
  WORLD_CONFIG: CFG
} = require('./constants');

// -------------------------------------------------------------
// Seeded pseudo-random (mulberry32)
// -------------------------------------------------------------
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// -------------------------------------------------------------
// Smooth noise (value noise, 1D)
// -------------------------------------------------------------
function makeNoise1D(rand) {
  const TABLE_SIZE = 1024;
  const table = new Float32Array(TABLE_SIZE);
  for (let i = 0; i < TABLE_SIZE; i++) table[i] = rand() * 2 - 1;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

  return function noise(x) {
    const ix = Math.floor(x) & (TABLE_SIZE - 1);
    const fx = x - Math.floor(x);
    return lerp(table[ix], table[(ix + 1) & (TABLE_SIZE - 1)], fade(fx));
  };
}

// -------------------------------------------------------------
// Smooth noise (value noise, 2D)
// -------------------------------------------------------------
function makeNoise2D(rand) {
  const TABLE_SIZE = 1024;
  const table = new Float32Array(TABLE_SIZE);
  for (let i = 0; i < TABLE_SIZE; i++) table[i] = rand() * 2 - 1;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function idx(x, y) { return ((x & (TABLE_SIZE-1)) ^ ((y * 1619) & (TABLE_SIZE-1))) & (TABLE_SIZE-1); }

  return function noise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const v00 = table[idx(ix,   iy  )];
    const v10 = table[idx(ix+1, iy  )];
    const v01 = table[idx(ix,   iy+1)];
    const v11 = table[idx(ix+1, iy+1)];
    return lerp(lerp(v00, v10, fade(fx)), lerp(v01, v11, fade(fx)), fade(fy));
  };
}

// -------------------------------------------------------------
// Fractal Brownian Motion
// -------------------------------------------------------------
function fbm(noise, x, y, octaves, lacunarity, gain) {
  let value = 0, amplitude = 1, frequency = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    value     += noise(x * frequency, y * frequency) * amplitude;
    max       += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return value / max;
}

// -------------------------------------------------------------
// World class
// -------------------------------------------------------------
class World {
  constructor(seed) {
    this.seed   = seed;
    this.width  = CFG.WIDTH;
    this.height = CFG.HEIGHT;

    // Flat typed arrays for speed
    // blocks[y * width + x]
    this.blocks   = new Uint16Array(this.width * this.height);
    this.metadata = new Uint8Array(this.width * this.height);  // e.g. damage, variant
    this.light    = new Uint8Array(this.width * this.height);  // 0-15

    // Biome map  [x] → biome id
    this.biomeMap = new Uint8Array(this.width);

    // Surface height cache [x] → y of first solid block from top
    this.surfaceY = new Int16Array(this.width);

    // Entities & mobs managed separately
    this.mobs      = [];
    this.items     = [];   // dropped item entities
    this.particles = [];

    // Chunk dirty flags (for renderer)
    this.chunkCount = Math.ceil(this.width / CFG.CHUNK_WIDTH);
    this.dirtyChunks = new Uint8Array(this.chunkCount);

    this._rand = mulberry32(seed);
    this._noise2D = makeNoise2D(mulberry32(seed ^ 0xDEADBEEF));
    this._noise1D = makeNoise1D(mulberry32(seed ^ 0xCAFEBABE));
  }

  // ----------------------------------------------------------
  getBlock(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return BLOCKS.BEDROCK;
    return this.blocks[y * this.width + x];
  }

  setBlock(x, y, id) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.blocks[y * this.width + x] = id;
    this._markDirty(x);
  }

  getMeta(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
    return this.metadata[y * this.width + x];
  }

  setMeta(x, y, v) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.metadata[y * this.width + x] = v;
  }

  _markDirty(x) {
    const cx = Math.floor(x / CFG.CHUNK_WIDTH);
    if (cx >= 0 && cx < this.chunkCount) this.dirtyChunks[cx] = 1;
  }

  // ----------------------------------------------------------
  // MASTER GENERATION ENTRY POINT
  // ----------------------------------------------------------
  generate() {
    console.time('[WorldGen] total');
    this._genBiomeMap();
    this._genTerrain();
    this._genCaves();
    this._genOres();
    this._genSurface();
    this._genWater();
    this._genTrees();
    this._genDecorations();
    this._genStructures();
    this._genBedrock();
    this._calcLight();
    this._spawnMobs();
    console.timeEnd('[WorldGen] total');
    return this;
  }

  // ----------------------------------------------------------
  // 1. BIOME MAP
  // ----------------------------------------------------------
  _genBiomeMap() {
    const noise = this._noise1D;
    const W = this.width;

    for (let x = 0; x < W; x++) {
      // Temperature (large scale)
      const temp = (noise(x * 0.0008) + 1) * 0.5;   // 0..1
      // Humidity (medium scale)
      const hum  = (noise(x * 0.0015 + 500) + 1) * 0.5;
      // Elevation tendency (affects mountain/ocean)
      const elev = (noise(x * 0.0005 + 1000) + 1) * 0.5;

      let biome;
      if (elev > 0.80)                          biome = BIOMES.MOUNTAINS;
      else if (elev < 0.15)                     biome = BIOMES.OCEAN;
      else if (elev < 0.22)                     biome = BIOMES.BEACH;
      else if (temp < 0.15)                     biome = BIOMES.SNOW_FOREST;
      else if (temp < 0.22)                     biome = BIOMES.SNOW_PLAINS;
      else if (temp > 0.80 && hum < 0.25)       biome = BIOMES.DESERT;
      else if (temp > 0.75 && hum > 0.70)       biome = BIOMES.JUNGLE;
      else if (temp > 0.68)                     biome = BIOMES.SAVANNA;
      else if (hum > 0.72)                      biome = BIOMES.SWAMP;
      else if (hum > 0.55 && temp > 0.45)       biome = BIOMES.FOREST;
      else if (hum > 0.50 && temp < 0.40)       biome = BIOMES.PINE_FOREST;
      else if (hum > 0.40)                      biome = BIOMES.BIRCH_FOREST;
      else if (temp > 0.60 && elev > 0.55)      biome = BIOMES.MESA;
      else if (elev > 0.60)                     biome = BIOMES.MOUNTAINS;
      else                                       biome = BIOMES.PLAINS;

      this.biomeMap[x] = biome;
    }

    // Smooth biome transitions (blur)
    const blurred = new Uint8Array(W);
    for (let x = 0; x < W; x++) blurred[x] = this.biomeMap[x];
    // Hard borders kept intentionally; blending done at render time via BIOME_BLEND
    this.biomeMap = blurred;
  }

  // ----------------------------------------------------------
  // 2. TERRAIN HEIGHT MAP
  // ----------------------------------------------------------
  _genTerrain() {
    const W  = this.width;
    const H  = this.height;
    const SL = CFG.SEA_LEVEL;
    const n  = this._noise2D;

    for (let x = 0; x < W; x++) {
      const biome   = this.biomeMap[x];
      const biomeDef = BIOME_DEFS[biome];

      // Base height via fbm
      let h = fbm(n, x * 0.003, 0, 6, 2.0, 0.5);  // -1..1
      h = (h + 1) * 0.5;  // 0..1

      // Biome-specific height modifiers
      let surfaceY;
      switch (biome) {
        case BIOMES.OCEAN:
          surfaceY = SL + 8 + Math.floor(h * 12);
          break;
        case BIOMES.BEACH:
          surfaceY = SL - 2 + Math.floor(h * 6);
          break;
        case BIOMES.MOUNTAINS:
          surfaceY = SL - 20 - Math.floor(h * 60);
          break;
        case BIOMES.PLAINS:
          surfaceY = SL - 5 - Math.floor(h * 15);
          break;
        case BIOMES.DESERT:
        case BIOMES.SAVANNA:
          surfaceY = SL - 3 - Math.floor(h * 10);
          break;
        case BIOMES.SWAMP:
          surfaceY = SL - 1 - Math.floor(h * 5);
          break;
        case BIOMES.SNOW_PLAINS:
          surfaceY = SL - 4 - Math.floor(h * 12);
          break;
        case BIOMES.MESA:
          surfaceY = SL - 10 - Math.floor(h * 30);
          break;
        default:
          surfaceY = SL - 6 - Math.floor(h * 20);
      }

      surfaceY = Math.max(4, Math.min(H - 10, surfaceY));
      this.surfaceY[x] = surfaceY;

      // Fill column
      const surf  = biomeDef.surfaceBlock;
      const sub   = biomeDef.subSurfaceBlock;
      const stone = biomeDef.stoneBlock;

      for (let y = 0; y < H; y++) {
        let block;
        if (y < surfaceY)        block = BLOCKS.AIR;
        else if (y === surfaceY) block = surf;
        else if (y < surfaceY + 4) block = sub;
        else                     block = stone;

        this.blocks[y * W + x] = block;
      }
    }
  }

  // ----------------------------------------------------------
  // 3. CAVES
  // ----------------------------------------------------------
  _genCaves() {
    const W  = this.width;
    const H  = this.height;
    const n  = this._noise2D;
    const T  = CFG.CAVE_THRESHOLD;
    const S  = CFG.CAVE_SCALE;
    const MD = CFG.CAVE_MIN_DEPTH;

    for (let x = 0; x < W; x++) {
      const minY = this.surfaceY[x] + MD;
      for (let y = minY; y < H - 2; y++) {
        const v = Math.abs(fbm(n, x * S, y * S, 4, 2.0, 0.5));
        if (v > T) {
          const idx = y * W + x;
          const b   = this.blocks[idx];
          if (b !== BLOCKS.AIR && b !== BLOCKS.WATER && b !== BLOCKS.BEDROCK) {
            this.blocks[idx] = BLOCKS.AIR;
          }
        }
      }
    }
  }

  // ----------------------------------------------------------
  // 4. ORES
  // ----------------------------------------------------------
  _genOres() {
    const W    = this.width;
    const H    = this.height;
    const rand = this._rand;
    const n    = this._noise2D;

    const ORE_MAP = {
      COAL:    { block: BLOCKS.COAL_ORE,    ...CFG.ORE_LAYERS.COAL    },
      COPPER:  { block: BLOCKS.COPPER_ORE,  ...CFG.ORE_LAYERS.COPPER  },
      IRON:    { block: BLOCKS.IRON_ORE,    ...CFG.ORE_LAYERS.IRON    },
      SILVER:  { block: BLOCKS.SILVER_ORE,  ...CFG.ORE_LAYERS.SILVER  },
      GOLD:    { block: BLOCKS.GOLD_ORE,    ...CFG.ORE_LAYERS.GOLD    },
      STEEL:   { block: BLOCKS.STEEL_ORE,   ...CFG.ORE_LAYERS.STEEL   },
      CRYSTAL: { block: BLOCKS.CRYSTAL_ORE, ...CFG.ORE_LAYERS.CRYSTAL }
    };

    for (const [key, ore] of Object.entries(ORE_MAP)) {
      for (let x = 0; x < W; x++) {
        const surfY = this.surfaceY[x];
        const minY  = surfY + ore.minDepth;
        const maxY  = Math.min(H - 2, surfY + ore.maxDepth);

        for (let y = minY; y < maxY; y++) {
          if (rand() > ore.chance) continue;
          // Place vein
          this._placeVein(x, y, ore.block, ore.veinSize, rand);
        }
      }
    }
  }

  _placeVein(cx, cy, block, size, rand) {
    const W = this.width;
    const H = this.height;
    for (let i = 0; i < size; i++) {
      const ox = cx + Math.floor((rand() * 2 - 1) * Math.sqrt(size));
      const oy = cy + Math.floor((rand() * 2 - 1) * Math.sqrt(size));
      if (ox < 0 || ox >= W || oy < 0 || oy >= H) continue;
      const idx = oy * W + ox;
      if (this.blocks[idx] === BLOCKS.STONE ||
          this.blocks[idx] === BLOCKS.SAND_STONE) {
        this.blocks[idx] = block;
      }
    }
  }

  // ----------------------------------------------------------
  // 5. SURFACE DETAILS (snow, grass variants, clay patches)
  // ----------------------------------------------------------
  _genSurface() {
    const W    = this.width;
    const rand = this._rand;

    for (let x = 0; x < W; x++) {
      const biome  = this.biomeMap[x];
      const sy     = this.surfaceY[x];
      const idx    = sy * W + x;

      // Snow cap on cold biomes
      if (biome === BIOMES.SNOW_PLAINS || biome === BIOMES.SNOW_FOREST) {
        if (this.blocks[idx] === BLOCKS.GRASS || this.blocks[idx] === BLOCKS.EARTH) {
          this.blocks[(sy - 1) * W + x] = BLOCKS.SNOW;
        }
      }

      // Clay patches in swamp/river
      if ((biome === BIOMES.SWAMP || biome === BIOMES.RIVER) && rand() < 0.15) {
        for (let dy = 0; dy < 3; dy++) {
          const b = this.blocks[(sy + dy) * W + x];
          if (b === BLOCKS.EARTH || b === BLOCKS.SAND) {
            this.blocks[(sy + dy) * W + x] = BLOCKS.CLAY;
          }
        }
      }

      // Gravel beaches near ocean border
      if (biome === BIOMES.BEACH && rand() < 0.3) {
        this.blocks[idx] = BLOCKS.GRAVEL;
      }
    }
  }

  // ----------------------------------------------------------
  // 6. WATER FILL
  // ----------------------------------------------------------
  _genWater() {
    const W  = this.width;
    const H  = this.height;
    const SL = CFG.SEA_LEVEL;

    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        if (y >= SL && this.blocks[y * W + x] === BLOCKS.AIR) {
          this.blocks[y * W + x] = BLOCKS.WATER;
        }
      }
    }
  }

  // ----------------------------------------------------------
  // 7. TREES
  // ----------------------------------------------------------
  _genTrees() {
    const W    = this.width;
    const rand = this._rand;

    for (let x = 2; x < W - 2; x++) {
      const biome   = this.biomeMap[x];
      const biomeDef = BIOME_DEFS[biome];
      if (!biomeDef.treeType) continue;
      if (rand() > biomeDef.treeChance) continue;

      const sy = this.surfaceY[x];
      const surf = this.blocks[sy * W + x];
      if (surf !== BLOCKS.GRASS && surf !== BLOCKS.EARTH) continue;

      // Check space
      if (this.blocks[(sy - 1) * W + x] !== BLOCKS.AIR) continue;

      this._placeTree(x, sy - 1, biomeDef.treeType, rand);
    }
  }

  _placeTree(bx, by, type, rand) {
    const W = this.width;
    const H = this.height;

    const configs = {
      OAK:    { trunkH: [4,6],  crownR: [2,3],  log: BLOCKS.LOG_OAK,    leaves: BLOCKS.LEAVES_OAK    },
      BIRCH:  { trunkH: [5,7],  crownR: [2,2],  log: BLOCKS.LOG_BIRCH,  leaves: BLOCKS.LEAVES_BIRCH  },
      PINE:   { trunkH: [6,9],  crownR: [1,2],  log: BLOCKS.LOG_PINE,   leaves: BLOCKS.LEAVES_PINE,  conical: true },
      SPRUCE: { trunkH: [7,11], crownR: [1,2],  log: BLOCKS.LOG_SPRUCE, leaves: BLOCKS.LEAVES_SPRUCE,conical: true },
      CEDAR:  { trunkH: [8,13], crownR: [3,4],  log: BLOCKS.LOG_CEDAR,  leaves: BLOCKS.LEAVES_OAK    }
    };

    const cfg    = configs[type] || configs.OAK;
    const trunkH = cfg.trunkH[0] + Math.floor(rand() * (cfg.trunkH[1] - cfg.trunkH[0] + 1));
    const crownR = cfg.crownR[0] + Math.floor(rand() * (cfg.crownR[1] - cfg.crownR[0] + 1));

    // Trunk
    for (let i = 0; i < trunkH; i++) {
      const ty = by - i;
      if (ty < 0 || ty >= H) continue;
      if (this.blocks[ty * W + bx] === BLOCKS.AIR) {
        this.blocks[ty * W + bx] = cfg.log;
      }
    }

    // Leaves / crown
    const topY = by - trunkH;
    if (cfg.conical) {
      // Conical crown (pine/spruce)
      for (let dy = 0; dy <= trunkH - 1; dy++) {
        const r = Math.max(0, crownR - Math.floor(dy * crownR / trunkH));
        const ly = topY + dy;
        if (ly < 0 || ly >= H) continue;
        for (let dx = -r; dx <= r; dx++) {
          const lx = bx + dx;
          if (lx < 0 || lx >= W) continue;
          if (this.blocks[ly * W + lx] === BLOCKS.AIR) {
            this.blocks[ly * W + lx] = cfg.leaves;
          }
        }
      }
    } else {
      // Round crown (oak/birch/cedar)
      for (let dy = -crownR; dy <= crownR; dy++) {
        for (let dx = -crownR; dx <= crownR; dx++) {
          if (dx*dx + dy*dy > crownR*crownR + crownR) continue;
          const lx = bx + dx;
          const ly = topY + dy;
          if (lx < 0 || lx >= W || ly < 0 || ly >= H) continue;
          if (this.blocks[ly * W + lx] === BLOCKS.AIR) {
            this.blocks[ly * W + lx] = cfg.leaves;
          }
        }
      }
    }
  }

  // ----------------------------------------------------------
  // 8. DECORATIONS (flowers, mushrooms, cacti, tall grass…)
  // ----------------------------------------------------------
  _genDecorations() {
    const W    = this.width;
    const rand = this._rand;

    const FLOWERS = [BLOCKS.FLOWER_1, BLOCKS.FLOWER_2, BLOCKS.FLOWER_3,
                     BLOCKS.FLOWER_4, BLOCKS.FLOWER_5];
    const MUSHROOMS = [BLOCKS.MUSHROOM_BROWN, BLOCKS.MUSHROOM_RED,
                       BLOCKS.MUSHROOM_BLUE,  BLOCKS.MUSHROOM_PURPLE,
                       BLOCKS.MUSHROOM_WHITE];

    for (let x = 0; x < W; x++) {
      const biome   = this.biomeMap[x];
      const biomeDef = BIOME_DEFS[biome];
      const sy      = this.surfaceY[x];
      const above   = (sy - 1) * W + x;

      if (sy < 1) continue;
      if (this.blocks[above] !== BLOCKS.AIR) continue;

      const surf = this.blocks[sy * W + x];

      // Flowers
      if (surf === BLOCKS.GRASS && rand() < biomeDef.flowerChance) {
        this.blocks[above] = FLOWERS[Math.floor(rand() * FLOWERS.length)];
        continue;
      }

      // Mushrooms
      if (rand() < biomeDef.mushroomChance) {
        this.blocks[above] = MUSHROOMS[Math.floor(rand() * MUSHROOMS.length)];
        continue;
      }

      // Tall grass on grass biomes
      if (surf === BLOCKS.GRASS && rand() < 0.08) {
        this.blocks[above] = BLOCKS.TALL_GRASS;
        continue;
      }

      // Cactus in desert/mesa
      if ((biome === BIOMES.DESERT || biome === BIOMES.MESA) &&
           surf === BLOCKS.SAND && rand() < 0.005) {
        const cH = 1 + Math.floor(rand() * 3);
        for (let i = 0; i < cH; i++) {
          const cy = (sy - 1 - i) * W + x;
          if (this.blocks[cy] === BLOCKS.AIR) this.blocks[cy] = BLOCKS.CACTUS;
        }
        continue;
      }

      // Reeds near water
      if (surf === BLOCKS.SAND || surf === BLOCKS.EARTH) {
        // Check if water neighbor
        const hasWater =
          this.getBlock(x-1, sy) === BLOCKS.WATER ||
          this.getBlock(x+1, sy) === BLOCKS.WATER;
        if (hasWater && rand() < 0.04) {
          const rH = 1 + Math.floor(rand() * 2);
          for (let i = 0; i < rH; i++) {
            const ry = (sy - 1 - i);
            if (ry >= 0 && this.blocks[ry * W + x] === BLOCKS.AIR) {
              this.blocks[ry * W + x] = BLOCKS.REED;
            }
          }
          continue;
        }
      }

      // Algae on water surface
      if (biome === BIOMES.SWAMP && surf === BLOCKS.WATER && rand() < 0.06) {
        this.blocks[above] = BLOCKS.ALGAE;
        continue;
      }

      // Dead bush in desert
      if ((biome === BIOMES.DESERT || biome === BIOMES.SAVANNA) &&
           surf === BLOCKS.SAND && rand() < 0.008) {
        this.blocks[above] = BLOCKS.DEAD_BUSH;
        continue;
      }

      // Coral in ocean (just below sea level)
      if (biome === BIOMES.OCEAN && surf === BLOCKS.SAND && rand() < 0.012) {
        const cy = sy - 1;
        if (cy >= 0 && this.blocks[cy * W + x] === BLOCKS.WATER) {
          this.blocks[cy * W + x] = BLOCKS.CORAL;
        }
      }
    }
  }

  // ----------------------------------------------------------
  // 9. STRUCTURES
  // ----------------------------------------------------------
  _genStructures() {
    const W    = this.width;
    const rand = this._rand;

    for (const [key, def] of Object.entries(STRUCTURES)) {
      for (let x = 0; x < W; x++) {
        const biome = this.biomeMap[x];
        if (!def.biomes.includes(biome)) continue;
        if (rand() > def.chance) continue;

        const sy  = this.surfaceY[x];
        const grid = def.grid;
        const rows = grid.length;
        const cols = grid[0].length;

        // Check flat enough surface (±2 tiles height variance allowed)
        let flat = true;
        for (let dx = 0; dx < cols; dx++) {
          const nx = x + dx;
          if (nx >= W) { flat = false; break; }
          if (Math.abs(this.surfaceY[nx] - sy) > 2) { flat = false; break; }
        }
        if (!flat) continue;

        // Place grid
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const block = grid[row][col];
            if (block === null) continue;
            const px = x + col;
            const py = sy - rows + 1 + row;
            if (px < 0 || px >= W || py < 0 || py >= this.height) continue;
            this.blocks[py * W + px] = block;
          }
        }

        // Spawn loot chest inside (if any)
        if (def.loot && rand() < def.loot.chance) {
          // Find chest block placed
          for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
              if (grid[row][col] === BLOCKS.CHEST) {
                const cx = x + col;
                const cy = sy - rows + 1 + row;
                this._fillChest(cx, cy, def.loot.table, rand);
              }
            }
          }
          // If no chest in grid, place one inside
          if (!grid.flat().includes(BLOCKS.CHEST)) {
            const cx = x + Math.floor(cols / 2);
            const cy = sy - 1;
            this.setBlock(cx, cy, BLOCKS.CHEST);
            this._fillChest(cx, cy, def.loot.table, rand);
          }
        }

        // Skip ahead to avoid overlapping structures
        x += cols + 10;
      }
    }
  }

  _fillChest(x, y, table, rand) {
    // Chest contents stored in metadata map (simplified)
    // Real implementation would use a separate chestData Map
    if (!this.chestData) this.chestData = new Map();
    const loot = [];
    for (const entry of table) {
      if (rand() <= entry.chance) {
        const count = entry.min + Math.floor(rand() * (entry.max - entry.min + 1));
        loot.push({ id: entry.id, count });
      }
    }
    this.chestData.set(`${x},${y}`, loot);
  }

  // ----------------------------------------------------------
  // 10. BEDROCK LAYER
  // ----------------------------------------------------------
  _genBedrock() {
    const W = this.width;
    const H = this.height;
    const rand = this._rand;

    for (let x = 0; x < W; x++) {
      // Always solid bedrock at very bottom
      this.blocks[(H - 1) * W + x] = BLOCKS.BEDROCK;
      // Partial bedrock 2 rows above
      if (rand() < 0.7) this.blocks[(H - 2) * W + x] = BLOCKS.BEDROCK;
      if (rand() < 0.4) this.blocks[(H - 3) * W + x] = BLOCKS.BEDROCK;
    }
  }

  // ----------------------------------------------------------
  // 11. LIGHTING
  // ----------------------------------------------------------
  _calcLight() {
    const W = this.width;
    const H = this.height;

    // Sky light pass (top-down)
    for (let x = 0; x < W; x++) {
      let skyLight = 15;
      for (let y = 0; y < H; y++) {
        const idx = y * W + x;
        const b   = this.blocks[idx];
        const def = BLOCK_DEFS[b];
        if (def && def.opaque) skyLight = Math.max(0, skyLight - (def.lightAbsorb || 15));
        this.light[idx] = skyLight;
      }
    }

    // Torch / emissive block pass (flood fill BFS)
    const queue = [];
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = y * W + x;
        const b   = this.blocks[idx];
        const def = BLOCK_DEFS[b];
        if (def && def.lightEmit > 0) {
          this.light[idx] = Math.max(this.light[idx], def.lightEmit);
          queue.push({ x, y, level: def.lightEmit });
        }
      }
    }

    // BFS propagation
    const DIRS = [{dx:-1,dy:0},{dx:1,dy:0},{dx:0,dy:-1},{dx:0,dy:1}];
    let head = 0;
    while (head < queue.length) {
      const { x, y, level } = queue[head++];
      if (level <= 1) continue;
      for (const { dx, dy } of DIRS) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
        const nidx = ny * W + nx;
        const nb   = this.blocks[nidx];
        const ndef = BLOCK_DEFS[nb];
        const absorb = (ndef && ndef.lightAbsorb) ? ndef.lightAbsorb : 1;
        const newLevel = level - absorb;
        if (newLevel > this.light[nidx]) {
          this.light[nidx] = newLevel;
          queue.push({ x: nx, y: ny, level: newLevel });
        }
      }
    }
  }

  // ----------------------------------------------------------
  // 12. MOB SPAWNING
  // ----------------------------------------------------------
  _spawnMobs() {
    const W    = this.width;
    const rand = this._rand;

    const { MOB_DEFS } = require('./constants');

    for (let cx = 0; cx < this.chunkCount; cx++) {
      const chunkX    = cx * CFG.CHUNK_WIDTH;
      const mobCount  = Math.floor(rand() * CFG.MAX_MOBS_PER_CHUNK);

      for (let m = 0; m < mobCount; m++) {
        const x     = chunkX + Math.floor(rand() * CFG.CHUNK_WIDTH);
        const biome = this.biomeMap[Math.min(x, W - 1)];
        const sy    = this.surfaceY[Math.min(x, W - 1)];
        const y     = sy - 1;

        if (y < 0) continue;
        if (this.getBlock(x, y) !== BLOCKS.AIR) continue;

        // Pick mob valid for this biome
        const validMobs = this._getMobsForBiome(biome, MOB_DEFS);
        if (validMobs.length === 0) continue;

        const mobKey = validMobs[Math.floor(rand() * validMobs.length)];
        const def    = MOB_DEFS[mobKey];

        this.mobs.push({
          id:        `mob_${cx}_${m}_${Date.now()}`,
          type:      mobKey,
          x:         x + 0.5,
          y:         y,
          vx:        0,
          vy:        0,
          hp:        def.hp,
          maxHp:     def.hp,
          hostile:   def.hostile,
          aggroRange:def.aggroRange,
          damage:    def.damage,
          speed:     def.speed,
          armor:     def.armor,
          state:     'idle',       // idle|patrol|chase|attack|flee|dead
          target:    null,
          friendly:  false,
          poisoned:  false,
          poisonTimer: 0,
          onGround:  false,
          facingLeft:false,
          attackCooldown: 0,
          dropTable: def.dropTable,
          isBoss:    def.isBoss,
          xpValue:   def.xpValue,
          specialAttack: def.specialAttack || null,
          specialCooldown: 0,
          befriendItem: def.befriendItem || null,
          canBefriend: def.canBefriend || false
        });
      }
    }
  }

  _getMobsForBiome(biome, MOB_DEFS) {
    // Biome → allowed mob types map
    const BIOME_MOBS = {
      [BIOMES.PLAINS]:      ['COW','SHEEP','PIG','CHICKEN','RABBIT','WOLF','FOX'],
      [BIOMES.FOREST]:      ['COW','SHEEP','PIG','CHICKEN','RABBIT','WOLF','FOX','BEAR'],
      [BIOMES.BIRCH_FOREST]:['COW','SHEEP','RABBIT','FOX','WOLF'],
      [BIOMES.PINE_FOREST]: ['COW','SHEEP','RABBIT','WOLF','BEAR','EAGLE'],
      [BIOMES.JUNGLE]:      ['PARROT','MONKEY','JAGUAR','SNAKE','MOSQUITO'],
      [BIOMES.DESERT]:      ['CAMEL','SCORPION','SNAKE','VULTURE'],
      [BIOMES.SAVANNA]:     ['ELEPHANT','GIRAFFE','LION','ZEBRA','CROCODILE'],
      [BIOMES.SWAMP]:       ['CROCODILE','SNAKE','MOSQUITO','FROG'],
      [BIOMES.MOUNTAINS]:   ['GOAT','EAGLE','BEAR','WOLF'],
      [BIOMES.SNOW_PLAINS]: ['POLAR_BEAR','RABBIT','WOLF'],
      [BIOMES.SNOW_FOREST]: ['POLAR_BEAR','RABBIT','WOLF','BEAR'],
      [BIOMES.OCEAN]:       ['SQUID','SHARK','WHALE'],
      [BIOMES.BEACH]:       ['CRAB','SEAGULL'],
      [BIOMES.MESA]:        ['SCORPION','VULTURE','JAGUAR'],
      [BIOMES.RIVER]:       ['DUCK','FROG','SQUID']
    };
    return (BIOME_MOBS[biome] || []).filter(k => MOB_DEFS[k]);
  }
}

// -------------------------------------------------------------
// HELPER: check if block is solid (for physics)
// -------------------------------------------------------------
function isSolid(blockId) {
  const def = BLOCK_DEFS[blockId];
  return def ? def.solid : false;
}

// -------------------------------------------------------------
// HELPER: check if block is liquid
// -------------------------------------------------------------
function isLiquid(blockId) {
  return blockId === BLOCKS.WATER || blockId === BLOCKS.LAVA;
}

// -------------------------------------------------------------
// CHUNK MANAGER  — lazy-loads / generates chunks on demand
// -------------------------------------------------------------
class ChunkManager {
  constructor(world) {
    this.world  = world;
    this.loaded = new Map();  // key: cx → true
  }

  ensureChunk(cx) {
    if (this.loaded.has(cx)) return;
    this.loaded.set(cx, true);
    // All chunks already generated in World.generate()
    // This hook is for save/load later
  }

  getChunkAt(worldX) {
    return Math.floor(worldX / CFG.CHUNK_WIDTH);
  }

  markDirty(cx) {
    this.world.dirtyChunks[cx] = 1;
  }

  clearDirty(cx) {
    this.world.dirtyChunks[cx] = 0;
  }

  isDirty(cx) {
    return this.world.dirtyChunks[cx] === 1;
  }
}

// -------------------------------------------------------------
// MODULE EXPORTS
// -------------------------------------------------------------
module.exports = { World, ChunkManager, isSolid, isLiquid };
