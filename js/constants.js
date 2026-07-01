// =============================================================
// constants.js — Echo Lands
// ALL game data lives here: block IDs, item stats, tool stats,
// mob stats, biome IDs, crafting recipes, achievement list.
// Every other file imports values FROM here; never the other way.
// =============================================================

// -------------------------------------------------------------
// BLOCK IDs — numeric constants used throughout the engine.
// The renderer uses these IDs to look up BLOCK_DEFS below.
// -------------------------------------------------------------
const BLOCKS = {
  AIR:           0,
  EARTH:         1,
  STONE:         2,
  GRAVEL:        3,   // Has gravity
  SAND:          4,   // Has gravity
  COAL_ORE:      5,
  STEEL_ORE:     6,
  COPPER_ORE:    7,
  IRON_ORE:      8,
  SILVER_ORE:    9,
  GOLD_ORE:      10,
  CLAY:          11,

  // --- Flora & decorative surface blocks ---
  GRASS:         12,
  TURF:          13,  // Decorative grass-top block (placeable)
  FLOWER_1:      14,  // Rose
  FLOWER_2:      15,  // Daisy
  FLOWER_3:      16,  // Tulip
  FLOWER_4:      17,  // Lavender
  FLOWER_5:      18,  // Sunflower
  MUSHROOM_1:    19,  // Brown mushroom (edible)
  MUSHROOM_2:    20,  // Red mushroom (poisonous)
  MUSHROOM_3:    21,  // Blue mushroom (edible, gives glow effect)
  MUSHROOM_4:    22,  // Purple mushroom (poisonous, hallucinogenic)
  MUSHROOM_5:    23,  // White mushroom (edible, restores water)
  ALGAE:         24,  // Found underwater
  TREE_ROOT:     25,  // Found underground below trees

  // --- Wood types: Logs ---
  LOG_OAK:       26,
  LOG_BIRCH:     27,
  LOG_PINE:      28,
  LOG_SPRUCE:    29,
  LOG_CEDAR:     30,

  // --- Wood types: Planks ---
  PLANKS_OAK:    31,
  PLANKS_BIRCH:  32,
  PLANKS_PINE:   33,
  PLANKS_SPRUCE: 34,
  PLANKS_CEDAR:  35,

  // --- Leaves (only obtainable with Shears, else they break) ---
  LEAVES_OAK:    36,
  LEAVES_BIRCH:  37,
  LEAVES_PINE:   38,
  LEAVES_SPRUCE: 39,
  LEAVES_CEDAR:  40,

  // --- Fluids ---
  WATER:         41,  // Collectable with Bucket
  LAVA:          42,  // Collectable with Bucket; damages entities

  // --- Ores / refined materials (block form) ---
  COAL_BLOCK:    43,
  STEEL_BLOCK:   44,
  COPPER_BLOCK:  45,
  IRON_BLOCK:    46,
  SILVER_BLOCK:  47,
  GOLD_BLOCK:    48,
  CRYSTAL:       49,  // Rare underground mineral

  // --- Glass & dyes ---
  GLASS:         50,  // Dyeable; default clear
  GLASS_RED:     51,
  GLASS_GREEN:   52,
  GLASS_BLUE:    53,
  GLASS_YELLOW:  54,
  GLASS_PURPLE:  55,
  GLASS_BLACK:   56,
  GLASS_WHITE:   57,

  // --- Functional / furniture blocks ---
  CHEST:         58,  // Opens inventory panel; stores items
  BED_WHITE:     59,  // Sets respawn point; dyeable
  BED_RED:       60,
  BED_BLUE:      61,
  BED_GREEN:     62,
  DOOR_OAK:      63,  // Toggled open/closed with RMB
  DOOR_BIRCH:    64,
  DOOR_PINE:     65,
  DOOR_SPRUCE:   66,
  DOOR_CEDAR:    67,
  TORCH:         68,  // Emits light; placeable on walls/floors
  WIRE:          69,  // Connects mechanisms (future use)

  // --- Textile blocks ---
  WOOL_WHITE:    70,  // Dyeable
  WOOL_RED:      71,
  WOOL_GREEN:    72,
  WOOL_BLUE:     73,
  WOOL_YELLOW:   74,
  WOOL_PURPLE:   75,
  WOOL_BLACK:    76,

  // --- Miscellaneous ---
  COINS:         77,  // Currency block / drop
  SAND_STONE:    78,  // Crafted from Sand; no gravity
  COBBLESTONE:   79,  // Dropped when Stone is mined without Silk Touch
  BRICK:         80,  // Crafted from Clay

  // Total block type count (used for validation)
  _COUNT:        81
};

// -------------------------------------------------------------
// BLOCK_DEFS — full definition object for every block ID.
// Properties:
//   name        {string}  Display name
//   color       {string}  Primary canvas fill color (hex)
//   colorAlt    {string}  Secondary / detail color for pixel pattern
//   hardness    {number}  Hits required with bare hands to break (1-20)
//   toolNeeded  {string|null} Tool category required for full-speed break
//   hasGravity  {boolean} True → block falls when air is below it
//   isFluid     {boolean} True → flows sideways (water/lava logic)
//   isTranspar  {boolean} True → does not block light; renders behind
//   isSolid     {boolean} False → entity can walk through (flowers, etc.)
//   lightLevel  {number}  0-15; how much light this block emits
//   drops       {Array}   Array of {id, chance, min, max} on break
//   placeable   {boolean} Can the player place this from inventory?
//   stackSize   {number}  Max stack size in inventory
// -------------------------------------------------------------
const BLOCK_DEFS = {

  // --- AIR (empty space) ---
  [BLOCKS.AIR]: {
    name: 'Air', color: 'transparent', colorAlt: 'transparent',
    hardness: 0, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [], placeable: false, stackSize: 0
  },

  // --- EARTH ---
  [BLOCKS.EARTH]: {
    name: 'Earth', color: '#5a3a1a', colorAlt: '#6b4a2a',
    hardness: 2, toolNeeded: 'shovel', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.EARTH, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- STONE ---
  [BLOCKS.STONE]: {
    name: 'Stone', color: '#7a7a7a', colorAlt: '#8a8a8a',
    hardness: 6, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    // Drops Cobblestone unless mined with Silk Touch pickaxe
    drops: [{ id: BLOCKS.COBBLESTONE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- GRAVEL (gravity) ---
  [BLOCKS.GRAVEL]: {
    name: 'Gravel', color: '#6a6a6a', colorAlt: '#5a5a5a',
    hardness: 2, toolNeeded: 'shovel', hasGravity: true, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.GRAVEL, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- SAND (gravity) ---
  [BLOCKS.SAND]: {
    name: 'Sand', color: '#d4c47a', colorAlt: '#c4b46a',
    hardness: 2, toolNeeded: 'shovel', hasGravity: true, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.SAND, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- ORE BLOCKS ---
  [BLOCKS.COAL_ORE]: {
    name: 'Coal Ore', color: '#555555', colorAlt: '#222222',
    hardness: 5, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: 'ITEM_COAL', chance: 1.0, min: 1, max: 3 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.COPPER_ORE]: {
    name: 'Copper Ore', color: '#7a5a3a', colorAlt: '#c8824a',
    hardness: 6, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: 'ITEM_COPPER_RAW', chance: 1.0, min: 1, max: 2 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.IRON_ORE]: {
    name: 'Iron Ore', color: '#8a7a6a', colorAlt: '#d4a060',
    hardness: 7, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: 'ITEM_IRON_RAW', chance: 1.0, min: 1, max: 2 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.SILVER_ORE]: {
    name: 'Silver Ore', color: '#9aaabb', colorAlt: '#ccddee',
    hardness: 8, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: 'ITEM_SILVER_RAW', chance: 1.0, min: 1, max: 2 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.GOLD_ORE]: {
    name: 'Gold Ore', color: '#7a6a1a', colorAlt: '#ffdd44',
    hardness: 9, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: 'ITEM_GOLD_RAW', chance: 1.0, min: 1, max: 2 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.STEEL_ORE]: {
    name: 'Steel Ore', color: '#6a7a8a', colorAlt: '#aabbcc',
    hardness: 10, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: 'ITEM_STEEL_RAW', chance: 1.0, min: 1, max: 2 }],
    placeable: true, stackSize: 64
  },

  // --- CLAY ---
  [BLOCKS.CLAY]: {
    name: 'Clay', color: '#9aacbc', colorAlt: '#8a9cac',
    hardness: 2, toolNeeded: 'shovel', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: 'ITEM_CLAY_BALL', chance: 1.0, min: 4, max: 4 }],
    placeable: true, stackSize: 64
  },

  // --- GRASS ---
  [BLOCKS.GRASS]: {
    name: 'Grass', color: '#4a8a2a', colorAlt: '#5a3a1a',
    hardness: 2, toolNeeded: 'shovel', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.EARTH, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- TURF ---
  [BLOCKS.TURF]: {
    name: 'Turf', color: '#3a7a1a', colorAlt: '#2a5a10',
    hardness: 2, toolNeeded: 'shovel', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.TURF, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- FLOWERS (non-solid, transparent, decorative) ---
  [BLOCKS.FLOWER_1]: {
    name: 'Rose', color: '#cc2244', colorAlt: '#44aa44',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: BLOCKS.FLOWER_1, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.FLOWER_2]: {
    name: 'Daisy', color: '#eeeeaa', colorAlt: '#ffcc00',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: BLOCKS.FLOWER_2, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.FLOWER_3]: {
    name: 'Tulip', color: '#ff6644', colorAlt: '#44aa44',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: BLOCKS.FLOWER_3, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.FLOWER_4]: {
    name: 'Lavender', color: '#aa66cc', colorAlt: '#44aa44',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: BLOCKS.FLOWER_4, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.FLOWER_5]: {
    name: 'Sunflower', color: '#ffdd00', colorAlt: '#cc8800',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: BLOCKS.FLOWER_5, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- MUSHROOMS ---
  [BLOCKS.MUSHROOM_1]: {
    name: 'Brown Mushroom', color: '#aa7744', colorAlt: '#ddbbaa',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_MUSHROOM_BROWN', chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64,
    edible: true, foodValue: 2, poisonous: false
  },

  [BLOCKS.MUSHROOM_2]: {
    name: 'Red Mushroom', color: '#cc2222', colorAlt: '#ffffff',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_MUSHROOM_RED', chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64,
    edible: true, foodValue: 1, poisonous: true, poisonDuration: 5000
  },

  [BLOCKS.MUSHROOM_3]: {
    name: 'Blue Mushroom', color: '#4466ee', colorAlt: '#aaccff',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 3,
    drops: [{ id: 'ITEM_MUSHROOM_BLUE', chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64,
    edible: true, foodValue: 2, poisonous: false
  },

  [BLOCKS.MUSHROOM_4]: {
    name: 'Purple Mushroom', color: '#9933cc', colorAlt: '#ddaaff',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 1,
    drops: [{ id: 'ITEM_MUSHROOM_PURPLE', chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64,
    edible: true, foodValue: 1, poisonous: true, poisonDuration: 8000
  },

  [BLOCKS.MUSHROOM_5]: {
    name: 'White Mushroom', color: '#eeeedd', colorAlt: '#ccccbb',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_MUSHROOM_WHITE', chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64,
    edible: true, foodValue: 2, poisonous: false, restoresWater: 1
  },

  // --- ALGAE ---
  [BLOCKS.ALGAE]: {
    name: 'Algae', color: '#1a8844', colorAlt: '#22aa55',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: BLOCKS.ALGAE, chance: 1.0, min: 1, max: 2 }],
    placeable: true, stackSize: 64
  },

  // --- TREE ROOT ---
  [BLOCKS.TREE_ROOT]: {
    name: 'Tree Root', color: '#4a2a0a', colorAlt: '#3a1a00',
    hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.TREE_ROOT, chance: 0.7, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- LOGS ---
  [BLOCKS.LOG_OAK]: {
    name: 'Oak Log', color: '#5a3a1a', colorAlt: '#3a2a10',
    hardness: 4, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.LOG_OAK, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LOG_BIRCH]: {
    name: 'Birch Log', color: '#d4caba', colorAlt: '#444444',
    hardness: 4, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.LOG_BIRCH, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LOG_PINE]: {
    name: 'Pine Log', color: '#4a3020', colorAlt: '#2a1a10',
    hardness: 4, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.LOG_PINE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LOG_SPRUCE]: {
    name: 'Spruce Log', color: '#3a2818', colorAlt: '#2a1808',
    hardness: 4, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.LOG_SPRUCE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LOG_CEDAR]: {
    name: 'Cedar Log', color: '#6a4020', colorAlt: '#4a2810',
    hardness: 4, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.LOG_CEDAR, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- PLANKS ---
  [BLOCKS.PLANKS_OAK]: {
    name: 'Oak Planks', color: '#c8a050', colorAlt: '#b89040',
    hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.PLANKS_OAK, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.PLANKS_BIRCH]: {
    name: 'Birch Planks', color: '#e8d8b0', colorAlt: '#d8c8a0',
    hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.PLANKS_BIRCH, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.PLANKS_PINE]: {
    name: 'Pine Planks', color: '#a07040', colorAlt: '#906030',
    hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.PLANKS_PINE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.PLANKS_SPRUCE]: {
    name: 'Spruce Planks', color: '#806030', colorAlt: '#705020',
    hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.PLANKS_SPRUCE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.PLANKS_CEDAR]: {
    name: 'Cedar Planks', color: '#c08050', colorAlt: '#b07040',
    hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.PLANKS_CEDAR, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- LEAVES ---
  [BLOCKS.LEAVES_OAK]: {
    name: 'Oak Leaves', color: '#2a7a1a', colorAlt: '#3a9a2a',
    hardness: 1, toolNeeded: 'shears', hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    // Without shears, leaves break and drop nothing (or sapling rarely)
    drops: [{ id: 'ITEM_SAPLING_OAK', chance: 0.05, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LEAVES_BIRCH]: {
    name: 'Birch Leaves', color: '#5aaa3a', colorAlt: '#4a9a2a',
    hardness: 1, toolNeeded: 'shears', hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_SAPLING_BIRCH', chance: 0.05, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LEAVES_PINE]: {
    name: 'Pine Needles', color: '#1a5a1a', colorAlt: '#0a4a0a',
    hardness: 1, toolNeeded: 'shears', hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_SAPLING_PINE', chance: 0.05, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LEAVES_SPRUCE]: {
    name: 'Spruce Needles', color: '#0a4a1a', colorAlt: '#083a14',
    hardness: 1, toolNeeded: 'shears', hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_SAPLING_SPRUCE', chance: 0.05, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  [BLOCKS.LEAVES_CEDAR]: {
    name: 'Cedar Leaves', color: '#2a6a2a', colorAlt: '#1a5a1a',
    hardness: 1, toolNeeded: 'shears', hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_SAPLING_CEDAR', chance: 0.05, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- WATER ---
  [BLOCKS.WATER]: {
    name: 'Water', color: '#2255cc', colorAlt: '#3366dd',
    hardness: 0, toolNeeded: 'bucket', hasGravity: true, isFluid: true,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [], // Use bucket to collect
    placeable: false, stackSize: 1
  },

  // --- LAVA ---
  [BLOCKS.LAVA]: {
    name: 'Lava', color: '#dd4400', colorAlt: '#ff6600',
    hardness: 0, toolNeeded: 'bucket', hasGravity: true, isFluid: true,
    isTranspar: false, isSolid: false, lightLevel: 15,
    drops: [],
    placeable: false, stackSize: 1,
    damagePerSecond: 4  // Entities touching lava take 4 HP/s
  },

  // --- CRYSTAL ---
  [BLOCKS.CRYSTAL]: {
    name: 'Crystal', color: '#aaddff', colorAlt: '#eeffff',
    hardness: 8, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: true, lightLevel: 5,
    drops: [{ id: 'ITEM_CRYSTAL_SHARD', chance: 1.0, min: 1, max: 3 }],
    placeable: true, stackSize: 64
  },

  // --- GLASS variants ---
  [BLOCKS.GLASS]: {
    name: 'Glass', color: '#aaddee88', colorAlt: '#cceeff44',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: true, lightLevel: 0,
    drops: [], // Glass drops nothing when broken (like Minecraft)
    placeable: true, stackSize: 64
  },

  [BLOCKS.GLASS_RED]:    { name: 'Red Glass',    color: '#ee443388', colorAlt: '#cc221166', hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [], placeable: true, stackSize: 64 },
  [BLOCKS.GLASS_GREEN]:  { name: 'Green Glass',  color: '#44ee4488', colorAlt: '#22cc2266', hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [], placeable: true, stackSize: 64 },
  [BLOCKS.GLASS_BLUE]:   { name: 'Blue Glass',   color: '#4488ee88', colorAlt: '#2266cc66', hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [], placeable: true, stackSize: 64 },
  [BLOCKS.GLASS_YELLOW]: { name: 'Yellow Glass', color: '#eedd4488', colorAlt: '#ccbb2266', hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [], placeable: true, stackSize: 64 },
  [BLOCKS.GLASS_PURPLE]: { name: 'Purple Glass', color: '#aa44ee88', colorAlt: '#882acc66', hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [], placeable: true, stackSize: 64 },
  [BLOCKS.GLASS_BLACK]:  { name: 'Black Glass',  color: '#11111188', colorAlt: '#22222266', hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [], placeable: true, stackSize: 64 },
  [BLOCKS.GLASS_WHITE]:  { name: 'White Glass',  color: '#eeeeff88', colorAlt: '#ccccdd66', hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [], placeable: true, stackSize: 64 },

  // --- CHEST ---
  [BLOCKS.CHEST]: {
    name: 'Chest', color: '#a07030', colorAlt: '#805020',
    hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.CHEST, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 1,
    isContainer: true, containerSlots: 27  // Opens a 27-slot storage UI
  },

  // --- BEDS ---
  [BLOCKS.BED_WHITE]:  { name: 'White Bed',  color: '#eeeedd', colorAlt: '#8a5a3a', hardness: 2, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.BED_WHITE,  chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isCheckpoint: true },
  [BLOCKS.BED_RED]:    { name: 'Red Bed',    color: '#cc3333', colorAlt: '#8a5a3a', hardness: 2, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.BED_RED,    chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isCheckpoint: true },
  [BLOCKS.BED_BLUE]:   { name: 'Blue Bed',   color: '#3355cc', colorAlt: '#8a5a3a', hardness: 2, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.BED_BLUE,   chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isCheckpoint: true },
  [BLOCKS.BED_GREEN]:  { name: 'Green Bed',  color: '#33aa44', colorAlt: '#8a5a3a', hardness: 2, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.BED_GREEN,  chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isCheckpoint: true },

  // --- DOORS (2-block tall; top half handled by world.js) ---
  [BLOCKS.DOOR_OAK]:    { name: 'Oak Door',    color: '#c8a050', colorAlt: '#805020', hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.DOOR_OAK,    chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isDoor: true },
  [BLOCKS.DOOR_BIRCH]:  { name: 'Birch Door',  color: '#e8d8b0', colorAlt: '#a09060', hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.DOOR_BIRCH,  chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isDoor: true },
  [BLOCKS.DOOR_PINE]:   { name: 'Pine Door',   color: '#a07040', colorAlt: '#704020', hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.DOOR_PINE,   chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isDoor: true },
  [BLOCKS.DOOR_SPRUCE]: { name: 'Spruce Door', color: '#806030', colorAlt: '#503010', hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.DOOR_SPRUCE, chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isDoor: true },
  [BLOCKS.DOOR_CEDAR]:  { name: 'Cedar Door',  color: '#c08050', colorAlt: '#704030', hardness: 3, toolNeeded: 'axe', hasGravity: false, isFluid: false, isTranspar: true, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.DOOR_CEDAR,  chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 1, isDoor: true },

  // --- TORCH ---
  [BLOCKS.TORCH]: {
    name: 'Torch', color: '#ffcc44', colorAlt: '#ff8800',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 12,
    drops: [{ id: BLOCKS.TORCH, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- WIRE ---
  [BLOCKS.WIRE]: {
    name: 'Wire', color: '#cc4444', colorAlt: '#882222',
    hardness: 1, toolNeeded: null, hasGravity: false, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: BLOCKS.WIRE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- WOOL variants ---
  [BLOCKS.WOOL_WHITE]:  { name: 'White Wool',  color: '#eeeedd', colorAlt: '#ddddcc', hardness: 2, toolNeeded: 'shears', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.WOOL_WHITE,  chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 64 },
  [BLOCKS.WOOL_RED]:    { name: 'Red Wool',    color: '#cc3333', colorAlt: '#aa2222', hardness: 2, toolNeeded: 'shears', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.WOOL_RED,    chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 64 },
  [BLOCKS.WOOL_GREEN]:  { name: 'Green Wool',  color: '#33aa44', colorAlt: '#228833', hardness: 2, toolNeeded: 'shears', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.WOOL_GREEN,  chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 64 },
  [BLOCKS.WOOL_BLUE]:   { name: 'Blue Wool',   color: '#3355cc', colorAlt: '#2244aa', hardness: 2, toolNeeded: 'shears', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.WOOL_BLUE,   chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 64 },
  [BLOCKS.WOOL_YELLOW]: { name: 'Yellow Wool', color: '#eecc22', colorAlt: '#ccaa11', hardness: 2, toolNeeded: 'shears', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.WOOL_YELLOW, chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 64 },
  [BLOCKS.WOOL_PURPLE]: { name: 'Purple Wool', color: '#9933cc', colorAlt: '#7722aa', hardness: 2, toolNeeded: 'shears', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.WOOL_PURPLE, chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 64 },
  [BLOCKS.WOOL_BLACK]:  { name: 'Black Wool',  color: '#222222', colorAlt: '#111111', hardness: 2, toolNeeded: 'shears', hasGravity: false, isFluid: false, isTranspar: false, isSolid: true, lightLevel: 0, drops: [{ id: BLOCKS.WOOL_BLACK,  chance: 1.0, min: 1, max: 1 }], placeable: true, stackSize: 64 },

  // --- COINS ---
  [BLOCKS.COINS]: {
    name: 'Coins', color: '#ffdd22', colorAlt: '#ccaa00',
    hardness: 1, toolNeeded: null, hasGravity: true, isFluid: false,
    isTranspar: true, isSolid: false, lightLevel: 0,
    drops: [{ id: 'ITEM_COIN', chance: 1.0, min: 1, max: 5 }],
    placeable: false, stackSize: 999
  },

  // --- SANDSTONE ---
  [BLOCKS.SAND_STONE]: {
    name: 'Sandstone', color: '#d4b86a', colorAlt: '#c4a85a',
    hardness: 4, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.SAND_STONE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- COBBLESTONE ---
  [BLOCKS.COBBLESTONE]: {
    name: 'Cobblestone', color: '#666666', colorAlt: '#555555',
    hardness: 5, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.COBBLESTONE, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  },

  // --- BRICK ---
  [BLOCKS.BRICK]: {
    name: 'Brick', color: '#aa4433', colorAlt: '#882211',
    hardness: 5, toolNeeded: 'pickaxe', hasGravity: false, isFluid: false,
    isTranspar: false, isSolid: true, lightLevel: 0,
    drops: [{ id: BLOCKS.BRICK, chance: 1.0, min: 1, max: 1 }],
    placeable: true, stackSize: 64
  }
};

// -------------------------------------------------------------
// ITEM IDs — non-block items (tools, weapons, consumables, etc.)
// These are string-keyed to distinguish from numeric block IDs.
// -------------------------------------------------------------
const ITEMS = {
  // --- Raw materials (smelted in Furnace) ---
  COAL:           'ITEM_COAL',
  COPPER_RAW:     'ITEM_COPPER_RAW',
  IRON_RAW:       'ITEM_IRON_RAW',
  SILVER_RAW:     'ITEM_SILVER_RAW',
  GOLD_RAW:       'ITEM_GOLD_RAW',
  STEEL_RAW:      'ITEM_STEEL_RAW',
  CLAY_BALL:      'ITEM_CLAY_BALL',
  CRYSTAL_SHARD:  'ITEM_CRYSTAL_SHARD',
  COIN:           'ITEM_COIN',

  // --- Ingots (output of Furnace) ---
  COPPER_INGOT:   'ITEM_COPPER_INGOT',
  IRON_INGOT:     'ITEM_IRON_INGOT',
  SILVER_INGOT:   'ITEM_SILVER_INGOT',
  GOLD_INGOT:     'ITEM_GOLD_INGOT',
  STEEL_INGOT:    'ITEM_STEEL_INGOT',

  // --- Tools ---
  PICKAXE_WOOD:   'ITEM_PICKAXE_WOOD',
  PICKAXE_STONE:  'ITEM_PICKAXE_STONE',
  PICKAXE_COPPER: 'ITEM_PICKAXE_COPPER',
  PICKAXE_IRON:   'ITEM_PICKAXE_IRON',
  PICKAXE_GOLD:   'ITEM_PICKAXE_GOLD',
  PICKAXE_STEEL:  'ITEM_PICKAXE_STEEL',

  AXE_WOOD:       'ITEM_AXE_WOOD',
  AXE_STONE:      'ITEM_AXE_STONE',
  AXE_COPPER:     'ITEM_AXE_COPPER',
  AXE_IRON:       'ITEM_AXE_IRON',
  AXE_GOLD:       'ITEM_AXE_GOLD',
  AXE_STEEL:      'ITEM_AXE_STEEL',

  SHOVEL_WOOD:    'ITEM_SHOVEL_WOOD',
  SHOVEL_STONE:   'ITEM_SHOVEL_STONE',
  SHOVEL_COPPER:  'ITEM_SHOVEL_COPPER',
  SHOVEL_IRON:    'ITEM_SHOVEL_IRON',
  SHOVEL_GOLD:    'ITEM_SHOVEL_GOLD',
  SHOVEL_STEEL:   'ITEM_SHOVEL_STEEL',

  HAMMER_WOOD:    'ITEM_HAMMER_WOOD',
  HAMMER_STONE:   'ITEM_HAMMER_STONE',
  HAMMER_IRON:    'ITEM_HAMMER_IRON',
  HAMMER_STEEL:   'ITEM_HAMMER_STEEL',

  SHEARS:         'ITEM_SHEARS',       // Required to harvest Leaves & Wool
  FISHING_ROD:    'ITEM_FISHING_ROD',
  BUCKET_EMPTY:   'ITEM_BUCKET_EMPTY',
  BUCKET_WATER:   'ITEM_BUCKET_WATER',
  BUCKET_LAVA:    'ITEM_BUCKET_LAVA',

  // --- Weapons ---
  BLADE_WOOD:     'ITEM_BLADE_WOOD',
  BLADE_STONE:    'ITEM_BLADE_STONE',
  BLADE_COPPER:   'ITEM_BLADE_COPPER',
  BLADE_IRON:     'ITEM_BLADE_IRON',
  BLADE_SILVER:   'ITEM_BLADE_SILVER',
  BLADE_GOLD:     'ITEM_BLADE_GOLD',
  BLADE_STEEL:    'ITEM_BLADE_STEEL',

  BOW:            'ITEM_BOW',
  ARROW:          'ITEM_ARROW',
  MAGE_STAFF:     'ITEM_MAGE_STAFF',

  // --- Aborigine drops ---
  SPEAR:          'ITEM_SPEAR',
  BOOMERANG:      'ITEM_BOOMERANG',
  LOINCLOTH:      'ITEM_LOINCLOTH',   // Throw at aborigines to befriend

  // --- Armor ---
  HELMET_LEATHER: 'ITEM_HELMET_LEATHER',
  HELMET_COPPER:  'ITEM_HELMET_COPPER',
  HELMET_IRON:    'ITEM_HELMET_IRON',
  HELMET_STEEL:   'ITEM_HELMET_STEEL',

  CHESTPLATE_LEATHER: 'ITEM_CHESTPLATE_LEATHER',
  CHESTPLATE_COPPER:  'ITEM_CHESTPLATE_COPPER',
  CHESTPLATE_IRON:    'ITEM_CHESTPLATE_IRON',
  CHESTPLATE_STEEL:   'ITEM_CHESTPLATE_STEEL',

  LEGGINGS_LEATHER: 'ITEM_LEGGINGS_LEATHER',
  LEGGINGS_COPPER:  'ITEM_LEGGINGS_COPPER',
  LEGGINGS_IRON:    'ITEM_LEGGINGS_IRON',
  LEGGINGS_STEEL:   'ITEM_LEGGINGS_STEEL',

  BOOTS_LEATHER:  'ITEM_BOOTS_LEATHER',
  BOOTS_COPPER:   'ITEM_BOOTS_COPPER',
  BOOTS_IRON:     'ITEM_BOOTS_IRON',
  BOOTS_STEEL:    'ITEM_BOOTS_STEEL',

  // --- Consumables & potions ---
  POTION_ENERGY:  'ITEM_POTION_ENERGY',   // Restores stamina over time
  POTION_HEALTH:  'ITEM_POTION_HEALTH',   // Restores HP
  POTION_WATER:   'ITEM_POTION_WATER',    // Restores water stat
  POTION_ANTIDOTE:'ITEM_POTION_ANTIDOTE', // Cures poison

  BREAD:          'ITEM_BREAD',
  COOKED_MEAT:    'ITEM_COOKED_MEAT',
  RAW_MEAT:       'ITEM_RAW_MEAT',
  COOKED_FISH:    'ITEM_COOKED_FISH',
  RAW_FISH:       'ITEM_RAW_FISH',
  MUSHROOM_STEW:  'ITEM_MUSHROOM_STEW',

  // --- Mushroom pickups ---
  MUSHROOM_BROWN:  'ITEM_MUSHROOM_BROWN',
  MUSHROOM_RED:    'ITEM_MUSHROOM_RED',
  MUSHROOM_BLUE:   'ITEM_MUSHROOM_BLUE',
  MUSHROOM_PURPLE: 'ITEM_MUSHROOM_PURPLE',
  MUSHROOM_WHITE:  'ITEM_MUSHROOM_WHITE',

  // --- Saplings ---
  SAPLING_OAK:    'ITEM_SAPLING_OAK',
  SAPLING_BIRCH:  'ITEM_SAPLING_BIRCH',
  SAPLING_PINE:   'ITEM_SAPLING_PINE',
  SAPLING_SPRUCE: 'ITEM_SAPLING_SPRUCE',
  SAPLING_CEDAR:  'ITEM_SAPLING_CEDAR',

  // --- Dyes ---
  DYE_RED:    'ITEM_DYE_RED',
  DYE_GREEN:  'ITEM_DYE_GREEN',
  DYE_BLUE:   'ITEM_DYE_BLUE',
  DYE_YELLOW: 'ITEM_DYE_YELLOW',
  DYE_PURPLE: 'ITEM_DYE_PURPLE',
  DYE_BLACK:  'ITEM_DYE_BLACK',
  DYE_WHITE:  'ITEM_DYE_WHITE',

  // --- Misc ---
  BACKPACK:   'ITEM_BACKPACK',  // Expands inventory from 14 to 28 slots
  ROPE:       'ITEM_ROPE',
  FLINT:      'ITEM_FLINT',
  STICK:      'ITEM_STICK',
  STRING:     'ITEM_STRING',
  LEATHER:    'ITEM_LEATHER',
  WOOL_ITEM:  'ITEM_WOOL',      // Raw wool (item form, before dyeing)
};

// -------------------------------------------------------------
// ITEM_DEFS — full definition for every non-block item.
// Properties:
//   name        {string}  Display name
//   color       {string}  Icon base color for canvas rendering
//   stackSize   {number}  Max stack in inventory
//   toolType    {string|null} 'pickaxe'|'axe'|'shovel'|'shears'|'bucket'|null
//   toolSpeed   {number}  Break speed multiplier (1 = default)
//   toolLevel   {number}  0=wood,1=stone,2=copper,3=iron,4=gold,5=steel
//   damage      {number}  Base damage on hit (0 for non-weapons)
//   cooldown    {number}  Milliseconds between attacks
//   missChance  {number}  0.0–1.0 probability of a miss
//   armorValue  {number}  Armor points provided (armor items only)
//   armorSlot   {string|null} 'head'|'chest'|'legs'|'feet'|null
//   isConsumable{boolean} True → RMB hold triggers use effect
//   useEffect   {object|null} Effect applied on consumption
//   isAmmo      {boolean} True → used as ammo by Bow
// -------------------------------------------------------------
const ITEM_DEFS = {

  // ---- RAW MATERIALS ----------------------------------------
  [ITEMS.COAL]:          { name: 'Coal',          color: '#222222', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.COPPER_RAW]:    { name: 'Raw Copper',    color: '#c8824a', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.IRON_RAW]:      { name: 'Raw Iron',      color: '#d4a060', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SILVER_RAW]:    { name: 'Raw Silver',    color: '#ccddee', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.GOLD_RAW]:      { name: 'Raw Gold',      color: '#ffdd44', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.STEEL_RAW]:     { name: 'Raw Steel',     color: '#aabbcc', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.CLAY_BALL]:     { name: 'Clay Ball',     color: '#9aacbc', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.CRYSTAL_SHARD]: { name: 'Crystal Shard', color: '#aaddff', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.COIN]:          { name: 'Coin',          color: '#ffdd22', stackSize: 999,toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.STICK]:         { name: 'Stick',         color: '#a07030', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 1, cooldown: 500,  missChance: 0.2, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.FLINT]:         { name: 'Flint',         color: '#555566', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 1, cooldown: 600,  missChance: 0.25,armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.STRING]:        { name: 'String',        color: '#eeeedd', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.LEATHER]:       { name: 'Leather',       color: '#aa7744', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.ROPE]:          { name: 'Rope',          color: '#aa9966', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.WOOL_ITEM]:     { name: 'Wool',          color: '#eeeedd', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BACKPACK]:      { name: 'Backpack',      color: '#8a6040', stackSize: 1,  toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,    missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- INGOTS -----------------------------------------------
  [ITEMS.COPPER_INGOT]:  { name: 'Copper Ingot',  color: '#e8924a', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.IRON_INGOT]:    { name: 'Iron Ingot',    color: '#d4b090', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SILVER_INGOT]:  { name: 'Silver Ingot',  color: '#ddeeff', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.GOLD_INGOT]:    { name: 'Gold Ingot',    color: '#ffee44', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.STEEL_INGOT]:   { name: 'Steel Ingot',   color: '#bbccdd', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- PICKAXES ---------------------------------------------
  // toolLevel: 0=wood 1=stone 2=copper 3=iron 4=gold 5=steel
  [ITEMS.PICKAXE_WOOD]:   { name: 'Wooden Pickaxe',  color: '#c8a050', stackSize: 1, toolType: 'pickaxe', toolSpeed: 1.5, toolLevel: 0, damage: 2, cooldown: 700, missChance: 0.15, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.PICKAXE_STONE]:  { name: 'Stone Pickaxe',   color: '#888888', stackSize: 1, toolType: 'pickaxe', toolSpeed: 2.0, toolLevel: 1, damage: 3, cooldown: 650, missChance: 0.12, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.PICKAXE_COPPER]: { name: 'Copper Pickaxe',  color: '#e8924a', stackSize: 1, toolType: 'pickaxe', toolSpeed: 2.5, toolLevel: 2, damage: 4, cooldown: 600, missChance: 0.10, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.PICKAXE_IRON]:   { name: 'Iron Pickaxe',    color: '#d4b090', stackSize: 1, toolType: 'pickaxe', toolSpeed: 3.5, toolLevel: 3, damage: 5, cooldown: 550, missChance: 0.08, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.PICKAXE_GOLD]:   { name: 'Gold Pickaxe',    color: '#ffee44', stackSize: 1, toolType: 'pickaxe', toolSpeed: 5.0, toolLevel: 4, damage: 3, cooldown: 450, missChance: 0.06, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.PICKAXE_STEEL]:  { name: 'Steel Pickaxe',   color: '#bbccdd', stackSize: 1, toolType: 'pickaxe', toolSpeed: 6.0, toolLevel: 5, damage: 7, cooldown: 500, missChance: 0.05, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- AXES -------------------------------------------------
  [ITEMS.AXE_WOOD]:   { name: 'Wooden Axe',  color: '#c8a050', stackSize: 1, toolType: 'axe', toolSpeed: 1.5, toolLevel: 0, damage: 3,  cooldown: 800, missChance: 0.15, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.AXE_STONE]:  { name: 'Stone Axe',   color: '#888888', stackSize: 1, toolType: 'axe', toolSpeed: 2.0, toolLevel: 1, damage: 4,  cooldown: 750, missChance: 0.12, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.AXE_COPPER]: { name: 'Copper Axe',  color: '#e8924a', stackSize: 1, toolType: 'axe', toolSpeed: 2.5, toolLevel: 2, damage: 5,  cooldown: 700, missChance: 0.10, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.AXE_IRON]:   { name: 'Iron Axe',    color: '#d4b090', stackSize: 1, toolType: 'axe', toolSpeed: 3.0, toolLevel: 3, damage: 7,  cooldown: 650, missChance: 0.08, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.AXE_GOLD]:   { name: 'Gold Axe',    color: '#ffee44', stackSize: 1, toolType: 'axe', toolSpeed: 4.5, toolLevel: 4, damage: 5,  cooldown: 550, missChance: 0.06, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.AXE_STEEL]:  { name: 'Steel Axe',   color: '#bbccdd', stackSize: 1, toolType: 'axe', toolSpeed: 5.5, toolLevel: 5, damage: 10, cooldown: 600, missChance: 0.05, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- SHOVELS ----------------------------------------------
  [ITEMS.SHOVEL_WOOD]:   { name: 'Wooden Shovel',  color: '#c8a050', stackSize: 1, toolType: 'shovel', toolSpeed: 1.5, toolLevel: 0, damage: 1, cooldown: 700, missChance: 0.20, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SHOVEL_STONE]:  { name: 'Stone Shovel',   color: '#888888', stackSize: 1, toolType: 'shovel', toolSpeed: 2.0, toolLevel: 1, damage: 2, cooldown: 650, missChance: 0.18, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SHOVEL_COPPER]: { name: 'Copper Shovel',  color: '#e8924a', stackSize: 1, toolType: 'shovel', toolSpeed: 2.5, toolLevel: 2, damage: 2, cooldown: 600, missChance: 0.15, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SHOVEL_IRON]:   { name: 'Iron Shovel',    color: '#d4b090', stackSize: 1, toolType: 'shovel', toolSpeed: 3.5, toolLevel: 3, damage: 3, cooldown: 550, missChance: 0.12, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SHOVEL_GOLD]:   { name: 'Gold Shovel',    color: '#ffee44', stackSize: 1, toolType: 'shovel', toolSpeed: 5.0, toolLevel: 4, damage: 2, cooldown: 450, missChance: 0.10, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SHOVEL_STEEL]:  { name: 'Steel Shovel',   color: '#bbccdd', stackSize: 1, toolType: 'shovel', toolSpeed: 6.0, toolLevel: 5, damage: 4, cooldown: 500, missChance: 0.08, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- HAMMERS ----------------------------------------------
  [ITEMS.HAMMER_WOOD]:  { name: 'Wooden Hammer',  color: '#c8a050', stackSize: 1, toolType: 'hammer', toolSpeed: 1.2, toolLevel: 0, damage: 4,  cooldown: 1000, missChance: 0.20, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.HAMMER_STONE]: { name: 'Stone Hammer',   color: '#888888', stackSize: 1, toolType: 'hammer', toolSpeed: 1.5, toolLevel: 1, damage: 6,  cooldown: 950,  missChance: 0.18, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.HAMMER_IRON]:  { name: 'Iron Hammer',    color: '#d4b090', stackSize: 1, toolType: 'hammer', toolSpeed: 2.0, toolLevel: 3, damage: 9,  cooldown: 900,  missChance: 0.15, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.HAMMER_STEEL]: { name: 'Steel Hammer',   color: '#bbccdd', stackSize: 1, toolType: 'hammer', toolSpeed: 3.0, toolLevel: 5, damage: 13, cooldown: 850,  missChance: 0.12, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- SPECIAL TOOLS ----------------------------------------
  [ITEMS.SHEARS]:      { name: 'Shears',      color: '#aaaaaa', stackSize: 1,  toolType: 'shears',  toolSpeed: 3.0, toolLevel: 2, damage: 1, cooldown: 400, missChance: 0.10, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.FISHING_ROD]: { name: 'Fishing Rod', color: '#8a6030', stackSize: 1,  toolType: 'fishing', toolSpeed: 1.0, toolLevel: 0, damage: 0, cooldown: 0,   missChance: 0,    armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BUCKET_EMPTY]:{ name: 'Bucket',      color: '#aaaaaa', stackSize: 1,  toolType: 'bucket',  toolSpeed: 1.0, toolLevel: 0, damage: 1, cooldown: 500, missChance: 0.20, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BUCKET_WATER]:{ name: 'Water Bucket',color: '#2255cc', stackSize: 1,  toolType: 'bucket',  toolSpeed: 1.0, toolLevel: 0, damage: 0, cooldown: 0,   missChance: 0,    armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BUCKET_LAVA]: { name: 'Lava Bucket', color: '#dd4400', stackSize: 1,  toolType: 'bucket',  toolSpeed: 1.0, toolLevel: 0, damage: 0, cooldown: 0,   missChance: 0,    armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- BLADES (swords) --------------------------------------
  [ITEMS.BLADE_WOOD]:   { name: 'Wooden Blade',  color: '#c8a050', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 4,  cooldown: 600, missChance: 0.15, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BLADE_STONE]:  { name: 'Stone Blade',   color: '#888888', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 6,  cooldown: 580, missChance: 0.13, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BLADE_COPPER]: { name: 'Copper Blade',  color: '#e8924a', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 8,  cooldown: 560, missChance: 0.11, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BLADE_IRON]:   { name: 'Iron Blade',    color: '#d4b090', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 10, cooldown: 540, missChance: 0.09, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BLADE_SILVER]: { name: 'Silver Blade',  color: '#ddeeff', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 12, cooldown: 520, missChance: 0.08, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BLADE_GOLD]:   { name: 'Gold Blade',    color: '#ffee44', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 9,  cooldown: 480, missChance: 0.07, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BLADE_STEEL]:  { name: 'Steel Blade',   color: '#bbccdd', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 16, cooldown: 500, missChance: 0.05, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- RANGED WEAPONS ---------------------------------------
  [ITEMS.BOW]:    { name: 'Bow',   color: '#8a6030', stackSize: 1,  toolType: null, toolSpeed: 1, toolLevel: 0, damage: 8, cooldown: 800, missChance: 0.20, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.ARROW]:  { name: 'Arrow', color: '#aaaaaa', stackSize: 128,toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0,   missChance: 0,    armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: true  },

  // Mage Staff: uses Crystal Shards as ammo
  [ITEMS.MAGE_STAFF]: { name: 'Mage Staff', color: '#aaddff', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 14, cooldown: 1200, missChance: 0.10, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- ABORIGINE DROPS --------------------------------------
  [ITEMS.SPEAR]:     { name: 'Spear',     color: '#8a6030', stackSize: 1,  toolType: null, toolSpeed: 1, toolLevel: 0, damage: 11, cooldown: 900, missChance: 0.10, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BOOMERANG]: { name: 'Boomerang', color: '#c8a050', stackSize: 1,  toolType: null, toolSpeed: 1, toolLevel: 0, damage: 7,  cooldown: 700, missChance: 0.15, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.LOINCLOTH]: { name: 'Loincloth', color: '#c8a878', stackSize: 16, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0,  cooldown: 0,   missChance: 0,    armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- ARMOR ------------------------------------------------
  // armorValue contributes to the 10-point armor stat total
  [ITEMS.HELMET_LEATHER]:     { name: 'Leather Helmet',     color: '#aa7744', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 1, armorSlot: 'head',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.HELMET_COPPER]:      { name: 'Copper Helmet',      color: '#e8924a', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 2, armorSlot: 'head',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.HELMET_IRON]:        { name: 'Iron Helmet',        color: '#d4b090', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 3, armorSlot: 'head',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.HELMET_STEEL]:       { name: 'Steel Helmet',       color: '#bbccdd', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 4, armorSlot: 'head',  isConsumable: false, useEffect: null, isAmmo: false },

  [ITEMS.CHESTPLATE_LEATHER]: { name: 'Leather Chestplate', color: '#aa7744', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 2, armorSlot: 'chest', isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.CHESTPLATE_COPPER]:  { name: 'Copper Chestplate',  color: '#e8924a', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 3, armorSlot: 'chest', isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.CHESTPLATE_IRON]:    { name: 'Iron Chestplate',    color: '#d4b090', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 5, armorSlot: 'chest', isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.CHESTPLATE_STEEL]:   { name: 'Steel Chestplate',   color: '#bbccdd', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 7, armorSlot: 'chest', isConsumable: false, useEffect: null, isAmmo: false },

  [ITEMS.LEGGINGS_LEATHER]:   { name: 'Leather Leggings',   color: '#aa7744', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 1, armorSlot: 'legs',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.LEGGINGS_COPPER]:    { name: 'Copper Leggings',    color: '#e8924a', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 2, armorSlot: 'legs',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.LEGGINGS_IRON]:      { name: 'Iron Leggings',      color: '#d4b090', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 3, armorSlot: 'legs',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.LEGGINGS_STEEL]:     { name: 'Steel Leggings',     color: '#bbccdd', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 5, armorSlot: 'legs',  isConsumable: false, useEffect: null, isAmmo: false },

  [ITEMS.BOOTS_LEATHER]:      { name: 'Leather Boots',      color: '#aa7744', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 1, armorSlot: 'feet',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BOOTS_COPPER]:       { name: 'Copper Boots',       color: '#e8924a', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 1, armorSlot: 'feet',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BOOTS_IRON]:         { name: 'Iron Boots',         color: '#d4b090', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 2, armorSlot: 'feet',  isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.BOOTS_STEEL]:        { name: 'Steel Boots',        color: '#bbccdd', stackSize: 1, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 3, armorSlot: 'feet',  isConsumable: false, useEffect: null, isAmmo: false },

  // ---- POTIONS ----------------------------------------------
  [ITEMS.POTION_ENERGY]: {
    name: 'Energy Potion', color: '#44cc88', stackSize: 8,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    // Effect: restores stamina 3x faster for 10 seconds
    useEffect: { type: 'stamina_regen', multiplier: 3, duration: 10000 },
    isAmmo: false
  },
  [ITEMS.POTION_HEALTH]: {
    name: 'Health Potion', color: '#cc2244', stackSize: 8,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    // Effect: instantly restores 6 HP
    useEffect: { type: 'heal', amount: 6 },
    isAmmo: false
  },
  [ITEMS.POTION_WATER]: {
    name: 'Water Potion', color: '#2255cc', stackSize: 8,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    // Effect: restores 5 water units
    useEffect: { type: 'water', amount: 5 },
    isAmmo: false
  },
  [ITEMS.POTION_ANTIDOTE]: {
    name: 'Antidote', color: '#88cc44', stackSize: 8,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    // Effect: cures all active poison effects
    useEffect: { type: 'cure_poison' },
    isAmmo: false
  },

  // ---- FOOD -------------------------------------------------
  [ITEMS.BREAD]: {
    name: 'Bread', color: '#d4a050', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 3 },
    isAmmo: false
  },
  [ITEMS.COOKED_MEAT]: {
    name: 'Cooked Meat', color: '#aa5522', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 4 },
    isAmmo: false
  },
  [ITEMS.RAW_MEAT]: {
    name: 'Raw Meat', color: '#cc6644', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    // Raw meat gives less food and has poison chance
    useEffect: { type: 'food', amount: 2, poisonChance: 0.3, poisonDuration: 4000 },
    isAmmo: false
  },
  [ITEMS.COOKED_FISH]: {
    name: 'Cooked Fish', color: '#88aacc', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 3, waterBonus: 1 },
    isAmmo: false
  },
  [ITEMS.RAW_FISH]: {
    name: 'Raw Fish', color: '#aaccee', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 1, waterBonus: 1, poisonChance: 0.2, poisonDuration: 3000 },
    isAmmo: false
  },
  [ITEMS.MUSHROOM_STEW]: {
    name: 'Mushroom Stew', color: '#aa7744', stackSize: 4,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 5, waterBonus: 2 },
    isAmmo: false
  },

  // ---- MUSHROOM PICKUPS ------------------------------------
  [ITEMS.MUSHROOM_BROWN]: {
    name: 'Brown Mushroom', color: '#aa7744', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 2 },
    isAmmo: false
  },
  [ITEMS.MUSHROOM_RED]: {
    name: 'Red Mushroom', color: '#cc2222', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 1, poisonChance: 1.0, poisonDuration: 5000 },
    isAmmo: false
  },
  [ITEMS.MUSHROOM_BLUE]: {
    name: 'Blue Mushroom', color: '#4466ee', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 2, glowDuration: 15000 },
    isAmmo: false
  },
  [ITEMS.MUSHROOM_PURPLE]: {
    name: 'Purple Mushroom', color: '#9933cc', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 1, poisonChance: 1.0, poisonDuration: 8000 },
    isAmmo: false
  },
  [ITEMS.MUSHROOM_WHITE]: {
    name: 'White Mushroom', color: '#eeeedd', stackSize: 16,
    toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0,
    armorValue: 0, armorSlot: null, isConsumable: true,
    useEffect: { type: 'food', amount: 2, waterBonus: 1 },
    isAmmo: false
  },

  // ---- SAPLINGS --------------------------------------------
  [ITEMS.SAPLING_OAK]:    { name: 'Oak Sapling',    color: '#2a7a1a', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SAPLING_BIRCH]:  { name: 'Birch Sapling',  color: '#5aaa3a', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SAPLING_PINE]:   { name: 'Pine Sapling',   color: '#1a5a1a', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SAPLING_SPRUCE]: { name: 'Spruce Sapling', color: '#0a4a1a', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.SAPLING_CEDAR]:  { name: 'Cedar Sapling',  color: '#2a6a2a', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },

  // ---- DYES ------------------------------------------------
  [ITEMS.DYE_RED]:    { name: 'Red Dye',    color: '#cc2222', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.DYE_GREEN]:  { name: 'Green Dye',  color: '#22aa44', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.DYE_BLUE]:   { name: 'Blue Dye',   color: '#2244cc', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.DYE_YELLOW]: { name: 'Yellow Dye', color: '#eecc22', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.DYE_PURPLE]: { name: 'Purple Dye', color: '#9922cc', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.DYE_BLACK]:  { name: 'Black Dye',  color: '#222222', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
  [ITEMS.DYE_WHITE]:  { name: 'White Dye',  color: '#eeeedd', stackSize: 64, toolType: null, toolSpeed: 1, toolLevel: 0, damage: 0, cooldown: 0, missChance: 0, armorValue: 0, armorSlot: null, isConsumable: false, useEffect: null, isAmmo: false },
};

// -------------------------------------------------------------
// BIOME IDs
// -------------------------------------------------------------
const BIOMES = {
  PLAINS:        0,
  FOREST:        1,
  PINE_FOREST:   2,
  BIRCH_FOREST:  3,
  DESERT:        4,
  SAVANNA:       5,
  SWAMP:         6,
  MOUNTAINS:     7,
  SNOW_PLAINS:   8,
  SNOW_FOREST:   9,
  BEACH:         10,
  OCEAN:         11,
  RIVER:         12,
  JUNGLE:        13,
  MESA:          14,
  _COUNT:        15
};

// Biome definitions: surface block, tree type, colors, spawn rules
const BIOME_DEFS = {
  [BIOMES.PLAINS]: {
    name: 'Plains',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: 'OAK',
    treeChance: 0.004,
    flowerChance: 0.012,
    mushroomChance: 0.001,
    fogColor: '#c8e8ff',
    skyColor: '#88ccff',
    grassColor: '#5aaa3a',
    tempMin: 10, tempMax: 25,
    rainChance: 0.3,
    mobSpawnTable: ['SHEEP', 'COW', 'PIG', 'CHICKEN', 'RABBIT', 'FOX', 'WOLF', 'ABORIGINE']
  },
  [BIOMES.FOREST]: {
    name: 'Forest',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: 'OAK',
    treeChance: 0.025,
    flowerChance: 0.008,
    mushroomChance: 0.004,
    fogColor: '#a8d8a8',
    skyColor: '#66aadd',
    grassColor: '#3a9a2a',
    tempMin: 8, tempMax: 20,
    rainChance: 0.45,
    mobSpawnTable: ['WOLF', 'BEAR', 'DEER', 'FOX', 'RABBIT', 'ABORIGINE']
  },
  [BIOMES.PINE_FOREST]: {
    name: 'Pine Forest',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: 'PINE',
    treeChance: 0.030,
    flowerChance: 0.003,
    mushroomChance: 0.008,
    fogColor: '#88aa88',
    skyColor: '#557799',
    grassColor: '#2a7a2a',
    tempMin: 2, tempMax: 15,
    rainChance: 0.50,
    mobSpawnTable: ['WOLF', 'BEAR', 'DEER', 'OWL', 'ABORIGINE']
  },
  [BIOMES.BIRCH_FOREST]: {
    name: 'Birch Forest',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: 'BIRCH',
    treeChance: 0.028,
    flowerChance: 0.010,
    mushroomChance: 0.003,
    fogColor: '#d8eedd',
    skyColor: '#88ccee',
    grassColor: '#4aaa3a',
    tempMin: 6, tempMax: 18,
    rainChance: 0.35,
    mobSpawnTable: ['DEER', 'RABBIT', 'FOX', 'WOLF', 'ABORIGINE']
  },
  [BIOMES.DESERT]: {
    name: 'Desert',
    surfaceBlock: BLOCKS.SAND,
    subSurfaceBlock: BLOCKS.SAND,
    stoneBlock: BLOCKS.SAND_STONE,
    treeType: null,
    treeChance: 0,
    flowerChance: 0,
    mushroomChance: 0,
    fogColor: '#eecc88',
    skyColor: '#ddbb66',
    grassColor: '#d4c47a',
    tempMin: 30, tempMax: 50,
    rainChance: 0.02,
    mobSpawnTable: ['SCORPION', 'SNAKE', 'CAMEL', 'ABORIGINE']
  },
  [BIOMES.SAVANNA]: {
    name: 'Savanna',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: 'CEDAR',
    treeChance: 0.006,
    flowerChance: 0.004,
    mushroomChance: 0.001,
    fogColor: '#ddcc88',
    skyColor: '#ccaa55',
    grassColor: '#8aaa2a',
    tempMin: 22, tempMax: 38,
    rainChance: 0.10,
    mobSpawnTable: ['LION', 'ZEBRA', 'GIRAFFE', 'ELEPHANT', 'ABORIGINE']
  },
  [BIOMES.SWAMP]: {
    name: 'Swamp',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.CLAY,
    stoneBlock: BLOCKS.STONE,
    treeType: 'OAK',
    treeChance: 0.015,
    flowerChance: 0.002,
    mushroomChance: 0.012,
    fogColor: '#667755',
    skyColor: '#445544',
    grassColor: '#3a6a2a',
    tempMin: 15, tempMax: 28,
    rainChance: 0.60,
    mobSpawnTable: ['CROCODILE', 'FROG', 'SNAKE', 'MOSQUITO', 'ABORIGINE']
  },
  [BIOMES.MOUNTAINS]: {
    name: 'Mountains',
    surfaceBlock: BLOCKS.STONE,
    subSurfaceBlock: BLOCKS.STONE,
    stoneBlock: BLOCKS.STONE,
    treeType: 'SPRUCE',
    treeChance: 0.008,
    flowerChance: 0.002,
    mushroomChance: 0.002,
    fogColor: '#aabbcc',
    skyColor: '#7799bb',
    grassColor: '#2a6a2a',
    tempMin: -5, tempMax: 10,
    rainChance: 0.40,
    mobSpawnTable: ['GOAT', 'EAGLE', 'BEAR', 'WOLF', 'ABORIGINE']
  },
  [BIOMES.SNOW_PLAINS]: {
    name: 'Snow Plains',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: null,
    treeChance: 0,
    flowerChance: 0,
    mushroomChance: 0,
    fogColor: '#ddeeff',
    skyColor: '#aaccee',
    grassColor: '#99bbcc',
    tempMin: -20, tempMax: -2,
    rainChance: 0.60,   // Snow
    mobSpawnTable: ['POLAR_BEAR', 'PENGUIN', 'RABBIT', 'ABORIGINE']
  },
  [BIOMES.SNOW_FOREST]: {
    name: 'Snow Forest',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: 'SPRUCE',
    treeChance: 0.022,
    flowerChance: 0,
    mushroomChance: 0.002,
    fogColor: '#ccddee',
    skyColor: '#8899aa',
    grassColor: '#8899aa',
    tempMin: -25, tempMax: -5,
    rainChance: 0.55,
    mobSpawnTable: ['POLAR_BEAR', 'WOLF', 'OWL', 'ABORIGINE']
  },
  [BIOMES.BEACH]: {
    name: 'Beach',
    surfaceBlock: BLOCKS.SAND,
    subSurfaceBlock: BLOCKS.SAND,
    stoneBlock: BLOCKS.SAND_STONE,
    treeType: null,
    treeChance: 0,
    flowerChance: 0,
    mushroomChance: 0,
    fogColor: '#aaddff',
    skyColor: '#55aaee',
    grassColor: '#d4c47a',
    tempMin: 18, tempMax: 30,
    rainChance: 0.15,
    mobSpawnTable: ['CRAB', 'SEAGULL', 'TURTLE']
  },
  [BIOMES.OCEAN]: {
    name: 'Ocean',
    surfaceBlock: BLOCKS.WATER,
    subSurfaceBlock: BLOCKS.SAND,
    stoneBlock: BLOCKS.STONE,
    treeType: null,
    treeChance: 0,
    flowerChance: 0,
    mushroomChance: 0,
    fogColor: '#1144aa',
    skyColor: '#2255bb',
    grassColor: '#1a4488',
    tempMin: 5, tempMax: 20,
    rainChance: 0.30,
    mobSpawnTable: ['FISH', 'SHARK', 'SQUID', 'WHALE']
  },
  [BIOMES.RIVER]: {
    name: 'River',
    surfaceBlock: BLOCKS.WATER,
    subSurfaceBlock: BLOCKS.GRAVEL,
    stoneBlock: BLOCKS.STONE,
    treeType: 'OAK',
    treeChance: 0.005,
    flowerChance: 0.004,
    mushroomChance: 0.001,
    fogColor: '#88bbdd',
    skyColor: '#66aacc',
    grassColor: '#4a9a3a',
    tempMin: 5, tempMax: 22,
    rainChance: 0.35,
    mobSpawnTable: ['FISH', 'FROG', 'DUCK', 'BEAVER']
  },
  [BIOMES.JUNGLE]: {
    name: 'Jungle',
    surfaceBlock: BLOCKS.GRASS,
    subSurfaceBlock: BLOCKS.EARTH,
    stoneBlock: BLOCKS.STONE,
    treeType: 'CEDAR',
    treeChance: 0.045,
    flowerChance: 0.020,
    mushroomChance: 0.010,
    fogColor: '#226622',
    skyColor: '#335533',
    grassColor: '#1a8a1a',
    tempMin: 25, tempMax: 40,
    rainChance: 0.70,
    mobSpawnTable: ['PARROT', 'SNAKE', 'JAGUAR', 'MONKEY', 'ABORIGINE']
  },
  [BIOMES.MESA]: {
    name: 'Mesa',
    surfaceBlock: BLOCKS.SAND,
    subSurfaceBlock: BLOCKS.CLAY,
    stoneBlock: BLOCKS.SAND_STONE,
    treeType: null,
    treeChance: 0,
    flowerChance: 0,
    mushroomChance: 0,
    fogColor: '#cc8844',
    skyColor: '#bb7733',
    grassColor: '#aa6622',
    tempMin: 25, tempMax: 45,
    rainChance: 0.05,
    mobSpawnTable: ['SCORPION', 'SNAKE', 'VULTURE', 'ABORIGINE']
  }
};

// -------------------------------------------------------------
// MOB DEFS
// Properties:
//   name        {string}
//   color       {string}   Primary color for canvas rendering
//   hp          {number}   Max hit points
//   damage      {number}   Damage per hit
//   speed       {number}   Movement speed (tiles/second)
//   armor       {number}   Damage reduction (flat)
//   hostile     {boolean}  Attacks player on sight
//   aggroRange  {number}   Tiles at which mob detects player
//   dropTable   {Array}    {id, chance, min, max}
//   isBoss      {boolean}
//   canBefriend {boolean}  True for aborigines when loincloth thrown
//   xpValue     {number}   XP given on kill
// -------------------------------------------------------------
const MOB_DEFS = {
  // ---- PASSIVE ANIMALS ------------------------------------
  SHEEP:    { name: 'Sheep',    color: '#eeeedd', hp: 8,  damage: 0,  speed: 2.0, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.WOOL_ITEM, chance: 1.0, min: 1, max: 3 }, { id: ITEMS.RAW_MEAT, chance: 0.7, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 2 },
  COW:      { name: 'Cow',      color: '#886644', hp: 12, damage: 0,  speed: 1.8, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 4 }, { id: ITEMS.LEATHER, chance: 1.0, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 3 },
  PIG:      { name: 'Pig',      color: '#ffaaaa', hp: 10, damage: 0,  speed: 2.2, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 3 }], isBoss: false, canBefriend: false, xpValue: 2 },
  CHICKEN:  { name: 'Chicken',  color: '#ffffff', hp: 4,  damage: 0,  speed: 2.5, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 1, max: 2 }, { id: ITEMS.STRING, chance: 0.5, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 1 },
  RABBIT:   { name: 'Rabbit',   color: '#ddccaa', hp: 3,  damage: 0,  speed: 3.5, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 0.8, min: 1, max: 1 }, { id: ITEMS.LEATHER, chance: 0.5, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 1 },
  DEER:     { name: 'Deer',     color: '#aa7744', hp: 14, damage: 0,  speed: 3.8, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 5 }, { id: ITEMS.LEATHER, chance: 1.0, min: 1, max: 3 }], isBoss: false, canBefriend: false, xpValue: 4 },
  DUCK:     { name: 'Duck',     color: '#88aa44', hp: 4,  damage: 0,  speed: 2.0, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 1, max: 2 }, { id: ITEMS.STRING, chance: 0.3, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 1 },
  FISH:     { name: 'Fish',     color: '#4488cc', hp: 2,  damage: 0,  speed: 2.5, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_FISH, chance: 1.0, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 1 },
  CAMEL:    { name: 'Camel',    color: '#ddbb66', hp: 20, damage: 2,  speed: 2.5, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 4 }, { id: ITEMS.LEATHER, chance: 1.0, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 5 },
  PENGUIN:  { name: 'Penguin',  color: '#222222', hp: 6,  damage: 0,  speed: 1.5, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_FISH, chance: 0.8, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 2 },
  TURTLE:   { name: 'Turtle',   color: '#44aa44', hp: 10, damage: 0,  speed: 1.0, armor: 3, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.LEATHER, chance: 0.6, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 3 },
  CRAB:     { name: 'Crab',     color: '#cc5522', hp: 6,  damage: 2,  speed: 1.8, armor: 2, hostile: false, aggroRange: 3,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 2 },
  FROG:     { name: 'Frog',     color: '#44aa22', hp: 4,  damage: 0,  speed: 2.8, armor: 0, hostile: false, aggroRange: 0,  dropTable: [], isBoss: false, canBefriend: false, xpValue: 1 },
  MONKEY:   { name: 'Monkey',   color: '#886633', hp: 8,  damage: 1,  speed: 3.5, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 0.5, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 2 },
  PARROT:   { name: 'Parrot',   color: '#ee4422', hp: 4,  damage: 0,  speed: 3.0, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.STRING, chance: 0.5, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 1 },
  BEAVER:   { name: 'Beaver',   color: '#885533', hp: 8,  damage: 1,  speed: 2.0, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.LEATHER, chance: 0.8, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 2 },
  SEAGULL:  { name: 'Seagull',  color: '#ffffff', hp: 3,  damage: 0,  speed: 3.0, armor: 0, hostile: false, aggroRange: 0,  dropTable: [], isBoss: false, canBefriend: false, xpValue: 1 },
  OWL:      { name: 'Owl',      color: '#887755', hp: 5,  damage: 0,  speed: 2.5, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.STRING, chance: 0.4, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 1 },
  ZEBRA:    { name: 'Zebra',    color: '#eeeeee', hp: 16, damage: 2,  speed: 4.0, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 4 }, { id: ITEMS.LEATHER, chance: 1.0, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 4 },
  GIRAFFE:  { name: 'Giraffe',  color: '#ddaa44', hp: 20, damage: 3,  speed: 3.0, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 3, max: 6 }, { id: ITEMS.LEATHER, chance: 1.0, min: 2, max: 3 }], isBoss: false, canBefriend: false, xpValue: 5 },
  ELEPHANT: { name: 'Elephant', color: '#888888', hp: 40, damage: 6,  speed: 2.5, armor: 2, hostile: false, aggroRange: 4,  dropTable: [{ id: ITEMS.LEATHER, chance: 1.0, min: 3, max: 5 }], isBoss: false, canBefriend: false, xpValue: 10 },
  GOAT:        { name: 'Goat',       color: '#cccccc', hp: 10, damage: 2,  speed: 3.0, armor: 0, hostile: false, aggroRange: 5,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 0.8, min: 1, max: 2 }, { id: ITEMS.WOOL_ITEM, chance: 0.6, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 3 },
  POLAR_BEAR:  { name: 'Polar Bear', color: '#eeeeff', hp: 30, damage: 8,  speed: 2.8, armor: 1, hostile: false, aggroRange: 6,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 5 }, { id: ITEMS.LEATHER, chance: 1.0, min: 2, max: 4 }], isBoss: false, canBefriend: false, xpValue: 10 },
  SQUID:       { name: 'Squid',      color: '#554477', hp: 8,  damage: 0,  speed: 1.8, armor: 0, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.STRING, chance: 1.0, min: 1, max: 3 }], isBoss: false, canBefriend: false, xpValue: 2 },
  WHALE:       { name: 'Whale',      color: '#334466', hp: 80, damage: 10, speed: 1.5, armor: 3, hostile: false, aggroRange: 0,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 5, max: 10 }, { id: ITEMS.LEATHER, chance: 1.0, min: 3, max: 6 }], isBoss: false, canBefriend: false, xpValue: 20 },
  EAGLE:       { name: 'Eagle',      color: '#885522', hp: 12, damage: 4,  speed: 4.5, armor: 0, hostile: false, aggroRange: 8,  dropTable: [{ id: ITEMS.STRING, chance: 0.6, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 4 },
  VULTURE:     { name: 'Vulture',    color: '#554433', hp: 10, damage: 3,  speed: 3.5, armor: 0, hostile: false, aggroRange: 6,  dropTable: [{ id: ITEMS.STRING, chance: 0.5, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 3 },

  // ---- HOSTILE MOBS ----------------------------------------
  FOX:         { name: 'Fox',        color: '#dd6622', hp: 8,  damage: 3,  speed: 3.8, armor: 0, hostile: false, aggroRange: 4,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 0.7, min: 1, max: 2 }, { id: ITEMS.LEATHER, chance: 0.5, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 3 },
  WOLF:        { name: 'Wolf',       color: '#778899', hp: 14, damage: 5,  speed: 4.0, armor: 0, hostile: true,  aggroRange: 8,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 0.7, min: 1, max: 2 }, { id: ITEMS.LEATHER, chance: 0.5, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 5 },
  BEAR:        { name: 'Bear',       color: '#664422', hp: 30, damage: 9,  speed: 2.8, armor: 1, hostile: true,  aggroRange: 6,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 3, max: 6 }, { id: ITEMS.LEATHER, chance: 1.0, min: 2, max: 4 }], isBoss: false, canBefriend: false, xpValue: 12 },
  LION:        { name: 'Lion',       color: '#ddaa44', hp: 28, damage: 11, speed: 4.5, armor: 0, hostile: true,  aggroRange: 10, dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 5 }, { id: ITEMS.LEATHER, chance: 1.0, min: 1, max: 3 }], isBoss: false, canBefriend: false, xpValue: 14 },
  JAGUAR:      { name: 'Jaguar',     color: '#aa8822', hp: 22, damage: 10, speed: 5.0, armor: 0, hostile: true,  aggroRange: 9,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 4 }, { id: ITEMS.LEATHER, chance: 1.0, min: 1, max: 2 }], isBoss: false, canBefriend: false, xpValue: 12 },
  SHARK:       { name: 'Shark',      color: '#556677', hp: 35, damage: 13, speed: 4.0, armor: 1, hostile: true,  aggroRange: 12, dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 3, max: 6 }], isBoss: false, canBefriend: false, xpValue: 16 },
  CROCODILE:   { name: 'Crocodile',  color: '#336622', hp: 32, damage: 12, speed: 2.5, armor: 3, hostile: true,  aggroRange: 7,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 1.0, min: 2, max: 5 }, { id: ITEMS.LEATHER, chance: 1.0, min: 2, max: 4 }], isBoss: false, canBefriend: false, xpValue: 15 },
  SCORPION:    { name: 'Scorpion',   color: '#885500', hp: 12, damage: 6,  speed: 2.5, armor: 2, hostile: true,  aggroRange: 5,  dropTable: [{ id: ITEMS.FLINT, chance: 0.5, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 6,  poisonOnHit: true, poisonDuration: 4000 },
  SNAKE:       { name: 'Snake',      color: '#448833', hp: 8,  damage: 4,  speed: 3.0, armor: 0, hostile: true,  aggroRange: 5,  dropTable: [{ id: ITEMS.RAW_MEAT, chance: 0.6, min: 1, max: 1 }, { id: ITEMS.LEATHER, chance: 0.4, min: 1, max: 1 }], isBoss: false, canBefriend: false, xpValue: 5,  poisonOnHit: true, poisonDuration: 5000 },
  MOSQUITO:    { name: 'Mosquito',   color: '#332211', hp: 2,  damage: 1,  speed: 4.0, armor: 0, hostile: true,  aggroRange: 6,  dropTable: [], isBoss: false, canBefriend: false, xpValue: 1, poisonOnHit: true, poisonDuration: 2000 },

  // ---- ABORIGINES ------------------------------------------
  // Hostile by default; throw LOINCLOTH to befriend (canBefriend: true)
  ABORIGINE: {
    name: 'Aborigine', color: '#aa7744', hp: 18, damage: 7, speed: 3.2, armor: 0,
    hostile: true, aggroRange: 9,
    dropTable: [
      { id: ITEMS.SPEAR,     chance: 0.4, min: 1, max: 1 },
      { id: ITEMS.BOOMERANG, chance: 0.3, min: 1, max: 1 },
      { id: ITEMS.LOINCLOTH, chance: 0.6, min: 1, max: 1 },
      { id: ITEMS.COIN,      chance: 0.8, min: 1, max: 5 }
    ],
    isBoss: false, canBefriend: true,
    befriendItem: ITEMS.LOINCLOTH,
    // When befriended, follows player and fights enemies
    friendlyBehavior: 'follow_and_fight',
    xpValue: 8
  },

  // ---- BOSSES ----------------------------------------------
  BEAR_KING: {
    name: 'Bear King', color: '#331100', hp: 200, damage: 20, speed: 3.0, armor: 5,
    hostile: true, aggroRange: 16,
    dropTable: [
      { id: ITEMS.RAW_MEAT,    chance: 1.0, min: 8,  max: 15 },
      { id: ITEMS.LEATHER,     chance: 1.0, min: 5,  max: 8  },
      { id: ITEMS.CRYSTAL_SHARD, chance: 1.0, min: 3, max: 6 },
      { id: ITEMS.COIN,        chance: 1.0, min: 20, max: 40 }
    ],
    isBoss: true, canBefriend: false, xpValue: 100,
    // Special: charges player every 8 seconds, dealing 2x damage
    specialAttack: { type: 'charge', cooldown: 8000, damageMultiplier: 2 }
  },

  DESERT_WORM: {
    name: 'Desert Worm', color: '#cc9944', hp: 280, damage: 18, speed: 2.2, armor: 4,
    hostile: true, aggroRange: 20,
    dropTable: [
      { id: ITEMS.GOLD_RAW,     chance: 1.0, min: 5,  max: 10 },
      { id: ITEMS.CRYSTAL_SHARD,chance: 1.0, min: 4,  max: 8  },
      { id: ITEMS.COIN,         chance: 1.0, min: 30, max: 60 }
    ],
    isBoss: true, canBefriend: false, xpValue: 150,
    // Special: burrows underground and resurfaces under player
    specialAttack: { type: 'burrow', cooldown: 10000, damageMultiplier: 2.5 }
  },

  SWAMP_HYDRA: {
    name: 'Swamp Hydra', color: '#225522', hp: 350, damage: 22, speed: 1.8, armor: 6,
    hostile: true, aggroRange: 18,
    dropTable: [
      { id: ITEMS.LEATHER,      chance: 1.0, min: 6,  max: 10 },
      { id: ITEMS.CRYSTAL_SHARD,chance: 1.0, min: 5,  max: 9  },
      { id: ITEMS.COIN,         chance: 1.0, min: 40, max: 80 }
    ],
    isBoss: true, canBefriend: false, xpValue: 180,
    poisonOnHit: true, poisonDuration: 10000,
    // Special: spits poison projectile every 5 seconds
    specialAttack: { type: 'poison_spit', cooldown: 5000, damageMultiplier: 1.5 }
  },

  MOUNTAIN_GOLEM: {
    name: 'Mountain Golem', color: '#667788', hp: 500, damage: 25, speed: 1.5, armor: 10,
    hostile: true, aggroRange: 14,
    dropTable: [
      { id: ITEMS.IRON_RAW,     chance: 1.0, min: 8,  max: 15 },
      { id: ITEMS.STEEL_RAW,    chance: 1.0, min: 4,  max: 8  },
      { id: ITEMS.CRYSTAL_SHARD,chance: 1.0, min: 6,  max: 12 },
      { id: ITEMS.COIN,         chance: 1.0, min: 50, max: 100}
    ],
    isBoss: true, canBefriend: false, xpValue: 250,
    // Special: stomps ground creating shockwave in 5-block radius
    specialAttack: { type: 'stomp', cooldown: 12000, damageMultiplier: 3, radius: 5 }
  },

  OCEAN_KRAKEN: {
    name: 'Ocean Kraken', color: '#112244', hp: 600, damage: 28, speed: 2.0, armor: 8,
    hostile: true, aggroRange: 22,
    dropTable: [
      { id: ITEMS.STRING,       chance: 1.0, min: 10, max: 20 },
      { id: ITEMS.CRYSTAL_SHARD,chance: 1.0, min: 8,  max: 14 },
      { id: ITEMS.COIN,         chance: 1.0, min: 60, max: 120}
    ],
    isBoss: true, canBefriend: false, xpValue: 300,
    // Special: grabs player with tentacle, holds for 3s dealing tick damage
    specialAttack: { type: 'grab', cooldown: 15000, damagePerTick: 5, holdDuration: 3000 }
  }
};

// -------------------------------------------------------------
// CRAFTING RECIPES
// Each recipe: { ingredients: [{id, count}], result: {id, count}, station }
// station: 'hand'|'workbench'|'furnace'|'anvil'
// -------------------------------------------------------------
const RECIPES = [

  // ---- HAND CRAFTING ---------------------------------------
  { ingredients: [{ id: BLOCKS.LOG_OAK,    count: 1 }], result: { id: BLOCKS.PLANKS_OAK,    count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.LOG_BIRCH,  count: 1 }], result: { id: BLOCKS.PLANKS_BIRCH,  count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.LOG_PINE,   count: 1 }], result: { id: BLOCKS.PLANKS_PINE,   count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.LOG_SPRUCE, count: 1 }], result: { id: BLOCKS.PLANKS_SPRUCE, count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.LOG_CEDAR,  count: 1 }], result: { id: BLOCKS.PLANKS_CEDAR,  count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.PLANKS_OAK, count: 2 }], result: { id: ITEMS.STICK,          count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.PLANKS_BIRCH,  count: 2 }], result: { id: ITEMS.STICK,       count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.PLANKS_PINE,   count: 2 }], result: { id: ITEMS.STICK,       count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.PLANKS_SPRUCE, count: 2 }], result: { id: ITEMS.STICK,       count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.PLANKS_CEDAR,  count: 2 }], result: { id: ITEMS.STICK,       count: 4 }, station: 'hand' },
  { ingredients: [{ id: BLOCKS.SAND,       count: 4 }], result: { id: BLOCKS.SAND_STONE,     count: 1 }, station: 'hand' },
  { ingredients: [{ id: ITEMS.CLAY_BALL,   count: 4 }], result: { id: BLOCKS.CLAY,           count: 1 }, station: 'hand' },

  // ---- WORKBENCH CRAFTING ----------------------------------
  // Tools: Pickaxes
  { ingredients: [{ id: BLOCKS.PLANKS_OAK, count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.PICKAXE_WOOD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.COBBLESTONE, count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.PICKAXE_STONE,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.PICKAXE_COPPER, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.IRON_INGOT,   count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.PICKAXE_IRON,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.GOLD_INGOT,   count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.PICKAXE_GOLD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT,  count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.PICKAXE_STEEL,  count: 1 }, station: 'workbench' },

  // Tools: Axes
  { ingredients: [{ id: BLOCKS.PLANKS_OAK,  count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.AXE_WOOD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.COBBLESTONE, count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.AXE_STONE,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.AXE_COPPER, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.IRON_INGOT,   count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.AXE_IRON,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.GOLD_INGOT,   count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.AXE_GOLD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT,  count: 3 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.AXE_STEEL,  count: 1 }, station: 'workbench' },

  // Tools: Shovels
  { ingredients: [{ id: BLOCKS.PLANKS_OAK,  count: 1 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.SHOVEL_WOOD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.COBBLESTONE, count: 1 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.SHOVEL_STONE,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 1 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.SHOVEL_COPPER, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.IRON_INGOT,   count: 1 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.SHOVEL_IRON,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.GOLD_INGOT,   count: 1 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.SHOVEL_GOLD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT,  count: 1 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.SHOVEL_STEEL,  count: 1 }, station: 'workbench' },

  // Tools: Hammers
  { ingredients: [{ id: BLOCKS.PLANKS_OAK,  count: 4 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.HAMMER_WOOD,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.COBBLESTONE, count: 4 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.HAMMER_STONE, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.IRON_INGOT,   count: 4 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.HAMMER_IRON,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT,  count: 4 }, { id: ITEMS.STICK, count: 2 }], result: { id: ITEMS.HAMMER_STEEL, count: 1 }, station: 'workbench' },

  // Special tools
  { ingredients: [{ id: ITEMS.IRON_INGOT,   count: 2 }],                                result: { id: ITEMS.SHEARS,       count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.PLANKS_OAK,  count: 2 }, { id: ITEMS.STRING, count: 2 }],result: { id: ITEMS.FISHING_ROD,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.IRON_INGOT,   count: 3 }],                                result: { id: ITEMS.BUCKET_EMPTY, count: 1 }, station: 'workbench' },

  // Weapons: Blades
  { ingredients: [{ id: BLOCKS.PLANKS_OAK,  count: 2 }, { id: ITEMS.STICK,        count: 1 }], result: { id: ITEMS.BLADE_WOOD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.COBBLESTONE, count: 2 }, { id: ITEMS.STICK,        count: 1 }], result: { id: ITEMS.BLADE_STONE,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 2 }, { id: ITEMS.STICK,        count: 1 }], result: { id: ITEMS.BLADE_COPPER, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.IRON_INGOT,   count: 2 }, { id: ITEMS.STICK,        count: 1 }], result: { id: ITEMS.BLADE_IRON,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.SILVER_INGOT, count: 2 }, { id: ITEMS.STICK,        count: 1 }], result: { id: ITEMS.BLADE_SILVER, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.GOLD_INGOT,   count: 2 }, { id: ITEMS.STICK,        count: 1 }], result: { id: ITEMS.BLADE_GOLD,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT,  count: 2 }, { id: ITEMS.STICK,        count: 1 }], result: { id: ITEMS.BLADE_STEEL,  count: 1 }, station: 'workbench' },

  // Weapons: Bow & Arrow
  { ingredients: [{ id: ITEMS.STICK, count: 3 }, { id: ITEMS.STRING, count: 3 }],              result: { id: ITEMS.BOW,   count: 1  }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.STICK, count: 1 }, { id: ITEMS.FLINT,  count: 1 }, { id: ITEMS.STRING, count: 1 }], result: { id: ITEMS.ARROW, count: 8 }, station: 'workbench' },

  // Weapons: Mage Staff
  { ingredients: [{ id: ITEMS.STICK, count: 2 }, { id: ITEMS.CRYSTAL_SHARD, count: 4 }],       result: { id: ITEMS.MAGE_STAFF, count: 1 }, station: 'workbench' },

  // Armor: Leather
  { ingredients: [{ id: ITEMS.LEATHER, count: 5 }],  result: { id: ITEMS.HELMET_LEATHER,     count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.LEATHER, count: 8 }],  result: { id: ITEMS.CHESTPLATE_LEATHER, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.LEATHER, count: 7 }],  result: { id: ITEMS.LEGGINGS_LEATHER,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.LEATHER, count: 4 }],  result: { id: ITEMS.BOOTS_LEATHER,      count: 1 }, station: 'workbench' },

  // Misc workbench
  { ingredients: [{ id: BLOCKS.PLANKS_OAK, count: 8 }], result: { id: BLOCKS.CHEST,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.PLANKS_OAK, count: 3 }, { id: ITEMS.WOOL_ITEM, count: 3 }], result: { id: BLOCKS.BED_WHITE, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.PLANKS_OAK, count: 6 }], result: { id: BLOCKS.DOOR_OAK,    count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.PLANKS_BIRCH,  count: 6 }], result: { id: BLOCKS.DOOR_BIRCH,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.PLANKS_PINE,   count: 6 }], result: { id: BLOCKS.DOOR_PINE,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.PLANKS_SPRUCE, count: 6 }], result: { id: BLOCKS.DOOR_SPRUCE, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.PLANKS_CEDAR,  count: 6 }], result: { id: BLOCKS.DOOR_CEDAR,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.STICK, count: 1 }, { id: ITEMS.COAL, count: 1 }],               result: { id: BLOCKS.TORCH, count: 4 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.LEATHER, count: 6 }, { id: ITEMS.STRING, count: 4 }],           result: { id: ITEMS.BACKPACK, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 4 }, { id: ITEMS.STRING, count: 2 }],         result: { id: ITEMS.ROPE, count: 4 }, station: 'workbench' },

  // Dyes from flowers
  { ingredients: [{ id: BLOCKS.FLOWER_1, count: 2 }], result: { id: ITEMS.DYE_RED,    count: 2 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.FLOWER_2, count: 2 }], result: { id: ITEMS.DYE_WHITE,  count: 2 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.FLOWER_3, count: 2 }], result: { id: ITEMS.DYE_RED,    count: 2 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.FLOWER_4, count: 2 }], result: { id: ITEMS.DYE_PURPLE, count: 2 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.FLOWER_5, count: 2 }], result: { id: ITEMS.DYE_YELLOW, count: 2 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.ALGAE,    count: 2 }], result: { id: ITEMS.DYE_GREEN,  count: 2 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.COAL,      count: 1 }], result: { id: ITEMS.DYE_BLACK,  count: 2 }, station: 'workbench' },

  // Wool dyeing
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 1 }, { id: ITEMS.DYE_RED,    count: 1 }], result: { id: BLOCKS.WOOL_RED,    count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 1 }, { id: ITEMS.DYE_GREEN,  count: 1 }], result: { id: BLOCKS.WOOL_GREEN,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 1 }, { id: ITEMS.DYE_BLUE,   count: 1 }], result: { id: BLOCKS.WOOL_BLUE,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 1 }, { id: ITEMS.DYE_YELLOW, count: 1 }], result: { id: BLOCKS.WOOL_YELLOW, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 1 }, { id: ITEMS.DYE_PURPLE, count: 1 }], result: { id: BLOCKS.WOOL_PURPLE, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 1 }, { id: ITEMS.DYE_BLACK,  count: 1 }], result: { id: BLOCKS.WOOL_BLACK,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: ITEMS.WOOL_ITEM, count: 1 }, { id: ITEMS.DYE_WHITE,  count: 1 }], result: { id: BLOCKS.WOOL_WHITE,  count: 1 }, station: 'workbench' },

  // Glass dyeing
  { ingredients: [{ id: BLOCKS.GLASS, count: 1 }, { id: ITEMS.DYE_RED,    count: 1 }], result: { id: BLOCKS.GLASS_RED,    count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.GLASS, count: 1 }, { id: ITEMS.DYE_GREEN,  count: 1 }], result: { id: BLOCKS.GLASS_GREEN,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.GLASS, count: 1 }, { id: ITEMS.DYE_BLUE,   count: 1 }], result: { id: BLOCKS.GLASS_BLUE,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.GLASS, count: 1 }, { id: ITEMS.DYE_YELLOW, count: 1 }], result: { id: BLOCKS.GLASS_YELLOW, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.GLASS, count: 1 }, { id: ITEMS.DYE_PURPLE, count: 1 }], result: { id: BLOCKS.GLASS_PURPLE, count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.GLASS, count: 1 }, { id: ITEMS.DYE_BLACK,  count: 1 }], result: { id: BLOCKS.GLASS_BLACK,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.GLASS, count: 1 }, { id: ITEMS.DYE_WHITE,  count: 1 }], result: { id: BLOCKS.GLASS_WHITE,  count: 1 }, station: 'workbench' },

  // Bed dyeing
  { ingredients: [{ id: BLOCKS.BED_WHITE, count: 1 }, { id: ITEMS.DYE_RED,   count: 1 }], result: { id: BLOCKS.BED_RED,   count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.BED_WHITE, count: 1 }, { id: ITEMS.DYE_BLUE,  count: 1 }], result: { id: BLOCKS.BED_BLUE,  count: 1 }, station: 'workbench' },
  { ingredients: [{ id: BLOCKS.BED_WHITE, count: 1 }, { id: ITEMS.DYE_GREEN, count: 1 }], result: { id: BLOCKS.BED_GREEN, count: 1 }, station: 'workbench' },

  // Potions (workbench pre-mix, then furnace to finish)
  { ingredients: [{ id: ITEMS.MUSHROOM_BROWN, count: 2 }, { id: ITEMS.BUCKET_WATER, count: 1 }], result: { id: ITEMS.MUSHROOM_STEW,   count: 1 }, station: 'workbench' },

  // ---- FURNACE SMELTING ------------------------------------
  // Ores → Ingots (fuel: COAL)
  { ingredients: [{ id: ITEMS.COPPER_RAW, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.COPPER_INGOT, count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.IRON_RAW,   count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.IRON_INGOT,   count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.SILVER_RAW, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.SILVER_INGOT, count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.GOLD_RAW,   count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.GOLD_INGOT,   count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.STEEL_RAW,  count: 1 }, { id: ITEMS.COAL, count: 2 }], result: { id: ITEMS.STEEL_INGOT,  count: 1 }, station: 'furnace' },

  // Sand → Glass
  { ingredients: [{ id: BLOCKS.SAND, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: BLOCKS.GLASS, count: 1 }, station: 'furnace' },

  // Clay → Brick
  { ingredients: [{ id: ITEMS.CLAY_BALL, count: 4 }, { id: ITEMS.COAL, count: 1 }], result: { id: BLOCKS.BRICK, count: 1 }, station: 'furnace' },

  // Stone → Cobblestone smelted back
  { ingredients: [{ id: BLOCKS.COBBLESTONE, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: BLOCKS.STONE, count: 1 }, station: 'furnace' },

  // Food cooking
  { ingredients: [{ id: ITEMS.RAW_MEAT, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.COOKED_MEAT, count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.RAW_FISH, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.COOKED_FISH, count: 1 }, station: 'furnace' },

  // Potions (finish in furnace)
  { ingredients: [{ id: ITEMS.CRYSTAL_SHARD, count: 2 }, { id: ITEMS.BUCKET_WATER, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.POTION_ENERGY,  count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.MUSHROOM_RED,  count: 1 }, { id: ITEMS.BUCKET_WATER, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.POTION_HEALTH,  count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.MUSHROOM_BLUE, count: 1 }, { id: ITEMS.BUCKET_WATER, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.POTION_WATER,   count: 1 }, station: 'furnace' },
  { ingredients: [{ id: ITEMS.MUSHROOM_WHITE,count: 2 }, { id: ITEMS.BUCKET_WATER, count: 1 }, { id: ITEMS.COAL, count: 1 }], result: { id: ITEMS.POTION_ANTIDOTE,count: 1 }, station: 'furnace' },

  // ---- ANVIL CRAFTING --------------------------------------
  // Armor: Copper
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 5 }], result: { id: ITEMS.HELMET_COPPER,     count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 8 }], result: { id: ITEMS.CHESTPLATE_COPPER,  count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 7 }], result: { id: ITEMS.LEGGINGS_COPPER,    count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.COPPER_INGOT, count: 4 }], result: { id: ITEMS.BOOTS_COPPER,       count: 1 }, station: 'anvil' },

  // Armor: Iron
  { ingredients: [{ id: ITEMS.IRON_INGOT, count: 5 }], result: { id: ITEMS.HELMET_IRON,      count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.IRON_INGOT, count: 8 }], result: { id: ITEMS.CHESTPLATE_IRON,  count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.IRON_INGOT, count: 7 }], result: { id: ITEMS.LEGGINGS_IRON,    count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.IRON_INGOT, count: 4 }], result: { id: ITEMS.BOOTS_IRON,       count: 1 }, station: 'anvil' },

  // Armor: Steel
  { ingredients: [{ id: ITEMS.STEEL_INGOT, count: 5 }], result: { id: ITEMS.HELMET_STEEL,     count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT, count: 8 }], result: { id: ITEMS.CHESTPLATE_STEEL, count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT, count: 7 }], result: { id: ITEMS.LEGGINGS_STEEL,   count: 1 }, station: 'anvil' },
  { ingredients: [{ id: ITEMS.STEEL_INGOT, count: 4 }], result: { id: ITEMS.BOOTS_STEEL,      count: 1 }, station: 'anvil' },

  // Anvil: repair tool by combining two damaged tools of same type
  { ingredients: [{ id: ITEMS.PICKAXE_IRON, count: 2 }], result: { id: ITEMS.PICKAXE_IRON, count: 1 }, station: 'anvil', isRepair: true },
  { ingredients: [{ id: ITEMS.PICKAXE_STEEL,count: 2 }], result: { id: ITEMS.PICKAXE_STEEL,count: 1 }, station: 'anvil', isRepair: true },
  { ingredients: [{ id: ITEMS.AXE_IRON,     count: 2 }], result: { id: ITEMS.AXE_IRON,     count: 1 }, station: 'anvil', isRepair: true },
  { ingredients: [{ id: ITEMS.AXE_STEEL,    count: 2 }], result: { id: ITEMS.AXE_STEEL,    count: 1 }, station: 'anvil', isRepair: true },
  { ingredients: [{ id: ITEMS.BLADE_IRON,   count: 2 }], result: { id: ITEMS.BLADE_IRON,   count: 1 }, station: 'anvil', isRepair: true },
  { ingredients: [{ id: ITEMS.BLADE_STEEL,  count: 2 }], result: { id: ITEMS.BLADE_STEEL,  count: 1 }, station: 'anvil', isRepair: true },
];

// -------------------------------------------------------------
// STRUCTURE DEFS
// Pre-built multi-block structures placed during world gen.
// Each structure is a 2D array of block IDs (null = skip).
// origin: where the bottom-left corner of the grid anchors.
// -------------------------------------------------------------
const STRUCTURES = {

  // Small oak house (7 wide x 6 tall)
  OAK_HOUSE: {
    chance: 0.0004,
    biomes: [BIOMES.PLAINS, BIOMES.FOREST, BIOMES.BIRCH_FOREST],
    // grid[row][col], row 0 = top
    grid: [
      [null,               BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, null              ],
      [BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK ],
      [BLOCKS.PLANKS_OAK, BLOCKS.GLASS,      null,               null,               null,               BLOCKS.GLASS,      BLOCKS.PLANKS_OAK ],
      [BLOCKS.PLANKS_OAK, BLOCKS.GLASS,      null,               null,               null,               BLOCKS.GLASS,      BLOCKS.PLANKS_OAK ],
      [BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.DOOR_OAK,   BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK ],
      [BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE ]
    ],
    // Chest loot spawned inside
    loot: { chance: 0.8, table: [
      { id: ITEMS.COIN,        chance: 1.0, min: 3,  max: 10 },
      { id: ITEMS.BREAD,       chance: 0.7, min: 1,  max: 3  },
      { id: ITEMS.COAL,        chance: 0.8, min: 2,  max: 6  },
      { id: ITEMS.IRON_RAW,    chance: 0.4, min: 1,  max: 3  }
    ]}
  },

  // Desert pyramid (9 wide x 7 tall)
  DESERT_PYRAMID: {
    chance: 0.0003,
    biomes: [BIOMES.DESERT, BIOMES.MESA],
    grid: [
      [null,                null,                null,                null,                BLOCKS.SAND_STONE,   null,                null,                null,                null               ],
      [null,                null,                null,                BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   null,                null,                null               ],
      [null,                null,                BLOCKS.SAND_STONE,  BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   null,                null               ],
      [null,                BLOCKS.SAND_STONE,  BLOCKS.SAND_STONE,  null,                null,                null,                BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   null               ],
      [BLOCKS.SAND_STONE,  BLOCKS.SAND_STONE,  null,                null,                null,                null,                null,                BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE  ],
      [BLOCKS.SAND_STONE,  BLOCKS.SAND_STONE,  null,                null,                BLOCKS.CHEST,        null,                null,                BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE  ],
      [BLOCKS.SAND_STONE,  BLOCKS.SAND_STONE,  BLOCKS.SAND_STONE,  BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE,   BLOCKS.SAND_STONE  ]
    ],
    loot: { chance: 1.0, table: [
      { id: ITEMS.COIN,         chance: 1.0, min: 10, max: 30 },
      { id: ITEMS.GOLD_RAW,     chance: 0.8, min: 2,  max: 6  },
      { id: ITEMS.CRYSTAL_SHARD,chance: 0.5, min: 1,  max: 3  },
      { id: ITEMS.BLADE_GOLD,   chance: 0.3, min: 1,  max: 1  }
    ]}
  },

  // Abandoned mine entrance (5 wide x 4 tall)
  MINE_ENTRANCE: {
    chance: 0.0005,
    biomes: [BIOMES.MOUNTAINS, BIOMES.PLAINS, BIOMES.FOREST],
    grid: [
      [BLOCKS.COBBLESTONE, BLOCKS.COBBLESTONE, BLOCKS.COBBLESTONE, BLOCKS.COBBLESTONE, BLOCKS.COBBLESTONE],
      [BLOCKS.COBBLESTONE, null,               null,               null,               BLOCKS.COBBLESTONE],
      [BLOCKS.COBBLESTONE, null,               BLOCKS.TORCH,       null,               BLOCKS.COBBLESTONE],
      [BLOCKS.COBBLESTONE, BLOCKS.COBBLESTONE, null,               BLOCKS.COBBLESTONE, BLOCKS.COBBLESTONE]
    ],
    loot: { chance: 0.6, table: [
      { id: ITEMS.COAL,        chance: 1.0, min: 4,  max: 10 },
      { id: ITEMS.IRON_RAW,    chance: 0.7, min: 2,  max: 5  },
      { id: ITEMS.COPPER_RAW,  chance: 0.6, min: 2,  max: 4  },
      { id: ITEMS.PICKAXE_WOOD,chance: 0.4, min: 1,  max: 1  }
    ]}
  },

  // Swamp hut (5 wide x 5 tall)
  SWAMP_HUT: {
    chance: 0.0004,
    biomes: [BIOMES.SWAMP],
    grid: [
      [null,               BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK,  null              ],
      [BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK ],
      [BLOCKS.PLANKS_OAK, BLOCKS.GLASS,        null,               BLOCKS.GLASS,        BLOCKS.PLANKS_OAK ],
      [BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK,  BLOCKS.DOOR_OAK,   BLOCKS.PLANKS_OAK,   BLOCKS.PLANKS_OAK ],
      [BLOCKS.PLANKS_OAK, BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK,  BLOCKS.PLANKS_OAK ]
    ],
    loot: { chance: 0.9, table: [
      { id: ITEMS.MUSHROOM_BROWN,  chance: 1.0, min: 2, max: 5 },
      { id: ITEMS.MUSHROOM_RED,    chance: 0.6, min: 1, max: 2 },
      { id: ITEMS.POTION_ANTIDOTE, chance: 0.5, min: 1, max: 2 },
      { id: ITEMS.COIN,            chance: 0.7, min: 2, max: 8 }
    ]}
  },

  // Snow igloo (5 wide x 4 tall)
  IGLOO: {
    chance: 0.0005,
    biomes: [BIOMES.SNOW_PLAINS, BIOMES.SNOW_FOREST],
    grid: [
      [null,            BLOCKS.SNOW,  BLOCKS.SNOW,  BLOCKS.SNOW,  null          ],
      [BLOCKS.SNOW,     BLOCKS.SNOW,  BLOCKS.GLASS, BLOCKS.SNOW,  BLOCKS.SNOW   ],
      [BLOCKS.SNOW,     null,         null,          null,         BLOCKS.SNOW   ],
      [BLOCKS.SNOW,     BLOCKS.SNOW,  null,          BLOCKS.SNOW,  BLOCKS.SNOW   ]
    ],
    loot: { chance: 0.7, table: [
      { id: ITEMS.COOKED_MEAT,  chance: 0.8, min: 2, max: 4 },
      { id: ITEMS.POTION_HEALTH,chance: 0.4, min: 1, max: 1 },
      { id: ITEMS.COAL,         chance: 1.0, min: 3, max: 8 },
      { id: ITEMS.COIN,         chance: 0.6, min: 2, max: 6 }
    ]}
  }
};

// -------------------------------------------------------------
// WORLD CONFIG — tunable generation parameters
// -------------------------------------------------------------
const WORLD_CONFIG = {
  // World dimensions (in tiles)
  WIDTH:          4096,
  HEIGHT:         256,

  // Sea level tile row (counted from top)
  SEA_LEVEL:      128,

  // Cave generation
  CAVE_THRESHOLD:         0.55,   // Perlin threshold above which caves form
  CAVE_SCALE:             0.08,
  CAVE_MIN_DEPTH:         20,     // Tiles below surface before caves begin

  // Ore generation (depth from surface)
  ORE_LAYERS: {
    COAL:    { minDepth: 5,  maxDepth: 256, veinSize: 8,  chance: 0.018 },
    COPPER:  { minDepth: 10, maxDepth: 200, veinSize: 6,  chance: 0.012 },
    IRON:    { minDepth: 20, maxDepth: 180, veinSize: 5,  chance: 0.009 },
    SILVER:  { minDepth: 35, maxDepth: 160, veinSize: 4,  chance: 0.006 },
    GOLD:    { minDepth: 50, maxDepth: 140, veinSize: 3,  chance: 0.004 },
    STEEL:   { minDepth: 70, maxDepth: 120, veinSize: 3,  chance: 0.003 },
    CRYSTAL: { minDepth: 80, maxDepth: 110, veinSize: 2,  chance: 0.002 }
  },

  // Biome blending width (in tiles)
  BIOME_BLEND:    32,

  // Day/Night cycle length (ms)
  DAY_LENGTH:     600000,   // 10 minutes real time = 1 full day

  // Temperature affects player water drain rate
  TEMP_DRAIN_MULTIPLIER: 0.002,

  // Rain settings
  RAIN_DURATION_MIN: 30000,
  RAIN_DURATION_MAX: 120000,

  // Chunk size (tiles)
  CHUNK_WIDTH:   16,
  CHUNK_HEIGHT:  256,

  // Max mobs per chunk
  MAX_MOBS_PER_CHUNK: 6,

  // Gravity acceleration (tiles/s²)
  GRAVITY: 28,

  // Player defaults
  PLAYER: {
    MAX_HP:        20,
    MAX_FOOD:      20,
    MAX_WATER:     20,
    MAX_STAMINA:   100,
    MOVE_SPEED:    5.5,    // tiles/s
    JUMP_FORCE:    12,     // tiles/s upward
    REACH:         5,      // tiles
    INVENTORY_SLOTS: 14,   // expands to 28 with backpack
    ARMOR_SLOTS:   4,      // head, chest, legs, feet
    FOOD_DRAIN:    0.0008, // per ms
    WATER_DRAIN:   0.0012, // per ms (increases in heat)
    STAMINA_DRAIN: 0.15,   // per tile moved while sprinting
    STAMINA_REGEN: 0.05,   // per ms when idle
    HP_REGEN:      0.001,  // per ms when food > 15
    DROWN_DAMAGE:  1,      // HP per second underwater without air
    AIR_MAX:       15000   // ms of air supply
  }
};

// -------------------------------------------------------------
// MODULE EXPORTS
// -------------------------------------------------------------
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BLOCKS,
    BLOCK_DEFS,
    ITEMS,
    ITEM_DEFS,
    BIOMES,
    BIOME_DEFS,
    MOB_DEFS,
    RECIPES,
    STRUCTURES,
    WORLD_CONFIG
  };
}
