(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = 1024;
  const H = 640;
  const DISPLAY_SCALE = 1.5625;
  const BACKING_SCALE = Math.max(3, Math.min(4, (window.devicePixelRatio || 1) * 2));
  const IDLE_BREATH = {
    period: 3.25,
    periodVariance: 0.42,
    amplitudeVariance: 0.22,
    scaleX: 0.01,
    scaleY: 0.02,
    bob: 0.95,
  };

  canvas.width = Math.round(W * BACKING_SCALE);
  canvas.height = Math.round(H * BACKING_SCALE);
  canvas.style.setProperty("--game-display-width", `${W * DISPLAY_SCALE}px`);
  ctx.setTransform(BACKING_SCALE, 0, 0, BACKING_SCALE, 0, 0);
  ctx.imageSmoothingEnabled = true;

  const CATALOG = [
    {
      id: "toast_tortoise",
      name: "Toast Tortoise",
      short: "Toast",
      rarity: "common",
      family: "bakery",
      traits: ["breakfast", "bakery"],
      emoji: "TT",
      color: "#d99043",
      accent: "#85512e",
      hp: 42,
      atk: 8,
      speed: 1.18,
      role: "Protector",
      ability: "guard",
      abilityText: "Team shields",
      forms: [
        { name: "Toastlet", short: "Toastlet" },
        { name: "Butterback", short: "Butter" },
        { name: "Clubshell", short: "Club" },
        { name: "Banquet Shell", short: "Banquet" },
      ],
    },
    {
      id: "sushi_seal",
      name: "Sushi Seal",
      short: "Sushi",
      rarity: "common",
      family: "seafood",
      traits: ["ocean", "street_food"],
      emoji: "SS",
      color: "#f2f5ef",
      accent: "#e45a6d",
      hp: 22,
      atk: 18,
      speed: 0.78,
      role: "Finisher",
      ability: "execute",
      abilityText: "Wounded snipe",
      forms: [
        { name: "Maki Pup", short: "Maki" },
        { name: "Nigiri Seal", short: "Nigiri" },
        { name: "Dragon Roll", short: "Dragon" },
        { name: "Omakase Seal", short: "Omakase" },
      ],
    },
    {
      id: "taco_tiger",
      name: "Taco Tiger",
      short: "Taco",
      rarity: "common",
      family: "savory",
      traits: ["spicy", "street_food"],
      emoji: "TG",
      color: "#f1c84b",
      accent: "#d9573c",
      hp: 34,
      atk: 14,
      speed: 0.94,
      role: "Brawler",
      ability: "cleave",
      abilityText: "Column cleave",
      forms: [
        { name: "Taco Cub", short: "Cub" },
        { name: "Loaded Tiger", short: "Loaded" },
        { name: "Fiesta Fang", short: "Fiesta" },
        { name: "Carnival Tiger", short: "Carnival" },
      ],
    },
    {
      id: "berry_bat",
      name: "Berry Bat",
      short: "Berry",
      rarity: "common",
      family: "fruit",
      traits: ["sweet", "snack"],
      emoji: "BB",
      color: "#7542a8",
      accent: "#dd5ea8",
      hp: 18,
      atk: 10,
      speed: 0.72,
      role: "Volley",
      ability: "back_row",
      abilityText: "Back row",
      forms: [
        { name: "Berry Bat", short: "Berry" },
        { name: "Bramble Bat", short: "Bramble" },
        { name: "Elderberry Bat", short: "Elder" },
        { name: "Royal Berry Bat", short: "Royal" },
      ],
    },
    {
      id: "noodle_newt",
      name: "Noodle Newt",
      short: "Noodle",
      rarity: "common",
      family: "savory",
      traits: ["spicy", "street_food"],
      emoji: "NN",
      color: "#ead77b",
      accent: "#55a375",
      hp: 24,
      atk: 8,
      speed: 0.86,
      role: "Healer",
      ability: "heal",
      abilityText: "Heals allies",
      forms: [
        { name: "Noodle Newt", short: "Noodle" },
        { name: "Ramen Newt", short: "Ramen" },
        { name: "Hotpot Newt", short: "Hotpot" },
        { name: "Cauldron Newt", short: "Cauldron" },
      ],
    },
    {
      id: "pepper_prawn",
      name: "Pepper Prawn",
      short: "Pepper",
      rarity: "common",
      family: "seafood",
      traits: ["ocean", "spicy"],
      emoji: "PR",
      color: "#f26a35",
      accent: "#5aa6d6",
      hp: 26,
      atk: 12,
      speed: 0.84,
      role: "Skirmisher",
      ability: "pepper_dash",
      abilityText: "Pepper poke",
      forms: [
        { name: "Pepper Prawn", short: "Pepper" },
        { name: "Seared Prawn", short: "Seared" },
        { name: "Chili Skewer Prawn", short: "Skewer" },
        { name: "Tidefire Prawn", short: "Tidefire" },
      ],
    },
    {
      id: "hot_chip_hamster",
      name: "Hot Chip Hamster",
      short: "Hot Chip",
      rarity: "common",
      family: "snack",
      traits: ["snack", "spicy"],
      emoji: "HC",
      color: "#e55a2a",
      accent: "#f4d35e",
      hp: 24,
      atk: 10,
      speed: 0.78,
      role: "Crunch Carry",
      ability: "kernel_combo",
      abilityText: "Crunch combo",
      forms: [
        { name: "Hot Chip Pup", short: "Chip" },
        { name: "Hot Chip Hamster", short: "Hamster" },
        { name: "Flamin' Wheel Hamster", short: "Wheel" },
        { name: "Kettlefire Hamster", short: "Kettlefire" },
      ],
    },
    {
      id: "pancake_penguin",
      name: "Pancake Penguin",
      short: "Pancake",
      rarity: "uncommon",
      family: "breakfast",
      traits: ["breakfast", "bakery"],
      emoji: "PP",
      color: "#e8b765",
      accent: "#b36a2e",
      hp: 32,
      atk: 8,
      speed: 1.04,
      role: "Syrup Support",
      ability: "syrup_start",
      abilityText: "Opening shields",
      forms: [
        { name: "Pancake Chick", short: "Chick" },
        { name: "Syrup Penguin", short: "Syrup" },
        { name: "Stack King", short: "Stack" },
        { name: "Breakfast Emperor", short: "Emperor" },
      ],
    },
    {
      id: "benedict_lobster",
      name: "Benedict Lobster",
      short: "Benny",
      rarity: "uncommon",
      family: "seafood",
      traits: ["breakfast", "ocean"],
      emoji: "BL",
      color: "#e76f51",
      accent: "#f4c95d",
      hp: 34,
      atk: 12,
      speed: 0.96,
      role: "Brunch Breaker",
      ability: "armor_break",
      abilityText: "Brunch breaker",
      forms: [
        { name: "Benny Lobster", short: "Benny" },
        { name: "Benedict Lobster", short: "Benedict" },
        { name: "Hollandaise Reef Lobster", short: "Holland" },
        { name: "Brunch Tide Monarch", short: "Monarch" },
      ],
    },
    {
      id: "pretzel_python",
      name: "Pretzel Python",
      short: "Pretzel",
      rarity: "uncommon",
      family: "snack",
      traits: ["bakery", "snack"],
      emoji: "PP",
      color: "#c47a35",
      accent: "#f0d56b",
      hp: 26,
      atk: 12,
      speed: 0.82,
      role: "Control",
      ability: "slow",
      abilityText: "Cooldown delay",
      forms: [
        { name: "Pretzel Hatchling", short: "Hatch" },
        { name: "Twist Python", short: "Twist" },
        { name: "Saltcoil", short: "Salt" },
        { name: "Knot Constrictor", short: "Knot" },
      ],
    },
    {
      id: "curry_crab",
      name: "Curry Crab",
      short: "Curry",
      rarity: "uncommon",
      family: "spice",
      traits: ["ocean", "spicy"],
      emoji: "CC",
      color: "#d9852f",
      accent: "#8d3d27",
      hp: 36,
      atk: 12,
      speed: 1,
      role: "Breaker",
      ability: "armor_break",
      abilityText: "Anti-tank",
      forms: [
        { name: "Curry Crab", short: "Curry" },
        { name: "Masala Crab", short: "Masala" },
        { name: "Spiceclaw", short: "Spice" },
        { name: "Vindaloo Titan", short: "Titan" },
      ],
    },
    {
      id: "popcorn_porcupine",
      name: "Popcorn Porcupine",
      short: "Popcorn",
      rarity: "uncommon",
      family: "snack",
      traits: ["snack", "street_food"],
      emoji: "PP",
      color: "#f4d35e",
      accent: "#9c6a2f",
      hp: 24,
      atk: 10,
      speed: 0.74,
      role: "Carry",
      ability: "kernel_combo",
      abilityText: "Combo carry",
      forms: [
        { name: "Kernel Hoglet", short: "Kernel" },
        { name: "Popcorn Porcupine", short: "Popcorn" },
        { name: "Kettle Quillbeast", short: "Kettle" },
        { name: "Cinema Needleback", short: "Cinema" },
      ],
    },
    {
      id: "yogurt_yeti",
      name: "Yogurt Yeti",
      short: "Yogurt",
      rarity: "uncommon",
      family: "dairy",
      traits: ["sweet", "snack"],
      emoji: "YY",
      color: "#f4f6ff",
      accent: "#6aa5d8",
      hp: 30,
      atk: 10,
      speed: 0.92,
      role: "Anti-Support",
      ability: "sour_aura",
      abilityText: "Cuts support",
      forms: [
        { name: "Yogurt Cub", short: "Cub" },
        { name: "Parfait Yeti", short: "Parfait" },
        { name: "Frozen Yeti", short: "Frozen" },
        { name: "Glacier Parfait", short: "Glacier" },
      ],
    },
    {
      id: "bagel_beaver",
      name: "Bagel Beaver",
      short: "Bagel",
      rarity: "uncommon",
      family: "bakery",
      traits: ["breakfast", "bakery"],
      emoji: "BV",
      color: "#c98a3a",
      accent: "#f0d56b",
      hp: 34,
      atk: 8,
      speed: 1.06,
      role: "Builder Support",
      ability: "bagel_build",
      abilityText: "Builds shields",
      forms: [
        { name: "Bagel Beaver", short: "Bagel" },
        { name: "Sesame Beaver", short: "Sesame" },
        { name: "Everything Dam Beaver", short: "Dam" },
        { name: "Brunch Lodge Beaver", short: "Lodge" },
      ],
    },
    {
      id: "bao_bun_badger",
      name: "Bao Bun Badger",
      short: "Bao",
      rarity: "uncommon",
      family: "dim-sum",
      traits: ["bakery", "street_food"],
      emoji: "BA",
      color: "#f0d8b4",
      accent: "#c05a39",
      hp: 32,
      atk: 8,
      speed: 1.04,
      role: "Cart Builder",
      ability: "bagel_build",
      abilityText: "Cart shields",
      forms: [
        { name: "Bao Bun Badger", short: "Bao" },
        { name: "Sesame Bao Badger", short: "Sesame" },
        { name: "Steam-Cart Badger", short: "Cart" },
        { name: "Night-Market Bao Boss", short: "Market" },
      ],
    },
    {
      id: "donut_dodo",
      name: "Donut Dodo",
      short: "Donut",
      rarity: "rare",
      family: "dessert",
      traits: ["breakfast", "sweet"],
      emoji: "DD",
      color: "#e7a85c",
      accent: "#d9548f",
      hp: 28,
      atk: 10,
      speed: 1.16,
      role: "Greed",
      ability: "treat_income",
      abilityText: "Survivor gold",
      forms: [
        { name: "Donut Dodo", short: "Dodo" },
        { name: "Glazed Dodo", short: "Glazed" },
        { name: "Sprinkle Roc", short: "Sprinkle" },
        { name: "Bakery Phoenix", short: "Phoenix" },
      ],
    },
    {
      id: "kimchi_chameleon",
      name: "Kimchi Chameleon",
      short: "Kimchi",
      rarity: "rare",
      family: "fermented",
      traits: ["spicy", "street_food"],
      emoji: "KC",
      color: "#e65036",
      accent: "#6a9d38",
      hp: 24,
      atk: 12,
      speed: 0.86,
      role: "Fermenter",
      ability: "status_spread",
      abilityText: "Burn/mark",
      forms: [
        { name: "Kimchi Chameleon", short: "Kimchi" },
        { name: "Ferment Gecko", short: "Ferment" },
        { name: "Gochu Chameleon", short: "Gochu" },
        { name: "Pickled Dragon", short: "Dragon" },
      ],
    },
    {
      id: "waffle_walrus",
      name: "Waffle Walrus",
      short: "Waffle",
      rarity: "rare",
      family: "breakfast",
      traits: ["breakfast", "bakery"],
      emoji: "WW",
      color: "#d8a64a",
      accent: "#6c8fbd",
      hp: 38,
      atk: 10,
      speed: 1.08,
      role: "Lane Control",
      ability: "sticky_lane",
      abilityText: "Stick lane",
      forms: [
        { name: "Waffle Pup", short: "Pup" },
        { name: "Waffle Walrus", short: "Walrus" },
        { name: "Syrup-Tusk Walrus", short: "Tusk" },
        { name: "Brunch Behemoth", short: "Brunch" },
      ],
    },
    {
      id: "dumpling_armadillo",
      name: "Dumpling Armadillo",
      short: "Dumpling",
      rarity: "rare",
      family: "dim-sum",
      traits: ["street_food", "snack"],
      emoji: "DA",
      color: "#f0dcb8",
      accent: "#8b6f50",
      hp: 44,
      atk: 8,
      speed: 1.22,
      role: "Row Guard",
      ability: "row_shield",
      abilityText: "Row shields",
      forms: [
        { name: "Dumpling Dillo", short: "Dillo" },
        { name: "Bao Armadillo", short: "Bao" },
        { name: "Dim Sum Dozer", short: "Dozer" },
        { name: "Steam-Basket Bastion", short: "Bastion" },
      ],
    },
    {
      id: "lemon_meringue_lynx",
      name: "Lemon Meringue Lynx",
      short: "Lemon",
      rarity: "rare",
      family: "dessert",
      traits: ["sweet", "bakery"],
      emoji: "LL",
      color: "#f2dc5d",
      accent: "#ffffff",
      hp: 22,
      atk: 8,
      speed: 0.8,
      role: "Cleanser",
      ability: "cleanse",
      abilityText: "Cleanse",
      forms: [
        { name: "Lemon Lynx", short: "Lemon" },
        { name: "Meringue Lynx", short: "Meringue" },
        { name: "Tart Panther", short: "Tart" },
        { name: "Citrus Sphinx", short: "Sphinx" },
      ],
    },
    {
      id: "shakshuka_shark",
      name: "Shakshuka Shark",
      short: "Shakshuka",
      rarity: "rare",
      family: "breakfast",
      traits: ["breakfast", "spicy"],
      emoji: "SH",
      color: "#e24822",
      accent: "#f4d35e",
      hp: 36,
      atk: 14,
      speed: 0.98,
      role: "Burn Brawler",
      ability: "shakshuka_burn",
      abilityText: "Breakfast burn",
      forms: [
        { name: "Shakshuka Shark", short: "Shakshuka" },
        { name: "Saucy Shark", short: "Saucy" },
        { name: "Skilletfin Shark", short: "Skillet" },
        { name: "Harissa Megalodon", short: "Harissa" },
      ],
    },
    {
      id: "saltwater_taffy_otter",
      name: "Saltwater Taffy Otter",
      short: "Taffy",
      rarity: "rare",
      family: "dessert",
      traits: ["sweet", "snack"],
      emoji: "TO",
      color: "#f2a7c7",
      accent: "#5aa6d6",
      hp: 26,
      atk: 12,
      speed: 0.84,
      role: "Taffy Control",
      ability: "slow",
      abilityText: "Taffy bind",
      forms: [
        { name: "Taffy Pup", short: "Pup" },
        { name: "Saltwater Taffy Otter", short: "Taffy" },
        { name: "Ribbon Taffy Otter", short: "Ribbon" },
        { name: "Candy-Tide Otter", short: "Candy Tide" },
      ],
    },
    {
      id: "croissant_kraken",
      name: "Croissant Kraken",
      short: "Kraken",
      rarity: "epic",
      family: "bakery",
      traits: ["bakery", "breakfast"],
      emoji: "CK",
      color: "#d69a3e",
      accent: "#6b4aa8",
      hp: 34,
      atk: 12,
      speed: 1.02,
      role: "Disruptor",
      ability: "pull_start",
      abilityText: "Pull start",
      forms: [
        { name: "Croissant Squid", short: "Squid" },
        { name: "Buttered Kraken", short: "Kraken" },
        { name: "Laminated Leviathan", short: "Leviathan" },
        { name: "Thousand-Layer Abyss", short: "Abyss" },
      ],
    },
    {
      id: "fortune_cookie_fox",
      name: "Fortune Cookie Fox",
      short: "Fortune",
      rarity: "epic",
      family: "dessert",
      traits: ["bakery", "snack", "sweet"],
      emoji: "FF",
      color: "#e4b65f",
      accent: "#d24d53",
      hp: 24,
      atk: 10,
      speed: 0.84,
      role: "Copy Oracle",
      ability: "copy_luck",
      abilityText: "Copy odds",
      forms: [
        { name: "Fortune Kit", short: "Kit" },
        { name: "Cookie Fox", short: "Cookie" },
        { name: "Prophecy Vixen", short: "Vixen" },
        { name: "Oracle Kitsune", short: "Oracle" },
      ],
    },
    {
      id: "mochi_mammoth",
      name: "Mochi Mammoth",
      short: "Mochi",
      rarity: "epic",
      family: "dessert",
      traits: ["sweet", "snack"],
      emoji: "MM",
      color: "#f2d6df",
      accent: "#8b6fb0",
      hp: 46,
      atk: 8,
      speed: 1.28,
      role: "Scaler",
      ability: "survive_scale",
      abilityText: "Survive scales",
      forms: [
        { name: "Mochi Calf", short: "Calf" },
        { name: "Mochi Mammoth", short: "Mammoth" },
        { name: "Mooncake Mastodon", short: "Mastodon" },
        { name: "Festival Colossus", short: "Colossus" },
      ],
    },
    {
      id: "gingerbread_golem",
      name: "Gingerbread Golem",
      short: "Ginger",
      rarity: "epic",
      family: "bakery",
      traits: ["bakery", "sweet"],
      emoji: "GG",
      color: "#b66b34",
      accent: "#f5f0df",
      hp: 40,
      atk: 10,
      speed: 1.14,
      role: "Summoner",
      ability: "ginger_decoy",
      abilityText: "Summons decoy",
      forms: [
        { name: "Gingerling", short: "Ginger" },
        { name: "Gingerbread Golem", short: "Golem" },
        { name: "Frosted Guardian", short: "Guardian" },
        { name: "Candy-Castle Colossus", short: "Castle" },
      ],
    },
    {
      id: "boba_basilisk",
      name: "Boba Basilisk",
      short: "Boba",
      rarity: "epic",
      family: "drink",
      traits: ["sweet", "street_food", "snack"],
      emoji: "BB",
      color: "#c99bd8",
      accent: "#3d263d",
      hp: 26,
      atk: 12,
      speed: 0.78,
      role: "Stunner",
      ability: "pearl_stun",
      abilityText: "Pearl stun",
      forms: [
        { name: "Boba Newt", short: "Newt" },
        { name: "Tapioca Basilisk", short: "Basilisk" },
        { name: "Pearl Gorgon", short: "Gorgon" },
        { name: "Bubble Tea Hydra", short: "Hydra" },
      ],
    },
    {
      id: "iceberg_oyster",
      name: "Iceberg Oyster",
      short: "Oyster",
      rarity: "epic",
      family: "seafood",
      traits: ["ocean", "snack"],
      emoji: "IO",
      color: "#d8f2ff",
      accent: "#4d9d95",
      hp: 38,
      atk: 10,
      speed: 1.06,
      role: "Tempo Control",
      ability: "iceberg_lock",
      abilityText: "Locks tempo",
      forms: [
        { name: "Iceberg Oyster", short: "Oyster" },
        { name: "Pearl-Ice Oyster", short: "Pearl" },
        { name: "Glacier Shell Oyster", short: "Glacier" },
        { name: "Abyssal Ice Pearl", short: "Abyss" },
      ],
    },
    {
      id: "churro_cheetah",
      name: "Churro Cheetah",
      short: "Churro",
      rarity: "epic",
      family: "dessert",
      traits: ["bakery", "spicy", "sweet"],
      emoji: "CH",
      color: "#c98335",
      accent: "#e24822",
      hp: 30,
      atk: 14,
      speed: 0.82,
      role: "Chili Sugar",
      ability: "status_spread",
      abilityText: "Burn/mark",
      forms: [
        { name: "Churro Cub", short: "Cub" },
        { name: "Cinnamon Cheetah", short: "Cinnamon" },
        { name: "Chili Churro Cheetah", short: "Chili" },
        { name: "Dulce Firecat", short: "Dulce" },
      ],
    },
    {
      id: "granola_goat",
      name: "Granola Goat",
      short: "Granola",
      rarity: "epic",
      family: "breakfast",
      traits: ["breakfast", "snack"],
      emoji: "GG",
      color: "#d6a04c",
      accent: "#7aa530",
      hp: 34,
      atk: 10,
      speed: 1.08,
      role: "Trail Greed",
      ability: "treat_income",
      abilityText: "Survivor gold",
      forms: [
        { name: "Oat Kid", short: "Oat" },
        { name: "Granola Goat", short: "Granola" },
        { name: "Trail-Mix Ram", short: "Trail" },
        { name: "Harvest Ibex", short: "Harvest" },
      ],
    },
    {
      id: "breakfast_burrito_boar",
      name: "Breakfast Burrito Boar",
      short: "Burrito",
      rarity: "epic",
      family: "breakfast",
      traits: ["breakfast", "street_food", "spicy"],
      emoji: "BB",
      color: "#d99736",
      accent: "#55a375",
      hp: 40,
      atk: 12,
      speed: 0.98,
      role: "Street Brawler",
      ability: "cleave",
      abilityText: "Column cleave",
      forms: [
        { name: "Egg Wrap Piglet", short: "Wrap" },
        { name: "Breakfast Burrito Boar", short: "Burrito" },
        { name: "Salsa Tusk Boar", short: "Salsa" },
        { name: "Brunch Cart Boar", short: "Cart" },
      ],
    },
    {
      id: "caesar_salamander",
      name: "Caesar Salamander",
      short: "Caesar",
      rarity: "common",
      family: "salad",
      traits: ["fresh", "snack"],
      emoji: "CS",
      color: "#78b84d",
      accent: "#f0dcb8",
      hp: 26,
      atk: 8,
      speed: 0.92,
      role: "Crisp Healer",
      ability: "heal",
      abilityText: "Crisp heal",
      forms: [
        { name: "Romaine Newt", short: "Romaine" },
        { name: "Caesar Salamander", short: "Caesar" },
        { name: "Crouton Crest", short: "Crouton" },
        { name: "Salad Bar Sovereign", short: "Sovereign" },
      ],
    },
    {
      id: "cucumber_cobra",
      name: "Cucumber Cobra",
      short: "Cucumber",
      rarity: "common",
      family: "salad",
      traits: ["fresh", "snack"],
      emoji: "CC",
      color: "#86c95b",
      accent: "#3f8f5a",
      hp: 24,
      atk: 10,
      speed: 0.84,
      role: "Cool Control",
      ability: "slow",
      abilityText: "Crisp bind",
      forms: [
        { name: "Cuke Hatchling", short: "Cuke" },
        { name: "Cucumber Cobra", short: "Cobra" },
        { name: "Ribbon Cucumber", short: "Ribbon" },
        { name: "Garden Coil Hydra", short: "Hydra" },
      ],
    },
    {
      id: "avocado_axolotl",
      name: "Avocado Axolotl",
      short: "Avocado",
      rarity: "uncommon",
      family: "salad",
      traits: ["fresh", "snack"],
      emoji: "AA",
      color: "#8dbb4d",
      accent: "#6f4b2f",
      hp: 36,
      atk: 8,
      speed: 1,
      role: "Creamy Guard",
      ability: "guard",
      abilityText: "Pit guard",
      forms: [
        { name: "Avocado Totl", short: "Totl" },
        { name: "Avocado Axolotl", short: "Avo" },
        { name: "Guac Gill Axolotl", short: "Guac" },
        { name: "Orchard Pit Oracle", short: "Oracle" },
      ],
    },
    {
      id: "herb_hare",
      name: "Herb Hare",
      short: "Herb",
      rarity: "uncommon",
      family: "salad",
      traits: ["fresh", "bakery"],
      emoji: "HH",
      color: "#6fad4e",
      accent: "#d9b56f",
      hp: 30,
      atk: 8,
      speed: 1.18,
      role: "Garden Opener",
      ability: "syrup_start",
      abilityText: "Herb starter",
      forms: [
        { name: "Herb Kit", short: "Kit" },
        { name: "Herb Hare", short: "Hare" },
        { name: "Focaccia Jackrabbit", short: "Focaccia" },
        { name: "Greenhouse Jumper", short: "Jumper" },
      ],
    },
    {
      id: "caprese_capybara",
      name: "Caprese Capybara",
      short: "Caprese",
      rarity: "rare",
      family: "salad",
      traits: ["fresh", "snack"],
      emoji: "CP",
      color: "#f2f1dc",
      accent: "#d84a3a",
      hp: 42,
      atk: 8,
      speed: 1.12,
      role: "Plate Anchor",
      ability: "row_shield",
      abilityText: "Caprese row",
      forms: [
        { name: "Mozzarella Pup", short: "Mozz" },
        { name: "Caprese Capybara", short: "Caprese" },
        { name: "Basil Pond Capybara", short: "Basil" },
        { name: "Antipasto Harbour", short: "Harbour" },
      ],
    },
    {
      id: "vinaigrette_viper",
      name: "Vinaigrette Viper",
      short: "Viper",
      rarity: "epic",
      family: "salad",
      traits: ["fresh", "spicy"],
      emoji: "VV",
      color: "#d7bd45",
      accent: "#6fae48",
      hp: 28,
      atk: 12,
      speed: 0.82,
      role: "Sharp Dressing",
      ability: "status_spread",
      abilityText: "Dressing mark",
      forms: [
        { name: "Vinaigrette Viper", short: "Viper" },
        { name: "Peppercorn Viper", short: "Pepper" },
        { name: "Balsamic Coil", short: "Balsamic" },
        { name: "Dressing Dragon", short: "Dragon" },
      ],
    },
    {
      id: "kelp_koala",
      name: "Kelp Koala",
      short: "Kelp",
      rarity: "common",
      family: "salad",
      traits: ["fresh", "ocean"],
      emoji: "KK",
      color: "#4fae78",
      accent: "#2f7f83",
      hp: 28,
      atk: 8,
      speed: 0.94,
      role: "Tide Healer",
      ability: "heal",
      abilityText: "Kelp heal",
      forms: [
        { name: "Kelp Joey", short: "Joey" },
        { name: "Kelp Koala", short: "Kelp" },
        { name: "Seaweed Snacker", short: "Seaweed" },
        { name: "Tide-Grove Koala", short: "Grove" },
      ],
    },
    {
      id: "melon_mint_mantis",
      name: "Melon Mint Mantis",
      short: "Melon",
      rarity: "uncommon",
      family: "fruit",
      traits: ["fresh", "sweet"],
      emoji: "MM",
      color: "#9fda6e",
      accent: "#55b89b",
      hp: 24,
      atk: 8,
      speed: 0.82,
      role: "Mint Cleanser",
      ability: "cleanse",
      abilityText: "Mint cleanse",
      forms: [
        { name: "Mint Sprout Mantis", short: "Sprout" },
        { name: "Melon Mint Mantis", short: "Melon" },
        { name: "Honeydew Blade", short: "Honeydew" },
        { name: "Melon-Grove Reaper", short: "Grove" },
      ],
    },
    {
      id: "coconut_shrimp_sheep",
      name: "Coconut Shrimp Sheep",
      short: "Coconut",
      rarity: "rare",
      family: "seafood",
      traits: ["ocean", "sweet"],
      emoji: "CS",
      color: "#f1d8aa",
      accent: "#df8f57",
      hp: 30,
      atk: 14,
      speed: 0.86,
      role: "Crisp Finisher",
      ability: "execute",
      abilityText: "Coconut finish",
      forms: [
        { name: "Coconut Lamb", short: "Lamb" },
        { name: "Coconut Shrimp Sheep", short: "Coconut" },
        { name: "Fried Fleece Shrimp", short: "Fleece" },
        { name: "Island Coconut Ram", short: "Island" },
      ],
    },
    {
      id: "crab_cake_caterpillar",
      name: "Crab Cake Caterpillar",
      short: "Crab Cake",
      rarity: "uncommon",
      family: "seafood",
      traits: ["bakery", "ocean"],
      emoji: "CC",
      color: "#d99a4f",
      accent: "#5ea3b5",
      hp: 34,
      atk: 12,
      speed: 0.98,
      role: "Cake Breaker",
      ability: "armor_break",
      abilityText: "Crab-cake breaker",
      forms: [
        { name: "Crumb Grub", short: "Crumb" },
        { name: "Crab Cake Caterpillar", short: "Cake" },
        { name: "Golden Shell Loaf", short: "Golden" },
        { name: "Boardwalk Crab-Cake Moth", short: "Moth" },
      ],
    },
    {
      id: "pico_de_gallo_gecko",
      name: "Pico de Gallo Gecko",
      short: "Pico",
      rarity: "common",
      family: "salsa",
      traits: ["fresh", "street_food"],
      emoji: "PG",
      color: "#d84a3a",
      accent: "#65ad52",
      hp: 26,
      atk: 12,
      speed: 0.9,
      role: "Salsa Splash",
      ability: "cleave",
      abilityText: "Pico splash",
      forms: [
        { name: "Tomato Gecko", short: "Tomato" },
        { name: "Pico de Gallo Gecko", short: "Pico" },
        { name: "Salsa Crest Gecko", short: "Salsa" },
        { name: "Market-Bowl Basilisk", short: "Market" },
      ],
    },
  ];

  const TRAITS = {
    breakfast: {
      id: "breakfast",
      label: "Breakfast",
      short: "BRK",
      color: "#e8b765",
      thresholds: [
        { count: 2, text: "Team starts shielded" },
        { count: 4, text: "Breakfast also starts hasted" },
      ],
    },
    bakery: {
      id: "bakery",
      label: "Bakery",
      short: "BAK",
      color: "#c47a35",
      thresholds: [
        { count: 2, text: "+6 coins after battles" },
        { count: 4, text: "+13 coins after battles" },
        { count: 6, text: "+22 coins after battles" },
      ],
    },
    ocean: {
      id: "ocean",
      label: "Ocean",
      short: "OCN",
      color: "#5aa6d6",
      thresholds: [
        { count: 2, text: "Enemies start delayed" },
        { count: 4, text: "Stronger opening delay" },
      ],
    },
    sweet: {
      id: "sweet",
      label: "Sweet",
      short: "SWT",
      color: "#dd5ea8",
      thresholds: [
        { count: 2, text: "Sweet support is stronger" },
        { count: 4, text: "Sweet support is much stronger" },
        { count: 6, text: "Sweet support overflows" },
      ],
    },
    spicy: {
      id: "spicy",
      label: "Spicy",
      short: "SPC",
      color: "#d9573c",
      thresholds: [
        { count: 2, text: "Spicy units deal more damage" },
        { count: 4, text: "Spicy attacks burn" },
      ],
    },
    street_food: {
      id: "street_food",
      label: "Street",
      short: "ST",
      color: "#55a375",
      thresholds: [
        { count: 2, text: "Street attacks faster" },
        { count: 4, text: "Street attacks much faster" },
        { count: 6, text: "Street rushes" },
      ],
    },
    snack: {
      id: "snack",
      label: "Snack",
      short: "SNK",
      color: "#f0c64a",
      thresholds: [
        { count: 2, text: "First hits are stronger" },
        { count: 4, text: "First hits crunch harder" },
      ],
    },
    fresh: {
      id: "fresh",
      label: "Fresh",
      short: "FRS",
      color: "#6fae48",
      thresholds: [
        { count: 2, text: "Fresh support is stronger" },
        { count: 4, text: "Fresh clears bad statuses faster" },
        { count: 6, text: "Fresh starts with crisp shields" },
      ],
    },
  };

  const FAVORITE_TOPPINGS = {
    toast_tortoise: { itemId: "bacon_strips", bonus: "Guard shields and bacon crackle are stronger" },
    sushi_seal: { itemId: "seaweed_wrap", bonus: "Can pressure back rows with sharper executes" },
    taco_tiger: { itemId: "hot_sauce_bottle", bonus: "Cleave hits harder and burns hotter" },
    berry_bat: { itemId: "jam_dollop", bonus: "Back-row volley splashes through clustered foes" },
    noodle_newt: { itemId: "scallion_oil", bonus: "Savory support leaves allies hitting brighter" },
    pepper_prawn: { itemId: "garlic_clove", bonus: "Pepper poke cuts enemy support harder" },
    hot_chip_hamster: { itemId: "molten_cheese", bonus: "Crunch stacks melt into stronger late-fight bites" },
    pancake_penguin: { itemId: "maple_leaf", bonus: "Syrup opener gives extra momentum" },
    benedict_lobster: { itemId: "caviar_pearls", bonus: "Brunch breaker turns haste into sharper claw pressure" },
    pretzel_python: { itemId: "salt_shaker", bonus: "Cooldown delays last longer" },
    curry_crab: { itemId: "skewer", bonus: "Breaker claws pierce deeper lanes" },
    popcorn_porcupine: { itemId: "popcorn_kernel", bonus: "Kernel combo ramps faster" },
    yogurt_yeti: { itemId: "glass_candy", bonus: "Sour slow and anti-support bite harder" },
    bagel_beaver: { itemId: "cheese_star", bonus: "Built shields and HP scale harder" },
    bao_bun_badger: { itemId: "sesame_seeds", bonus: "Cart shields build a crunchier front" },
    donut_dodo: { itemId: "cherry_pit", bonus: "Survivor income gets a decoy buffer" },
    kimchi_chameleon: { itemId: "gochugaru_flakes", bonus: "Fermented chili statuses last longer" },
    waffle_walrus: { itemId: "butter_pat", bonus: "Sticky lanes fire more often" },
    dumpling_armadillo: { itemId: "soup_ladle", bonus: "Row shields become heartier" },
    lemon_meringue_lynx: { itemId: "lemon_wedge", bonus: "Cleanses restore more support" },
    shakshuka_shark: { itemId: "chili_pepper", bonus: "Skillet burns hit harder" },
    saltwater_taffy_otter: { itemId: "sugar_cube", bonus: "Taffy binds stretch key enemy turns" },
    croissant_kraken: { itemId: "golden_truffle_crown", bonus: "Opening pull hits with authority" },
    fortune_cookie_fox: { itemId: "coupon_clip", bonus: "Copy luck bends shops further" },
    mochi_mammoth: { itemId: "rainbow_mochi", bonus: "Survivor growth protects allies better" },
    gingerbread_golem: { itemId: "royal_icing_crest", bonus: "Decoys hold and crumble stronger" },
    boba_basilisk: { itemId: "milk_tea_foam", bonus: "Pearl stuns cycle with creamy foam" },
    iceberg_oyster: { itemId: "cucumber_slice", bonus: "Pearl locks resist and linger" },
    churro_cheetah: { itemId: "cinnamon_sugar", bonus: "Chili sugar openers hit much harder" },
    granola_goat: { itemId: "lucky_grape", bonus: "Survivor income pays out more reliably" },
    breakfast_burrito_boar: { itemId: "sunny_side_egg", bonus: "Breakfast cleave starts richer" },
    caesar_salamander: { itemId: "serving_tray", bonus: "Crisp heals and shields buff allies harder" },
    cucumber_cobra: { itemId: "dill_sprig", bonus: "Crisp binds leave enemies cooler" },
    avocado_axolotl: { itemId: "avocado_fan", bonus: "Pit guard recovers through long fights" },
    herb_hare: { itemId: "basil_leaf", bonus: "Garden openers leave enemies slower" },
    caprese_capybara: { itemId: "cherry_tomato", bonus: "Caprese rows hold with brighter support" },
    vinaigrette_viper: { itemId: "vinegar_splash", bonus: "Sharp dressing statuses linger" },
    kelp_koala: { itemId: "rice_ball", bonus: "Kelp support wraps allies in stronger recovery" },
    melon_mint_mantis: { itemId: "mint_leaf", bonus: "Mint cleanses refresh allies with extra lift" },
    coconut_shrimp_sheep: { itemId: "honey_drizzle", bonus: "Coconut-crisp finishes hit wounded enemies harder" },
    crab_cake_caterpillar: { itemId: "cracker_plate", bonus: "Crumb armor breaks crack sturdy front lines" },
    pico_de_gallo_gecko: { itemId: "onion_ring", bonus: "Pico splash carries bright onion crunch through columns" },
  };

  const FAVORITE_COMBO_SPECS = {
    toast_tortoise: ["Combo: team shields +12%", "Bacon crackle hits harder"],
    sushi_seal: ["Combo: wounded executes +12% PWR", "Seaweed sharpens wounded finishes"],
    taco_tiger: ["Combo: cleave splash +12% PWR", "Hot sauce spreads cleave pressure"],
    berry_bat: ["Combo: jam volley splash +12% PWR", "Honey carries volley splash farther"],
    noodle_newt: ["Combo: scallion support +12%", "Scallion support buffs ally strikes"],
    pepper_prawn: ["Combo: garlic anti-support +9% duration", "Garlic dash cuts enemy support"],
    hot_chip_hamster: ["Combo: molten crunch +12% PWR", "Molten cheese feeds late crunch"],
    pancake_penguin: ["Combo: syrup support +12%", "Syrup starts adjacent allies stronger"],
    benedict_lobster: ["Combo: brunch break +12% PWR", "Hollandaise opens breaker lanes"],
    pretzel_python: ["Combo: cooldown delays +9% duration", "Salt keeps bound targets stalled"],
    curry_crab: ["Combo: breaker pierces behind", "Skewer opens back-line lanes"],
    popcorn_porcupine: ["Combo: kernel payoff +12% PWR", "Kernel stacks speed the ramp"],
    yogurt_yeti: ["Combo: slow/anti-support +9% duration", "Mint keeps sour aura lingering"],
    bagel_beaver: ["Combo: build shields +12%", "Cheese rebuilds shields after hits"],
    bao_bun_badger: ["Combo: sesame cart shields +12%", "Sesame carts cycle shields faster"],
    donut_dodo: ["Combo: survivor decoy buffer", "Survivor income +6%"],
    kimchi_chameleon: ["Combo: gochugaru statuses +9% duration", "Gochugaru attacks apply burn"],
    waffle_walrus: ["Combo: sticky lanes +12% PWR", "Butter hits slow enemy clocks"],
    dumpling_armadillo: ["Combo: row shields +12%", "Ladle shields swell across rows"],
    lemon_meringue_lynx: ["Combo: cleanse support +12%", "Lemon cleanses first bad status"],
    shakshuka_shark: ["Combo: skillet burn +12% PWR", "Chili attacks apply burn"],
    saltwater_taffy_otter: ["Combo: taffy binds +9% duration", "Sugar binds stretch key turns"],
    croissant_kraken: ["Combo: opening pull +12% PWR", "Pull pressure +6% damage"],
    fortune_cookie_fox: ["Combo: copy odds +12% PWR", "Shop-copy pressure +4% speed"],
    mochi_mammoth: ["Combo: survivor growth +12% PWR", "Ally protection +12%"],
    gingerbread_golem: ["Combo: decoy HP/crumble +12% PWR", "Icing decoys crumble harder"],
    boba_basilisk: ["Combo: milk tea stun +9% duration", "Stun cycle +4% speed"],
    iceberg_oyster: ["Combo: pearl locks +9% duration", "Control shield +12%"],
    churro_cheetah: ["Combo: cinnamon first hits +36%", "Cinnamon burst attacks burn"],
    granola_goat: ["Combo: survivor gold +12", "Grape rewards living through fights"],
    breakfast_burrito_boar: ["Combo: egg breakfast cleave +12% PWR", "Egg yolk splashes nearby enemies"],
    caesar_salamander: ["Combo: garnish support +12%", "Garnish turns support into buffs"],
    cucumber_cobra: ["Combo: dill binds +9% duration", "Dill keeps chilled binds sticky"],
    avocado_axolotl: ["Combo: every third attack self-heals", "Avocado pit guards long fights"],
    herb_hare: ["Combo: opener slows targets", "Basil makes openers trip targets"],
    caprese_capybara: ["Combo: row shields +12%", "Tomato support echoes across row"],
    vinaigrette_viper: ["Combo: dressing statuses +9% duration", "Vinegar statuses linger and bite"],
    kelp_koala: ["Combo: tide heals +12%", "Rice-ball recovery leaves a light shield"],
    melon_mint_mantis: ["Combo: mint cleanse +12%", "Mint haste follows each cleanse"],
    coconut_shrimp_sheep: ["Combo: coconut finish +12% PWR", "Honeyed crunch pressures wounded targets"],
    crab_cake_caterpillar: ["Combo: crumb break +12% PWR", "Cracker crumbs pierce sturdy fronts"],
    pico_de_gallo_gecko: ["Combo: pico splash +12% PWR", "Onion crunch clips nearby foes"],
  };

  const ARENAS = [
    {
      id: "sunny_breakfast_patio",
      name: "Sunny Breakfast Patio",
      short: "Patio",
      mood: "Morning boards favor warm openers.",
      backgroundSrc: "assets/backgrounds/arena-sunny-breakfast-patio-v1.webp",
      color: "#e8b765",
      effects: [
        { tag: "HELP", text: "Breakfast starts hasted." },
        { tag: "HELP", text: "Bakery starts shielded." },
        { tag: "HURT", text: "Sweet support is softer." },
      ],
    },
    {
      id: "rainy_fish_market",
      name: "Rainy Fish Market",
      short: "Market",
      mood: "Wet lanes reward sea pressure.",
      backgroundSrc: "assets/backgrounds/arena-rainy-fish-market-v1.webp",
      color: "#5aa6d6",
      effects: [
        { tag: "HELP", text: "Ocean attacks faster." },
        { tag: "HELP", text: "Ocean teams delay foes." },
        { tag: "HURT", text: "Bakery units start a little slower." },
      ],
    },
    {
      id: "street_festival",
      name: "Street Festival",
      short: "Festival",
      mood: "Tempo comps thrive in the crowd.",
      backgroundSrc: "assets/backgrounds/arena-street-festival-v1.webp",
      color: "#d9573c",
      effects: [
        { tag: "HELP", text: "Street/Spicy/Snack faster." },
        { tag: "HELP", text: "First hits hit harder." },
        { tag: "HURT", text: "Front rows are softer." },
      ],
    },
    {
      id: "spice_bazaar",
      name: "Spice Bazaar",
      short: "Bazaar",
      mood: "Statuses linger in the heat.",
      backgroundSrc: "assets/backgrounds/arena-spice-bazaar-v1.webp",
      color: "#d9852f",
      effects: [
        { tag: "HELP", text: "Spicy/Street damage rises." },
        { tag: "HELP", text: "Their statuses last longer." },
        { tag: "HURT", text: "Sweet takes more damage." },
      ],
    },
    {
      id: "frozen_parfait_peak",
      name: "Frozen Parfait Peak",
      short: "Peak",
      mood: "Cold boards reward patient scaling.",
      backgroundSrc: "assets/backgrounds/arena-frozen-parfait-peak-v1.webp",
      color: "#7ec7e8",
      effects: [
        { tag: "HELP", text: "Sweet starts shielded." },
        { tag: "HELP", text: "Sweet ramps after 6s." },
        { tag: "HURT", text: "Ocean/Street attack slower." },
      ],
    },
    {
      id: "dim_sum_kitchen",
      name: "Dim Sum Kitchen",
      short: "Kitchen",
      mood: "Front lines hold in the steam.",
      backgroundSrc: "assets/backgrounds/arena-dim-sum-kitchen-v1.webp",
      color: "#8b6f50",
      effects: [
        { tag: "HELP", text: "Snack/Breakfast fronts hold." },
        { tag: "HELP", text: "Street support stronger." },
        { tag: "HURT", text: "Back-row Sweet softened." },
      ],
    },
  ];

  const BOARD_COLS = 3;
  const BOARD_ROWS = 3;
  const SHOP_SLOT_W = 86;
  const SHOP_SLOT_H = 162;
  const SHOP_STARTING_UNLOCKED_SLOTS = 4;
  const SHOP_SLOT_UNLOCK_COSTS = [0, 0, 0, 0, 30, 45, 60, 75];
  const INFO_PANEL = { x: 670, y: 244, w: 338, h: 392 };
  const TEAM_INTEL_BG_SRC = "assets/ui/runtime/team-intel-card-bg-v1.webp?v=1";
  const FOOD_MENU_BG_SRC = "assets/ui/runtime/food-menu-bg-v1.webp?v=1";
  const SHOP_SLOT_BG_SRC = "assets/ui/runtime/shop-slot-card-bg-v1.png?v=1";
  const SHOP_LOCK_CLOTH_BG_SRC = "assets/ui/runtime/shop-lock-cloth-bg-v2.webp?v=1";
  const BENCH_SLOT_BG_SRC = "assets/ui/runtime/bench-countertop-cream-stone-v1.png?v=1";
  const BENCH_SLOT_BG_SCALE = 1.12;
  const BATTLE_FIELD_BG_SRC = "assets/ui/runtime/battle-field-picnic-blanket-v1.webp?v=3";
  const BATTLE_SPEED_CHALK_SRC = "assets/ui/runtime/battle-speed-chalk-board-v1.webp";
  const RESTART_CHALK_SIGN_SRC = "assets/ui/runtime/chalk-sign-restart-v1.webp";
  const SHOPKEEPER_STALL_SRC = "assets/shopkeeper/runtime/food-animal-stall-forward-facing-v1.webp";
  const SHOPKEEPER_SRC = "assets/shopkeeper/runtime/marmalade-tabby-shopkeeper-kitten-lv1-v1.webp";
  const CODEX_MENU_BUTTON_SRC = "assets/ui/runtime/beat-up-food-menu-button-v2.png";
  const SHOPKEEPER_LEVEL_SRCS = [
    SHOPKEEPER_SRC,
    "assets/shopkeeper/runtime/marmalade-tabby-shopkeeper-teen-lv2-v3.webp",
    "assets/shopkeeper/runtime/marmalade-tabby-shopkeeper-adult-lv3-v3.webp",
    "assets/shopkeeper/runtime/marmalade-tabby-shopkeeper-lean-muscle-lv4-v3.webp",
  ];
  const SHOPKEEPER_DISPLAY = {
    stall: { x: 720, y: 54, w: 258, h: 206 },
    keeper: { x: 796, y: 93, w: 111, h: 126 },
    codexButton: { x: 932, y: 92, w: 76, h: 76 },
    breathPeriod: 3.4,
    breathScaleX: 0.01,
    breathScaleY: 0.018,
    breathBob: 0.75,
  };
  const CODEX_PANEL = { x: 56, y: 66, w: 912, h: 562 };
  const CODEX_LIST = { x: 96, y: 156, w: 438, h: 444, rowH: 26, colW: 219, rows: 16 };
  const CODEX_TABS = [
    { id: "food", label: "Food" },
    { id: "toppings", label: "Toppings" },
    { id: "drinks", label: "Drinks" },
  ];
  const CODEX_DEFAULT_FILTERS = {
    food: { rarity: "all", trait: "all", role: "all" },
    toppings: { rarity: "all", effect: "all" },
    drinks: { rarity: "all", stat: "all", trait: "all" },
  };
  const FRONT_COL = BOARD_COLS - 1;
  const BACK_COL = 0;
  const BATTLE_FORMATION = {
    allyBaseX: 192,
    enemyBaseX: 832,
    colGap: 122,
    topY: 194,
    rowGap: 122,
    cellSize: 76,
  };
  const BATTLE_FIELD = {
    x: 20,
    y: 124,
    w: 984,
    h: 504,
    dividerX: 506,
    dividerTop: 152,
    dividerHeight: 420,
  };
  const BATTLE_DRINK_SLOT_SIZE = BATTLE_FORMATION.cellSize;
  const BATTLE_DRINK_ICON_RADIUS = 38;
  const DRINK_PULSE_ANIMATION_SECONDS = 0.58;
  const DRINK_PULSE_HOP_PIXELS = 9;
  const DRINK_TOSS_ANIMATION_SECONDS = 0.62;
  const DRINK_TOSS_PROJECTILE_SIZE = 52;
  const DRINK_TOSS_ARC_HEIGHT = 44;
  const DRINK_TOSS_IMPACT_PARTICLES = 7;
  const PREP_BOARD_ORIGIN = { x: 382, y: 278 };
  const PREP_BOARD_SPACING = 78;
  const boardSlots = Array.from({ length: BOARD_COLS * BOARD_ROWS }, (_, index) => {
    const col = index % BOARD_COLS;
    const row = Math.floor(index / BOARD_COLS);
    return { x: PREP_BOARD_ORIGIN.x + col * PREP_BOARD_SPACING, y: PREP_BOARD_ORIGIN.y + row * PREP_BOARD_SPACING, col, row };
  });
  const DRINK_SLOT_SIZE = 72;
  const TILE_DRINK_ICON_RADIUS_SCALE = 0.54;
  const TILE_DRINK_ICON_Y_OFFSET = 0;
  const DRINK_COASTER_OPAQUE_ANCHOR_Y = 0.74;
  const drinkSlots = [
    ...Array.from({ length: BOARD_ROWS }, (_, row) => ({
      x: PREP_BOARD_ORIGIN.x - PREP_BOARD_SPACING,
      y: PREP_BOARD_ORIGIN.y + row * PREP_BOARD_SPACING,
      axis: "row",
      targetIndex: row,
    })),
    ...Array.from({ length: BOARD_COLS }, (_, col) => ({
      x: PREP_BOARD_ORIGIN.x + col * PREP_BOARD_SPACING,
      y: PREP_BOARD_ORIGIN.y + BOARD_ROWS * PREP_BOARD_SPACING,
      axis: "col",
      targetIndex: col,
    })),
  ];
  const ITEM_BENCH_COLS = 2;
  const ITEM_BENCH_ROWS = 4;
  const ITEM_BENCH_DRINK_SLOTS = ITEM_BENCH_COLS * 2;
  const ITEM_BENCH_SLOT_SIZE = 72;
  const ITEM_BENCH_ORIGIN = { x: 70, y: 278 };
  const ITEM_BENCH_SPACING = { x: 78, y: 78 };
  const itemBenchSlots = Array.from({ length: ITEM_BENCH_COLS * ITEM_BENCH_ROWS }, (_, index) => {
    const col = index % ITEM_BENCH_COLS;
    const row = Math.floor(index / ITEM_BENCH_COLS);
    return {
      x: ITEM_BENCH_ORIGIN.x + col * ITEM_BENCH_SPACING.x,
      y: ITEM_BENCH_ORIGIN.y + row * ITEM_BENCH_SPACING.y,
      col,
      row,
      kind: index < ITEM_BENCH_DRINK_SLOTS ? "drink" : "topping",
    };
  });
  const benchSlots = Array.from({ length: 8 }, (_, i) => ({ x: 70 + i * 78, y: 600 }));
  const shopSlots = Array.from({ length: 8 }, (_, i) => ({ x: 46 + i * 88, y: 146 }));

  function initialShopUnlocked() {
    return shopSlots.map((_, index) => index < SHOP_STARTING_UNLOCKED_SLOTS);
  }

  function isShopSlotUnlocked(index) {
    return Boolean(state?.shopUnlocked?.[index]);
  }

  function shopSlotUnlockCost(index) {
    return SHOP_SLOT_UNLOCK_COSTS[index] ?? SHOP_SLOT_UNLOCK_COSTS[SHOP_SLOT_UNLOCK_COSTS.length - 1] ?? 0;
  }

  const buttons = {
    shopUpgrade: { x: 650, y: 4, w: 112, h: 52, label: "Upgrade", icon: "^", signSrc: "assets/ui/runtime/chalk-sign-upgrade-v1.webp" },
    roll: { x: 775, y: 4, w: 112, h: 52, label: "Roll", icon: "R", signSrc: "assets/ui/runtime/chalk-sign-reroll-v1.webp" },
    battle: { x: 900, y: 4, w: 112, h: 52, label: "Battle", icon: ">", signSrc: "assets/ui/runtime/chalk-sign-battle-v1.webp" },
    battleSpeed: { x: 812, y: 4, w: 126, h: 52, label: "Speed 1x", icon: ">>", signSrc: BATTLE_SPEED_CHALK_SRC, chalkMode: "speed" },
    next: { x: 812, y: 4, w: 150, h: 52, label: "Next", icon: ">" },
    reward0: { x: 718, y: 358, w: 268, h: 50, label: "Reward", icon: "" },
    reward1: { x: 718, y: 418, w: 268, h: 50, label: "Reward", icon: "" },
    reward2: { x: 718, y: 478, w: 268, h: 50, label: "Reward", icon: "" },
    sell: { x: 906, y: 390, w: 92, h: 28, label: "Sell", icon: "" },
    detach: { x: 906, y: 422, w: 92, h: 28, label: "Detach", icon: "" },
  };

  const ECONOMY = {
    startingGold: 100,
    maxGold: 300,
    rollCost: 8,
    rerollCostSteps: [
      { after: 0, cost: 8 },
      { after: 3, cost: 10 },
      { after: 6, cost: 12 },
    ],
    unitCost: 30,
    itemCost: 18,
    winGold: 50,
    lossGold: 42,
    interestStep: 25,
    interestGold: 5,
    interestCap: 15,
    streakGold: [
      { at: 6, gold: 20 },
      { at: 4, gold: 12 },
      { at: 2, gold: 6 },
    ],
    sellValues: {
      1: 12,
      2: 45,
      3: 125,
      4: 300,
    },
  };
  const ENEMY_ARCHETYPES = [
    { id: "balanced", label: "Balanced", weight: 5, countBias: 0, tierBias: 0, tier3Bias: 0, statBias: 0, itemBias: 0, drinkBias: 0, traitFocus: 0.35 },
    { id: "swarm", label: "Swarm", weight: 3, minRound: 2, countBias: 1, tierBias: -0.12, tier3Bias: -0.05, statBias: -0.04, itemBias: -1, drinkBias: 0, traitFocus: 0.25 },
    { id: "elite", label: "Elite", weight: 3, minRound: 4, countBias: -1, tierBias: 0.18, tier3Bias: 0.08, statBias: 0.06, itemBias: 1, drinkBias: -1, traitFocus: 0.45 },
    { id: "trait", label: "Trait Pack", weight: 4, minRound: 3, countBias: 0, tierBias: 0.04, tier3Bias: 0.02, statBias: 0, itemBias: 0, drinkBias: 0, traitFocus: 0.9 },
    { id: "loaded", label: "Loaded", weight: 3, minRound: 5, countBias: -1, tierBias: 0.02, tier3Bias: 0.03, statBias: 0.02, itemBias: 1, drinkBias: 1, traitFocus: 0.55 },
  ];
  const ENEMY_ARCHETYPE_PRIMARY_SHARE = 0.64;
  const ENEMY_ARCHETYPE_NOISE = {
    countBias: 0.38,
    tierBias: 0.045,
    tier3Bias: 0.025,
    statBias: 0.022,
    itemBias: 0.38,
    drinkBias: 0.38,
    traitFocus: 0.14,
    rarityBias: 0.34,
  };
  const TIER_SCALING = [
    null,
    { hp: 1, atk: 1, speed: 1, ability: 1 },
    { hp: 2.35, atk: 2.15, speed: 0.92, ability: 1.45 },
    { hp: 4.9, atk: 4.35, speed: 0.84, ability: 2.1 },
    { hp: 9.2, atk: 8.15, speed: 0.76, ability: 3.15 },
  ];
  const GLOBAL_HP_SCALE = 7.4;
  const MERGE_GOLD_REWARD = {
    2: 8,
    3: 16,
    4: 28,
  };
  const ATTACK_ANIMATION_SECONDS = 0.32;
  const ATTACK_PROJECTILE_SIZE = 58;
  const BATTLE_TIMEOUT_SECONDS = 150;
  const MOLD_START_SECONDS = 45;
  const MOLD_TICK_SECONDS = 1;
  const MOLD_BASE_DAMAGE_PCT = 0.024;
  const MOLD_STACK_DAMAGE_PCT = 0.008;
  const MOLD_MAX_DAMAGE_PCT = 0.32;
  const BATTLE_SPEEDS = [0.5, 1, 2, 4];
  const STATUS_EFFECT_STYLES = {
    burn: { color: "#e24822", accent: "#ffc14a", kind: "flame" },
    mark: { color: "#59651d", accent: "#d8e46b", kind: "target" },
    haste: { color: "#f0b12e", accent: "#fff0a8", kind: "chevron" },
    attackBoost: { color: "#d7a64e", accent: "#fff3bd", kind: "burst" },
    attackSlow: { color: "#f4d67a", accent: "#7c5a1e", kind: "down" },
    antiSupport: { color: "#f4dcaa", accent: "#8b5d35", kind: "brokenPlus" },
    slowed: { color: "#5aa832", accent: "#d8f2a2", kind: "vine" },
    lateFightStacks: { color: "#e39b22", accent: "#fff0a8", kind: "crown" },
    teamVulnerable: { color: "#d9a12c", accent: "#fff1a4", kind: "target" },
    mold: { color: "#668f44", accent: "#c8df73", kind: "mold" },
  };
  const STATUS_EFFECT_SPRITES = {
    burn: "assets/status-effects/runtime/status-flash-effect_burn_idle_SW_00.png",
    mark: "assets/status-effects/runtime/status-flash-effect_mark_idle_SW_00.png",
    teamVulnerable: "assets/status-effects/runtime/status-flash-effect_team_vulnerable_idle_SW_00.png",
    haste: "assets/status-effects/runtime/status-flash-effect_haste_idle_SW_00.png",
    attackBoost: "assets/status-effects/runtime/status-flash-effect_attack_boost_idle_SW_00.png",
    attackSlow: "assets/status-effects/runtime/status-flash-effect_attack_slow_idle_SW_00.png",
    antiSupport: "assets/status-effects/runtime/status-flash-effect_anti_support_idle_SW_00.png",
    slowed: "assets/status-effects/runtime/status-flash-effect_slowed_idle_SW_00.png",
    lateFightStacks: "assets/status-effects/runtime/status-flash-effect_late_fight_stacks_idle_SW_00.png",
    mold: "assets/status-effects/runtime/status-flash-effect_mold_idle_SW_00.png",
  };
  const RARITIES = {
    common: {
      id: "common",
      label: "Common",
      short: "C",
      shopWeight: 100,
      fill: "#6b9d5d",
      text: "#f8f5df",
      stroke: "#16392d",
    },
    uncommon: {
      id: "uncommon",
      label: "Uncommon",
      short: "U",
      shopWeight: 24,
      fill: "#4d9d95",
      text: "#f8f5df",
      stroke: "#16392d",
    },
    rare: {
      id: "rare",
      label: "Rare",
      short: "R",
      shopWeight: 8,
      fill: "#5a78c8",
      text: "#f8f5df",
      stroke: "#16392d",
    },
    epic: {
      id: "epic",
      label: "Epic",
      short: "E",
      shopWeight: 2,
      fill: "#9a5bbf",
      text: "#f8f5df",
      stroke: "#16392d",
    },
  };
  const SHOP_LEVELS = [
    {
      level: 1,
      upgradeCost: 50,
      rarityWeights: { common: 100, uncommon: 22, rare: 0, epic: 0 },
    },
    {
      level: 2,
      upgradeCost: 75,
      rarityWeights: { common: 90, uncommon: 32, rare: 10, epic: 0 },
    },
    {
      level: 3,
      upgradeCost: 105,
      rarityWeights: { common: 72, uncommon: 42, rare: 22, epic: 6 },
    },
    {
      level: 4,
      upgradeCost: null,
      rarityWeights: { common: 58, uncommon: 42, rare: 30, epic: 14 },
    },
  ];
  const MAX_SHOP_LEVEL = SHOP_LEVELS.length;
  const MAX_ITEM_TIER = 3;
  const ITEM_TIER_SCALING = {
    1: 1,
    2: 1.5,
    3: 2.15,
  };
  const ITEM_MERGE_GOLD_REWARD = {
    2: 6,
    3: 14,
  };
  const ITEM_SCALABLE_PROPS = [
    "damageBonusPct",
    "attackSpeedPct",
    "maxHpBonusPct",
    "abilityPowerBonusPct",
    "drinkAttackSpeedPct",
    "drinkMaxHpPct",
    "drinkAbilityPowerPct",
    "pairedDrinkAttackSpeedPct",
    "pairedDrinkMaxHpPct",
    "pairedDrinkAbilityPowerPct",
    "onAttackShieldPct",
    "onHitShieldPct",
    "shieldCrackleDamagePct",
    "burnDamagePct",
    "supportBonusPct",
    "markDamagePct",
    "selfHealPct",
    "splashDamagePct",
    "lateFightDamagePct",
    "lowHpAttackSpeedPct",
    "lowHpLifestealPct",
    "cooldownDelay",
    "supportHastePct",
    "antiSupportPct",
    "receivedSupportSharePct",
    "bounceDamagePct",
    "shieldedAttackBonusPct",
    "overhealShieldPct",
    "frontRowDamageReductionPct",
    "adjacentStartShieldPct",
    "adjacentStartAttackBuffPct",
    "pierceDamagePct",
    "lowHpBurnDamagePct",
    "deathSaveShieldPct",
    "firstDebuffCleanseHealPct",
    "timedHastePct",
    "shieldedTargetDamagePct",
    "attackSlowPct",
    "statusDurationReductionPct",
    "statusDamageReductionPct",
    "decoyHpPct",
    "periodicDamage",
    "periodicDamagePct",
    "sellBonusGold",
    "surviveGold",
    "firstItemDiscountGold",
    "sameLineShopChancePct",
    "extraAdjacentHealPct",
    "shieldCapBonusPct",
    "statusDurationBonusPct",
    "supportAttackBuffPct",
    "firstAttacksBonusPct",
    "shieldedAttackSpeedPct",
    "teamVulnerabilityPct",
    "executeSplashBonusPct",
    "executeSplashDamagePct",
    "teamOverhealShieldPct",
    "teamHastePct",
    "supportRowEchoPct",
  ];

  const ITEMS = [
    {
      id: "sunny_side_egg",
      kind: "item",
      type: "topping",
      name: "Sunny-Side Egg",
      short: "Egg",
      rarity: "common",
      color: "#f7c63d",
      accent: "#f08a16",
      price: ECONOMY.itemCost,
      shopWeight: 28,
      damageBonusPct: 0.1,
      splashDamagePct: 0.16,
      abilityText: "Damage and yolk splash",
      cardText: "Dmg splash",
      description: "A glossy egg topping that raises attack damage and splashes runny yolk damage to nearby enemies.",
    },
    {
      id: "butter_pat",
      kind: "item",
      type: "topping",
      name: "Butter Pat",
      short: "Butter",
      rarity: "common",
      color: "#ffe476",
      accent: "#e6a31c",
      price: ECONOMY.itemCost,
      shopWeight: 24,
      attackSpeedPct: 0.08,
      attackSlowPct: 0.1,
      attackSlowDuration: 2.2,
      abilityText: "Speed and slippery hits",
      cardText: "Spd slow",
      description: "A golden pat of butter that makes repeated attacks come out faster and leaves targets a little slowed.",
    },
    {
      id: "cheese_star",
      kind: "item",
      type: "topping",
      name: "Cheese Star",
      short: "Cheese",
      rarity: "common",
      color: "#ffd44f",
      accent: "#d98916",
      price: ECONOMY.itemCost,
      shopWeight: 24,
      maxHpBonusPct: 0.15,
      onHitShieldPct: 0.035,
      abilityText: "HP and hit shields",
      cardText: "HP shield",
      description: "A sturdy cheese star that helps the holder stay in the fight longer and rebuilds a small shield after taking hits.",
    },
    {
      id: "bacon_strips",
      kind: "item",
      type: "topping",
      name: "Bacon Strips",
      short: "Bacon",
      rarity: "uncommon",
      color: "#b94a2d",
      accent: "#f2b36d",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      shieldCrackleDamagePct: 0.08,
      abilityText: "Shielded hits crackle back",
      cardText: "Shield crackle",
      description: "Crispy bacon strips that crackle back at enemies when the holder is hit while shielded.",
    },
    {
      id: "bean_brew",
      kind: "item",
      type: "drink",
      name: "Bean Brew",
      short: "Brew",
      rarity: "common",
      color: "#7b4a2d",
      accent: "#e8b765",
      price: ECONOMY.itemCost,
      shopWeight: 9,
      drinkAttackSpeedPct: 0.08,
      pairTraits: ["breakfast", "bakery"],
      pairedDrinkAttackSpeedPct: 0.05,
      drinkPulseType: "haste",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.2,
      drinkPulseHastePct: 0.1,
      abilityText: "Drink line speed",
      cardText: "Line spd",
      description: "A warm drink that speeds up its line, with extra tempo and a merged haste pulse for Breakfast and Bakery animals.",
    },
    {
      id: "berry_fizz",
      kind: "item",
      type: "drink",
      name: "Berry Fizz",
      short: "Fizz",
      rarity: "common",
      color: "#b83b78",
      accent: "#ff8ac7",
      price: ECONOMY.itemCost,
      shopWeight: 8,
      drinkMaxHpPct: 0.1,
      pairTraits: ["sweet", "snack"],
      pairedDrinkMaxHpPct: 0.08,
      drinkPulseType: "shield",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseShieldPct: 0.075,
      abilityText: "Drink line HP",
      cardText: "Line HP",
      description: "A bubbly drink that gives max HP to its line, with extra body and a merged shield pulse for Sweet and Snack animals.",
    },
    {
      id: "garden_spritz",
      kind: "item",
      type: "drink",
      name: "Garden Spritz",
      short: "Spritz",
      rarity: "uncommon",
      color: "#78b84d",
      accent: "#d8f2a2",
      price: ECONOMY.itemCost + 5,
      shopWeight: 7,
      drinkAbilityPowerPct: 0.1,
      pairTraits: ["fresh", "snack"],
      pairedDrinkAbilityPowerPct: 0.08,
      drinkPulseType: "heal",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseHealPct: 0.075,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A crisp herb soda that boosts line ability power, with extra lift and a merged recovery pulse for Fresh and Snack animals.",
    },
    {
      id: "citrus_tea",
      kind: "item",
      type: "drink",
      name: "Citrus Tea",
      short: "Tea",
      rarity: "uncommon",
      color: "#f2d45c",
      accent: "#66a85d",
      price: ECONOMY.itemCost + 5,
      shopWeight: 7,
      drinkAbilityPowerPct: 0.12,
      pairTraits: ["ocean", "street_food"],
      pairedDrinkAbilityPowerPct: 0.08,
      drinkPulseType: "brine",
      drinkPulseInterval: 5.5,
      drinkPulseDuration: 2.2,
      drinkPulseEnemyDamagePct: 0.06,
      drinkPulseAttackSlowPct: 0.14,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A bright drink that boosts line ability power, with extra spark and a merged brine pulse for Ocean and Street animals.",
    },
    {
      id: "chili_crunch_cola",
      kind: "item",
      type: "drink",
      name: "Chili Crunch Cola",
      short: "Cola",
      rarity: "rare",
      color: "#d64228",
      accent: "#f4d35e",
      price: ECONOMY.itemCost + 10,
      shopWeight: 5,
      drinkAttackSpeedPct: 0.1,
      pairTraits: ["snack", "spicy"],
      pairedDrinkAttackSpeedPct: 0.07,
      drinkPulseType: "attack_boost",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.2,
      drinkPulseAttackBoostPct: 0.11,
      abilityText: "Drink line speed",
      cardText: "Line spd",
      description: "A fizzy chili-cola that speeds up its line, with extra crunch and a merged damage pulse for Snack and Spicy animals.",
    },
    {
      id: "pepper_broth",
      kind: "item",
      type: "drink",
      name: "Pepper Broth",
      short: "Broth",
      rarity: "uncommon",
      color: "#b9482f",
      accent: "#f0c64a",
      price: ECONOMY.itemCost + 5,
      shopWeight: 6,
      drinkMaxHpPct: 0.12,
      pairTraits: ["spicy", "street_food"],
      pairedDrinkMaxHpPct: 0.06,
      drinkPulseType: "shield",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseShieldPct: 0.085,
      abilityText: "Drink line HP",
      cardText: "Line HP",
      description: "A warming pepper broth that toughens its line, with extra body and a merged shield pulse for Spicy and Street animals.",
    },
    {
      id: "abyssal_shake",
      kind: "item",
      type: "drink",
      name: "Abyssal Shake",
      short: "Abyss",
      rarity: "epic",
      color: "#355f9f",
      accent: "#f4a7d8",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      drinkAbilityPowerPct: 0.18,
      pairTraits: ["ocean", "sweet"],
      pairedDrinkAbilityPowerPct: 0.1,
      drinkPulseType: "brine",
      drinkPulseInterval: 5.5,
      drinkPulseDuration: 2.5,
      drinkPulseEnemyDamagePct: 0.08,
      drinkPulseAttackSlowPct: 0.18,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A deep-sea dessert shake that boosts line ability power, with extra surge and a merged abyss pulse for Ocean and Sweet animals.",
    },
    {
      id: "cream_soda_float",
      kind: "item",
      type: "drink",
      name: "Cream Soda Float",
      short: "Float",
      rarity: "common",
      color: "#f2d1a5",
      accent: "#f47ca9",
      price: ECONOMY.itemCost,
      shopWeight: 7,
      drinkMaxHpPct: 0.09,
      pairTraits: ["bakery", "sweet"],
      pairedDrinkMaxHpPct: 0.07,
      drinkPulseType: "shield",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseShieldPct: 0.08,
      abilityText: "Drink line HP",
      cardText: "Line HP",
      description: "A dessert float that gives max HP to its line, with a merged shield pulse for Bakery and Sweet teams.",
    },
    {
      id: "tidepool_espresso",
      kind: "item",
      type: "drink",
      name: "Tidepool Espresso",
      short: "Tide",
      rarity: "uncommon",
      color: "#2f6f8f",
      accent: "#d5a15a",
      price: ECONOMY.itemCost + 5,
      shopWeight: 6,
      drinkAttackSpeedPct: 0.09,
      pairTraits: ["breakfast", "ocean"],
      pairedDrinkAttackSpeedPct: 0.06,
      drinkPulseType: "haste",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.2,
      drinkPulseHastePct: 0.12,
      abilityText: "Drink line speed",
      cardText: "Line spd",
      description: "A briny espresso that speeds its line, with a merged haste pulse for Breakfast and Ocean animals.",
    },
    {
      id: "avocado_lassi",
      kind: "item",
      type: "drink",
      name: "Avocado Lassi",
      short: "Lassi",
      rarity: "uncommon",
      color: "#7fb65c",
      accent: "#f3e4a7",
      price: ECONOMY.itemCost + 5,
      shopWeight: 6,
      drinkMaxHpPct: 0.1,
      pairTraits: ["fresh", "sweet"],
      pairedDrinkMaxHpPct: 0.07,
      drinkPulseType: "heal",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseHealPct: 0.08,
      abilityText: "Drink line HP",
      cardText: "Line HP",
      description: "A creamy green lassi that toughens its line, with a merged recovery pulse for Fresh and Sweet animals.",
    },
    {
      id: "chili_brine_tonic",
      kind: "item",
      type: "drink",
      name: "Chili Brine Tonic",
      short: "Tonic",
      rarity: "rare",
      color: "#d94b32",
      accent: "#4da1b5",
      price: ECONOMY.itemCost + 10,
      shopWeight: 4,
      drinkAbilityPowerPct: 0.12,
      pairTraits: ["ocean", "spicy"],
      pairedDrinkAbilityPowerPct: 0.08,
      drinkPulseType: "brine",
      drinkPulseInterval: 5.5,
      drinkPulseDuration: 2.4,
      drinkPulseEnemyDamagePct: 0.07,
      drinkPulseAttackSlowPct: 0.16,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A sharp chili brine that boosts line ability power, with a merged pulse that stings and slows enemies.",
    },
    {
      id: "market_malt",
      kind: "item",
      type: "drink",
      name: "Market Malt",
      short: "Malt",
      rarity: "common",
      color: "#c97a35",
      accent: "#ffcf5a",
      price: ECONOMY.itemCost,
      shopWeight: 7,
      drinkAttackSpeedPct: 0.08,
      pairTraits: ["snack", "street_food"],
      pairedDrinkAttackSpeedPct: 0.05,
      drinkPulseType: "attack_boost",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.2,
      drinkPulseAttackBoostPct: 0.1,
      abilityText: "Drink line speed",
      cardText: "Line spd",
      description: "A busy counter malt that speeds its line, with a merged damage pulse for Snack and Street animals.",
    },
    {
      id: "maple_cloud_cocoa",
      kind: "item",
      type: "drink",
      name: "Maple Cloud Cocoa",
      short: "Cocoa",
      rarity: "common",
      color: "#b96f38",
      accent: "#f1c96b",
      price: ECONOMY.itemCost,
      shopWeight: 6,
      drinkAbilityPowerPct: 0.09,
      pairTraits: ["breakfast", "sweet"],
      pairedDrinkAbilityPowerPct: 0.06,
      drinkPulseType: "heal",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseHealPct: 0.07,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A warm maple cocoa that boosts line ability power, with a merged comfort pulse for Breakfast and Sweet animals.",
    },
    {
      id: "pearl_biscuit_latte",
      kind: "item",
      type: "drink",
      name: "Pearl Biscuit Latte",
      short: "Pearl",
      rarity: "uncommon",
      color: "#d9b983",
      accent: "#63a7bc",
      price: ECONOMY.itemCost + 5,
      shopWeight: 5,
      drinkMaxHpPct: 0.1,
      pairTraits: ["bakery", "ocean"],
      pairedDrinkMaxHpPct: 0.07,
      drinkPulseType: "shield",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseShieldPct: 0.08,
      abilityText: "Drink line HP",
      cardText: "Line HP",
      description: "A biscuit-topped pearl latte that toughens its line, with a merged shell pulse for Bakery and Ocean animals.",
    },
    {
      id: "kelp_cucumber_cooler",
      kind: "item",
      type: "drink",
      name: "Kelp Cucumber Cooler",
      short: "Cooler",
      rarity: "uncommon",
      color: "#66b89a",
      accent: "#6fd1e3",
      price: ECONOMY.itemCost + 5,
      shopWeight: 5,
      drinkAttackSpeedPct: 0.08,
      pairTraits: ["fresh", "ocean"],
      pairedDrinkAttackSpeedPct: 0.06,
      drinkPulseType: "haste",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.2,
      drinkPulseHastePct: 0.11,
      abilityText: "Drink line speed",
      cardText: "Line spd",
      description: "A crisp kelp-cucumber cooler that speeds its line, with a merged tide pulse for Fresh and Ocean animals.",
    },
    {
      id: "nori_pop_slush",
      kind: "item",
      type: "drink",
      name: "Nori Pop Slush",
      short: "Slush",
      rarity: "rare",
      color: "#4aa3a1",
      accent: "#f0dc66",
      price: ECONOMY.itemCost + 10,
      shopWeight: 4,
      drinkAbilityPowerPct: 0.11,
      pairTraits: ["ocean", "snack"],
      pairedDrinkAbilityPowerPct: 0.07,
      drinkPulseType: "attack_boost",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.2,
      drinkPulseAttackBoostPct: 0.11,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A crunchy nori slush that boosts line ability power, with a merged pop pulse for Ocean and Snack animals.",
    },
    {
      id: "harissa_morning_shot",
      kind: "item",
      type: "drink",
      name: "Harissa Morning Shot",
      short: "Harissa",
      rarity: "uncommon",
      color: "#c94a2e",
      accent: "#f4c35b",
      price: ECONOMY.itemCost + 5,
      shopWeight: 5,
      drinkAbilityPowerPct: 0.1,
      pairTraits: ["breakfast", "spicy"],
      pairedDrinkAbilityPowerPct: 0.07,
      drinkPulseType: "brine",
      drinkPulseInterval: 5.5,
      drinkPulseDuration: 2.2,
      drinkPulseEnemyDamagePct: 0.064,
      drinkPulseAttackSlowPct: 0.15,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A fiery breakfast shot that boosts line ability power, with a merged harissa pulse for Breakfast and Spicy animals.",
    },
    {
      id: "pretzel_cream_soda",
      kind: "item",
      type: "drink",
      name: "Pretzel Cream Soda",
      short: "Pretzel",
      rarity: "common",
      color: "#c98945",
      accent: "#f0d176",
      price: ECONOMY.itemCost,
      shopWeight: 6,
      drinkMaxHpPct: 0.09,
      pairTraits: ["bakery", "snack"],
      pairedDrinkMaxHpPct: 0.07,
      drinkPulseType: "shield",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseShieldPct: 0.08,
      abilityText: "Drink line HP",
      cardText: "Line HP",
      description: "A salty-sweet cream soda that toughens its line, with a merged pretzel shield pulse for Bakery and Snack animals.",
    },
    {
      id: "boba_night_tea",
      kind: "item",
      type: "drink",
      name: "Boba Night Tea",
      short: "Night",
      rarity: "rare",
      color: "#4a3c83",
      accent: "#d7a7f2",
      price: ECONOMY.itemCost + 10,
      shopWeight: 4,
      drinkAbilityPowerPct: 0.12,
      pairTraits: ["sweet", "street_food"],
      pairedDrinkAbilityPowerPct: 0.08,
      drinkPulseType: "attack_boost",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.2,
      drinkPulseAttackBoostPct: 0.11,
      abilityText: "Drink line PWR",
      cardText: "Line PWR",
      description: "A neon boba tea that boosts line ability power, with a merged night-market pulse for Sweet and Street animals.",
    },
    {
      id: "pico_lime_agua",
      kind: "item",
      type: "drink",
      name: "Pico Lime Agua",
      short: "Agua",
      rarity: "uncommon",
      color: "#63b85f",
      accent: "#f5df64",
      price: ECONOMY.itemCost + 5,
      shopWeight: 5,
      drinkAttackSpeedPct: 0.08,
      pairTraits: ["street_food", "fresh"],
      pairedDrinkAttackSpeedPct: 0.06,
      drinkPulseType: "heal",
      drinkPulseInterval: 5,
      drinkPulseDuration: 2.4,
      drinkPulseHealPct: 0.075,
      abilityText: "Drink line speed",
      cardText: "Line spd",
      description: "A bright lime agua fresca that speeds its line, with a merged recovery pulse for Street and Fresh animals.",
    },
    {
      id: "cherry_tomato",
      kind: "item",
      type: "topping",
      name: "Cherry Tomato",
      short: "Tomato",
      rarity: "uncommon",
      color: "#ef3b22",
      accent: "#b91e14",
      price: ECONOMY.itemCost + 5,
      shopWeight: 14,
      abilityPowerBonusPct: 0.12,
      supportRowEchoPct: 0.3,
      abilityText: "PWR and row echo",
      cardText: "PWR echo",
      description: "A bright tomato topper that strengthens abilities and echoes support into small shields across the supported ally's row.",
    },
    {
      id: "pickle_chip",
      kind: "item",
      type: "topping",
      name: "Pickle Chip",
      short: "Pickle",
      rarity: "uncommon",
      color: "#b8c94c",
      accent: "#597a20",
      price: ECONOMY.itemCost + 5,
      shopWeight: 10,
      onAttackShieldPct: 0.06,
      abilityText: "Shield after attacks",
      cardText: "Atk shield",
      description: "A crunchy pickle chip that gives the holder a small shield after each attack.",
    },
    {
      id: "mushroom_cap",
      kind: "item",
      type: "topping",
      name: "Mushroom Cap",
      short: "Mushroom",
      rarity: "uncommon",
      color: "#b95827",
      accent: "#8f3f20",
      price: ECONOMY.itemCost + 5,
      shopWeight: 12,
      onHitShieldPct: 0.04,
      abilityText: "Shield after hits",
      cardText: "Hit shield",
      description: "A sturdy cap that grants a small shield whenever the holder takes damage.",
    },
    {
      id: "pepperoni_slice",
      kind: "item",
      type: "topping",
      name: "Pepperoni Slice",
      short: "Pepperoni",
      rarity: "uncommon",
      color: "#e24822",
      accent: "#a91f16",
      price: ECONOMY.itemCost + 5,
      shopWeight: 12,
      burnDamagePct: 0.18,
      burnDuration: 3,
      abilityText: "Attacks burn",
      cardText: "Burn",
      description: "A spicy slice that makes attacks apply a short persistent burn.",
    },
    {
      id: "lemon_wedge",
      kind: "item",
      type: "topping",
      name: "Lemon Wedge",
      short: "Lemon",
      rarity: "rare",
      color: "#ffd94f",
      accent: "#e0a91d",
      price: ECONOMY.itemCost + 10,
      shopWeight: 8,
      supportBonusPct: 0.15,
      firstDebuffCleanseHealPct: 0.1,
      abilityText: "Support and cleanse",
      cardText: "Sup cleanse",
      description: "A bright wedge that strengthens healing and shielding, then clears the first bad status and heals the holder.",
    },
    {
      id: "olive_ring",
      kind: "item",
      type: "topping",
      name: "Olive Ring",
      short: "Olive",
      rarity: "rare",
      color: "#59651d",
      accent: "#314015",
      price: ECONOMY.itemCost + 10,
      shopWeight: 8,
      markDamagePct: 0.1,
      markDuration: 4,
      abilityText: "Marks targets",
      cardText: "Mark dmg",
      description: "A savory ring that marks targets so the holder deals more damage to them.",
    },
    {
      id: "chili_pepper",
      kind: "item",
      type: "topping",
      name: "Chili Pepper",
      short: "Chili",
      rarity: "rare",
      color: "#e53620",
      accent: "#9e1d12",
      price: ECONOMY.itemCost + 10,
      shopWeight: 8,
      damageBonusPct: 0.22,
      damageTakenPct: 0.12,
      burnDamagePct: 0.12,
      burnDuration: 2.5,
      abilityText: "Risky damage and burn",
      cardText: "Risk burn",
      description: "A risky pepper that boosts damage, makes the holder take more damage, and sets attacked enemies burning.",
    },
    {
      id: "avocado_fan",
      kind: "item",
      type: "topping",
      name: "Avocado Fan",
      short: "Avocado",
      rarity: "uncommon",
      color: "#b5d84b",
      accent: "#4f8d2b",
      price: ECONOMY.itemCost + 5,
      shopWeight: 10,
      everyNAttacks: 3,
      selfHealPct: 0.09,
      abilityText: "Every 3 attacks heal",
      cardText: "3rd heal",
      description: "A smooth avocado fan that heals the holder every third attack.",
    },
    {
      id: "jam_dollop",
      kind: "item",
      type: "topping",
      name: "Jam Dollop",
      short: "Jam",
      rarity: "rare",
      color: "#7d255f",
      accent: "#c03b87",
      price: ECONOMY.itemCost + 10,
      shopWeight: 8,
      splashDamagePct: 0.24,
      abilityText: "Attacks splash",
      cardText: "Splash",
      description: "A sticky jam dollop that splashes part of attack damage to nearby enemies.",
    },
    {
      id: "caramel_crown",
      kind: "item",
      type: "topping",
      name: "Caramel Crown",
      short: "Caramel",
      rarity: "rare",
      color: "#e39b22",
      accent: "#9c5a12",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      lateFightStart: 8,
      lateFightInterval: 4,
      lateFightDamagePct: 0.08,
      lateFightMaxStacks: 4,
      abilityText: "Scales after 8s",
      cardText: "Late scale",
      description: "A caramel crown that gains stacking damage in long fights.",
    },
    {
      id: "whipped_cream_puff",
      kind: "item",
      type: "topping",
      name: "Whipped Cream Puff",
      short: "Cream",
      rarity: "rare",
      color: "#fff7df",
      accent: "#d14d31",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      lowHpThreshold: 0.5,
      lowHpAttackSpeedPct: 0.18,
      lowHpLifestealPct: 0.18,
      abilityText: "Low HP lifesteal",
      cardText: "Comeback",
      description: "A cream puff that gives attack speed and lifesteal while the holder is below half HP.",
    },
    {
      id: "basil_leaf",
      kind: "item",
      type: "topping",
      name: "Basil Leaf",
      short: "Basil",
      rarity: "uncommon",
      color: "#5aa832",
      accent: "#2f6e1e",
      price: ECONOMY.itemCost + 5,
      shopWeight: 10,
      cooldownDelay: 0.18,
      abilityText: "Attacks slow target",
      cardText: "Slow",
      description: "A fresh basil leaf that delays the target's next attack after each hit.",
    },
    {
      id: "honey_drizzle",
      kind: "item",
      type: "topping",
      name: "Honey Drizzle",
      short: "Honey",
      rarity: "rare",
      color: "#f0b12e",
      accent: "#b56b12",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      supportHastePct: 0.18,
      supportHasteDuration: 3,
      abilityText: "Support grants haste",
      cardText: "Ally haste",
      description: "A honey drizzle that gives attack-speed haste to allies this unit heals or shields.",
    },
    {
      id: "garlic_clove",
      kind: "item",
      type: "topping",
      name: "Garlic Clove",
      short: "Garlic",
      rarity: "rare",
      color: "#f4dcaa",
      accent: "#b98642",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      antiSupportPct: 0.25,
      antiSupportDuration: 4,
      abilityText: "Cuts enemy support",
      cardText: "Anti-heal",
      description: "A pungent garlic clove that makes attacked enemies receive less healing and shielding.",
    },
    {
      id: "rice_ball",
      kind: "item",
      type: "topping",
      name: "Rice Ball",
      short: "Rice",
      rarity: "uncommon",
      color: "#fff6da",
      accent: "#2b2b25",
      price: ECONOMY.itemCost + 5,
      shopWeight: 10,
      receivedSupportSharePct: 0.25,
      abilityText: "Shares received support",
      cardText: "Share sup",
      description: "A steady rice ball that shares part of received healing and shielding with adjacent allies.",
    },
    {
      id: "onion_ring",
      kind: "item",
      type: "topping",
      name: "Onion Ring",
      short: "Onion",
      rarity: "rare",
      color: "#f3aa25",
      accent: "#c06417",
      price: ECONOMY.itemCost + 10,
      shopWeight: 8,
      bounceDamagePct: 0.45,
      abilityText: "Attacks bounce",
      cardText: "Bounce",
      description: "A crispy onion ring that bounces part of attack damage to another enemy.",
    },
    {
      id: "maple_leaf",
      kind: "item",
      type: "topping",
      name: "Maple Syrup",
      short: "Syrup",
      rarity: "rare",
      color: "#c97816",
      accent: "#f2b63d",
      price: ECONOMY.itemCost + 10,
      shopWeight: 8,
      shieldedAttackBonusPct: 0.2,
      adjacentStartAttackBuffPct: 0.12,
      adjacentStartBuffDuration: 3,
      abilityText: "Shielded hits, adj buff",
      cardText: "Syrup buff",
      description: "A rich maple syrup swirl that rewards shielded fighters and gives adjacent allies a short battle-start damage boost.",
    },
    {
      id: "marshmallow_cube",
      kind: "item",
      type: "topping",
      name: "Marshmallow Cube",
      short: "Mallow",
      rarity: "rare",
      color: "#fff4ea",
      accent: "#d87b62",
      price: ECONOMY.itemCost + 10,
      shopWeight: 8,
      overhealShieldPct: 0.65,
      abilityText: "Overheal becomes shield",
      cardText: "Overheal",
      description: "A soft marshmallow cube that turns excess healing into temporary shielding.",
    },
    {
      id: "cookie_crumb",
      kind: "item",
      type: "topping",
      name: "Cookie Crumb",
      short: "Cookie",
      rarity: "epic",
      color: "#d88b2f",
      accent: "#8a4a1d",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      mergeProgressBonus: 1,
      abilityText: "+1 merge copy on bench",
      cardText: "+1 copy",
      description: "A chunky cookie crumb that counts as one extra merge copy while attached to a benched animal.",
    },
    {
      id: "seaweed_wrap",
      kind: "item",
      type: "topping",
      name: "Seaweed Wrap",
      short: "Seaweed",
      rarity: "uncommon",
      color: "#263f20",
      accent: "#8cae48",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      frontRowDamageReductionPct: 0.16,
      abilityText: "Front row takes less damage",
      cardText: "Front tank",
      description: "A sturdy seaweed wrap that reduces damage while the holder is in the front row.",
    },
    {
      id: "pretzel_stick",
      kind: "item",
      type: "topping",
      name: "Pretzel Stick",
      short: "P-Stick",
      rarity: "uncommon",
      color: "#bf6f26",
      accent: "#f1d270",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      backRowTargeting: true,
      abilityText: "Back row can target back row",
      cardText: "Back aim",
      description: "A crunchy pretzel stick that lets a back-row holder pressure enemy backliners.",
    },
    {
      id: "waffle_cone",
      kind: "item",
      type: "topping",
      name: "Waffle Cone",
      short: "Cone",
      rarity: "uncommon",
      color: "#d99736",
      accent: "#9a5b1d",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      adjacentStartShieldPct: 0.08,
      abilityText: "Start shields adjacent allies",
      cardText: "Adj shield",
      description: "A waffle cone that gives nearby allies a small shield at battle start.",
    },
    {
      id: "skewer",
      kind: "item",
      type: "topping",
      name: "Skewer",
      short: "Skewer",
      rarity: "rare",
      color: "#c9852e",
      accent: "#8c4e1d",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      pierceDamagePct: 0.32,
      abilityText: "Attacks pierce behind",
      cardText: "Pierce",
      description: "A pointed skewer that pokes through the first target into the enemy behind it.",
    },
    {
      id: "hot_sauce_bottle",
      kind: "item",
      type: "topping",
      name: "Hot Sauce Swirl",
      short: "Sauce",
      rarity: "rare",
      color: "#e34a1e",
      accent: "#7aa530",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      lowHpBurnThreshold: 0.4,
      lowHpBurnDamagePct: 0.18,
      lowHpBurnDuration: 3,
      abilityText: "Low HP burns nearby enemies",
      cardText: "Clutch burn",
      description: "A spicy sauce swirl that burns nearby enemies once when the holder drops low.",
    },
    {
      id: "sugar_cube",
      kind: "item",
      type: "topping",
      name: "Sugar Cube",
      short: "Sugar",
      rarity: "rare",
      color: "#fff8ee",
      accent: "#d6b88a",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      deathSaveShieldPct: 0.28,
      abilityText: "Survive fatal hit once",
      cardText: "1 HP save",
      description: "A sweet cube that lets the holder survive one fatal hit with a protective shield.",
    },
    {
      id: "mint_leaf",
      kind: "item",
      type: "topping",
      name: "Mint Leaf",
      short: "Mint",
      rarity: "uncommon",
      color: "#58ad3e",
      accent: "#2e6f2b",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      firstDebuffCleanseHealPct: 0.12,
      abilityText: "First debuff cleanses and heals",
      cardText: "Cleanse",
      description: "A fresh mint leaf that clears the first negative status and heals the holder.",
    },
    {
      id: "soda_pop",
      kind: "item",
      type: "topping",
      name: "Soda Fizz Foam",
      short: "Fizz",
      rarity: "rare",
      color: "#d9432d",
      accent: "#f4efe2",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      timedHasteAt: 10,
      timedHastePct: 0.35,
      timedHasteDuration: 4,
      abilityText: "10s burst of haste",
      cardText: "10s haste",
      description: "A bubbly soda-foam topping that pops after long fights and gives the holder haste.",
    },
    {
      id: "salt_shaker",
      kind: "item",
      type: "topping",
      name: "Sea Salt Flakes",
      short: "Salt",
      rarity: "uncommon",
      color: "#f1f1df",
      accent: "#8d7a68",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      shieldedTargetDamagePct: 0.28,
      cooldownDelay: 0.08,
      abilityText: "Cracks shields, delays",
      cardText: "Crack slow",
      description: "A crunchy pile of sea-salt flakes that helps crack shielded enemies and slightly delays targets after hits.",
    },
    {
      id: "vinegar_splash",
      kind: "item",
      type: "topping",
      name: "Pickled Drizzle",
      short: "Pickle",
      rarity: "uncommon",
      color: "#f4d67a",
      accent: "#d79b2d",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      attackSlowPct: 0.18,
      attackSlowDuration: 3,
      abilityText: "Attacks sour enemy speed",
      cardText: "Atk slow",
      description: "A tangy pickled glaze drizzle that slows enemy attack clocks after hits.",
    },
    {
      id: "cucumber_slice",
      kind: "item",
      type: "topping",
      name: "Cucumber Slice",
      short: "Cucumber",
      rarity: "uncommon",
      color: "#bce06b",
      accent: "#2f7a35",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      statusDurationReductionPct: 0.35,
      abilityText: "Statuses fade faster",
      cardText: "Resist",
      description: "A cool cucumber slice that makes negative statuses wear off faster.",
    },
    {
      id: "cracker_plate",
      kind: "item",
      type: "topping",
      name: "Cracker Plate",
      short: "Cracker",
      rarity: "uncommon",
      color: "#e9b955",
      accent: "#9b6824",
      price: ECONOMY.itemCost + 5,
      shopWeight: 9,
      statusDamageReductionPct: 0.3,
      abilityText: "Less splash/status damage",
      cardText: "AOE guard",
      description: "A cracker plate that reduces splash, bounce, burn, and other secondary damage.",
    },
    {
      id: "cherry_pit",
      kind: "item",
      type: "topping",
      name: "Candied Cherry",
      short: "Cherry",
      rarity: "rare",
      color: "#9c4b22",
      accent: "#5f2a19",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      decoyHpPct: 0.22,
      abilityText: "Starts with a decoy",
      cardText: "Decoy",
      description: "A glossy candied cherry that starts battle with a small decoy to soak attention.",
    },
    {
      id: "breadstick_dummy",
      kind: "item",
      type: "topping",
      name: "Breadstick Guard",
      short: "Guard",
      rarity: "rare",
      color: "#d69542",
      accent: "#6f9231",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      firstHitRedirect: true,
      abilityText: "Redirects first hit",
      cardText: "Dummy hit",
      description: "Crossed breadsticks that redirect the first direct hit against the holder.",
    },
    {
      id: "popcorn_kernel",
      kind: "item",
      type: "topping",
      name: "Popcorn Kernel",
      short: "Popcorn",
      rarity: "uncommon",
      color: "#fff0bc",
      accent: "#d98b19",
      price: ECONOMY.itemCost + 5,
      shopWeight: 8,
      periodicDamage: 6,
      periodicDamagePct: 0.2,
      periodicInterval: 3,
      abilityText: "Pops for chip damage",
      cardText: "Pop dmg",
      description: "A popcorn kernel that pops every few seconds for scaling random damage.",
    },
    {
      id: "coupon_clip",
      kind: "item",
      type: "topping",
      name: "Fortune Cookie",
      short: "Fortune",
      rarity: "uncommon",
      color: "#efcb70",
      accent: "#6b5d52",
      price: ECONOMY.itemCost,
      shopWeight: 9,
      sellBonusGold: 18,
      abilityText: "Holder sells for more",
      cardText: "+coins sell",
      description: "A folded fortune cookie that increases the holder's sell value.",
    },
    {
      id: "lucky_grape",
      kind: "item",
      type: "topping",
      name: "Lucky Grape",
      short: "Grape",
      rarity: "uncommon",
      color: "#7d3aa0",
      accent: "#5ea24b",
      price: ECONOMY.itemCost,
      shopWeight: 9,
      surviveGold: 12,
      abilityText: "Survive battle for gold",
      cardText: "+coins survive",
      description: "A lucky grape that pays bonus gold when the holder survives battle.",
    },
    {
      id: "shopping_bag",
      kind: "item",
      type: "topping",
      name: "Golden Wrapper",
      short: "Wrapper",
      rarity: "uncommon",
      color: "#c98f4b",
      accent: "#8a5426",
      price: ECONOMY.itemCost,
      shopWeight: 9,
      firstItemDiscountGold: 15,
      abilityText: "First item each round is cheaper",
      cardText: "Item sale",
      description: "A crisp golden wrapper that discounts the first topping bought each round.",
    },
    {
      id: "recipe_card",
      kind: "item",
      type: "topping",
      name: "Recipe Cracker",
      short: "Recipe",
      rarity: "rare",
      color: "#f0d79d",
      accent: "#6ba044",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      sameLineShopChancePct: 0.28,
      abilityText: "Shops prefer owned lines",
      cardText: "Line odds",
      description: "A stamped recipe cracker that nudges future shops toward food-animal lines you already own.",
    },
    {
      id: "soup_ladle",
      kind: "item",
      type: "topping",
      name: "Soup Spoonful",
      short: "Soup",
      rarity: "rare",
      color: "#b8b0a6",
      accent: "#7a5635",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      extraAdjacentHealPct: 0.45,
      abilityText: "Heals splash to adjacent ally",
      cardText: "Heal splash",
      description: "A creamy soup spoonful that lets healing abilities splash to a nearby ally.",
    },
    {
      id: "gravy_boat",
      kind: "item",
      type: "topping",
      name: "Gravy Pour",
      short: "Gravy",
      rarity: "rare",
      color: "#b87635",
      accent: "#7d4a22",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      supportBonusPct: 0.12,
      shieldCapBonusPct: 0.25,
      abilityText: "Stronger, deeper support",
      cardText: "+12% sup",
      description: "A glossy gravy pour that boosts support output and lets the holder keep a larger shield.",
    },
    {
      id: "spice_jar",
      kind: "item",
      type: "topping",
      name: "Spice Sprinkle",
      short: "Spice",
      rarity: "rare",
      color: "#c9471e",
      accent: "#7a2d1d",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      statusDurationBonusPct: 0.3,
      burnDamagePct: 0.1,
      burnDuration: 2.5,
      abilityText: "Longer statuses, burn",
      cardText: "Status burn",
      description: "A mound of spice flakes that extends inflicted statuses and makes attacks apply a short burn.",
    },
    {
      id: "serving_tray",
      kind: "item",
      type: "topping",
      name: "Garnish Sprig",
      short: "Garnish",
      rarity: "rare",
      color: "#c08039",
      accent: "#d7a64e",
      price: ECONOMY.itemCost + 10,
      shopWeight: 7,
      supportAttackBuffPct: 0.14,
      supportAttackBuffDuration: 3,
      abilityText: "Support buffs ally damage",
      cardText: "Buff ally",
      description: "A fresh garnish sprig that makes supported allies hit harder for a short time.",
    },
    {
      id: "glass_candy",
      kind: "item",
      type: "topping",
      name: "Glass Candy",
      short: "Candy",
      rarity: "rare",
      color: "#f38fa0",
      accent: "#c95b73",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      damageBonusPct: 0.28,
      battleStartHpLossPct: 0.2,
      abilityText: "+28% damage, starts hurt",
      cardText: "Glass dmg",
      description: "A fragile candy that grants huge damage but starts the holder below full HP.",
    },
    {
      id: "wasabi_pea",
      kind: "item",
      type: "topping",
      name: "Wasabi Pea",
      short: "Wasabi",
      rarity: "rare",
      color: "#8dbf3e",
      accent: "#5b8427",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      firstAttacksBonusPct: 0.42,
      firstAttacksCount: 3,
      exhaustedSpeedPenaltyPct: 0.18,
      burnDamagePct: 0.1,
      burnDuration: 2.2,
      abilityText: "Burst attacks burn",
      cardText: "Burst burn",
      description: "A wasabi pea that makes the first few attacks hit hard and burn, then leaves the holder slower.",
    },
    {
      id: "molten_cheese",
      kind: "item",
      type: "topping",
      name: "Molten Cheese",
      short: "Molten",
      rarity: "rare",
      color: "#f3b529",
      accent: "#d97813",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      lateFightStart: 6,
      lateFightInterval: 3,
      lateFightDamagePct: 0.1,
      lateFightMaxStacks: 5,
      selfBurnDamagePct: 0.05,
      abilityText: "Ramps damage, self-burns",
      cardText: "Ramp risk",
      description: "A molten cheese blob that ramps damage over time while slowly burning the holder.",
    },
    {
      id: "brittle_cracker",
      kind: "item",
      type: "topping",
      name: "Brittle Cracker",
      short: "Brittle",
      rarity: "rare",
      color: "#e7aa42",
      accent: "#8c561f",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      shieldedAttackSpeedPct: 0.28,
      abilityText: "Fast while shielded",
      cardText: "Shield spd",
      description: "A brittle cracker that grants high attack speed while the holder has a shield.",
    },
    {
      id: "golden_truffle_crown",
      kind: "item",
      type: "topping",
      name: "Golden Truffle Crown",
      short: "Truffle",
      rarity: "epic",
      color: "#d9a12c",
      accent: "#5b3320",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      teamVulnerabilityPct: 0.1,
      teamVulnerabilityDuration: 4,
      abilityText: "Attacks make enemies vulnerable",
      cardText: "Team vuln",
      description: "A crown of truffle slices that makes attacked enemies take 10% more damage from the whole team for 4 seconds.",
    },
    {
      id: "dragonfruit_star",
      kind: "item",
      type: "topping",
      name: "Dragonfruit Star",
      short: "D-Star",
      rarity: "epic",
      color: "#ec4aa3",
      accent: "#ffe37a",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      executeSplashThreshold: 0.45,
      executeSplashBonusPct: 0.25,
      executeSplashDamagePct: 0.35,
      abilityText: "Finishes wounded groups",
      cardText: "Exec splash",
      description: "A bright dragonfruit star that hits wounded targets harder and splashes nearby enemies when they are below 45% HP.",
    },
    {
      id: "rainbow_mochi",
      kind: "item",
      type: "topping",
      name: "Rainbow Mochi",
      short: "Mochi",
      rarity: "epic",
      color: "#f5a5c9",
      accent: "#63b7d6",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      teamOverhealShieldPct: 0.4,
      abilityText: "Overheal shields nearby allies",
      cardText: "Over team",
      description: "A soft mochi topper that turns overhealing on the holder into shields for adjacent allies.",
    },
    {
      id: "caviar_pearls",
      kind: "item",
      type: "topping",
      name: "Caviar Pearls",
      short: "Caviar",
      rarity: "epic",
      color: "#2f2d33",
      accent: "#d8c27a",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      teamHasteInterval: 5,
      teamHastePct: 0.14,
      teamHasteDuration: 2.5,
      abilityText: "Pulses team haste",
      cardText: "Team haste",
      description: "A cluster of glossy pearls that gives the whole team bursts of attack speed during longer fights.",
    },
    {
      id: "saffron_threads",
      kind: "item",
      type: "topping",
      name: "Saffron Threads",
      short: "Saffron",
      rarity: "epic",
      color: "#d84b24",
      accent: "#f2c94c",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      supportRowEchoPct: 0.45,
      abilityText: "Support echoes across row",
      cardText: "Row echo",
      description: "A bundle of saffron threads that echoes the holder's support into small shields for the supported ally's row.",
    },
    {
      id: "scallion_oil",
      kind: "item",
      type: "topping",
      name: "Scallion Oil",
      short: "Scallion",
      rarity: "uncommon",
      color: "#d6b63a",
      accent: "#4f9838",
      price: ECONOMY.itemCost + 5,
      shopWeight: 8,
      supportAttackBuffPct: 0.12,
      supportAttackBuffDuration: 3,
      abilityText: "Support buffs ally damage",
      cardText: "Buff ally",
      description: "A glossy scallion oil swirl that makes supported allies hit harder for a short time.",
    },
    {
      id: "gochugaru_flakes",
      kind: "item",
      type: "topping",
      name: "Gochugaru Flakes",
      short: "Gochu",
      rarity: "rare",
      color: "#d94722",
      accent: "#f2a13c",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      statusDurationBonusPct: 0.28,
      burnDamagePct: 0.1,
      burnDuration: 2.5,
      abilityText: "Longer statuses, burn",
      cardText: "Status burn",
      description: "A fiery pile of Korean chili flakes that extends inflicted statuses and makes attacks apply a short burn.",
    },
    {
      id: "dill_sprig",
      kind: "item",
      type: "topping",
      name: "Dill Sprig",
      short: "Dill",
      rarity: "uncommon",
      color: "#69aa3d",
      accent: "#2f6f28",
      price: ECONOMY.itemCost + 5,
      shopWeight: 8,
      cooldownDelay: 0.16,
      abilityText: "Attacks slow target",
      cardText: "Slow",
      description: "A feathery dill sprig that cools the target's next attack after each hit.",
    },
    {
      id: "sesame_seeds",
      kind: "item",
      type: "topping",
      name: "Sesame Seeds",
      short: "Sesame",
      rarity: "uncommon",
      color: "#e8c279",
      accent: "#9f6a2d",
      price: ECONOMY.itemCost + 5,
      shopWeight: 8,
      onAttackShieldPct: 0.05,
      abilityText: "Shield after attacks",
      cardText: "Atk shield",
      description: "A crunchy sesame seed pile that gives the holder a small shield after each attack.",
    },
    {
      id: "cinnamon_sugar",
      kind: "item",
      type: "topping",
      name: "Cinnamon Sugar",
      short: "Cinnamon",
      rarity: "rare",
      color: "#c7772e",
      accent: "#f3d58b",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      firstAttacksBonusPct: 0.36,
      firstAttacksCount: 3,
      exhaustedSpeedPenaltyPct: 0.12,
      burnDamagePct: 0.08,
      burnDuration: 2.2,
      abilityText: "Burst attacks burn",
      cardText: "Burst burn",
      description: "A sparkling cinnamon-sugar mound that makes the first few attacks hit hard and burn, then leaves the holder a little slower.",
    },
    {
      id: "milk_tea_foam",
      kind: "item",
      type: "topping",
      name: "Milk Tea Foam",
      short: "Foam",
      rarity: "rare",
      color: "#f1d4a8",
      accent: "#6b4528",
      price: ECONOMY.itemCost + 10,
      shopWeight: 6,
      timedHasteAt: 10,
      timedHastePct: 0.32,
      timedHasteDuration: 4,
      abilityText: "10s burst of haste",
      cardText: "10s haste",
      description: "A creamy milk-tea foam topping that bubbles up after long fights and gives the holder haste.",
    },
    {
      id: "royal_icing_crest",
      kind: "item",
      type: "topping",
      name: "Royal Icing Crest",
      short: "Icing",
      rarity: "epic",
      color: "#f2f0e6",
      accent: "#9a5bbf",
      price: ECONOMY.itemCost + 20,
      shopWeight: 3,
      adjacentStartShieldPct: 0.1,
      adjacentStartAttackBuffPct: 0.16,
      adjacentStartBuffDuration: 4,
      abilityText: "Starts adjacent allies strong",
      cardText: "Adj buff",
      description: "A royal icing crest that gives adjacent allies shields and a short attack boost at battle start.",
    },
  ];
  const TOPPING_SHOP_CHANCES = [0, 0.18, 0.2, 0.22, 0.24];
  const DRINK_SHOP_CHANCES = [0, 0.15, 0.15, 0.15, 0.15];
  const SHOP_SALE_CHANCES = [0, 0.08, 0.12, 0.16, 0.22];
  const ITEM_SPRITES = {
    sunny_side_egg: "assets/items/runtime/sunny_side_egg-evolved-v1.png?v=3",
    bean_brew: "assets/items/runtime/bean_brew-grand-v2-lv1.webp?v=1",
    berry_fizz: "assets/items/runtime/berry_fizz-grand-v2-lv1.webp?v=1",
    garden_spritz: "assets/items/runtime/garden_spritz-grand-v2-lv1.png?v=1",
    citrus_tea: "assets/items/runtime/citrus_tea-grand-v2-lv1.webp?v=1",
    chili_crunch_cola: "assets/items/runtime/chili_crunch_cola-grand-v2-lv1.webp?v=1",
    pepper_broth: "assets/items/runtime/pepper_broth-grand-v2-lv1.png?v=1",
    abyssal_shake: "assets/items/runtime/abyssal_shake-grand-v2-lv1.webp?v=1",
    cream_soda_float: "assets/items/runtime/cream_soda_float-grand-v1-lv1.png?v=1",
    tidepool_espresso: "assets/items/runtime/tidepool_espresso-grand-v1-lv1.png?v=1",
    avocado_lassi: "assets/items/runtime/avocado_lassi-grand-v1-lv1.webp?v=1",
    chili_brine_tonic: "assets/items/runtime/chili_brine_tonic-grand-v1-lv1.webp?v=1",
    market_malt: "assets/items/runtime/market_malt-grand-v1-lv1.png?v=1",
    maple_cloud_cocoa: "assets/items/runtime/maple_cloud_cocoa-grand-v1-lv1.png?v=1",
    pearl_biscuit_latte: "assets/items/runtime/pearl_biscuit_latte-grand-v1-lv1.png?v=1",
    kelp_cucumber_cooler: "assets/items/runtime/kelp_cucumber_cooler-grand-v1-lv1.png?v=1",
    nori_pop_slush: "assets/items/runtime/nori_pop_slush-grand-v1-lv1.png?v=1",
    harissa_morning_shot: "assets/items/runtime/harissa_morning_shot-grand-v1-lv1.png?v=1",
    pretzel_cream_soda: "assets/items/runtime/pretzel_cream_soda-grand-v1-lv1.png?v=1",
    boba_night_tea: "assets/items/runtime/boba_night_tea-grand-v1-lv1.webp?v=1",
    pico_lime_agua: "assets/items/runtime/pico_lime_agua-grand-v1-lv1.png?v=1",
    butter_pat: "assets/items/runtime/butter_pat-evolved-v1.webp?v=3",
    cheese_star: "assets/items/runtime/cheese_star-evolution-v2-lv1.webp?v=1",
    bacon_strips: "assets/items/runtime/bacon_strips-sticker-v1-lv1.webp?v=2",
    cherry_tomato: "assets/items/runtime/cherry_tomato-white-sticker-thin-v1-lv1.webp?v=1",
    pickle_chip: "assets/items/runtime/pickle_chip-white-sticker-thin-v1-lv1.png?v=1",
    mushroom_cap: "assets/items/runtime/mushroom_cap-sticker-v1-lv1.png?v=1",
    pepperoni_slice: "assets/items/runtime/pepperoni_slice-white-sticker-thin-v1-lv1.png?v=1",
    lemon_wedge: "assets/items/runtime/lemon_wedge-white-sticker-thin-v1-lv1.png?v=1",
    olive_ring: "assets/items/runtime/olive_ring-white-sticker-thin-v1-lv1.png?v=1",
    chili_pepper: "assets/items/runtime/chili_pepper-white-sticker-hairline-v1-lv1.webp?v=1",
    avocado_fan: "assets/items/runtime/avocado_fan-sticker-v1-lv1.webp?v=1",
    jam_dollop: "assets/items/runtime/jam_dollop-sticker-v1-lv1.png?v=1",
    caramel_crown: "assets/items/runtime/caramel_crown-sticker-v1-lv1.webp?v=1",
    whipped_cream_puff: "assets/items/runtime/whipped_cream_puff-sticker-v1-lv1.png?v=1",
    basil_leaf: "assets/items/runtime/basil_leaf-sticker-v1-lv1.webp?v=1",
    honey_drizzle: "assets/items/runtime/honey_drizzle-sticker-v1-lv1.png?v=1",
    garlic_clove: "assets/items/runtime/garlic_clove-sticker-v1-lv1.png?v=1",
    rice_ball: "assets/items/runtime/rice_ball-sticker-v1-lv1.png?v=1",
    onion_ring: "assets/items/runtime/onion_ring-sticker-v1-lv1.png?v=1",
    maple_leaf: "assets/items/runtime/maple_leaf-maple-syrup-sticker-v1-lv1.png?v=1",
    marshmallow_cube: "assets/items/runtime/marshmallow_cube-sticker-v1-lv1.png?v=1",
    cookie_crumb: "assets/items/runtime/cookie_crumb-sticker-v1-lv1.webp?v=1",
    seaweed_wrap: "assets/items/runtime/seaweed_wrap-sticker-v1-lv1.png?v=1",
    pretzel_stick: "assets/items/runtime/pretzel_stick-sticker-v1-lv1.png?v=1",
    waffle_cone: "assets/items/runtime/waffle_cone-sticker-v1-lv1.png?v=1",
    skewer: "assets/items/runtime/skewer-sticker-v1-lv1.png?v=1",
    hot_sauce_bottle: "assets/items/runtime/hot_sauce_bottle-sticker-v1-lv1.png?v=1",
    sugar_cube: "assets/items/runtime/sugar_cube-sticker-v1-lv1.png?v=1",
    mint_leaf: "assets/items/runtime/mint_leaf-sticker-v1-lv1.png?v=1",
    soda_pop: "assets/items/runtime/soda_pop-sticker-v2-lv1.png?v=1",
    salt_shaker: "assets/items/runtime/salt_shaker-sticker-v2-lv1.png?v=1",
    vinegar_splash: "assets/items/runtime/vinegar_splash-sticker-v1-lv1.png?v=1",
    cucumber_slice: "assets/items/runtime/cucumber_slice-sticker-v1-lv1.png?v=1",
    cracker_plate: "assets/items/runtime/cracker_plate-sticker-v2-lv1.png?v=1",
    cherry_pit: "assets/items/runtime/cherry_pit-sticker-v1-lv1.webp?v=1",
    breadstick_dummy: "assets/items/runtime/breadstick_dummy-sticker-v1-lv1.webp?v=1",
    popcorn_kernel: "assets/items/runtime/popcorn_kernel-sticker-v1-lv1.png?v=1",
    coupon_clip: "assets/items/runtime/coupon_clip-sticker-v1-lv1.webp?v=1",
    lucky_grape: "assets/items/runtime/lucky_grape-green-key-sticker-v1-lv1.png?v=1",
    shopping_bag: "assets/items/runtime/shopping_bag-sticker-v1-lv1.png?v=1",
    recipe_card: "assets/items/runtime/recipe_card-sticker-v1-lv1.png?v=1",
    soup_ladle: "assets/items/runtime/soup_ladle-sticker-v1-lv1.png?v=1",
    gravy_boat: "assets/items/runtime/gravy_boat-sticker-v1-lv1.png?v=1",
    spice_jar: "assets/items/runtime/spice_jar-sticker-v1-lv1.png?v=1",
    serving_tray: "assets/items/runtime/serving_tray-sticker-v1-lv1.png?v=1",
    glass_candy: "assets/items/runtime/glass_candy-sticker-v1-lv1.png?v=1",
    wasabi_pea: "assets/items/runtime/wasabi_pea-sticker-v1-lv1.png?v=1",
    molten_cheese: "assets/items/runtime/molten_cheese-sticker-v1-lv1.png?v=1",
    brittle_cracker: "assets/items/runtime/brittle_cracker-sticker-v1-lv1.webp?v=1",
    golden_truffle_crown: "assets/items/runtime/golden_truffle_crown-sticker-v1-lv1.png?v=1",
    dragonfruit_star: "assets/items/runtime/dragonfruit_star-sticker-v1-lv1.png?v=1",
    rainbow_mochi: "assets/items/runtime/rainbow_mochi-sticker-v1-lv1.png?v=1",
    caviar_pearls: "assets/items/runtime/caviar_pearls-sticker-v2-lv1.webp?v=1",
    saffron_threads: "assets/items/runtime/saffron_threads-sticker-v1-lv1.png?v=1",
    scallion_oil: "assets/items/runtime/scallion_oil-sticker-v1-lv1.png?v=1",
    gochugaru_flakes: "assets/items/runtime/gochugaru_flakes-sticker-v1-lv1.png?v=1",
    dill_sprig: "assets/items/runtime/dill_sprig-sticker-v1-lv1.png?v=1",
    sesame_seeds: "assets/items/runtime/sesame_seeds-sticker-v1-lv1.png?v=1",
    cinnamon_sugar: "assets/items/runtime/cinnamon_sugar-sticker-v1-lv1.webp?v=1",
    milk_tea_foam: "assets/items/runtime/milk_tea_foam-sticker-v1-lv1.png?v=1",
    royal_icing_crest: "assets/items/runtime/royal_icing_crest-sticker-v1-lv1.png?v=1",
  };
  const ITEM_TIER_SPRITES = {
    sunny_side_egg: {
      2: "assets/items/runtime/sunny_side_egg-v2.png?v=3",
      3: "assets/items/runtime/sunny_side_egg-v3.png?v=3",
    },
    butter_pat: {
      2: "assets/items/runtime/butter_pat-v2.webp?v=3",
      3: "assets/items/runtime/butter_pat-v3.webp?v=3",
    },
    cheese_star: {
      2: "assets/items/runtime/cheese_star-evolution-v2-lv2.webp?v=1",
      3: "assets/items/runtime/cheese_star-evolution-v2-lv3.webp?v=1",
    },
    bacon_strips: {
      2: "assets/items/runtime/bacon_strips-sticker-v1-lv2.webp?v=2",
      3: "assets/items/runtime/bacon_strips-sticker-v1-lv3.webp?v=2",
    },
    bean_brew: {
      2: "assets/items/runtime/bean_brew-grand-v2-lv2.webp?v=1",
      3: "assets/items/runtime/bean_brew-grand-v2-lv3.webp?v=1",
    },
    berry_fizz: {
      2: "assets/items/runtime/berry_fizz-grand-v2-lv2.webp?v=1",
      3: "assets/items/runtime/berry_fizz-grand-v2-lv3.webp?v=1",
    },
    garden_spritz: {
      2: "assets/items/runtime/garden_spritz-grand-v2-lv2.png?v=1",
      3: "assets/items/runtime/garden_spritz-grand-v2-lv3.png?v=1",
    },
    citrus_tea: {
      2: "assets/items/runtime/citrus_tea-grand-v2-lv2.webp?v=1",
      3: "assets/items/runtime/citrus_tea-grand-v2-lv3.webp?v=1",
    },
    chili_crunch_cola: {
      2: "assets/items/runtime/chili_crunch_cola-grand-v2-lv2.webp?v=1",
      3: "assets/items/runtime/chili_crunch_cola-grand-v2-lv3.webp?v=1",
    },
    pepper_broth: {
      2: "assets/items/runtime/pepper_broth-grand-v2-lv2.png?v=1",
      3: "assets/items/runtime/pepper_broth-grand-v2-lv3.png?v=1",
    },
    abyssal_shake: {
      2: "assets/items/runtime/abyssal_shake-grand-v2-lv2.webp?v=1",
      3: "assets/items/runtime/abyssal_shake-grand-v2-lv3.webp?v=1",
    },
    cream_soda_float: {
      2: "assets/items/runtime/cream_soda_float-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/cream_soda_float-grand-v1-lv3.png?v=1",
    },
    tidepool_espresso: {
      2: "assets/items/runtime/tidepool_espresso-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/tidepool_espresso-grand-v1-lv3.png?v=1",
    },
    avocado_lassi: {
      2: "assets/items/runtime/avocado_lassi-grand-v1-lv2.webp?v=1",
      3: "assets/items/runtime/avocado_lassi-grand-v1-lv3.webp?v=1",
    },
    chili_brine_tonic: {
      2: "assets/items/runtime/chili_brine_tonic-grand-v1-lv2.webp?v=1",
      3: "assets/items/runtime/chili_brine_tonic-grand-v1-lv3.webp?v=1",
    },
    market_malt: {
      2: "assets/items/runtime/market_malt-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/market_malt-grand-v1-lv3.png?v=1",
    },
    maple_cloud_cocoa: {
      2: "assets/items/runtime/maple_cloud_cocoa-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/maple_cloud_cocoa-grand-v1-lv3.png?v=1",
    },
    pearl_biscuit_latte: {
      2: "assets/items/runtime/pearl_biscuit_latte-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/pearl_biscuit_latte-grand-v1-lv3.png?v=1",
    },
    kelp_cucumber_cooler: {
      2: "assets/items/runtime/kelp_cucumber_cooler-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/kelp_cucumber_cooler-grand-v1-lv3.png?v=1",
    },
    nori_pop_slush: {
      2: "assets/items/runtime/nori_pop_slush-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/nori_pop_slush-grand-v1-lv3.png?v=1",
    },
    harissa_morning_shot: {
      2: "assets/items/runtime/harissa_morning_shot-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/harissa_morning_shot-grand-v1-lv3.png?v=1",
    },
    pretzel_cream_soda: {
      2: "assets/items/runtime/pretzel_cream_soda-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/pretzel_cream_soda-grand-v1-lv3.png?v=1",
    },
    boba_night_tea: {
      2: "assets/items/runtime/boba_night_tea-grand-v1-lv2.webp?v=1",
      3: "assets/items/runtime/boba_night_tea-grand-v1-lv3.webp?v=1",
    },
    pico_lime_agua: {
      2: "assets/items/runtime/pico_lime_agua-grand-v1-lv2.png?v=1",
      3: "assets/items/runtime/pico_lime_agua-grand-v1-lv3.png?v=1",
    },
    cherry_tomato: {
      2: "assets/items/runtime/cherry_tomato-white-sticker-thin-v1-lv2.webp?v=1",
      3: "assets/items/runtime/cherry_tomato-white-sticker-thin-v1-lv3.webp?v=1",
    },
    pickle_chip: {
      2: "assets/items/runtime/pickle_chip-white-sticker-thin-v1-lv2.png?v=1",
      3: "assets/items/runtime/pickle_chip-white-sticker-thin-v1-lv3.png?v=1",
    },
    mushroom_cap: {
      2: "assets/items/runtime/mushroom_cap-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/mushroom_cap-sticker-v1-lv3.png?v=1",
    },
    pepperoni_slice: {
      2: "assets/items/runtime/pepperoni_slice-white-sticker-thin-v1-lv2.png?v=1",
      3: "assets/items/runtime/pepperoni_slice-white-sticker-thin-v1-lv3.png?v=1",
    },
    lemon_wedge: {
      2: "assets/items/runtime/lemon_wedge-white-sticker-thin-v1-lv2.png?v=1",
      3: "assets/items/runtime/lemon_wedge-white-sticker-thin-v1-lv3.png?v=1",
    },
    olive_ring: {
      2: "assets/items/runtime/olive_ring-white-sticker-thin-v1-lv2.png?v=1",
      3: "assets/items/runtime/olive_ring-white-sticker-thin-v1-lv3.png?v=1",
    },
    chili_pepper: {
      2: "assets/items/runtime/chili_pepper-white-sticker-hairline-v1-lv2.webp?v=1",
      3: "assets/items/runtime/chili_pepper-white-sticker-hairline-v1-lv3.webp?v=1",
    },
    avocado_fan: {
      2: "assets/items/runtime/avocado_fan-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/avocado_fan-sticker-v1-lv3.webp?v=1",
    },
    jam_dollop: {
      2: "assets/items/runtime/jam_dollop-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/jam_dollop-sticker-v1-lv3.png?v=1",
    },
    caramel_crown: {
      2: "assets/items/runtime/caramel_crown-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/caramel_crown-sticker-v1-lv3.webp?v=1",
    },
    whipped_cream_puff: {
      2: "assets/items/runtime/whipped_cream_puff-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/whipped_cream_puff-sticker-v1-lv3.png?v=1",
    },
    basil_leaf: {
      2: "assets/items/runtime/basil_leaf-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/basil_leaf-sticker-v1-lv3.webp?v=1",
    },
    honey_drizzle: {
      2: "assets/items/runtime/honey_drizzle-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/honey_drizzle-sticker-v1-lv3.png?v=1",
    },
    garlic_clove: {
      2: "assets/items/runtime/garlic_clove-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/garlic_clove-sticker-v1-lv3.png?v=1",
    },
    rice_ball: {
      2: "assets/items/runtime/rice_ball-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/rice_ball-sticker-v1-lv3.png?v=1",
    },
    onion_ring: {
      2: "assets/items/runtime/onion_ring-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/onion_ring-sticker-v1-lv3.png?v=1",
    },
    maple_leaf: {
      2: "assets/items/runtime/maple_leaf-maple-syrup-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/maple_leaf-maple-syrup-sticker-v1-lv3.png?v=1",
    },
    marshmallow_cube: {
      2: "assets/items/runtime/marshmallow_cube-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/marshmallow_cube-sticker-v1-lv3.png?v=1",
    },
    cookie_crumb: {
      2: "assets/items/runtime/cookie_crumb-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/cookie_crumb-sticker-v1-lv3.webp?v=1",
    },
    seaweed_wrap: {
      2: "assets/items/runtime/seaweed_wrap-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/seaweed_wrap-sticker-v1-lv3.png?v=1",
    },
    pretzel_stick: {
      2: "assets/items/runtime/pretzel_stick-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/pretzel_stick-sticker-v1-lv3.png?v=1",
    },
    waffle_cone: {
      2: "assets/items/runtime/waffle_cone-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/waffle_cone-sticker-v1-lv3.png?v=1",
    },
    skewer: {
      2: "assets/items/runtime/skewer-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/skewer-sticker-v1-lv3.png?v=1",
    },
    hot_sauce_bottle: {
      2: "assets/items/runtime/hot_sauce_bottle-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/hot_sauce_bottle-sticker-v1-lv3.png?v=1",
    },
    sugar_cube: {
      2: "assets/items/runtime/sugar_cube-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/sugar_cube-sticker-v1-lv3.png?v=1",
    },
    mint_leaf: {
      2: "assets/items/runtime/mint_leaf-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/mint_leaf-sticker-v1-lv3.png?v=1",
    },
    soda_pop: {
      2: "assets/items/runtime/soda_pop-sticker-v2-lv2.png?v=1",
      3: "assets/items/runtime/soda_pop-sticker-v2-lv3.png?v=1",
    },
    salt_shaker: {
      2: "assets/items/runtime/salt_shaker-sticker-v2-lv2.png?v=1",
      3: "assets/items/runtime/salt_shaker-sticker-v2-lv3.png?v=1",
    },
    vinegar_splash: {
      2: "assets/items/runtime/vinegar_splash-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/vinegar_splash-sticker-v1-lv3.png?v=1",
    },
    cucumber_slice: {
      2: "assets/items/runtime/cucumber_slice-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/cucumber_slice-sticker-v1-lv3.png?v=1",
    },
    cracker_plate: {
      2: "assets/items/runtime/cracker_plate-sticker-v2-lv2.png?v=1",
      3: "assets/items/runtime/cracker_plate-sticker-v2-lv3.png?v=1",
    },
    cherry_pit: {
      2: "assets/items/runtime/cherry_pit-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/cherry_pit-sticker-v1-lv3.webp?v=1",
    },
    breadstick_dummy: {
      2: "assets/items/runtime/breadstick_dummy-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/breadstick_dummy-sticker-v1-lv3.webp?v=1",
    },
    popcorn_kernel: {
      2: "assets/items/runtime/popcorn_kernel-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/popcorn_kernel-sticker-v1-lv3.png?v=1",
    },
    coupon_clip: {
      2: "assets/items/runtime/coupon_clip-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/coupon_clip-sticker-v1-lv3.webp?v=1",
    },
    lucky_grape: {
      2: "assets/items/runtime/lucky_grape-green-key-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/lucky_grape-green-key-sticker-v1-lv3.png?v=1",
    },
    shopping_bag: {
      2: "assets/items/runtime/shopping_bag-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/shopping_bag-sticker-v1-lv3.png?v=1",
    },
    recipe_card: {
      2: "assets/items/runtime/recipe_card-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/recipe_card-sticker-v1-lv3.png?v=1",
    },
    soup_ladle: {
      2: "assets/items/runtime/soup_ladle-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/soup_ladle-sticker-v1-lv3.png?v=1",
    },
    gravy_boat: {
      2: "assets/items/runtime/gravy_boat-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/gravy_boat-sticker-v1-lv3.png?v=1",
    },
    spice_jar: {
      2: "assets/items/runtime/spice_jar-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/spice_jar-sticker-v1-lv3.png?v=1",
    },
    serving_tray: {
      2: "assets/items/runtime/serving_tray-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/serving_tray-sticker-v1-lv3.png?v=1",
    },
    glass_candy: {
      2: "assets/items/runtime/glass_candy-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/glass_candy-sticker-v1-lv3.png?v=1",
    },
    wasabi_pea: {
      2: "assets/items/runtime/wasabi_pea-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/wasabi_pea-sticker-v1-lv3.png?v=1",
    },
    molten_cheese: {
      2: "assets/items/runtime/molten_cheese-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/molten_cheese-sticker-v1-lv3.png?v=1",
    },
    brittle_cracker: {
      2: "assets/items/runtime/brittle_cracker-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/brittle_cracker-sticker-v1-lv3.webp?v=1",
    },
    golden_truffle_crown: {
      2: "assets/items/runtime/golden_truffle_crown-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/golden_truffle_crown-sticker-v1-lv3.png?v=1",
    },
    dragonfruit_star: {
      2: "assets/items/runtime/dragonfruit_star-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/dragonfruit_star-sticker-v1-lv3.png?v=1",
    },
    rainbow_mochi: {
      2: "assets/items/runtime/rainbow_mochi-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/rainbow_mochi-sticker-v1-lv3.png?v=1",
    },
    caviar_pearls: {
      2: "assets/items/runtime/caviar_pearls-sticker-v2-lv2.webp?v=1",
      3: "assets/items/runtime/caviar_pearls-sticker-v2-lv3.webp?v=1",
    },
    saffron_threads: {
      2: "assets/items/runtime/saffron_threads-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/saffron_threads-sticker-v1-lv3.png?v=1",
    },
    scallion_oil: {
      2: "assets/items/runtime/scallion_oil-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/scallion_oil-sticker-v1-lv3.png?v=1",
    },
    gochugaru_flakes: {
      2: "assets/items/runtime/gochugaru_flakes-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/gochugaru_flakes-sticker-v1-lv3.png?v=1",
    },
    dill_sprig: {
      2: "assets/items/runtime/dill_sprig-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/dill_sprig-sticker-v1-lv3.png?v=1",
    },
    sesame_seeds: {
      2: "assets/items/runtime/sesame_seeds-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/sesame_seeds-sticker-v1-lv3.png?v=1",
    },
    cinnamon_sugar: {
      2: "assets/items/runtime/cinnamon_sugar-sticker-v1-lv2.webp?v=1",
      3: "assets/items/runtime/cinnamon_sugar-sticker-v1-lv3.webp?v=1",
    },
    milk_tea_foam: {
      2: "assets/items/runtime/milk_tea_foam-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/milk_tea_foam-sticker-v1-lv3.png?v=1",
    },
    royal_icing_crest: {
      2: "assets/items/runtime/royal_icing_crest-sticker-v1-lv2.png?v=1",
      3: "assets/items/runtime/royal_icing_crest-sticker-v1-lv3.png?v=1",
    },
  };
  const ATTACK_PARTICLE_SPRITES = {
    toast_tortoise: "assets/particles/runtime/food-attack-particle_toast_shard_idle_SW_00.png",
    sushi_seal: "assets/particles/runtime/food-attack-particle_sushi_bite_idle_SW_00.png",
    taco_tiger: "assets/particles/runtime/food-attack-particle_taco_chip_idle_SW_00.png",
    berry_bat: "assets/particles/runtime/food-attack-particle_grape_cluster_idle_SW_00.png",
    noodle_newt: "assets/particles/runtime/food-attack-particle_noodle_toss_idle_SW_00.png",
    pepper_prawn: "assets/particles/runtime/food-attack-particle-expanded_pepper_prawn_static_idle_SW_00.png",
    hot_chip_hamster: "assets/particles/runtime/food-attack-particle-dedicated_hot_chip_hamster_static_idle_SW_00.png",
    pancake_penguin: "assets/particles/runtime/food-attack-particle-uncommon_pancake_syrup_bite_idle_SW_00.png",
    benedict_lobster: "assets/particles/runtime/food-attack-particle-dedicated_benedict_lobster_static_idle_SW_00.png",
    pretzel_python: "assets/particles/runtime/food-attack-particle-uncommon_pretzel_twist_idle_SW_00.png",
    curry_crab: "assets/particles/runtime/food-attack-particle-uncommon_curry_claw_splash_idle_SW_00.png",
    popcorn_porcupine: "assets/particles/runtime/food-attack-particle-missing_popcorn_kernel_burst_idle_SW_00.png",
    yogurt_yeti: "assets/particles/runtime/food-attack-particle-missing_yogurt_frost_splash_idle_SW_00.png",
    bagel_beaver: "assets/particles/runtime/food-attack-particle-expanded_bagel_beaver_static_idle_SW_00.png",
    bao_bun_badger: "assets/particles/runtime/food-attack-particle-dedicated_bao_bun_badger_static_idle_SW_00.png",
    donut_dodo: "assets/particles/runtime/food-attack-particle-missing_donut_glaze_spin_idle_SW_00.png",
    kimchi_chameleon: "assets/particles/runtime/food-attack-particle-missing_kimchi_chili_splash_idle_SW_00.png",
    waffle_walrus: "assets/particles/runtime/food-attack-particle-missing_waffle_syrup_shard_idle_SW_00.png",
    dumpling_armadillo: "assets/particles/runtime/food-attack-particle-missing_dumpling_steam_puff_idle_SW_00.png",
    lemon_meringue_lynx: "assets/particles/runtime/food-attack-particle-missing_lemon_meringue_spark_idle_SW_00.png",
    shakshuka_shark: "assets/particles/runtime/food-attack-particle-expanded_shakshuka_shark_static_idle_SW_00.png",
    saltwater_taffy_otter: "assets/particles/runtime/food-attack-particle-dedicated_saltwater_taffy_otter_static_idle_SW_00.png",
    croissant_kraken: "assets/particles/runtime/food-attack-particle-missing_croissant_tentacle_crescent_idle_SW_00.png",
    fortune_cookie_fox: "assets/particles/runtime/food-attack-particle-missing_fortune_cookie_shard_idle_SW_00.png",
    mochi_mammoth: "assets/particles/runtime/food-attack-particle-missing_mochi_puff_idle_SW_00.png",
    gingerbread_golem: "assets/particles/runtime/food-attack-particle-missing_gingerbread_crumble_idle_SW_00.png",
    boba_basilisk: "assets/particles/runtime/food-attack-particle-missing_boba_pearl_burst_idle_SW_00.png",
    iceberg_oyster: "assets/particles/runtime/food-attack-particle-expanded_iceberg_oyster_static_idle_SW_00.png",
    churro_cheetah: "assets/particles/runtime/food-attack-particle-dedicated_churro_cheetah_static_idle_SW_00.png",
    granola_goat: "assets/particles/runtime/food-attack-particle-dedicated_granola_goat_static_idle_SW_00.png",
    breakfast_burrito_boar: "assets/particles/runtime/food-attack-particle-dedicated_breakfast_burrito_boar_static_idle_SW_00.png",
    caesar_salamander: "assets/particles/runtime/food-attack-particle-fresh-garden_caesar_salamander_static_idle_SW_00.png",
    cucumber_cobra: "assets/particles/runtime/food-attack-particle-fresh-garden_cucumber_cobra_static_idle_SW_00.png",
    avocado_axolotl: "assets/particles/runtime/food-attack-particle-fresh-garden_avocado_axolotl_static_idle_SW_00.png",
    herb_hare: "assets/particles/runtime/food-attack-particle-fresh-garden_herb_hare_static_idle_SW_00.png",
    caprese_capybara: "assets/particles/runtime/food-attack-particle-fresh-garden_caprese_capybara_static_idle_SW_00.png",
    vinaigrette_viper: "assets/particles/runtime/food-attack-particle-fresh-garden_vinaigrette_viper_static_idle_SW_00.png",
    kelp_koala: "assets/particles/runtime/food-attack-particle-gap-fillers_kelp_koala_static_idle_SW_00.png",
    melon_mint_mantis: "assets/particles/runtime/food-attack-particle-gap-fillers_melon_mint_mantis_static_idle_SW_00.png",
    coconut_shrimp_sheep: "assets/particles/runtime/food-attack-particle-gap-fillers_coconut_shrimp_sheep_static_idle_SW_00.png",
    crab_cake_caterpillar: "assets/particles/runtime/food-attack-particle-gap-fillers_crab_cake_caterpillar_static_idle_SW_00.png",
    pico_de_gallo_gecko: "assets/particles/runtime/food-attack-particle-gap-fillers_pico_de_gallo_gecko_static_idle_SW_00.png",
  };
  const ATTACK_PARTICLE_TYPES = Object.keys(ATTACK_PARTICLE_SPRITES);
  const DRINK_THROWABLE_SPRITES = {
    bean_brew: "assets/particles/runtime/drink-buff-throwable_bean_brew_idle_SW_00.png?v=1",
    berry_fizz: "assets/particles/runtime/drink-buff-throwable_berry_fizz_idle_SW_00.png?v=1",
    garden_spritz: "assets/particles/runtime/drink-buff-throwable_garden_spritz_idle_SW_00.png?v=1",
    citrus_tea: "assets/particles/runtime/drink-buff-throwable_citrus_tea_idle_SW_00.png?v=1",
    chili_crunch_cola: "assets/particles/runtime/drink-buff-throwable_chili_crunch_cola_idle_SW_00.png?v=1",
    pepper_broth: "assets/particles/runtime/drink-buff-throwable_pepper_broth_idle_SW_00.png?v=1",
    abyssal_shake: "assets/particles/runtime/drink-buff-throwable_abyssal_shake_idle_SW_00.png?v=1",
    cream_soda_float: "assets/particles/runtime/drink-buff-throwable_cream_soda_float_idle_SW_00.png?v=1",
    tidepool_espresso: "assets/particles/runtime/drink-buff-throwable_tidepool_espresso_idle_SW_00.png?v=1",
    avocado_lassi: "assets/particles/runtime/drink-buff-throwable_avocado_lassi_idle_SW_00.png?v=1",
    chili_brine_tonic: "assets/particles/runtime/drink-buff-throwable_chili_brine_tonic_idle_SW_00.png?v=1",
    market_malt: "assets/particles/runtime/drink-buff-throwable_market_malt_idle_SW_00.png?v=1",
    maple_cloud_cocoa: "assets/particles/runtime/drink-buff-throwable_maple_cloud_cocoa_idle_SW_00.png?v=1",
    pearl_biscuit_latte: "assets/particles/runtime/drink-buff-throwable_pearl_biscuit_latte_idle_SW_00.png?v=1",
    kelp_cucumber_cooler: "assets/particles/runtime/drink-buff-throwable_kelp_cucumber_cooler_idle_SW_00.png?v=1",
    nori_pop_slush: "assets/particles/runtime/drink-buff-throwable_nori_pop_slush_idle_SW_00.png?v=1",
    harissa_morning_shot: "assets/particles/runtime/drink-buff-throwable_harissa_morning_shot_idle_SW_00.png?v=1",
    pretzel_cream_soda: "assets/particles/runtime/drink-buff-throwable_pretzel_cream_soda_idle_SW_00.png?v=1",
    boba_night_tea: "assets/particles/runtime/drink-buff-throwable_boba_night_tea_idle_SW_00.png?v=1",
    pico_lime_agua: "assets/particles/runtime/drink-buff-throwable_pico_lime_agua_idle_SW_00.png?v=1",
  };
  const DRINK_THROWABLE_TYPES = Object.keys(DRINK_THROWABLE_SPRITES);

  const state = {
    phase: "prep",
    round: 1,
    gold: ECONOMY.startingGold,
    hearts: 10,
    shopLevel: 1,
    message: "Prep",
    shop: [],
    shopFrozen: Array(shopSlots.length).fill(false),
    shopSales: Array(shopSlots.length).fill(false),
    shopUnlocked: initialShopUnlocked(),
    bench: Array(8).fill(null),
    itemBench: Array(itemBenchSlots.length).fill(null),
    board: Array(boardSlots.length).fill(null),
    drinks: Array(drinkSlots.length).fill(null),
    selected: null,
    codexOpen: false,
    codexTab: "food",
    codexSelectedId: CATALOG[0]?.id || null,
    codexSelectedFormTier: 1,
    codexSelectedItemTier: 1,
    codexSelectedToppingId: null,
    codexSelectedDrinkId: null,
    codexFilters: JSON.parse(JSON.stringify(CODEX_DEFAULT_FILTERS)),
    hover: null,
    pointer: null,
    tooltipTargets: [],
    drag: null,
    battle: null,
    postCombatBattle: null,
    arenaId: randomArenaId(),
    keepArenaNextRound: false,
    arenaScout: null,
    arenaPrepBuff: null,
    enemyPreview: null,
    rewardChoices: [],
    lastCombatLedger: null,
    freeRolls: 0,
    rollsThisRound: 0,
    nextShopUpgradeDiscountGold: 0,
    winStreak: 0,
    lossStreak: 0,
    lastIncome: null,
    itemDiscountUsed: false,
    battleSpeedIndex: 0,
    idleTime: 0,
    lastTime: 0,
    particles: [],
    log: [],
  };

  const pixelSpriteCache = new Map();
  const tintedSpriteCache = new Map();
  const runtimeSpriteCache = new Map();
  const runtimeSpriteMetricsCache = new Map();
  const itemSpriteMetricsCache = new Map();
  const itemSpriteCache = new Map();
  const attackParticleSpriteCache = new Map();
  const drinkThrowableSpriteCache = new Map();
  const statusEffectSpriteCache = new Map();
  const uiSpriteCache = new Map();
  const BACKGROUND_SRC = "assets/backgrounds/picnic-arena-background-v1-2048x1280.webp";
  const UPGRADE_STAR_SRC = "assets/ui/runtime/upgrade-star-v2.png";
  const SHOP_LOCKED_SRC = "assets/ui/runtime/shop-lock-locked-v1.png";
  const SHOP_UNLOCKED_SRC = "assets/ui/runtime/shop-lock-unlocked-v1.png";
  const STATUS_HEART_SRC = "assets/ui/runtime/status-heart-v1.png";
  const STATUS_COIN_SRC = "assets/ui/runtime/status-coin-v1.png";
  const BOARD_PLATE_SLOT_SRC = "assets/items/runtime/board_plate-minimal-v1.webp?v=1";
  const DRINK_COASTER_SLOT_SRC = "assets/items/runtime/drink_coaster-minimal-v1.png?v=1";
  const TOPPING_CUTTING_BOARD_SLOT_SRC = "assets/items/runtime/topping_cutting_board-stall-v2.png?v=1";
  const UI_ICON_ATLAS_SRC = "assets/ui/runtime/ui-icon-atlas-v1.png";
  const STATUS_CHALK_COURSE_SRC = "assets/ui/runtime/status-chalk-course-v1.webp";
  const STATUS_CHALK_COINS_SRC = "assets/ui/runtime/status-chalk-coins-v1.webp";
  const STATUS_CHALK_HEALTH_SRC = "assets/ui/runtime/status-chalk-health-v1.webp";
  const UI_ICON_ATLAS_CELL = 64;
  const UI_ICON_ATLAS = {
    trait_breakfast: [0, 0],
    trait_bakery: [1, 0],
    trait_ocean: [2, 0],
    trait_spicy: [3, 0],
    trait_sweet: [4, 0],
    trait_snack: [5, 0],
    trait_street_food: [6, 0],
    trait_frozen: [7, 0],
    trait_guardian: [2, 3],
    reward_gold: [0, 1],
    reward_freeRolls: [1, 1],
    reward_item: [2, 1],
    reward_copy: [3, 1],
    reward_arena: [4, 1],
    reward_favorite: [5, 1],
    reward_discount: [6, 1],
    reward_heart: [7, 1],
    action_upgrade: [0, 2],
    action_roll: [1, 2],
    action_battle: [2, 2],
    action_speed: [3, 2],
    action_sell: [4, 2],
    action_detach: [5, 2],
    action_lock: [6, 2],
    action_unlock: [7, 2],
    info_damage: [0, 3],
    info_heal: [1, 3],
    info_shield: [2, 3],
    info_ko: [3, 3],
    info_time: [4, 3],
    info_mold: [7, 3],
  };
  const backgroundImageCache = new Map();
  const RUNTIME_SPRITES = {
    toast_tortoise: {
      1: "assets/sprites/runtime/toast-tortoise-v3/toast-tortoise_toastlet_idle_SW_00.png",
      2: "assets/sprites/runtime/toast-tortoise-v3/toast-tortoise_butterback_idle_SW_00.png",
      3: "assets/sprites/runtime/toast-tortoise-v3/toast-tortoise_clubshell_idle_SW_00.png",
      4: "assets/sprites/runtime/toast-tortoise-v3/toast-tortoise_banquet-shell_idle_SW_00.png",
    },
    sushi_seal: {
      1: "assets/sprites/runtime/sushi-seal-v3/sushi-seal_maki-pup_idle_SW_00.png",
      2: "assets/sprites/runtime/sushi-seal-v3/sushi-seal_nigiri-seal_idle_SW_00.png",
      3: "assets/sprites/runtime/sushi-seal-v3/sushi-seal_dragon-roll_idle_SW_00.png",
      4: "assets/sprites/runtime/sushi-seal-v3/sushi-seal_omakase-seal_idle_SW_00.png",
    },
    taco_tiger: {
      1: "assets/sprites/runtime/taco-tiger-v3/taco-tiger_taco-cub_idle_SW_00.png",
      2: "assets/sprites/runtime/taco-tiger-v3/taco-tiger_loaded-tiger_idle_SW_00.png",
      3: "assets/sprites/runtime/taco-tiger-v3/taco-tiger_fiesta-fang_idle_SW_00.png",
      4: "assets/sprites/runtime/taco-tiger-v3/taco-tiger_carnival-tiger_idle_SW_00.png",
    },
    berry_bat: {
      1: "assets/sprites/runtime/berry-bat-v3/berry-bat_berry-bat_idle_SW_00.png",
      2: "assets/sprites/runtime/berry-bat-v3/berry-bat_bramble-bat_idle_SW_00.png",
      3: "assets/sprites/runtime/berry-bat-v3/berry-bat_elderberry-bat_idle_SW_00.png",
      4: "assets/sprites/runtime/berry-bat-v3/berry-bat_royal-berry-bat_idle_SW_00.png",
    },
    noodle_newt: {
      1: "assets/sprites/runtime/noodle-newt-v3/noodle-newt_noodle-newt_idle_SW_00.png",
      2: "assets/sprites/runtime/noodle-newt-v3/noodle-newt_ramen-newt_idle_SW_00.png",
      3: "assets/sprites/runtime/noodle-newt-v3/noodle-newt_hotpot-newt_idle_SW_00.png",
      4: "assets/sprites/runtime/noodle-newt-v3/noodle-newt_cauldron-newt-grand-v2_idle_SW_00.png",
    },
    pancake_penguin: {
      1: "assets/sprites/runtime/pancake-penguin-v1/pancake-penguin_pancake-chick_idle_SW_00.png",
      2: "assets/sprites/runtime/pancake-penguin-v1/pancake-penguin_syrup-penguin_idle_SW_00.png",
      3: "assets/sprites/runtime/pancake-penguin-v1/pancake-penguin_stack-king_idle_SW_00.png",
      4: "assets/sprites/runtime/pancake-penguin-v1/pancake-penguin_breakfast-emperor_idle_SW_00.png",
    },
    benedict_lobster: {
      1: "assets/sprites/runtime/benedict-lobster-v3/benedict-lobster_benny-lobster_idle_SW_00.png",
      2: "assets/sprites/runtime/benedict-lobster-v3/benedict-lobster_benedict-lobster_idle_SW_00.png",
      3: "assets/sprites/runtime/benedict-lobster-v3/benedict-lobster_hollandaise-lobster_idle_SW_00.png",
      4: "assets/sprites/runtime/benedict-lobster-v3/benedict-lobster_brunch-tide-lobster_idle_SW_00.png?v=2",
    },
    pretzel_python: {
      1: "assets/sprites/runtime/pretzel-python-v1/pretzel-python_pretzel-hatchling_idle_SW_00.png",
      2: "assets/sprites/runtime/pretzel-python-v1/pretzel-python_twist-python_idle_SW_00.png",
      3: "assets/sprites/runtime/pretzel-python-v1/pretzel-python_saltcoil_idle_SW_00.png",
      4: "assets/sprites/runtime/pretzel-python-v1/pretzel-python_knot-constrictor_idle_SW_00.png",
    },
    curry_crab: {
      1: "assets/sprites/runtime/curry-crab-v1/curry-crab_curry-crab_idle_SW_00.png",
      2: "assets/sprites/runtime/curry-crab-v1/curry-crab_masala-crab_idle_SW_00.png",
      3: "assets/sprites/runtime/curry-crab-v1/curry-crab_spiceclaw_idle_SW_00.png",
      4: "assets/sprites/runtime/curry-crab-v1/curry-crab_vindaloo-titan_idle_SW_00.png",
    },
    pepper_prawn: {
      1: "assets/sprites/runtime/pepper-prawn-v1/pepper-prawn_pepper-prawn_idle_SW_00.png",
      2: "assets/sprites/runtime/pepper-prawn-v1/pepper-prawn_seared-prawn_idle_SW_00.png",
      3: "assets/sprites/runtime/pepper-prawn-v1/pepper-prawn_chili-skewer-prawn_idle_SW_00.png",
      4: "assets/sprites/runtime/pepper-prawn-v1/pepper-prawn_tidefire-prawn_idle_SW_00.png",
    },
    hot_chip_hamster: {
      1: "assets/sprites/runtime/hot-chip-hamster-v2/hot-chip-hamster_hot-chip-pup_idle_SW_00.png",
      2: "assets/sprites/runtime/hot-chip-hamster-v2/hot-chip-hamster_hot-chip-hamster_idle_SW_00.png",
      3: "assets/sprites/runtime/hot-chip-hamster-v2/hot-chip-hamster_flamin-wheel-hamster_idle_SW_00.png",
      4: "assets/sprites/runtime/hot-chip-hamster-v2/hot-chip-hamster_kettlefire-hamster_idle_SW_00.png",
    },
    popcorn_porcupine: {
      1: "assets/sprites/runtime/popcorn-porcupine-v1/popcorn-porcupine_kernel-hoglet_idle_SW_00.png",
      2: "assets/sprites/runtime/popcorn-porcupine-v1/popcorn-porcupine_popcorn-porcupine_idle_SW_00.png",
      3: "assets/sprites/runtime/popcorn-porcupine-v1/popcorn-porcupine_kettle-quillbeast_idle_SW_00.png",
      4: "assets/sprites/runtime/popcorn-porcupine-v1/popcorn-porcupine_cinema-needleback_idle_SW_00.png",
    },
    yogurt_yeti: {
      1: "assets/sprites/runtime/yogurt-yeti-v1/yogurt-yeti_yogurt-cub_idle_SW_00.png",
      2: "assets/sprites/runtime/yogurt-yeti-v1/yogurt-yeti_parfait-yeti_idle_SW_00.png",
      3: "assets/sprites/runtime/yogurt-yeti-v1/yogurt-yeti_frozen-yeti_idle_SW_00.png",
      4: "assets/sprites/runtime/yogurt-yeti-v1/yogurt-yeti_glacier-parfait_idle_SW_00.png",
    },
    donut_dodo: {
      1: "assets/sprites/runtime/donut-dodo-v1/donut-dodo_donut-dodo_idle_SW_00.png",
      2: "assets/sprites/runtime/donut-dodo-v1/donut-dodo_glazed-dodo_idle_SW_00.png",
      3: "assets/sprites/runtime/donut-dodo-v1/donut-dodo_sprinkle-roc_idle_SW_00.png",
      4: "assets/sprites/runtime/donut-dodo-v1/donut-dodo_bakery-phoenix_idle_SW_00.png",
    },
    kimchi_chameleon: {
      1: "assets/sprites/runtime/kimchi-chameleon-v1/kimchi-chameleon_kimchi-chameleon_idle_SW_00.png",
      2: "assets/sprites/runtime/kimchi-chameleon-v1/kimchi-chameleon_ferment-gecko_idle_SW_00.png",
      3: "assets/sprites/runtime/kimchi-chameleon-v1/kimchi-chameleon_gochu-chameleon_idle_SW_00.png",
      4: "assets/sprites/runtime/kimchi-chameleon-v1/kimchi-chameleon_pickled-dragon_idle_SW_00.png",
    },
    waffle_walrus: {
      1: "assets/sprites/runtime/waffle-walrus-v1/waffle-walrus_waffle-pup_idle_SW_00.png",
      2: "assets/sprites/runtime/waffle-walrus-v1/waffle-walrus_waffle-walrus_idle_SW_00.png",
      3: "assets/sprites/runtime/waffle-walrus-v1/waffle-walrus_syrup-tusk-walrus_idle_SW_00.png",
      4: "assets/sprites/runtime/waffle-walrus-v1/waffle-walrus_brunch-behemoth_idle_SW_00.png",
    },
    dumpling_armadillo: {
      1: "assets/sprites/runtime/dumpling-armadillo-v1/dumpling-armadillo_dumpling-dillo_idle_SW_00.png",
      2: "assets/sprites/runtime/dumpling-armadillo-v1/dumpling-armadillo_bao-armadillo_idle_SW_00.png",
      3: "assets/sprites/runtime/dumpling-armadillo-v1/dumpling-armadillo_dim-sum-dozer_idle_SW_00.png",
      4: "assets/sprites/runtime/dumpling-armadillo-v1/dumpling-armadillo_steam-basket-bastion_idle_SW_00.png",
    },
    bagel_beaver: {
      1: "assets/sprites/runtime/bagel-beaver-v1/bagel-beaver_bagel-beaver_idle_SW_00.png",
      2: "assets/sprites/runtime/bagel-beaver-v1/bagel-beaver_sesame-beaver_idle_SW_00.png",
      3: "assets/sprites/runtime/bagel-beaver-v1/bagel-beaver_everything-dam-beaver_idle_SW_00.png",
      4: "assets/sprites/runtime/bagel-beaver-v1/bagel-beaver_brunch-lodge-beaver_idle_SW_00.png",
    },
    bao_bun_badger: {
      1: "assets/sprites/runtime/bao-bun-badger-v1/bao-bun-badger_bao-bun-badger_idle_SW_00.png",
      2: "assets/sprites/runtime/bao-bun-badger-v1/bao-bun-badger_sesame-bao-badger_idle_SW_00.png",
      3: "assets/sprites/runtime/bao-bun-badger-v1/bao-bun-badger_steam-cart-badger_idle_SW_00.png",
      4: "assets/sprites/runtime/bao-bun-badger-v1/bao-bun-badger_night-market-bao-boss_idle_SW_00.png",
    },
    lemon_meringue_lynx: {
      1: "assets/sprites/runtime/lemon-meringue-lynx-v1/lemon-meringue-lynx_lemon-lynx_idle_SW_00.png",
      2: "assets/sprites/runtime/lemon-meringue-lynx-v1/lemon-meringue-lynx_meringue-lynx_idle_SW_00.png",
      3: "assets/sprites/runtime/lemon-meringue-lynx-v1/lemon-meringue-lynx_tart-panther_idle_SW_00.png",
      4: "assets/sprites/runtime/lemon-meringue-lynx-v1/lemon-meringue-lynx_citrus-sphinx_idle_SW_00.png",
    },
    shakshuka_shark: {
      1: "assets/sprites/runtime/shakshuka-shark-v1/shakshuka-shark_shakshuka-shark_idle_SW_00.png",
      2: "assets/sprites/runtime/shakshuka-shark-v1/shakshuka-shark_saucy-shark_idle_SW_00.png",
      3: "assets/sprites/runtime/shakshuka-shark-v1/shakshuka-shark_skilletfin-shark_idle_SW_00.png",
      4: "assets/sprites/runtime/shakshuka-shark-v1/shakshuka-shark_harissa-megalodon_idle_SW_00.png",
    },
    saltwater_taffy_otter: {
      1: "assets/sprites/runtime/saltwater-taffy-otter-v1/saltwater-taffy-otter_taffy-pup_idle_SW_00.png",
      2: "assets/sprites/runtime/saltwater-taffy-otter-v1/saltwater-taffy-otter_saltwater-taffy-otter_idle_SW_00.png",
      3: "assets/sprites/runtime/saltwater-taffy-otter-v1/saltwater-taffy-otter_ribbon-taffy-otter_idle_SW_00.png",
      4: "assets/sprites/runtime/saltwater-taffy-otter-v1/saltwater-taffy-otter_candy-tide-otter_idle_SW_00.png",
    },
    croissant_kraken: {
      1: "assets/sprites/runtime/croissant-kraken-v1/croissant-kraken_croissant-squid_idle_SW_00.png",
      2: "assets/sprites/runtime/croissant-kraken-v1/croissant-kraken_buttered-kraken_idle_SW_00.png",
      3: "assets/sprites/runtime/croissant-kraken-v1/croissant-kraken_laminated-leviathan_idle_SW_00.png",
      4: "assets/sprites/runtime/croissant-kraken-v1/croissant-kraken_thousand-layer-abyss_idle_SW_00.png",
    },
    fortune_cookie_fox: {
      1: "assets/sprites/runtime/fortune-cookie-fox-v1/fortune-cookie-fox_fortune-kit_idle_SW_00.png",
      2: "assets/sprites/runtime/fortune-cookie-fox-v1/fortune-cookie-fox_cookie-fox_idle_SW_00.png",
      3: "assets/sprites/runtime/fortune-cookie-fox-v1/fortune-cookie-fox_prophecy-vixen_idle_SW_00.png",
      4: "assets/sprites/runtime/fortune-cookie-fox-v1/fortune-cookie-fox_oracle-kitsune_idle_SW_00.png",
    },
    mochi_mammoth: {
      1: "assets/sprites/runtime/mochi-mammoth-v1/mochi-mammoth_mochi-calf_idle_SW_00.png",
      2: "assets/sprites/runtime/mochi-mammoth-v1/mochi-mammoth_mochi-mammoth_idle_SW_00.png",
      3: "assets/sprites/runtime/mochi-mammoth-v1/mochi-mammoth_mooncake-mastodon_idle_SW_00.png",
      4: "assets/sprites/runtime/mochi-mammoth-v1/mochi-mammoth_festival-colossus_idle_SW_00.png",
    },
    gingerbread_golem: {
      1: "assets/sprites/runtime/gingerbread-golem-v1/gingerbread-golem_gingerling_idle_SW_00.png",
      2: "assets/sprites/runtime/gingerbread-golem-v1/gingerbread-golem_gingerbread-golem_idle_SW_00.png",
      3: "assets/sprites/runtime/gingerbread-golem-v1/gingerbread-golem_frosted-guardian_idle_SW_00.png",
      4: "assets/sprites/runtime/gingerbread-golem-v1/gingerbread-golem_candy-castle-colossus_idle_SW_00.png",
    },
    boba_basilisk: {
      1: "assets/sprites/runtime/boba-basilisk-v1/boba-basilisk_boba-newt_idle_SW_00.png",
      2: "assets/sprites/runtime/boba-basilisk-v1/boba-basilisk_tapioca-basilisk_idle_SW_00.png",
      3: "assets/sprites/runtime/boba-basilisk-v1/boba-basilisk_pearl-gorgon_idle_SW_00.png",
      4: "assets/sprites/runtime/boba-basilisk-v1/boba-basilisk_bubble-tea-hydra_idle_SW_00.png",
    },
    iceberg_oyster: {
      1: "assets/sprites/runtime/iceberg-oyster-v2/iceberg-oyster_iceberg-oyster_idle_SW_00.png",
      2: "assets/sprites/runtime/iceberg-oyster-v2/iceberg-oyster_pearl-ice-oyster_idle_SW_00.png",
      3: "assets/sprites/runtime/iceberg-oyster-v2/iceberg-oyster_glacier-shell-oyster_idle_SW_00.png",
      4: "assets/sprites/runtime/iceberg-oyster-v2/iceberg-oyster_abyssal-ice-pearl_idle_SW_00.png",
    },
    churro_cheetah: {
      1: "assets/sprites/runtime/churro-cheetah-v1/churro-cheetah_churro-cub_idle_SW_00.png",
      2: "assets/sprites/runtime/churro-cheetah-v1/churro-cheetah_cinnamon-cheetah_idle_SW_00.png",
      3: "assets/sprites/runtime/churro-cheetah-v1/churro-cheetah_chili-churro-cheetah_idle_SW_00.png",
      4: "assets/sprites/runtime/churro-cheetah-v1/churro-cheetah_dulce-firecat-v2_idle_SW_00.png",
    },
    granola_goat: {
      1: "assets/sprites/runtime/granola-goat-v1/granola-goat_oat-kid_idle_SW_00.png",
      2: "assets/sprites/runtime/granola-goat-v1/granola-goat_granola-goat_idle_SW_00.png",
      3: "assets/sprites/runtime/granola-goat-v1/granola-goat_trail-mix-ram-v3_idle_SW_00.png",
      4: "assets/sprites/runtime/granola-goat-v1/granola-goat_harvest-ibex-v3_idle_SW_00.png",
    },
    breakfast_burrito_boar: {
      1: "assets/sprites/runtime/breakfast-burrito-boar-v1/breakfast-burrito-boar_egg-wrap-piglet_idle_SW_00.png",
      2: "assets/sprites/runtime/breakfast-burrito-boar-v1/breakfast-burrito-boar_breakfast-burrito-boar_idle_SW_00.png",
      3: "assets/sprites/runtime/breakfast-burrito-boar-v1/breakfast-burrito-boar_salsa-tusk-boar_idle_SW_00.png",
      4: "assets/sprites/runtime/breakfast-burrito-boar-v1/breakfast-burrito-boar_brunch-cart-boar_idle_SW_00.png",
    },
    caesar_salamander: {
      1: "assets/sprites/runtime/caesar-salamander-v1/caesar-salamander_romaine-newt_idle_SW_00.png",
      2: "assets/sprites/runtime/caesar-salamander-v1/caesar-salamander_caesar-salamander_idle_SW_00.png",
      3: "assets/sprites/runtime/caesar-salamander-v1/caesar-salamander_crouton-crest_idle_SW_00.png",
      4: "assets/sprites/runtime/caesar-salamander-v1/caesar-salamander_salad-bar-sovereign_idle_SW_00.png",
    },
    cucumber_cobra: {
      1: "assets/sprites/runtime/cucumber-cobra-v1/cucumber-cobra_cuke-hatchling_idle_SW_00.png",
      2: "assets/sprites/runtime/cucumber-cobra-v1/cucumber-cobra_cucumber-cobra_idle_SW_00.png",
      3: "assets/sprites/runtime/cucumber-cobra-v1/cucumber-cobra_ribbon-cucumber_idle_SW_00.png",
      4: "assets/sprites/runtime/cucumber-cobra-v1/cucumber-cobra_garden-coil-hydra_idle_SW_00.png",
    },
    avocado_axolotl: {
      1: "assets/sprites/runtime/avocado-axolotl-v1/avocado-axolotl_avocado-totl_idle_SW_00.png",
      2: "assets/sprites/runtime/avocado-axolotl-v1/avocado-axolotl_avocado-axolotl_idle_SW_00.png",
      3: "assets/sprites/runtime/avocado-axolotl-v1/avocado-axolotl_guac-gill-axolotl_idle_SW_00.png",
      4: "assets/sprites/runtime/avocado-axolotl-v1/avocado-axolotl_orchard-pit-oracle_idle_SW_00.png",
    },
    herb_hare: {
      1: "assets/sprites/runtime/herb-hare-v1/herb-hare_herb-kit_idle_SW_00.png",
      2: "assets/sprites/runtime/herb-hare-v1/herb-hare_herb-hare_idle_SW_00.png",
      3: "assets/sprites/runtime/herb-hare-v1/herb-hare_focaccia-jackrabbit_idle_SW_00.png",
      4: "assets/sprites/runtime/herb-hare-v1/herb-hare_greenhouse-jumper_idle_SW_00.png",
    },
    caprese_capybara: {
      1: "assets/sprites/runtime/caprese-capybara-v1/caprese-capybara_mozzarella-pup_idle_SW_00.png",
      2: "assets/sprites/runtime/caprese-capybara-v1/caprese-capybara_caprese-capybara_idle_SW_00.png",
      3: "assets/sprites/runtime/caprese-capybara-v1/caprese-capybara_basil-pond-capybara_idle_SW_00.png",
      4: "assets/sprites/runtime/caprese-capybara-v1/caprese-capybara_antipasto-harbour_idle_SW_00.png",
    },
    vinaigrette_viper: {
      1: "assets/sprites/runtime/vinaigrette-viper-v1/vinaigrette-viper_vinaigrette-viper_idle_SW_00.png",
      2: "assets/sprites/runtime/vinaigrette-viper-v1/vinaigrette-viper_peppercorn-viper_idle_SW_00.png",
      3: "assets/sprites/runtime/vinaigrette-viper-v1/vinaigrette-viper_balsamic-coil_idle_SW_00.png",
      4: "assets/sprites/runtime/vinaigrette-viper-v1/vinaigrette-viper_dressing-dragon_idle_SW_00.png",
    },
    kelp_koala: {
      1: "assets/sprites/runtime/kelp-koala-v2/kelp-koala_kelp-joey_idle_SW_00.png",
      2: "assets/sprites/runtime/kelp-koala-v2/kelp-koala_kelp-koala_idle_SW_00.png",
      3: "assets/sprites/runtime/kelp-koala-v2/kelp-koala_seaweed-snacker_idle_SW_00.png",
      4: "assets/sprites/runtime/kelp-koala-v2/kelp-koala_tide-grove-koala_idle_SW_00.png",
    },
    melon_mint_mantis: {
      1: "assets/sprites/runtime/melon-mint-mantis-v2/melon-mint-mantis_mint-sprout-mantis_idle_SW_00.png",
      2: "assets/sprites/runtime/melon-mint-mantis-v2/melon-mint-mantis_melon-mint-mantis_idle_SW_00.png",
      3: "assets/sprites/runtime/melon-mint-mantis-v2/melon-mint-mantis_honeydew-blade_idle_SW_00.png",
      4: "assets/sprites/runtime/melon-mint-mantis-v2/melon-mint-mantis_melon-grove-reaper_idle_SW_00.png",
    },
    coconut_shrimp_sheep: {
      1: "assets/sprites/runtime/coconut-shrimp-sheep-v3/coconut-shrimp-sheep_coconut-lamb_idle_SW_00.png",
      2: "assets/sprites/runtime/coconut-shrimp-sheep-v3/coconut-shrimp-sheep_coconut-shrimp-sheep_idle_SW_00.png",
      3: "assets/sprites/runtime/coconut-shrimp-sheep-v3/coconut-shrimp-sheep_fried-fleece-shrimp_idle_SW_00.png",
      4: "assets/sprites/runtime/coconut-shrimp-sheep-v3/coconut-shrimp-sheep_island-coconut-ram_idle_SW_00.png",
    },
    crab_cake_caterpillar: {
      1: "assets/sprites/runtime/crab-cake-caterpillar-v2/crab-cake-caterpillar_crumb-grub_idle_SW_00.png",
      2: "assets/sprites/runtime/crab-cake-caterpillar-v2/crab-cake-caterpillar_crab-cake-caterpillar_idle_SW_00.png",
      3: "assets/sprites/runtime/crab-cake-caterpillar-v2/crab-cake-caterpillar_golden-shell-loaf_idle_SW_00.png",
      4: "assets/sprites/runtime/crab-cake-caterpillar-v2/crab-cake-caterpillar_boardwalk-crab-cake-moth_idle_SW_00.png",
    },
    pico_de_gallo_gecko: {
      1: "assets/sprites/runtime/pico-de-gallo-gecko-v3/pico-de-gallo-gecko_tomato-gecko_idle_SW_00.png",
      2: "assets/sprites/runtime/pico-de-gallo-gecko-v3/pico-de-gallo-gecko_pico-de-gallo-gecko_idle_SW_00.png",
      3: "assets/sprites/runtime/pico-de-gallo-gecko-v3/pico-de-gallo-gecko_salsa-crest-gecko_idle_SW_00.png",
      4: "assets/sprites/runtime/pico-de-gallo-gecko-v3/pico-de-gallo-gecko_market-bowl-basilisk_idle_SW_00.png",
    },
  };
  const DEFEAT_STILL_SPRITES = {
    toast_tortoise: "assets/sprites/runtime/defeat-stills/toast-tortoise-defeat-food-v1.png",
    sushi_seal: "assets/sprites/runtime/defeat-stills/sushi-seal-defeat-food-v1.png",
    taco_tiger: "assets/sprites/runtime/defeat-stills/taco-tiger-defeat-food-v1.png",
    berry_bat: "assets/sprites/runtime/defeat-stills/berry-bat-defeat-food-v1.png",
    noodle_newt: "assets/sprites/runtime/defeat-stills/noodle-newt-defeat-food-v1.png",
    pancake_penguin: "assets/sprites/runtime/defeat-stills/pancake-penguin-defeat-food-v1.png",
    pretzel_python: "assets/sprites/runtime/defeat-stills/pretzel-python-defeat-food-v1.png",
    popcorn_porcupine: "assets/sprites/runtime/defeat-stills/popcorn-porcupine-defeat-food-v1.png",
    donut_dodo: "assets/sprites/runtime/defeat-stills/donut-dodo-defeat-food-v1.png",
    benedict_lobster: "assets/sprites/runtime/defeat-stills/benedict-lobster-defeat-food-v1.png",
    curry_crab: "assets/sprites/runtime/defeat-stills/curry-crab-defeat-food-v1.png",
    hot_chip_hamster: "assets/sprites/runtime/defeat-stills/hot-chip-hamster-defeat-food-v1.png",
    waffle_walrus: "assets/sprites/runtime/defeat-stills/waffle-walrus-defeat-food-v1.png",
    bagel_beaver: "assets/sprites/runtime/defeat-stills/bagel-beaver-defeat-food-v1.png",
    bao_bun_badger: "assets/sprites/runtime/defeat-stills/bao-bun-badger-defeat-food-v1.png",
    pepper_prawn: "assets/sprites/runtime/defeat-stills/pepper-prawn-defeat-food-v1.png",
    yogurt_yeti: "assets/sprites/runtime/defeat-stills/yogurt-yeti-defeat-food-v1.png",
    kimchi_chameleon: "assets/sprites/runtime/defeat-stills/kimchi-chameleon-defeat-food-v1.png",
    dumpling_armadillo: "assets/sprites/runtime/defeat-stills/dumpling-armadillo-defeat-food-v1.png",
    lemon_meringue_lynx: "assets/sprites/runtime/defeat-stills/lemon-meringue-lynx-defeat-food-v1.png",
    shakshuka_shark: "assets/sprites/runtime/defeat-stills/shakshuka-shark-defeat-food-v1.png",
    boba_basilisk: "assets/sprites/runtime/defeat-stills/boba-basilisk-defeat-food-v1.png",
    croissant_kraken: "assets/sprites/runtime/defeat-stills/croissant-kraken-defeat-food-v1.png",
    fortune_cookie_fox: "assets/sprites/runtime/defeat-stills/fortune-cookie-fox-defeat-food-v1.png",
    mochi_mammoth: "assets/sprites/runtime/defeat-stills/mochi-mammoth-defeat-food-v1.png",
    gingerbread_golem: "assets/sprites/runtime/defeat-stills/gingerbread-golem-defeat-food-v1.png",
    iceberg_oyster: "assets/sprites/runtime/defeat-stills/iceberg-oyster-defeat-food-v1.png",
    saltwater_taffy_otter: "assets/sprites/runtime/defeat-stills/saltwater-taffy-otter-defeat-food-v1.png",
    churro_cheetah: "assets/sprites/runtime/defeat-stills/churro-cheetah-defeat-food-v1.png",
    granola_goat: "assets/sprites/runtime/defeat-stills/granola-goat-defeat-food-v1.png",
    breakfast_burrito_boar: "assets/sprites/runtime/defeat-stills/breakfast-burrito-boar-defeat-food-v1.png",
    caesar_salamander: "assets/sprites/runtime/defeat-stills/caesar-salamander-defeat-food-v2.png",
    cucumber_cobra: "assets/sprites/runtime/defeat-stills/cucumber-cobra-defeat-food-v2.png",
    avocado_axolotl: "assets/sprites/runtime/defeat-stills/avocado-axolotl-defeat-food-v2.png",
    herb_hare: "assets/sprites/runtime/defeat-stills/herb-hare-defeat-food-v2.png",
    caprese_capybara: "assets/sprites/runtime/defeat-stills/caprese-capybara-defeat-food-v2.png",
    vinaigrette_viper: "assets/sprites/runtime/defeat-stills/vinaigrette-viper-defeat-food-v2.png",
    kelp_koala: "assets/sprites/runtime/defeat-stills/kelp-koala-defeat-food-v1.png",
    melon_mint_mantis: "assets/sprites/runtime/defeat-stills/melon-mint-mantis-defeat-food-v1.png",
    coconut_shrimp_sheep: "assets/sprites/runtime/defeat-stills/coconut-shrimp-sheep-defeat-food-v1.png",
    crab_cake_caterpillar: "assets/sprites/runtime/defeat-stills/crab-cake-caterpillar-defeat-food-v1.png",
    pico_de_gallo_gecko: "assets/sprites/runtime/defeat-stills/pico-de-gallo-gecko-defeat-food-v1.png",
  };
  let unitSeq = 1;

  function randInt(max) {
    return Math.floor(Math.random() * max);
  }

  function isItem(entry) {
    return entry?.kind === "item";
  }

  function isDrink(entry) {
    return isItem(entry) && entry.type === "drink";
  }

  function isTopping(entry) {
    return isItem(entry) && entry.type !== "drink";
  }

  function isUnit(entry) {
    return Boolean(entry) && entry.kind !== "item";
  }

  function itemInfo(itemId) {
    return ITEMS.find((item) => item.id === itemId) || ITEMS[0];
  }

  function itemTier(tier = 1) {
    return Math.max(1, Math.min(MAX_ITEM_TIER, tier || 1));
  }

  function itemTierScale(tier = 1) {
    return ITEM_TIER_SCALING[itemTier(tier)] || ITEM_TIER_SCALING[1];
  }

  function itemLevelLabel(item) {
    return `Lv ${itemTier(item?.tier)}`;
  }

  function itemDisplayShort(item) {
    const tier = itemTier(item?.tier);
    return tier > 1 ? `${item.short} ${tier}` : item.short;
  }

  function scaleItemForTier(item, tier = 1) {
    const scale = itemTierScale(tier);
    if (scale === 1) return item;
    ITEM_SCALABLE_PROPS.forEach((prop) => {
      if (typeof item[prop] !== "number") return;
      const scaled = item[prop] * scale;
      item[prop] = Number.isInteger(item[prop]) ? Math.max(1, Math.round(scaled)) : Number(scaled.toFixed(4));
    });
    return item;
  }

  function makeItem(itemId = "sunny_side_egg", tier = 1) {
    const item = itemInfo(itemId);
    return scaleItemForTier({
      ...item,
      tier: itemTier(tier),
      uid: unitSeq++,
    }, tier);
  }

  function cloneItem(item) {
    return item ? { ...item } : null;
  }

  function entryCost(entry) {
    return isItem(entry) ? entry.price || ECONOMY.itemCost : ECONOMY.unitCost;
  }

  function shopSlotOnSale(index) {
    return Boolean(isShopSlotUnlocked(index) && state.shop[index] && state.shopSales[index]);
  }

  function currentShopSaleChance() {
    return SHOP_SALE_CHANCES[Math.max(1, Math.min(MAX_SHOP_LEVEL, state.shopLevel))] || 0.08;
  }

  function rollShopSlotSale(index, entry) {
    return Boolean(isShopSlotUnlocked(index) && entry && Math.random() < currentShopSaleChance());
  }

  function saleAdjustedEntryCost(entry, shopIndex = null) {
    const baseCost = entryCost(entry);
    if (shopIndex === null || !shopSlotOnSale(shopIndex)) return baseCost;
    return Math.max(1, Math.ceil(baseCost / 2));
  }

  function purchaseCost(entry, shopIndex = null) {
    const baseCost = saleAdjustedEntryCost(entry, shopIndex);
    if (!isItem(entry)) return baseCost;
    const discount = availableItemDiscount();
    return Math.max(0, baseCost - discount);
  }

  function availableItemDiscount() {
    if (state.itemDiscountUsed) return 0;
    return ownedItemMax("firstItemDiscountGold");
  }

  function markItemDiscountUsed(entry, shopIndex, finalCost) {
    if (!isItem(entry)) return;
    if (finalCost < saleAdjustedEntryCost(entry, shopIndex)) state.itemDiscountUsed = true;
  }

  function ownedItemMax(prop) {
    return allOwnedRefs().reduce((best, ref) => Math.max(best, ref.unit.item?.[prop] || 0), 0);
  }

  function ownedAbilityMax(ability, valueFn) {
    return allOwnedRefs()
      .filter((ref) => ref.unit.ability === ability)
      .reduce((best, ref) => Math.max(best, valueFn(ref.unit)), 0);
  }

  function entryLabel(entry) {
    return isItem(entry) ? itemDisplayShort(entry) : entry?.short || "Empty";
  }

  function itemDamageMultiplier(unit) {
    return 1 + (unit?.item?.damageBonusPct || 0);
  }

  function itemPrimaryCardText(item) {
    const stat = itemPrimaryStat(item);
    if (stat.label === "LINE") return `Line ${stat.value}`;
    if (stat.label === "DMG") return `${stat.value} dmg`;
    if (stat.label === "SPD") return `${stat.value} spd`;
    if (stat.label === "HP") return `${stat.value} HP`;
    if (stat.label === "PWR") return `${stat.value} PWR`;
    if (typeof stat.value === "string" && /^[+-]?\d+%$/.test(stat.value)) return `${stat.label.toLowerCase()} ${stat.value}`;
    return null;
  }

  function itemCardText(item) {
    return itemPrimaryCardText(item) || item?.cardText || item?.abilityText || "Topping";
  }

  function percentText(value) {
    return `${Math.round((value || 0) * 100)}%`;
  }

  function drinkPairLabel(item) {
    return (item?.pairTraits || []).map((traitId) => traitDisplayText(traitId)).join("/");
  }

  function drinkPairSpecLine(item) {
    if (!isDrink(item) || !item.pairTraits?.length) return null;
    const bonuses = [];
    if (item.pairedDrinkAttackSpeedPct) bonuses.push(`+${percentText(item.pairedDrinkAttackSpeedPct)} speed`);
    if (item.pairedDrinkMaxHpPct) bonuses.push(`+${percentText(item.pairedDrinkMaxHpPct)} HP`);
    if (item.pairedDrinkAbilityPowerPct) bonuses.push(`+${percentText(item.pairedDrinkAbilityPowerPct)} PWR`);
    return `${drinkPairLabel(item)} pair: ${bonuses.join(", ")}`;
  }

  function unitMatchesDrinkPair(unit, drink) {
    return Boolean(unit && drink?.pairTraits?.some((traitId) => unitHasTrait(unit, traitId)));
  }

  function drinkPulseUnlocked(drink) {
    return isDrink(drink) && Boolean(drink.drinkPulseType);
  }

  function drinkPulseTierScale(drink) {
    return itemTierScale(drink?.tier) / itemTierScale(2);
  }

  function drinkPulseSpecLine(drink, unlockedText = false) {
    if (!isDrink(drink) || !drink.drinkPulseType) return "";
    const interval = drink.drinkPulseInterval || 5;
    const duration = drink.drinkPulseDuration || 2.4;
    const scale = unlockedText ? drinkPulseTierScale(drink) : 1;
    const prefix = "Pulse";
    if (drink.drinkPulseType === "shield") {
      return `${prefix}: every ${interval}s, line gains ${percentText((drink.drinkPulseShieldPct || 0) * scale)} max HP shield`;
    }
    if (drink.drinkPulseType === "haste") {
      return `${prefix}: every ${interval}s, line gains +${percentText((drink.drinkPulseHastePct || 0) * scale)} speed for ${duration}s`;
    }
    if (drink.drinkPulseType === "heal") {
      return `${prefix}: every ${interval}s, weakest line ally heals ${percentText((drink.drinkPulseHealPct || 0) * scale)} max HP`;
    }
    if (drink.drinkPulseType === "brine") {
      return `${prefix}: every ${interval}s, enemy line takes ${percentText((drink.drinkPulseEnemyDamagePct || 0) * scale)} max HP and slows`;
    }
    if (drink.drinkPulseType === "attack_boost") {
      return `${prefix}: every ${interval}s, line gains +${percentText((drink.drinkPulseAttackBoostPct || 0) * scale)} damage for ${duration}s`;
    }
    return `${prefix}: every ${interval}s, line surges`;
  }

  function drinkTechnicalDescriptionLines(item) {
    if (!isDrink(item)) return [];
    return itemSpecLines(item);
  }

  function drinkTechnicalDescription(item) {
    return drinkTechnicalDescriptionLines(item).map((line) => `- ${line}`).join("\n");
  }

  function drinkStatLevelEffectLine(item) {
    if (!isDrink(item)) return itemCompactSpecLine(item);
    const parts = [];
    if (item.drinkAttackSpeedPct) parts.push(`line speed +${percentText(item.drinkAttackSpeedPct)}`);
    if (item.drinkMaxHpPct) parts.push(`line health +${percentText(item.drinkMaxHpPct)}`);
    if (item.drinkAbilityPowerPct) parts.push(`line ability +${percentText(item.drinkAbilityPowerPct)}`);

    const pairEffects = [];
    if (item.pairedDrinkAttackSpeedPct) pairEffects.push(`speed +${percentText(item.pairedDrinkAttackSpeedPct)}`);
    if (item.pairedDrinkMaxHpPct) pairEffects.push(`health +${percentText(item.pairedDrinkMaxHpPct)}`);
    if (item.pairedDrinkAbilityPowerPct) pairEffects.push(`ability +${percentText(item.pairedDrinkAbilityPowerPct)}`);
    if (pairEffects.length) parts.push(`pair ${pairEffects.join(", ")}`);

    return parts.join("; ") || itemCompactSpecLine(item);
  }

  function drinkSpecialUnlockLines(item) {
    if (!isDrink(item) || !item.drinkPulseType) return ["No pulse effect."];
    return [drinkPulseSpecLine(item, drinkPulseUnlocked(item))];
  }

  function drinkCompactLevelEffectLine(item) {
    if (!isDrink(item)) return itemCompactSpecLine(item);
    const parts = [];
    if (item.drinkAttackSpeedPct) parts.push(`line speed +${percentText(item.drinkAttackSpeedPct)}`);
    if (item.drinkMaxHpPct) parts.push(`line health +${percentText(item.drinkMaxHpPct)}`);
    if (item.drinkAbilityPowerPct) parts.push(`line ability +${percentText(item.drinkAbilityPowerPct)}`);

    const pairEffects = [];
    if (item.pairedDrinkAttackSpeedPct) pairEffects.push(`speed +${percentText(item.pairedDrinkAttackSpeedPct)}`);
    if (item.pairedDrinkMaxHpPct) pairEffects.push(`health +${percentText(item.pairedDrinkMaxHpPct)}`);
    if (item.pairedDrinkAbilityPowerPct) pairEffects.push(`ability +${percentText(item.pairedDrinkAbilityPowerPct)}`);
    if (pairEffects.length) parts.push(`pair ${pairEffects.join(", ")}`);

    if (drinkPulseUnlocked(item)) {
      const pulse = drinkPulseSpecLine(item, true)
        .replace(/^Pulse: every /, "pulse ")
        .replace(/, line gains /, " ")
        .replace(/weakest line ally heals /, "heal ")
        .replace(/enemy line takes /, "enemy ")
        .replace(/max HP/g, "health")
        .replace(/ for /, "/")
        .replace(/\.$/, "");
      parts.push(pulse);
    }
    return parts.join("; ");
  }

  function itemSpecLines(item) {
    if (!item) return ["No topping specs"];
    const lines = [];
    if (item.drinkAttackSpeedPct) lines.push(`Drink line: attack speed +${percentText(item.drinkAttackSpeedPct)}`);
    if (item.drinkMaxHpPct) lines.push(`Drink line: max HP +${percentText(item.drinkMaxHpPct)}`);
    if (item.drinkAbilityPowerPct) lines.push(`Drink line: ability power +${percentText(item.drinkAbilityPowerPct)}`);
    const pairLine = drinkPairSpecLine(item);
    if (pairLine) lines.push(pairLine);
    const pulseLine = drinkPulseSpecLine(item, drinkPulseUnlocked(item));
    if (pulseLine) lines.push(pulseLine);
    if (item.damageBonusPct) lines.push(`Damage +${percentText(item.damageBonusPct)}`);
    if (item.attackSpeedPct) lines.push(`Attack speed +${percentText(item.attackSpeedPct)}`);
    if (item.maxHpBonusPct) lines.push(`Max HP +${percentText(item.maxHpBonusPct)}`);
    if (item.abilityPowerBonusPct) lines.push(`Ability power +${percentText(item.abilityPowerBonusPct)}`);
    if (item.damageTakenPct) lines.push(`Damage taken +${percentText(item.damageTakenPct)}`);
    if (item.onAttackShieldPct) lines.push(`On attack: shield ${percentText(item.onAttackShieldPct)} max HP + PWR scaling`);
    if (item.onHitShieldPct) lines.push(`On hit: shield ${percentText(item.onHitShieldPct)} max HP`);
    if (item.shieldCrackleDamagePct) lines.push(`When shielded hit: crackle back ${percentText(item.shieldCrackleDamagePct)} max HP damage`);
    if (item.burnDamagePct) lines.push(`Attacks burn for ${percentText(item.burnDamagePct)} ATK each tick (${item.burnDuration || 3}s)`);
    if (item.supportBonusPct) lines.push(`Heals/shields +${percentText(item.supportBonusPct)}`);
    if (item.markDamagePct) lines.push(`Attacks mark: +${percentText(item.markDamagePct)} holder damage (${item.markDuration || 4}s)`);
    if (item.selfHealPct) lines.push(`Every ${item.everyNAttacks || 3} attacks: heal ${percentText(item.selfHealPct)} max HP`);
    if (item.splashDamagePct) lines.push(`Attacks splash adjacent enemies for ${percentText(item.splashDamagePct)} ATK`);
    if (item.lateFightDamagePct) lines.push(`After ${item.lateFightStart || 8}s: +${percentText(item.lateFightDamagePct)} damage per stack, max ${item.lateFightMaxStacks || 4}`);
    if (item.lowHpAttackSpeedPct) lines.push(`Below ${percentText(item.lowHpThreshold || 0.5)} HP: +${percentText(item.lowHpAttackSpeedPct)} speed`);
    if (item.lowHpLifestealPct) lines.push(`Below ${percentText(item.lowHpThreshold || 0.5)} HP: ${percentText(item.lowHpLifestealPct)} lifesteal`);
    if (item.cooldownDelay) lines.push(`Attacks delay target cooldown by ${item.cooldownDelay.toFixed(2)}s`);
    if (item.supportHastePct) lines.push(`Supported allies gain +${percentText(item.supportHastePct)} speed for ${item.supportHasteDuration || 3}s`);
    if (item.antiSupportPct) lines.push(`Attacks cut enemy heals/shields by ${percentText(item.antiSupportPct)} for ${item.antiSupportDuration || 4}s`);
    if (item.receivedSupportSharePct) lines.push(`Shares ${percentText(item.receivedSupportSharePct)} received support with adjacent allies`);
    if (item.bounceDamagePct) lines.push(`Attacks bounce for ${percentText(item.bounceDamagePct)} ATK`);
    if (item.shieldedAttackBonusPct) lines.push(`While shielded: damage +${percentText(item.shieldedAttackBonusPct)}`);
    if (item.overhealShieldPct) lines.push(`Overheal converts to shield at ${percentText(item.overhealShieldPct)}`);
    if (item.mergeProgressBonus) lines.push(`Bench holder counts as +${item.mergeProgressBonus} merge copy`);
    if (item.frontRowDamageReductionPct) lines.push(`Front row: damage taken -${percentText(item.frontRowDamageReductionPct)}`);
    if (item.backRowTargeting) lines.push(`Back-row holder targets enemy back row`);
    if (item.adjacentStartShieldPct) lines.push(`Battle start: adjacent allies gain ${percentText(item.adjacentStartShieldPct)} max HP shield`);
    if (item.adjacentStartAttackBuffPct) lines.push(`Battle start: adjacent allies gain +${percentText(item.adjacentStartAttackBuffPct)} damage for ${item.adjacentStartBuffDuration || 4}s`);
    if (item.pierceDamagePct) lines.push(`Attacks pierce behind target for ${percentText(item.pierceDamagePct)} ATK`);
    if (item.lowHpBurnDamagePct) lines.push(`At low HP once: nearby burn for ${percentText(item.lowHpBurnDamagePct)} ATK (${item.lowHpBurnDuration || 3}s)`);
    if (item.deathSaveShieldPct) lines.push(`Once per battle: survive fatal hit with ${percentText(item.deathSaveShieldPct)} max HP shield`);
    if (item.firstDebuffCleanseHealPct) lines.push(`First debuff: cleanse and heal ${percentText(item.firstDebuffCleanseHealPct)} max HP`);
    if (item.timedHastePct) lines.push(`At ${item.timedHasteAt || 10}s: +${percentText(item.timedHastePct)} speed for ${item.timedHasteDuration || 4}s`);
    if (item.shieldedTargetDamagePct) lines.push(`Vs shielded targets: damage +${percentText(item.shieldedTargetDamagePct)}`);
    if (item.attackSlowPct) lines.push(`Attacks slow enemy speed by ${percentText(item.attackSlowPct)} for ${item.attackSlowDuration || 3}s`);
    if (item.statusDurationReductionPct) lines.push(`Negative statuses fade ${percentText(item.statusDurationReductionPct)} faster`);
    if (item.statusDamageReductionPct) lines.push(`Splash/status damage taken -${percentText(item.statusDamageReductionPct)}`);
    if (item.decoyHpPct) lines.push(`Battle start: summon decoy with ${percentText(item.decoyHpPct)} max HP`);
    if (item.firstHitRedirect) lines.push(`First direct hit is redirected once`);
    if (item.periodicDamage) lines.push(`Every ${item.periodicInterval || 3}s: random chip damage scales from ${item.periodicDamage} + ${percentText(item.periodicDamagePct || 0)} PWR`);
    if (item.sellBonusGold) lines.push(`Sell value +${item.sellBonusGold} coins`);
    if (item.surviveGold) lines.push(`Survive battle: +${item.surviveGold} coins`);
    if (item.firstItemDiscountGold) lines.push(`First topping each round costs ${item.firstItemDiscountGold} fewer coins`);
    if (item.sameLineShopChancePct) lines.push(`Shop owned-line chance +${percentText(item.sameLineShopChancePct)}`);
    if (item.extraAdjacentHealPct) lines.push(`Healing splashes ${percentText(item.extraAdjacentHealPct)} to one adjacent ally`);
    if (item.shieldCapBonusPct) lines.push(`Holder shield cap +${percentText(item.shieldCapBonusPct)}`);
    if (item.statusDurationBonusPct) lines.push(`Inflicted statuses last +${percentText(item.statusDurationBonusPct)}`);
    if (item.supportAttackBuffPct) lines.push(`Supported allies gain +${percentText(item.supportAttackBuffPct)} damage for ${item.supportAttackBuffDuration || 3}s`);
    if (item.battleStartHpLossPct) lines.push(`Battle start: holder loses ${percentText(item.battleStartHpLossPct)} max HP`);
    if (item.firstAttacksBonusPct) lines.push(`First ${item.firstAttacksCount || 3} attacks: +${percentText(item.firstAttacksBonusPct)} damage`);
    if (item.exhaustedSpeedPenaltyPct) lines.push(`After burst: speed -${percentText(item.exhaustedSpeedPenaltyPct)}`);
    if (item.selfBurnDamagePct) lines.push(`Self-burns ${percentText(item.selfBurnDamagePct)} max HP each second`);
    if (item.shieldedAttackSpeedPct) lines.push(`While shielded: speed +${percentText(item.shieldedAttackSpeedPct)}`);
    if (item.teamVulnerabilityPct) lines.push(`Attacks make target take +${percentText(item.teamVulnerabilityPct)} team damage for ${item.teamVulnerabilityDuration || 4}s`);
    if (item.executeSplashBonusPct) lines.push(`Vs wounded targets: +${percentText(item.executeSplashBonusPct)} damage`);
    if (item.executeSplashDamagePct) lines.push(`Wounded hits splash for ${percentText(item.executeSplashDamagePct)} ATK`);
    if (item.teamOverhealShieldPct) lines.push(`Overhealing holder shields adjacent allies at ${percentText(item.teamOverhealShieldPct)}`);
    if (item.teamHastePct) lines.push(`Every ${item.teamHasteInterval || 5}s: team +${percentText(item.teamHastePct)} speed for ${item.teamHasteDuration || 2.5}s`);
    if (item.supportRowEchoPct) lines.push(`Support echoes row shield for ${percentText(item.supportRowEchoPct)} PWR`);
    return lines.length ? lines : [item.abilityText || item.cardText || "Single-use topping effect"];
  }

  function itemCompactSpecLine(item) {
    if (!item) return "No topping specs";
    if (isDrink(item) && item.pairTraits?.length) {
      const effect = item.drinkAttackSpeedPct ? "speed" : item.drinkMaxHpPct ? "HP" : item.drinkAbilityPowerPct ? "PWR" : "buff";
      return `${drinkPairLabel(item)} ${effect}`;
    }
    if (item.drinkAttackSpeedPct) return `line speed +${percentText(item.drinkAttackSpeedPct)}`;
    if (item.drinkMaxHpPct) return `line HP +${percentText(item.drinkMaxHpPct)}`;
    if (item.drinkAbilityPowerPct) return `line PWR +${percentText(item.drinkAbilityPowerPct)}`;
    if (item.damageBonusPct && item.damageTakenPct) return `+${percentText(item.damageBonusPct)} dmg, +${percentText(item.damageTakenPct)} taken`;
    if (item.damageBonusPct) return `+${percentText(item.damageBonusPct)} damage`;
    if (item.attackSpeedPct) return `+${percentText(item.attackSpeedPct)} attack speed`;
    if (item.maxHpBonusPct) return `+${percentText(item.maxHpBonusPct)} max HP`;
    if (item.abilityPowerBonusPct) return `+${percentText(item.abilityPowerBonusPct)} PWR`;
    if (item.onAttackShieldPct) return `attack shield ${percentText(item.onAttackShieldPct)} HP`;
    if (item.onHitShieldPct) return `hit shield ${percentText(item.onHitShieldPct)} HP`;
    if (item.shieldCrackleDamagePct) return `shield crackle ${percentText(item.shieldCrackleDamagePct)} HP`;
    if (item.burnDamagePct) return `burn ${percentText(item.burnDamagePct)} ATK/${item.burnDuration || 3}s`;
    if (item.supportBonusPct) return `heals/shields +${percentText(item.supportBonusPct)}`;
    if (item.markDamagePct) return `mark +${percentText(item.markDamagePct)} dmg`;
    if (item.selfHealPct) return `every ${item.everyNAttacks || 3} attacks heal ${percentText(item.selfHealPct)} HP`;
    if (item.splashDamagePct) return `splash ${percentText(item.splashDamagePct)} ATK`;
    if (item.lateFightDamagePct) return `after ${item.lateFightStart || 8}s, +${percentText(item.lateFightDamagePct)} dmg stacks`;
    if (item.lowHpAttackSpeedPct || item.lowHpLifestealPct) return `low HP speed/lifesteal`;
    if (item.cooldownDelay) return `attacks delay ${item.cooldownDelay.toFixed(2)}s`;
    if (item.supportHastePct) return `support grants +${percentText(item.supportHastePct)} speed`;
    if (item.antiSupportPct) return `attacks cut support ${percentText(item.antiSupportPct)}`;
    if (item.receivedSupportSharePct) return `share ${percentText(item.receivedSupportSharePct)} support`;
    if (item.bounceDamagePct) return `bounce ${percentText(item.bounceDamagePct)} ATK`;
    if (item.shieldedAttackBonusPct) return `shielded dmg +${percentText(item.shieldedAttackBonusPct)}`;
    if (item.overhealShieldPct) return `overheal to shield ${percentText(item.overhealShieldPct)}`;
    if (item.mergeProgressBonus) return `bench merge +${item.mergeProgressBonus}`;
    if (item.frontRowDamageReductionPct) return `front damage -${percentText(item.frontRowDamageReductionPct)}`;
    if (item.backRowTargeting) return `back row targets back row`;
    if (item.adjacentStartShieldPct && item.adjacentStartAttackBuffPct) return `adjacent shield +${percentText(item.adjacentStartShieldPct)}, dmg +${percentText(item.adjacentStartAttackBuffPct)}`;
    if (item.adjacentStartShieldPct) return `adjacent shield ${percentText(item.adjacentStartShieldPct)} max HP`;
    if (item.pierceDamagePct) return `pierce ${percentText(item.pierceDamagePct)} ATK`;
    if (item.lowHpBurnDamagePct) return `low HP burn ${percentText(item.lowHpBurnDamagePct)} ATK`;
    if (item.deathSaveShieldPct) return `fatal save +${percentText(item.deathSaveShieldPct)} shield`;
    if (item.firstDebuffCleanseHealPct) return `first debuff cleanse/heal`;
    if (item.timedHastePct) return `${item.timedHasteAt || 10}s haste +${percentText(item.timedHastePct)}`;
    if (item.shieldedTargetDamagePct) return `vs shields +${percentText(item.shieldedTargetDamagePct)} dmg`;
    if (item.attackSlowPct) return `attack slow ${percentText(item.attackSlowPct)}`;
    if (item.statusDurationReductionPct) return `statuses fade ${percentText(item.statusDurationReductionPct)} faster`;
    if (item.statusDamageReductionPct) return `splash/status dmg -${percentText(item.statusDamageReductionPct)}`;
    if (item.decoyHpPct) return `start decoy ${percentText(item.decoyHpPct)} HP`;
    if (item.firstHitRedirect) return `redirect first hit`;
    if (item.periodicDamage) return `pop damage every ${item.periodicInterval || 3}s`;
    if (item.sellBonusGold) return `sell value +${item.sellBonusGold} coins`;
    if (item.surviveGold) return `survive +${item.surviveGold} coins`;
    if (item.firstItemDiscountGold) return `first topping -${item.firstItemDiscountGold} coins`;
    if (item.sameLineShopChancePct) return `owned-line shop +${percentText(item.sameLineShopChancePct)}`;
    if (item.extraAdjacentHealPct) return `heal splash ${percentText(item.extraAdjacentHealPct)}`;
    if (item.shieldCapBonusPct) return `shield cap +${percentText(item.shieldCapBonusPct)}`;
    if (item.statusDurationBonusPct) return `statuses last +${percentText(item.statusDurationBonusPct)}`;
    if (item.supportAttackBuffPct) return `support grants +${percentText(item.supportAttackBuffPct)} dmg`;
    if (item.battleStartHpLossPct) return `starts -${percentText(item.battleStartHpLossPct)} HP`;
    if (item.firstAttacksBonusPct) return `first ${item.firstAttacksCount || 3} attacks +${percentText(item.firstAttacksBonusPct)} dmg`;
    if (item.shieldedAttackSpeedPct) return `shielded speed +${percentText(item.shieldedAttackSpeedPct)}`;
    if (item.teamVulnerabilityPct) return `target vulnerable +${percentText(item.teamVulnerabilityPct)}`;
    if (item.executeSplashBonusPct || item.executeSplashDamagePct) return `wounded execute splash`;
    if (item.teamOverhealShieldPct) return `overheal team shield ${percentText(item.teamOverhealShieldPct)}`;
    if (item.teamHastePct) return `team haste +${percentText(item.teamHastePct)}`;
    if (item.supportRowEchoPct) return `row echo ${percentText(item.supportRowEchoPct)} PWR`;
    return item.cardText || item.abilityText || "single-use effect";
  }

  function itemPrimaryStat(item) {
    if (item?.drinkAttackSpeedPct) return { label: "LINE", value: `+${Math.round(item.drinkAttackSpeedPct * 100)}%` };
    if (item?.drinkMaxHpPct) return { label: "LINE", value: `+${Math.round(item.drinkMaxHpPct * 100)}%` };
    if (item?.drinkAbilityPowerPct) return { label: "LINE", value: `+${Math.round(item.drinkAbilityPowerPct * 100)}%` };
    if (item?.damageBonusPct) return { label: "DMG", value: `+${Math.round(item.damageBonusPct * 100)}%` };
    if (item?.attackSpeedPct) return { label: "SPD", value: `+${Math.round(item.attackSpeedPct * 100)}%` };
    if (item?.maxHpBonusPct) return { label: "HP", value: `+${Math.round(item.maxHpBonusPct * 100)}%` };
    if (item?.abilityPowerBonusPct) return { label: "PWR", value: `+${Math.round(item.abilityPowerBonusPct * 100)}%` };
    if (item?.onAttackShieldPct) return { label: "SHLD", value: "Atk" };
    if (item?.onHitShieldPct) return { label: "SHLD", value: "Hit" };
    if (item?.shieldCrackleDamagePct) return { label: "CRKL", value: `${Math.round(item.shieldCrackleDamagePct * 100)}%` };
    if (item?.burnDamagePct) return { label: "BURN", value: `${Math.round(item.burnDamagePct * 100)}%` };
    if (item?.supportBonusPct) return { label: "SUP", value: `+${Math.round(item.supportBonusPct * 100)}%` };
    if (item?.markDamagePct) return { label: "MARK", value: `+${Math.round(item.markDamagePct * 100)}%` };
    if (item?.damageTakenPct) return { label: "RISK", value: `+${Math.round(item.damageTakenPct * 100)}%` };
    if (item?.selfHealPct) return { label: "HEAL", value: `3rd` };
    if (item?.splashDamagePct) return { label: "AOE", value: `${Math.round(item.splashDamagePct * 100)}%` };
    if (item?.lateFightDamagePct) return { label: "LATE", value: `+${Math.round(item.lateFightDamagePct * 100)}%` };
    if (item?.lowHpLifestealPct) return { label: "LOW", value: `HP` };
    if (item?.cooldownDelay) return { label: "SLOW", value: `${item.cooldownDelay.toFixed(2)}s` };
    if (item?.supportHastePct) return { label: "HASTE", value: `+${Math.round(item.supportHastePct * 100)}%` };
    if (item?.antiSupportPct) return { label: "CUT", value: `${Math.round(item.antiSupportPct * 100)}%` };
    if (item?.receivedSupportSharePct) return { label: "SHARE", value: `${Math.round(item.receivedSupportSharePct * 100)}%` };
    if (item?.bounceDamagePct) return { label: "BNCE", value: `${Math.round(item.bounceDamagePct * 100)}%` };
    if (item?.shieldedAttackBonusPct) return { label: "SHLD", value: `+${Math.round(item.shieldedAttackBonusPct * 100)}%` };
    if (item?.overhealShieldPct) return { label: "OVER", value: `${Math.round(item.overhealShieldPct * 100)}%` };
    if (item?.mergeProgressBonus) return { label: "MERGE", value: `+${item.mergeProgressBonus}` };
    if (item?.frontRowDamageReductionPct) return { label: "FRONT", value: `-${Math.round(item.frontRowDamageReductionPct * 100)}%` };
    if (item?.backRowTargeting) return { label: "AIM", value: "Back" };
    if (item?.adjacentStartAttackBuffPct) return { label: "BUFF", value: `+${Math.round(item.adjacentStartAttackBuffPct * 100)}%` };
    if (item?.adjacentStartShieldPct) return { label: "SHLD", value: "Adj" };
    if (item?.pierceDamagePct) return { label: "PIERCE", value: `${Math.round(item.pierceDamagePct * 100)}%` };
    if (item?.lowHpBurnDamagePct) return { label: "BURN", value: "Low" };
    if (item?.deathSaveShieldPct) return { label: "SAVE", value: "1" };
    if (item?.firstDebuffCleanseHealPct) return { label: "CLNS", value: "1" };
    if (item?.timedHastePct) return { label: "HASTE", value: `${item.timedHasteAt}s` };
    if (item?.shieldedTargetDamagePct) return { label: "VS", value: "Shield" };
    if (item?.attackSlowPct) return { label: "SLOW", value: `${Math.round(item.attackSlowPct * 100)}%` };
    if (item?.statusDurationReductionPct) return { label: "RESIST", value: `${Math.round(item.statusDurationReductionPct * 100)}%` };
    if (item?.statusDamageReductionPct) return { label: "AOE", value: `-${Math.round(item.statusDamageReductionPct * 100)}%` };
    if (item?.decoyHpPct) return { label: "DECOY", value: `${Math.round(item.decoyHpPct * 100)}%` };
    if (item?.firstHitRedirect) return { label: "HIT", value: "Block" };
    if (item?.periodicDamage) return { label: "POP", value: item.periodicDamage };
    if (item?.sellBonusGold) return { label: "SELL", value: { currency: item.sellBonusGold, sign: "+" } };
    if (item?.surviveGold) return { label: "GOLD", value: { currency: item.surviveGold, sign: "+" } };
    if (item?.firstItemDiscountGold) return { label: "SALE", value: { currency: item.firstItemDiscountGold, sign: "-" } };
    if (item?.sameLineShopChancePct) return { label: "ODDS", value: `+${Math.round(item.sameLineShopChancePct * 100)}%` };
    if (item?.extraAdjacentHealPct) return { label: "HEAL", value: "Splash" };
    if (item?.shieldCapBonusPct) return { label: "CAP", value: `+${Math.round(item.shieldCapBonusPct * 100)}%` };
    if (item?.statusDurationBonusPct) return { label: "STAT", value: `+${Math.round(item.statusDurationBonusPct * 100)}%` };
    if (item?.supportAttackBuffPct) return { label: "BUFF", value: `+${Math.round(item.supportAttackBuffPct * 100)}%` };
    if (item?.battleStartHpLossPct) return { label: "RISK", value: `-${Math.round(item.battleStartHpLossPct * 100)}%` };
    if (item?.firstAttacksBonusPct) return { label: "BURST", value: `${item.firstAttacksCount}` };
    if (item?.selfBurnDamagePct) return { label: "BURN", value: "Self" };
    if (item?.shieldedAttackSpeedPct) return { label: "SPD", value: "Shield" };
    if (item?.teamVulnerabilityPct) return { label: "VULN", value: `+${Math.round(item.teamVulnerabilityPct * 100)}%` };
    if (item?.executeSplashDamagePct) return { label: "EXEC", value: "Splash" };
    if (item?.teamOverhealShieldPct) return { label: "OVER", value: "Team" };
    if (item?.teamHastePct) return { label: "HASTE", value: "Team" };
    if (item?.supportRowEchoPct) return { label: "ROW", value: "Echo" };
    return { label: "ITEM", value: "On" };
  }

  function refreshUnitItemStats(unit) {
    if (!isUnit(unit)) return unit;
    unit.baseAtk = unit.baseAtk || unit.atk;
    unit.baseMaxHp = unit.baseMaxHp || unit.maxHp;
    unit.baseSpeed = unit.baseSpeed || unit.speed;
    unit.baseAbilityPower = unit.baseAbilityPower || unit.abilityPower;
    const oldMaxHp = unit.maxHp || unit.baseMaxHp;
    const wasFull = unit.hp >= oldMaxHp;
    const bonusPct = unit.item?.damageBonusPct || 0;
    const scaledAtk = Math.max(1, Math.round(unit.baseAtk * itemDamageMultiplier(unit)));
    unit.atk = bonusPct > 0 ? Math.max(scaledAtk, unit.baseAtk + 1) : scaledAtk;
    const hpPct = unit.item?.maxHpBonusPct || 0;
    unit.maxHp = Math.max(1, Math.round(unit.baseMaxHp * (1 + hpPct)));
    unit.hp = wasFull ? unit.maxHp : Math.min(unit.hp, unit.maxHp);
    const speedPct = unit.item?.attackSpeedPct || 0;
    unit.speed = Math.max(0.22, unit.baseSpeed / (1 + speedPct));
    const powerPct = (unit.item?.abilityPowerBonusPct || 0) + favoriteToppingBonusPct(unit);
    const scaledPower = Math.max(1, Math.round(unit.baseAbilityPower * (1 + powerPct)));
    unit.abilityPower = powerPct > 0 ? Math.max(scaledPower, unit.baseAbilityPower + 1) : scaledPower;
    return unit;
  }

  function makeUnit(typeId, tier = 1) {
    const base = CATALOG.find((u) => u.id === typeId) || CATALOG[0];
    const form = base.forms[Math.max(0, Math.min(base.forms.length - 1, tier - 1))];
    const scaling = tierScaling(tier);
    const maxHp = Math.round(base.hp * scaling.hp * GLOBAL_HP_SCALE);
    const atk = Math.round(base.atk * scaling.atk);
    const abilityPower = Math.max(1, Math.round(base.atk * scaling.ability));
    return {
      kind: "unit",
      uid: unitSeq++,
      typeId: base.id,
      lineName: base.name,
      name: form.name,
      short: form.short,
      emoji: base.emoji,
      rarity: base.rarity || "common",
      family: base.family || "meal",
      traits: [...(base.traits || [])],
      color: base.color,
      accent: base.accent,
      role: base.role,
      ability: base.ability || "front",
      abilityText: base.abilityText || "Front blockers",
      tier,
      hp: maxHp,
      maxHp,
      baseAtk: atk,
      atk,
      abilityPower,
      speed: Math.max(0.28, base.speed * scaling.speed),
      cooldown: Math.random() * 0.25,
      targetUid: null,
      shield: 0,
      x: 0,
      y: 0,
      side: "ally",
      slot: null,
      item: null,
      dead: false,
    };
  }

  function tierScaling(tier) {
    return TIER_SCALING[Math.max(1, Math.min(TIER_SCALING.length - 1, tier))] || TIER_SCALING[1];
  }

  function shopLevelInfo(level = state.shopLevel) {
    const index = Math.max(0, Math.min(MAX_SHOP_LEVEL - 1, level - 1));
    return SHOP_LEVELS[index] || SHOP_LEVELS[0];
  }

  function nextShopUpgradeCost() {
    const baseCost = shopLevelInfo().upgradeCost;
    if (baseCost === null) return null;
    return Math.max(0, baseCost - (state.nextShopUpgradeDiscountGold || 0));
  }

  function currentShopRarityWeights() {
    return { ...shopLevelInfo().rarityWeights };
  }

  function shopLevelChance(chances, fallback) {
    return chances[Math.max(1, Math.min(MAX_SHOP_LEVEL, state.shopLevel))] || fallback;
  }

  function currentDrinkShopChance() {
    return shopLevelChance(DRINK_SHOP_CHANCES, 0.15);
  }

  function currentToppingShopChance() {
    return shopLevelChance(TOPPING_SHOP_CHANCES, 0.22);
  }

  function currentItemShopChance() {
    return Math.min(0.95, currentDrinkShopChance() + currentToppingShopChance());
  }

  function currentShopkeeperSrc() {
    const index = Math.max(0, Math.min(SHOPKEEPER_LEVEL_SRCS.length - 1, state.shopLevel - 1));
    return SHOPKEEPER_LEVEL_SRCS[index] || SHOPKEEPER_SRC;
  }

  function shopRarityOdds() {
    const weights = currentShopRarityWeights();
    const total = Object.values(weights).reduce((sum, weight) => sum + Math.max(0, weight || 0), 0);
    return Object.fromEntries(
      Object.keys(RARITIES).map((id) => [
        id,
        total > 0 ? Number((((weights[id] || 0) / total) * 100).toFixed(1)) : 0,
      ])
    );
  }

  function shopUnit() {
    const sameLineChance = ownedItemMax("sameLineShopChancePct") + ownedAbilityMax("copy_luck", fortuneShopChance);
    const ownedTypes = [...new Set(allOwnedRefs().map((ref) => ref.unit.typeId))];
    if (ownedTypes.length && Math.random() < sameLineChance) {
      return makeUnit(ownedTypes[randInt(ownedTypes.length)]);
    }
    const rarity = chooseShopRarity();
    const pool = CATALOG.filter((unit) => (unit.rarity || "common") === rarity);
    const scoutTraits = state.arenaScout?.shopsRemaining > 0 ? state.arenaScout.traitIds || [] : [];
    const scoutPool = scoutTraits.length ? pool.filter((unit) => unit.traits?.some((traitId) => scoutTraits.includes(traitId))) : [];
    if (scoutPool.length && Math.random() < 0.75) {
      return makeUnit(scoutPool[randInt(scoutPool.length)].id);
    }
    const available = pool.length ? pool : CATALOG.filter((unit) => (unit.rarity || "common") === "common");
    return makeUnit(available[randInt(available.length)].id);
  }

  function shopEntry() {
    const drinkChance = currentDrinkShopChance();
    if (Math.random() < drinkChance) return shopDrink();
    const remainingChance = Math.max(0.0001, 1 - drinkChance);
    if (Math.random() < Math.min(1, currentToppingShopChance() / remainingChance)) return shopTopping();
    return shopUnit();
  }

  function shopItem() {
    const rarity = chooseShopRarity();
    const pool = ITEMS.filter((item) => (item.rarity || "common") === rarity);
    const available = pool.length ? pool : ITEMS.filter((item) => (item.rarity || "common") === "common");
    return weightedItemFrom(available);
  }

  function shopDrink() {
    const rarity = chooseShopRarity();
    const pool = ITEMS.filter((item) => isDrink(item) && (item.rarity || "common") === rarity);
    const available = pool.length ? pool : ITEMS.filter((item) => isDrink(item) && (item.rarity || "common") === "common");
    return weightedItemFrom(available);
  }

  function shopTopping() {
    const rarity = chooseShopRarity();
    const pool = ITEMS.filter((item) => isTopping(item) && (item.rarity || "common") === rarity);
    const available = pool.length ? pool : ITEMS.filter((item) => isTopping(item) && (item.rarity || "common") === "common");
    return weightedItemFrom(available);
  }

  function weightedItemFrom(available) {
    const total = available.reduce((sum, item) => sum + (item.shopWeight || 1), 0);
    let roll = Math.random() * total;
    for (const item of available) {
      roll -= item.shopWeight || 1;
      if (roll <= 0) return makeItem(item.id);
    }
    return makeItem(available[available.length - 1]?.id || "sunny_side_egg");
  }

  function chooseShopRarity() {
    const weights = currentShopRarityWeights();
    const entries = Object.values(RARITIES)
      .map((rarity) => ({ ...rarity, shopWeight: weights[rarity.id] || 0 }))
      .filter((rarity) => rarity.shopWeight > 0);
    const total = entries.reduce((sum, rarity) => sum + rarity.shopWeight, 0);
    if (total <= 0) return "common";
    let roll = Math.random() * total;
    for (const rarity of entries) {
      roll -= rarity.shopWeight;
      if (roll <= 0) return rarity.id;
    }
    return entries[entries.length - 1]?.id || "common";
  }

  function rarityInfo(rarityId) {
    return RARITIES[rarityId] || RARITIES.common;
  }

  function familyLabel(familyId) {
    return String(familyId || "meal")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function traitInfo(traitId) {
    return TRAITS[traitId] || {
      id: traitId,
      label: familyLabel(traitId),
      short: String(traitId || "?").slice(0, 3).toUpperCase(),
      color: "#8a6a3f",
      thresholds: [],
    };
  }

  function traitLabel(traitId) {
    return traitInfo(traitId).label;
  }

  function traitDisplayText(traitId) {
    return traitInfo(traitId).label;
  }

  function traitStageForCount(traitId, count) {
    return traitInfo(traitId).thresholds.reduce((stage, threshold) => count >= threshold.count ? stage + 1 : stage, 0);
  }

  function traitEffectText(traitId, stage) {
    if (stage <= 0) return "";
    if (traitId === "breakfast") {
      return stage >= 2 ? "Shield +9%; BRK haste +10%/2.5s" : "Team shield +5.5% max HP";
    }
    if (traitId === "bakery") return `Survivor: +${bakeryIncomeForStage(stage)} coins after battle`;
    if (traitId === "ocean") return stage >= 2 ? "Foes +0.30s CD; slow 2s" : "Foes +0.14s CD; slow 1.2s";
    if (traitId === "sweet") return `Support +${[0, 12, 22, 32][stage] || 32}%`;
    if (traitId === "spicy") return stage >= 2 ? "Attack +16%; burn 16% ATK" : "Attack +8%";
    if (traitId === "street_food") return `Attack speed +${[0, 8, 16, 26][stage] || 26}%`;
    if (traitId === "snack") return `First 3 hits +${stage >= 2 ? 22 : 12}%`;
    if (traitId === "fresh") return `Fresh support +${[0, 8, 14, 20][stage] || 20}%; statuses clear ${[0, 15, 25, 40][stage] || 40}% faster`;
    return traitInfo(traitId).thresholds[stage - 1]?.text || "";
  }

  function traitCountForUnits(units) {
    const counts = Object.fromEntries(Object.keys(TRAITS).map((id) => [id, 0]));
    units
      .filter((unit) => isUnit(unit) && !unit.ignoreTraits)
      .forEach((unit) => {
        (unit.traits || []).forEach((traitId) => {
          counts[traitId] = (counts[traitId] || 0) + 1;
        });
      });
    return counts;
  }

  function traitSnapshotForUnits(units) {
    const counts = traitCountForUnits(units);
    return Object.keys(TRAITS).map((id) => {
      const info = traitInfo(id);
      const count = counts[id] || 0;
      const stage = traitStageForCount(id, count);
      const next = info.thresholds.find((threshold) => count < threshold.count);
      return {
        id,
        label: info.label,
        short: info.short,
        color: info.color,
        count,
        stage,
        active: stage > 0,
        effect: traitEffectText(id, stage),
        nextAt: next?.count || null,
      };
    });
  }

  function compactTraitSnapshotForUnits(units) {
    return traitSnapshotForUnits(units)
      .filter((trait) => trait.count > 0)
      .sort((a, b) => (b.active - a.active) || b.stage - a.stage || b.count - a.count || a.label.localeCompare(b.label));
  }

  function activePlayerTraits() {
    return compactTraitSnapshotForUnits(state.board.filter(isUnit));
  }

  function visibleBattle() {
    return state.battle || (state.phase === "result" ? state.postCombatBattle : null);
  }

  function traitStageForUnits(units, traitId) {
    return traitStageForCount(traitId, traitCountForUnits(units)[traitId] || 0);
  }

  function battleTraitStage(side, traitId) {
    const traits = visibleBattle()?.traitLevels?.[side];
    if (traits) return traits[traitId]?.stage || 0;
    return traitStageForUnits(state.board.filter(isUnit), traitId);
  }

  function bakeryIncomeForStage(stage) {
    return [0, 6, 13, 22][stage] || 22;
  }

  function unitHasTrait(unit, traitId) {
    return Boolean(unit && !unit.ignoreTraits && unit.traits?.includes(traitId));
  }

  function activeTraitStage(unit, traitId) {
    if (!unitHasTrait(unit, traitId)) return 0;
    return battleTraitStage(unit.side || "ally", traitId);
  }

  function traitIncomeFromBattle() {
    if (!state.battle) return 0;
    const stage = state.battle.traitLevels?.ally?.bakery?.stage || 0;
    const hasSurvivingBakery = state.battle.allies.some((unit) => !unit.dead && unitHasTrait(unit, "bakery"));
    return hasSurvivingBakery ? bakeryIncomeForStage(stage) : 0;
  }

  function favoriteToppingFor(unit) {
    const favorite = FAVORITE_TOPPINGS[unit?.typeId];
    if (!favorite) return null;
    const item = itemInfo(favorite.itemId);
    return {
      itemId: favorite.itemId,
      itemName: item.name,
      itemShort: item.short,
      bonus: favorite.bonus,
      specs: favoriteToppingSpecLines(unit),
      technicalSpecs: favoriteToppingTechnicalSpecLines(unit),
      unlocked: hasFavoriteTopping(unit),
    };
  }

  function favoriteToppingPreviewItem(unit) {
    const favorite = FAVORITE_TOPPINGS[unit?.typeId];
    if (!favorite) return null;
    const source = itemInfo(favorite.itemId);
    if (!source) return null;
    const tier = hasFavoriteTopping(unit) ? itemTier(unit.item?.tier) : 1;
    return scaleItemForTier({ ...source, tier }, tier);
  }

  function favoriteToppingItemSpecLines(unit) {
    const item = favoriteToppingPreviewItem(unit);
    if (!item) return [];
    return itemSpecLines(item);
  }

  function favoriteToppingCompactSpecLine(unit) {
    const item = favoriteToppingPreviewItem(unit);
    return item ? `Topping: ${itemCompactSpecLine(item)}` : null;
  }

  function favoriteToppingTechnicalSpecLines(unit) {
    return favoriteToppingItemSpecLines(unit).map((line) => `Topping: ${line}`);
  }

  function favoriteToppingSpecLines(unit) {
    if (!unit) return [];
    const favorite = FAVORITE_TOPPINGS[unit.typeId];
    const comboSpecs = FAVORITE_COMBO_SPECS[unit.typeId] || (favorite?.bonus ? [`Combo: ${favorite.bonus}`] : []);
    return [...comboSpecs, ...favoriteToppingTechnicalSpecLines(unit)];
  }

  function hasFavoriteTopping(unit) {
    return Boolean(unit?.item && FAVORITE_TOPPINGS[unit.typeId]?.itemId === unit.item.id);
  }

  function favoriteToppingBonusPct(unit) {
    return hasFavoriteTopping(unit) ? 0.12 : 0;
  }

  function shieldCrackleDamage(unit) {
    if (!unit?.item?.shieldCrackleDamagePct) return 0;
    return Math.max(1, Math.round(unit.maxHp * unit.item.shieldCrackleDamagePct * (1 + favoriteToppingBonusPct(unit))));
  }

  function favoriteUsersForItem(itemId) {
    return CATALOG
      .filter((unit) => FAVORITE_TOPPINGS[unit.id]?.itemId === itemId)
      .map((unit) => unit.short);
  }

  function randomArenaId(excludeId = null) {
    const pool = ARENAS.filter((arena) => arena.id !== excludeId);
    const choices = pool.length ? pool : ARENAS;
    return choices[randInt(choices.length)].id;
  }

  function arenaInfo(arenaId) {
    return ARENAS.find((arena) => arena.id === arenaId) || ARENAS[0];
  }

  function currentArena() {
    return arenaInfo(state.arenaId);
  }

  function setArena(arenaId) {
    const arena = arenaInfo(arenaId);
    state.arenaId = arena.id;
    if (state.phase === "prep") state.message = arena.short;
    draw();
    return currentArena();
  }

  function arenaText(arena = currentArena()) {
    return {
      id: arena.id,
      name: arena.name,
      short: arena.short,
      mood: arena.mood,
      backgroundSrc: arena.backgroundSrc,
      effects: arena.effects.map((effect) => ({ ...effect })),
    };
  }

  function hasAnyTrait(unit, traits = []) {
    return traits.some((traitId) => unitHasTrait(unit, traitId));
  }

  function hasAnyFamily(unit, families = []) {
    return families.includes(unit?.family);
  }

  function arenaStatusDurationBonus(source) {
    if (!source) return 0;
    const arena = currentArena();
    if (arena.id === "spice_bazaar" && (hasAnyTrait(source, ["spicy"]) || hasAnyFamily(source, ["spice", "fermented"]))) return 0.16;
    if (arena.id === "frozen_parfait_peak" && hasAnyFamily(source, ["dairy"])) return 0.16;
    return 0;
  }

  function arenaStatusClearMultiplier(unit) {
    if (!unit) return 1;
    const arena = currentArena();
    return 1;
  }

  function arenaAttackClockBonus(unit) {
    if (!unit) return 0;
    const arena = currentArena();
    if (arena.id === "rainy_fish_market" && unitHasTrait(unit, "ocean")) return 0.08;
    if (arena.id === "street_festival" && hasAnyTrait(unit, ["street_food", "spicy", "snack"])) return 0.06;
    if (arena.id === "frozen_parfait_peak" && hasAnyTrait(unit, ["ocean", "street_food"])) return -0.06;
    return 0;
  }

  function arenaSupportMultiplier(unit) {
    if (!unit) return 1;
    const arena = currentArena();
    let multiplier = 1;
    if (arena.id === "spice_bazaar" && unitHasTrait(unit, "sweet")) multiplier *= 0.94;
    if (arena.id === "dim_sum_kitchen" && unitHasTrait(unit, "street_food")) multiplier *= 1.08;
    return multiplier;
  }

  function arenaDamageMultiplier(source, target, options = {}) {
    if (!source || !target) return 1;
    const arena = currentArena();
    let multiplier = 1;
    if (!options.status && arena.id === "rainy_fish_market" && unitHasTrait(source, "ocean") && target.col === BACK_COL) {
      multiplier *= 1.1;
    }
    if (!options.status && arena.id === "street_festival" && hasAnyTrait(source, ["street_food", "spicy", "snack"])) {
      if ((source.arenaFestivalHits || 0) < 3) {
        multiplier *= 1.1;
        source.arenaFestivalHits = (source.arenaFestivalHits || 0) + 1;
      }
    }
    if (arena.id === "spice_bazaar" && hasAnyTrait(source, ["spicy", "street_food"])) {
      multiplier *= options.status ? 1.1 : 1.06;
    }
    if (!options.status && arena.id === "frozen_parfait_peak" && unitHasTrait(source, "sweet") && (state.battle?.elapsed || 0) >= 6) {
      multiplier *= 1.1;
    }
    if (!options.status && arena.id === "dim_sum_kitchen" && unitHasTrait(source, "sweet") && source.col === BACK_COL) {
      multiplier *= 0.92;
    }
    if (!options.status && arena.id === "spice_bazaar" && unitHasTrait(target, "sweet")) {
      multiplier *= 1.04;
    }
    if (!options.status && arena.id === "street_festival" && target.col === FRONT_COL) {
      multiplier *= 1.06;
    }
    if (!options.status && arena.id === "dim_sum_kitchen" && target.col === FRONT_COL && hasAnyTrait(target, ["snack", "breakfast"])) {
      multiplier *= 0.9;
    }
    return multiplier;
  }

  function applyBattleStartArenaEffects(units, foes = []) {
    const arena = currentArena();
    if (arena.id === "sunny_breakfast_patio") {
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "breakfast")).forEach((unit) => {
        unit.haste = { remaining: 3, pct: 0.08 };
        burst({ x: unit.x, y: unit.y }, arena.color);
      });
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "bakery")).forEach((unit) => {
        grantShield(unit, Math.max(2, Math.round(unit.maxHp * 0.08)), { noShare: true });
        burst({ x: unit.x, y: unit.y }, arena.color);
      });
    } else if (arena.id === "rainy_fish_market") {
      if (units.some((unit) => !unit.dead && unitHasTrait(unit, "ocean"))) {
        foes.filter((foe) => !foe.dead).forEach((foe) => {
          foe.cooldown += 0.12;
          foe.slowed = { remaining: Math.max(foe.slowed?.remaining || 0, 1.1) };
          burst({ x: foe.x, y: foe.y }, arena.color);
        });
      }
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "bakery")).forEach((unit) => {
        unit.cooldown += 0.16;
      });
    } else if (arena.id === "frozen_parfait_peak") {
      units.filter((unit) => !unit.dead && unitHasTrait(unit, "sweet")).forEach((unit) => {
        grantShield(unit, Math.max(2, Math.round(unit.maxHp * 0.1)), { noShare: true });
        burst({ x: unit.x, y: unit.y }, arena.color);
      });
    }
  }

  function applyPendingArenaRewardBuff(units) {
    const buff = state.arenaPrepBuff;
    if (!buff) return;
    const target = units.find((unit) => !unit.dead && hasAnyTrait(unit, buff.traitIds || [])) || units.find((unit) => !unit.dead);
    if (target) {
      grantShield(target, Math.max(2, Math.round(target.maxHp * (buff.shieldPct || 0.12))), { noShare: true });
      target.haste = { remaining: buff.duration || 3, pct: buff.hastePct || 0.1 };
      target.attackBoost = { remaining: buff.duration || 3, pct: buff.attackPct || 0.08 };
      burst({ x: target.x, y: target.y }, arenaInfo(buff.arenaId).color);
      state.log.unshift(`${target.short} carried ${buff.arenaShort} prep`);
    }
    state.arenaPrepBuff = null;
  }

  function shopEntryForSlot(index) {
    if (!isShopSlotUnlocked(index)) return null;
    return state.shopFrozen[index] && state.shop[index] ? state.shop[index] : shopEntry();
  }

  function refreshShop(free = false) {
    const cost = currentRollCost();
    if (!free && state.gold < cost) return;
    if (!free) {
      if (state.freeRolls > 0) {
        state.freeRolls -= 1;
      } else {
        state.gold -= cost;
        state.rollsThisRound += 1;
      }
    }
    const previousSales = [...state.shopSales];
    state.shop = shopSlots.map((_, index) => shopEntryForSlot(index));
    state.shopSales = shopSlots.map((_, index) => {
      if (!isShopSlotUnlocked(index) || !state.shop[index]) return false;
      if (state.shopFrozen[index] && previousSales[index]) return true;
      return rollShopSlotSale(index, state.shop[index]);
    });
    state.shopFrozen = state.shopFrozen.map((frozen, index) => Boolean(isShopSlotUnlocked(index) && frozen && state.shop[index]));
    if (state.arenaScout?.shopsRemaining > 0) {
      state.arenaScout.shopsRemaining -= 1;
      if (state.arenaScout.shopsRemaining <= 0) state.arenaScout = null;
    }
    state.message = free ? currentArena().short : cost === 0 ? "Free roll" : `Rolled -${cost} coins`;
  }

  function purchaseShopSlot(index) {
    if (state.phase !== "prep") return false;
    if (index < 0 || index >= shopSlots.length) return false;
    if (isShopSlotUnlocked(index)) {
      state.message = "Slot open";
      return false;
    }
    const cost = shopSlotUnlockCost(index);
    if (state.gold < cost) {
      state.message = `Need ${cost} coins`;
      return false;
    }
    state.gold -= cost;
    openShopSlot(index);
    state.message = `Opened slot ${index + 1}`;
    state.log.unshift(`Opened shop slot ${index + 1}`);
    return true;
  }

  function firstLockedShopSlot() {
    return state.shopUnlocked.findIndex((unlocked) => !unlocked);
  }

  function openShopSlot(index) {
    if (index < 0 || index >= shopSlots.length) return false;
    if (isShopSlotUnlocked(index)) return false;
    state.shopUnlocked[index] = true;
    state.shopFrozen[index] = false;
    state.shop[index] = shopEntry();
    state.shopSales[index] = rollShopSlotSale(index, state.shop[index]);
    return true;
  }

  function startNextRoundShop() {
    state.rollsThisRound = 0;
    state.itemDiscountUsed = false;
    if (state.keepArenaNextRound) {
      state.keepArenaNextRound = false;
    } else {
      state.arenaId = randomArenaId(state.arenaId);
    }
    state.enemyPreview = null;
    refreshShop(true);
    ensureEnemyPreview();
  }

  function currentRollCost() {
    if (state.freeRolls > 0) return 0;
    return ECONOMY.rerollCostSteps.reduce((cost, step) => (state.rollsThisRound >= step.after ? step.cost : cost), ECONOMY.rollCost);
  }

  function upgradeShop() {
    if (state.phase !== "prep") return false;
    const cost = nextShopUpgradeCost();
    if (cost === null) {
      state.message = "Shop maxed";
      return false;
    }
    if (state.gold < cost) {
      state.message = "Need gold";
      return false;
    }
    state.gold -= cost;
    state.shopLevel = Math.min(MAX_SHOP_LEVEL, state.shopLevel + 1);
    state.nextShopUpgradeDiscountGold = 0;
    state.freeRolls += 1;
    const previousSales = [...state.shopSales];
    state.shop = shopSlots.map((_, index) => shopEntryForSlot(index));
    state.shopSales = shopSlots.map((_, index) => {
      if (!isShopSlotUnlocked(index) || !state.shop[index]) return false;
      if (state.shopFrozen[index] && previousSales[index]) return true;
      return rollShopSlotSale(index, state.shop[index]);
    });
    state.shopFrozen = state.shopFrozen.map((frozen, index) => Boolean(isShopSlotUnlocked(index) && frozen && state.shop[index]));
    state.message = "Odds up +1 roll";
    state.log.unshift(`Upgraded shop to level ${state.shopLevel}`);
    return true;
  }

  function firstEmptyBench() {
    return state.bench.findIndex((u) => !u);
  }

  function firstEmptyDrinkSlot() {
    return state.drinks.findIndex((u) => !u);
  }

  function itemBenchSlotKind(index) {
    return index < ITEM_BENCH_DRINK_SLOTS ? "drink" : "topping";
  }

  function itemBenchSlotAccepts(index, item) {
    return itemBenchSlotKind(index) === "drink" ? isDrink(item) : isTopping(item);
  }

  function itemStorageAccepts(area, index, item) {
    if (!isItem(item)) return false;
    if (area === "bench") return true;
    if (area === "itemBench") return itemBenchSlotAccepts(index, item);
    return false;
  }

  function isItemStorageArea(area) {
    return area === "bench" || area === "itemBench";
  }

  function itemStorageFullMessage(item) {
    if (isDrink(item)) return "Drink rack full";
    if (isTopping(item)) return "Topping rack full";
    return "Bench full";
  }

  function firstEmptyItemBenchSlot(item) {
    return state.itemBench.findIndex((entry, index) => !entry && itemBenchSlotAccepts(index, item));
  }

  function firstEmptyItemStorage(item) {
    const itemBenchIndex = firstEmptyItemBenchSlot(item);
    if (itemBenchIndex >= 0) return { area: "itemBench", index: itemBenchIndex };
    const benchIndex = firstEmptyBench();
    if (benchIndex >= 0) return { area: "bench", index: benchIndex };
    return null;
  }

  function moveItemToBench(item) {
    if (isUnit(item)) {
      const benchSpot = firstEmptyBench();
      if (benchSpot < 0) return false;
      state.bench[benchSpot] = item;
      return true;
    }
    const spot = firstEmptyItemStorage(item);
    if (!spot || !item) return false;
    state[spot.area][spot.index] = item;
    return true;
  }

  function allOwnedRefs() {
    const refs = [];
    state.bench.forEach((unit, index) => {
      if (isUnit(unit)) refs.push({ area: "bench", index, unit });
    });
    state.board.forEach((unit, index) => {
      if (isUnit(unit)) refs.push({ area: "board", index, unit });
    });
    return refs;
  }

  function placeRef(ref, unit) {
    state[ref.area][ref.index] = unit;
  }

  function allLooseItemRefs() {
    const refs = [];
    state.bench.forEach((entry, index) => {
      if (isItem(entry)) refs.push({ area: "bench", index, item: entry });
    });
    state.itemBench.forEach((entry, index) => {
      if (isItem(entry)) refs.push({ area: "itemBench", index, item: entry });
    });
    state.drinks.forEach((entry, index) => {
      if (isItem(entry)) refs.push({ area: "drinks", index, item: entry });
    });
    return refs;
  }

  function placeItemRef(ref, item) {
    state[ref.area][ref.index] = item;
  }

  function itemRefSlot(ref) {
    if (ref.area === "itemBench") return itemBenchSlots[ref.index];
    return ref.area === "drinks" ? drinkSlots[ref.index] : benchSlots[ref.index];
  }

  function itemMergeProgressCount(itemId, tier) {
    return allLooseItemRefs().filter((ref) => ref.item.id === itemId && itemTier(ref.item.tier) === itemTier(tier)).length;
  }

  function orderedItemMergeRefs(matches, item) {
    if (isDrink(item)) {
      return [...matches].sort((a, b) => (a.area === "drinks" ? 0 : 1) - (b.area === "drinks" ? 0 : 1));
    }
    return matches;
  }

  function mergeItemTriples(itemId, tier) {
    const matches = allLooseItemRefs().filter((ref) => ref.item.id === itemId && itemTier(ref.item.tier) === itemTier(tier));
    if (itemTier(tier) >= MAX_ITEM_TIER || matches.length < 3) return false;
    const ordered = orderedItemMergeRefs(matches, matches[0].item);
    const consumedRefs = ordered.slice(0, 3);
    const keeper = consumedRefs[0];
    consumedRefs.forEach((ref) => placeItemRef(ref, null));
    const evolved = makeItem(itemId, itemTier(tier) + 1);
    placeItemRef(keeper, evolved);
    const reward = ITEM_MERGE_GOLD_REWARD[evolved.tier] || 0;
    if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
    state.selected = null;
    state.drag = null;
    state.message = `${itemDisplayShort(evolved)} mixed${reward ? ` +${reward} coins` : ""}`;
    mergeExplosion(itemRefSlot(keeper), evolved);
    state.log.unshift(`${evolved.name} reached ${itemLevelLabel(evolved)}${reward ? ` and earned ${reward} coins` : ""}`);
    return true;
  }

  function itemMatchesMerge(item, target) {
    return isItem(item) && isItem(target) && item.id === target.id && itemTier(item.tier) === itemTier(target.tier) && itemTier(item.tier) < MAX_ITEM_TIER;
  }

  function itemMergeRefsWithIncoming(item, targetArea, targetIndex) {
    const target = state[targetArea]?.[targetIndex];
    if (!itemMatchesMerge(item, target)) return [];
    const matches = allLooseItemRefs().filter((ref) => itemMatchesMerge(item, ref.item));
    if (matches.length + 1 < 3) return [];
    const ordered = orderedItemMergeRefs(matches, item).sort((a, b) => {
      const aIsTarget = a.area === targetArea && a.index === targetIndex;
      const bIsTarget = b.area === targetArea && b.index === targetIndex;
      return aIsTarget === bIsTarget ? 0 : aIsTarget ? -1 : 1;
    });
    return ordered.slice(0, 2);
  }

  function unitMaxTier(unit) {
    return CATALOG.find((entry) => entry.id === unit?.typeId)?.forms.length || 1;
  }

  function unitMatchesMerge(unit, target) {
    return isUnit(unit) && isUnit(target) && unit.typeId === target.typeId && unit.tier === target.tier && unit.tier < unitMaxTier(unit);
  }

  function unitMergeRefsWithIncoming(unit, targetArea, targetIndex) {
    const target = state[targetArea]?.[targetIndex];
    if (!unitMatchesMerge(unit, target)) return [];
    const matches = allOwnedRefs().filter((ref) => unitMatchesMerge(unit, ref.unit));
    const actualProgressWithIncoming = matches.reduce((total, ref) => total + mergeProgressFor(ref), 1);
    if (actualProgressWithIncoming + fortunePhantomCopy(unit.typeId, unit.tier, actualProgressWithIncoming) < 3) return [];
    const ordered = matches.sort((a, b) => {
      const aIsTarget = a.area === targetArea && a.index === targetIndex;
      const bIsTarget = b.area === targetArea && b.index === targetIndex;
      return aIsTarget === bIsTarget ? 0 : aIsTarget ? -1 : 1;
    });
    const consumed = [];
    let progress = 1;
    for (const ref of ordered) {
      consumed.push(ref);
      progress += mergeProgressFor(ref);
      if (progress >= 3) break;
    }
    return progress >= 3 ? consumed : [];
  }

  function canMergeShopEntryIntoSlot(entry, targetArea, targetIndex) {
    const target = state[targetArea]?.[targetIndex];
    if (!target) return false;
    if (isItem(entry)) {
      if (isDrink(entry)) {
        if (targetArea !== "bench" && targetArea !== "drinks" && targetArea !== "itemBench") return false;
      } else if (targetArea !== "bench" && targetArea !== "itemBench") return false;
      if (targetArea === "itemBench" && !itemBenchSlotAccepts(targetIndex, entry)) return false;
      return itemMergeRefsWithIncoming(entry, targetArea, targetIndex).length >= 2;
    }
    if (targetArea !== "bench" && targetArea !== "board") return false;
    return unitMergeRefsWithIncoming(entry, targetArea, targetIndex).length > 0;
  }

  function hasShopMergeTarget(entry) {
    if (isItem(entry)) {
      const storageTargets = [
        ...state.bench.map((_, index) => ({ area: "bench", index })),
        ...state.itemBench.map((_, index) => ({ area: "itemBench", index })),
        ...state.drinks.map((_, index) => ({ area: "drinks", index })),
      ];
      return storageTargets.some((target) => canMergeShopEntryIntoSlot(entry, target.area, target.index));
    }
    return [...state.bench.map((_, index) => ({ area: "bench", index })), ...state.board.map((_, index) => ({ area: "board", index }))]
      .some((target) => canMergeShopEntryIntoSlot(entry, target.area, target.index));
  }

  function clearPurchasedShopSlot(shopIndex) {
    state.shop[shopIndex] = null;
    state.shopFrozen[shopIndex] = false;
    state.shopSales[shopIndex] = false;
  }

  function buyShopMergeIntoSlot(shopIndex, targetArea, targetIndex) {
    const entry = state.shop[shopIndex];
    if (!entry || !canMergeShopEntryIntoSlot(entry, targetArea, targetIndex)) return false;
    const cost = purchaseCost(entry, shopIndex);
    if (state.gold < cost) {
      state.message = "Need gold";
      return false;
    }
    state.gold -= cost;
    markItemDiscountUsed(entry, shopIndex, cost);
    clearPurchasedShopSlot(shopIndex);

    if (isItem(entry)) {
      const consumedRefs = itemMergeRefsWithIncoming(entry, targetArea, targetIndex);
      consumedRefs.forEach((ref) => placeItemRef(ref, null));
      const evolved = makeItem(entry.id, itemTier(entry.tier) + 1);
      const keeper = { area: targetArea, index: targetIndex };
      placeItemRef(keeper, evolved);
      const reward = ITEM_MERGE_GOLD_REWARD[evolved.tier] || 0;
      if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
      state.selected = null;
      state.drag = null;
      state.message = `${itemDisplayShort(evolved)} mixed${reward ? ` +${reward} coins` : ""}`;
      mergeExplosion(itemRefSlot(keeper), evolved);
      state.log.unshift(`${evolved.name} reached ${itemLevelLabel(evolved)}${reward ? ` and earned ${reward} coins` : ""}`);
      resolveItemMerges();
      return true;
    }

    const consumedRefs = unitMergeRefsWithIncoming(entry, targetArea, targetIndex);
    const keeperUnit = state[targetArea][targetIndex];
    const keeperItem = mergeItemIsConsumed(keeperUnit.item) ? null : cloneItem(keeperUnit.item);
    const extraItems = consumedRefs
      .filter((ref) => ref.area !== targetArea || ref.index !== targetIndex)
      .map((ref) => ref.unit.item)
      .filter((item) => item && !mergeItemIsConsumed(item))
      .map((item) => cloneItem(item));
    consumedRefs.forEach((ref) => placeRef(ref, null));
    const evolved = makeUnit(entry.typeId, entry.tier + 1);
    evolved.item = keeperItem;
    refreshUnitItemStats(evolved);
    placeRef({ area: targetArea, index: targetIndex }, evolved);
    extraItems.forEach((item) => moveItemToBench(item));
    const reward = MERGE_GOLD_REWARD[evolved.tier] || 0;
    if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
    state.selected = null;
    state.drag = null;
    state.message = `${evolved.short} evolved${reward ? ` +${reward} coins` : ""}`;
    mergeExplosion(targetArea === "board" ? boardSlots[targetIndex] : benchSlots[targetIndex], evolved);
    state.log.unshift(`${evolved.name} reached ${evolved.tier} stars${reward ? ` and earned ${reward} coins` : ""}`);
    resolveItemMerges();
    resolveMerges();
    return true;
  }

  function mergeProgressFor(ref) {
    const bonus = ref.area === "bench" ? ref.unit?.item?.mergeProgressBonus || 0 : 0;
    return 1 + bonus;
  }

  function mergeProgressCount(typeId, tier) {
    const actual = allOwnedRefs()
      .filter((ref) => ref.unit.typeId === typeId && ref.unit.tier === tier)
      .reduce((total, ref) => total + mergeProgressFor(ref), 0);
    return actual + fortunePhantomCopy(typeId, tier, actual);
  }

  function mergeItemIsConsumed(item) {
    return Boolean(item?.mergeProgressBonus);
  }

  function selectMergeRefs(matches) {
    const consumed = [];
    let progress = 0;
    for (const ref of matches) {
      consumed.push(ref);
      progress += mergeProgressFor(ref);
      if (progress >= 3) break;
    }
    return consumed;
  }

  function fortunePhantomCopy(typeId, tier, actualProgress) {
    if (actualProgress <= 0 || actualProgress >= 3) return 0;
    return allOwnedRefs().some((ref) => ref.unit.ability === "copy_luck" && ref.unit.typeId === typeId && ref.unit.tier === tier && ref.unit.tier >= 2)
      ? 1
      : 0;
  }

  function mergeTriples(typeId, tier) {
    const matches = allOwnedRefs().filter((ref) => ref.unit.typeId === typeId && ref.unit.tier === tier);
    const base = CATALOG.find((unit) => unit.id === typeId);
    const maxTier = base?.forms.length || 1;
    if (tier >= maxTier || mergeProgressCount(typeId, tier) < 3) return false;
    const consumedRefs = selectMergeRefs(matches);
    const keeper = matches[0];
    const keeperItem = mergeItemIsConsumed(keeper.unit.item) ? null : cloneItem(keeper.unit.item);
    const extraItems = consumedRefs
      .slice(1)
      .map((ref) => ref.unit.item)
      .filter((item) => item && !mergeItemIsConsumed(item))
      .map((item) => cloneItem(item));
    consumedRefs.forEach((ref) => placeRef(ref, null));
    const evolved = makeUnit(typeId, tier + 1);
    evolved.item = keeperItem;
    refreshUnitItemStats(evolved);
    placeRef(keeper, evolved);
    extraItems.forEach((item) => moveItemToBench(item));
    const reward = MERGE_GOLD_REWARD[evolved.tier] || 0;
    if (reward) state.gold = Math.min(ECONOMY.maxGold, state.gold + reward);
    state.selected = null;
    state.drag = null;
    state.message = `${evolved.short} evolved${reward ? ` +${reward} coins` : ""}`;
    mergeExplosion(keeper.area === "board" ? boardSlots[keeper.index] : benchSlots[keeper.index], evolved);
    state.log.unshift(`${evolved.name} reached ${tier + 1} stars${reward ? ` and earned ${reward} coins` : ""}`);
    resolveItemMerges();
    return true;
  }

  function resolveMerges() {
    let changed = true;
    while (changed) {
      changed = false;
      for (const unit of allOwnedRefs().map((ref) => ref.unit)) {
        if (unit && mergeTriples(unit.typeId, unit.tier)) {
          changed = true;
          break;
        }
      }
    }
  }

  function resolveItemMerges() {
    let changed = true;
    while (changed) {
      changed = false;
      for (const item of allLooseItemRefs().map((ref) => ref.item)) {
        if (item && mergeItemTriples(item.id, item.tier)) {
          changed = true;
          break;
        }
      }
    }
  }

  function buyShop(index) {
    const entry = state.shop[index];
    if (isItem(entry)) {
      const spot = firstEmptyItemStorage(entry);
      return spot ? buyShopToSlot(index, spot.area, spot.index) : false;
    }
    const spot = firstEmptyBench();
    return buyShopToBench(index, spot);
  }

  function buyShopToBench(shopIndex, benchIndex) {
    return buyShopToSlot(shopIndex, "bench", benchIndex);
  }

  function buyShopToSlot(shopIndex, targetArea, targetIndex) {
    if (state.phase !== "prep") return false;
    if (!isShopSlotUnlocked(shopIndex)) {
      state.message = "Open slot first";
      return false;
    }
    const entry = state.shop[shopIndex];
    if (!entry) {
      state.message = "Empty shop";
      return false;
    }
    const cost = purchaseCost(entry, shopIndex);
    if (state.gold < cost) {
      state.message = "Need gold";
      return false;
    }
    if (isItem(entry)) {
      if (isDrink(entry)) {
        if (targetArea !== "bench" && targetArea !== "drinks" && targetArea !== "itemBench") {
          state.message = "Drop drinks on rails";
          return false;
        }
      } else if (targetArea !== "bench" && targetArea !== "itemBench") {
        state.message = "Store toppings on bench";
        return false;
      }
      if (targetArea === "itemBench" && !itemBenchSlotAccepts(targetIndex, entry)) {
        state.message = isDrink(entry) ? "Drink slots only" : "Topping slots only";
        return false;
      }
    }
    if (isUnit(entry) && targetArea !== "bench" && targetArea !== "board") {
      state.message = "Drop on grid";
      return false;
    }
    if (targetIndex < 0 || targetIndex >= state[targetArea].length) {
      state.message = "Drop on grid";
      return false;
    }
    if (state[targetArea][targetIndex]) {
      if (buyShopMergeIntoSlot(shopIndex, targetArea, targetIndex)) return true;
      state.message = "Spot full";
      return false;
    }
    state.gold -= cost;
    markItemDiscountUsed(entry, shopIndex, cost);
    state[targetArea][targetIndex] = entry;
    clearPurchasedShopSlot(shopIndex);
    state.message = isDrink(entry) && targetArea === "drinks" ? `${entry.short} poured` : `${entry.short} bought`;
    if (isUnit(entry)) resolveMerges();
    if (isItem(entry)) resolveItemMerges();
    return true;
  }

  function buyShopItemToAnimal(shopIndex, targetArea, targetIndex) {
    if (state.phase !== "prep") return false;
    if (!isShopSlotUnlocked(shopIndex)) {
      state.message = "Open slot first";
      return false;
    }
    const item = state.shop[shopIndex];
    const unit = state[targetArea]?.[targetIndex];
    if (!isTopping(item)) {
      state.message = "Pick a topping";
      return false;
    }
    const cost = purchaseCost(item, shopIndex);
    if (state.gold < cost) {
      state.message = "Need gold";
      return false;
    }
    if (targetArea !== "bench" && targetArea !== "board") {
      state.message = "Drop on animal";
      return false;
    }
    if (!isUnit(unit)) {
      state.message = "Drop on animal";
      return false;
    }
    if (unit.item) {
      state.message = "Already topped";
      return false;
    }
    state.gold -= cost;
    markItemDiscountUsed(item, shopIndex, cost);
    unit.item = item;
    refreshUnitItemStats(unit);
    state.shop[shopIndex] = null;
    state.shopFrozen[shopIndex] = false;
    state.shopSales[shopIndex] = false;
    state.selected = { area: targetArea, index: targetIndex };
    state.message = `${unit.short} topped`;
    return true;
  }

  function buyShopItemToEquipment(shopIndex) {
    const target = selectedEquipmentTargetRef(state.drag);
    if (!target) {
      state.message = "Select animal";
      return false;
    }
    return buyShopItemToAnimal(shopIndex, target.area, target.index);
  }

  function hasShopItemTarget(item) {
    if (isDrink(item)) return firstEmptyItemStorage(item) || firstEmptyDrinkSlot() >= 0 || hasShopMergeTarget(item);
    return (
      firstEmptyItemStorage(item) ||
      hasShopMergeTarget(item) ||
      state.bench.some((entry) => isUnit(entry) && !entry.item) ||
      state.board.some((entry) => isUnit(entry) && !entry.item)
    );
  }

  function toggleShopFreeze(index) {
    if (state.phase !== "prep") return false;
    if (!isShopSlotUnlocked(index)) {
      state.message = "Open slot first";
      return false;
    }
    if (!state.shop[index]) {
      state.message = "Empty shop";
      return false;
    }
    state.shopFrozen[index] = !state.shopFrozen[index];
    state.message = state.shopFrozen[index] ? `${entryLabel(state.shop[index])} locked` : `${entryLabel(state.shop[index])} unlocked`;
    return true;
  }

  function sellSelectedUnit() {
    const ref = getSelectedRef();
    if (!ref || state.phase !== "prep") return false;
    if (ref.area !== "bench" && ref.area !== "board") {
      state.message = "Owned units only";
      return false;
    }
    if (!isUnit(ref.entry)) {
      state.message = "Sell animals only";
      return false;
    }
    return sellOwnedUnit(ref.area, ref.index);
  }

  function sellSelectedItem() {
    const ref = getSelectedRef();
    if (!ref || state.phase !== "prep") return false;
    if (ref.area !== "bench" && ref.area !== "itemBench" && ref.area !== "drinks") {
      state.message = "Owned items only";
      return false;
    }
    if (!isItem(ref.entry)) {
      state.message = "Sell toppings only";
      return false;
    }
    return sellOwnedItem(ref.area, ref.index);
  }

  function attachItemFromStorage(sourceArea, itemIndex, targetArea, targetIndex) {
    if (state.phase !== "prep") return false;
    const item = state[sourceArea]?.[itemIndex];
    const unit = state[targetArea]?.[targetIndex];
    if (!isTopping(item)) {
      state.message = "Pick a topping";
      return false;
    }
    if (!isUnit(unit)) {
      state.message = "Drop on animal";
      return false;
    }
    if (unit.item) {
      state.message = "Already topped";
      return false;
    }
    state[sourceArea][itemIndex] = null;
    unit.item = item;
    refreshUnitItemStats(unit);
    state.selected = { area: targetArea, index: targetIndex };
    state.message = `${unit.short} topped`;
    return true;
  }

  function attachItemFromBench(itemIndex, targetArea, targetIndex) {
    return attachItemFromStorage("bench", itemIndex, targetArea, targetIndex);
  }

  function attachItemFromBenchToEquipment(itemIndex, sourceArea = state.drag?.area || "bench", drag = state.drag) {
    const target = selectedEquipmentTargetRef(drag);
    if (!target) {
      state.message = "Select animal";
      return false;
    }
    return attachItemFromStorage(sourceArea, itemIndex, target.area, target.index);
  }

  function moveEquippedItemToStorage(targetArea, targetIndex) {
    const source = selectedEquipmentTargetRef(state.drag);
    if (!source?.unit?.item || state.phase !== "prep") return false;
    const item = source.unit.item;
    if (!itemStorageAccepts(targetArea, targetIndex, item)) {
      state.message = isDrink(item) ? "Drink slots only" : "Topping slots only";
      return false;
    }
    if (state[targetArea][targetIndex]) {
      state.message = "Bench spot full";
      return false;
    }
    source.unit.item = null;
    refreshUnitItemStats(source.unit);
    state[targetArea][targetIndex] = item;
    state.selected = { area: targetArea, index: targetIndex };
    state.message = `${source.unit.short} untopped`;
    resolveItemMerges();
    return true;
  }

  function moveEquippedItemToBench(benchIndex) {
    return moveEquippedItemToStorage("bench", benchIndex);
  }

  function moveEquippedItemToAnimal(targetArea, targetIndex) {
    const source = selectedEquipmentTargetRef(state.drag);
    const target = state[targetArea]?.[targetIndex];
    if (!source?.unit?.item || state.phase !== "prep") return false;
    if (!isUnit(target)) {
      state.message = "Drop on animal";
      return false;
    }
    if (target.item) {
      state.message = "Already topped";
      return false;
    }
    if (source.area === targetArea && source.index === targetIndex) {
      state.message = "Equipped";
      return false;
    }
    const item = source.unit.item;
    source.unit.item = null;
    refreshUnitItemStats(source.unit);
    target.item = item;
    refreshUnitItemStats(target);
    state.selected = { area: targetArea, index: targetIndex };
    state.message = `${target.short} topped`;
    return true;
  }

  function placeDrinkFromStorage(sourceArea, itemIndex, drinkIndex) {
    if (state.phase !== "prep") return false;
    const item = state[sourceArea]?.[itemIndex];
    if (!isDrink(item)) {
      state.message = "Pick a drink";
      return false;
    }
    if (!drinkSlots[drinkIndex]) {
      state.message = "Drop on drink rail";
      return false;
    }
    if (state.drinks[drinkIndex]) {
      state.message = "Drink slot full";
      return false;
    }
    state[sourceArea][itemIndex] = null;
    state.drinks[drinkIndex] = item;
    state.selected = { area: "drinks", index: drinkIndex };
    state.message = `${item.short} poured`;
    resolveItemMerges();
    return true;
  }

  function placeDrinkFromBench(itemIndex, drinkIndex) {
    return placeDrinkFromStorage("bench", itemIndex, drinkIndex);
  }

  function detachSelectedItem() {
    const ref = getSelectedRef();
    if (!ref || state.phase !== "prep" || !isUnit(ref.entry) || !ref.unit.item) return false;
    const spot = firstEmptyItemStorage(ref.unit.item);
    if (!spot) {
      state.message = itemStorageFullMessage(ref.unit.item);
      return false;
    }
    state[spot.area][spot.index] = ref.unit.item;
    ref.unit.item = null;
    refreshUnitItemStats(ref.unit);
    state.message = `${ref.unit.short} untopped`;
    resolveItemMerges();
    return true;
  }

  function sellValue(unit) {
    return (ECONOMY.sellValues[unit?.tier] || ECONOMY.sellValues[1]) + (unit?.item?.sellBonusGold || 0);
  }

  function itemSellValue(item) {
    const itemCopies = 3 ** (itemTier(item?.tier) - 1);
    return Math.max(1, Math.floor((entryCost(item) * itemCopies) / 2));
  }

  function sellOwnedUnit(area, index) {
    if (state.phase !== "prep") return false;
    const unit = state[area]?.[index];
    if (!isUnit(unit)) {
      state.message = "Sell animals only";
      return false;
    }
    if (unit.item && area !== "bench" && firstEmptyItemStorage(unit.item) === null) {
      state.message = itemStorageFullMessage(unit.item);
      return false;
    }
    const value = sellValue(unit);
    const item = unit.item;
    state[area][index] = null;
    if (item) moveItemToBench(item);
    state.selected = null;
    state.gold = Math.min(ECONOMY.maxGold, state.gold + value);
    state.message = `${unit.short} sold +${value} coins`;
    state.log.unshift(`Sold ${unit.name} for ${value} coins`);
    return true;
  }

  function sellOwnedItem(area, index) {
    if (state.phase !== "prep") return false;
    const item = state[area]?.[index];
    if (!isItem(item)) {
      state.message = "Sell items only";
      return false;
    }
    const value = itemSellValue(item);
    state[area][index] = null;
    state.selected = null;
    state.gold = Math.min(ECONOMY.maxGold, state.gold + value);
    state.message = `${item.short} sold +${value} coins`;
    state.log.unshift(`Sold ${item.name} for ${value} coins`);
    return true;
  }

  function sellEquippedItem(drag) {
    if (state.phase !== "prep") return false;
    const source = selectedEquipmentTargetRef(drag);
    if (!source?.unit?.item) {
      state.message = "No topping";
      return false;
    }
    const item = source.unit.item;
    const value = itemSellValue(item);
    source.unit.item = null;
    refreshUnitItemStats(source.unit);
    state.selected = { area: source.area, index: source.index };
    state.gold = Math.min(ECONOMY.maxGold, state.gold + value);
    state.message = `${item.short} sold +${value} coins`;
    state.log.unshift(`Sold ${item.name} for ${value} coins`);
    return true;
  }

  function canSellDrag(drag) {
    if (!drag || state.phase !== "prep" || drag.area === "shop") return false;
    if (drag.area === "equipment") return isItem(drag.unit);
    if (drag.area === "board") return isUnit(state.board[drag.index]);
    if (drag.area === "drinks") return isItem(state.drinks[drag.index]);
    if (drag.area === "itemBench") return isItem(state.itemBench[drag.index]);
    if (drag.area === "bench") return Boolean(state.bench[drag.index]);
    return false;
  }

  function dragSellValue(drag) {
    if (!canSellDrag(drag)) return 0;
    const entry = drag.area === "equipment" ? selectedEquipmentTargetRef(drag)?.unit?.item : state[drag.area]?.[drag.index];
    if (isUnit(entry)) return sellValue(entry);
    if (isItem(entry)) return itemSellValue(entry);
    return 0;
  }

  function sellDraggedEntry(drag) {
    if (!canSellDrag(drag)) {
      state.message = "Cannot sell";
      return false;
    }
    if (drag.area === "equipment") return sellEquippedItem(drag);
    const entry = state[drag.area]?.[drag.index];
    if (isUnit(entry)) return sellOwnedUnit(drag.area, drag.index);
    if (isItem(entry)) return sellOwnedItem(drag.area, drag.index);
    state.message = "Cannot sell";
    return false;
  }

  function selectFrom(area, index) {
    const entry = state[area][index];
    if (area === "shop") {
      state.selected = entry ? { area, index } : null;
      return;
    }
    if (state.selected?.area === "shop") {
      state.selected = entry ? { area, index } : null;
      return;
    }
    if (!entry) {
      if (state.selected) moveSelected(area, index);
      return;
    }
    if (state.selected && state.selected.area !== area) {
      moveSelected(area, index);
      return;
    }
    state.selected = { area, index };
  }

  function moveSelected(area, index) {
    if (!state.selected || state.phase !== "prep") return;
    const from = state.selected;
    if (from.area === "shop") {
      state.selected = null;
      state.message = "Drag to buy";
      return;
    }
    const moving = state[from.area][from.index];
    if (!moving) {
      state.selected = null;
      return;
    }
    if (from.area === "bench" && area === "bench" && from.index !== index) {
      moveUnitToOpenSlot(from.area, from.index, area, index);
      return;
    }
    if (isItem(moving)) {
      if (isDrink(moving) && isItemStorageArea(from.area) && area === "drinks") {
        placeDrinkFromStorage(from.area, from.index, index);
        return;
      }
      if (isDrink(moving) && from.area === "drinks" && area === "drinks" && !state.drinks[index]) {
        state.drinks[index] = moving;
        state.drinks[from.index] = null;
        state.selected = null;
        state.message = `${moving.short} moved`;
        resolveItemMerges();
        return;
      }
      if (isItemStorageArea(area)) {
        const target = state[area][index];
        if (!itemStorageAccepts(area, index, moving)) {
          state.message = isDrink(moving) ? "Drink slots only" : "Topping slots only";
          return;
        }
        if (target && !isItem(target)) {
          state.message = "Spot full";
          return;
        }
        state[area][index] = moving;
        state[from.area][from.index] = null;
        if (target && isItemStorageArea(from.area) && itemStorageAccepts(from.area, from.index, target)) {
          state[from.area][from.index] = target;
        } else if (target) {
          const spot = firstEmptyItemStorage(target);
          if (!spot) {
            state[area][index] = target;
            state[from.area][from.index] = moving;
            state.message = itemStorageFullMessage(target);
            return;
          }
          state[spot.area][spot.index] = target;
        }
        state.selected = null;
        state.message = target ? "Bench swapped" : isDrink(moving) ? "Drink stored" : "Topping stored";
        resolveItemMerges();
        return;
      }
      if (isDrink(moving)) {
        state.message = "Drop on drink rail";
        return;
      }
      attachItemFromStorage(from.area, from.index, area, index);
      return;
    }
    if (area !== "bench" && area !== "board") {
      state.message = "Drop on board";
      return;
    }
    const target = state[area][index];
    if (isItem(target)) {
      state.message = "Spot full";
      return;
    }
    state[area][index] = moving;
    state[from.area][from.index] = target;
    state.selected = null;
    state.message = "Set";
    resolveMerges();
  }

  function moveUnitToOpenSlot(fromArea, fromIndex, toArea, toIndex) {
    if (state.phase !== "prep") return false;
    const moving = state[fromArea]?.[fromIndex];
    if (!moving) return false;
    if (isItem(moving)) {
      if (isDrink(moving) && toArea === "drinks") {
        if (isItemStorageArea(fromArea)) return placeDrinkFromStorage(fromArea, fromIndex, toIndex);
        if (fromArea === "drinks" && !state.drinks[toIndex]) {
          state.drinks[toIndex] = moving;
          state.drinks[fromIndex] = null;
          state.selected = null;
          state.message = `${moving.short} moved`;
          resolveItemMerges();
          return true;
        }
        state.message = "Drink slot full";
        return false;
      }
      if (!isItemStorageArea(toArea)) {
        state.message = isDrink(moving) ? "Drop on drink rail" : "Toppings stay on bench";
        return false;
      }
      if (fromArea === toArea && fromIndex === toIndex) {
        state.message = isDrink(moving) ? "Drink stored" : "Topping stored";
        return false;
      }
      if (!itemStorageAccepts(toArea, toIndex, moving)) {
        state.message = isDrink(moving) ? "Drink slots only" : "Topping slots only";
        return false;
      }
      const target = state[toArea][toIndex];
      if (target && !isItem(target)) {
        state.message = "Spot full";
        return false;
      }
      if (isItemStorageArea(fromArea) && (!target || itemStorageAccepts(fromArea, fromIndex, target))) {
        state[toArea][toIndex] = moving;
        state[fromArea][fromIndex] = target;
        state.selected = null;
        state.message = target ? "Bench swapped" : isDrink(moving) ? "Drink stored" : "Topping stored";
        resolveItemMerges();
        return true;
      }
      if (target) {
        const spot = firstEmptyItemStorage(target);
        if (!spot) {
          state.message = itemStorageFullMessage(target);
          return false;
        }
        state[spot.area][spot.index] = target;
      }
      state[toArea][toIndex] = moving;
      state[fromArea][fromIndex] = null;
      state.selected = null;
      state.message = isDrink(moving) ? "Drink stored" : "Topping stored";
      resolveItemMerges();
      return true;
    }
    if (toArea !== "bench" && toArea !== "board") {
      state.message = "Drop on board";
      return false;
    }
    if (fromArea === toArea && fromIndex === toIndex) {
      state.message = "Set";
      return false;
    }
    const target = state[toArea][toIndex];
    if (fromArea === "bench" && toArea === "bench") {
      state.bench[toIndex] = moving;
      state.bench[fromIndex] = target;
      state.selected = null;
      state.message = target ? "Bench swapped" : "Set";
      resolveMerges();
      return true;
    }
    if (target) {
      if (
        (fromArea === "bench" && toArea === "board" && isUnit(target)) ||
        (fromArea === "board" && toArea === "board" && isUnit(target))
      ) {
        state.board[toIndex] = moving;
        state[fromArea][fromIndex] = target;
        state.selected = null;
        state.message = "Swapped";
        resolveMerges();
        return true;
      }
      state.message = "Spot full";
      return false;
    }
    state[toArea][toIndex] = moving;
    state[fromArea][fromIndex] = null;
    state.selected = null;
    state.message = "Set";
    resolveMerges();
    return true;
  }

  function teamPower() {
    return state.board.reduce((sum, unit) => sum + (isUnit(unit) ? unit.tier : 0), 0);
  }

  function playerBoardPowerScore() {
    const boardUnits = (state?.board || []).filter(isUnit);
    const boardTierScore = boardUnits.reduce((sum, unit) => sum + (unit.tier || 1), 0);
    const equippedItemScore = boardUnits.reduce((sum, unit) => sum + (unit.item ? itemTier(unit.item.tier) * 0.55 : 0), 0);
    const drinkScore = (state?.drinks || []).filter(isDrink).reduce((sum, drink) => sum + itemTier(drink.tier) * 0.45, 0);
    const traitScore = traitSnapshotForUnits(boardUnits).reduce((sum, trait) => sum + (trait.stage || 0) * 0.35, 0);
    const permanentHpScore = boardUnits.reduce((sum, unit) => sum + Math.min(1.6, (unit.permanentHpBonus || 0) / 90), 0);
    return boardTierScore + equippedItemScore + drinkScore + traitScore + permanentHpScore;
  }

  function expectedPlayerPowerForRound(round) {
    return Math.min(34, 2.6 + round * 1.1);
  }

  function enemyAdaptivePressure(round) {
    const overage = playerBoardPowerScore() - expectedPlayerPowerForRound(round);
    return clamp(overage / 18, 0, 0.36);
  }

  function enemyLatePressure(round) {
    return Math.max(0, round - 12);
  }

  function makeEnemyPlan(round = state.round) {
    const primaryArchetype = chooseEnemyArchetype(round);
    const secondaryArchetype = chooseEnemySecondaryArchetype(round, primaryArchetype);
    const archetype = blendEnemyArchetypes(primaryArchetype, secondaryArchetype);
    const themeTrait = Math.random() < (archetype.traitFocus || 0) ? chooseEnemyThemeTrait() : null;
    const baseCount = Math.min(boardSlots.length, 2 + Math.floor(round / 2));
    const countBias = stochasticRound(archetype.countBias || 0);
    const count = Math.max(1, Math.min(boardSlots.length, baseCount + countBias + enemyCountJitter(round)));
    const rarityWeights = enemyRarityWeights(round, archetype);
    const adaptivePressure = enemyAdaptivePressure(round);
    const latePressure = enemyLatePressure(round);
    return {
      round,
      archetypeId: archetype.id,
      archetypeLabel: archetype.label,
      primaryArchetypeId: primaryArchetype.id,
      primaryArchetypeLabel: primaryArchetype.label,
      secondaryArchetypeId: secondaryArchetype.id,
      secondaryArchetypeLabel: secondaryArchetype.label,
      themeTrait,
      count,
      rarityWeights,
      targetExtraTier: enemyTargetExtraTier(round, archetype, adaptivePressure),
      tier3Chance: enemyTier3Chance(round, archetype, adaptivePressure),
      tier4Chance: enemyTier4Chance(round, archetype, adaptivePressure),
      hpMultiplier: Math.max(0.55, 0.72 + round * 0.045 + latePressure * 0.018 + adaptivePressure * 0.22 + (archetype.statBias || 0)),
      atkMultiplier: Math.max(0.55, 0.75 + round * 0.04 + latePressure * 0.012 + adaptivePressure * 0.16 + (archetype.statBias || 0)),
      toppingCount: enemySupportCount(round, count, 3, archetype.itemBias || 0),
      drinkCount: enemySupportCount(round, drinkSlots.length, 4, archetype.drinkBias || 0),
      adaptivePressure,
    };
  }

  function chooseEnemyArchetype(round) {
    const options = ENEMY_ARCHETYPES.filter((archetype) => round >= (archetype.minRound || 1));
    return weightedChoice(options, (archetype) => archetype.weight || 1) || ENEMY_ARCHETYPES[0];
  }

  function chooseEnemySecondaryArchetype(round, primaryArchetype) {
    const options = ENEMY_ARCHETYPES.filter((archetype) => archetype.id !== primaryArchetype?.id && round >= (archetype.minRound || 1));
    return weightedChoice(options, (archetype) => Math.max(1, archetype.weight || 1)) || primaryArchetype || ENEMY_ARCHETYPES[0];
  }

  function blendEnemyArchetypes(primaryArchetype, secondaryArchetype) {
    const primary = primaryArchetype || ENEMY_ARCHETYPES[0];
    const secondary = secondaryArchetype || primary;
    const hasSecondary = secondary.id !== primary.id;
    const primaryShare = hasSecondary ? ENEMY_ARCHETYPE_PRIMARY_SHARE : 1;
    const secondaryShare = hasSecondary ? 1 - ENEMY_ARCHETYPE_PRIMARY_SHARE : 0;
    const blended = {
      id: hasSecondary ? `${primary.id}_${secondary.id}` : primary.id,
      label: hasSecondary ? `${primary.label} + ${secondary.label}` : primary.label,
      countBias: blendedEnemyBias(primary, secondary, "countBias", primaryShare, secondaryShare, -1, 1),
      tierBias: blendedEnemyBias(primary, secondary, "tierBias", primaryShare, secondaryShare, -0.16, 0.16),
      tier3Bias: blendedEnemyBias(primary, secondary, "tier3Bias", primaryShare, secondaryShare, -0.06, 0.07),
      statBias: blendedEnemyBias(primary, secondary, "statBias", primaryShare, secondaryShare, -0.05, 0.05),
      itemBias: blendedEnemyBias(primary, secondary, "itemBias", primaryShare, secondaryShare, -1, 1),
      drinkBias: blendedEnemyBias(primary, secondary, "drinkBias", primaryShare, secondaryShare, -1, 1),
      traitFocus: blendedEnemyBias(primary, secondary, "traitFocus", primaryShare, secondaryShare, 0.18, 0.72),
      rarityBias: blendedEnemyBias(
        { rarityBias: enemyArchetypeRarityBias(primary) },
        { rarityBias: enemyArchetypeRarityBias(secondary) },
        "rarityBias",
        primaryShare,
        secondaryShare,
        -1,
        1
      ),
    };
    return blended;
  }

  function blendedEnemyBias(primary, secondary, key, primaryShare, secondaryShare, min, max) {
    const base = (primary[key] || 0) * primaryShare + (secondary[key] || 0) * secondaryShare;
    return clamp(base + enemyArchetypeNoise(key), min, max);
  }

  function enemyArchetypeNoise(key) {
    const range = ENEMY_ARCHETYPE_NOISE[key] || 0;
    return (Math.random() * 2 - 1) * range;
  }

  function enemyArchetypeRarityBias(archetype) {
    if (archetype?.id === "loaded" || archetype?.id === "elite") return 1;
    if (archetype?.id === "swarm") return -1;
    return 0;
  }

  function chooseEnemyThemeTrait() {
    const arenaTraits = arenaRewardTraits().filter((traitId) => TRAITS[traitId]);
    const allTraits = Object.keys(TRAITS);
    const pool = Math.random() < 0.68 && arenaTraits.length ? arenaTraits : allTraits;
    return pool[randInt(pool.length)] || null;
  }

  function enemyCountJitter(round) {
    if (round <= 1) return 0;
    const roll = Math.random();
    if (roll < 0.18) return -1;
    if (roll > 0.78) return 1;
    return 0;
  }

  function enemyTargetExtraTier(round, archetype, adaptivePressure = 0) {
    return clamp(Math.min(0.72, round * 0.055) + enemyLatePressure(round) * 0.018 + adaptivePressure * 0.45 + (archetype.tierBias || 0), 0, 1.18);
  }

  function enemyTier3Chance(round, archetype, adaptivePressure = 0) {
    if (round < 7 && adaptivePressure < 0.15) return 0;
    return clamp((round - 6) * 0.018 + adaptivePressure * 0.12 + (archetype.tier3Bias || 0), 0, 0.34);
  }

  function enemyTier4Chance(round, archetype, adaptivePressure = 0) {
    if (round < 13 && adaptivePressure < 0.28) return 0;
    return clamp((round - 12) * 0.01 + adaptivePressure * 0.1 + (archetype.tier3Bias || 0) * 0.5, 0, 0.18);
  }

  function enemyTierForPlan(plan) {
    const tier4Chance = Math.min(plan.tier4Chance || 0, plan.targetExtraTier / 3);
    const remainingExtraTier = Math.max(0, plan.targetExtraTier - tier4Chance * 3);
    const tier3Chance = Math.min(plan.tier3Chance, remainingExtraTier / 2);
    const tier2Chance = clamp(remainingExtraTier - tier3Chance * 2, 0, 0.82);
    const roll = Math.random();
    if (roll < tier4Chance) return 4;
    if (roll < tier4Chance + tier3Chance) return 3;
    if (roll < tier4Chance + tier3Chance + tier2Chance) return 2;
    return 1;
  }

  function enemyRarityWeights(round, archetype = ENEMY_ARCHETYPES[0]) {
    const bias = typeof archetype.rarityBias === "number" ? archetype.rarityBias : enemyArchetypeRarityBias(archetype);
    const latePressure = enemyLatePressure(round);
    return {
      common: 100,
      uncommon: Math.max(0, Math.round(12 + round * 2.2 + bias * 7)),
      rare: Math.max(0, Math.round((round - 2) * 2.8 + latePressure * 1.1 + bias * 4)),
      epic: Math.max(0, Math.round((round - 7) * 1.8 + latePressure * 1.5 + bias * 2)),
    };
  }

  function chooseEnemyRarity(weights) {
    const entries = Object.keys(RARITIES)
      .map((id) => ({ id, weight: Math.max(0, weights?.[id] || 0) }))
      .filter((entry) => entry.weight > 0);
    return weightedChoice(entries, (entry) => entry.weight)?.id || "common";
  }

  function enemyRarityAvailable(rarityId, weights) {
    return rarityId === "common" || (weights?.[rarityId] || 0) > 0;
  }

  function enemySupportCount(round, max, every, bias = 0) {
    const base = 1 + Math.floor(round / every);
    const jitterRoll = Math.random();
    const jitter = round <= 1 ? 0 : jitterRoll < 0.18 ? -1 : jitterRoll > 0.84 ? 1 : 0;
    return Math.max(0, Math.min(max, base + stochasticRound(bias) + jitter));
  }

  function stochasticRound(value) {
    const sign = value < 0 ? -1 : 1;
    const magnitude = Math.abs(value);
    const floor = Math.floor(magnitude);
    return sign * (floor + (Math.random() < magnitude - floor ? 1 : 0));
  }

  function weightedChoice(entries, weightFor) {
    if (!entries?.length) return null;
    const total = entries.reduce((sum, entry) => sum + Math.max(0, weightFor(entry) || 0), 0);
    if (total <= 0) return entries[randInt(entries.length)];
    let roll = Math.random() * total;
    for (const entry of entries) {
      roll -= Math.max(0, weightFor(entry) || 0);
      if (roll <= 0) return entry;
    }
    return entries[entries.length - 1];
  }

  function chooseEnemyUnitId(plan, usedTypeIds = []) {
    const rarity = chooseEnemyRarity(plan.rarityWeights);
    const rarityPool = CATALOG.filter((unit) => (unit.rarity || "common") === rarity);
    const themedPool = plan.themeTrait
      ? rarityPool.filter((unit) => unit.traits?.includes(plan.themeTrait))
      : [];
    let pool = themedPool.length ? themedPool : rarityPool;
    if (!pool.length && plan.themeTrait) pool = CATALOG.filter((unit) => unit.traits?.includes(plan.themeTrait));
    if (!pool.length) pool = CATALOG.filter((unit) => (unit.rarity || "common") === "common");
    const unused = pool.filter((unit) => !usedTypeIds.includes(unit.id));
    const available = unused.length && Math.random() < 0.82 ? unused : pool;
    return available[randInt(available.length)]?.id || CATALOG[0].id;
  }

  function applyEnemyRoundStats(unit, plan) {
    const hpVariance = 0.94 + Math.random() * 0.12;
    const atkVariance = 0.95 + Math.random() * 0.1;
    unit.side = "enemy";
    unit.maxHp = Math.max(1, Math.round(unit.maxHp * plan.hpMultiplier * hpVariance));
    unit.hp = unit.maxHp;
    unit.atk = Math.max(1, Math.round(unit.atk * plan.atkMultiplier * atkVariance));
    unit.baseAtk = unit.atk;
    unit.abilityPower = Math.max(1, Math.round(unit.abilityPower * plan.atkMultiplier * atkVariance));
    unit.baseAbilityPower = unit.abilityPower;
    return unit;
  }

  function makeEnemyTeam(plan = makeEnemyPlan()) {
    const usedTypeIds = [];
    const units = Array.from({ length: plan.count }, () => {
      const typeId = chooseEnemyUnitId(plan, usedTypeIds);
      usedTypeIds.push(typeId);
      const unit = makeUnit(typeId, enemyTierForPlan(plan));
      unit.enemyPlan = plan.archetypeId;
      return applyEnemyRoundStats(unit, plan);
    });
    equipEnemyToppings(units, plan);
    return units;
  }

  function randomEnemyToppingFor(unit, plan = makeEnemyPlan()) {
    const favoriteId = FAVORITE_TOPPINGS[unit.typeId]?.itemId;
    const favorite = favoriteId ? itemInfo(favoriteId) : null;
    if (
      favorite &&
      isTopping(favorite) &&
      enemyRarityAvailable(favorite.rarity || "common", plan.rarityWeights) &&
      Math.random() < 0.45
    ) {
      return makeItem(favorite.id);
    }
    const rarity = chooseEnemyRarity(plan.rarityWeights);
    const pool = ITEMS.filter((item) => isTopping(item) && (item.rarity || "common") === rarity);
    const available = pool.length ? pool : ITEMS.filter((item) => isTopping(item) && (item.rarity || "common") === "common");
    return weightedItemFrom(available);
  }

  function equipEnemyToppings(units, plan = makeEnemyPlan()) {
    if (!units.length) return;
    const targetCount = Math.min(units.length, plan.toppingCount);
    const order = [...units.keys()].sort(() => Math.random() - 0.5);
    order.slice(0, targetCount).forEach((index) => {
      units[index].item = randomEnemyToppingFor(units[index], plan);
      refreshUnitItemStats(units[index]);
    });
  }

  function makeEnemyDrinks(units = [], plan = makeEnemyPlan()) {
    const drinks = Array(drinkSlots.length).fill(null);
    const fallbackDrinks = ITEMS.filter((item) => isDrink(item) && (item.rarity || "common") === "common");
    if (!fallbackDrinks.length) return drinks;
    const targetCount = Math.min(drinks.length, plan.drinkCount);
    const occupiedDrinkSlots = [...new Set(units.flatMap((_, index) => {
      const { row, col } = slotGrid(enemySlotOrder()[index] ?? index);
      return [row, BOARD_ROWS + col];
    }))];
    const slotOrder = (occupiedDrinkSlots.length ? occupiedDrinkSlots : [...drinks.keys()]).sort(() => Math.random() - 0.5);
    const usedDrinkIds = [];
    for (let i = 0; i < targetCount; i += 1) {
      const rarity = chooseEnemyRarity(plan.rarityWeights);
      const rarityPool = ITEMS.filter((item) => isDrink(item) && (item.rarity || "common") === rarity);
      const availableDrinks = rarityPool.length ? rarityPool : fallbackDrinks;
      const uniqueDrinks = availableDrinks.filter((item) => !usedDrinkIds.includes(item.id));
      const drink = weightedItemFrom(uniqueDrinks.length ? uniqueDrinks : availableDrinks);
      usedDrinkIds.push(drink.id);
      drinks[slotOrder[i % slotOrder.length]] = drink;
    }
    return drinks;
  }

  function ensureEnemyPreview() {
    if (!state.enemyPreview || state.enemyPreview.round !== state.round) {
      const plan = makeEnemyPlan();
      state.enemyPreview = {
        round: state.round,
        plan: enemyPlanText(plan),
        units: makeEnemyTeam(plan),
      };
      state.enemyPreview.drinks = makeEnemyDrinks(state.enemyPreview.units, plan);
    }
    return state.enemyPreview.units;
  }

  function enemyPlanText(plan) {
    return {
      archetype: plan.archetypeId,
      label: plan.archetypeLabel,
      primaryArchetype: plan.primaryArchetypeId,
      primaryLabel: plan.primaryArchetypeLabel,
      secondaryArchetype: plan.secondaryArchetypeId,
      secondaryLabel: plan.secondaryArchetypeLabel,
      themeTrait: plan.themeTrait,
      count: plan.count,
      toppingCount: plan.toppingCount,
      drinkCount: plan.drinkCount,
      targetExtraTier: Number(plan.targetExtraTier.toFixed(2)),
      tier3ChancePct: Number((plan.tier3Chance * 100).toFixed(1)),
      tier4ChancePct: Number(((plan.tier4Chance || 0) * 100).toFixed(1)),
      adaptivePressurePct: Number(((plan.adaptivePressure || 0) * 100).toFixed(1)),
      rarityWeights: { ...plan.rarityWeights },
    };
  }

  function enemyPreviewDrinks() {
    ensureEnemyPreview();
    return state.enemyPreview?.drinks || Array(drinkSlots.length).fill(null);
  }

  function cloneEnemyPreviewUnit(unit) {
    const clone = makeUnit(unit.typeId, unit.tier);
    clone.side = "enemy";
    clone.maxHp = unit.maxHp;
    clone.hp = unit.maxHp;
    clone.atk = unit.atk;
    clone.baseAtk = unit.atk;
    clone.abilityPower = unit.abilityPower;
    clone.baseAbilityPower = unit.abilityPower;
    clone.speed = unit.speed;
    clone.item = cloneItem(unit.item);
    return clone;
  }

  function startBattle() {
    if (state.phase !== "prep") return;
    state.lastCombatLedger = null;
    state.postCombatBattle = null;
    const allies = state.board
      .map((unit, index) => (isUnit(unit) ? cloneForBattle(unit, "ally", index) : null))
      .filter(Boolean);
    if (allies.length === 0) {
      state.message = "Place a team";
      return;
    }
    clearParticles();
    const previewEnemies = ensureEnemyPreview();
    const previewEnemyDrinks = enemyPreviewDrinks().map((item) => cloneItem(item));
    const enemies = previewEnemies.map((unit, index) => positionBattleUnit(cloneEnemyPreviewUnit(unit), "enemy", enemySlotOrder()[index]));
    allies.forEach((unit) => positionBattleUnit(unit, "ally", unit.slot));
    state.battle = {
      allies,
      enemies,
      traitLevels: {
        ally: Object.fromEntries(traitSnapshotForUnits(allies).map((trait) => [trait.id, trait])),
        enemy: Object.fromEntries(traitSnapshotForUnits(enemies).map((trait) => [trait.id, trait])),
      },
      arena: arenaText(),
      elapsed: 0,
      moldNextTick: MOLD_START_SECONDS,
      moldStacks: 0,
      moldTotalDamage: 0,
      result: null,
      attacks: [],
      ledger: createCombatLedger(allies, enemies),
      allyDrinks: state.drinks.map((item) => cloneItem(item)),
      enemyDrinks: previewEnemyDrinks,
      enemyPlan: state.enemyPreview?.plan || null,
      drinkTosses: [],
    };
    applyDrinkEffects(allies, state.battle.allyDrinks);
    applyDrinkEffects(enemies, state.battle.enemyDrinks);
    applyBattleStartArenaEffects(allies, enemies);
    applyBattleStartArenaEffects(enemies, allies);
    applyPendingArenaRewardBuff(allies);
    applyBattleStartItemEffects(allies);
    applyBattleStartItemEffects(enemies);
    applyBattleStartTraitEffects(allies, enemies);
    applyBattleStartTraitEffects(enemies, allies);
    applyBattleStartAbilities(allies, enemies);
    applyBattleStartAbilities(enemies, allies);
    state.phase = "battle";
    state.selected = null;
    state.drag = null;
    state.message = "Battle";
  }

  function applyDrinkEffects(units, drinks = state.drinks) {
    drinks.forEach((drink, index) => {
      if (!isDrink(drink)) return;
      const slot = drinkSlots[index];
      const affected = units.filter((unit) => !unit.dead && (slot.axis === "row" ? unit.row === slot.targetIndex : unit.col === slot.targetIndex));
      affected.forEach((unit) => {
        const paired = unitMatchesDrinkPair(unit, drink);
        const speedPct = (drink.drinkAttackSpeedPct || 0) + (paired ? drink.pairedDrinkAttackSpeedPct || 0 : 0);
        const maxHpPct = (drink.drinkMaxHpPct || 0) + (paired ? drink.pairedDrinkMaxHpPct || 0 : 0);
        const abilityPowerPct = (drink.drinkAbilityPowerPct || 0) + (paired ? drink.pairedDrinkAbilityPowerPct || 0 : 0);
        unit.drinkEffects = unit.drinkEffects || [];
        unit.drinkEffects.push({
          id: drink.id,
          short: drink.short,
          axis: slot.axis,
          targetIndex: slot.targetIndex,
          pairMatched: paired,
          pairTraits: [...(drink.pairTraits || [])],
          attackSpeedPct: speedPct,
          maxHpPct,
          abilityPowerPct,
        });
        if (speedPct) {
          unit.drinkAttackSpeedPct = (unit.drinkAttackSpeedPct || 0) + speedPct;
        }
        if (maxHpPct) {
          const bonusHp = Math.max(1, Math.round(unit.maxHp * maxHpPct));
          unit.maxHp += bonusHp;
          unit.hp += bonusHp;
        }
        if (abilityPowerPct) {
          unit.abilityPower = Math.max(unit.abilityPower + 1, Math.round(unit.abilityPower * (1 + abilityPowerPct)));
        }
        spawnDrinkToss(state.battle, drink, index, unit, { kind: "line" });
      });
    });
  }

  function drinkLaneUnits(units, slot) {
    return units.filter((unit) => !unit.dead && (slot.axis === "row" ? unit.row === slot.targetIndex : unit.col === slot.targetIndex));
  }

  function setTimedPctStatus(unit, key, pct, duration) {
    const current = unit[key];
    unit[key] = {
      remaining: Math.max(current?.remaining || 0, duration),
      pct: Math.max(current?.pct || 0, pct),
    };
  }

  function updateDrinkPulses(battle, dt) {
    applyDrinkPulsesForSide(battle, "ally", dt);
    applyDrinkPulsesForSide(battle, "enemy", dt);
  }

  function applyDrinkPulsesForSide(battle, side, dt) {
    const drinks = side === "ally" ? battle.allyDrinks : battle.enemyDrinks;
    const allies = side === "ally" ? battle.allies : battle.enemies;
    const enemies = side === "ally" ? battle.enemies : battle.allies;
    drinks?.forEach((drink, index) => {
      if (!drinkPulseUnlocked(drink)) return;
      const interval = drink.drinkPulseInterval || 5;
      drink.drinkPulseTimer = (drink.drinkPulseTimer ?? Math.min(2.5, interval)) - dt;
      if (drink.drinkPulseTimer > 0) return;
      drink.drinkPulseTimer += interval;
      applyDrinkPulse(battle, drink, index, allies, enemies);
    });
  }

  function applyDrinkPulse(battle, drink, index, allies, enemies) {
    const slot = drinkSlots[index];
    const lineAllies = drinkLaneUnits(allies, slot);
    if (!lineAllies.length) return;
    const lineEnemies = drinkLaneUnits(enemies, slot);
    const scale = drinkPulseTierScale(drink);
    const color = drink.accent || drink.color || "#7ec7e8";
    const duration = drink.drinkPulseDuration || 2.4;
    if (drink.drinkPulseType === "shield") {
      triggerDrinkPulseAnimation(battle, drink);
      lineAllies.forEach((unit) => {
        const shield = Math.max(1, Math.round(unit.maxHp * (drink.drinkPulseShieldPct || 0.08) * scale));
        if (grantShield(unit, shield)) spawnDrinkToss(battle, drink, index, unit, { kind: "shield" });
      });
      return;
    }
    if (drink.drinkPulseType === "haste") {
      triggerDrinkPulseAnimation(battle, drink);
      lineAllies.forEach((unit) => {
        setTimedPctStatus(unit, "haste", (drink.drinkPulseHastePct || 0.1) * scale, duration);
        spawnDrinkToss(battle, drink, index, unit, { kind: "haste" });
      });
      return;
    }
    if (drink.drinkPulseType === "heal") {
      const target = lineAllies
        .filter((unit) => unit.hp < unit.maxHp)
        .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
      if (!target) return;
      triggerDrinkPulseAnimation(battle, drink);
      const heal = Math.max(1, Math.round(target.maxHp * (drink.drinkPulseHealPct || 0.08) * scale));
      if (healUnit(target, heal)) spawnDrinkToss(battle, drink, index, target, { kind: "heal" });
      return;
    }
    if (drink.drinkPulseType === "brine") {
      if (!lineEnemies.length) return;
      triggerDrinkPulseAnimation(battle, drink);
      const source = lineAllies[0];
      lineEnemies.forEach((target) => {
        const damage = Math.max(1, Math.round(target.maxHp * (drink.drinkPulseEnemyDamagePct || 0.03) * scale));
        applyDamage(target, damage, source, battle, {
          color,
          particleType: drink.id,
          status: true,
          noItemTriggers: true,
          noProjectile: true,
        });
        setTimedPctStatus(target, "attackSlow", (drink.drinkPulseAttackSlowPct || 0.14) * scale, duration);
        spawnDrinkToss(battle, drink, index, target, { kind: "brine" });
      });
      return;
    }
    if (drink.drinkPulseType === "attack_boost") {
      triggerDrinkPulseAnimation(battle, drink);
      lineAllies.forEach((unit) => {
        setTimedPctStatus(unit, "attackBoost", (drink.drinkPulseAttackBoostPct || 0.1) * scale, duration);
        spawnDrinkToss(battle, drink, index, unit, { kind: "attack_boost" });
      });
    }
  }

  function triggerDrinkPulseAnimation(battle, drink) {
    if (!battle || !drink) return;
    drink.drinkPulseAnimStart = battle.elapsed || 0;
  }

  function spawnDrinkToss(battle, drink, index, target, options = {}) {
    if (!battle || !isDrink(drink) || !target || target.dead) return;
    const slot = drinkSlots[index];
    const side = target.side === "enemy" ? "enemy" : "ally";
    const from = battleDrinkSlotPosition(side, slot);
    battle.drinkTosses = battle.drinkTosses || [];
    battle.drinkTosses.push({
      id: drink.id,
      name: drink.name,
      kind: options.kind || drink.drinkPulseType || "line",
      side,
      slotIndex: index,
      fromX: from.x,
      fromY: from.y,
      to: target.uid,
      t: DRINK_TOSS_ANIMATION_SECONDS,
      duration: DRINK_TOSS_ANIMATION_SECONDS,
      color: drink.accent || drink.color || "#7ec7e8",
    });
  }

  function cloneForBattle(unit, side, slot) {
    const clone = {
      ...makeUnit(unit.typeId, unit.tier),
      uid: unit.uid,
      side,
      slot,
      shield: 0,
      cooldown: 0.25 + Math.random() * 0.35,
    };
    clone.item = cloneItem(unit.item);
    clone.permanentHpBonus = unit.permanentHpBonus || 0;
    if (clone.permanentHpBonus) {
      clone.maxHp += clone.permanentHpBonus;
      clone.hp = clone.maxHp;
    }
    refreshUnitItemStats(clone);
    return clone;
  }

  function applyBattleStartItemEffects(units) {
    [...units].forEach((unit) => {
      if (!unit?.item || unit.dead) return;
      if (unit.item.battleStartHpLossPct) {
        unit.hp = Math.max(1, Math.round(unit.maxHp * (1 - unit.item.battleStartHpLossPct)));
      }
      if (unit.item.adjacentStartShieldPct) {
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            grantShield(ally, Math.max(1, Math.round(unit.maxHp * unit.item.adjacentStartShieldPct)));
            burst({ x: ally.x, y: ally.y }, unit.item.accent || "#9a5b1d");
          });
      }
      if (unit.item.adjacentStartAttackBuffPct) {
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            ally.attackBoost = {
              remaining: unit.item.adjacentStartBuffDuration || 4,
              pct: unit.item.adjacentStartAttackBuffPct,
            };
            burst({ x: ally.x, y: ally.y }, unit.item.accent || "#d7a64e");
          });
      }
      if (unit.item.decoyHpPct) {
        const decoy = makeItemDecoy(unit);
        units.push(decoy);
      }
    });
  }

  function makeItemDecoy(source) {
    const decoy = {
      ...makeUnit("toast_tortoise", 1),
      uid: unitSeq++,
      typeId: source.typeId,
      lineName: "Candied Cherry",
      name: "Cherry Decoy",
      short: "Decoy",
      tier: 1,
      rarity: source.rarity,
      ability: "decoy",
      abilityText: "Soaks hits",
      role: "Decoy",
      maxHp: Math.max(1, Math.round(source.maxHp * source.item.decoyHpPct)),
      hp: Math.max(1, Math.round(source.maxHp * source.item.decoyHpPct)),
      atk: 0,
      speed: 99,
      abilityPower: 0,
      item: null,
      shield: 0,
      cooldown: 999,
      side: source.side,
      slot: source.slot,
      col: source.col,
      row: source.row,
      x: source.x + (source.side === "ally" ? -28 : 28),
      y: source.y + 28,
      dead: false,
      ignoreTraits: true,
    };
    return decoy;
  }

  function positionBattleUnit(unit, side, index) {
    const { col, row } = slotGrid(index);
    const pos = battleSlotPosition(side, index);
    unit.x = pos.x;
    unit.y = pos.y;
    unit.side = side;
    unit.slot = index;
    unit.col = col;
    unit.row = row;
    return unit;
  }

  function battleSlotPosition(side, index) {
    const { col, row } = slotGrid(index);
    return {
      x: side === "ally" ? BATTLE_FORMATION.allyBaseX + col * BATTLE_FORMATION.colGap : BATTLE_FORMATION.enemyBaseX - col * BATTLE_FORMATION.colGap,
      y: BATTLE_FORMATION.topY + row * BATTLE_FORMATION.rowGap,
    };
  }

  function slotGrid(index) {
    return {
      col: index % BOARD_COLS,
      row: Math.floor(index / BOARD_COLS),
    };
  }

  function enemySlotOrder() {
    return [5, 2, 8, 4, 1, 7, 3, 0, 6];
  }

  function endBattle(won) {
    const damage = won ? 0 : Math.max(1, Math.ceil(state.round / 2));
    if (!won) state.hearts = Math.max(0, state.hearts - damage);
    if (won) {
      state.winStreak += 1;
      state.lossStreak = 0;
    } else {
      state.lossStreak += 1;
      state.winStreak = 0;
    }
    const income = calculateRoundIncome(won);
    applyPostBattleAnimalEffects(won);
    state.lastCombatLedger = summarizeCombatLedger(state.battle, won, damage);
    state.gold = Math.min(ECONOMY.maxGold, state.gold + income.total);
    state.lastIncome = income;
    state.round += 1;
    state.phase = "result";
    state.enemyPreview = null;
    state.rewardChoices = state.hearts > 0 ? generateRewardChoices(won) : [];
    state.message = state.hearts > 0
      ? `${won ? "Victory" : "Defeat"} +${income.total} coins - choose a reward`
      : "Run over";
    state.log.unshift(won ? `Won +${income.total} coins` : `Lost ${damage} hearts +${income.total} coins`);
    clearParticles();
    state.battle.attacks = [];
    state.battle.drinkTosses = [];
    state.postCombatBattle = state.battle;
    state.battle = null;
    combatEndExplosion(won);
  }

  function createCombatLedger(allies, enemies) {
    const units = {};
    [...allies, ...enemies].forEach((unit) => {
      units[unit.uid] = {
        uid: unit.uid,
        side: unit.side,
        name: unit.name,
        short: unit.short,
        typeId: unit.typeId,
        tier: unit.tier,
        damageDealt: 0,
        damageTaken: 0,
        healingReceived: 0,
        shieldingReceived: 0,
        kos: 0,
        defeated: false,
      };
    });
    return {
      sides: {
        ally: { damageDealt: 0, damageTaken: 0, healingReceived: 0, shieldingReceived: 0, kos: 0 },
        enemy: { damageDealt: 0, damageTaken: 0, healingReceived: 0, shieldingReceived: 0, kos: 0 },
      },
      units,
    };
  }

  function ensureLedgerUnit(ledger, unit) {
    if (!ledger || !unit) return null;
    if (!ledger.units[unit.uid]) {
      ledger.units[unit.uid] = {
        uid: unit.uid,
        side: unit.side,
        name: unit.name,
        short: unit.short,
        typeId: unit.typeId,
        tier: unit.tier,
        damageDealt: 0,
        damageTaken: 0,
        healingReceived: 0,
        shieldingReceived: 0,
        kos: 0,
        defeated: false,
      };
    }
    return ledger.units[unit.uid];
  }

  function recordCombatDamage(battle, source, target, hpDamage, shieldDamage = 0) {
    const ledger = battle?.ledger;
    const impact = Math.max(0, hpDamage || 0) + Math.max(0, shieldDamage || 0);
    if (!ledger || impact <= 0 || !target) return;
    const targetSide = target.side || "enemy";
    const targetEntry = ensureLedgerUnit(ledger, target);
    if (targetEntry) targetEntry.damageTaken += impact;
    ledger.sides[targetSide].damageTaken += impact;
    if (source) {
      const sourceSide = source.side || (targetSide === "ally" ? "enemy" : "ally");
      const sourceEntry = ensureLedgerUnit(ledger, source);
      if (sourceEntry) sourceEntry.damageDealt += impact;
      ledger.sides[sourceSide].damageDealt += impact;
    }
  }

  function recordCombatKo(battle, source, target) {
    const ledger = battle?.ledger;
    if (!ledger || !target) return;
    const targetEntry = ensureLedgerUnit(ledger, target);
    if (targetEntry) targetEntry.defeated = true;
    if (!source) return;
    const sourceSide = source.side || "ally";
    const sourceEntry = ensureLedgerUnit(ledger, source);
    if (sourceEntry) sourceEntry.kos += 1;
    ledger.sides[sourceSide].kos += 1;
  }

  function recordCombatSupport(unit, amount, kind) {
    const ledger = state.battle?.ledger;
    if (!ledger || !unit || amount <= 0) return;
    const side = unit.side || "ally";
    const entry = ensureLedgerUnit(ledger, unit);
    if (kind === "heal") {
      ledger.sides[side].healingReceived += amount;
      if (entry) entry.healingReceived += amount;
    } else {
      ledger.sides[side].shieldingReceived += amount;
      if (entry) entry.shieldingReceived += amount;
    }
  }

  function summarizeCombatLedger(battle, won, heartDamage) {
    const ledger = battle?.ledger;
    if (!ledger) return null;
    const allyUnits = Object.values(ledger.units).filter((unit) => unit.side === "ally");
    const enemyUnits = Object.values(ledger.units).filter((unit) => unit.side === "enemy");
    const topDamage = allyUnits.reduce((best, unit) => unit.damageDealt > (best?.damageDealt || 0) ? unit : best, null);
    const topProtected = allyUnits.reduce((best, unit) => {
      const score = unit.healingReceived + unit.shieldingReceived;
      const bestScore = (best?.healingReceived || 0) + (best?.shieldingReceived || 0);
      return score > bestScore ? unit : best;
    }, null);
    return {
      result: won ? "win" : "loss",
      duration: Math.max(0.1, Number((battle.elapsed || 0).toFixed(1))),
      heartDamage,
      ally: { ...ledger.sides.ally, losses: allyUnits.filter((unit) => unit.defeated).length },
      enemy: { ...ledger.sides.enemy, losses: enemyUnits.filter((unit) => unit.defeated).length },
      mvp: topDamage ? {
        name: topDamage.short || topDamage.name,
        damageDealt: topDamage.damageDealt,
        kos: topDamage.kos,
      } : null,
      protected: topProtected ? {
        name: topProtected.short || topProtected.name,
        healingReceived: topProtected.healingReceived,
        shieldingReceived: topProtected.shieldingReceived,
      } : null,
    };
  }

  function calculateRoundIncome(won) {
    const base = won ? ECONOMY.winGold : ECONOMY.lossGold;
    const streakCount = won ? state.winStreak : state.lossStreak;
    const streak = streakBonus(streakCount);
    const interest = Math.min(ECONOMY.interestCap, Math.floor(state.gold / ECONOMY.interestStep) * ECONOMY.interestGold);
    const treats = survivingTreatIncome();
    const bakery = traitIncomeFromBattle();
    return {
      result: won ? "win" : "loss",
      base,
      interest,
      streak,
      treats,
      bakery,
      streakCount,
      total: base + interest + streak + treats + bakery,
    };
  }

  function streakBonus(count) {
    return ECONOMY.streakGold.find((step) => count >= step.at)?.gold || 0;
  }

  function survivingTreatIncome() {
    if (!state.battle) return 0;
    return state.battle.allies
      .filter((unit) => !unit.dead)
      .reduce((sum, unit) => sum + (unit.ability === "treat_income" ? donutTreatGold(unit) : 0) + (unit.item?.surviveGold || 0), 0);
  }

  function applyPostBattleAnimalEffects() {
    if (!state.battle) return;
    const survivors = new Map(state.battle.allies.filter((unit) => !unit.dead).map((unit) => [unit.uid, unit]));
    allOwnedRefs().forEach((ref) => {
      if (!survivors.has(ref.unit.uid) || ref.unit.ability !== "survive_scale") return;
      const gain = mochiHpGain(ref.unit);
      ref.unit.permanentHpBonus = (ref.unit.permanentHpBonus || 0) + gain;
      ref.unit.maxHp += gain;
      ref.unit.hp = Math.min(ref.unit.maxHp, ref.unit.hp + gain);
      state.log.unshift(`${ref.unit.short} gained ${gain} max HP`);
    });
  }

  function arenaRewardTraits(arenaId = currentArena().id) {
    const mapping = {
      sunny_breakfast_patio: ["breakfast", "bakery", "fresh"],
      rainy_fish_market: ["ocean", "bakery"],
      street_festival: ["street_food", "spicy", "snack"],
      spice_bazaar: ["spicy", "street_food"],
      frozen_parfait_peak: ["sweet", "snack", "ocean", "fresh"],
      dim_sum_kitchen: ["snack", "breakfast", "street_food"],
    };
    return mapping[arenaId] || [];
  }

  function rewardRarityAvailable(rarityId) {
    const weights = currentShopRarityWeights();
    return rarityId === "common" || (weights[rarityId] || 0) > 0;
  }

  function pushUniqueReward(choices, reward) {
    if (!reward) return false;
    const key = reward.key || `${reward.type}:${reward.itemId || reward.typeId || reward.title}`;
    if (choices.some((choice) => (choice.key || `${choice.type}:${choice.itemId || choice.typeId || choice.title}`) === key)) return false;
    choices.push({ ...reward, key });
    return true;
  }

  function shuffledRewards(rewards) {
    return rewards
      .filter(Boolean)
      .map((reward) => ({ reward, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry) => entry.reward);
  }

  function pushFromRewardPool(choices, rewards) {
    for (const reward of shuffledRewards(rewards)) {
      if (pushUniqueReward(choices, reward)) return true;
    }
    return false;
  }

  function traitRewardPriority() {
    const units = allOwnedRefs().map((ref) => ref.unit);
    const snapshots = compactTraitSnapshotForUnits(units)
      .filter((trait) => trait.count > 0)
      .sort((a, b) => {
        const gapA = a.nextAt ? a.nextAt - a.count : 99;
        const gapB = b.nextAt ? b.nextAt - b.count : 99;
        return gapA - gapB || b.count - a.count || a.label.localeCompare(b.label);
      })
      .map((trait) => trait.id);
    return [...new Set([...snapshots, ...arenaRewardTraits()])];
  }

  function copyRewardForTrait(traitId, source = "trait") {
    const pool = CATALOG.filter((animal) => animal.traits?.includes(traitId) && rewardRarityAvailable(animal.rarity || "common"));
    if (!pool.length) return null;
    const base = pool[randInt(pool.length)];
    const unit = makeUnit(base.id);
    const label = traitLabel(traitId);
    return {
      type: "copy",
      typeId: base.id,
      traitId,
      title: source === "arena" ? `${currentArena().short}: ${unit.short}` : `${label}: ${unit.short}`,
      body: source === "arena" ? `Arena-favored ${label} copy.` : `Helps push your ${label} tier.`,
      key: `copy:${source}:${traitId}:${base.id}`,
    };
  }

  function pivotCopyReward() {
    const arenaTraits = arenaRewardTraits();
    const pool = CATALOG.filter((animal) => !animal.traits?.some((traitId) => arenaTraits.includes(traitId)) && rewardRarityAvailable(animal.rarity || "common"));
    if (!pool.length) return null;
    const base = pool[randInt(pool.length)];
    const unit = makeUnit(base.id);
    return {
      type: "copy",
      typeId: base.id,
      title: `Pivot: ${unit.short}`,
      body: "Off-arena copy for changing lanes.",
      key: `copy:pivot:${base.id}`,
    };
  }

  function favoriteToppingReward() {
    const candidates = allOwnedRefs()
      .map((ref) => ref.unit)
      .filter((unit) => FAVORITE_TOPPINGS[unit.typeId] && !hasFavoriteTopping(unit))
      .sort((a, b) => Number(Boolean(a.item)) - Number(Boolean(b.item)) || b.tier - a.tier);
    if (!candidates.length) return null;
    const unit = candidates[0];
    const favorite = FAVORITE_TOPPINGS[unit.typeId];
    const item = itemInfo(favorite.itemId);
    return {
      type: "item",
      itemId: item.id,
      title: `${item.short} Favorite`,
      body: `${unit.short}'s favorite topping.`,
      key: `favorite:${unit.typeId}:${item.id}`,
    };
  }

  function arenaToppingReward() {
    const traits = arenaRewardTraits();
    const itemIds = CATALOG
      .filter((animal) => animal.traits?.some((traitId) => traits.includes(traitId)))
      .map((animal) => FAVORITE_TOPPINGS[animal.id]?.itemId)
      .filter(Boolean);
    const uniqueIds = [...new Set(itemIds)];
    const available = uniqueIds
      .map((itemId) => itemInfo(itemId))
      .filter((item) => item?.id && rewardRarityAvailable(item.rarity || "common"));
    const item = available.length ? available[randInt(available.length)] : shopItem();
    return {
      type: "item",
      itemId: item.id,
      title: `${currentArena().short}: ${item.short}`,
      body: `Topping fits this arena.`,
      key: `arena-item:${currentArena().id}:${item.id}`,
    };
  }

  function ownedCopyReward() {
    const ownedTypes = [...new Set(allOwnedRefs().map((ref) => ref.unit.typeId))];
    if (!ownedTypes.length) return null;
    const typeId = ownedTypes[randInt(ownedTypes.length)];
    const unit = makeUnit(typeId);
    return {
      type: "copy",
      typeId,
      title: `${unit.short} Copy`,
      body: "Adds a copy of a line you own.",
      key: `owned-copy:${typeId}`,
    };
  }

  function freeItemReward() {
    const item = shopItem();
    return {
      type: "item",
      itemId: item.id,
      title: `Free ${item.short}`,
      body: `${rarityInfo(item.rarity).label} topping.`,
      key: `item:${item.id}`,
    };
  }

  function freeRollReward(won) {
    const amount = 1;
    return {
      type: "freeRolls",
      amount,
      title: `${amount} Free ${amount === 1 ? "Roll" : "Rolls"}`,
      body: "Scout shops next round.",
      key: "freeRolls",
    };
  }

  function goldReward(won) {
    const amount = won ? 20 : 12;
    return {
      type: "gold",
      amount,
      title: `+${amount} Coins`,
      body: "Flexible coins for upgrades and pivots.",
      key: "gold",
    };
  }

  function arenaScoutReward() {
    const arena = currentArena();
    const traitIds = arenaRewardTraits(arena.id);
    if (!traitIds.length) return null;
    return {
      type: "arenaScout",
      arenaId: arena.id,
      arenaShort: arena.short,
      traitIds,
      shopsRemaining: 2,
      freeRolls: 1,
      title: `${arena.short} Scout`,
      body: "+1 roll; next 2 shops favor arena traits.",
      key: `arena-scout:${arena.id}`,
    };
  }

  function arenaPrepBuffReward() {
    const arena = currentArena();
    const traitIds = arenaRewardTraits(arena.id);
    if (!traitIds.length) return null;
    return {
      type: "arenaPrepBuff",
      arenaId: arena.id,
      arenaShort: arena.short,
      traitIds,
      shieldPct: 0.12,
      hastePct: 0.1,
      attackPct: 0.08,
      duration: 3,
      title: `${arena.short} Prep`,
      body: "Next battle: one favored unit gets buffs.",
      key: `arena-prep:${arena.id}`,
    };
  }

  function arenaHoldReward() {
    const arena = currentArena();
    return {
      type: "arenaHold",
      arenaId: arena.id,
      arenaShort: arena.short,
      freeRolls: 1,
      title: `Hold ${arena.short}`,
      body: "Keep this arena next battle; +1 roll.",
      key: `arena-hold:${arena.id}`,
    };
  }

  function arenaPurseReward(won) {
    const arena = currentArena();
    const amount = won ? 14 : 10;
    return {
      type: "arenaPurse",
      arenaId: arena.id,
      amount,
      freeRolls: 1,
      title: `${arena.short} Purse`,
      body: `Gain ${amount} coins and 1 free roll.`,
      key: `arena-purse:${arena.id}`,
    };
  }

  function shopSlotUnlockReward() {
    const slotIndex = firstLockedShopSlot();
    if (slotIndex < 0) return null;
    const cost = shopSlotUnlockCost(slotIndex);
    return {
      type: "shopSlotUnlock",
      slotIndex,
      amount: cost,
      title: `Open Slot ${slotIndex + 1}`,
      body: `Unlock next shop slot; saves ${cost} coins.`,
      key: `slot-unlock:${slotIndex}`,
    };
  }

  function upgradeDiscountReward() {
    const nextCost = nextShopUpgradeCost();
    if (nextCost === null) return null;
    const amount = Math.min(25, nextCost);
    return {
      type: "upgradeDiscount",
      amount,
      title: "Upgrade Coupon",
      body: `Next shop upgrade costs ${amount} fewer coins.`,
      key: `upgrade-discount:${state.shopLevel}:${amount}`,
    };
  }

  function generateRewardChoices(won) {
    const choices = [];
    const hasBenchSpace = firstEmptyBench() >= 0;
    const hasItemStorageSpace = state.itemBench.some((entry) => !entry) || hasBenchSpace;
    const traitIds = traitRewardPriority();
    const arenaTraits = arenaRewardTraits();
    if (hasBenchSpace || hasItemStorageSpace) {
      pushFromRewardPool(choices, [
        hasItemStorageSpace ? favoriteToppingReward() : null,
        hasBenchSpace ? copyRewardForTrait(traitIds[0], "trait") : null,
        hasBenchSpace ? ownedCopyReward() : null,
      ]);
      pushFromRewardPool(choices, [
        hasBenchSpace ? copyRewardForTrait(arenaTraits[randInt(Math.max(1, arenaTraits.length))], "arena") : null,
        hasItemStorageSpace ? arenaToppingReward() : null,
        arenaScoutReward(),
        arenaPrepBuffReward(),
        arenaHoldReward(),
      ]);
      pushFromRewardPool(choices, [
        goldReward(won),
        freeRollReward(won),
        shopSlotUnlockReward(),
        upgradeDiscountReward(),
        arenaPurseReward(won),
        pivotCopyReward(),
        hasItemStorageSpace ? freeItemReward() : null,
      ]);
    } else {
      pushFromRewardPool(choices, [
        goldReward(won),
        freeRollReward(won),
        shopSlotUnlockReward(),
        upgradeDiscountReward(),
        arenaScoutReward(),
        arenaHoldReward(),
        arenaPurseReward(won),
      ]);
    }
    pushFromRewardPool(choices, [goldReward(won), freeRollReward(won), shopSlotUnlockReward(), upgradeDiscountReward(), arenaScoutReward(), arenaPurseReward(won), arenaHoldReward()]);
    return choices.slice(0, 3);
  }

  function applyRewardChoice(index) {
    if (state.phase !== "result" || !state.rewardChoices?.length) return false;
    const reward = state.rewardChoices[index];
    if (!reward) return false;
    if (reward.type === "gold") {
      state.gold = Math.min(ECONOMY.maxGold, state.gold + reward.amount);
    } else if (reward.type === "freeRolls") {
      state.freeRolls += reward.amount;
    } else if (reward.type === "arenaScout") {
      state.freeRolls += reward.freeRolls || 0;
      state.arenaScout = {
        arenaId: reward.arenaId,
        arenaShort: reward.arenaShort,
        traitIds: [...(reward.traitIds || [])],
        shopsRemaining: reward.shopsRemaining || 2,
      };
    } else if (reward.type === "arenaPrepBuff") {
      state.arenaPrepBuff = {
        arenaId: reward.arenaId,
        arenaShort: reward.arenaShort,
        traitIds: [...(reward.traitIds || [])],
        shieldPct: reward.shieldPct || 0.12,
        hastePct: reward.hastePct || 0.1,
        attackPct: reward.attackPct || 0.08,
        duration: reward.duration || 3,
      };
    } else if (reward.type === "arenaHold") {
      state.keepArenaNextRound = true;
      state.freeRolls += reward.freeRolls || 0;
    } else if (reward.type === "arenaPurse") {
      state.gold = Math.min(ECONOMY.maxGold, state.gold + reward.amount);
      state.freeRolls += reward.freeRolls || 0;
    } else if (reward.type === "shopSlotUnlock") {
      if (!openShopSlot(reward.slotIndex)) state.gold = Math.min(ECONOMY.maxGold, state.gold + Math.min(25, reward.amount || 0));
    } else if (reward.type === "upgradeDiscount") {
      state.nextShopUpgradeDiscountGold = Math.max(state.nextShopUpgradeDiscountGold || 0, reward.amount || 0);
    } else if (reward.type === "item") {
      if (!moveItemToBench(makeItem(reward.itemId))) state.gold = Math.min(ECONOMY.maxGold, state.gold + 15);
      resolveItemMerges();
    } else if (reward.type === "copy") {
      if (!moveItemToBench(makeUnit(reward.typeId))) state.gold = Math.min(ECONOMY.maxGold, state.gold + 15);
      resolveMerges();
    }
    state.message = `Claimed ${reward.title}`;
    state.log.unshift(`Reward: ${reward.title}`);
    const rewardParticles = state.particles.slice();
    state.rewardChoices = [];
    continuePrep();
    state.particles.push(...rewardParticles);
    return true;
  }

  function continuePrep() {
    if (state.hearts <= 0) {
      resetGame();
      return;
    }
    state.phase = "prep";
    clearParticles();
    state.rewardChoices = [];
    state.postCombatBattle = null;
    startNextRoundShop();
  }

  function resetGame() {
    state.phase = "prep";
    state.round = 1;
    state.gold = ECONOMY.startingGold;
    state.hearts = 10;
    state.shopLevel = 1;
    state.message = "Prep";
    state.shop = [];
    state.shopFrozen = Array(shopSlots.length).fill(false);
    state.shopSales = Array(shopSlots.length).fill(false);
    state.shopUnlocked = initialShopUnlocked();
    state.bench = Array(8).fill(null);
    state.itemBench = Array(itemBenchSlots.length).fill(null);
    state.board = Array(boardSlots.length).fill(null);
    state.drinks = Array(drinkSlots.length).fill(null);
    state.selected = null;
    state.drag = null;
    state.battle = null;
    state.postCombatBattle = null;
    state.arenaId = randomArenaId();
    state.keepArenaNextRound = false;
    state.arenaScout = null;
    state.arenaPrepBuff = null;
    state.enemyPreview = null;
    state.rewardChoices = [];
    state.lastCombatLedger = null;
    state.freeRolls = 0;
    state.rollsThisRound = 0;
    state.nextShopUpgradeDiscountGold = 0;
    state.winStreak = 0;
    state.lossStreak = 0;
    state.lastIncome = null;
    state.itemDiscountUsed = false;
    clearParticles();
    state.log = [];
    refreshShop(true);
  }

  function moldDamagePct(stacks) {
    if (stacks <= 0) return 0;
    return Math.min(MOLD_MAX_DAMAGE_PCT, MOLD_BASE_DAMAGE_PCT + (stacks - 1) * MOLD_STACK_DAMAGE_PCT);
  }

  function moldStateText(battle) {
    if (!battle) return null;
    const active = battle.elapsed >= MOLD_START_SECONDS || (battle.moldStacks || 0) > 0;
    const stacks = battle.moldStacks || 0;
    return {
      active,
      startsAt: MOLD_START_SECONDS,
      nextTickIn: active ? Math.max(0, Number(((battle.moldNextTick || 0) - battle.elapsed).toFixed(2))) : Math.max(0, Number((MOLD_START_SECONDS - battle.elapsed).toFixed(2))),
      stacks,
      damagePct: Number((moldDamagePct(Math.max(1, stacks)) * 100).toFixed(1)),
      totalDamage: battle.moldTotalDamage || 0,
    };
  }

  function applyMoldTick(battle) {
    battle.moldStacks = (battle.moldStacks || 0) + 1;
    const damagePct = moldDamagePct(battle.moldStacks);
    const units = [...battle.allies, ...battle.enemies].filter((unit) => !unit.dead);
    units.forEach((unit) => {
      unit.moldStacks = battle.moldStacks;
      const damage = Math.max(1, Math.round(unit.maxHp * damagePct));
      unit.hp = Math.max(0, unit.hp - damage);
      battle.moldTotalDamage = (battle.moldTotalDamage || 0) + damage;
      recordCombatDamage(battle, null, unit, damage, 0);
      burst({ x: unit.x, y: unit.y }, STATUS_EFFECT_STYLES.mold.color);
      if (unit.hp <= 0 && !unit.dead) {
        unit.dead = true;
        unit.shield = 0;
        recordCombatKo(battle, null, unit);
        defeatExplosion(unit);
      }
    });
  }

  function updateBattleMold(battle) {
    if (!battle) return;
    if (battle.moldNextTick == null) battle.moldNextTick = MOLD_START_SECONDS;
    while (battle.elapsed >= battle.moldNextTick && !battle.result) {
      applyMoldTick(battle);
      battle.moldNextTick += MOLD_TICK_SECONDS;
    }
  }

  function updateBattle(dt) {
    const battle = state.battle;
    if (!battle || battle.result) return;
    battle.elapsed += dt;
    updateBattleStatuses(battle, dt);
    updateBattleMold(battle);
    updateDrinkPulses(battle, dt);
    const all = [...battle.allies, ...battle.enemies].filter((u) => !u.dead);
    for (const unit of all) {
      unit.cooldown -= dt * attackClockMultiplier(unit);
      if (unit.cooldown > 0) continue;
      const foes = (unit.side === "ally" ? battle.enemies : battle.allies).filter((u) => !u.dead);
      if (foes.length === 0) continue;
      unit.cooldown = unit.speed;
      performCombatAction(unit, battle, foes);
    }
    battle.attacks = battle.attacks.filter((a) => (a.t -= dt) > 0);
    battle.drinkTosses = (battle.drinkTosses || []).filter((toss) => {
      toss.t -= dt;
      if (toss.t > 0) return true;
      drinkTossImpact(toss, battle);
      return false;
    });
    if (battle.enemies.every((u) => u.dead)) {
      battle.result = "win";
      endBattle(true);
    } else if (battle.allies.every((u) => u.dead)) {
      battle.result = "loss";
      endBattle(false);
    } else if (battle.elapsed > BATTLE_TIMEOUT_SECONDS) {
      battle.result = "loss";
      endBattle(false);
    }
  }

  function updateBattleStatuses(battle, dt) {
    const units = [...battle.allies, ...battle.enemies];
    units.forEach((unit) => {
      if (unit.dead) return;
      let negativeDt = dt * (1 + (unit.item?.statusDurationReductionPct || 0)) * arenaStatusClearMultiplier(unit);
      const freshStage = activeTraitStage(unit, "fresh");
      if (freshStage > 0) {
        negativeDt *= 1 + ([0, 0.15, 0.25, 0.4][freshStage] || 0.4);
      }
      if (hasNegativeStatus(unit) && unit.item?.firstDebuffCleanseHealPct && !unit.firstDebuffCleanseUsed) {
        unit.firstDebuffCleanseUsed = true;
        cleanseUnit(unit);
        healUnit(unit, Math.max(1, Math.round(unit.maxHp * unit.item.firstDebuffCleanseHealPct)));
        burst({ x: unit.x, y: unit.y }, unit.item.accent || "#2e6f2b");
      }
      if (unit.burn) {
        unit.burn.remaining -= negativeDt;
        unit.burn.tick -= dt;
        if (unit.burn.tick <= 0) {
          unit.burn.tick += 1;
          applyDamage(unit, unit.burn.damage, unit.burn.source || unit, battle, {
            color: "#e24822",
            particleType: "pepperoni_slice",
            status: true,
            noItemTriggers: true,
          });
        }
        if (unit.burn.remaining <= 0) unit.burn = null;
      }
      if (unit.mark) {
        unit.mark.remaining -= negativeDt;
        if (unit.mark.remaining <= 0) unit.mark = null;
      }
      if (unit.teamVulnerable) {
        unit.teamVulnerable.remaining -= negativeDt;
        if (unit.teamVulnerable.remaining <= 0) unit.teamVulnerable = null;
      }
      if (unit.haste) {
        unit.haste.remaining -= dt;
        if (unit.haste.remaining <= 0) unit.haste = null;
      }
      if (unit.attackBoost) {
        unit.attackBoost.remaining -= dt;
        if (unit.attackBoost.remaining <= 0) unit.attackBoost = null;
      }
      if (unit.attackSlow) {
        unit.attackSlow.remaining -= negativeDt;
        if (unit.attackSlow.remaining <= 0) unit.attackSlow = null;
      }
      if (unit.antiSupport) {
        unit.antiSupport.remaining -= negativeDt;
        if (unit.antiSupport.remaining <= 0) unit.antiSupport = null;
      }
      if (unit.slowed) {
        unit.slowed.remaining -= negativeDt;
        if (unit.slowed.remaining <= 0) unit.slowed = null;
      }
      if (unit.item?.timedHastePct && !unit.timedHasteUsed && battle.elapsed >= (unit.item.timedHasteAt || 10)) {
        unit.timedHasteUsed = true;
        unit.haste = {
          remaining: unit.item.timedHasteDuration || 4,
          pct: unit.item.timedHastePct,
        };
        burst({ x: unit.x, y: unit.y }, unit.item.accent || "#f4efe2");
      }
      if (unit.item?.periodicDamage) {
        unit.periodicItemTick = (unit.periodicItemTick ?? (unit.item.periodicInterval || 3)) - dt;
        if (unit.periodicItemTick <= 0) {
          unit.periodicItemTick += unit.item.periodicInterval || 3;
          const foes = (unit.side === "ally" ? battle.enemies : battle.allies).filter((foe) => !foe.dead);
          if (foes.length) {
            const target = foes[randInt(foes.length)];
            const popDamage = Math.max(1, Math.round((unit.item.periodicDamage || 0) + unit.atk * (unit.item.periodicDamagePct || 0)));
            applyDamage(target, popDamage, unit, battle, {
              color: unit.item.accent || "#d98b19",
              particleType: unit.item.id,
              status: true,
            });
          }
        }
      }
      if (unit.item?.teamHastePct) {
        unit.teamHasteTick = (unit.teamHasteTick ?? (unit.item.teamHasteInterval || 5)) - dt;
        if (unit.teamHasteTick <= 0) {
          unit.teamHasteTick += unit.item.teamHasteInterval || 5;
          const allies = (unit.side === "enemy" ? battle.enemies : battle.allies).filter((ally) => !ally.dead);
          allies.forEach((ally) => {
            ally.haste = {
              remaining: unit.item.teamHasteDuration || 2.5,
              pct: unit.item.teamHastePct,
            };
            burst({ x: ally.x, y: ally.y }, unit.item.accent || "#d8c27a");
          });
        }
      }
      if (unit.item?.selfBurnDamagePct) {
        unit.selfBurnTick = (unit.selfBurnTick ?? 1) - dt;
        if (unit.selfBurnTick <= 0) {
          unit.selfBurnTick += 1;
          applyDamage(unit, Math.max(1, Math.round(unit.maxHp * unit.item.selfBurnDamagePct)), unit, battle, {
            color: unit.item.accent || "#d97813",
            particleType: unit.item.id,
            status: true,
            noDeathSave: true,
          });
        }
      }
      if (unit.item?.lateFightDamagePct) {
        const start = unit.item.lateFightStart || 8;
        const interval = unit.item.lateFightInterval || 4;
        const maxStacks = unit.item.lateFightMaxStacks || 4;
        unit.lateFightStacks = battle.elapsed >= start ? Math.min(maxStacks, 1 + Math.floor((battle.elapsed - start) / interval)) : 0;
      }
    });
  }

  function attackClockMultiplier(unit) {
    let multiplier = 1 + (unit.haste?.pct || 0);
    multiplier += unit.drinkAttackSpeedPct || 0;
    multiplier *= 1 - Math.min(0.7, unit.attackSlow?.pct || 0);
    if (hasFavoriteTopping(unit)) multiplier += 0.04;
    multiplier += arenaAttackClockBonus(unit);
    const streetStage = activeTraitStage(unit, "street_food");
    if (streetStage > 0) {
      multiplier += [0, 0.08, 0.16, 0.26][streetStage] || 0.26;
    }
    if (unit.ability === "kernel_combo" && unit.kernelStacks > 0) {
      multiplier += Math.min(0.65, unit.kernelStacks * popcornStackHaste(unit));
    }
    if (unit.item?.lowHpAttackSpeedPct && unit.hp / unit.maxHp <= (unit.item.lowHpThreshold || 0.5)) {
      multiplier += unit.item.lowHpAttackSpeedPct;
    }
    if (unit.item?.shieldedAttackSpeedPct && unit.shield > 0) {
      multiplier += unit.item.shieldedAttackSpeedPct;
    }
    if (unit.item?.exhaustedSpeedPenaltyPct && (unit.itemAttackCount || 0) >= (unit.item.firstAttacksCount || 3)) {
      multiplier *= 1 - unit.item.exhaustedSpeedPenaltyPct;
    }
    return Math.max(0.25, multiplier);
  }

  function performCombatAction(unit, battle, foes) {
    const allies = unit.side === "ally" ? battle.allies : battle.enemies;
    if (unit.ability === "heal") {
      const friend = weakestDamaged(allies);
      if (friend) {
        const healed = healUnit(friend, supportAmount(unit, healAmount(unit)));
        const shielded = grantShield(friend, supportAmount(unit, Math.round(unit.abilityPower * 0.35)));
        applySupportItem(unit, friend);
        applyExtraAdjacentHeal(unit, friend, healed, allies);
        if (healed > 0 || shielded > 0) emitSupportProjectile(unit, friend, battle, "#55a375");
        burst({ x: friend.x, y: friend.y }, "#55a375");
        return;
      }
      const shieldTarget = lowestShieldedAlly(allies);
      if (shieldTarget) {
        const shielded = grantShield(shieldTarget, supportAmount(unit, noodleFallbackShield(unit)));
        applySupportItem(unit, shieldTarget);
        if (shielded > 0) emitSupportProjectile(unit, shieldTarget, battle, "#55a375");
        burst({ x: shieldTarget.x, y: shieldTarget.y }, "#55a375");
        return;
      }
    }

    if (unit.ability === "cleanse") {
      const friend = mostStatusedAlly(allies);
      if (friend) {
        cleanseUnit(friend);
        const healed = healUnit(friend, supportAmount(unit, lemonCleanseHeal(unit)));
        grantShield(friend, supportAmount(unit, lemonCleanseShield(unit)));
        friend.haste = {
          remaining: 2.5,
          pct: lemonCleanseHaste(unit),
        };
        applySupportItem(unit, friend);
        applyExtraAdjacentHeal(unit, friend, healed, allies);
        emitSupportProjectile(unit, friend, battle, "#f2dc5d");
        burst({ x: friend.x, y: friend.y }, "#f2dc5d");
        return;
      }
      const backup = weakestDamaged(allies);
      if (backup) {
        const healed = healUnit(backup, supportAmount(unit, lemonCleanseHeal(unit)));
        const shielded = grantShield(backup, supportAmount(unit, lemonCleanseShield(unit)));
        backup.haste = {
          remaining: 2.5,
          pct: lemonCleanseHaste(unit),
        };
        applySupportItem(unit, backup);
        applyExtraAdjacentHeal(unit, backup, healed, allies);
        if (healed > 0 || shielded > 0) emitSupportProjectile(unit, backup, battle, "#f2dc5d");
        burst({ x: backup.x, y: backup.y }, "#f2dc5d");
        return;
      }
    }

    const target = chooseTarget(unit, foes);
    if (!target) return;

    if (unit.ability === "execute") {
      const wounded = target.hp / target.maxHp <= 0.5;
      const bonus = wounded ? executeBonus(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle);
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "cleave") {
      applyDamage(target, unit.atk, unit, battle);
      const splash = cleaveDamage(unit);
      foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid && foe.col === target.col)
        .forEach((foe) => applyDamage(foe, splash, unit, battle, { color: "#f1c84b" }));
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "back_row") {
      applyDamage(target, unit.atk, unit, battle);
      if (unit.item?.backRowTargeting) {
        applyDamage(target, berryPretzelComboDamage(unit), unit, battle, {
          color: unit.item.accent || "#f1d270",
          particleType: unit.item.id,
          status: true,
        });
      }
      const extras = Math.min(unit.tier - 1, foes.length - 1);
      const volleyTargets = foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid)
        .sort((a, b) => (a.col - b.col) || distSq(unit, a) - distSq(unit, b))
        .slice(0, extras);
      volleyTargets.forEach((foe) => applyDamage(foe, volleyDamage(unit), unit, battle, { color: "#dd5ea8" }));
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "slow") {
      applyDamage(target, unit.atk, unit, battle, { color: "#f0d56b" });
      if (!target.dead) target.cooldown += pretzelDelay(unit);
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "pepper_dash") {
      const backPressure = target.col === BACK_COL || target.burn;
      applyDamage(target, unit.atk + (backPressure ? pepperPokeBonus(unit) : 0), unit, battle, { color: "#f26a35" });
      if (!target.dead) {
        target.burn = {
          remaining: statusDuration(unit, pepperBurnDuration(unit)),
          tick: 1,
          damage: pepperBurnDamage(unit),
          source: unit,
        };
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "armor_break") {
      const tough = target.shield > 0 || target.maxHp >= unit.maxHp * 1.15 || target.col === FRONT_COL;
      const bonus = tough ? armorBreakBonus(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle, { color: tough ? "#d9852f" : unit.accent });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "bagel_build") {
      applyDamage(target, unit.atk, unit, battle, { color: "#c98a3a" });
      const buildTargets = allies
        .filter((ally) => !ally.dead && (isAdjacentSlot(unit, ally) || ally.col === FRONT_COL))
        .sort((a, b) => (a.shield || 0) - (b.shield || 0))
        .slice(0, 2);
      buildTargets.forEach((ally) => {
        const shielded = grantShield(ally, supportAmount(unit, bagelBuildShield(unit)));
        applySupportItem(unit, ally);
        if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, battle, "#c98a3a");
      });
      burst({ x: unit.x, y: unit.y }, "#f0d56b");
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "status_spread") {
      const bonus = hasNegativeStatus(target) ? kimchiStatusBonus(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle, { color: "#e65036" });
      if (!target.dead) {
        target.burn = {
          remaining: statusDuration(unit, kimchiBurnDuration(unit)),
          tick: 1,
          damage: kimchiBurnDamage(unit),
          source: unit,
        };
        target.mark = {
          sourceUid: unit.uid,
          remaining: statusDuration(unit, kimchiMarkDuration(unit)),
          damagePct: kimchiMarkPct(unit),
        };
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "shakshuka_burn") {
      applyDamage(target, unit.atk + (target.burn ? shakshukaSplashDamage(unit) : 0), unit, battle, { color: "#e24822" });
      const burnTargets = [target, ...foes.filter((foe) => !foe.dead && foe.uid !== target.uid && isAdjacentSlot(target, foe)).slice(0, unit.tier >= 3 ? 2 : 1)];
      burnTargets.forEach((foe, index) => {
        if (foe.dead) return;
        foe.burn = {
          remaining: statusDuration(unit, shakshukaBurnDuration(unit)),
          tick: 1,
          damage: Math.max(1, Math.round(shakshukaBurnDamage(unit) * (index === 0 ? 1 : 0.65))),
          source: unit,
        };
        if (index > 0) {
          applyDamage(foe, shakshukaSplashDamage(unit), unit, battle, {
            color: "#f4d35e",
            status: true,
          });
        }
      });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "sticky_lane") {
      applyDamage(target, unit.atk, unit, battle, { color: "#d8a64a" });
      foes
        .filter((foe) => !foe.dead && foe.col === target.col)
        .forEach((foe) => {
          foe.cooldown += waffleLaneDelay(unit);
          foe.slowed = { remaining: statusDuration(unit, 1.4) };
        });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "kernel_combo") {
      unit.kernelStacks = Math.min(popcornMaxStacks(unit), (unit.kernelStacks || 0) + 1);
      applyDamage(target, unit.atk + popcornKernelBonus(unit), unit, battle, { color: "#f4d35e" });
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "sour_aura") {
      const bonus = target.shield > 0 ? yogurtShieldCrackDamage(unit) : 0;
      applyDamage(target, unit.atk + bonus, unit, battle, { color: "#d6ecff" });
      if (!target.dead) {
        target.antiSupport = {
          remaining: statusDuration(unit, yogurtSourDuration(unit)),
          reductionPct: yogurtSourPct(unit),
        };
        target.attackSlow = {
          remaining: statusDuration(unit, unit.tier >= 3 ? 2 : 1.5),
          pct: unit.tier >= 3 ? 0.16 : 0.1,
        };
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "row_shield") {
      applyDamage(target, unit.atk, unit, battle, { color: "#f0dcb8" });
      allies
        .filter((ally) => !ally.dead && ally.row === unit.row)
        .forEach((ally) => {
          const shielded = grantShield(ally, supportAmount(unit, dumplingRowShield(unit)));
          applySupportItem(unit, ally);
          if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, battle, "#f0dcb8");
        });
      burst({ x: unit.x, y: unit.y }, "#f0dcb8");
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "iceberg_lock") {
      applyDamage(target, unit.atk, unit, battle, { color: "#7ec7e8" });
      if (!target.dead) {
        target.cooldown += oysterLockDelay(unit);
        target.attackSlow = {
          remaining: statusDuration(unit, 2.4 + unit.tier * 0.25),
          pct: oysterSlowPct(unit),
        };
      }
      const shielded = grantShield(unit, supportAmount(unit, oysterLockShield(unit)));
      if (shielded > 0) burst({ x: unit.x, y: unit.y }, "#d8f2ff");
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    if (unit.ability === "pearl_stun") {
      applyDamage(target, unit.atk, unit, battle, { color: "#c99bd8" });
      unit.pearlAttackCount = (unit.pearlAttackCount || 0) + 1;
      if (!target.dead && unit.pearlAttackCount % bobaStunEvery(unit) === 0) {
        target.cooldown += bobaStunDelay(unit);
        target.attackSlow = {
          remaining: statusDuration(unit, bobaSlowDuration(unit)),
          pct: bobaAttackSlow(unit),
        };
        const bounceTarget = foes
          .filter((foe) => !foe.dead && foe.uid !== target.uid && isAdjacentSlot(target, foe))
          .sort((a, b) => distSq(target, a) - distSq(target, b))[0];
        if (bounceTarget && unit.tier >= 3) {
          bounceTarget.cooldown += Math.round(bobaStunDelay(unit) * 0.65 * 100) / 100;
          bounceTarget.slowed = { remaining: statusDuration(unit, 1.2) };
        }
      }
      applyOnAttackItem(unit, target, battle, foes);
      return;
    }

    applyDamage(target, unit.atk, unit, battle);
    applyOnAttackItem(unit, target, battle, foes);
    if (unit.ability === "guard") {
      const friend = lowestShieldedAlly(allies);
      if (friend) {
        const shielded = grantShield(friend, supportAmount(unit, guardShield(unit)));
        applySupportItem(unit, friend);
        if (shielded > 0 && friend.uid !== unit.uid) emitSupportProjectile(unit, friend, battle, "#6fbf8f");
        burst({ x: friend.x, y: friend.y }, "#6fbf8f");
      }
    }
  }

  function applyOnAttackItem(unit, target, battle, foes = []) {
    if (!unit?.item || unit.dead) return;
    unit.itemAttackCount = (unit.itemAttackCount || 0) + 1;
    if (unit.item.onAttackShieldPct) {
      const shield = Math.max(1, Math.round(unit.maxHp * unit.item.onAttackShieldPct + unit.abilityPower * 0.18));
      grantShield(unit, shield);
      burst({ x: unit.x, y: unit.y }, unit.item.accent || "#6fbf8f");
    }
    if (unit.item.selfHealPct && unit.itemAttackCount % (unit.item.everyNAttacks || 3) === 0) {
      healUnit(unit, Math.max(1, Math.round(unit.maxHp * unit.item.selfHealPct)));
      burst({ x: unit.x, y: unit.y }, unit.item.accent || "#4f8d2b");
    }
    if (target && battle && unit.item.splashDamagePct) {
      const splash = Math.max(1, Math.round(unit.atk * unit.item.splashDamagePct));
      foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid && isAdjacentSlot(target, foe))
        .forEach((foe) => applyDamage(foe, splash, unit, battle, {
          color: unit.item.accent || "#c03b87",
          particleType: unit.item.id,
          status: true,
        }));
    }
    if (target && battle && unit.item.bounceDamagePct) {
      const bounceTarget = foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid)
        .sort((a, b) => distSq(target, a) - distSq(target, b))[0];
      if (bounceTarget) {
        applyDamage(bounceTarget, Math.max(1, Math.round(unit.atk * unit.item.bounceDamagePct)), unit, battle, {
          color: unit.item.accent || "#c06417",
          particleType: unit.item.id,
          status: true,
        });
      }
    }
    if (target && battle && unit.item.pierceDamagePct) {
      const pierceTarget = foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid && foe.row === target.row && foe.col < target.col)
        .sort((a, b) => b.col - a.col)[0];
      if (pierceTarget) {
        applyDamage(pierceTarget, Math.max(1, Math.round(unit.atk * unit.item.pierceDamagePct)), unit, battle, {
          color: unit.item.accent || "#8c4e1d",
          particleType: unit.item.id,
          status: true,
        });
      }
    }
    if (target && battle && unit.item.executeSplashDamagePct && target.hp / target.maxHp <= (unit.item.executeSplashThreshold || 0.45)) {
      const splash = Math.max(1, Math.round(unit.atk * unit.item.executeSplashDamagePct));
      foes
        .filter((foe) => !foe.dead && foe.uid !== target.uid && isAdjacentSlot(target, foe))
        .forEach((foe) => applyDamage(foe, splash, unit, battle, {
          color: unit.item.accent || "#ffe37a",
          particleType: unit.item.id,
          status: true,
        }));
      burst({ x: target.x, y: target.y }, unit.item.accent || "#ffe37a");
    }
    if (target && !target.dead && unit.item.burnDamagePct) {
      target.burn = {
        remaining: statusDuration(unit, unit.item.burnDuration || 3),
        tick: 1,
        damage: Math.max(1, Math.round(unit.atk * unit.item.burnDamagePct)),
        source: unit,
      };
    }
    if (target && !target.dead && unit.item.markDamagePct) {
      target.mark = {
        sourceUid: unit.uid,
        remaining: statusDuration(unit, unit.item.markDuration || 4),
        damagePct: unit.item.markDamagePct,
      };
    }
    if (target && !target.dead && unit.item.teamVulnerabilityPct) {
      target.teamVulnerable = {
        remaining: statusDuration(unit, unit.item.teamVulnerabilityDuration || 4),
        pct: unit.item.teamVulnerabilityPct,
      };
    }
    if (target && !target.dead && unit.item.cooldownDelay) {
      target.cooldown += unit.item.cooldownDelay;
      target.slowed = { remaining: statusDuration(unit, 1.2) };
    }
    if (target && !target.dead && unit.item.attackSlowPct) {
      target.attackSlow = {
        remaining: statusDuration(unit, unit.item.attackSlowDuration || 3),
        pct: unit.item.attackSlowPct,
      };
    }
    if (target && !target.dead && unit.item.antiSupportPct) {
      target.antiSupport = {
        remaining: statusDuration(unit, unit.item.antiSupportDuration || 4),
        reductionPct: unit.item.antiSupportPct,
      };
    }
  }

  function triggerLowHpBurn(unit, battle) {
    if (!unit?.item?.lowHpBurnDamagePct || unit.lowHpBurnUsed || unit.dead || unit.hp / unit.maxHp > (unit.item.lowHpBurnThreshold || 0.4)) return;
    unit.lowHpBurnUsed = true;
    const foes = (unit.side === "ally" ? battle.enemies : battle.allies).filter((foe) => !foe.dead && isAdjacentSlot(unit, foe));
    foes.forEach((foe) => {
      foe.burn = {
        remaining: statusDuration(unit, unit.item.lowHpBurnDuration || 3),
        tick: 1,
        damage: Math.max(1, Math.round(unit.atk * unit.item.lowHpBurnDamagePct)),
        source: unit,
      };
    });
    burst({ x: unit.x, y: unit.y }, unit.item.accent || "#7aa530");
  }

  function statusDuration(source, duration) {
    return duration * (1 + (source?.item?.statusDurationBonusPct || 0) + favoriteToppingBonusPct(source) * 0.75 + arenaStatusDurationBonus(source));
  }

  function applyBattleStartTraitEffects(units, foes = []) {
    const breakfastStage = traitStageForUnits(units, "breakfast");
    if (breakfastStage > 0) {
      units
        .filter((unit) => !unit.dead)
        .forEach((unit) => {
          grantShield(unit, Math.max(2, Math.round(unit.maxHp * (breakfastStage >= 2 ? 0.09 : 0.055))), { noShare: true });
          if (breakfastStage >= 2 && unitHasTrait(unit, "breakfast")) {
            unit.haste = { remaining: 2.5, pct: 0.1 };
          }
          burst({ x: unit.x, y: unit.y }, traitInfo("breakfast").color);
        });
    }

    const oceanStage = traitStageForUnits(units, "ocean");
    if (oceanStage > 0) {
      const delay = oceanStage >= 2 ? 0.3 : 0.14;
      foes
        .filter((foe) => !foe.dead)
        .forEach((foe) => {
          foe.cooldown += delay;
          foe.slowed = { remaining: oceanStage >= 2 ? 2 : 1.2 };
          burst({ x: foe.x, y: foe.y }, traitInfo("ocean").color);
        });
    }

    const freshStage = traitStageForUnits(units, "fresh");
    if (freshStage > 0) {
      units
        .filter((unit) => !unit.dead && unitHasTrait(unit, "fresh"))
        .forEach((unit) => {
          if (freshStage >= 2 && hasNegativeStatus(unit)) cleanseUnit(unit);
          if (freshStage >= 3) {
            grantShield(unit, Math.max(2, Math.round(unit.maxHp * 0.08)), { noShare: true });
          }
          burst({ x: unit.x, y: unit.y }, traitInfo("fresh").color);
        });
    }
  }

  function applyBattleStartAbilities(units, foes = []) {
    units
      .filter((unit) => unit.ability === "syrup_start")
      .forEach((unit) => {
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            const shielded = grantShield(ally, supportAmount(unit, syrupShield(unit)));
            ally.haste = { remaining: 2, pct: syrupHaste(unit) };
            applySupportItem(unit, ally);
            if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, state.battle, "#e8b765");
          });
        burst({ x: unit.x, y: unit.y }, "#e8b765");
      });
    units
      .filter((unit) => unit.ability === "bagel_build")
      .forEach((unit) => {
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            grantShield(ally, supportAmount(unit, Math.round(bagelBuildShield(unit) * 0.85)));
            ally.haste = { remaining: 2, pct: bagelBuildHaste(unit) };
            applySupportItem(unit, ally);
          });
        burst({ x: unit.x, y: unit.y }, "#f0d56b");
      });
    units
      .filter((unit) => unit.ability === "row_shield")
      .forEach((unit) => {
        units
          .filter((ally) => !ally.dead && ally.row === unit.row)
          .forEach((ally) => {
            const shielded = grantShield(ally, supportAmount(unit, Math.round(dumplingRowShield(unit) * 0.8)));
            applySupportItem(unit, ally);
            if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, state.battle, "#f0dcb8");
          });
        burst({ x: unit.x, y: unit.y }, "#f0dcb8");
      });
    units
      .filter((unit) => unit.ability === "survive_scale" && unit.tier >= 2 && (unit.permanentHpBonus || 0) > 0)
      .forEach((unit) => {
        units
          .filter((ally) => !ally.dead && isAdjacentSlot(unit, ally))
          .forEach((ally) => {
            const shielded = grantShield(ally, supportAmount(unit, mochiAdjacentShield(unit)));
            applySupportItem(unit, ally);
            if (shielded > 0 && ally.uid !== unit.uid) emitSupportProjectile(unit, ally, state.battle, unit.accent);
          });
        burst({ x: unit.x, y: unit.y }, unit.accent);
      });
    units
      .filter((unit) => unit.ability === "pull_start")
      .forEach((unit) => applyKrakenPull(unit, foes));
    units
      .filter((unit) => unit.ability === "iceberg_lock")
      .forEach((unit) => {
        const targets = foes
          .filter((foe) => !foe.dead && foe.col === FRONT_COL)
          .sort((a, b) => distSq(unit, a) - distSq(unit, b))
          .slice(0, unit.tier >= 3 ? 2 : 1);
        targets.forEach((foe) => {
          foe.cooldown += oysterLockDelay(unit);
          foe.slowed = { remaining: statusDuration(unit, 1.8) };
          burst({ x: foe.x, y: foe.y }, "#7ec7e8");
        });
        grantShield(unit, supportAmount(unit, oysterLockShield(unit)), { noShare: true });
        burst({ x: unit.x, y: unit.y }, "#d8f2ff");
      });
    units
      .filter((unit) => unit.ability === "ginger_decoy")
      .forEach((unit) => {
        const decoy = makeGingerDecoy(unit);
        units.push(decoy);
        emitSupportProjectile(unit, decoy, state.battle, "#f5f0df");
        burst({ x: unit.x, y: unit.y }, "#f5f0df");
      });
  }

  function applyKrakenPull(unit, foes) {
    const target = foes
      .filter((foe) => !foe.dead && foe.col === BACK_COL)
      .sort((a, b) => (a.col - b.col) || distSq(unit, b) - distSq(unit, a))[0];
    if (!target) return;
    const nextCol = Math.min(FRONT_COL, (target.col ?? BACK_COL) + 1);
    const newSlot = (target.row ?? 0) * BOARD_COLS + nextCol;
    positionBattleUnit(target, target.side, newSlot);
    target.cooldown += krakenPullDelay(unit);
    target.slowed = { remaining: statusDuration(unit, 1.6) };
    if (state.battle) applyDamage(target, krakenPullDamage(unit), unit, state.battle, { color: unit.accent, particleType: unit.typeId, status: true });
    burst({ x: target.x, y: target.y }, unit.accent);
  }

  function makeGingerDecoy(source) {
    return {
      ...makeUnit("toast_tortoise", 1),
      uid: unitSeq++,
      typeId: source.typeId,
      lineName: "Gingerbread Decoy",
      name: "Ginger Decoy",
      short: "Decoy",
      tier: 1,
      rarity: source.rarity,
      color: source.color,
      accent: source.accent,
      ability: "ginger_decoy_summon",
      abilityText: "Crumble decoy",
      role: "Decoy",
      maxHp: gingerDecoyHp(source),
      hp: gingerDecoyHp(source),
      atk: 0,
      speed: 99,
      abilityPower: 0,
      item: null,
      shield: 0,
      cooldown: 999,
      side: source.side,
      slot: source.slot,
      col: source.col,
      row: source.row,
      x: source.x + (source.side === "ally" ? -30 : 30),
      y: source.y + 26,
      dead: false,
      ignoreTraits: true,
      decoySourceUid: source.uid,
      crumbleDamage: gingerCrumbleDamage(source),
    };
  }

  function supportAmount(unit, amount) {
    const sweetStage = activeTraitStage(unit, "sweet");
    const sweetBonus = [0, 0.12, 0.22, 0.32][sweetStage] || 0;
    const freshStage = activeTraitStage(unit, "fresh");
    const freshBonus = [0, 0.08, 0.14, 0.2][freshStage] || 0;
    return Math.max(1, Math.round(amount * (1 + (unit?.item?.supportBonusPct || 0) + sweetBonus + freshBonus + favoriteToppingBonusPct(unit)) * arenaSupportMultiplier(unit)));
  }

  function applySupportItem(source, ally) {
    if (!source?.item || !ally || ally.dead) return;
    if (source.item.supportHastePct) {
      ally.haste = {
        remaining: source.item.supportHasteDuration || 3,
        pct: source.item.supportHastePct + (source.ability === "heal" ? 0.06 : 0),
      };
      burst({ x: ally.x, y: ally.y }, source.item.accent || "#b56b12");
    }
    if (source.item.supportAttackBuffPct) {
      ally.attackBoost = {
        remaining: source.item.supportAttackBuffDuration || 3,
        pct: source.item.supportAttackBuffPct,
      };
      burst({ x: ally.x, y: ally.y }, source.item.accent || "#d7a64e");
    }
    if (source.item.supportRowEchoPct && state.battle) {
      const allies = (source.side === "enemy" ? state.battle.enemies : state.battle.allies).filter((unit) => !unit.dead);
      const echoShield = Math.max(1, Math.round(source.abilityPower * source.item.supportRowEchoPct));
      allies
        .filter((rowAlly) => rowAlly.uid !== ally.uid && rowAlly.row === ally.row)
        .forEach((rowAlly) => {
          grantShield(rowAlly, echoShield, { noShare: true });
          burst({ x: rowAlly.x, y: rowAlly.y }, source.item.accent || "#f2c94c");
        });
    }
  }

  function applyExtraAdjacentHeal(source, primary, healed, allies) {
    if (!source?.item?.extraAdjacentHealPct || healed <= 0) return;
    const target = allies
      .filter((ally) => ally.uid !== primary.uid && !ally.dead && ally.hp < ally.maxHp && isAdjacentSlot(primary, ally))
      .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (!target) return;
    healUnit(target, Math.max(1, Math.round(healed * source.item.extraAdjacentHealPct)));
    applySupportItem(source, target);
    burst({ x: target.x, y: target.y }, source.item.accent || "#7a5635");
  }

  function isAdjacentSlot(a, b) {
    return Math.abs((a.col ?? 0) - (b.col ?? 0)) + Math.abs((a.row ?? 0) - (b.row ?? 0)) <= 1;
  }

  function hasNegativeStatus(unit) {
    return Boolean(unit?.burn || unit?.mark || unit?.teamVulnerable || unit?.antiSupport || unit?.slowed || unit?.attackSlow);
  }

  function statusCount(unit) {
    return [unit?.burn, unit?.mark, unit?.teamVulnerable, unit?.antiSupport, unit?.slowed, unit?.attackSlow].filter(Boolean).length;
  }

  function mostStatusedAlly(units) {
    const candidates = units.filter((unit) => !unit.dead && hasNegativeStatus(unit));
    if (!candidates.length) return null;
    return candidates.reduce((best, next) => {
      const score = statusCount(next);
      const bestScore = statusCount(best);
      if (score !== bestScore) return score > bestScore ? next : best;
      return next.hp / next.maxHp < best.hp / best.maxHp ? next : best;
    }, candidates[0]);
  }

  function cleanseUnit(unit) {
    unit.burn = null;
    unit.mark = null;
    unit.teamVulnerable = null;
    unit.antiSupport = null;
    unit.slowed = null;
    unit.attackSlow = null;
  }

  function applyDamage(target, amount, source, battle, options = {}) {
    if (!target || target.dead) return 0;
    if (!options.status && !options.noItemTriggers && target.item?.firstHitRedirect && !target.firstHitRedirectUsed) {
      target.firstHitRedirectUsed = true;
      battle.attacks.push({
        from: source.uid,
        to: target.uid,
        t: ATTACK_ANIMATION_SECONDS,
        duration: ATTACK_ANIMATION_SECONDS,
        color: target.item.accent || "#6f9231",
        particleType: target.item.id,
      });
      burst({ x: target.x, y: target.y }, target.item.accent || "#6f9231");
      return 0;
    }
    let adjustedAmount = amount;
    if (!options.status && target.mark?.sourceUid === source?.uid) {
      adjustedAmount *= 1 + (target.mark.damagePct || 0);
    }
    if (!options.status && target.teamVulnerable?.pct) {
      adjustedAmount *= 1 + target.teamVulnerable.pct;
    }
    if (!options.status && source?.attackBoost?.pct) {
      adjustedAmount *= 1 + source.attackBoost.pct;
    }
    if (!options.status && hasFavoriteTopping(source)) {
      adjustedAmount *= 1.06;
    }
    const spicyStage = !options.status ? activeTraitStage(source, "spicy") : 0;
    if (spicyStage > 0) {
      adjustedAmount *= 1 + (spicyStage >= 2 ? 0.16 : 0.08);
    }
    const snackStage = !options.status ? activeTraitStage(source, "snack") : 0;
    if (snackStage > 0 && (source.snackTraitHits || 0) < 3) {
      adjustedAmount *= 1 + (snackStage >= 2 ? 0.22 : 0.12);
      source.snackTraitHits = (source.snackTraitHits || 0) + 1;
    }
    if (!options.status && source?.item?.firstAttacksBonusPct && (source.itemAttackCount || 0) < (source.item.firstAttacksCount || 3)) {
      adjustedAmount *= 1 + source.item.firstAttacksBonusPct;
    }
    if (!options.status && source?.item?.lateFightDamagePct && source.lateFightStacks > 0) {
      adjustedAmount *= 1 + source.item.lateFightDamagePct * source.lateFightStacks;
    }
    if (!options.status && source?.item?.shieldedAttackBonusPct && source.shield > 0) {
      adjustedAmount *= 1 + source.item.shieldedAttackBonusPct;
    }
    if (!options.status && source?.item?.shieldedTargetDamagePct && target.shield > 0) {
      adjustedAmount *= 1 + source.item.shieldedTargetDamagePct;
    }
    if (!options.status && source?.item?.executeSplashBonusPct && target.hp / target.maxHp <= (source.item.executeSplashThreshold || 0.45)) {
      adjustedAmount *= 1 + source.item.executeSplashBonusPct;
    }
    if (!options.status && target.item?.frontRowDamageReductionPct && target.col === FRONT_COL) {
      adjustedAmount *= 1 - target.item.frontRowDamageReductionPct;
    }
    if (options.status && target.item?.statusDamageReductionPct) {
      adjustedAmount *= 1 - target.item.statusDamageReductionPct;
    }
    if (!options.status && target.item?.damageTakenPct) {
      adjustedAmount *= 1 + target.item.damageTakenPct;
    }
    adjustedAmount *= arenaDamageMultiplier(source, target, options);
    let damage = Math.max(1, Math.round(adjustedAmount));
    let absorbed = 0;
    if (target.shield > 0) {
      absorbed = Math.min(target.shield, damage);
      target.shield -= absorbed;
      damage -= absorbed;
    }
    if (damage > 0) target.hp = Math.max(0, target.hp - damage);
    recordCombatDamage(battle, source, target, damage, absorbed);
    if (
      absorbed > 0 &&
      !options.status &&
      !options.noItemTriggers &&
      target.hp > 0 &&
      target.item?.shieldCrackleDamagePct &&
      source?.uid &&
      !source.dead &&
      source.side !== target.side
    ) {
      const crackleDamage = shieldCrackleDamage(target);
      applyDamage(source, crackleDamage, target, battle, {
        status: true,
        noItemTriggers: true,
        color: target.item.accent || "#f2b36d",
      });
    }
    if (
      target.hp <= 0 &&
      !target.dead &&
      !options.noDeathSave &&
      target.item?.deathSaveShieldPct &&
      !target.deathSaveUsed
    ) {
      target.deathSaveUsed = true;
      target.hp = 1;
      grantShield(target, Math.max(1, Math.round(target.maxHp * target.item.deathSaveShieldPct)), { noShare: true });
      burst({ x: target.x, y: target.y }, target.item.accent || "#d6b88a");
    }
    if (
      damage > 0 &&
      !options.status &&
      source?.item?.lowHpLifestealPct &&
      source.hp / source.maxHp <= (source.item.lowHpThreshold || 0.5)
    ) {
      healUnit(source, Math.max(1, Math.round(damage * source.item.lowHpLifestealPct)));
    }
    if (damage > 0 && target.item?.onHitShieldPct && !target.dead) {
      const shield = Math.max(1, Math.round(target.maxHp * target.item.onHitShieldPct + target.abilityPower * 0.14));
      grantShield(target, shield);
      burst({ x: target.x, y: target.y }, target.item.accent || "#8f3f20");
    }
    if (damage > 0 && !options.status) {
      if (spicyStage >= 2 && source && !target.dead) {
        target.burn = {
          remaining: statusDuration(source, 2.4),
          tick: 1,
          damage: Math.max(1, Math.round(source.atk * 0.16)),
          source,
        };
      }
      triggerLowHpBurn(target, battle);
    }
    if (damage > 0 && target.ability === "ginger_decoy_summon" && !target.dead) {
      target.hp = Math.max(0, target.hp - gingerDecoyCrumbleOnHit(target));
    }
    if (!options.noProjectile) {
      battle.attacks.push({
        from: source.uid,
        to: target.uid,
        t: ATTACK_ANIMATION_SECONDS,
        duration: ATTACK_ANIMATION_SECONDS,
        color: options.color || source.accent,
        particleType: options.particleType || source.typeId || source.id,
      });
    }
    const attackParticleType = options.particleType || source.typeId || source.id;
    const willDefeat = target.hp <= 0 && !target.dead;
    if (!options.status && (damage > 0 || absorbed > 0) && !willDefeat) {
      foodExplosion({ x: target.x, y: target.y }, options.color || source.accent, attackParticleType, {
        count: 10,
        spread: 14,
      });
    }
    if (willDefeat) {
      target.dead = true;
      target.shield = 0;
      recordCombatKo(battle, source, target);
      if (target.ability === "ginger_decoy_summon" && target.crumbleDamage && battle) {
        const foes = (target.side === "ally" ? battle.enemies : battle.allies).filter((foe) => !foe.dead && isAdjacentSlot(target, foe));
        foes.forEach((foe) => applyDamage(foe, target.crumbleDamage, target, battle, {
          color: target.accent,
          particleType: "gingerbread_golem",
          status: true,
          noItemTriggers: true,
        }));
      }
      defeatExplosion(target);
    }
    return damage;
  }

  function emitSupportProjectile(source, target, battle, color = "#55a375") {
    if (!source || !target || !battle || source.dead || target.dead) return;
    battle.attacks.push({
      from: source.uid,
      to: target.uid,
      t: ATTACK_ANIMATION_SECONDS,
      duration: ATTACK_ANIMATION_SECONDS,
      color,
      particleType: source.typeId || source.id,
      kind: "support",
    });
  }

  function healUnit(unit, amount, options = {}) {
    const reduction = unit.antiSupport?.reductionPct || 0;
    const before = unit.hp;
    const adjusted = Math.max(1, Math.round(amount * (1 - reduction)));
    unit.hp = Math.min(unit.maxHp, unit.hp + adjusted);
    const applied = unit.hp - before;
    if (applied > 0) recordCombatSupport(unit, applied, "heal");
    const overheal = Math.max(0, before + adjusted - unit.maxHp);
    if (overheal > 0 && unit.item?.overhealShieldPct) {
      grantShield(unit, Math.max(1, Math.round(overheal * unit.item.overhealShieldPct)), { noShare: true });
    }
    if (overheal > 0 && unit.item?.teamOverhealShieldPct && state.battle) {
      const allies = unit.side === "enemy" ? state.battle.enemies : state.battle.allies;
      const shield = Math.max(1, Math.round(overheal * unit.item.teamOverhealShieldPct));
      allies
        .filter((ally) => ally.uid !== unit.uid && !ally.dead && isAdjacentSlot(unit, ally))
        .forEach((ally) => {
          grantShield(ally, shield, { noShare: true });
          burst({ x: ally.x, y: ally.y }, unit.item.accent || "#63b7d6");
        });
    }
    if (applied > 0 && !options.noShare) shareReceivedSupport(unit, applied, "heal");
    return applied;
  }

  function grantShield(unit, amount, options = {}) {
    const cap = Math.round(unit.maxHp * (0.5 + (unit.item?.shieldCapBonusPct || 0)));
    const reduction = unit.antiSupport?.reductionPct || 0;
    const before = unit.shield || 0;
    unit.shield = Math.min(cap, before + Math.max(1, Math.round(amount * (1 - reduction))));
    const applied = unit.shield - before;
    if (applied > 0) recordCombatSupport(unit, applied, "shield");
    if (applied > 0 && !options.noShare) shareReceivedSupport(unit, applied, "shield");
    return applied;
  }

  function shareReceivedSupport(unit, amount, kind) {
    if (!unit?.item?.receivedSupportSharePct || amount <= 0 || !state.battle) return;
    const allies = unit.side === "enemy" ? state.battle.enemies : state.battle.allies;
    const share = Math.max(1, Math.round(amount * unit.item.receivedSupportSharePct));
    allies
      .filter((ally) => ally.uid !== unit.uid && !ally.dead && isAdjacentSlot(unit, ally))
      .forEach((ally) => {
        if (kind === "heal") healUnit(ally, share, { noShare: true });
        if (kind === "shield") grantShield(ally, share, { noShare: true });
        burst({ x: ally.x, y: ally.y }, unit.item.accent || "#2b2b25");
      });
  }

  function guardShield(unit) {
    return Math.round(unit.maxHp * 0.1 + unit.abilityPower * 1.25);
  }

  function syrupShield(unit) {
    return Math.round(unit.maxHp * 0.1 + unit.abilityPower * 1.1);
  }

  function syrupHaste(unit) {
    return Number(Math.min(0.18, 0.1 + unit.abilityPower * 0.004).toFixed(2));
  }

  function executeBonus(unit) {
    return Math.round(unit.abilityPower * 1.35);
  }

  function pretzelDelay(unit) {
    return Number(Math.min(1.1, 0.32 + unit.abilityPower * 0.02).toFixed(2));
  }

  function armorBreakBonus(unit) {
    return Math.round(unit.abilityPower * 1.05);
  }

  function cleaveDamage(unit) {
    return Math.max(1, Math.round(unit.atk * (0.42 + unit.tier * 0.07)));
  }

  function volleyDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.75));
  }

  function healAmount(unit) {
    return Math.round(unit.atk * 0.85 + unit.abilityPower * 1.2);
  }

  function noodleFallbackShield(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 1.05 + unit.maxHp * 0.04));
  }

  function pepperPokeBonus(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.62));
  }

  function pepperBurnDamage(unit) {
    return Math.max(1, Math.round(unit.atk * 0.14 + unit.abilityPower * 0.2));
  }

  function pepperBurnDuration(unit) {
    return Number(Math.min(4.5, 2.2 + unit.tier * 0.3).toFixed(1));
  }

  function bagelBuildShield(unit) {
    return Math.max(2, Math.round(unit.maxHp * 0.07 + unit.abilityPower * 0.95));
  }

  function bagelBuildHaste(unit) {
    return Number(Math.min(0.2, 0.06 + unit.abilityPower * 0.004).toFixed(2));
  }

  function donutTreatGold(unit) {
    return Math.max(8, Math.round(8 + unit.abilityPower * 2));
  }

  function kimchiStatusBonus(unit) {
    return Math.round(unit.abilityPower * 0.9);
  }

  function kimchiBurnDamage(unit) {
    return Math.max(1, Math.round(unit.atk * 0.18 + unit.abilityPower * 0.28));
  }

  function kimchiBurnDuration(unit) {
    return Number(Math.min(5, 2.5 + unit.tier * 0.35).toFixed(1));
  }

  function kimchiMarkPct(unit) {
    return Number(Math.min(0.24, 0.08 + unit.abilityPower * 0.005).toFixed(2));
  }

  function kimchiMarkDuration(unit) {
    return Number(Math.min(5.5, 3 + unit.tier * 0.4).toFixed(1));
  }

  function waffleLaneDelay(unit) {
    return Number(Math.min(1, 0.22 + unit.abilityPower * 0.018).toFixed(2));
  }

  function popcornMaxStacks(unit) {
    return 4 + unit.tier;
  }

  function popcornStackHaste(unit) {
    return Number(Math.min(0.08, 0.045 + unit.abilityPower * 0.0015).toFixed(3));
  }

  function popcornDamagePerStack(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.18));
  }

  function popcornKernelBonus(unit) {
    return (unit.kernelStacks || 0) * popcornDamagePerStack(unit);
  }

  function yogurtSourPct(unit) {
    return Number(Math.min(0.42, 0.18 + unit.abilityPower * 0.006).toFixed(2));
  }

  function yogurtSourDuration(unit) {
    return Number(Math.min(5, 2.4 + unit.tier * 0.45).toFixed(1));
  }

  function yogurtShieldCrackDamage(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 0.65));
  }

  function dumplingRowShield(unit) {
    return Math.max(2, Math.round(unit.maxHp * 0.063 + unit.abilityPower * 1.05));
  }

  function lemonCleanseHeal(unit) {
    return Math.max(2, Math.round(unit.atk * 0.7 + unit.abilityPower * 0.8));
  }

  function lemonCleanseShield(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 0.75));
  }

  function lemonCleanseHaste(unit) {
    return Number(Math.min(0.28, 0.1 + unit.abilityPower * 0.006).toFixed(2));
  }

  function shakshukaBurnDamage(unit) {
    return Math.max(1, Math.round(unit.atk * 0.2 + unit.abilityPower * 0.3));
  }

  function shakshukaBurnDuration(unit) {
    return Number(Math.min(5, 2.6 + unit.tier * 0.35).toFixed(1));
  }

  function shakshukaSplashDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.48));
  }

  function oysterLockDelay(unit) {
    return Number(Math.min(1.15, 0.26 + unit.abilityPower * 0.018).toFixed(2));
  }

  function oysterLockShield(unit) {
    return Math.max(2, Math.round(unit.maxHp * 0.06 + unit.abilityPower * 0.75));
  }

  function oysterSlowPct(unit) {
    return Number(Math.min(0.26, 0.1 + unit.abilityPower * 0.004).toFixed(2));
  }

  function krakenPullDelay(unit) {
    return Number(Math.min(0.9, 0.24 + unit.abilityPower * 0.014).toFixed(2));
  }

  function krakenPullDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.45));
  }

  function fortuneShopChance(unit) {
    return Number(Math.min(0.3, 0.1 + unit.tier * 0.04).toFixed(2));
  }

  function mochiHpGain(unit) {
    return Math.max(3, Math.round(unit.abilityPower * 0.9 + unit.tier * 2));
  }

  function mochiAdjacentShield(unit) {
    const stored = unit.permanentHpBonus || 0;
    return stored > 0 ? Math.max(2, Math.round(stored * 0.22 + unit.abilityPower * 0.45)) : 0;
  }

  function gingerDecoyHp(unit) {
    return Math.max(5, Math.round(unit.maxHp * (0.18 + unit.tier * 0.03)));
  }

  function gingerCrumbleDamage(unit) {
    return Math.max(2, Math.round(unit.abilityPower * 0.75));
  }

  function gingerDecoyCrumbleOnHit(unit) {
    return Math.max(1, Math.round(unit.maxHp * 0.12));
  }

  function berryPretzelComboDamage(unit) {
    return Math.max(1, Math.round(unit.abilityPower * 0.4 + unit.tier));
  }

  function bobaStunEvery(unit) {
    return unit.tier >= 4 ? 2 : 3;
  }

  function bobaStunDelay(unit) {
    return Number(Math.min(1.25, 0.45 + unit.abilityPower * 0.018).toFixed(2));
  }

  function bobaAttackSlow(unit) {
    return Number(Math.min(0.34, 0.16 + unit.abilityPower * 0.005).toFixed(2));
  }

  function bobaSlowDuration(unit) {
    return Number(Math.min(3.4, 1.8 + unit.tier * 0.3).toFixed(1));
  }

  function chooseTarget(unit, foes) {
    const living = foes.filter((foe) => !foe.dead);
    if (!living.length) return null;
    const targetColumn = canAttackBackRow(unit) ? backmostOccupiedColumn(living) : frontmostOccupiedColumn(living);
    const candidates = living.filter((foe) => foe.col === targetColumn);
    if (unit.ability === "execute" && !canAttackBackRow(unit)) return weakestEnemy(living);
    return nearest(unit, candidates.length ? candidates : living);
  }

  function canAttackBackRow(unit) {
    return unit.ability === "back_row" || (unit.item?.backRowTargeting && unit.col === BACK_COL);
  }

  function frontmostOccupiedColumn(units) {
    return units.reduce((front, unit) => Math.max(front, unit.col ?? FRONT_COL), BACK_COL);
  }

  function backmostOccupiedColumn(units) {
    return units.reduce((back, unit) => Math.min(back, unit.col ?? BACK_COL), FRONT_COL);
  }

  function nearest(unit, foes) {
    return foes.reduce((best, next) => {
      const bd = distSq(unit, best);
      const nd = distSq(unit, next);
      return nd < bd ? next : best;
    }, foes[0]);
  }

  function weakest(units) {
    const living = units.filter((u) => !u.dead);
    if (!living.length) return null;
    return living.reduce((best, next) => (next.hp / next.maxHp < best.hp / best.maxHp ? next : best), living[0]);
  }

  function weakestDamaged(units) {
    const damaged = units.filter((u) => !u.dead && u.hp < u.maxHp);
    return damaged.length ? weakest(damaged) : null;
  }

  function weakestEnemy(units) {
    return units.reduce((best, next) => {
      const bestScore = best.hp / best.maxHp;
      const nextScore = next.hp / next.maxHp;
      if (nextScore !== bestScore) return nextScore < bestScore ? next : best;
      return next.hp < best.hp ? next : best;
    }, units[0]);
  }

  function lowestShieldedAlly(units) {
    const living = units.filter((u) => !u.dead);
    if (!living.length) return null;
    return living.reduce((best, next) => {
      const bestShield = best.shield || 0;
      const nextShield = next.shield || 0;
      if (nextShield !== bestShield) return nextShield < bestShield ? next : best;
      return next.hp / next.maxHp < best.hp / best.maxHp ? next : best;
    }, living[0]);
  }

  function distSq(a, b) {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  }

  function clearParticles() {
    state.particles.length = 0;
  }

  function particleSpriteSrc(spriteKind, particleType, particleTier) {
    if (!particleType) return null;
    if (spriteKind === "drink") return DRINK_THROWABLE_SPRITES[particleType] || null;
    if (spriteKind === "item") return ITEM_TIER_SPRITES[particleType]?.[itemTier(particleTier)] || ITEM_SPRITES[particleType] || null;
    return ATTACK_PARTICLE_SPRITES[particleType] || null;
  }

  function burst(pos, color, options = {}) {
    const count = options.count || 14;
    const particleType = options.particleType;
    const particleSprite = options.particleSprite || (options.food ? "attack" : null);
    const particleTier = options.particleTier || 1;
    const imageSrc = particleSpriteSrc(particleSprite, particleType, particleTier);
    const foodParticles = Boolean(options.food && imageSrc);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const minSpeed = options.speedMin || (foodParticles ? 95 : 45);
      const maxSpeed = options.speedMax || (foodParticles ? 250 : 135);
      const speed = minSpeed + Math.random() * Math.max(0, maxSpeed - minSpeed);
      const size = options.size || (foodParticles ? (options.sizeMin || 20) + Math.random() * ((options.sizeMax || 38) - (options.sizeMin || 20)) : 6);
      const life = options.life || (foodParticles ? 0.62 + Math.random() * 0.24 : 0.45);
      state.particles.push({
        x: pos.x + (Math.random() - 0.5) * (options.spread || 10),
        y: pos.y + (Math.random() - 0.5) * (options.spread || 10),
        vx: foodParticles ? Math.cos(angle) * speed : (Math.random() - 0.5) * 120,
        vy: foodParticles ? Math.sin(angle) * speed - 32 : (Math.random() - 0.7) * 120,
        age: 0,
        life,
        maxLife: life,
        color,
        imageSrc,
        particleType,
        particleTier,
        particleSprite,
        foodParticles,
        size,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 8),
        gravity: foodParticles ? 70 + Math.random() * 45 : 220,
      });
    }
  }

  function foodExplosion(pos, color, particleType, options = {}) {
    burst(pos, color, {
      food: true,
      particleSprite: "attack",
      particleType,
      count: options.count || 11,
      size: options.size,
      spread: options.spread || 16,
      life: options.life,
      speedMin: options.speedMin,
      speedMax: options.speedMax,
      sizeMin: options.sizeMin,
      sizeMax: options.sizeMax,
    });
  }

  function mergeExplosion(pos, entry) {
    if (!pos || !entry) return;
    if (isUnit(entry)) {
      foodExplosion(pos, entry.accent || entry.color, entry.typeId || entry.id, {
        count: 12,
        spread: 18,
        life: 0.68,
        speedMin: 105,
        speedMax: 255,
        sizeMin: 18,
        sizeMax: 30,
      });
      return;
    }
    const color = entry.accent || entry.color || "#f0d56b";
    if (isDrink(entry)) {
      burst(pos, color, {
        food: true,
        particleSprite: "drink",
        particleType: entry.id,
        particleTier: entry.tier,
        count: 10,
        spread: 16,
        life: 0.7,
        speedMin: 95,
        speedMax: 230,
        sizeMin: 20,
        sizeMax: 32,
      });
      return;
    }
    if (isTopping(entry)) {
      burst(pos, color, {
        food: true,
        particleSprite: "item",
        particleType: entry.id,
        particleTier: entry.tier,
        count: 10,
        spread: 15,
        life: 0.66,
        speedMin: 90,
        speedMax: 220,
        sizeMin: 18,
        sizeMax: 28,
      });
      return;
    }
    burst(pos, color);
  }

  function defeatExplosion(unit, particleType) {
    if (!unit) return;
    const type = particleType || unit.typeId || unit.id;
    foodExplosion({ x: unit.x, y: unit.y }, unit.accent, type, {
      count: 30,
      spread: 34,
      size: 38,
      life: 1.02,
      speedMin: 150,
      speedMax: 330,
    });
    burst({ x: unit.x, y: unit.y }, unit.accent, { count: 12, spread: 22, life: 0.55 });
  }

  function combatEndExplosion(won) {
    const center = {
      x: BATTLE_FIELD.x + BATTLE_FIELD.w * 0.42,
      y: BATTLE_FIELD.y + BATTLE_FIELD.h * 0.46,
    };
    const count = Math.min(360, Math.max(ATTACK_PARTICLE_TYPES.length * 8, 300));
    for (let i = 0; i < count; i++) {
      const particleType = ATTACK_PARTICLE_TYPES[i % ATTACK_PARTICLE_TYPES.length];
      foodExplosion(center, won ? "#f0d56b" : "#d9573c", particleType, {
        count: 1,
        spread: 94,
        life: 1.85 + Math.random() * 0.9,
        speedMin: 300,
        speedMax: 760,
        sizeMin: 54,
        sizeMax: 116,
      });
    }
    burst(center, won ? "#f0d56b" : "#d9573c", { count: 72, spread: 102, life: 1.15, speedMin: 150, speedMax: 340 });

    const sideBursts = [
      { x: 0.18, y: 0.28, count: 48, spread: 48, sizeMin: 28, sizeMax: 58, speedMin: 190, speedMax: 430, life: 1.22, sparkles: 18 },
      { x: 0.76, y: 0.26, count: 66, spread: 58, sizeMin: 34, sizeMax: 76, speedMin: 230, speedMax: 540, life: 1.34, sparkles: 24 },
      { x: 0.28, y: 0.70, count: 56, spread: 54, sizeMin: 24, sizeMax: 62, speedMin: 200, speedMax: 480, life: 1.28, sparkles: 20 },
      { x: 0.67, y: 0.68, count: 82, spread: 66, sizeMin: 44, sizeMax: 92, speedMin: 250, speedMax: 620, life: 1.46, sparkles: 30 },
      { x: 0.51, y: 0.18, count: 42, spread: 42, sizeMin: 22, sizeMax: 50, speedMin: 170, speedMax: 390, life: 1.15, sparkles: 16 },
    ];
    sideBursts.forEach((config, burstIndex) => {
      const pos = {
        x: BATTLE_FIELD.x + BATTLE_FIELD.w * config.x,
        y: BATTLE_FIELD.y + BATTLE_FIELD.h * config.y,
      };
      for (let i = 0; i < config.count; i++) {
        const particleType = ATTACK_PARTICLE_TYPES[(i + burstIndex * 11) % ATTACK_PARTICLE_TYPES.length];
        foodExplosion(pos, won ? "#f0d56b" : "#d9573c", particleType, {
          count: 1,
          spread: config.spread,
          life: config.life + Math.random() * 0.45,
          speedMin: config.speedMin,
          speedMax: config.speedMax,
          sizeMin: config.sizeMin,
          sizeMax: config.sizeMax,
        });
      }
      burst(pos, won ? "#f0d56b" : "#d9573c", {
        count: config.sparkles,
        spread: config.spread * 0.72,
        life: 0.72 + Math.random() * 0.22,
        speedMin: config.speedMin * 0.42,
        speedMax: config.speedMax * 0.52,
      });
    });
  }

  function currentBattleSpeed() {
    return BATTLE_SPEEDS[state.battleSpeedIndex] || BATTLE_SPEEDS[0];
  }

  function battleSpeedLabel() {
    return `${currentBattleSpeed()}x`;
  }

  function cycleBattleSpeed() {
    state.battleSpeedIndex = (state.battleSpeedIndex + 1) % BATTLE_SPEEDS.length;
    if (state.phase !== "battle") state.message = `Speed ${battleSpeedLabel()}`;
  }

  function update(dt) {
    state.idleTime += dt;
    const step = state.phase === "battle" ? dt * currentBattleSpeed() : dt;
    if (state.phase === "battle") updateBattle(step);
    state.particles.forEach((p) => {
      p.life -= step;
      p.age = (p.age || 0) + step;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.rotation += (p.spin || 0) * step;
      p.vx *= Math.max(0, 1 - step * (p.foodParticles ? 1.4 : 0.35));
      p.vy *= Math.max(0, 1 - step * (p.foodParticles ? 1.1 : 0.1));
      p.vy += (p.gravity || 220) * step;
    });
    state.particles = state.particles.filter((p) => p.life > 0);
  }

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw() {
    state.tooltipTargets = [];
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    drawTopBar();
    if (state.phase === "battle") {
      drawBattle();
    } else if (state.phase === "result") {
      drawResult();
    } else {
      drawPrep();
    }
    drawParticles();
    if (state.codexOpen) {
      state.tooltipTargets = [];
      drawCodexOverlay();
    }
    drawTooltip();
  }

  function drawBackground() {
    const image = getBackgroundImage();
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, W, H);
      ctx.restore();
      return;
    }

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#f8f5df");
    g.addColorStop(0.58, "#d8ead4");
    g.addColorStop(1, "#b9d9c2");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(41, 88, 69, 0.12)";
    ctx.lineWidth = 2;
    for (let x = -80; x < W + 80; x += 54) {
      ctx.beginPath();
      ctx.moveTo(x, 214);
      ctx.lineTo(x + 260, H);
      ctx.stroke();
    }
  }

  function getBackgroundImage() {
    const src = currentArena()?.backgroundSrc || BACKGROUND_SRC;
    if (backgroundImageCache.has(src)) return backgroundImageCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.onerror = () => {
      if (src !== BACKGROUND_SRC) backgroundImageCache.delete(src);
    };
    image.src = src;
    backgroundImageCache.set(src, image);
    return image;
  }

  function drawTopBar() {
    drawChalkStatusBoard(STATUS_CHALK_COURSE_SRC, 9, 4, 126, 52, "Course", `${state.round}`, `Course ${state.round}`);
    drawChalkStatusBoard(STATUS_CHALK_COINS_SRC, 149, 4, 104, 52, "Coins", `${state.gold}`, `${state.gold} coins`);
    drawChalkStatusBoard(STATUS_CHALK_HEALTH_SRC, 266, 4, 104, 52, "Health", `${state.hearts}`, `${state.hearts} health`);

    if (state.phase === "prep") {
      const upgradeCost = nextShopUpgradeCost();
      drawButton(
        { ...buttons.shopUpgrade, label: upgradeCost === null ? "Max Lv" : `Lv ${state.shopLevel + 1}`, coinAmount: upgradeCost },
        upgradeCost !== null && state.gold >= upgradeCost
      );
      drawButton({ ...buttons.roll, label: "Roll", coinAmount: currentRollCost() }, state.gold >= currentRollCost());
      drawButton(buttons.battle, teamPower() > 0);
    } else if (state.phase === "battle") {
      drawButton({ ...buttons.battleSpeed, label: `Speed ${battleSpeedLabel()}`, speedValue: battleSpeedLabel() }, true);
    } else if (state.phase === "result" && state.hearts <= 0) {
      drawButton({ ...buttons.next, label: "Restart", signSrc: RESTART_CHALK_SIGN_SRC }, true);
    }
  }

  function drawChalkStatusBoard(src, x, y, w, h, label, value, tooltip) {
    const image = getUiSprite(src);
    if (!(image && image.complete && image.naturalWidth > 0)) {
      pill(x + 8, y + 8, w - 16, h - 16, `${label} ${value}`, "#fff5cc", "#16392d");
      return;
    }
    registerTooltip(x, y, w, h, { title: tooltip, body: "" });
    ctx.drawImage(image, x - 6, Math.max(0, y - 6), w + 12, h + 12);
    drawChalkButtonText(String(label).toUpperCase(), x + w / 2, y + 19, {
      font: "900 9px Inter, sans-serif",
      alpha: 0.92,
    });
    drawChalkButtonText(String(value), x + w / 2, y + 37, {
      font: "900 19px Inter, sans-serif",
      alpha: 0.98,
    });
  }

  function iconPill(x, y, w, h, iconSrc, text, fill, color, fallbackText) {
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    ctx.font = "800 16px Inter, sans-serif";
    ctx.textBaseline = "middle";
    const image = getUiSprite(iconSrc);
    const iconSize = 22;
    const gap = 7;
    const useIcon = image && image.complete && image.naturalWidth > 0;
    const label = useIcon ? text : fallbackText;
    const textWidth = ctx.measureText(label).width;
    const totalWidth = useIcon ? iconSize + gap + textWidth : textWidth;
    let cursor = x + w / 2 - totalWidth / 2;
    if (useIcon) {
      ctx.drawImage(image, Math.round(cursor), Math.round(y + (h - iconSize) / 2), iconSize, iconSize);
      cursor += iconSize + gap;
    }
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(label, cursor, y + h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function currencyLabel(amount, sign = "") {
    return `${sign}${amount}`;
  }

  function drawCurrencyAmount(amount, x, y, options = {}) {
    const {
      sign = "",
      align = "left",
      font = "900 14px Inter, sans-serif",
      color = "#16392d",
      iconSize = 14,
      gap = 4,
      maxWidth = Infinity,
    } = options;
    ctx.font = font;
    ctx.textBaseline = "middle";
    const image = getUiSprite(STATUS_COIN_SRC);
    const text = currencyLabel(amount, sign);
    if (!(image && image.complete && image.naturalWidth > 0)) {
      const fallback = `${text} coins`;
      if (Number.isFinite(maxWidth)) {
        fitText(fallback, x, y + 4, maxWidth, font, color);
      } else {
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(fallback, x, y);
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      return;
    }
    const textWidth = ctx.measureText(text).width;
    let totalWidth = iconSize + gap + textWidth;
    let size = iconSize;
    if (Number.isFinite(maxWidth) && totalWidth > maxWidth) {
      size = Math.max(10, iconSize - Math.ceil((totalWidth - maxWidth) / 3));
      totalWidth = size + Math.max(2, gap - 1) + textWidth;
    }
    const usedGap = size === iconSize ? gap : Math.max(2, gap - 1);
    let cursor = align === "center" ? x - totalWidth / 2 : align === "right" ? x - totalWidth : x;
    ctx.drawImage(image, Math.round(cursor), Math.round(y - size / 2), size, size);
    cursor += size + usedGap;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.fillText(text, cursor, y + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawCurrencyLine(amount, suffix, x, y, maxWidth, font, color, options = {}) {
    const { align = "center", sign = "", iconSize = 13 } = options;
    ctx.font = font;
    const amountText = currencyLabel(amount, sign);
    const suffixText = suffix ? ` ${suffix}` : "";
    const image = getUiSprite(STATUS_COIN_SRC);
    if (!(image && image.complete && image.naturalWidth > 0)) {
      fitText(`${amountText} coins${suffixText}`, x, y, maxWidth, font, color);
      return;
    }
    const gap = 4;
    const suffixGap = suffixText ? 5 : 0;
    const amountWidth = ctx.measureText(amountText).width;
    const suffixWidth = suffixText ? ctx.measureText(suffixText).width : 0;
    const totalWidth = iconSize + gap + amountWidth + suffixGap + suffixWidth;
    let cursor = align === "center" ? x - totalWidth / 2 : align === "right" ? x - totalWidth : x;
    ctx.drawImage(image, Math.round(cursor), Math.round(y - iconSize + 2), iconSize, iconSize);
    cursor += iconSize + gap;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(amountText, cursor, y);
    cursor += amountWidth + suffixGap;
    if (suffixText) ctx.fillText(suffixText, cursor, y);
  }

  function pill(x, y, w, h, text, fill, color) {
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const maxWidth = w - 14;
    let fontSize = 15;
    ctx.font = `700 ${fontSize}px Inter, sans-serif`;
    while (fontSize > 10 && ctx.measureText(text).width > maxWidth) {
      fontSize -= 1;
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
    }
    let label = text;
    while (label.length > 3 && ctx.measureText(`${label}...`).width > maxWidth) {
      label = label.slice(0, -1);
    }
    ctx.fillText(label === text ? text : `${label}...`, x + w / 2, y + h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawButton(button, enabled) {
    if (button.signSrc && drawChalkSignButton(button, enabled)) return;

    roundedRect(button.x, button.y, button.w, button.h, 8);
    ctx.fillStyle = enabled ? "#16392d" : "#7a8d84";
    ctx.fill();
    ctx.fillStyle = "#f8f5df";
    ctx.font = "800 16px Inter, sans-serif";
    ctx.textBaseline = "middle";
    const iconId = button.iconId || buttonIconId(button);
    const isSellButton = String(button.label || "").toLowerCase() === "sell";
    const hasAtlasIcon = Boolean(iconId && UI_ICON_ATLAS[iconId] && !isSellButton);
    const legacyIcon = button.icon && !hasAtlasIcon ? `${button.icon}  ` : "";
    const label = `${legacyIcon}${button.label}`;
    registerTooltip(button.x, button.y, button.w, button.h, buttonTooltip(button, enabled));
    if (button.coinAmount !== undefined && button.coinAmount !== null) {
      const coinImage = getUiSprite(STATUS_COIN_SRC);
      const coinText = String(button.coinAmount);
      const font = isSellButton ? "900 14px Inter, sans-serif" : "800 16px Inter, sans-serif";
      ctx.font = font;
      const labelWidth = ctx.measureText(label).width;
      const coinTextWidth = ctx.measureText(coinText).width;
      const iconSize = isSellButton ? 16 : 18;
      const atlasWidth = hasAtlasIcon ? iconSize + 6 : 0;
      const labelGap = isSellButton ? 7 : 10;
      const coinGap = isSellButton ? 3 : 4;
      const totalWidth = atlasWidth + labelWidth + labelGap + iconSize + coinGap + coinTextWidth;
      let cursor = button.x + button.w / 2 - totalWidth / 2;
      ctx.textAlign = "left";
      if (hasAtlasIcon) {
        drawUiAtlasIcon(iconId, cursor + iconSize / 2, button.y + button.h / 2, iconSize, { tooltip: null });
        cursor += iconSize + 6;
      }
      ctx.fillText(label, cursor, button.y + button.h / 2 + 1);
      cursor += labelWidth + labelGap;
      if (coinImage && coinImage.complete && coinImage.naturalWidth > 0) {
        ctx.drawImage(coinImage, Math.round(cursor), Math.round(button.y + (button.h - iconSize) / 2), iconSize, iconSize);
        cursor += iconSize + coinGap;
        ctx.fillText(coinText, cursor, button.y + button.h / 2 + 1);
      } else {
        ctx.fillText(`${coinText} coins`, cursor, button.y + button.h / 2 + 1);
      }
    } else {
      const iconSize = 18;
      if (hasAtlasIcon) {
        const labelWidth = ctx.measureText(label).width;
        const totalWidth = iconSize + 6 + labelWidth;
        let cursor = button.x + button.w / 2 - totalWidth / 2;
        ctx.textAlign = "left";
        drawUiAtlasIcon(iconId, cursor + iconSize / 2, button.y + button.h / 2, iconSize, { tooltip: null });
        cursor += iconSize + 6;
        ctx.fillText(label, cursor, button.y + button.h / 2 + 1);
      } else {
        ctx.textAlign = "center";
        ctx.fillText(label, button.x + button.w / 2, button.y + button.h / 2 + 1);
      }
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function drawChalkSignButton(button, enabled) {
    const image = getUiSprite(button.signSrc);
    if (!(image && image.complete && image.naturalWidth > 0)) return false;

    registerTooltip(button.x, button.y, button.w, button.h, buttonTooltip(button, enabled));

    const drawX = button.x - 6;
    const drawY = Math.max(0, button.y - 6);
    const drawW = button.w + 12;
    const drawH = button.h + 12;
    ctx.save();
    ctx.globalAlpha = enabled ? 1 : 0.58;
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.restore();

    if (!enabled) {
      roundedRect(button.x + 6, button.y + 7, button.w - 12, button.h - 14, 7);
      ctx.fillStyle = "rgba(22, 31, 27, 0.32)";
      ctx.fill();
    }

    if (button.chalkMode === "speed") {
      const value = button.speedValue || String(button.label || "").replace(/^Speed\s*/i, "");
      drawChalkButtonText("SPEED", button.x + button.w / 2, button.y + 18, {
        font: "900 9px Inter, sans-serif",
        alpha: enabled ? 0.94 : 0.62,
      });
      drawChalkButtonText(value, button.x + button.w / 2, button.y + 37, {
        font: "900 18px Inter, sans-serif",
        alpha: enabled ? 0.98 : 0.62,
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      return true;
    }

    const isUpgradeSign = button.signSrc.includes("upgrade") || button.signSrc.includes("update");
    const subLabel = isUpgradeSign ? String(button.label || "").toUpperCase() : "";
    if (subLabel) {
      drawChalkButtonText(subLabel, button.x + 22, button.y + button.h - 12, {
        align: "left",
        font: "900 9px Inter, sans-serif",
        alpha: enabled ? 0.94 : 0.62,
      });
    }

    if (button.coinAmount !== undefined && button.coinAmount !== null) {
      drawChalkButtonCost(button.coinAmount, button.x + button.w - 11, button.y + button.h - 12, enabled);
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    return true;
  }

  function drawChalkButtonText(text, x, y, options = {}) {
    const {
      align = "center",
      font = "900 11px Inter, sans-serif",
      alpha = 1,
    } = options;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(38, 44, 37, 0.78)";
    ctx.fillStyle = "#fff7cf";
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawChalkButtonCost(amount, rightX, y, enabled) {
    const coinImage = getUiSprite(STATUS_COIN_SRC);
    const text = String(amount);
    ctx.save();
    ctx.font = "900 11px Inter, sans-serif";
    ctx.textBaseline = "middle";
    const iconSize = 11;
    const gap = 2;
    const textWidth = ctx.measureText(text).width;
    const totalWidth = iconSize + gap + textWidth;
    const startX = rightX - totalWidth;
    ctx.globalAlpha = enabled ? 1 : 0.62;
    if (coinImage && coinImage.complete && coinImage.naturalWidth > 0) {
      ctx.drawImage(coinImage, Math.round(startX), Math.round(y - iconSize / 2), iconSize, iconSize);
    }
    drawChalkButtonText(text, startX + iconSize + gap, y + 1, {
      align: "left",
      font: "900 11px Inter, sans-serif",
      alpha: enabled ? 0.96 : 0.62,
    });
    ctx.restore();
  }

  function buttonIconId(button) {
    const label = String(button.label || "").toLowerCase();
    if (button === buttons.shopUpgrade || label.includes("lv ") || label.includes("max lv")) return "action_upgrade";
    if (button === buttons.roll || label.includes("roll")) return "action_roll";
    if (button === buttons.battle || label.includes("battle")) return "action_battle";
    if (button === buttons.battleSpeed || label.includes("speed")) return "action_speed";
    if (button === buttons.sell || label.includes("sell")) return "action_sell";
    if (button === buttons.detach || label.includes("detach")) return "action_detach";
    return null;
  }

  function buttonTooltip(button, enabled) {
    const label = String(button.label || "");
    if (button === buttons.shopUpgrade || label.startsWith("Lv ") || label === "Max Lv") {
      return {
        title: label === "Max Lv" ? "Shop maxed" : "Upgrade shop",
        body: enabled ? "Raises shop level and improves rarity odds." : "Need more coins or already at max level.",
      };
    }
    if (button === buttons.roll || label === "Roll") {
      return {
        title: "Roll shop",
        body: enabled ? "Refreshes unlocked shop slots." : "Need more coins to roll.",
      };
    }
    if (button === buttons.battle || label === "Battle") {
      return {
        title: "Start battle",
        body: enabled ? "Fight the next enemy team." : "Place at least one food animal first.",
      };
    }
    if (button === buttons.battleSpeed || label.startsWith("Speed")) {
      return { title: "Battle speed", body: "Cycles combat playback speed." };
    }
    if (label.startsWith("Sell")) return { title: "Sell", body: "Refunds part of this entry's value." };
    if (label.startsWith("Detach") || button.iconId === "action_detach") return { title: "Detach topping", body: "Moves the equipped topping to an open bench slot." };
    if (label === "Next" || label === "Restart") return { title: label, body: label === "Restart" ? "Starts a new run." : "Moves to the next prep round." };
    return label ? { title: label, body: "" } : null;
  }

  function drawPrep() {
    drawShopkeeperStall();
    drawCodexMenuButton();
    shopSlots.forEach((slot, i) => drawSlot(slot.x, slot.y, SHOP_SLOT_W, SHOP_SLOT_H, state.shop[i], "shop", i));
    itemBenchSlots.forEach((slot, i) => drawItemBenchSlot(slot, i));
    boardSlots.forEach((slot, i) => drawBoardSlot(slot, i));
    drinkSlots.forEach((slot, i) => drawDrinkSlot(slot, i));
    benchSlots.forEach((slot, i) => drawBenchSlot(slot, i));
    drawStatsPanel();
    drawDragPreview();
  }

  function drawShopkeeperStall() {
    const keeper = getUiSprite(currentShopkeeperSrc());
    const stall = getUiSprite(SHOPKEEPER_STALL_SRC);
    const keeperRect = SHOPKEEPER_DISPLAY.keeper;
    const stallRect = SHOPKEEPER_DISPLAY.stall;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    if (keeper && keeper.complete && keeper.naturalWidth > 0) {
      drawBreathingShopkeeper(keeper, keeperRect);
    }
    if (stall && stall.complete && stall.naturalWidth > 0) {
      ctx.drawImage(stall, stallRect.x, stallRect.y, stallRect.w, stallRect.h);
    }
    ctx.restore();
    drawShopkeeperSellTarget();
  }

  function drawCodexMenuButton() {
    const rect = SHOPKEEPER_DISPLAY.codexButton;
    const image = getUiSprite(CODEX_MENU_BUTTON_SRC);
    registerTooltip(rect.x, rect.y, rect.w, rect.h, {
      title: "Food menu",
      body: "Open the food, toppings, and drinks menu.",
    });
    ctx.save();
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = true;
      const pad = 4;
      const box = { x: rect.x - pad, y: rect.y - pad, w: rect.w + pad * 2, h: rect.h + pad * 2 };
      const aspect = image.naturalWidth / image.naturalHeight;
      let drawW = box.w;
      let drawH = drawW / aspect;
      if (drawH > box.h) {
        drawH = box.h;
        drawW = drawH * aspect;
      }
      ctx.drawImage(image, box.x + (box.w - drawW) / 2, box.y + (box.h - drawH) / 2, drawW, drawH);
    } else {
      roundedRect(rect.x + 8, rect.y + 10, rect.w - 16, rect.h - 20, 8);
      ctx.fillStyle = "#fff1c8";
      ctx.fill();
      ctx.strokeStyle = "#16392d";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#16392d";
      ctx.font = "900 18px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", rect.x + rect.w / 2, rect.y + rect.h / 2);
    }
    ctx.restore();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 1;
  }

  function shopkeeperSellTargetRect() {
    return {
      x: SHOPKEEPER_DISPLAY.stall.x,
      y: SHOPKEEPER_DISPLAY.stall.y,
      w: SHOPKEEPER_DISPLAY.stall.w,
      h: SHOPKEEPER_DISPLAY.stall.h,
    };
  }

  function drawShopkeeperSellTarget() {
    const rect = shopkeeperSellTargetRect();
    const sellValue = state.drag && canSellDrag(state.drag) ? dragSellValue(state.drag) : null;
    registerTooltip(rect.x, rect.y, rect.w, rect.h, {
      title: "Shopkeeper",
      body: sellValue === null ? "Drag owned food, toppings, or drinks here to sell." : `Release here to sell for ${sellValue} coins.`,
    });
  }

  function drawBreathingShopkeeper(image, rect) {
    const phase = state.idleTime * ((Math.PI * 2) / SHOPKEEPER_DISPLAY.breathPeriod);
    const wave = Math.sin(phase);
    const scaleX = 1 - wave * SHOPKEEPER_DISPLAY.breathScaleX;
    const scaleY = 1 + wave * SHOPKEEPER_DISPLAY.breathScaleY;
    const bob = -wave * SHOPKEEPER_DISPLAY.breathBob;

    ctx.save();
    ctx.translate(rect.x + rect.w / 2, rect.y + rect.h + bob);
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(image, -rect.w / 2, -rect.h, rect.w, rect.h);
    ctx.restore();
  }

  function drawResult() {
    const battle = visibleBattle();
    if (battle) drawBattle(battle);
    drawResultPanel();
  }

  function drawSlot(x, y, w, h, unit, area, index) {
    const selected = state.selected && state.selected.area === area && state.selected.index === index;
    const showSelectedHighlight = selected && area === "shop";
    const hovered = state.hover && state.hover.area === area && state.hover.index === index;
    const showHoverHighlight = hovered && area !== "shop" && area !== "board" && area !== "bench" && area !== "itemBench" && area !== "drinks";
    const isDragSource = state.drag?.area === area && state.drag.index === index;
    const canDropHere = Boolean(state.drag && isPotentialDropTarget(state.drag, area, index));
    const isValidDrop = canDropDrag(state.drag, area, index);
    const isOpenDrop = canDropHere && isValidDrop;
    const isBlockedDrop = canDropHere && !isValidDrop;
    const isDragOver = state.drag?.over?.area === area && state.drag.over.index === index;
    const useSubtleDropOutline = area === "board" || area === "bench" || area === "itemBench" || area === "drinks";
    const showOpenDrop = isOpenDrop && !useSubtleDropOutline;
    const showBlockedDrop = isBlockedDrop && !useSubtleDropOutline;
    const showDragOver = isDragOver && !useSubtleDropOutline;
    const showSubtleDropOutline = useSubtleDropOutline && isOpenDrop;
    const showSubtleBlockedOutline = useSubtleDropOutline && isDragOver && isBlockedDrop;
    const hasArtBackdrop = drawDecoratedSlotBackdrop(x, y, w, h, area);
    roundedRect(x - w / 2, y - h / 2, w, h, 8);
    if (!hasArtBackdrop || showHoverHighlight || showOpenDrop || showDragOver) {
      ctx.fillStyle = showDragOver && showOpenDrop
        ? "rgba(231, 255, 217, 0.78)"
        : showHoverHighlight || showOpenDrop
          ? "rgba(255, 249, 214, 0.62)"
          : "#f2edd2";
      ctx.fill();
    }
    ctx.strokeStyle = showSelectedHighlight
      ? "#db4f38"
      : showDragOver && showOpenDrop
        ? "#4a9e68"
        : showDragOver && showBlockedDrop
          ? "#d9573c"
          : hasArtBackdrop
            ? "transparent"
            : "rgba(22, 57, 45, 0.22)";
    ctx.lineWidth = showSelectedHighlight || showDragOver ? 4 : 2;
    ctx.stroke();
    if (showSubtleDropOutline || showSubtleBlockedOutline) {
      roundedRect(x - w / 2 + 1.5, y - h / 2 + 1.5, w - 3, h - 3, 7);
      ctx.strokeStyle = showSubtleBlockedOutline
        ? "rgba(217, 87, 60, 0.34)"
        : "#4a9e68";
      ctx.lineWidth = isDragOver ? 2.25 : 1.5;
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    if (area === "shop" && !isShopSlotUnlocked(index)) {
      drawShopSlotUnlock(x, y, w, h, index);
      return;
    }
    if (unit) {
      ctx.save();
      if (isDragSource) ctx.globalAlpha = 0.34;
      drawUnitCard(unit, x, y, w, h, area === "shop", area !== "shop", {
        hideTileName: area === "board" || area === "bench" || area === "itemBench" || area === "drinks",
        shopIndex: area === "shop" ? index : null,
      });
      ctx.restore();
      if (area === "shop") {
        drawShopSaleBadge(x, y, w, h, index);
        drawShopFreezeBadge(x, y, w, h, index);
      }
    }
  }

  function drawShopSaleBadge(x, y, w, h, index) {
    if (!shopSlotOnSale(index)) return;
    const badgeX = x - w / 2 + 7;
    const badgeY = y - h / 2 + 31;
    roundedRect(badgeX, badgeY, 42, 16, 5);
    ctx.fillStyle = "#ffe27a";
    ctx.fill();
    ctx.strokeStyle = "#9c6a2f";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#7c452d";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SALE", badgeX + 21, badgeY + 8.5);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 1;
  }

  function drawShopSlotUnlock(x, y, w, h, index) {
    const cost = shopSlotUnlockCost(index);
    const panelX = x - w / 2 + 7;
    const panelY = y - h / 2 + 9;
    const panelW = w - 14;
    const panelH = h - 18;
    const cloth = getUiSprite(SHOP_LOCK_CLOTH_BG_SRC);
    roundedRect(panelX, panelY, panelW, panelH, 8);
    if (cloth && cloth.complete && cloth.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(cloth, panelX, panelY, panelW, panelH);
      ctx.fillStyle = "rgba(255, 247, 224, 0.16)";
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.restore();
      roundedRect(panelX, panelY, panelW, panelH, 8);
    } else {
      ctx.fillStyle = "rgba(255, 253, 232, 0.76)";
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(111, 67, 33, 0.36)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const medallionY = y - 44;
    const image = getUiSprite(SHOP_LOCKED_SRC);
    const iconSize = 28;
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.drawImage(image, x - iconSize / 2, medallionY - iconSize / 2 + 1, iconSize, iconSize);
    } else {
      ctx.fillStyle = "#16392d";
      ctx.font = "900 24px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", x, medallionY);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    fitText(`Slot ${index + 1}`, x, y - 7, panelW - 10, "900 12px Inter, sans-serif", "#12372d");
    fitText("Open", x, y + 10, panelW - 12, "900 10px Inter, sans-serif", "#7b3325");
    roundedRect(x - 31, y + 18, 62, 24, 9);
    ctx.fillStyle = "rgba(255, 246, 173, 0.86)";
    ctx.fill();
    ctx.strokeStyle = "rgba(142, 84, 29, 0.30)";
    ctx.lineWidth = 1;
    ctx.stroke();
    drawCurrencyAmount(cost, x, y + 34, {
      align: "center",
      font: "900 12px Inter, sans-serif",
      color: "#16392d",
      iconSize: 12,
      maxWidth: 56,
    });
    registerTooltip(x - w / 2, y - h / 2, w, h, {
      title: `Open shop slot ${index + 1}`,
      body: `Spend ${cost} coins to add this shop slot.`,
    });
  }

  function drawDecoratedSlotBackdrop(x, y, w, h, area) {
    if (area === "shop") {
      const image = getUiSprite(SHOP_SLOT_BG_SRC);
      if (!(image && image.complete && image.naturalWidth > 0)) return false;
      ctx.save();
      roundedRect(x - w / 2, y - h / 2, w, h, 8);
      ctx.clip();
      ctx.drawImage(image, Math.round(x - w / 2), Math.round(y - h / 2), w, h);
      ctx.restore();
      return true;
    }
    if (area === "bench") {
      return drawBenchSlotBackdrop(x, y, w, h);
    }
    if (area === "itemBench") {
      const slot = itemBenchSlots.find((candidate) => Math.abs(candidate.x - x) < 1 && Math.abs(candidate.y - y) < 1);
      if (slot?.kind === "drink") {
        const image = getUiSprite(DRINK_COASTER_SLOT_SRC);
        if (image && image.complete && image.naturalWidth > 0) {
          const size = Math.round(Math.max(w, h) + 16);
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
          ctx.restore();
          return true;
        }
      }
      if (slot?.kind === "topping") {
        const image = getUiSprite(TOPPING_CUTTING_BOARD_SLOT_SRC);
        if (image && image.complete && image.naturalWidth > 0) {
          const size = Math.round(Math.max(w, h) + 16);
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
          ctx.restore();
          return true;
        }
      }
      return drawBenchSlotBackdrop(x, y, w, h);
    }
    const src = area === "board" ? BOARD_PLATE_SLOT_SRC : area === "drinks" ? DRINK_COASTER_SLOT_SRC : null;
    if (!src) return false;
    const image = getUiSprite(src);
    if (!(image && image.complete && image.naturalWidth > 0)) return false;
    const size = Math.round(Math.max(w, h) + (area === "board" ? 18 : 16));
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
    ctx.restore();
    return true;
  }

  function drawBenchSlotBackdrop(x, y, w, h) {
    const image = getUiSprite(BENCH_SLOT_BG_SRC);
    if (!(image && image.complete && image.naturalWidth > 0)) return false;
    const drawW = Math.round(w * BENCH_SLOT_BG_SCALE);
    const drawH = Math.round(h * BENCH_SLOT_BG_SCALE);
    ctx.save();
    roundedRect(x - w / 2, y - h / 2, w, h, 8);
    ctx.clip();
    ctx.drawImage(image, Math.round(x - drawW / 2), Math.round(y - drawH / 2), drawW, drawH);
    ctx.restore();
    return true;
  }

  function drawDrinkSlot(slot, index) {
    drawSlot(slot.x, slot.y, DRINK_SLOT_SIZE, DRINK_SLOT_SIZE, state.drinks[index], "drinks", index);
    if (state.drinks[index]) return;
    const slotTooltip = {
      title: "Combat coaster",
      body: "Place a drink here.",
    };
    registerTooltip(slot.x - DRINK_SLOT_SIZE / 2, slot.y - DRINK_SLOT_SIZE / 2, DRINK_SLOT_SIZE, DRINK_SLOT_SIZE, slotTooltip);
  }

  function drawBoardSlot(slot, index) {
    drawSlot(slot.x, slot.y, 72, 72, state.board[index], "board", index);
    if (state.board[index]) return;
    registerTooltip(slot.x - 36, slot.y - 36, 72, 72, {
      title: "Combat plate",
      body: "Place a food animal here.",
    });
  }

  function drawBenchSlot(slot, index) {
    drawSlot(slot.x, slot.y, 72, 72, state.bench[index], "bench", index);
    if (state.bench[index]) return;
    registerTooltip(slot.x - 36, slot.y - 36, 72, 72, {
      title: "General bench",
      body: "Store food, toppings, or drinks here.",
    });
  }

  function drawItemBenchSlot(slot, index) {
    drawSlot(slot.x, slot.y, ITEM_BENCH_SLOT_SIZE, ITEM_BENCH_SLOT_SIZE, state.itemBench[index], "itemBench", index);
    if (state.itemBench[index]) return;
    const title = slot.kind === "drink" ? "Drink storage" : "Topping storage";
    const body = slot.kind === "drink" ? "Store spare drinks here." : "Store spare toppings here.";
    registerTooltip(
      slot.x - ITEM_BENCH_SLOT_SIZE / 2,
      slot.y - ITEM_BENCH_SLOT_SIZE / 2,
      ITEM_BENCH_SLOT_SIZE,
      ITEM_BENCH_SLOT_SIZE,
      { title, body }
    );
  }

  function drawShopFreezeBadge(x, y, w, h, index) {
    const rect = shopFreezeRect(x, y, w, h);
    const frozen = state.shopFrozen[index];
    roundedRect(rect.x, rect.y, rect.w, rect.h, 5);
    ctx.fillStyle = frozen ? "#e7ffd9" : "rgba(255, 253, 232, 0.92)";
    ctx.fill();
    ctx.strokeStyle = frozen ? "#16392d" : "rgba(22, 57, 45, 0.24)";
    ctx.lineWidth = frozen ? 2 : 1;
    ctx.stroke();
    const image = getUiSprite(frozen ? SHOP_LOCKED_SRC : SHOP_UNLOCKED_SRC);
    if (image && image.complete && image.naturalWidth > 0) {
      const iconSize = frozen ? 15 : 16;
      ctx.drawImage(image, rect.x + (rect.w - iconSize) / 2, rect.y + (rect.h - iconSize) / 2, iconSize, iconSize);
    } else {
      ctx.fillStyle = frozen ? "#16392d" : "#7c452d";
      ctx.font = "900 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frozen ? "L" : "U", rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }
    ctx.lineWidth = 1;
  }

  function drawDragPreview() {
    const drag = state.drag;
    if (!drag || !drag.unit) return;
    const shopPreview = drag.area === "shop";
    const w = shopPreview ? SHOP_SLOT_W : 72;
    const h = shopPreview ? SHOP_SLOT_H - 20 : 72;
    const x = Math.max(w / 2 + 6, Math.min(W - w / 2 - 6, drag.x));
    const y = Math.max(h / 2 + 6, Math.min(H - h / 2 - 6, drag.y));
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.shadowColor = "rgba(22, 57, 45, 0.24)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;
    roundedRect(x - w / 2, y - h / 2, w, h, 8);
    ctx.fillStyle = "#fff9d6";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = drag.valid ? "#4a9e68" : "rgba(22, 57, 45, 0.32)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 1;
    drawUnitCard(drag.unit, x, y, w, h, shopPreview, !shopPreview, {
      hideTileName: !shopPreview,
      shopIndex: shopPreview ? drag.index : null,
    });
    ctx.restore();
  }

  function isPotentialDropTarget(drag, area, index) {
    if (area === "keeperSell") return canSellDrag(drag);
    if (isItem(drag.unit)) {
      if (area === "equipment") return isTopping(drag.unit);
      if (drag.area === "shop") {
        if (isDrink(drag.unit)) return area === "bench" || area === "itemBench" || area === "drinks";
        return area === "bench" || area === "itemBench" || area === "board" || area === "equipment";
      }
      if (drag.area === "bench" || drag.area === "itemBench") {
        if (isDrink(drag.unit)) {
          if (area !== "bench" && area !== "itemBench" && area !== "drinks") return false;
        } else if (area !== "bench" && area !== "itemBench" && area !== "board" && area !== "equipment") return false;
        return area !== drag.area || index !== drag.index;
      }
      if (drag.area === "drinks") return (area === "bench" || area === "itemBench" || area === "drinks") && (area !== drag.area || index !== drag.index);
      if (drag.area === "equipment") return area === "bench" || area === "itemBench" || area === "board" || area === "equipment";
      return false;
    }
    if (drag.area === "shop") return area === "bench" || area === "board";
    if (drag.area === "bench") return area === "bench" || area === "board";
    if (drag.area === "board") {
      if (area !== "bench" && area !== "board") return false;
      return area !== drag.area || index !== drag.index;
    }
    return false;
  }

  function canDropDrag(drag, area, index) {
    if (!drag || !isPotentialDropTarget(drag, area, index)) return false;
    if (area === "keeperSell") return canSellDrag(drag);
    const target = state[area]?.[index];
    if (isItem(drag.unit)) {
      if (area === "equipment") {
        const unit = selectedEquipmentTargetRef(drag)?.unit;
        return isTopping(drag.unit) && Boolean(unit) && !unit.item;
      }
      if (drag.area === "shop") {
        if (target && canMergeShopEntryIntoSlot(drag.unit, area, index)) return true;
        if (isDrink(drag.unit)) {
          if (area === "itemBench") return itemBenchSlotAccepts(index, drag.unit) && !target;
          return (area === "bench" || area === "drinks") && !target;
        }
        if (area === "itemBench") return itemBenchSlotAccepts(index, drag.unit) && !target;
        if (area === "bench" && !target) return true;
        return isUnit(target) && !target.item;
      }
      if (isDrink(drag.unit)) {
        if (area === "drinks") return !target;
        if (area === "itemBench") {
          if (!itemBenchSlotAccepts(index, drag.unit)) return false;
          if (!target) return true;
          return isItemStorageArea(drag.area) && itemStorageAccepts(drag.area, drag.index, target);
        }
        if (area === "bench") {
          if (drag.area === "bench") return index !== drag.index;
          return !target && (drag.area !== area || index !== drag.index);
        }
        return false;
      }
      if (area === "itemBench") {
        if (!itemBenchSlotAccepts(index, drag.unit)) return false;
        if (!target) return true;
        return isItemStorageArea(drag.area) && itemStorageAccepts(drag.area, drag.index, target) && (drag.area !== area || index !== drag.index);
      }
      if (area === "bench") {
        if (drag.area === "equipment") return !target || (isUnit(target) && !target.item);
        if (drag.area === "bench") return index !== drag.index;
        return !target && (drag.area !== area || index !== drag.index);
      }
      return isUnit(target) && !target.item;
    }
    if (!target) return true;
    if (drag.area === "shop") return canMergeShopEntryIntoSlot(drag.unit, area, index);
    if (drag.area === "bench" && area === "bench") return index !== drag.index;
    if (drag.area === "bench" && area === "board") return isUnit(target);
    return drag.area === "board" && area === "board" && isUnit(target);
  }

  function drawUnitCard(unit, x, y, w, h, shopCard, facingRight = false, options = {}) {
    if (isItem(unit)) {
      drawItemCard(unit, x, y, w, h, shopCard, options);
      return;
    }
    const radius = Math.min(w, h) * (shopCard ? 0.25 : 0.28);
    drawFoodAnimal(unit, x, y - (shopCard ? 20 : 4), radius, facingRight);
    if (shopCard) drawRarityBadge(x - w / 2 + 7, y - h / 2 + 7, unit.rarity, "small");
    ctx.textAlign = "center";

    if (shopCard) {
      const bottom = y + h / 2;
      fitText(unit.short, x, bottom - 61, w - 14, "800 12px Inter, sans-serif", "#16392d");
      ctx.fillStyle = "#7c452d";
      ctx.font = "700 12px Inter, sans-serif";
      drawTraitChips(unit.traits || [], x - w / 2 + 7, bottom - 48, w - 14, {
        fontSize: 5.5,
        minWidth: 22,
        gap: 2,
      });
      drawUpgradeStars(unit.tier, x, bottom - 25, 9, "center");
      ctx.textAlign = "center";
      drawCurrencyLine(purchaseCost(unit, options.shopIndex), `${unit.atk}/${unit.maxHp}`, x, bottom - 9, w - 12, "800 11px Inter, sans-serif", "#16392d", {
        iconSize: 11,
      });
      ctx.textAlign = "left";
      return;
    }

    drawRarityDot(x + w / 2 - 12, y - h / 2 + 10, unit.rarity);
    if (options.hideTileName) {
      drawUpgradeStars(unit.tier, x, y + h / 2 - 6, 7, "center");
      ctx.textAlign = "left";
      return;
    }
    ctx.fillStyle = "#16392d";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText(unit.short, x, y + h / 2 - 14);
    ctx.fillStyle = "#7c452d";
    ctx.font = "700 10px Inter, sans-serif";
    drawUpgradeStars(unit.tier, x, y + h / 2 - 4, 7, "center");
    ctx.textAlign = "left";
  }

  function drawItemCard(item, x, y, w, h, shopCard, options = {}) {
    const tileDrink = !shopCard && options.hideTileName && isDrink(item);
    const radius = Math.min(w, h) * (shopCard ? 0.26 : tileDrink ? TILE_DRINK_ICON_RADIUS_SCALE : 0.25);
    drawItemIcon(item, x, y - (shopCard ? 31 : tileDrink ? TILE_DRINK_ICON_Y_OFFSET : 14), radius, {
      centerOpaque: tileDrink,
      opaqueAnchorY: tileDrink ? DRINK_COASTER_OPAQUE_ANCHOR_Y : 0.5,
    });
    if (shopCard) drawRarityBadge(x - w / 2 + 7, y - h / 2 + 7, item.rarity, "small");
    ctx.textAlign = "center";
    if (shopCard) {
      const bottom = y + h / 2;
      fitText(itemDisplayShort(item), x, bottom - 57, w - 14, "800 12px Inter, sans-serif", "#16392d");
      fitText(itemCardText(item), x, bottom - 36, w - 14, "700 10px Inter, sans-serif", "#7c452d");
      drawUpgradeStars(itemTier(item.tier), x, bottom - 24, 7, "center");
      drawCurrencyAmount(purchaseCost(item, options.shopIndex), x, bottom - 12, {
        align: "center",
        font: "800 11px Inter, sans-serif",
        color: "#16392d",
        iconSize: 11,
        maxWidth: w - 14,
      });
      ctx.textAlign = "left";
      return;
    }
    if (options.hideTileName) {
      drawUpgradeStars(itemTier(item.tier), x, y + h / 2 - 5, 6, "center");
      ctx.textAlign = "left";
      return;
    }
    drawRarityDot(x + w / 2 - 12, y - h / 2 + 10, item.rarity);
    ctx.fillStyle = "#16392d";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText(itemDisplayShort(item), x, y + h / 2 - 13);
    ctx.fillStyle = "#7c452d";
    ctx.font = "700 10px Inter, sans-serif";
    ctx.fillText(itemCardText(item), x, y + h / 2 - 1);
    drawUpgradeStars(itemTier(item.tier), x, y + h / 2 + 10, 6, "center");
    ctx.textAlign = "left";
  }

  function stars(tier) {
    return "*".repeat(Math.max(1, tier || 1));
  }

  function drawUpgradeStars(tier, x, y, size = 10, align = "left") {
    const count = Math.max(1, tier || 1);
    const gap = Math.max(1, Math.round(size * 0.16));
    const totalWidth = count * size + (count - 1) * gap;
    const startX = align === "center" ? x - totalWidth / 2 : align === "right" ? x - totalWidth : x;
    const image = getUiSprite(UPGRADE_STAR_SRC);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      for (let i = 0; i < count; i += 1) {
        ctx.drawImage(image, Math.round(startX + i * (size + gap)), Math.round(y - size / 2), size, size);
      }
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.fillStyle = "#f0c64a";
    ctx.strokeStyle = "#85512e";
    ctx.lineWidth = 2;
    ctx.font = `900 ${Math.max(8, Math.round(size * 0.95))}px Inter, sans-serif`;
    ctx.textAlign = align === "center" ? "center" : align === "right" ? "right" : "left";
    ctx.textBaseline = "middle";
    ctx.strokeText(stars(count), x, y);
    ctx.fillText(stars(count), x, y);
    ctx.restore();
  }

  function drawRarityBadge(x, y, rarityId, size = "normal") {
    const rarity = rarityInfo(rarityId);
    const small = size === "small";
    const w = small ? Math.max(48, Math.ceil(rarity.label.length * 6.8)) : 68;
    const h = small ? 17 : 20;
    roundedRect(x, y, w, h, 5);
    ctx.fillStyle = rarity.fill;
    ctx.fill();
    ctx.strokeStyle = small ? "rgba(22, 57, 45, 0.28)" : rarity.stroke;
    ctx.lineWidth = small ? 1 : 2;
    ctx.stroke();
    ctx.fillStyle = rarity.text;
    ctx.font = small ? "900 7px Inter, sans-serif" : "900 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(small ? rarity.label.toUpperCase() : rarity.label, x + w / 2, y + h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = 1;
  }

  function drawRarityDot(x, y, rarityId) {
    const rarity = rarityInfo(rarityId);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = rarity.fill;
    ctx.fill();
    ctx.strokeStyle = rarity.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawTraitChips(traits, x, y, maxWidth, options = {}) {
    let cursor = x;
    let row = 0;
    const gap = options.gap ?? 3;
    const rowHeight = options.rowHeight ?? 14;
    const maxRows = options.maxRows ?? 1;
    const fontSize = options.fontSize ?? 7;
    const minWidth = options.minWidth ?? 28;
    traits.forEach((traitId) => {
      const info = traitInfo(traitId);
      const text = traitDisplayText(traitId);
      ctx.font = `900 ${fontSize}px Inter, sans-serif`;
      let w = Math.max(minWidth, Math.ceil(ctx.measureText(text).width + 8));
      if (cursor + w > x + maxWidth) {
        if (row + 1 >= maxRows) return;
        row += 1;
        cursor = x;
      }
      w = Math.min(w, maxWidth);
      if (w < minWidth) return;
      const chipY = y + row * rowHeight;
      roundedRect(cursor, chipY, w, 14, 4);
      ctx.fillStyle = info.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(22, 57, 45, 0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
      registerTooltip(cursor, chipY, w, 14, {
        title: `${traitDisplayText(traitId)} trait`,
        body: info.effect || "Counts toward a team trait bonus.",
      });
      ctx.fillStyle = "#16392d";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, cursor + w / 2, chipY + 8, w - 5);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      cursor += w + gap;
    });
  }

  function drawActiveTraitRows(x, y, maxWidth, maxRows = Infinity) {
    const activeTraits = activePlayerTraits().filter((trait) => trait.active);
    const traits = Number.isFinite(maxRows) ? activeTraits.slice(0, maxRows) : activeTraits;
    ctx.fillStyle = "#16392d";
    ctx.font = "800 12px Inter, sans-serif";
    ctx.fillText("Active traits", x, y);
    if (!traits.length) {
      ctx.fillStyle = "#6a4b35";
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillText("No active traits", x, y + 20);
      return;
    }
    traits.forEach((trait, index) => {
      const rowY = y + 20 + index * 22;
      roundedRect(x, rowY - 11, 74, 16, 4);
      ctx.fillStyle = trait.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(22, 57, 45, 0.18)";
      ctx.stroke();
      ctx.fillStyle = "#16392d";
      ctx.font = "900 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${traitDisplayText(trait.id)} ${trait.count}`, x + 37, rowY - 3, 68);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.font = "700 10px Inter, sans-serif";
      fitText(trait.effect, x + 82, rowY, maxWidth - 82, "700 10px Inter, sans-serif", "#6a4b35");
    });
  }

  function drawArenaInfoRows(x, y, maxWidth, maxRows = 3) {
    const arena = currentArena();
    drawInfoSectionTitle("Arena", x, y);
    roundedRect(x, y + 9, maxWidth, 34, 7);
    ctx.fillStyle = "rgba(255, 249, 214, 0.72)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.12)";
    ctx.stroke();
    roundedRect(x + 8, y + 17, 34, 16, 5);
    ctx.fillStyle = arena.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    registerTooltip(x + 8, y + 17, 34, 16, {
      title: arena.name,
      body: arena.mood,
    });
    ctx.fillStyle = "#16392d";
    ctx.font = "900 7px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ARENA", x + 25, y + 25, 30);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText(arena.name, x + 48, y + 24, maxWidth - 56, "900 11px Inter, sans-serif", "#16392d");
    fitText(arena.mood, x + 48, y + 38, maxWidth - 56, "700 9px Inter, sans-serif", "#6a4b35");
    arena.effects.slice(0, maxRows).forEach((effect, index) => {
      const rowY = y + 61 + index * 18;
      const helpful = effect.tag === "HELP";
      roundedRect(x, rowY - 12, 34, 15, 4);
      ctx.fillStyle = helpful ? "#e7ffd9" : "#ffe2d8";
      ctx.fill();
      ctx.strokeStyle = helpful ? "rgba(74, 158, 104, 0.28)" : "rgba(217, 87, 60, 0.28)";
      ctx.stroke();
      registerTooltip(x, rowY - 12, maxWidth, 15, {
        title: helpful ? "Arena help" : "Arena pressure",
        body: effect.text,
      });
      ctx.fillStyle = helpful ? "#24683e" : "#8c3627";
      ctx.font = "900 7px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(helpful ? "UP" : "DN", x + 17, rowY - 4);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      fitText(effect.text, x + 42, rowY, maxWidth - 42, "700 9px Inter, sans-serif", "#6a4b35");
    });
  }

  function drawArenaBattlePanel() {
    const arena = currentArena();
    const x = 642;
    const y = 66;
    const w = 326;
    const h = 60;
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = "rgba(255, 253, 232, 0.84)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.2)";
    ctx.stroke();
    roundedRect(x + 10, y + 9, 42, 18, 6);
    ctx.fillStyle = arena.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    ctx.fillStyle = "#16392d";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ARENA", x + 31, y + 18);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText(arena.name, x + 60, y + 18, w - 72, "900 12px Inter, sans-serif", "#16392d");
    fitText(arena.mood, x + 60, y + 33, w - 72, "800 8px Inter, sans-serif", "#6a4b35");
    const chipY = y + 45;
    const gap = 5;
    const chipW = Math.floor((w - 20 - gap * 2) / 3);
    arena.effects.forEach((effect, index) => {
      const chipX = x + 10 + index * (chipW + gap);
      const helpful = effect.tag === "HELP";
      roundedRect(chipX, chipY - 9, chipW, 12, 4);
      ctx.fillStyle = helpful ? "#e7ffd9" : "#ffe2d8";
      ctx.fill();
      registerTooltip(chipX, chipY - 9, chipW, 12, {
        title: helpful ? "Arena help" : "Arena pressure",
        body: effect.text,
      });
      ctx.fillStyle = helpful ? "#24683e" : "#8c3627";
      ctx.font = "900 6px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(helpful ? "UP" : "DN", chipX + 12, chipY - 3);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      fitText(effect.text, chipX + 27, chipY, chipW - 31, "700 7px Inter, sans-serif", "#6a4b35");
    });
  }

  function drawBattleMoldPanel(battle = visibleBattle()) {
    if (!battle) return;
    const mold = moldStateText(battle);
    const x = 56;
    const y = 84;
    const w = 236;
    const h = 36;
    roundedRect(x, y, w, h, 8);
    ctx.fillStyle = mold.active ? "rgba(229, 244, 198, 0.9)" : "rgba(255, 253, 232, 0.86)";
    ctx.fill();
    ctx.strokeStyle = mold.active ? "rgba(83, 122, 54, 0.5)" : "rgba(22, 57, 45, 0.2)";
    ctx.stroke();
    roundedRect(x + 9, y + 6, 26, 24, 6);
    ctx.fillStyle = "rgba(255, 253, 232, 0.72)";
    ctx.fill();
    ctx.strokeStyle = mold.active ? "rgba(83, 122, 54, 0.45)" : "rgba(22, 57, 45, 0.15)";
    ctx.stroke();
    const icon = getStatusEffectSprite("mold");
    if (icon && icon.complete && icon.naturalWidth) {
      const smoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(icon, x + 12, y + 7, 22, 22);
      ctx.imageSmoothingEnabled = smoothing;
    } else {
      drawStatusGlyph({ id: "mold", ...STATUS_EFFECT_STYLES.mold }, x + 22, y + 18, 7);
    }
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText("Mold", x + 42, y + 15, 42, "900 10px Inter, sans-serif", mold.active ? "#2f5f2d" : "#6a4b35");
    const label = mold.active
      ? `Stack ${mold.stacks} - ${mold.damagePct}% HP/s`
      : `Starts in ${Math.ceil(mold.nextTickIn)}s`;
    fitText(label, x + 86, y + 22, w - 96, "900 12px Inter, sans-serif", "#16392d");
  }

  function drawInfoSectionTitle(text, x, y) {
    ctx.fillStyle = "#16392d";
    ctx.font = "900 11px Inter, sans-serif";
    ctx.fillText(text, x, y);
  }

  function drawInfoDivider(x, y, w) {
    ctx.strokeStyle = "rgba(22, 57, 45, 0.14)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
  }

  function drawInfoMetric(label, value, x, y, w = 48) {
    roundedRect(x, y, w, 34, 6);
    ctx.fillStyle = "rgba(255, 249, 214, 0.72)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.12)";
    ctx.stroke();
    ctx.fillStyle = "#6a4b35";
    ctx.font = "800 8px Inter, sans-serif";
    ctx.fillText(label, x + 7, y + 12);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 14px Inter, sans-serif";
    if (value && typeof value === "object" && value.currency !== undefined) {
      drawCurrencyAmount(value.currency, x + 7, y + 24, {
        sign: value.sign || "",
        font: "900 14px Inter, sans-serif",
        color: "#16392d",
        iconSize: 13,
        maxWidth: w - 12,
      });
    } else {
      const text = String(value);
      const valueFont = text.length >= 5 && w <= 54 ? "900 12px Inter, sans-serif" : "900 14px Inter, sans-serif";
      fitText(text, x + 7, y + 27, w - 12, valueFont, "#16392d");
    }
  }

  function drawSmallProgressBar(x, y, w, pct, color) {
    roundedRect(x, y, w, 7, 4);
    ctx.fillStyle = "rgba(22, 57, 45, 0.12)";
    ctx.fill();
    const fill = Math.max(0, Math.min(w, w * pct));
    if (fill <= 0) return;
    roundedRect(x, y, fill, 7, Math.min(4, fill / 2));
    ctx.fillStyle = color;
    ctx.fill();
  }

  function traitContextForUnit(unit, ref) {
    const boardUnits = state.board.filter(isUnit);
    const current = traitSnapshotForUnits(boardUnits);
    const previewUnits = ref.area === "board" ? boardUnits : [...boardUnits, unit];
    const projected = traitSnapshotForUnits(previewUnits);
    return (unit.traits || []).map((traitId) => {
      const now = current.find((trait) => trait.id === traitId) || traitInfo(traitId);
      const next = projected.find((trait) => trait.id === traitId) || now;
      return {
        ...next,
        currentCount: now.count || 0,
        projectedCount: next.count || 0,
        preview: ref.area !== "board",
      };
    });
  }

  function drawTraitImpactRows(unit, ref, x, y, maxWidth, maxRows = 3) {
    drawInfoSectionTitle("Trait impact", x, y);
    const rows = traitContextForUnit(unit, ref).slice(0, maxRows);
    rows.forEach((trait, index) => {
      const rowY = y + 20 + index * 19;
      roundedRect(x, rowY - 12, 70, 15, 4);
      ctx.fillStyle = trait.color || traitInfo(trait.id).color;
      ctx.fill();
      ctx.strokeStyle = "rgba(22, 57, 45, 0.18)";
      ctx.stroke();
      const traitTooltip = {
        title: `${traitDisplayText(trait.id)} trait`,
        body: trait.effect || (trait.nextAt ? `Next bonus at ${trait.nextAt}.` : "Trait is inactive."),
      };
      registerTooltip(x, rowY - 12, 70, 15, traitTooltip);
      ctx.fillStyle = "#16392d";
      ctx.font = "900 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(traitDisplayText(trait.id), x + 35, rowY - 4, 64);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      const countText = trait.preview ? `${trait.currentCount}>${trait.projectedCount}` : `${trait.currentCount}`;
      ctx.fillStyle = "#16392d";
      ctx.font = "900 10px Inter, sans-serif";
      ctx.fillText(countText, x + 78, rowY);
      const effect = trait.effect || (trait.nextAt ? `Next at ${trait.nextAt}` : "Inactive");
      fitText(effect, x + 108, rowY, maxWidth - 108, "700 10px Inter, sans-serif", "#6a4b35");
    });
  }

  function selectedSellButton(ref) {
    return { ...buttons.sell, x: INFO_PANEL.x + INFO_PANEL.w - buttons.sell.w - 20, y: INFO_PANEL.y + INFO_PANEL.h - 42 };
  }

  function selectedDetachButton(ref) {
    if (ref && isUnit(ref.entry)) {
      const slot = equipmentSlotRect();
      return {
        ...buttons.detach,
        x: slot.x + slot.w + 2,
        y: slot.y + (slot.h - 28) / 2,
        w: 24,
        h: 28,
        label: "",
        iconId: "action_detach",
      };
    }
    return buttons.detach;
  }

  function drawSelectedEquipmentSlot(unit) {
    const rect = equipmentSlotRect();
    const hovered = state.hover?.area === "equipment";
    const canDropHere = Boolean(state.drag && isPotentialDropTarget(state.drag, "equipment", 0));
    const valid = canDropDrag(state.drag, "equipment", 0);
    roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
    ctx.fillStyle = canDropHere && valid ? "#e7ffd9" : hovered ? "#fff9d6" : "rgba(255, 249, 214, 0.74)";
    ctx.fill();
    ctx.strokeStyle = canDropHere ? (valid ? "#4a9e68" : "#d9573c") : unit.item ? "#d99043" : "rgba(22, 57, 45, 0.24)";
    ctx.lineWidth = canDropHere || hovered ? 3 : 1.5;
    ctx.stroke();
    ctx.lineWidth = 1;
    if (unit.item) {
      drawItemIcon(unit.item, rect.x + rect.w / 2, rect.y + 32, 20);
      fitText(itemDisplayShort(unit.item), rect.x + 6, rect.y + rect.h - 9, rect.w - 12, "900 9px Inter, sans-serif", "#16392d");
    } else {
      ctx.fillStyle = "rgba(22, 57, 45, 0.52)";
      ctx.font = "900 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("TOP", rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }
  }

  function drawFavoriteToppingRow(unit, x, y, maxWidth) {
    const favorite = favoriteToppingFor(unit);
    if (!favorite) return 0;
    const item = itemInfo(favorite.itemId);
    const fill = favorite.unlocked ? "#e7ffd9" : "#fff9d6";
    const stroke = favorite.unlocked ? "#4a9e68" : "rgba(22, 57, 45, 0.18)";
    const cardTop = y - 17;
    const badgeText = favorite.unlocked ? "ACTIVE" : "FAV";
    const badgeW = favorite.unlocked ? 38 : 25;
    const badgeX = x + maxWidth - badgeW - 8;
    const iconRadius = 24;
    const iconDrawRadius = 19;
    const iconX = x + 31;
    const iconY = cardTop + 31;
    const textX = x + 68;
    const textW = badgeX - textX - 5;
    const specW = maxWidth - 76;
    const specs = favorite.specs || favoriteToppingSpecLines(unit);
    const specLineHeight = 10;
    ctx.font = "800 8.5px Inter, sans-serif";
    const specRows = specs.reduce((total, line) => total + wrappedTextLines(line, specW).length, 0);
    const cardH = Math.max(86, 46 + specRows * specLineHeight + Math.max(0, specs.length - 1) * 2);
    roundedRect(x, cardTop, maxWidth, cardH, 6);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = favorite.unlocked ? 2 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(iconX, iconY, iconRadius, 0, Math.PI * 2);
    ctx.fillStyle = favorite.unlocked ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.72)";
    ctx.fill();
    ctx.strokeStyle = favorite.unlocked ? "rgba(74, 158, 104, 0.42)" : "rgba(106, 75, 53, 0.18)";
    ctx.stroke();
    drawItemIcon(item, iconX, iconY, iconDrawRadius);

    roundedRect(badgeX, cardTop + 8, badgeW, 16, 5);
    ctx.fillStyle = favorite.unlocked ? "#4a9e68" : "#f1cf75";
    ctx.fill();
    ctx.fillStyle = "#16392d";
    ctx.font = "900 8px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, badgeX + badgeW / 2, cardTop + 16);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    fitText(favorite.itemName, textX, cardTop + 20, textW, "900 10px Inter, sans-serif", "#16392d");
    ctx.fillStyle = "#6a4b35";
    ctx.font = "800 8.5px Inter, sans-serif";
    let lineY = cardTop + 36;
    specs.forEach((line) => {
      const drawnRows = drawWrappedTextFull(line, textX, lineY, specW, specLineHeight);
      lineY += drawnRows * specLineHeight + 2;
    });
    return cardH;
  }

  function codexAnimalById(id = state.codexSelectedId) {
    return CATALOG.find((animal) => animal.id === id) || CATALOG[0];
  }

  function codexSelectedFormTier(animal = codexAnimalById()) {
    const maxTier = Math.max(1, animal?.forms?.length || 1);
    return Math.max(1, Math.min(maxTier, state.codexSelectedFormTier || 1));
  }

  function codexMealSelected() {
    return state.codexTab === "food" && state.codexSelectedFormTier === 0;
  }

  function codexSelectedItemTier() {
    return Math.max(1, Math.min(MAX_ITEM_TIER, state.codexSelectedItemTier || 1));
  }

  function codexToppings() {
    return ITEMS.filter((item) => isTopping(item));
  }

  function codexDrinks() {
    return ITEMS.filter((item) => isDrink(item));
  }

  function rarityRank(rarityId) {
    const ids = Object.keys(RARITIES);
    const index = ids.indexOf(rarityId || "common");
    return index >= 0 ? index : 0;
  }

  function codexFilterState(tabId = state.codexTab) {
    const defaults = CODEX_DEFAULT_FILTERS[tabId] || {};
    state.codexFilters = state.codexFilters || JSON.parse(JSON.stringify(CODEX_DEFAULT_FILTERS));
    state.codexFilters[tabId] = { ...defaults, ...(state.codexFilters[tabId] || {}) };
    return state.codexFilters[tabId];
  }

  function foodRoleGroup(animal) {
    const ability = animal?.ability || "";
    if (["guard", "syrup_start", "row_guard", "cleanse", "pit_guard", "crisp_heal", "caprese_row"].includes(ability)) return "support";
    if (["pretzel_delay", "sour_slow", "taffy_bind", "opening_pull", "pearl_stun", "pearl_lock", "crisp_bind", "garden_opener", "status_spread"].includes(ability)) return "control";
    if (["survive_income", "copycat", "trail_gold", "market_cart"].includes(ability)) return "economy";
    if (["survivor_scaling", "decoy_summon", "kernel_combo", "late_scale"].includes(ability)) return "scaling";
    return "damage";
  }

  function toppingEffectGroup(item) {
    if (item.sellBonusGold || item.surviveGold || item.firstItemDiscountGold || item.sameLineShopChancePct) return "economy";
    if (
      item.maxHpBonusPct || item.shieldAfterAttackPct || item.hitShieldPct || item.startShieldPct ||
      item.frontDamageReductionPct || item.reviveHpPct || item.statusDamageReductionPct || item.decoyHpPct ||
      item.aoeDamageReductionPct || item.shieldCapBonusPct || item.teamOverhealShieldPct ||
      item.shieldCrackleDamagePct
    ) return "defense";
    if (
      item.healShieldBonusPct || item.healEveryThird || item.allyHastePct || item.supportSharePct ||
      item.cleanseInterval || item.supportAttackBuffPct || item.teamHastePct || item.supportRowEchoPct ||
      item.extraAdjacentHealPct
    ) return "support";
    if (
      item.damageBonusPct || item.attackSpeedPct || item.abilityPowerBonusPct || item.burnDamagePerSecond ||
      item.markDamagePct || item.glassDamageBonusPct || item.splashDamagePct || item.lateFightDamagePct ||
      item.comebackDamagePct || item.bounceDamagePct || item.firstAttacksBonusPct || item.teamVulnerabilityPct ||
      item.executeSplashBonusPct || item.executeSplashDamagePct || item.periodicDamage || item.periodicDamagePct
    ) return "offense";
    return "utility";
  }

  function drinkStatGroup(item) {
    if (item.drinkPulseType) return "pulse";
    if (item.drinkAttackSpeedPct) return "speed";
    if (item.drinkMaxHpPct) return "hp";
    if (item.drinkAbilityPowerPct) return "pwr";
    return "utility";
  }

  function drinkMatchesStatFilter(item, statId) {
    if (statId === "all") return true;
    if (statId === "speed") return Boolean(item.drinkAttackSpeedPct);
    if (statId === "hp") return Boolean(item.drinkMaxHpPct);
    if (statId === "pwr") return Boolean(item.drinkAbilityPowerPct);
    if (statId === "pulse") return Boolean(item.drinkPulseType);
    return drinkStatGroup(item) === statId;
  }

  function codexRoleLabel(roleId) {
    return {
      all: "All",
      damage: "Damage",
      support: "Support",
      control: "Control",
      economy: "Economy",
      scaling: "Scaling",
    }[roleId] || "All";
  }

  function codexEffectLabel(effectId) {
    return {
      all: "All",
      offense: "Offense",
      defense: "Defense",
      support: "Support",
      utility: "Utility",
      economy: "Economy",
    }[effectId] || "All";
  }

  function codexDrinkStatLabel(statId) {
    return {
      all: "All",
      speed: "Speed",
      hp: "Max Health",
      pwr: "Ability Power",
      pulse: "Pulse",
      utility: "Utility",
    }[statId] || "All";
  }

  function codexRarityLabel(rarityId) {
    return rarityId === "all" ? "All" : rarityInfo(rarityId).label;
  }

  function codexTraitLabel(traitId) {
    return traitId === "all" ? "All" : traitDisplayText(traitId);
  }

  function codexFilterOptions(tabId, key) {
    if (key === "rarity") return ["all", ...Object.keys(RARITIES)];
    if (tabId === "food" && key === "trait") return ["all", ...Object.keys(TRAITS)];
    if (tabId === "food" && key === "role") return ["all", "damage", "support", "control", "economy", "scaling"];
    if (tabId === "toppings" && key === "effect") return ["all", "offense", "defense", "support", "utility", "economy"];
    if (tabId === "drinks" && key === "stat") return ["all", "speed", "hp", "pwr", "pulse"];
    if (tabId === "drinks" && key === "trait") return ["all", ...Object.keys(TRAITS)];
    return ["all"];
  }

  function codexFilterLabel(tabId, key, value) {
    if (key === "rarity") return `Rarity: ${codexRarityLabel(value)}`;
    if (key === "trait") return `Trait: ${codexTraitLabel(value)}`;
    if (key === "role") return `Role: ${codexRoleLabel(value)}`;
    if (key === "effect") return `Effect: ${codexEffectLabel(value)}`;
    if (key === "stat") return `Line: ${codexDrinkStatLabel(value)}`;
    return "All";
  }

  function codexFilterRowLabel(key) {
    return {
      rarity: "Rarity",
      trait: state.codexTab === "drinks" ? "Pair" : "Trait",
      role: "Role",
      effect: "Effect",
      stat: "Line",
    }[key] || "Filter";
  }

  function codexFilterOptionText(tabId, key, value) {
    if (value === "all") return "All";
    if (key === "rarity") return rarityInfo(value).label;
    if (key === "trait") return traitDisplayText(value);
    if (key === "role") return codexRoleLabel(value);
    if (key === "effect") return codexEffectLabel(value);
    if (key === "stat") return codexDrinkStatLabel(value);
    return String(value);
  }

  function codexFilterDefs(tabId = state.codexTab) {
    const filters = codexFilterState(tabId);
    if (tabId === "food") {
      return [
        { key: "rarity", label: codexFilterLabel(tabId, "rarity", filters.rarity) },
        { key: "trait", label: codexFilterLabel(tabId, "trait", filters.trait) },
        { key: "role", label: codexFilterLabel(tabId, "role", filters.role) },
      ];
    }
    if (tabId === "toppings") {
      return [
        { key: "rarity", label: codexFilterLabel(tabId, "rarity", filters.rarity) },
        { key: "effect", label: codexFilterLabel(tabId, "effect", filters.effect) },
      ];
    }
    return [
      { key: "rarity", label: codexFilterLabel(tabId, "rarity", filters.rarity) },
      { key: "stat", label: codexFilterLabel(tabId, "stat", filters.stat) },
      { key: "trait", label: codexFilterLabel(tabId, "trait", filters.trait) },
    ];
  }

  function codexFilterRows(tabId = state.codexTab) {
    return codexFilterDefs(tabId).map((def) => ({
      key: def.key,
      label: codexFilterRowLabel(def.key),
      options: codexFilterOptions(tabId, def.key),
    }));
  }

  function codexFilterOptionWidth(text) {
    const font = "900 8px Inter, sans-serif";
    const previousFont = ctx.font;
    ctx.font = font;
    const width = Math.ceil(ctx.measureText(text).width) + 14;
    ctx.font = previousFont;
    return Math.max(32, Math.min(CODEX_LIST.w - 56, width));
  }

  function codexFilterLayout(tabId = state.codexTab) {
    const rows = codexFilterRows(tabId);
    const layoutRows = [];
    const chipH = 18;
    const labelW = 56;
    const gap = 4;
    const lineGap = 3;
    const rowGap = 5;
    const startX = CODEX_LIST.x + labelW;
    const availableW = CODEX_LIST.w - labelW;
    let y = CODEX_LIST.y + 4;
    rows.forEach((row) => {
      let x = CODEX_LIST.x + labelW;
      let optionY = y + 3;
      let lineCount = 1;
      const options = row.options.map((value) => {
        const text = codexFilterOptionText(tabId, row.key, value);
        const w = codexFilterOptionWidth(text);
        if (x > startX && x + w > startX + availableW) {
          x = startX;
          optionY += chipH + lineGap;
          lineCount += 1;
        }
        const option = {
          key: row.key,
          value,
          label: row.label,
          text,
          rect: { x, y: optionY, w, h: chipH },
        };
        x += w + gap;
        return option;
      });
      const h = lineCount * chipH + (lineCount - 1) * lineGap + 6;
      layoutRows.push({ ...row, y, h, labelY: y + 17, options });
      y += h + rowGap;
    });
    return { rows: layoutRows, height: Math.max(0, y - (CODEX_LIST.y + 4) - rowGap) };
  }

  function codexFilterOptionRects() {
    return codexFilterLayout().rows.flatMap((row) => row.options);
  }

  function syncCodexSelectionToVisibleEntry() {
    const entry = codexEntries()[0] || null;
    if (state.codexTab === "toppings") {
      state.codexSelectedToppingId = entry?.id || state.codexSelectedToppingId;
      state.codexSelectedItemTier = 1;
    } else if (state.codexTab === "drinks") {
      state.codexSelectedDrinkId = entry?.id || state.codexSelectedDrinkId;
      state.codexSelectedItemTier = 1;
    } else {
      state.codexSelectedId = entry?.id || state.codexSelectedId;
      state.codexSelectedFormTier = 1;
    }
  }

  function setCodexFilter(key, value) {
    const tabId = state.codexTab;
    const filters = codexFilterState(tabId);
    if (!(key in filters)) return;
    filters[key] = value;
    syncCodexSelectionToVisibleEntry();
    state.message = codexFilterLabel(tabId, key, value);
  }

  function baseCodexEntries(tabId = state.codexTab) {
    if (tabId === "toppings") return codexToppings();
    if (tabId === "drinks") return codexDrinks();
    return CATALOG;
  }

  function entryMatchesCodexFilters(entry, tabId = state.codexTab) {
    const filters = codexFilterState(tabId);
    if (filters.rarity !== "all" && (entry.rarity || "common") !== filters.rarity) return false;
    if (tabId === "food") {
      if (filters.trait !== "all" && !entry.traits?.includes(filters.trait)) return false;
      if (filters.role !== "all" && foodRoleGroup(entry) !== filters.role) return false;
      return true;
    }
    if (tabId === "toppings") {
      if (filters.effect !== "all" && toppingEffectGroup(entry) !== filters.effect) return false;
      return true;
    }
    if (!drinkMatchesStatFilter(entry, filters.stat)) return false;
    if (filters.trait !== "all" && !entry.pairTraits?.includes(filters.trait)) return false;
    return true;
  }

  function sortCodexEntries(entries) {
    return [...entries].sort((a, b) => {
      const rarityDiff = rarityRank(a.rarity) - rarityRank(b.rarity);
      if (rarityDiff) return rarityDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }

  function codexEntries() {
    return sortCodexEntries(baseCodexEntries().filter((entry) => entryMatchesCodexFilters(entry)));
  }

  function currentCodexEntry() {
    const visibleEntries = codexEntries();
    if (state.codexTab === "toppings") {
      const id = state.codexSelectedToppingId || visibleEntries[0]?.id;
      return visibleEntries.find((item) => item.id === id) || visibleEntries[0] || null;
    }
    if (state.codexTab === "drinks") {
      const id = state.codexSelectedDrinkId || visibleEntries[0]?.id;
      return visibleEntries.find((item) => item.id === id) || visibleEntries[0] || null;
    }
    const id = state.codexSelectedId || visibleEntries[0]?.id;
    return visibleEntries.find((animal) => animal.id === id) || visibleEntries[0] || null;
  }

  function codexUnitFor(animal, tier = 1) {
    const safeTier = Math.max(1, Math.min(animal.forms?.length || 1, tier));
    const form = animal.forms?.[safeTier - 1] || animal.forms?.[0] || { name: animal.name, short: animal.short };
    const scaling = tierScaling(safeTier);
    const maxHp = Math.round(animal.hp * scaling.hp * GLOBAL_HP_SCALE);
    const atk = Math.max(1, Math.round(animal.atk * scaling.atk));
    return {
      kind: "unit",
      typeId: animal.id,
      lineName: animal.name,
      name: form.name,
      short: form.short || animal.short,
      emoji: animal.emoji,
      rarity: animal.rarity || "common",
      family: animal.family || "meal",
      traits: [...(animal.traits || [])],
      color: animal.color,
      accent: animal.accent,
      role: animal.role,
      ability: animal.ability || "front",
      abilityText: animal.abilityText || "Front blockers",
      tier: safeTier,
      hp: maxHp,
      maxHp,
      baseAtk: atk,
      atk,
      abilityPower: Math.max(1, Math.round(animal.atk * scaling.ability)),
      speed: Math.max(0.28, animal.speed * scaling.speed),
      side: "ally",
      item: null,
      dead: false,
    };
  }

  function codexListLayout() {
    const filterLayout = codexFilterLayout();
    const filterH = filterLayout.height + 16;
    const listY = CODEX_LIST.y + Math.max(84, filterH);
    const listH = Math.max(150, CODEX_LIST.h - (listY - CODEX_LIST.y));
    if (state.codexTab === "toppings") {
      const cols = 3;
      const rowH = 19;
      const rows = Math.max(8, Math.floor(listH / rowH));
      return {
        ...CODEX_LIST,
        y: listY,
        h: listH,
        rows,
        cols,
        rowH,
        colW: CODEX_LIST.w / cols,
      };
    }
    if (state.codexTab === "food") {
      const cols = 3;
      const rowH = 18;
      const rows = Math.max(8, Math.floor(listH / rowH));
      return {
        ...CODEX_LIST,
        y: listY,
        h: listH,
        rows,
        cols,
        rowH,
        colW: CODEX_LIST.w / cols,
      };
    }
    const rowH = 22;
    return { ...CODEX_LIST, y: listY, h: listH, rows: Math.max(8, Math.floor(listH / rowH)), cols: 2, rowH, colW: CODEX_LIST.w / 2 };
  }

  function codexEntryRect(index) {
    const layout = codexListLayout();
    const col = Math.floor(index / layout.rows);
    const row = index % layout.rows;
    if (col >= layout.cols) return null;
    return {
      x: layout.x + col * layout.colW,
      y: layout.y + row * layout.rowH,
      w: layout.colW - 8,
      h: layout.rowH - 3,
    };
  }

  function codexCloseRect() {
    return { x: CODEX_PANEL.x + CODEX_PANEL.w - 43, y: CODEX_PANEL.y + 18, w: 28, h: 28 };
  }

  function codexTabRect(index) {
    return { x: CODEX_PANEL.x + 292 + index * 98, y: CODEX_PANEL.y + 24, w: 88, h: 28 };
  }

  function codexFormRect(index) {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const cardW = 61;
    const gap = 9;
    const fx = x + 22 + index * (cardW + gap);
    return { x: fx - 6, y: y + 246, w: cardW, h: 76 };
  }

  function codexItemFormRect(index) {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const fx = x + 48 + index * 96;
    return { x: fx - 40, y: y + 246, w: 80, h: 92 };
  }

  function hitTestCodex(pos) {
    if (pointInRect(pos.x, pos.y, codexCloseRect())) return { area: "codexClose", index: 0 };
    for (let i = 0; i < CODEX_TABS.length; i++) {
      if (pointInRect(pos.x, pos.y, codexTabRect(i))) return { area: "codexTab", index: i };
    }
    const filterOptions = codexFilterOptionRects();
    for (let i = 0; i < filterOptions.length; i++) {
      const option = filterOptions[i];
      if (pointInRect(pos.x, pos.y, option.rect)) {
        return { area: "codexFilter", index: i, key: option.key, value: option.value };
      }
    }
    if (state.codexTab === "food") {
      const animal = currentCodexEntry();
      const formCount = Math.min(5, (animal?.forms?.length || 0) + (getDefeatStillSprite(animal) ? 1 : 0));
      for (let i = 0; i < formCount; i++) {
        if (pointInRect(pos.x, pos.y, codexFormRect(i))) return { area: "codexForm", index: i };
      }
    } else if (state.codexTab === "toppings" || state.codexTab === "drinks") {
      for (let i = 0; i < MAX_ITEM_TIER; i++) {
        if (pointInRect(pos.x, pos.y, codexItemFormRect(i))) return { area: "codexItemForm", index: i };
      }
    }
    const entries = codexEntries();
    for (let i = 0; i < entries.length; i++) {
      const rect = codexEntryRect(i);
      if (rect && pointInRect(pos.x, pos.y, rect)) return { area: "codexEntry", index: i };
    }
    if (pointInRect(pos.x, pos.y, CODEX_PANEL)) return { area: "codex", index: 0 };
    return { area: "codexClose", index: 0 };
  }

  function drawCodexOverlay() {
    const panel = CODEX_PANEL;
    const entries = codexEntries();
    const entry = currentCodexEntry();
    ctx.save();
    ctx.fillStyle = "rgba(23, 34, 29, 0.48)";
    ctx.fillRect(0, 0, W, H);

    const menuBg = getUiSprite(FOOD_MENU_BG_SRC);
    roundedRect(panel.x, panel.y, panel.w, panel.h, 12);
    if (menuBg && menuBg.complete && menuBg.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(menuBg, panel.x, panel.y, panel.w, panel.h);
      ctx.fillStyle = "rgba(255, 253, 232, 0.08)";
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      ctx.restore();
    } else {
      ctx.fillStyle = "#fff7dc";
      ctx.fill();
    }
    roundedRect(panel.x, panel.y, panel.w, panel.h, 12);
    ctx.strokeStyle = "rgba(22, 57, 45, 0.32)";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#16392d";
    ctx.font = "900 26px Inter, sans-serif";
    ctx.fillText("Food Menu", panel.x + 28, panel.y + 42);

    drawCodexCloseButton();
    drawCodexTabs();
    drawCodexEntryList(entries);
    if (!entry) drawCodexEmptyDetails();
    else if (state.codexTab === "food") drawCodexAnimalDetails(entry);
    else drawCodexItemDetails(makeItem(entry.id), state.codexTab);
    ctx.restore();
  }

  function drawCodexTabs() {
    CODEX_TABS.forEach((tab, index) => {
      const rect = codexTabRect(index);
      const active = state.codexTab === tab.id;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 8);
      ctx.fillStyle = active ? "#16392d" : hovered ? "#fff9d6" : "rgba(255, 253, 232, 0.74)";
      ctx.fill();
      ctx.strokeStyle = active ? "#16392d" : "rgba(22, 57, 45, 0.18)";
      ctx.lineWidth = active ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle = active ? "#fff7dc" : "#16392d";
      ctx.font = "900 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tab.label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    });
    ctx.lineWidth = 1;
  }

  function drawCodexCloseButton() {
    const rect = codexCloseRect();
    const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
    roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
    ctx.fillStyle = hovered ? "#ffe0d8" : "#fff0d1";
    ctx.fill();
    ctx.strokeStyle = hovered ? "#d9573c" : "rgba(22, 57, 45, 0.2)";
    ctx.lineWidth = hovered ? 2 : 1;
    ctx.stroke();
    ctx.fillStyle = "#16392d";
    ctx.font = "900 16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("X", rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    registerTooltip(rect.x, rect.y, rect.w, rect.h, { title: "Close", body: "" });
  }

  function drawCodexInnerPanel(x, y, w, h, radius = 9) {
    const panelBg = getUiSprite(TEAM_INTEL_BG_SRC);
    roundedRect(x, y, w, h, radius);
    if (panelBg && panelBg.complete && panelBg.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(panelBg, x, y, w, h);
      ctx.fillStyle = "rgba(255, 253, 232, 0.48)";
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    } else {
      ctx.fillStyle = "rgba(255, 253, 232, 0.86)";
      ctx.fill();
    }
    roundedRect(x, y, w, h, radius);
    ctx.strokeStyle = "rgba(22, 57, 45, 0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawCodexFilters() {
    const filters = codexFilterState();
    const layout = codexFilterLayout();
    layout.rows.forEach((row) => {
      fitText(row.label, CODEX_LIST.x, row.labelY, 50, "900 8px Inter, sans-serif", "#6a4b35");
    });
    layout.rows.flatMap((row) => row.options).forEach((option) => {
      const rect = option.rect;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      const active = filters[option.key] === option.value;
      roundedRect(rect.x, rect.y, rect.w, rect.h, 7);
      ctx.fillStyle = active ? "#e7ffd9" : hovered ? "#fff9d6" : "rgba(255, 253, 232, 0.78)";
      ctx.fill();
      ctx.strokeStyle = active ? "#4a9e68" : hovered ? "rgba(106, 75, 53, 0.32)" : "rgba(22, 57, 45, 0.14)";
      ctx.lineWidth = active ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle = active ? "#16392d" : "#6a4b35";
      ctx.font = "900 8px Inter, sans-serif";
      ctx.fillText(option.text, rect.x + 7, rect.y + 13);
    });
    ctx.lineWidth = 1;
  }

  function drawCodexEntryList(entries) {
    const layout = codexListLayout();
    drawCodexInnerPanel(CODEX_LIST.x - 12, CODEX_LIST.y - 34, CODEX_LIST.w + 16, CODEX_LIST.h + 52);

    ctx.fillStyle = "#16392d";
    ctx.font = "900 13px Inter, sans-serif";
    const title = state.codexTab === "food" ? "Food" : state.codexTab === "toppings" ? "Toppings" : "Drinks";
    ctx.fillText(`${title} (${entries.length})`, CODEX_LIST.x, CODEX_LIST.y - 13);
    fitText("Rarity order", CODEX_LIST.x + CODEX_LIST.w - 94, CODEX_LIST.y - 13, 92, "800 9px Inter, sans-serif", "#6a4b35");
    drawCodexFilters();

    if (!entries.length) {
      ctx.fillStyle = "#6a4b35";
      ctx.font = "800 12px Inter, sans-serif";
      ctx.fillText("No matches", CODEX_LIST.x + 8, layout.y + 24);
      return;
    }

    entries.forEach((entry, index) => {
      const rect = codexEntryRect(index);
      if (!rect) return;
      const selected = codexEntrySelected(entry);
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 6);
      ctx.fillStyle = selected ? "#e7ffd9" : hovered ? "#fff9d6" : "rgba(255, 253, 232, 0.72)";
      ctx.fill();
      ctx.strokeStyle = selected ? "#4a9e68" : "rgba(22, 57, 45, 0.12)";
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      drawRarityDot(rect.x + 12, rect.y + rect.h / 2, entry.rarity);
      const font = layout.cols >= 3 ? "800 9.5px Inter, sans-serif" : "800 11px Inter, sans-serif";
      const label = state.codexTab === "food" ? entry.name : entry.name;
      fitText(label, rect.x + 25, rect.y + Math.round(rect.h * 0.66), rect.w - 32, font, "#16392d");
    });
  }

  function codexEntrySelected(entry) {
    if (!entry) return false;
    return entry.id === currentCodexEntry()?.id;
  }

  function drawCodexEmptyDetails() {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const w = CODEX_PANEL.x + CODEX_PANEL.w - x - 28;
    drawCodexInnerPanel(x, y, w, CODEX_LIST.h + 52);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 18px Inter, sans-serif";
    ctx.fillText("No matches", x + 24, y + 48);
  }

  function drawCodexAnimalDetails(animal) {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const w = CODEX_PANEL.x + CODEX_PANEL.w - x - 28;
    const selectedMeal = codexMealSelected();
    const selectedTier = selectedMeal ? 1 : codexSelectedFormTier(animal);
    const unit = codexUnitFor(animal, selectedTier);
    const form = selectedMeal ? { name: "Meal", short: "Meal" } : animal.forms?.[selectedTier - 1] || { name: animal.name, short: animal.short };
    drawCodexInnerPanel(x, y, w, CODEX_LIST.h + 52);

    if (selectedMeal) {
      const mealImage = getDefeatStillSprite(animal);
      if (mealImage && mealImage.complete && mealImage.naturalWidth > 0) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 0.92;
        const size = 96;
        ctx.drawImage(mealImage, Math.round(x + 58 - size / 2), Math.round(y + 82 - size / 2), size, size);
        ctx.restore();
        ctx.imageSmoothingEnabled = true;
      }
    } else {
      drawFoodAnimal(unit, x + 58, y + 82, 42, true);
      drawUpgradeStars(selectedTier, x + 58, y + 136, 9, "center");
    }
    drawCodexAttackParticlePreview(animal, x + w - 42, y + 82, 34);

    const headerReserve = 82;
    ctx.fillStyle = "#16392d";
    ctx.font = "900 20px Inter, sans-serif";
    fitText(animal.name, x + 128, y + 36, w - 144 - headerReserve, "900 20px Inter, sans-serif", "#16392d");
    fitText(form.name, x + 128, y + 64, w - 144 - headerReserve, "900 16px Inter, sans-serif", "#16392d");
    ctx.fillStyle = "#6a4b35";
    ctx.font = "800 12px Inter, sans-serif";
    fitText(`${animal.role || "Food animal"} - ${familyLabel(animal.family)}`, x + 128, y + 84, w - 144 - headerReserve, "800 12px Inter, sans-serif", "#6a4b35");
    drawRarityBadge(x + 128, y + 99, animal.rarity, "small");
    drawTraitChips(animal.traits || [], x + 196, y + 99, w - 210 - headerReserve, { maxRows: 2, fontSize: 8, minWidth: 38, rowHeight: 16 });

    const metricY = y + 154;
    drawInfoMetric("ATK", unit.atk, x + 20, metricY, 56);
    drawInfoMetric("HP", unit.maxHp, x + 86, metricY, 64);
    drawInfoMetric("CD", unit.speed.toFixed(2), x + 160, metricY, 58);

    drawInfoDivider(x + 20, y + 209, w - 40);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.fillText("Forms", x + 20, y + 234);
    (animal.forms || []).slice(0, 4).forEach((form, index) => {
      const formUnit = codexUnitFor(animal, index + 1);
      const rect = codexFormRect(index);
      const selected = !selectedMeal && index + 1 === selectedTier;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 8);
      ctx.fillStyle = selected ? "rgba(231, 255, 217, 0.86)" : hovered ? "rgba(255, 249, 214, 0.88)" : "rgba(255, 253, 232, 0.46)";
      ctx.fill();
      ctx.strokeStyle = selected ? "#4a9e68" : hovered ? "rgba(106, 75, 53, 0.32)" : "rgba(22, 57, 45, 0.11)";
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      const centerX = rect.x + rect.w / 2;
      drawFoodAnimal(formUnit, centerX, y + 268, 15, true);
      drawUpgradeStars(index + 1, centerX, y + 296, 7, "center");
      fitText(form.short || form.name, rect.x + 5, y + 313, rect.w - 10, "800 8px Inter, sans-serif", "#6a4b35");
    });
    const mealRect = codexFormRect(4);
    const mealSelected = selectedMeal;
    const mealHovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, mealRect);
    roundedRect(mealRect.x, mealRect.y, mealRect.w, mealRect.h, 8);
    ctx.fillStyle = mealSelected ? "rgba(231, 255, 217, 0.86)" : mealHovered ? "rgba(255, 249, 214, 0.88)" : "rgba(255, 253, 232, 0.46)";
    ctx.fill();
    ctx.strokeStyle = mealSelected ? "#4a9e68" : mealHovered ? "rgba(106, 75, 53, 0.32)" : "rgba(22, 57, 45, 0.11)";
    ctx.lineWidth = mealSelected ? 2 : 1;
    ctx.stroke();
    const mealImage = getDefeatStillSprite(animal);
    const mealCenterX = mealRect.x + mealRect.w / 2;
    if (mealImage && mealImage.complete && mealImage.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 0.9;
      const size = 42;
      ctx.drawImage(mealImage, Math.round(mealCenterX - size / 2), Math.round(y + 268 - size / 2), size, size);
      ctx.restore();
      ctx.imageSmoothingEnabled = true;
    }
    fitText("Meal", mealRect.x + 5, y + 313, mealRect.w - 10, "800 8px Inter, sans-serif", "#6a4b35");

    const favoriteH = drawCodexFavoriteToppingDetails(unit, x + 20, y + 328, w - 40);
    const effectsTitleY = y + 328 + favoriteH + 12;
    ctx.fillStyle = "#16392d";
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText("Effects by level", x + 20, effectsTitleY);
    drawCodexLevelEffectFullRows(
      (animal.forms || []).slice(0, 4).map((_, index) => ({
        label: `Lv ${index + 1}`,
        text: abilitySpecLine(codexUnitFor(animal, index + 1)),
      })),
      x + 20,
      effectsTitleY + 15,
      w - 40
    );

  }

  function drawCodexAttackParticlePreview(animal, centerX, centerY, radius) {
    const image = getAttackParticleSprite(animal?.id);
    roundedRect(centerX - radius, centerY - radius, radius * 2, radius * 2, 8);
    ctx.fillStyle = "rgba(255, 249, 214, 0.62)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (!image || !image.complete || image.naturalWidth <= 0) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.94;
    const size = radius * 1.48;
    ctx.drawImage(image, Math.round(centerX - size / 2), Math.round(centerY - size / 2), size, size);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drawCodexFavoriteToppingDetails(unit, x, y, maxWidth) {
    const favorite = favoriteToppingFor(unit);
    if (!favorite) return 0;
    const item = itemInfo(favorite.itemId);
    const specs = favorite.specs || favoriteToppingSpecLines(unit);
    const lineHeight = 8.5;
    const specFont = "800 8px Inter, sans-serif";
    ctx.font = specFont;
    const iconSize = 48;
    const iconPad = 8;
    const textX = x + iconSize + iconPad + 12;
    const textW = maxWidth - iconSize - iconPad - 50;
    const specW = maxWidth - iconSize - iconPad - 24;
    const specRows = specs.reduce((total, line) => total + wrappedTextLines(line, specW).length, 0);
    const cardH = Math.max(78, 34 + specRows * lineHeight + Math.max(0, specs.length - 1) * 2);

    roundedRect(x, y, maxWidth, cardH, 7);
    ctx.fillStyle = "rgba(255, 249, 214, 0.78)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();

    roundedRect(x + 8, y + 10, iconSize, iconSize, 8);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(106, 75, 53, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();
    drawItemIcon(item, x + 8 + iconSize / 2, y + 10 + iconSize / 2, 22);
    fitText(favorite.itemName, textX, y + 17, textW, "900 10px Inter, sans-serif", "#16392d");
    roundedRect(x + maxWidth - 30, y + 8, 22, 14, 5);
    ctx.fillStyle = "#f1cf75";
    ctx.fill();
    ctx.fillStyle = "#16392d";
    ctx.font = "900 6.5px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FAV", x + maxWidth - 19, y + 15);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "#6a4b35";
    ctx.font = specFont;
    let lineY = y + 32;
    specs.forEach((line) => {
      const drawnRows = drawWrappedTextFull(line, textX, lineY, specW, lineHeight);
      lineY += drawnRows * lineHeight + 2;
    });
    return cardH;
  }

  function drawCodexLevelEffectFullRows(rows, x, y, maxWidth) {
    const labelW = 28;
    const gap = 9;
    const textX = x + labelW + gap;
    const textW = maxWidth - labelW - gap;
    const lineHeight = 9.5;
    const textFont = "800 8.5px Inter, sans-serif";
    ctx.font = textFont;
    let rowY = y;
    rows.forEach((row, index) => {
      const lines = wrappedTextLines(row.text, textW);
      const rowH = Math.max(15, lines.length * lineHeight + 3);
      roundedRect(x, rowY - 11, labelW, 14, 4);
      ctx.fillStyle = "rgba(255, 249, 214, 0.82)";
      ctx.fill();
      ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#16392d";
      ctx.font = "900 7px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.label, x + labelW / 2, rowY - 4);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#6a4b35";
      ctx.font = textFont;
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, textX, rowY + lineIndex * lineHeight);
      });
      rowY += rowH + 1;
    });
  }

  function drawCodexItemDetails(item, tabId) {
    const x = CODEX_LIST.x + CODEX_LIST.w + 34;
    const y = CODEX_LIST.y - 34;
    const w = CODEX_PANEL.x + CODEX_PANEL.w - x - 28;
    const typeLabel = tabId === "drinks" ? "Drink" : "Topping";
    const selectedTier = codexSelectedItemTier();
    const selectedItem = makeItem(item.id, selectedTier);
    drawCodexInnerPanel(x, y, w, CODEX_LIST.h + 52);

    drawItemIcon(selectedItem, x + 58, y + 82, 42);
    drawUpgradeStars(selectedTier, x + 58, y + 136, 9, "center");
    const headerReserve = isDrink(item) ? 82 : 0;
    if (isDrink(item)) drawCodexDrinkParticlePreview(item, x + w - 42, y + 82, 34);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 20px Inter, sans-serif";
    fitText(item.name, x + 128, y + 36, w - 144 - headerReserve, "900 20px Inter, sans-serif", "#16392d");
    fitText(`Lv ${selectedTier}`, x + 128, y + 64, w - 144 - headerReserve, "900 16px Inter, sans-serif", "#16392d");
    ctx.fillStyle = "#6a4b35";
    ctx.font = "800 12px Inter, sans-serif";
    fitText(`${typeLabel} - ${itemCardText(selectedItem)}`, x + 128, y + 84, w - 144 - headerReserve, "800 12px Inter, sans-serif", "#6a4b35");
    drawRarityBadge(x + 128, y + 99, item.rarity, "small");
    if (isDrink(item) && item.pairTraits?.length) {
      drawTraitChips(item.pairTraits, x + 196, y + 99, w - 210 - headerReserve, { maxRows: 2, fontSize: 8, minWidth: 38, rowHeight: 16 });
    }

    const stat = itemPrimaryStat(selectedItem);
    const metricY = y + 154;
    drawInfoMetric("COST", { currency: entryCost(selectedItem) }, x + 20, metricY, 60);
    drawInfoMetric(stat.label, stat.value, x + 90, metricY, 76);
    drawInfoMetric("TYPE", typeLabel === "Drink" ? "Drink" : "Top", x + 176, metricY, 66);
    drawInfoMetric("SHOP", selectedItem.shopWeight || 1, x + 252, metricY, 58);

    drawInfoDivider(x + 20, y + 209, w - 40);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.fillText("Forms", x + 20, y + 234);
    for (let tier = 1; tier <= MAX_ITEM_TIER; tier += 1) {
      const formItem = makeItem(item.id, tier);
      const fx = x + 48 + (tier - 1) * 96;
      const rect = codexItemFormRect(tier - 1);
      const selected = tier === selectedTier;
      const hovered = state.pointer && pointInRect(state.pointer.x, state.pointer.y, rect);
      roundedRect(rect.x, rect.y, rect.w, rect.h, 8);
      ctx.fillStyle = selected ? "rgba(231, 255, 217, 0.86)" : hovered ? "rgba(255, 249, 214, 0.88)" : "rgba(255, 253, 232, 0.46)";
      ctx.fill();
      ctx.strokeStyle = selected ? "#4a9e68" : hovered ? "rgba(106, 75, 53, 0.32)" : "rgba(22, 57, 45, 0.11)";
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();
      ctx.lineWidth = 1;
      drawItemIcon(formItem, fx, y + 272, 22);
      drawUpgradeStars(tier, fx, y + 308, 9, "center");
      fitText(`Lv ${tier}`, fx - 30, y + 328, 60, "800 9px Inter, sans-serif", "#6a4b35");
    }

    drawInfoDivider(x + 20, y + 342, w - 40);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 13px Inter, sans-serif";
    if (isDrink(item)) {
      ctx.fillText("Stat effects by level", x + 20, y + 367);
      drawCodexLevelEffectRows(
        Array.from({ length: MAX_ITEM_TIER }, (_, index) => {
          const tier = index + 1;
          return {
            label: `Lv ${tier}`,
            text: drinkStatLevelEffectLine(makeItem(item.id, tier)),
          };
        }),
        x + 20,
        y + 382,
        w - 40,
        { rowHeight: 15, textFont: "800 8px Inter, sans-serif" }
      );
      drawInfoDivider(x + 20, y + 424, w - 40);
      ctx.fillStyle = "#16392d";
      ctx.font = "900 13px Inter, sans-serif";
      ctx.fillText("Pulse effect", x + 20, y + 445);
      drawTechnicalBulletLines(drinkSpecialUnlockLines(selectedItem), x + 20, y + 464, w - 40, 11, 6);
      return;
    }
    ctx.fillText("Effects by level", x + 20, y + 367);
    drawCodexLevelEffectRows(
      Array.from({ length: MAX_ITEM_TIER }, (_, index) => {
        const tier = index + 1;
        return {
          label: `Lv ${tier}`,
          text: itemCompactSpecLine(makeItem(item.id, tier)),
        };
      }),
      x + 20,
      y + 387,
      w - 40
    );

    const relatedY = y + 452;
    drawInfoDivider(x + 20, relatedY - 16, w - 40);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.fillText("Favorite for", x + 20, relatedY);
    ctx.fillStyle = "#6a4b35";
    ctx.font = "800 11px Inter, sans-serif";
    const fans = favoriteUsersForItem(item.id);
    fitText(fans.length ? fans.join(", ") : "No favorite animal yet.", x + 20, relatedY + 20, w - 40, "800 11px Inter, sans-serif", "#6a4b35");

  }

  function drawCodexDrinkParticlePreview(item, centerX, centerY, radius) {
    const image = getDrinkThrowableSprite(item?.id);
    roundedRect(centerX - radius, centerY - radius, radius * 2, radius * 2, 8);
    ctx.fillStyle = "rgba(255, 249, 214, 0.62)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (!image || !image.complete || image.naturalWidth <= 0) return;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.94;
    const size = radius * 1.48;
    ctx.drawImage(image, Math.round(centerX - size / 2), Math.round(centerY - size / 2), size, size);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drawTechnicalBulletLines(lines, x, y, maxWidth, lineHeight, maxRows) {
    ctx.fillStyle = "#6a4b35";
    ctx.font = "800 11px Inter, sans-serif";
    let rowCount = 0;
    let lineY = y;
    for (const line of lines) {
      if (rowCount >= maxRows) return;
      const wrapped = wrappedTextLines(`- ${line}`, maxWidth);
      const remaining = maxRows - rowCount;
      const visible = wrapped.slice(0, remaining);
      visible.forEach((text, index) => {
        const isLastClipped = index === visible.length - 1 && wrapped.length > visible.length;
        fitText(isLastClipped ? `${text}...` : text, x, lineY + index * lineHeight, maxWidth, ctx.font, ctx.fillStyle);
      });
      rowCount += visible.length;
      lineY += visible.length * lineHeight;
    }
  }

  function drawCodexLevelEffectRows(rows, x, y, maxWidth, options = {}) {
    const rowHeight = options.rowHeight || 17;
    const labelWidth = options.labelWidth || 34;
    const labelFont = options.labelFont || "900 8px Inter, sans-serif";
    const textFont = options.textFont || "800 10px Inter, sans-serif";
    rows.forEach((row, index) => {
      const rowY = y + index * rowHeight;
      roundedRect(x, rowY - 12, labelWidth, 15, 4);
      ctx.fillStyle = "rgba(255, 249, 214, 0.82)";
      ctx.fill();
      ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#16392d";
      ctx.font = labelFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(row.label, x + labelWidth / 2, rowY - 4);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      fitText(row.text, x + labelWidth + 8, rowY, maxWidth - labelWidth - 8, textFont, "#6a4b35");
    });
  }

  function drawFoodAnimal(unit, x, y, r, facingRight = false) {
    const breath = idleBreathForUnit(unit);
    const drawY = y + breath.bob;
    const runtimeSprite = getRuntimeSprite(unit);
    if (runtimeSprite && runtimeSprite.complete && runtimeSprite.naturalWidth > 0) {
      drawRuntimeFoodAnimal(runtimeSprite, x, drawY, r, facingRight, breath);
      drawUnitToppings(unit, x, drawY, r, facingRight);
      return;
    }

    const sprite = getPixelSprite(unit);
    const stickerMask = getTintedPixelSprite(unit, "#fff9df", "sticker");
    const size = Math.round(r * 2.65);
    const left = Math.round(x - size / 2);
    const top = Math.round(drawY - size / 2);
    const outline = Math.max(2, Math.round(size * 0.085));

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for (const offset of [
      [-outline, 0],
      [outline, 0],
      [0, -outline],
      [0, outline],
      [-outline, -outline],
      [outline, -outline],
      [-outline, outline],
      [outline, outline],
    ]) {
      drawImageFacing(stickerMask, left + offset[0], top + offset[1], size, size, facingRight, breath.scaleX, breath.scaleY, 1);
    }
    drawImageFacing(sprite, left, top, size, size, facingRight, breath.scaleX, breath.scaleY, 1);
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
    drawUnitToppings(unit, x, drawY, r, facingRight);
  }

  function drawUnitToppings(unit, x, y, r, facingRight = false) {
    if (!unit?.item) return;
    const offsetX = r * (facingRight ? -0.08 : 0.08);
    const offsetY = -r * 0.82;
    drawItemIcon(unit.item, x + offsetX, y + offsetY, r * 0.9);
  }

  function drawItemIcon(item, x, y, r, options = {}) {
    const image = getItemSprite(item);
    const size = Math.round(r * 2.4);
    ctx.save();
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      if (options.centerOpaque) {
        const metrics = itemSpriteMetrics(image);
        const offsetX = ((metrics.x + metrics.w / 2) / Math.max(1, image.naturalWidth) - 0.5) * size;
        const anchorY = Math.max(0, Math.min(1, options.opaqueAnchorY ?? 0.5));
        const offsetY = ((metrics.y + metrics.h * anchorY) / Math.max(1, image.naturalHeight) - 0.5) * size;
        ctx.drawImage(image, x - size / 2 - offsetX, y - size / 2 - offsetY, size, size);
      } else {
        ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
      }
      ctx.imageSmoothingEnabled = true;
    } else if (isDrink(item)) {
      drawFallbackDrink(item, x, y, r);
    } else {
      drawFallbackEgg(x, y, r);
    }
    ctx.restore();
  }

  function drawFallbackEgg(x, y, r) {
    ctx.fillStyle = "#fff9df";
    ctx.strokeStyle = "#b97822";
    ctx.lineWidth = Math.max(2, Math.round(r * 0.12));
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.0, r * 0.72, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f7c63d";
    ctx.beginPath();
    ctx.arc(x + r * 0.08, y - r * 0.02, r * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFallbackDrink(item, x, y, r) {
    ctx.fillStyle = item?.color || "#b83b78";
    ctx.strokeStyle = "#fff9df";
    ctx.lineWidth = Math.max(2, Math.round(r * 0.12));
    roundedRect(x - r * 0.52, y - r * 0.72, r * 1.04, r * 1.36, Math.max(4, r * 0.18));
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    roundedRect(x - r * 0.34, y - r * 0.5, r * 0.24, r * 0.88, Math.max(2, r * 0.09));
    ctx.fill();
    ctx.strokeStyle = item?.accent || "#e8b765";
    ctx.lineWidth = Math.max(2, Math.round(r * 0.1));
    ctx.beginPath();
    ctx.moveTo(x + r * 0.08, y - r * 0.72);
    ctx.lineTo(x + r * 0.34, y - r * 1.04);
    ctx.stroke();
  }

  function idleBreathForUnit(unit) {
    const seed = unitBreathSeed(unit);
    const phaseOffset = seededUnitFloat(seed, 1) * Math.PI * 2;
    const periodJitter = (seededUnitFloat(seed, 2) * 2 - 1) * IDLE_BREATH.periodVariance;
    const amplitude = 1 + (seededUnitFloat(seed, 3) * 2 - 1) * IDLE_BREATH.amplitudeVariance;
    const period = Math.max(1.8, IDLE_BREATH.period + periodJitter);
    const phase = state.idleTime * ((Math.PI * 2) / period) + phaseOffset;
    const wave = smoothBreathWave(phase);
    return {
      scaleX: 1 - wave * IDLE_BREATH.scaleX * amplitude,
      scaleY: 1 + wave * IDLE_BREATH.scaleY * amplitude,
      bob: -wave * IDLE_BREATH.bob * amplitude,
    };
  }

  function unitBreathSeed(unit) {
    const identity = typeof unit?.uid === "number" ? unit.uid : `${unit?.typeId || unit?.id || "food"}:${unit?.tier || 1}`;
    return hashString(`${identity}:${unit?.typeId || unit?.id || "food"}:${unit?.tier || 1}:idle-breath`);
  }

  function seededUnitFloat(seed, salt) {
    return hashString(`${seed}:${salt}`) / 0xffffffff;
  }

  function smoothBreathWave(phase) {
    const cycle = (phase / (Math.PI * 2)) % 1;
    const wrapped = cycle < 0 ? cycle + 1 : cycle;
    const eased = 0.5 - 0.5 * Math.cos(wrapped * Math.PI * 2);
    return eased * 2 - 1;
  }

  function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    return hash;
  }

  function drawImageFacing(image, x, y, w, h, facingRight, scaleX = 1, scaleY = 1, anchorY = 0.5) {
    if (!facingRight && scaleX === 1 && scaleY === 1) {
      ctx.drawImage(image, x, y, w, h);
      return;
    }
    ctx.save();
    ctx.translate(x + w / 2, y + h * anchorY);
    ctx.scale(facingRight ? -scaleX : scaleX, scaleY);
    ctx.drawImage(image, -w / 2, -h * anchorY, w, h);
    ctx.restore();
  }

  function getRuntimeSprite(unit) {
    const typeId = unit.typeId || unit.id;
    const tier = Math.max(1, unit.tier || 1);
    const src = RUNTIME_SPRITES[typeId]?.[tier];
    if (!src) return null;
    if (runtimeSpriteCache.has(src)) return runtimeSpriteCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.src = src;
    runtimeSpriteCache.set(src, image);
    return image;
  }

  function getDefeatStillSprite(unit) {
    const typeId = unit?.typeId || unit?.id;
    const src = DEFEAT_STILL_SPRITES[typeId];
    if (!src) return null;
    if (runtimeSpriteCache.has(src)) return runtimeSpriteCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.src = src;
    runtimeSpriteCache.set(src, image);
    return image;
  }

  function getItemSprite(item) {
    const src = ITEM_TIER_SPRITES[item?.id]?.[itemTier(item?.tier)] || ITEM_SPRITES[item?.id];
    if (!src) return null;
    if (itemSpriteCache.has(src)) return itemSpriteCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.src = src;
    itemSpriteCache.set(src, image);
    return image;
  }

  function getAttackParticleSprite(typeId) {
    const src = ATTACK_PARTICLE_SPRITES[typeId];
    if (!src) return null;
    if (attackParticleSpriteCache.has(src)) return attackParticleSpriteCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.src = src;
    attackParticleSpriteCache.set(src, image);
    return image;
  }

  function getDrinkThrowableSprite(drinkId) {
    const src = DRINK_THROWABLE_SPRITES[drinkId];
    if (!src) return null;
    if (drinkThrowableSpriteCache.has(src)) return drinkThrowableSpriteCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.src = src;
    drinkThrowableSpriteCache.set(src, image);
    return image;
  }

  function preloadAttackParticleSprites() {
    ATTACK_PARTICLE_TYPES.forEach((typeId) => getAttackParticleSprite(typeId));
  }

  function preloadDrinkThrowableSprites() {
    DRINK_THROWABLE_TYPES.forEach((drinkId) => getDrinkThrowableSprite(drinkId));
  }

  function preloadDefeatStillSprites() {
    Object.keys(DEFEAT_STILL_SPRITES).forEach((typeId) => getDefeatStillSprite({ typeId }));
  }

  function getStatusEffectSprite(effectId) {
    const src = STATUS_EFFECT_SPRITES[effectId];
    if (!src) return null;
    if (statusEffectSpriteCache.has(src)) return statusEffectSpriteCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.src = src;
    statusEffectSpriteCache.set(src, image);
    return image;
  }

  function getUiSprite(src) {
    if (!src) return null;
    if (uiSpriteCache.has(src)) return uiSpriteCache.get(src);
    const image = new Image();
    image.onload = draw;
    image.src = src;
    uiSpriteCache.set(src, image);
    return image;
  }

  function drawUiAtlasIcon(iconId, x, y, size = 18, options = {}) {
    const cell = UI_ICON_ATLAS[iconId];
    const image = getUiSprite(UI_ICON_ATLAS_SRC);
    if (options.tooltip) {
      registerTooltip(x - size / 2, y - size / 2, size, size, options.tooltip);
    }
    if (cell && image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        image,
        cell[0] * UI_ICON_ATLAS_CELL,
        cell[1] * UI_ICON_ATLAS_CELL,
        UI_ICON_ATLAS_CELL,
        UI_ICON_ATLAS_CELL,
        Math.round(x - size / 2),
        Math.round(y - size / 2),
        size,
        size
      );
      ctx.restore();
      return true;
    }
    drawFallbackUiIcon(iconId, x, y, size);
    return false;
  }

  function drawFallbackUiIcon(iconId, x, y, size) {
    const traitId = iconId?.startsWith("trait_") ? iconId.slice(6) : null;
    const color = traitId ? traitInfo(traitId).color : "#f0c64a";
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(22, 57, 45, 0.42)";
    ctx.lineWidth = Math.max(1, Math.round(size / 12));
    ctx.beginPath();
    ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function registerTooltip(x, y, w, h, tooltip) {
    if (!tooltip || !tooltip.title) return;
    state.tooltipTargets.push({ x, y, w, h, title: tooltip.title, body: tooltip.body || "" });
  }

  function currentTooltip() {
    const p = state.pointer;
    if (!p || state.drag) return null;
    for (let i = state.tooltipTargets.length - 1; i >= 0; i -= 1) {
      const target = state.tooltipTargets[i];
      if (pointInRect(p.x, p.y, target)) return target;
    }
    return null;
  }

  function drawTooltip() {
    const tip = currentTooltip();
    if (!tip) return;
    const pad = 9;
    const maxW = 230;
    ctx.save();
    ctx.font = "900 11px Inter, sans-serif";
    const titleW = Math.min(maxW - pad * 2, ctx.measureText(tip.title).width);
    ctx.font = "700 10px Inter, sans-serif";
    const bodyW = tip.body ? Math.min(maxW - pad * 2, ctx.measureText(tip.body).width) : 0;
    const w = Math.max(86, Math.min(maxW, Math.ceil(Math.max(titleW, bodyW) + pad * 2)));
    const h = tip.body ? 48 : 30;
    let x = Math.round((state.pointer?.x || 0) + 14);
    let y = Math.round((state.pointer?.y || 0) + 16);
    if (x + w > W - 8) x = Math.round((state.pointer?.x || 0) - w - 14);
    if (y + h > H - 8) y = Math.round((state.pointer?.y || 0) - h - 12);
    x = clamp(x, 8, W - w - 8);
    y = clamp(y, 8, H - h - 8);
    ctx.shadowColor = "rgba(22, 57, 45, 0.24)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;
    roundedRect(x, y, w, h, 7);
    ctx.fillStyle = "rgba(255, 253, 232, 0.96)";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(22, 57, 45, 0.2)";
    ctx.stroke();
    ctx.fillStyle = "#16392d";
    ctx.font = "900 11px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    fitText(tip.title, x + pad, y + 17, w - pad * 2, "900 11px Inter, sans-serif", "#16392d");
    if (tip.body) fitText(tip.body, x + pad, y + 34, w - pad * 2, "700 10px Inter, sans-serif", "#6a4b35");
    ctx.restore();
  }

  function drawRuntimeFoodAnimal(image, x, y, r, facingRight = false, breath = { scaleX: 1, scaleY: 1 }) {
    const metrics = runtimeSpriteMetrics(image);
    const targetMax = r * 2.9;
    const scale = targetMax / Math.max(metrics.w, metrics.h);
    const drawW = metrics.w * scale;
    const drawH = metrics.h * scale;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(facingRight ? -breath.scaleX : breath.scaleX, breath.scaleY);
    ctx.drawImage(
      image,
      metrics.x,
      metrics.y,
      metrics.w,
      metrics.h,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    );
    ctx.imageSmoothingEnabled = true;
    ctx.restore();
  }

  function runtimeSpriteMetrics(image) {
    const cacheKey = image.currentSrc || image.src || image;
    if (runtimeSpriteMetricsCache.has(cacheKey)) return runtimeSpriteMetricsCache.get(cacheKey);
    const fallback = {
      x: 0,
      y: 0,
      w: Math.max(1, image.naturalWidth || image.width || 1),
      h: Math.max(1, image.naturalHeight || image.height || 1),
    };
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) return fallback;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const px = canvas.getContext("2d", { willReadFrequently: true });
      px.drawImage(image, 0, 0);
      const { data, width, height } = px.getImageData(0, 0, canvas.width, canvas.height);
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;
      for (let yy = 0; yy < height; yy += 1) {
        for (let xx = 0; xx < width; xx += 1) {
          if (data[(yy * width + xx) * 4 + 3] <= 8) continue;
          if (xx < minX) minX = xx;
          if (yy < minY) minY = yy;
          if (xx > maxX) maxX = xx;
          if (yy > maxY) maxY = yy;
        }
      }
      if (maxX < minX || maxY < minY) {
        runtimeSpriteMetricsCache.set(cacheKey, fallback);
        return fallback;
      }
      const pad = 2;
      const metrics = {
        x: Math.max(0, minX - pad),
        y: Math.max(0, minY - pad),
        w: Math.min(width, maxX + pad + 1) - Math.max(0, minX - pad),
        h: Math.min(height, maxY + pad + 1) - Math.max(0, minY - pad),
      };
      runtimeSpriteMetricsCache.set(cacheKey, metrics);
      return metrics;
    } catch (error) {
      runtimeSpriteMetricsCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  function itemSpriteMetrics(image) {
    const cacheKey = image.currentSrc || image.src || image;
    if (itemSpriteMetricsCache.has(cacheKey)) return itemSpriteMetricsCache.get(cacheKey);
    const metrics = alphaSpriteMetrics(image, itemSpriteMetricsCache);
    return metrics;
  }

  function alphaSpriteMetrics(image, cache) {
    const cacheKey = image.currentSrc || image.src || image;
    const fallback = {
      x: 0,
      y: 0,
      w: Math.max(1, image.naturalWidth || image.width || 1),
      h: Math.max(1, image.naturalHeight || image.height || 1),
    };
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) return fallback;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const px = canvas.getContext("2d", { willReadFrequently: true });
      px.drawImage(image, 0, 0);
      const { data, width, height } = px.getImageData(0, 0, canvas.width, canvas.height);
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;
      for (let yy = 0; yy < height; yy += 1) {
        for (let xx = 0; xx < width; xx += 1) {
          if (data[(yy * width + xx) * 4 + 3] <= 8) continue;
          if (xx < minX) minX = xx;
          if (yy < minY) minY = yy;
          if (xx > maxX) maxX = xx;
          if (yy > maxY) maxY = yy;
        }
      }
      if (maxX < minX || maxY < minY) {
        cache.set(cacheKey, fallback);
        return fallback;
      }
      const pad = 2;
      const metrics = {
        x: Math.max(0, minX - pad),
        y: Math.max(0, minY - pad),
        w: Math.min(width, maxX + pad + 1) - Math.max(0, minX - pad),
        h: Math.min(height, maxY + pad + 1) - Math.max(0, minY - pad),
      };
      cache.set(cacheKey, metrics);
      return metrics;
    } catch (error) {
      cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  function getPixelSprite(unit) {
    const typeId = unit.typeId || unit.id;
    const key = `${typeId}:${unit.tier}`;
    if (pixelSpriteCache.has(key)) return pixelSpriteCache.get(key);
    const sprite = document.createElement("canvas");
    sprite.width = 48;
    sprite.height = 48;
    const px = sprite.getContext("2d");
    px.imageSmoothingEnabled = false;

    drawPixelFoodAnimal(px, unit);
    pixelSpriteCache.set(key, sprite);
    return sprite;
  }

  function getTintedPixelSprite(unit, color, label) {
    const typeId = unit.typeId || unit.id;
    const key = `${typeId}:${unit.tier}:${label}`;
    if (tintedSpriteCache.has(key)) return tintedSpriteCache.get(key);
    const sprite = getPixelSprite(unit);
    const mask = document.createElement("canvas");
    mask.width = sprite.width;
    mask.height = sprite.height;
    const mx = mask.getContext("2d");
    mx.imageSmoothingEnabled = false;
    mx.drawImage(sprite, 0, 0);
    mx.globalCompositeOperation = "source-in";
    mx.fillStyle = color;
    mx.fillRect(0, 0, mask.width, mask.height);
    tintedSpriteCache.set(key, mask);
    return mask;
  }

  function drawPixelFoodAnimal(px, unit) {
    const typeId = unit.typeId || unit.id;
    const dark = "#16392d";
    const shade = "#6a4b35";
    const hi = "#fff4b8";
    const base = unit.color;
    const accent = unit.accent;
    const p = (x, y, w, h, color) => {
      px.fillStyle = color;
      px.fillRect(x, y, w, h);
    };

    if (typeId === "toast_tortoise") {
      pixelOval(p, 9, 9, 31, 29, dark);
      pixelOval(p, 11, 11, 27, 25, "#d99043");
      pixelOval(p, 15, 15, 19, 17, "#f7d39b");
      p(13, 29, 22, 5, "#85512e");
      p(18, 21, 4, 4, dark);
      p(28, 21, 4, 4, dark);
      p(20, 28, 11, 3, dark);
      p(15, 15, 4, 3, hi);
    } else if (typeId === "sushi_seal") {
      pixelOval(p, 8, 11, 32, 25, dark);
      pixelOval(p, 10, 13, 28, 21, "#f2f5ef");
      p(22, 8, 7, 31, dark);
      p(11, 20, 27, 6, "#e45a6d");
      p(18, 19, 4, 4, dark);
      p(30, 19, 4, 4, dark);
      p(23, 28, 8, 3, dark);
      p(13, 15, 9, 3, "#ffffff");
    } else if (typeId === "taco_tiger") {
      pixelOval(p, 7, 12, 34, 24, dark);
      pixelOval(p, 9, 14, 30, 20, "#f1c84b");
      p(11, 17, 26, 9, "#d9573c");
      p(14, 16, 20, 4, "#5a8d47");
      p(14, 24, 5, 8, dark);
      p(29, 24, 5, 8, dark);
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(13, 14, 7, 3, hi);
    } else if (typeId === "berry_bat") {
      p(4, 14, 12, 8, dark);
      p(32, 14, 12, 8, dark);
      p(6, 16, 10, 10, "#7542a8");
      p(32, 16, 10, 10, "#7542a8");
      pixelOval(p, 14, 10, 20, 25, dark);
      pixelOval(p, 16, 12, 16, 21, "#7542a8");
      p(17, 13, 5, 5, "#dd5ea8");
      p(26, 13, 5, 5, "#dd5ea8");
      p(19, 22, 3, 3, dark);
      p(28, 22, 3, 3, dark);
      p(21, 28, 8, 3, dark);
    } else if (typeId === "pancake_penguin") {
      pixelOval(p, 10, 12, 28, 25, dark);
      pixelOval(p, 12, 14, 24, 21, "#f1f5ec");
      p(9, 22, 30, 6, "#e8b765");
      p(11, 16, 26, 5, "#f3cf8c");
      p(13, 11, 22, 5, "#e8b765");
      p(20, 9, 8, 4, "#f5d45b");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
      p(34, 25, 5, 5, "#b36a2e");
    } else if (typeId === "pretzel_python") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#c47a35");
      pixelOval(p, 14, 18, 8, 10, "#f0d56b");
      pixelOval(p, 27, 18, 8, 10, "#f0d56b");
      p(20, 20, 9, 6, "#c47a35");
      p(33, 11, 8, 8, "#c47a35");
      p(36, 13, 3, 3, dark);
      p(30, 8, 6, 3, "#f0d56b");
      p(18, 31, 14, 3, "#6a3c24");
      p(12, 15, 3, 3, hi);
    } else if (typeId === "curry_crab") {
      pixelOval(p, 10, 13, 28, 23, dark);
      pixelOval(p, 12, 15, 24, 19, "#d9852f");
      p(5, 19, 9, 6, dark);
      p(34, 19, 9, 6, dark);
      p(3, 18, 9, 5, "#8d3d27");
      p(36, 18, 9, 5, "#8d3d27");
      p(14, 12, 6, 5, "#f0c64a");
      p(28, 12, 6, 5, "#f0c64a");
      p(18, 22, 4, 4, dark);
      p(28, 22, 4, 4, dark);
      p(21, 29, 9, 3, dark);
      p(16, 15, 16, 3, "#f5d45b");
    } else if (typeId === "popcorn_porcupine") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#f4d35e");
      p(11, 10, 5, 8, "#fff4c2");
      p(17, 8, 5, 10, "#fff4c2");
      p(24, 8, 5, 10, "#fff4c2");
      p(31, 10, 5, 8, "#fff4c2");
      p(12, 17, 24, 5, "#ffd96b");
      p(36, 20, 7, 5, "#9c6a2f");
      p(18, 22, 4, 4, dark);
      p(29, 22, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(13, 27, 4, 4, "#fff4c2");
      p(32, 27, 4, 4, "#fff4c2");
    } else if (typeId === "yogurt_yeti") {
      pixelOval(p, 8, 12, 32, 25, dark);
      pixelOval(p, 10, 14, 28, 21, "#f4f6ff");
      p(12, 17, 24, 5, "#d6ecff");
      p(10, 11, 8, 7, dark);
      p(30, 11, 8, 7, dark);
      p(12, 12, 6, 5, "#f4f6ff");
      p(30, 12, 6, 5, "#f4f6ff");
      p(16, 22, 4, 4, dark);
      p(29, 22, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(34, 24, 6, 6, "#6aa5d8");
      p(12, 27, 5, 5, "#f8bdd8");
    } else if (typeId === "pepper_prawn") {
      pixelOval(p, 8, 13, 32, 22, dark);
      pixelOval(p, 10, 15, 28, 18, "#f26a35");
      p(33, 12, 9, 7, "#5aa6d6");
      p(37, 15, 6, 4, "#f26a35");
      p(7, 18, 6, 5, "#5aa6d6");
      p(12, 13, 8, 4, "#f4d35e");
      p(20, 21, 4, 4, dark);
      p(30, 20, 4, 4, dark);
      p(22, 29, 8, 3, dark);
      p(13, 26, 5, 4, "#e24822");
    } else if (typeId === "hot_chip_hamster") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#e55a2a");
      p(12, 15, 24, 5, "#f4d35e");
      p(14, 23, 21, 4, "#8d3d27");
      p(9, 10, 8, 8, dark);
      p(31, 10, 8, 8, dark);
      p(11, 11, 6, 6, "#f4d35e");
      p(31, 11, 6, 6, "#f4d35e");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(35, 24, 7, 5, "#f7c94f");
    } else if (typeId === "bagel_beaver") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#c98a3a");
      pixelOval(p, 16, 16, 17, 12, "#f0d56b");
      pixelOval(p, 21, 19, 7, 6, "#6a4b35");
      p(9, 21, 7, 8, "#8b5d35");
      p(34, 21, 7, 8, "#8b5d35");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 30, 9, 3, dark);
      p(15, 13, 4, 2, hi);
    } else if (typeId === "bao_bun_badger") {
      pixelOval(p, 7, 12, 34, 25, dark);
      pixelOval(p, 9, 14, 30, 21, "#f0d8b4");
      p(12, 16, 24, 5, "#fff0cf");
      p(13, 25, 23, 5, "#c05a39");
      p(10, 12, 8, 9, "#6b4b35");
      p(31, 12, 8, 9, "#6b4b35");
      p(16, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(36, 22, 7, 6, "#e0a44a");
    } else if (typeId === "donut_dodo") {
      pixelOval(p, 9, 12, 30, 25, dark);
      pixelOval(p, 11, 14, 26, 21, "#e7a85c");
      pixelOval(p, 17, 18, 14, 10, "#f6d0a6");
      pixelOval(p, 20, 20, 8, 6, "#7b4a33");
      p(14, 13, 23, 5, "#d9548f");
      p(13, 29, 20, 4, "#c47a35");
      p(17, 22, 4, 4, dark);
      p(30, 22, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(35, 20, 6, 5, "#f0c64a");
    } else if (typeId === "kimchi_chameleon") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#e65036");
      p(11, 16, 25, 5, "#f0773e");
      p(31, 12, 10, 8, "#6a9d38");
      p(38, 14, 5, 4, "#e65036");
      p(14, 11, 8, 4, "#6a9d38");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(21, 29, 10, 3, dark);
      p(12, 25, 5, 3, "#f8d95a");
    } else if (typeId === "waffle_walrus") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#d8a64a");
      p(12, 17, 24, 3, "#9b6a2d");
      p(12, 23, 24, 3, "#9b6a2d");
      p(16, 15, 3, 20, "#9b6a2d");
      p(27, 15, 3, 20, "#9b6a2d");
      p(12, 28, 24, 5, "#6c8fbd");
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(14, 32, 5, 6, "#fff4b8");
      p(31, 32, 5, 6, "#fff4b8");
    } else if (typeId === "dumpling_armadillo") {
      pixelOval(p, 8, 12, 32, 25, dark);
      pixelOval(p, 10, 14, 28, 21, "#f0dcb8");
      p(12, 18, 24, 4, "#d6b58c");
      p(12, 24, 24, 4, "#d6b58c");
      p(14, 13, 19, 4, "#fff4d8");
      p(13, 28, 23, 5, "#8b6f50");
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(34, 17, 6, 8, "#8b6f50");
    } else if (typeId === "lemon_meringue_lynx") {
      pixelOval(p, 9, 12, 30, 24, dark);
      pixelOval(p, 11, 14, 26, 20, "#f2dc5d");
      p(13, 10, 7, 8, dark);
      p(29, 10, 7, 8, dark);
      p(15, 11, 5, 6, "#f2dc5d");
      p(29, 11, 5, 6, "#f2dc5d");
      p(13, 14, 24, 5, "#ffffff");
      p(17, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
      p(35, 24, 5, 5, "#ffffff");
    } else if (typeId === "shakshuka_shark") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#e24822");
      p(13, 18, 25, 5, "#f4d35e");
      p(34, 12, 8, 7, "#e24822");
      p(38, 14, 6, 4, "#f4d35e");
      p(12, 11, 9, 5, "#fff4b8");
      p(18, 22, 4, 4, dark);
      p(30, 22, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(8, 25, 6, 5, "#8d3d27");
    } else if (typeId === "saltwater_taffy_otter") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#f2a7c7");
      p(12, 17, 25, 4, "#ffffff");
      p(13, 25, 24, 4, "#5aa6d6");
      p(34, 14, 8, 8, "#5aa6d6");
      p(7, 24, 8, 6, "#f7d2df");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 29, 10, 3, dark);
      p(35, 24, 6, 6, "#ffffff");
    } else if (typeId === "croissant_kraken") {
      pixelOval(p, 8, 12, 32, 23, dark);
      pixelOval(p, 10, 14, 28, 19, "#d69a3e");
      p(12, 15, 24, 5, "#f0c56b");
      p(7, 27, 8, 5, "#6b4aa8");
      p(17, 29, 7, 5, "#6b4aa8");
      p(29, 29, 7, 5, "#6b4aa8");
      p(37, 25, 6, 5, "#6b4aa8");
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 28, 9, 3, dark);
    } else if (typeId === "fortune_cookie_fox") {
      pixelOval(p, 9, 12, 30, 23, dark);
      pixelOval(p, 11, 14, 26, 19, "#e4b65f");
      p(12, 9, 8, 8, dark);
      p(29, 9, 8, 8, dark);
      p(14, 10, 6, 6, "#e4b65f");
      p(30, 10, 6, 6, "#e4b65f");
      p(34, 20, 9, 7, "#d24d53");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
      p(20, 15, 11, 3, "#fff4b8");
    } else if (typeId === "mochi_mammoth") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#f2d6df");
      p(11, 18, 27, 5, "#fff4f5");
      p(33, 18, 9, 8, "#f2d6df");
      p(36, 22, 5, 9, "#8b6fb0");
      p(15, 27, 5, 8, dark);
      p(30, 27, 5, 8, dark);
      p(18, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(23, 29, 8, 3, dark);
    } else if (typeId === "gingerbread_golem") {
      pixelOval(p, 8, 11, 32, 26, dark);
      pixelOval(p, 10, 13, 28, 22, "#b66b34");
      p(13, 15, 22, 4, "#f5f0df");
      p(13, 29, 22, 4, "#f5f0df");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 28, 8, 3, dark);
      p(6, 24, 7, 6, "#d24d53");
      p(36, 24, 7, 6, "#6ba044");
    } else if (typeId === "boba_basilisk") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#c99bd8");
      p(31, 11, 10, 8, "#3d263d");
      p(36, 13, 5, 4, "#c99bd8");
      p(13, 27, 25, 5, "#3d263d");
      p(14, 13, 5, 5, "#f4e7ff");
      p(23, 12, 5, 5, "#f4e7ff");
      p(18, 21, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(22, 29, 9, 3, dark);
    } else if (typeId === "iceberg_oyster") {
      pixelOval(p, 8, 12, 32, 25, dark);
      pixelOval(p, 10, 14, 28, 21, "#d8f2ff");
      p(12, 18, 24, 5, "#7ec7e8");
      p(15, 12, 18, 5, "#ffffff");
      p(20, 19, 9, 8, "#f4e7ff");
      p(22, 21, 5, 4, "#4d9d95");
      p(17, 24, 4, 4, dark);
      p(30, 24, 4, 4, dark);
      p(21, 31, 10, 3, dark);
      p(34, 16, 6, 7, "#4d9d95");
    } else if (typeId === "churro_cheetah") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#c98335");
      p(12, 16, 24, 4, "#f0c56b");
      p(14, 22, 22, 3, "#8d3d27");
      p(33, 12, 9, 7, "#e24822");
      p(38, 14, 5, 4, "#f4d35e");
      p(16, 21, 4, 4, dark);
      p(28, 21, 4, 4, dark);
      p(20, 29, 10, 3, dark);
      p(11, 27, 5, 4, "#f4d35e");
    } else if (typeId === "granola_goat") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#d6a04c");
      p(12, 17, 24, 5, "#f0d56b");
      p(10, 10, 8, 8, dark);
      p(30, 10, 8, 8, dark);
      p(12, 11, 6, 6, "#d6a04c");
      p(30, 11, 6, 6, "#d6a04c");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(13, 25, 5, 5, "#7aa530");
      p(34, 25, 5, 5, "#7d3aa0");
    } else if (typeId === "breakfast_burrito_boar") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#d99736");
      p(12, 16, 25, 5, "#f5d45b");
      p(13, 22, 24, 5, "#55a375");
      p(35, 17, 7, 7, "#8d3d27");
      p(6, 25, 7, 5, "#8d3d27");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 10, 3, dark);
      p(12, 28, 5, 5, "#e24822");
    } else if (typeId === "caesar_salamander") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#78b84d");
      p(12, 16, 24, 5, "#a7d66d");
      p(13, 25, 23, 4, "#f0dcb8");
      p(34, 18, 8, 7, "#78b84d");
      p(7, 25, 8, 5, "#3f8f5a");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(13, 13, 5, 3, hi);
    } else if (typeId === "cucumber_cobra") {
      pixelOval(p, 6, 14, 36, 22, dark);
      pixelOval(p, 8, 16, 32, 18, "#86c95b");
      p(12, 17, 24, 4, "#b7e07d");
      p(33, 10, 9, 9, dark);
      p(35, 11, 7, 7, "#86c95b");
      p(38, 13, 5, 4, "#d8f2a2");
      p(15, 27, 18, 4, "#3f8f5a");
      p(18, 22, 4, 4, dark);
      p(30, 21, 4, 4, dark);
      p(11, 14, 6, 3, hi);
    } else if (typeId === "avocado_axolotl") {
      pixelOval(p, 8, 11, 32, 26, dark);
      pixelOval(p, 10, 13, 28, 22, "#8dbb4d");
      pixelOval(p, 16, 17, 16, 13, "#d8e998");
      pixelOval(p, 21, 20, 7, 7, "#6f4b2f");
      p(6, 17, 8, 5, "#d8f2a2");
      p(35, 17, 8, 5, "#d8f2a2");
      p(6, 25, 8, 5, "#d8f2a2");
      p(35, 25, 8, 5, "#d8f2a2");
      p(18, 22, 4, 4, dark);
      p(30, 22, 4, 4, dark);
      p(21, 31, 9, 3, dark);
    } else if (typeId === "herb_hare") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#6fad4e");
      p(12, 4, 6, 16, dark);
      p(30, 4, 6, 16, dark);
      p(13, 5, 4, 14, "#8fcf5d");
      p(31, 5, 4, 14, "#8fcf5d");
      p(13, 22, 23, 4, "#d9b56f");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(34, 25, 6, 5, "#d8f2a2");
    } else if (typeId === "caprese_capybara") {
      pixelOval(p, 7, 13, 34, 24, dark);
      pixelOval(p, 9, 15, 30, 20, "#f2f1dc");
      p(12, 16, 25, 5, "#d84a3a");
      p(13, 24, 24, 4, "#6fae48");
      p(8, 10, 9, 8, dark);
      p(31, 10, 9, 8, dark);
      p(10, 11, 7, 6, "#f2f1dc");
      p(31, 11, 7, 6, "#f2f1dc");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 10, 3, dark);
    } else if (typeId === "vinaigrette_viper") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#d7bd45");
      p(12, 16, 25, 4, "#f0d56b");
      p(12, 25, 24, 4, "#6fae48");
      p(33, 11, 10, 8, "#6fae48");
      p(38, 13, 5, 4, "#d7bd45");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(12, 27, 5, 4, "#e24822");
    } else if (typeId === "kelp_koala") {
      pixelOval(p, 8, 12, 32, 24, dark);
      pixelOval(p, 10, 14, 28, 20, "#4fae78");
      p(8, 9, 9, 9, dark);
      p(31, 9, 9, 9, dark);
      p(10, 10, 7, 7, "#6ecf98");
      p(31, 10, 7, 7, "#6ecf98");
      p(13, 24, 24, 5, "#2f7f83");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(34, 18, 7, 7, "#67bfb5");
    } else if (typeId === "melon_mint_mantis") {
      pixelOval(p, 8, 13, 32, 23, dark);
      pixelOval(p, 10, 15, 28, 19, "#9fda6e");
      p(13, 17, 22, 4, "#d8f2a2");
      p(7, 12, 10, 5, "#55b89b");
      p(32, 12, 10, 5, "#55b89b");
      p(6, 28, 12, 4, "#55b89b");
      p(31, 28, 12, 4, "#55b89b");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(35, 20, 5, 6, "#f1cf75");
    } else if (typeId === "coconut_shrimp_sheep") {
      pixelOval(p, 7, 12, 34, 25, dark);
      pixelOval(p, 9, 14, 30, 21, "#f1d8aa");
      p(11, 16, 26, 5, "#fff4d8");
      p(33, 16, 9, 8, "#df8f57");
      p(37, 18, 5, 4, "#f1d8aa");
      p(9, 10, 8, 8, dark);
      p(30, 10, 8, 8, dark);
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(22, 30, 8, 3, dark);
      p(13, 27, 5, 4, "#df8f57");
    } else if (typeId === "crab_cake_caterpillar") {
      pixelOval(p, 6, 14, 36, 22, dark);
      pixelOval(p, 8, 16, 32, 18, "#d99a4f");
      p(11, 17, 26, 5, "#f0c56b");
      p(13, 25, 23, 4, "#5ea3b5");
      p(7, 24, 7, 6, "#c45f3a");
      p(36, 24, 7, 6, "#c45f3a");
      p(16, 21, 4, 4, dark);
      p(28, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(34, 15, 5, 4, "#fff4d8");
    } else if (typeId === "pico_de_gallo_gecko") {
      pixelOval(p, 7, 13, 34, 23, dark);
      pixelOval(p, 9, 15, 30, 19, "#d84a3a");
      p(12, 17, 24, 4, "#f26a35");
      p(12, 25, 24, 5, "#65ad52");
      p(33, 12, 10, 8, "#65ad52");
      p(38, 14, 5, 4, "#d84a3a");
      p(17, 21, 4, 4, dark);
      p(29, 21, 4, 4, dark);
      p(21, 30, 9, 3, dark);
      p(13, 26, 5, 4, "#fff4d8");
    } else {
      pixelOval(p, 8, 12, 32, 23, dark);
      pixelOval(p, 10, 14, 28, 19, "#ead77b");
      p(12, 21, 24, 5, "#55a375");
      p(16, 18, 17, 3, "#f7e8ae");
      p(18, 20, 4, 4, dark);
      p(30, 20, 4, 4, dark);
      p(21, 29, 9, 3, dark);
      p(13, 15, 7, 3, hi);
    }

    drawEvolutionDetails(p, typeId, unit.tier, dark, hi);
    if (unit.tier >= 2) {
      p(35, 7, 4, 4, "#f0c64a");
      p(33, 9, 8, 2, "#f0c64a");
      p(36, 5, 2, 8, "#f0c64a");
    }
    if (unit.tier >= 3) {
      p(8, 7, 3, 3, "#f0c64a");
      p(6, 8, 7, 1, "#f0c64a");
      p(9, 5, 1, 7, "#f0c64a");
    }
    if (unit.tier >= 4) {
      p(39, 36, 4, 4, "#fff4b8");
      p(37, 38, 8, 2, "#fff4b8");
      p(40, 34, 2, 8, "#fff4b8");
      p(4, 36, 4, 4, "#fff4b8");
      p(2, 38, 8, 2, "#fff4b8");
      p(5, 34, 2, 8, "#fff4b8");
    }
    p(13, 34, 22, 2, shade);
  }

  function drawEvolutionDetails(p, typeId, tier, dark, hi) {
    if (tier < 2) return;
    if (typeId === "toast_tortoise") {
      p(12, 25, 26, 3, "#5a8d47");
      p(21, 13, 8, 4, "#f5d45b");
      p(19, 12, 12, 2, hi);
      if (tier >= 3) {
        p(9, 7, 31, 4, dark);
        p(11, 6, 27, 4, "#e8b765");
        p(14, 5, 21, 3, "#f7d39b");
        p(13, 31, 25, 3, "#5a8d47");
      }
      if (tier >= 4) {
        p(7, 4, 35, 5, dark);
        p(9, 3, 31, 5, "#f0c64a");
        p(12, 2, 25, 3, hi);
        p(10, 10, 29, 3, "#d9573c");
        p(10, 33, 29, 3, "#55a375");
        p(5, 24, 5, 6, "#85512e");
        p(38, 24, 5, 6, "#85512e");
      }
    } else if (typeId === "sushi_seal") {
      p(15, 11, 20, 5, "#f68a7c");
      p(17, 12, 7, 2, hi);
      p(33, 16, 3, 3, "#f0c64a");
      if (tier >= 3) {
        p(12, 28, 24, 4, "#25352f");
        p(14, 29, 5, 3, "#f0c64a");
        p(22, 29, 5, 3, "#55a375");
        p(30, 29, 5, 3, "#e45a6d");
        p(35, 12, 3, 7, "#55a375");
      }
      if (tier >= 4) {
        p(10, 8, 28, 5, dark);
        p(12, 7, 24, 5, "#f68a7c");
        p(15, 6, 7, 3, hi);
        p(12, 31, 25, 4, "#25352f");
        p(15, 32, 5, 3, "#f0c64a");
        p(23, 32, 5, 3, "#55a375");
        p(31, 32, 5, 3, "#e45a6d");
        p(38, 14, 4, 12, "#55a375");
      }
    } else if (typeId === "taco_tiger") {
      p(11, 14, 26, 4, "#6aae45");
      p(13, 17, 4, 4, "#f0c64a");
      p(22, 16, 4, 5, "#f0c64a");
      p(32, 17, 3, 4, "#f0c64a");
      if (tier >= 3) {
        p(10, 11, 28, 3, dark);
        p(12, 10, 24, 3, "#f1c84b");
        p(14, 13, 3, 7, dark);
        p(25, 13, 3, 7, dark);
        p(35, 14, 3, 9, "#d9573c");
      }
      if (tier >= 4) {
        p(8, 8, 33, 4, dark);
        p(10, 7, 29, 4, "#f1c84b");
        p(12, 12, 25, 4, "#6aae45");
        p(11, 19, 26, 3, "#f0c64a");
        p(8, 22, 5, 9, "#d9573c");
        p(36, 22, 5, 9, "#d9573c");
        p(16, 13, 3, 10, dark);
        p(25, 13, 3, 10, dark);
        p(33, 13, 3, 10, dark);
      }
    } else if (typeId === "berry_bat") {
      p(15, 10, 5, 5, "#9d5ac8");
      p(28, 10, 5, 5, "#9d5ac8");
      p(22, 8, 5, 4, "#55a375");
      p(8, 13, 7, 4, "#9d5ac8");
      p(33, 13, 7, 4, "#9d5ac8");
      if (tier >= 3) {
        p(21, 5, 7, 4, "#55a375");
        p(24, 2, 3, 6, "#6a4b35");
        p(3, 11, 11, 5, dark);
        p(34, 11, 11, 5, dark);
      }
      if (tier >= 4) {
        p(20, 2, 10, 5, "#f0c64a");
        p(23, 0, 4, 7, "#f0c64a");
        p(6, 8, 12, 7, dark);
        p(30, 8, 12, 7, dark);
        p(4, 12, 13, 9, "#9d5ac8");
        p(31, 12, 13, 9, "#9d5ac8");
        p(13, 29, 6, 5, "#dd5ea8");
        p(29, 29, 6, 5, "#dd5ea8");
      }
    } else if (typeId === "pancake_penguin") {
      p(10, 19, 29, 4, "#b36a2e");
      p(13, 8, 22, 4, "#f3cf8c");
      p(18, 7, 13, 3, "#e8b765");
      if (tier >= 3) {
        p(8, 10, 33, 5, dark);
        p(10, 9, 29, 5, "#e8b765");
        p(12, 6, 25, 4, "#f3cf8c");
        p(19, 4, 10, 4, "#f5d45b");
        p(6, 26, 6, 4, "#b36a2e");
        p(36, 26, 6, 4, "#b36a2e");
      }
      if (tier >= 4) {
        p(7, 5, 35, 5, dark);
        p(9, 4, 31, 5, "#f0c64a");
        p(13, 2, 23, 4, hi);
        p(12, 11, 27, 3, "#b36a2e");
        p(15, 17, 21, 3, "#b36a2e");
      }
    } else if (typeId === "pretzel_python") {
      p(10, 29, 28, 3, "#f0d56b");
      p(33, 9, 8, 4, "#f0d56b");
      p(25, 12, 11, 3, dark);
      if (tier >= 3) {
        p(5, 11, 38, 4, dark);
        p(7, 12, 34, 3, "#c47a35");
        p(13, 16, 8, 9, "#f0d56b");
        p(28, 16, 8, 9, "#f0d56b");
        p(18, 5, 14, 4, "#f0d56b");
      }
      if (tier >= 4) {
        p(4, 8, 40, 5, dark);
        p(6, 9, 36, 4, "#c47a35");
        p(11, 16, 10, 12, "#f0d56b");
        p(28, 16, 10, 12, "#f0d56b");
        p(19, 3, 17, 5, "#f0d56b");
        p(35, 8, 6, 8, "#8d3d27");
      }
    } else if (typeId === "curry_crab") {
      p(8, 16, 33, 4, "#f5d45b");
      p(11, 13, 27, 3, "#8d3d27");
      p(5, 15, 8, 5, "#f0c64a");
      p(35, 15, 8, 5, "#f0c64a");
      if (tier >= 3) {
        p(9, 9, 31, 4, dark);
        p(11, 8, 27, 4, "#d9852f");
        p(13, 12, 23, 3, "#f5d45b");
        p(2, 15, 11, 6, "#8d3d27");
        p(35, 15, 11, 6, "#8d3d27");
      }
      if (tier >= 4) {
        p(7, 6, 35, 5, dark);
        p(9, 5, 31, 5, "#f0c64a");
        p(12, 10, 25, 4, "#d9852f");
        p(1, 13, 13, 8, "#8d3d27");
        p(34, 13, 13, 8, "#8d3d27");
        p(5, 22, 6, 8, "#f0c64a");
        p(37, 22, 6, 8, "#f0c64a");
      }
    } else if (typeId === "pepper_prawn") {
      p(11, 12, 28, 4, "#f4d35e");
      p(35, 12, 8, 6, "#5aa6d6");
      p(8, 24, 7, 5, "#e24822");
      if (tier >= 3) {
        p(7, 8, 34, 4, dark);
        p(9, 7, 30, 4, "#f26a35");
        p(12, 5, 24, 3, "#f4d35e");
        p(34, 10, 10, 9, "#5aa6d6");
        p(5, 22, 9, 6, "#e24822");
      }
      if (tier >= 4) {
        p(5, 4, 38, 5, dark);
        p(7, 3, 34, 5, "#f26a35");
        p(10, 9, 29, 4, "#f4d35e");
        p(34, 7, 11, 13, "#5aa6d6");
        p(3, 20, 12, 8, "#e24822");
        p(36, 24, 8, 6, "#f4d35e");
      }
    } else if (typeId === "hot_chip_hamster") {
      p(10, 11, 29, 4, "#f4d35e");
      p(11, 27, 28, 4, "#8d3d27");
      p(8, 10, 9, 6, "#f7c94f");
      p(32, 10, 9, 6, "#f7c94f");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#e55a2a");
        p(12, 5, 25, 3, "#f4d35e");
        p(5, 22, 9, 8, "#8d3d27");
        p(35, 22, 9, 8, "#f7c94f");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f4d35e");
        p(10, 9, 29, 4, "#e55a2a");
        p(3, 20, 11, 10, "#8d3d27");
        p(34, 20, 11, 10, "#f7c94f");
        p(18, 2, 13, 5, "#fff4b8");
      }
    } else if (typeId === "popcorn_porcupine") {
      p(12, 10, 25, 4, "#fff4c2");
      p(14, 8, 4, 8, "#9c6a2f");
      p(24, 7, 4, 9, "#9c6a2f");
      p(33, 10, 4, 7, "#9c6a2f");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#fff4c2");
        p(12, 13, 25, 3, "#f4d35e");
        p(5, 18, 7, 10, "#9c6a2f");
        p(38, 18, 6, 9, "#9c6a2f");
      }
      if (tier >= 4) {
        p(6, 5, 37, 5, dark);
        p(8, 4, 33, 5, "#fff4c2");
        p(12, 2, 4, 9, "#f4d35e");
        p(22, 1, 4, 10, "#f4d35e");
        p(32, 2, 4, 9, "#f4d35e");
        p(11, 28, 26, 4, "#9c6a2f");
      }
    } else if (typeId === "yogurt_yeti") {
      p(11, 17, 27, 4, "#d6ecff");
      p(12, 10, 8, 5, "#6aa5d8");
      p(29, 10, 8, 5, "#6aa5d8");
      if (tier >= 3) {
        p(8, 8, 33, 5, dark);
        p(10, 7, 29, 5, "#f4f6ff");
        p(13, 12, 23, 4, "#d6ecff");
        p(6, 24, 7, 7, "#6aa5d8");
        p(36, 24, 7, 7, "#6aa5d8");
      }
      if (tier >= 4) {
        p(7, 4, 35, 5, dark);
        p(9, 3, 31, 5, "#d6ecff");
        p(13, 2, 7, 6, "#f8bdd8");
        p(29, 2, 7, 6, "#f8bdd8");
        p(10, 13, 29, 4, "#f4f6ff");
        p(13, 28, 23, 4, "#6aa5d8");
      }
    } else if (typeId === "donut_dodo") {
      p(12, 10, 27, 4, "#d9548f");
      p(16, 9, 3, 3, "#fff4b8");
      p(24, 8, 3, 3, "#6a9d38");
      p(31, 9, 3, 3, "#5a78c8");
      if (tier >= 3) {
        p(7, 11, 35, 4, dark);
        p(9, 10, 31, 4, "#d9548f");
        p(16, 5, 18, 5, "#f0c64a");
        p(38, 18, 5, 12, "#e7a85c");
      }
      if (tier >= 4) {
        p(8, 5, 33, 5, "#f0c64a");
        p(12, 3, 25, 4, hi);
        p(11, 12, 28, 4, "#d9548f");
        p(6, 20, 6, 10, "#f0c64a");
        p(37, 20, 6, 10, "#f0c64a");
      }
    } else if (typeId === "kimchi_chameleon") {
      p(10, 14, 29, 4, "#f0773e");
      p(29, 10, 12, 6, "#6a9d38");
      p(8, 28, 29, 4, "#6a9d38");
      if (tier >= 3) {
        p(7, 10, 35, 4, dark);
        p(9, 9, 31, 4, "#e65036");
        p(13, 7, 24, 3, "#f8d95a");
        p(34, 11, 10, 10, "#6a9d38");
        p(4, 24, 7, 5, "#f0773e");
      }
      if (tier >= 4) {
        p(6, 6, 36, 5, dark);
        p(8, 5, 32, 5, "#6a9d38");
        p(10, 10, 28, 4, "#e65036");
        p(36, 10, 8, 14, "#f8d95a");
        p(3, 22, 9, 7, "#6a9d38");
      }
    } else if (typeId === "waffle_walrus") {
      p(10, 12, 30, 4, "#9b6a2d");
      p(13, 26, 26, 4, "#6c8fbd");
      p(13, 33, 5, 7, "#fff4b8");
      p(31, 33, 5, 7, "#fff4b8");
      if (tier >= 3) {
        p(8, 9, 34, 4, dark);
        p(10, 8, 30, 4, "#d8a64a");
        p(4, 20, 8, 5, "#b56b12");
        p(36, 20, 8, 5, "#b56b12");
        p(18, 31, 12, 4, "#fff4b8");
      }
      if (tier >= 4) {
        p(6, 5, 38, 5, dark);
        p(8, 4, 34, 5, "#d8a64a");
        p(10, 10, 30, 4, "#9b6a2d");
        p(3, 17, 10, 8, "#b56b12");
        p(35, 17, 10, 8, "#b56b12");
        p(12, 34, 8, 7, hi);
        p(29, 34, 8, 7, hi);
      }
    } else if (typeId === "bagel_beaver") {
      p(10, 12, 30, 4, "#f0d56b");
      p(12, 28, 26, 5, "#8b5a2b");
      p(15, 10, 3, 3, "#ffffff");
      p(29, 10, 3, 3, "#ffffff");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#c98a3a");
        p(12, 6, 25, 3, "#f0d56b");
        p(6, 26, 10, 8, "#8b5a2b");
        p(32, 26, 10, 8, "#8b5a2b");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#f0d56b");
        p(10, 10, 29, 4, "#c98a3a");
        p(4, 24, 11, 10, "#8b5a2b");
        p(33, 24, 11, 10, "#8b5a2b");
        p(17, 2, 15, 5, "#fff4b8");
      }
    } else if (typeId === "bao_bun_badger") {
      p(10, 12, 30, 4, "#fff0cf");
      p(11, 27, 28, 5, "#c05a39");
      p(9, 10, 9, 6, "#6b4b35");
      p(31, 10, 9, 6, "#6b4b35");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#f0d8b4");
        p(12, 6, 25, 3, "#fff0cf");
        p(5, 24, 9, 8, "#c05a39");
        p(36, 20, 8, 8, "#e0a44a");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#fff0cf");
        p(10, 10, 29, 4, "#f0d8b4");
        p(3, 22, 11, 10, "#c05a39");
        p(35, 18, 10, 11, "#e0a44a");
        p(17, 2, 15, 5, "#6b4b35");
      }
    } else if (typeId === "dumpling_armadillo") {
      p(11, 12, 27, 4, "#fff4d8");
      p(9, 25, 30, 5, "#8b6f50");
      p(35, 15, 5, 12, "#8b6f50");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#f0dcb8");
        p(12, 13, 26, 4, "#d6b58c");
        p(5, 24, 8, 8, "#8b6f50");
        p(36, 24, 8, 8, "#8b6f50");
      }
      if (tier >= 4) {
        p(6, 5, 37, 5, dark);
        p(8, 4, 33, 5, "#d6b58c");
        p(11, 3, 27, 4, "#fff4d8");
        p(10, 11, 29, 4, "#8b6f50");
        p(4, 22, 9, 10, "#8b6f50");
        p(36, 22, 9, 10, "#8b6f50");
      }
    } else if (typeId === "lemon_meringue_lynx") {
      p(11, 13, 28, 4, "#ffffff");
      p(16, 8, 19, 4, "#fff4b8");
      p(34, 21, 6, 6, "#ffffff");
      if (tier >= 3) {
        p(8, 9, 34, 4, dark);
        p(10, 8, 30, 4, "#f2dc5d");
        p(13, 6, 24, 3, "#ffffff");
        p(6, 22, 8, 5, "#fff4b8");
        p(35, 22, 8, 5, "#fff4b8");
      }
      if (tier >= 4) {
        p(7, 5, 36, 5, dark);
        p(9, 4, 32, 5, "#f2dc5d");
        p(12, 2, 25, 4, "#ffffff");
        p(10, 12, 29, 4, "#fff4b8");
        p(4, 20, 9, 8, "#ffffff");
        p(36, 20, 9, 8, "#ffffff");
      }
    } else if (typeId === "shakshuka_shark") {
      p(10, 12, 30, 4, "#f4d35e");
      p(9, 27, 30, 5, "#8d3d27");
      p(34, 10, 8, 8, "#e24822");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#e24822");
        p(12, 12, 25, 4, "#f4d35e");
        p(5, 24, 9, 8, "#8d3d27");
        p(35, 10, 9, 12, "#f26a35");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#8d3d27");
        p(10, 10, 29, 4, "#e24822");
        p(12, 15, 24, 4, "#f4d35e");
        p(3, 22, 11, 10, "#f26a35");
        p(34, 8, 11, 14, "#f26a35");
      }
    } else if (typeId === "saltwater_taffy_otter") {
      p(10, 12, 30, 4, "#ffffff");
      p(10, 27, 29, 5, "#5aa6d6");
      p(34, 12, 8, 8, "#5aa6d6");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#f2a7c7");
        p(12, 6, 25, 3, "#ffffff");
        p(5, 23, 9, 8, "#5aa6d6");
        p(35, 13, 9, 11, "#f7d2df");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#f2a7c7");
        p(10, 10, 29, 4, "#ffffff");
        p(12, 15, 25, 4, "#5aa6d6");
        p(3, 21, 11, 10, "#f7d2df");
        p(34, 10, 11, 13, "#5aa6d6");
      }
    } else if (typeId === "croissant_kraken") {
      p(10, 11, 29, 4, "#f0c56b");
      p(5, 28, 38, 3, "#6b4aa8");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#d69a3e");
        p(12, 5, 25, 3, "#f0c56b");
        p(4, 25, 8, 8, "#6b4aa8");
        p(36, 25, 8, 8, "#6b4aa8");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f0c56b");
        p(10, 9, 29, 4, "#d69a3e");
        p(2, 21, 10, 10, "#6b4aa8");
        p(36, 20, 10, 10, "#6b4aa8");
      }
    } else if (typeId === "fortune_cookie_fox") {
      p(14, 12, 22, 4, "#fff4b8");
      p(34, 18, 8, 7, "#d24d53");
      if (tier >= 3) {
        p(8, 9, 34, 4, dark);
        p(10, 8, 30, 4, "#e4b65f");
        p(13, 6, 24, 3, "#fff4b8");
        p(35, 17, 9, 9, "#d24d53");
        p(6, 24, 6, 5, "#d24d53");
      }
      if (tier >= 4) {
        p(7, 5, 36, 5, dark);
        p(9, 4, 32, 5, "#fff4b8");
        p(12, 10, 26, 4, "#e4b65f");
        p(3, 22, 10, 7, "#d24d53");
        p(36, 17, 9, 13, "#d24d53");
      }
    } else if (typeId === "mochi_mammoth") {
      p(10, 13, 30, 4, "#fff4f5");
      p(35, 20, 5, 12, "#8b6fb0");
      if (tier >= 3) {
        p(7, 10, 35, 4, dark);
        p(9, 9, 31, 4, "#f2d6df");
        p(12, 7, 25, 3, "#fff4f5");
        p(4, 24, 8, 8, "#8b6fb0");
        p(36, 24, 8, 8, "#8b6fb0");
      }
      if (tier >= 4) {
        p(5, 6, 39, 5, dark);
        p(7, 5, 35, 5, "#8b6fb0");
        p(10, 4, 29, 3, "#fff4f5");
        p(3, 21, 10, 10, "#8b6fb0");
        p(36, 21, 10, 10, "#8b6fb0");
      }
    } else if (typeId === "gingerbread_golem") {
      p(12, 12, 26, 4, "#f5f0df");
      p(12, 31, 26, 3, "#f5f0df");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#b66b34");
        p(12, 6, 25, 3, "#f5f0df");
        p(5, 23, 8, 8, "#d24d53");
        p(36, 23, 8, 8, "#6ba044");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f5f0df");
        p(10, 9, 29, 4, "#b66b34");
        p(3, 20, 10, 10, "#d24d53");
        p(36, 20, 10, 10, "#6ba044");
      }
    } else if (typeId === "boba_basilisk") {
      p(10, 14, 29, 4, "#f4e7ff");
      p(10, 29, 28, 3, "#3d263d");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#c99bd8");
        p(13, 6, 24, 3, "#f4e7ff");
        p(34, 11, 9, 10, "#3d263d");
        p(5, 24, 8, 6, "#3d263d");
      }
      if (tier >= 4) {
        p(6, 5, 37, 5, dark);
        p(8, 4, 33, 5, "#c99bd8");
        p(11, 3, 27, 3, "#f4e7ff");
        p(35, 9, 10, 14, "#3d263d");
        p(3, 22, 10, 8, "#3d263d");
      }
    } else if (typeId === "iceberg_oyster") {
      p(10, 13, 30, 4, "#ffffff");
      p(13, 26, 25, 5, "#7ec7e8");
      p(20, 17, 9, 9, "#f4e7ff");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#d8f2ff");
        p(12, 6, 25, 3, "#ffffff");
        p(5, 23, 9, 9, "#7ec7e8");
        p(35, 15, 9, 10, "#4d9d95");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#d8f2ff");
        p(10, 10, 29, 4, "#ffffff");
        p(17, 15, 15, 12, "#f4e7ff");
        p(20, 18, 9, 7, "#4d9d95");
        p(3, 21, 11, 10, "#7ec7e8");
        p(36, 14, 9, 13, "#4d9d95");
      }
    } else if (typeId === "churro_cheetah") {
      p(10, 12, 29, 4, "#f0c56b");
      p(34, 10, 8, 8, "#e24822");
      p(10, 27, 28, 4, "#8d3d27");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#c98335");
        p(12, 5, 25, 3, "#f0c56b");
        p(5, 23, 9, 7, "#e24822");
        p(35, 11, 9, 11, "#e24822");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f4d35e");
        p(10, 9, 29, 4, "#c98335");
        p(3, 20, 11, 10, "#e24822");
        p(34, 8, 11, 14, "#e24822");
        p(16, 14, 18, 3, "#fff4b8");
      }
    } else if (typeId === "granola_goat") {
      p(11, 12, 28, 4, "#f0d56b");
      p(13, 27, 25, 5, "#7aa530");
      p(9, 9, 9, 6, "#8b5d35");
      p(31, 9, 9, 6, "#8b5d35");
      if (tier >= 3) {
        p(7, 8, 35, 4, dark);
        p(9, 7, 31, 4, "#d6a04c");
        p(12, 5, 25, 3, "#f0d56b");
        p(5, 22, 9, 8, "#7aa530");
        p(35, 22, 9, 8, "#7d3aa0");
      }
      if (tier >= 4) {
        p(5, 4, 39, 5, dark);
        p(7, 3, 35, 5, "#f0d56b");
        p(10, 9, 29, 4, "#d6a04c");
        p(3, 20, 11, 10, "#7aa530");
        p(34, 20, 11, 10, "#7d3aa0");
        p(18, 2, 13, 5, "#fff4b8");
      }
    } else if (typeId === "breakfast_burrito_boar") {
      p(10, 12, 30, 4, "#f5d45b");
      p(10, 27, 29, 5, "#55a375");
      p(35, 15, 8, 8, "#8d3d27");
      if (tier >= 3) {
        p(7, 9, 35, 4, dark);
        p(9, 8, 31, 4, "#d99736");
        p(12, 12, 25, 4, "#f5d45b");
        p(5, 23, 10, 8, "#8d3d27");
        p(35, 13, 9, 11, "#e24822");
      }
      if (tier >= 4) {
        p(5, 5, 39, 5, dark);
        p(7, 4, 35, 5, "#d99736");
        p(10, 10, 29, 4, "#f5d45b");
        p(12, 15, 25, 4, "#55a375");
        p(3, 22, 11, 9, "#8d3d27");
        p(34, 10, 11, 13, "#e24822");
      }
    } else {
      p(14, 16, 22, 3, "#f7e8ae");
      p(17, 13, 18, 3, "#f7e8ae");
      p(28, 9, 5, 5, "#55a375");
      p(33, 10, 4, 4, "#55a375");
      if (tier >= 3) {
        p(10, 11, 28, 3, "#f7e8ae");
        p(13, 8, 24, 3, "#f7e8ae");
        p(25, 5, 10, 4, "#55a375");
        p(35, 18, 4, 11, "#55a375");
      }
      if (tier >= 4) {
        p(8, 8, 31, 4, "#f7e8ae");
        p(11, 5, 28, 4, "#f7e8ae");
        p(14, 2, 19, 4, "#f7e8ae");
        p(27, 2, 10, 5, "#55a375");
        p(38, 17, 5, 13, "#55a375");
        p(7, 24, 5, 8, "#55a375");
        p(19, 10, 4, 4, "#f0c64a");
        p(31, 11, 4, 4, "#f0c64a");
      }
    }
  }

  function pixelOval(p, x, y, w, h, color) {
    const rows = [
      [0.28, 0.44],
      [0.14, 0.72],
      [0.04, 0.92],
      [0, 1],
      [0.04, 0.92],
      [0.14, 0.72],
      [0.28, 0.44],
    ];
    rows.forEach(([offset, width], index) => {
      const yy = y + Math.round((index / rows.length) * h);
      const hh = Math.max(2, Math.ceil(h / rows.length));
      p(x + Math.round(w * offset), yy, Math.round(w * width), hh, color);
    });
  }

  function drawStatsPanel() {
    const panel = INFO_PANEL;
    const contentX = panel.x + 20;
    const contentW = panel.w - 40;
    const textX = contentX + 66;
    const panelDy = panel.y - 136;
    const metricXs = [contentX, contentX + 58, contentX + 150, contentX + 211];
    const metricWs = [52, 86, 56, 57];
    const ref = getSelectedRef();
    const teamIntelBg = getUiSprite(TEAM_INTEL_BG_SRC);
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    if (teamIntelBg && teamIntelBg.complete && teamIntelBg.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(teamIntelBg, panel.x, panel.y, panel.w, panel.h);
      ctx.fillStyle = "rgba(255, 253, 232, 0.16)";
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      ctx.restore();
    } else {
      ctx.fillStyle = "rgba(255, 253, 232, 0.82)";
      ctx.fill();
    }
    roundedRect(panel.x, panel.y, panel.w, panel.h, 8);
    ctx.strokeStyle = "rgba(22, 57, 45, 0.18)";
    ctx.stroke();

    if (!ref) {
      const titleY = 166 + panelDy;
      const arenaDividerY = 190 + panelDy;
      const arenaY = 212 + panelDy;
      const traitDividerY = 318 + panelDy;
      const traitY = 340 + panelDy;
      ctx.fillStyle = "#16392d";
      ctx.font = "900 17px Inter, sans-serif";
      ctx.fillText("Team Intel", contentX, titleY);
      drawInfoDivider(contentX, arenaDividerY, contentW);
      drawArenaInfoRows(contentX, arenaY, contentW, 3);
      drawInfoDivider(contentX, traitDividerY, contentW);
      drawActiveTraitRows(contentX, traitY, contentW);
      return;
    }

    if (isItem(ref.entry)) {
      const item = ref.entry;
      const stat = itemPrimaryStat(item);
      const itemMetricY = 252 + panelDy;
      const showMergeInfo = !isDrink(item);
      const mergeBarY = 306 + panelDy;
      const mergeTextY = 324 + panelDy;
      const specsDividerY = (showMergeInfo ? 334 : 306) + panelDy;
      const specsTitleY = (showMergeInfo ? 360 : 332) + panelDy;
      drawItemIcon(item, contentX + 26, 194 + panelDy, 26);
      ctx.fillStyle = "#16392d";
      ctx.font = "900 16px Inter, sans-serif";
      fitText(`${item.name} ${itemLevelLabel(item)}`, textX, 178 + panelDy, contentW - 66, "900 16px Inter, sans-serif", "#16392d");
      ctx.fillStyle = "#6a4b35";
      ctx.font = "700 12px Inter, sans-serif";
      ctx.fillText(isDrink(item) ? "Drink" : "Topping", textX, 196 + panelDy);
      drawRarityBadge(textX, 205 + panelDy, item.rarity);
      drawInfoMetric("COST", { currency: entryCost(item) }, metricXs[0], itemMetricY, metricWs[0]);
      drawInfoMetric(stat.label, stat.value, metricXs[1], itemMetricY, metricWs[1]);
      drawInfoMetric("LV", `${itemTier(item.tier)}/${MAX_ITEM_TIER}`, metricXs[2], itemMetricY, metricWs[2]);
      drawInfoMetric("TYPE", item.type === "topping" ? "Top" : item.type === "drink" ? "Drink" : item.type, metricXs[3], itemMetricY, metricWs[3]);
      if (showMergeInfo) {
        const itemCopies = itemMergeProgressCount(item.id, item.tier);
        const itemMergeText = itemTier(item.tier) >= MAX_ITEM_TIER ? "Max level" : `${Math.min(itemCopies, 3)}/3 to Lv ${itemTier(item.tier) + 1}`;
        drawSmallProgressBar(contentX, mergeBarY, contentW, itemTier(item.tier) >= MAX_ITEM_TIER ? 1 : Math.min(1, itemCopies / 3), item.accent);
        fitText(itemMergeText, contentX + 42, mergeTextY, 104, "800 11px Inter, sans-serif", "#6a4b35");
      }
      const itemOwnedInPanel = ref.area === "bench" || ref.area === "itemBench" || ref.area === "drinks";
      drawInfoDivider(contentX, specsDividerY, contentW);
      ctx.fillStyle = "#16392d";
      ctx.font = "900 12px Inter, sans-serif";
      ctx.fillText(isDrink(item) ? "Drink specs" : "Topping specs", contentX, specsTitleY);
      ctx.fillStyle = "#6a4b35";
      ctx.font = "800 12px Inter, sans-serif";
      const summaryY = (showMergeInfo ? (itemOwnedInPanel ? 398 : 384) : 356) + panelDy;
      const specStartY = (showMergeInfo ? (itemOwnedInPanel ? 422 : 408) : 380) + panelDy;
      fitText(itemCompactSpecLine(item), contentX, summaryY, contentW, "800 12px Inter, sans-serif", "#6a4b35");
      ctx.font = "700 10px Inter, sans-serif";
      const fans = favoriteUsersForItem(item.id);
      const specGap = fans.length ? 15 : 18;
      const visibleSpecs = itemSpecLines(item).slice(0, fans.length ? 3 : 4);
      visibleSpecs.forEach((line, index) => {
        wrapTextLimited(line, contentX, specStartY + index * specGap, contentW, 11, 1);
      });
      if (fans.length) {
        const favoriteY = specStartY + visibleSpecs.length * specGap + 2;
        ctx.fillStyle = "#16392d";
        ctx.font = "900 11px Inter, sans-serif";
        ctx.fillText("Favorite for", contentX, favoriteY);
        ctx.fillStyle = "#6a4b35";
        ctx.font = "800 10px Inter, sans-serif";
        fitText(fans.join(", "), contentX, favoriteY + 16, contentW, "800 10px Inter, sans-serif", "#6a4b35");
      }
      if (ref.area === "bench" || ref.area === "itemBench" || ref.area === "drinks") {
        drawButton({ ...selectedSellButton(ref), label: "Sell", coinAmount: itemSellValue(item) }, true);
      }
      return;
    }

    const unit = ref.unit;
    const effect = specialEffectFor(unit);
    const slotRect = equipmentSlotRect();
    const headerTextW = Math.max(72, slotRect.x - textX - 8);

    drawFoodAnimal(unit, contentX + 26, 194 + panelDy, 25, true);
    drawSelectedEquipmentSlot(unit);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 16px Inter, sans-serif";
    fitText(unit.name, textX, 178 + panelDy, headerTextW, "900 16px Inter, sans-serif", "#16392d");
    ctx.fillStyle = "#6a4b35";
    ctx.font = "700 12px Inter, sans-serif";
    fitText(unit.lineName, textX, 196 + panelDy, headerTextW, "700 12px Inter, sans-serif", "#6a4b35");
    drawRarityBadge(textX, 207 + panelDy, unit.rarity);
    drawTraitChips(unit.traits || [], textX, 231 + panelDy, headerTextW, { maxRows: 1, fontSize: 7, minWidth: 24 });

    const unitMetricY = 256 + panelDy;
    drawInfoMetric("ATK", unit.atk, metricXs[0], unitMetricY, metricWs[0]);
    drawInfoMetric("HP", `${unit.hp}/${unit.maxHp}`, metricXs[1], unitMetricY, metricWs[1]);
    drawInfoMetric("CD", unit.speed.toFixed(2), metricXs[2], unitMetricY, metricWs[2]);
    drawInfoMetric("PWR", unit.abilityPower, metricXs[3], unitMetricY, metricWs[3]);
    if (ref.area === "bench" || ref.area === "board") {
      drawButton({ ...selectedSellButton(ref), label: "Sell", coinAmount: sellValue(unit) }, true);
    }
    if ((ref.area === "bench" || ref.area === "board") && unit.item) {
      drawButton(selectedDetachButton(ref), true);
    }
    const favoriteH = drawFavoriteToppingRow(unit, contentX, 332 + panelDy, contentW);
    const abilityDividerY = (favoriteH ? 334 + favoriteH : 332) + panelDy;
    drawInfoDivider(contentX, abilityDividerY - 12, contentW);
    ctx.fillStyle = "#16392d";
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText(effect.title, contentX, abilityDividerY + 17);
    ctx.fillStyle = "#6a4b35";
    ctx.font = "700 10px Inter, sans-serif";
    wrapTextLimited(effect.body, contentX, abilityDividerY + 32, contentW, 11, favoriteH ? 4 : 6);
  }

  function drawResultPanel() {
    roundedRect(700, 76, 306, 466, 8);
    ctx.fillStyle = "rgba(255, 253, 232, 0.86)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.18)";
    ctx.stroke();

    const income = state.lastIncome;
    const hasReward = state.hearts > 0 && state.rewardChoices?.length;
    const won = income?.result === "win";
    const resultTitle = state.hearts <= 0 ? "Run Over" : won ? "Victory!" : "Defeat";
    const resultColor = state.hearts <= 0 ? "#9b3028" : won ? "#1f7d4a" : "#a94b2b";
    roundedRect(718, 92, 268, 34, 8);
    ctx.fillStyle = won ? "rgba(219, 246, 198, 0.92)" : state.hearts <= 0 ? "rgba(255, 214, 205, 0.92)" : "rgba(255, 234, 190, 0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.16)";
    ctx.stroke();
    ctx.fillStyle = "#16392d";
    ctx.font = "900 16px Inter, sans-serif";
    fitText(resultTitle, 732, 114, hasReward ? 138 : 232, "900 16px Inter, sans-serif", resultColor);
    if (hasReward) {
      roundedRect(882, 99, 92, 19, 6);
      ctx.fillStyle = "#f7d15b";
      ctx.fill();
      ctx.strokeStyle = "rgba(138, 82, 35, 0.28)";
      ctx.stroke();
      drawUiAtlasIcon("reward_gold", 894, 108, 15, { tooltip: null });
      ctx.font = "900 9px Inter, sans-serif";
      fitText("REWARD", 905, 112, 60, "900 9px Inter, sans-serif", "#6a3f14");
    }
    if (income) {
      roundedRect(718, 136, 268, 31, 7);
      ctx.fillStyle = "rgba(255, 249, 214, 0.72)";
      ctx.fill();
      ctx.strokeStyle = "rgba(22, 57, 45, 0.12)";
      ctx.stroke();
      ctx.fillStyle = "#6a4b35";
      ctx.font = "900 10px Inter, sans-serif";
      ctx.fillText("BATTLE PAYOUT", 730, 156);
      drawCurrencyAmount(income.total, 870, 152, {
        sign: "+",
        font: "900 15px Inter, sans-serif",
        color: "#16392d",
        iconSize: 16,
      });
      const heartDamage = state.lastCombatLedger?.heartDamage || 0;
      if (heartDamage > 0) {
        ctx.fillStyle = "#9b3028";
        ctx.font = "900 10px Inter, sans-serif";
        fitText(`-${heartDamage} health`, 925, 156, 52, "900 10px Inter, sans-serif", "#9b3028");
      }
    }
    drawCombatLedger(state.lastCombatLedger, 720, 188, 268);
    if (!state.rewardChoices?.length) {
      wrapText(state.hearts <= 0 ? "Your run has ended. Restart from the top bar." : "Reward claimed.", 720, 320, 268, 15);
      return;
    }
    drawRewardPrompt();
    state.rewardChoices.forEach((reward, index) => drawRewardChoice(reward, buttons[`reward${index}`], index));
  }

  function drawRewardPrompt() {
    roundedRect(710, 304, 286, 232, 8);
    ctx.fillStyle = "rgba(255, 241, 176, 0.5)";
    ctx.fill();
    ctx.strokeStyle = "rgba(217, 144, 67, 0.48)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    drawUiAtlasIcon("reward_gold", 730, 329, 22, { tooltip: { title: "Post-battle reward", body: "Pick one reward before the next course starts." } });
    ctx.fillStyle = "#16392d";
    ctx.font = "900 14px Inter, sans-serif";
    ctx.fillText("Choose 1 Reward", 748, 334);
    ctx.fillStyle = "#8a5223";
    ctx.font = "800 10px Inter, sans-serif";
    ctx.fillText("Claim one to start the next course", 748, 348);
  }

  function drawCombatLedger(ledger, x, y, maxWidth) {
    ctx.fillStyle = "#16392d";
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText("Combat ledger", x, y);
    if (!ledger) {
      ctx.fillStyle = "#6a4b35";
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillText("No combat details captured.", x, y + 20);
      return;
    }
    const rows = [
      [`Damage`, `You ${ledger.ally.damageDealt} / Foe ${ledger.enemy.damageDealt}`, "info_damage", "Damage dealt by each side."],
      [`Support`, `Heal ${ledger.ally.healingReceived} / Shield ${ledger.ally.shieldingReceived}`, "info_heal", "Healing and shielding received by your team."],
      [`KOs`, `${ledger.ally.kos}-${ledger.enemy.kos} in ${ledger.duration}s`, "info_ko", "Knockouts and total battle duration."],
    ];
    rows.forEach(([label, value, iconId, body], index) => {
      const rowY = y + 18 + index * 18;
      drawUiAtlasIcon(iconId, x + 8, rowY - 4, 16, { tooltip: { title: label, body } });
      ctx.fillStyle = "#6a4b35";
      ctx.font = "800 10px Inter, sans-serif";
      ctx.fillText(label, x + 20, rowY);
      ctx.fillStyle = "#16392d";
      ctx.font = "900 12px Inter, sans-serif";
      fitText(value, x + 84, rowY, maxWidth - 84, "900 12px Inter, sans-serif", "#16392d");
    });
    const mvp = ledger.mvp?.damageDealt > 0 ? `${ledger.mvp.name}: ${ledger.mvp.damageDealt} dmg${ledger.mvp.kos ? `, ${ledger.mvp.kos} KO` : ""}` : "No damage MVP";
    const protectedLine = ledger.protected && ledger.protected.healingReceived + ledger.protected.shieldingReceived > 0
      ? `${ledger.protected.name}: +${ledger.protected.healingReceived} HP, +${ledger.protected.shieldingReceived} shield`
      : "No major support target";
    ctx.fillStyle = "#6a4b35";
    ctx.font = "800 10px Inter, sans-serif";
    drawUiAtlasIcon("info_damage", x + 8, y + 74, 16, { tooltip: { title: "MVP", body: "Top damage dealer for the fight." } });
    drawUiAtlasIcon("info_shield", x + 8, y + 92, 16, { tooltip: { title: "Held", body: "Unit that received the most support." } });
    ctx.fillText("MVP", x + 20, y + 78);
    ctx.fillText("Held", x + 20, y + 96);
    ctx.font = "900 11px Inter, sans-serif";
    fitText(mvp, x + 52, y + 78, maxWidth - 52, "900 11px Inter, sans-serif", "#16392d");
    fitText(protectedLine, x + 52, y + 96, maxWidth - 52, "900 11px Inter, sans-serif", "#16392d");
  }

  function rewardIconId(reward) {
    if (!reward) return "reward_gold";
    if (reward.type === "gold" || reward.type === "arenaPurse") return "reward_gold";
    if (reward.type === "freeRolls" || reward.type === "arenaScout" || reward.type === "arenaHold") return "reward_freeRolls";
    if (reward.type === "item") return reward.key?.startsWith("favorite:") ? "reward_favorite" : "reward_item";
    if (reward.type === "copy") return "reward_copy";
    if (reward.type === "upgradeDiscount" || reward.type === "shopSlotUnlock") return "reward_discount";
    if (reward.type?.startsWith("arena")) return "reward_arena";
    return "reward_gold";
  }

  function rewardKindLabel(reward) {
    if (!reward) return "REWARD";
    if (reward.type === "gold" || reward.type === "arenaPurse") return "COINS";
    if (reward.type === "freeRolls") return "ROLL";
    if (reward.type === "item") return reward.key?.startsWith("favorite:") ? "FAV" : "TOP";
    if (reward.type === "copy") return "COPY";
    if (reward.type === "upgradeDiscount") return "UPG";
    if (reward.type === "shopSlotUnlock") return "SLOT";
    if (reward.type?.startsWith("arena")) return "ARENA";
    return "REWARD";
  }

  function drawRewardChoice(reward, button, index) {
    const pulse = 0.5 + 0.5 * Math.sin((state.lastTime || 0) / 260 + index * 0.7);
    roundedRect(button.x, button.y, button.w, button.h, 8);
    ctx.fillStyle = index === 0 ? `rgba(255, 249, 214, ${0.92 + pulse * 0.06})` : "#fff9d6";
    ctx.fill();
    ctx.strokeStyle = index === 0 ? "#d99043" : "rgba(22, 57, 45, 0.24)";
    ctx.lineWidth = index === 0 ? 3 : 2;
    ctx.stroke();
    ctx.lineWidth = 1;
    roundedRect(button.x + 8, button.y + 8, 34, 34, 7);
    ctx.fillStyle = "rgba(255, 255, 255, 0.66)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.12)";
    ctx.stroke();
    drawUiAtlasIcon(rewardIconId(reward), button.x + 25, button.y + 25, 25, {
      tooltip: { title: reward.title, body: reward.body },
    });
    roundedRect(button.x + button.w - 56, button.y + 8, 42, 15, 5);
    ctx.fillStyle = "#f7d15b";
    ctx.fill();
    ctx.strokeStyle = "rgba(138, 82, 35, 0.2)";
    ctx.stroke();
    ctx.fillStyle = "#6a3f14";
    ctx.font = "900 8px Inter, sans-serif";
    fitText(rewardKindLabel(reward), button.x + button.w - 51, button.y + 19, 32, "900 8px Inter, sans-serif", "#6a3f14");
    ctx.fillStyle = "#16392d";
    ctx.font = "900 12px Inter, sans-serif";
    const textX = button.x + 52;
    const textWidth = button.w - 118;
    fitText(reward.title, textX, button.y + 18, textWidth, "900 12px Inter, sans-serif", "#16392d");
    ctx.fillStyle = "#6a4b35";
    ctx.font = "700 10px Inter, sans-serif";
    wrapTextLimited(reward.body, textX, button.y + 35, button.w - 72, 10, 2);
  }

  function drawEnemyPreviewMini(x, y, maxWidth) {
    const enemies = ensureEnemyPreview();
    ctx.fillStyle = "#16392d";
    ctx.font = "800 12px Inter, sans-serif";
    ctx.fillText("Next enemy", x, y);
    enemies.slice(0, 5).forEach((unit, index) => {
      const px = x + 18 + index * 35;
      const py = y + 28;
      drawFoodAnimal(unit, px, py, 12, false);
      drawRarityDot(px + 13, py - 13, unit.rarity);
    });
    if (enemies.length > 5) {
      ctx.fillStyle = "#6a4b35";
      ctx.font = "800 10px Inter, sans-serif";
      ctx.fillText(`+${enemies.length - 5}`, x + 184, y + 32);
    }
  }

  function getSelectedRef() {
    if (!state.selected) return null;
    const entry = state[state.selected.area]?.[state.selected.index];
    if (!entry) return null;
    return { ...state.selected, entry, unit: isUnit(entry) ? entry : null };
  }

  function equipmentSlotRect() {
    return { x: INFO_PANEL.x + INFO_PANEL.w - 102, y: INFO_PANEL.y + 22, w: 72, h: 72 };
  }

  function selectedEquipmentTargetRef(drag = state.drag) {
    const source = drag?.equipmentTarget || getSelectedRef();
    if (!source || source.area !== "bench" && source.area !== "board") return null;
    const unit = state[source.area]?.[source.index];
    if (!isUnit(unit)) return null;
    return { area: source.area, index: source.index, entry: unit, unit };
  }

  function abilitySpecLine(unit) {
    if (!unit) return "No ability";
    if (unit.ability === "guard") return `Hit: shield lowest ally ${supportAmount(unit, guardShield(unit))}`;
    if (unit.ability === "execute") return `Target weakest; +${executeBonus(unit)} dmg at <=50% HP`;
    if (unit.ability === "cleave") return `Hit: column splash ${cleaveDamage(unit)} dmg`;
    if (unit.ability === "back_row") return `Targets back column; ${Math.max(0, unit.tier - 1)} extra x ${volleyDamage(unit)} dmg`;
    if (unit.ability === "heal") return `Heal ${supportAmount(unit, healAmount(unit))}; fallback shield ${supportAmount(unit, noodleFallbackShield(unit))}`;
    if (unit.ability === "syrup_start") return `Start adj: ${supportAmount(unit, syrupShield(unit))} shield, +${percentText(syrupHaste(unit))} spd`;
    if (unit.ability === "slow") return `Hit: target CD +${pretzelDelay(unit)}s`;
    if (unit.ability === "pepper_dash") return `Hit: burn ${pepperBurnDamage(unit)}/s ${statusDuration(unit, pepperBurnDuration(unit)).toFixed(1)}s`;
    if (unit.ability === "armor_break") return `+${armorBreakBonus(unit)} dmg vs front/shield/high-HP`;
    if (unit.ability === "bagel_build") return `Hit: 2 allies get ${supportAmount(unit, bagelBuildShield(unit))} shield`;
    if (unit.ability === "treat_income") return `Survive battle: +${donutTreatGold(unit)} coins`;
    if (unit.ability === "status_spread") return `Hit: burn ${kimchiBurnDamage(unit)}/s; mark +${percentText(kimchiMarkPct(unit))} dmg`;
    if (unit.ability === "sticky_lane") return `Hit: target column CD +${waffleLaneDelay(unit)}s`;
    if (unit.ability === "kernel_combo") return `Stack: +${popcornDamagePerStack(unit)} dmg, +${percentText(popcornStackHaste(unit))} spd`;
    if (unit.ability === "sour_aura") return `Hit: support -${percentText(yogurtSourPct(unit))}, shield dmg +${yogurtShieldCrackDamage(unit)}`;
    if (unit.ability === "row_shield") return `Row shield ${supportAmount(unit, dumplingRowShield(unit))} on hit`;
    if (unit.ability === "cleanse") return `Cleanse: heal ${supportAmount(unit, lemonCleanseHeal(unit))}, shield ${supportAmount(unit, lemonCleanseShield(unit))}`;
    if (unit.ability === "shakshuka_burn") return `Hit: burn ${shakshukaBurnDamage(unit)}/s, splash ${shakshukaSplashDamage(unit)}`;
    if (unit.ability === "pull_start") return `Start: pull back-row, ${krakenPullDamage(unit)} dmg, CD +${krakenPullDelay(unit)}s`;
    if (unit.ability === "copy_luck") return `Shop owned-line odds +${percentText(fortuneShopChance(unit))}`;
    if (unit.ability === "survive_scale") return `Survive battle: permanent +${mochiHpGain(unit)} HP`;
    if (unit.ability === "ginger_decoy") return `Start: decoy ${gingerDecoyHp(unit)} HP; death ${gingerCrumbleDamage(unit)} dmg`;
    if (unit.ability === "iceberg_lock") return `Hit: CD +${oysterLockDelay(unit)}s, -${percentText(oysterSlowPct(unit))} spd`;
    if (unit.ability === "pearl_stun") return `Every ${bobaStunEvery(unit)} hits: CD +${bobaStunDelay(unit)}s`;
    return "Targets front occupied enemy column";
  }

  function specialEffectFor(unit) {
    if (unit.ability === "guard") {
      const title = unit.typeId === "avocado_axolotl" ? "Spec: Pit Guard" : "Spec: Team Shield";
      return {
        title,
        body: `Trigger hit. Target ally with lowest shield. Shield ${supportAmount(unit, guardShield(unit))}.`,
      };
    }
    if (unit.ability === "execute") {
      return {
        title: "Spec: Wounded Snipe",
        body: `Target weakest enemy. Damage ${unit.atk}; if target HP <=50%, damage +${executeBonus(unit)}.`,
      };
    }
    if (unit.ability === "cleave") {
      return {
        title: "Spec: Column Cleave",
        body: `Primary damage ${unit.atk}. Other enemies in target column take ${cleaveDamage(unit)} splash.`,
      };
    }
    if (unit.ability === "back_row") {
      const combo = unit.item?.backRowTargeting ? ` Favorite back hit +${berryPretzelComboDamage(unit)}.` : "";
      return {
        title: "Spec: Back-Row Volley",
        body: `Targets back occupied column. Extra bolts ${Math.max(0, unit.tier - 1)} x ${volleyDamage(unit)} damage.${combo}`,
      };
    }
    if (unit.ability === "heal") {
      const isCaesar = unit.typeId === "caesar_salamander";
      return {
        title: isCaesar ? "Spec: Crisp Heal" : "Spec: Support Heal",
        body: `Before attack: heal weakest damaged ally ${supportAmount(unit, healAmount(unit))}; add ${supportAmount(unit, Math.round(unit.abilityPower * 0.35))} shield. No damaged ally: shield ${supportAmount(unit, noodleFallbackShield(unit))}.`,
      };
    }
    if (unit.ability === "syrup_start") {
      const isHerb = unit.typeId === "herb_hare";
      return {
        title: isHerb ? "Spec: Garden Starter" : "Spec: Syrup Start",
        body: `Battle start, adjacent allies: shield ${supportAmount(unit, syrupShield(unit))}; haste +${percentText(syrupHaste(unit))} for 2s.`,
      };
    }
    if (unit.ability === "slow") {
      const isTaffy = unit.typeId === "saltwater_taffy_otter";
      const isCucumber = unit.typeId === "cucumber_cobra";
      return {
        title: isTaffy ? "Spec: Taffy Bind" : isCucumber ? "Spec: Crisp Bind" : "Spec: Pretzel Bind",
        body: `Trigger hit. Target cooldown increases by ${pretzelDelay(unit)}s after damage.`,
      };
    }
    if (unit.ability === "pepper_dash") {
      return {
        title: "Spec: Pepper Poke",
        body: `Hit applies burn ${pepperBurnDamage(unit)}/s for ${statusDuration(unit, pepperBurnDuration(unit)).toFixed(1)}s. Burned or back-row target: damage +${pepperPokeBonus(unit)}.`,
      };
    }
    if (unit.ability === "armor_break") {
      const isBenedict = unit.typeId === "benedict_lobster";
      return {
        title: isBenedict ? "Spec: Brunch Breaker" : "Spec: Curry Breaker",
        body: `Damage +${armorBreakBonus(unit)} if target is front row, shielded, or has max HP >=115% of this unit.`,
      };
    }
    if (unit.ability === "bagel_build") {
      const isBao = unit.typeId === "bao_bun_badger";
      return {
        title: isBao ? "Spec: Bao Cart" : "Spec: Bagel Build",
        body: `Start adjacent: ${supportAmount(unit, Math.round(bagelBuildShield(unit) * 0.85))} shield, +${percentText(bagelBuildHaste(unit))} haste for 2s. Hit: 2 allies shield ${supportAmount(unit, bagelBuildShield(unit))}.`,
      };
    }
    if (unit.ability === "treat_income") {
      return {
        title: "Spec: Treat Income",
        body: `If alive when battle ends, next income payout gains +${donutTreatGold(unit)} coins.`,
      };
    }
    if (unit.ability === "status_spread") {
      const isChurro = unit.typeId === "churro_cheetah";
      const isViper = unit.typeId === "vinaigrette_viper";
      return {
        title: isChurro ? "Spec: Chili Sugar" : isViper ? "Spec: Sharp Dressing" : "Spec: Fermented Mark",
        body: `Hit applies burn ${kimchiBurnDamage(unit)}/s for ${statusDuration(unit, kimchiBurnDuration(unit)).toFixed(1)}s and mark +${percentText(kimchiMarkPct(unit))} damage for ${statusDuration(unit, kimchiMarkDuration(unit)).toFixed(1)}s. Statused target: +${kimchiStatusBonus(unit)} damage.`,
      };
    }
    if (unit.ability === "sticky_lane") {
      return {
        title: "Spec: Sticky Lane",
        body: `Trigger hit. Every enemy in target column gets cooldown +${waffleLaneDelay(unit)}s and slowed for ${statusDuration(unit, 1.4).toFixed(1)}s.`,
      };
    }
    if (unit.ability === "kernel_combo") {
      const isChip = unit.typeId === "hot_chip_hamster";
      return {
        title: isChip ? "Spec: Hot-Chip Crunch" : "Spec: Kernel Combo",
        body: `Each attack: +1 stack, max ${popcornMaxStacks(unit)}. Each stack gives +${popcornDamagePerStack(unit)} damage and +${percentText(popcornStackHaste(unit))} attack speed.`,
      };
    }
    if (unit.ability === "sour_aura") {
      return {
        title: "Spec: Sour Counter",
        body: `Hit: anti-support -${percentText(yogurtSourPct(unit))} for ${statusDuration(unit, yogurtSourDuration(unit)).toFixed(1)}s; attack slow ${unit.tier >= 3 ? "-16%" : "-10%"} for ${statusDuration(unit, unit.tier >= 3 ? 2 : 1.5).toFixed(1)}s. Shielded target: +${yogurtShieldCrackDamage(unit)} damage.`,
      };
    }
    if (unit.ability === "row_shield") {
      const isCaprese = unit.typeId === "caprese_capybara";
      return {
        title: isCaprese ? "Spec: Caprese Row" : "Spec: Row Guard",
        body: `Battle start row shield ${supportAmount(unit, Math.round(dumplingRowShield(unit) * 0.8))}. On hit, row shield ${supportAmount(unit, dumplingRowShield(unit))}.`,
      };
    }
    if (unit.ability === "cleanse") {
      return {
        title: "Spec: Citrus Cleanse",
        body: `Before attack: cleanse 1 ally, heal ${supportAmount(unit, lemonCleanseHeal(unit))}, shield ${supportAmount(unit, lemonCleanseShield(unit))}, haste +${percentText(lemonCleanseHaste(unit))} for 2.5s.`,
      };
    }
    if (unit.ability === "shakshuka_burn") {
      return {
        title: "Spec: Skillet Burn",
        body: `Hit applies burn ${shakshukaBurnDamage(unit)}/s for ${statusDuration(unit, shakshukaBurnDuration(unit)).toFixed(1)}s. Adjacent enemies take ${shakshukaSplashDamage(unit)} splash and 65% burn.`,
      };
    }
    if (unit.ability === "pull_start") {
      return {
        title: "Spec: Tentacle Pull",
        body: `Battle start: back-row enemy moves 1 column forward, takes ${krakenPullDamage(unit)} damage, cooldown +${krakenPullDelay(unit)}s, slowed ${statusDuration(unit, 1.6).toFixed(1)}s.`,
      };
    }
    if (unit.ability === "copy_luck") {
      return {
        title: "Spec: Fortune Copies",
        body: `Owned-line shop odds +${percentText(fortuneShopChance(unit))}. Tier 2+: this line counts as +1 phantom copy for its own merge.`,
      };
    }
    if (unit.ability === "survive_scale") {
      const storedShield = mochiAdjacentShield(unit);
      return {
        title: "Spec: Mochi Growth",
        body: `If alive when battle ends: permanent max HP +${mochiHpGain(unit)}. Tier 2+ start: adjacent shield ${storedShield > 0 ? supportAmount(unit, storedShield) : 0} from stored HP.`,
      };
    }
    if (unit.ability === "ginger_decoy") {
      return {
        title: "Spec: Crumble Decoy",
        body: `Battle start: summon decoy with ${gingerDecoyHp(unit)} HP. Decoy death: ${gingerCrumbleDamage(unit)} damage to adjacent enemies.`,
      };
    }
    if (unit.ability === "iceberg_lock") {
      return {
        title: "Spec: Iceberg Lock",
        body: `Start front enemies: cooldown +${oysterLockDelay(unit)}s. Hit: cooldown +${oysterLockDelay(unit)}s, attack speed -${percentText(oysterSlowPct(unit))}, self shield ${supportAmount(unit, oysterLockShield(unit))}.`,
      };
    }
    if (unit.ability === "pearl_stun") {
      return {
        title: "Spec: Tapioca Stun",
        body: `Every ${bobaStunEvery(unit)} attacks: target cooldown +${bobaStunDelay(unit)}s and attack speed -${percentText(bobaAttackSlow(unit))} for ${statusDuration(unit, bobaSlowDuration(unit)).toFixed(1)}s. Tier 3+: adjacent target gets 65% cooldown delay.`,
      };
    }
    return {
      title: "Spec: Front Pressure",
      body: "Target: front occupied enemy column. Units behind occupied front columns cannot be hit unless back-row targeting is active.",
    };
  }

  function drawStatRow(label, value, x, y) {
    ctx.fillStyle = "#6a4b35";
    ctx.font = "700 10px Inter, sans-serif";
    ctx.fillText(label, x, y - 16);
    ctx.fillStyle = "#16392d";
    ctx.font = "800 17px Inter, sans-serif";
    ctx.fillText(String(value), x, y);
  }

  function drawStatBar(x, y, w, h, pct, color) {
    roundedRect(x, y, w, h, 5);
    ctx.fillStyle = "rgba(22, 57, 45, 0.14)";
    ctx.fill();
    const fillWidth = Math.max(0, Math.min(w, w * pct));
    if (fillWidth <= 0) return;
    roundedRect(x, y, fillWidth, h, Math.min(5, fillWidth / 2));
    ctx.fillStyle = color;
    ctx.fill();
  }

  function wrapText(text, x, y, maxWidth, lineHeight) {
    wrappedTextLines(text, maxWidth).forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }

  function wrappedTextLines(text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function drawWrappedTextFull(text, x, y, maxWidth, lineHeight) {
    const lines = wrappedTextLines(text, maxWidth);
    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
    return lines.length;
  }

  function wrapTextLimited(text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(" ");
    let line = "";
    let lines = 0;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines += 1;
        if (lines >= maxLines) {
          fitText(`${line}...`, x, y, maxWidth, ctx.font, ctx.fillStyle);
          return;
        }
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    }
    if (line && lines < maxLines) ctx.fillText(line, x, y);
  }

  function fitText(text, x, y, maxWidth, font, color) {
    ctx.fillStyle = color;
    ctx.font = font;
    if (ctx.measureText(text).width <= maxWidth) {
      ctx.fillText(text, x, y);
      return;
    }
    let clipped = text;
    while (clipped.length > 3 && ctx.measureText(`${clipped}...`).width > maxWidth) {
      clipped = clipped.slice(0, -1);
    }
    ctx.fillText(`${clipped}...`, x, y);
  }

  function drawBattle(battle = visibleBattle()) {
    if (!battle) return;
    drawBattleFieldBackdrop();
    ctx.fillStyle = "rgba(22, 57, 45, 0.14)";
    ctx.fillRect(BATTLE_FIELD.dividerX, BATTLE_FIELD.dividerTop, 3, BATTLE_FIELD.dividerHeight);

    drawBattleGrid("ally");
    drawBattleGrid("enemy");
    drawBattleDrinkSlots("ally", battle.allyDrinks || state.drinks);
    drawBattleDrinkSlots("enemy", battle.enemyDrinks || []);
    [...battle.allies, ...battle.enemies].forEach((unit) => {
      if (unit.dead) {
        drawBattleDefeatStill(unit);
      } else {
        drawBattleUnit(unit);
      }
    });
    battle.attacks.forEach((attack) => drawAttackProjectile(attack, battle));
    (battle.drinkTosses || []).forEach((toss) => drawDrinkToss(toss, battle));
    drawBattleMoldPanel(battle);
    drawArenaBattlePanel();
  }

  function drawBattleFieldBackdrop() {
    const image = getUiSprite(BATTLE_FIELD_BG_SRC);
    roundedRect(BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h, 8);
    if (image && image.complete && image.naturalWidth > 0) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(image, BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h);
      ctx.restore();
      roundedRect(BATTLE_FIELD.x, BATTLE_FIELD.y, BATTLE_FIELD.w, BATTLE_FIELD.h, 8);
      ctx.strokeStyle = "rgba(22, 31, 27, 0.34)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.lineWidth = 1;
      return;
    }
    ctx.fillStyle = "rgba(252, 248, 218, 0.55)";
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.18)";
    ctx.stroke();
  }

  function drawAttackProjectile(attack, battle) {
    const units = [...battle.allies, ...battle.enemies];
    const from = units.find((u) => u.uid === attack.from);
    const to = units.find((u) => u.uid === attack.to);
    if (!from || !to) return;

    const duration = attack.duration || ATTACK_ANIMATION_SECONDS;
    const progress = clamp01(1 - attack.t / duration);
    const eased = 1 - (1 - progress) ** 2;
    const x = from.x + (to.x - from.x) * eased;
    const y = from.y + (to.y - from.y) * eased - Math.sin(progress * Math.PI) * 18;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    const mirrorLeft = dx < 0;

    const image = getAttackParticleSprite(attack.particleType);
    const size = ATTACK_PROJECTILE_SIZE + Math.min(4, from.tier || 1) * 5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(mirrorLeft ? angle - Math.PI : angle);
    if (mirrorLeft) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = Math.min(1, 0.25 + progress * 1.35);
    if (image && image.complete && image.naturalWidth) {
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      const chip = Math.max(9, Math.round(size * 0.22));
      roundedRect(-chip / 2, -chip / 2, chip, chip, 3);
      ctx.fillStyle = attack.color || "#f0d56b";
      ctx.fill();
      ctx.strokeStyle = "#fff9df";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drawDrinkToss(toss, battle) {
    const units = [...battle.allies, ...battle.enemies];
    const to = units.find((u) => u.uid === toss.to);
    if (!to) return;

    const duration = toss.duration || DRINK_TOSS_ANIMATION_SECONDS;
    const progress = clamp01(1 - toss.t / duration);
    const eased = 1 - (1 - progress) ** 2;
    const x = toss.fromX + (to.x - toss.fromX) * eased;
    const y = toss.fromY + (to.y - toss.fromY) * eased - Math.sin(progress * Math.PI) * DRINK_TOSS_ARC_HEIGHT;
    const scale = 0.88 + Math.sin(progress * Math.PI) * 0.12;
    const image = getDrinkThrowableSprite(toss.id);
    const size = DRINK_TOSS_PROJECTILE_SIZE * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = Math.min(1, 0.28 + progress * 1.25);
    if (image && image.complete && image.naturalWidth) {
      ctx.drawImage(image, -size / 2, -size / 2, size, size);
    } else {
      roundedRect(-size / 4, -size / 4, size / 2, size / 2, 4);
      ctx.fillStyle = toss.color || "#7ec7e8";
      ctx.fill();
      ctx.strokeStyle = "#fff9df";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function drinkTossImpact(toss, battle) {
    if (!toss || !battle) return;
    const units = [...battle.allies, ...battle.enemies];
    const target = units.find((u) => u.uid === toss.to);
    if (!target) return;
    burst({ x: target.x, y: target.y - 4 }, toss.color || "#7ec7e8", {
      food: true,
      particleSprite: "drink",
      particleType: toss.id,
      count: DRINK_TOSS_IMPACT_PARTICLES,
      spread: 14,
      life: 0.46,
      speedMin: 70,
      speedMax: 165,
      sizeMin: 13,
      sizeMax: 23,
    });
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function drawBattleGrid(side) {
    const battle = visibleBattle();
    const units = battle ? (side === "ally" ? battle.allies : battle.enemies) : [];
    for (let i = 0; i < boardSlots.length; i++) {
      const { x, y } = battleSlotPosition(side, i);
      const { col } = slotGrid(i);
      const cell = BATTLE_FORMATION.cellSize;
      const occupied = units.some((unit) => unit.slot === i);
      const hasArtBackdrop = drawDecoratedSlotBackdrop(x, y, cell, cell, "board");
      roundedRect(x - cell / 2, y - cell / 2, cell, cell, 8);
      if (!hasArtBackdrop) {
        ctx.fillStyle = col === FRONT_COL ? "rgba(255, 245, 204, 0.24)" : "rgba(255, 253, 232, 0.16)";
        ctx.fill();
      }
      ctx.strokeStyle = hasArtBackdrop ? "transparent" : "rgba(22, 57, 45, 0.12)";
      ctx.stroke();
      if (occupied) continue;
    }
  }

  function battleDrinkSlotPosition(side, slot) {
    if (slot.axis === "row") {
      return {
        x: side === "ally"
          ? BATTLE_FORMATION.allyBaseX - BATTLE_FORMATION.colGap
          : BATTLE_FORMATION.enemyBaseX + BATTLE_FORMATION.colGap,
        y: BATTLE_FORMATION.topY + slot.targetIndex * BATTLE_FORMATION.rowGap,
      };
    }
    return {
      x: side === "ally"
        ? BATTLE_FORMATION.allyBaseX + slot.targetIndex * BATTLE_FORMATION.colGap
        : BATTLE_FORMATION.enemyBaseX - slot.targetIndex * BATTLE_FORMATION.colGap,
      y: BATTLE_FORMATION.topY + BOARD_ROWS * BATTLE_FORMATION.rowGap,
    };
  }

  function drawBattleDrinkSlots(side, drinks) {
    const battle = visibleBattle();
    drinkSlots.forEach((slot, index) => {
      const item = drinks[index];
      const { x, y } = battleDrinkSlotPosition(side, slot);
      const size = BATTLE_DRINK_SLOT_SIZE;
      const hasArtBackdrop = drawDecoratedSlotBackdrop(x, y, size, size, "drinks");
      roundedRect(x - size / 2, y - size / 2, size, size, 7);
      if (!item && !hasArtBackdrop) {
        ctx.fillStyle = "rgba(242, 237, 210, 0.62)";
        ctx.fill();
      }
      if (!item) {
        ctx.strokeStyle = hasArtBackdrop ? "transparent" : "rgba(22, 57, 45, 0.18)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      if (item) {
        drawBattleDrinkIcon(item, x, y, BATTLE_DRINK_ICON_RADIUS, battle);
        drawUpgradeStars(itemTier(item.tier), x, y + size / 2 - 5, 6, "center");
      }
    });
  }

  function drawBattleDrinkIcon(item, x, y, r, battle) {
    const motion = drinkPulseMotion(item, battle);
    ctx.save();
    ctx.translate(x, y + motion.y);
    ctx.scale(motion.scaleX, motion.scaleY);
    drawItemIcon(item, 0, 0, r, { centerOpaque: true, opaqueAnchorY: DRINK_COASTER_OPAQUE_ANCHOR_Y });
    ctx.restore();
  }

  function drinkPulseMotion(item, battle) {
    const start = item?.drinkPulseAnimStart;
    if (typeof start !== "number" || !battle) return { y: 0, scaleX: 1, scaleY: 1 };
    const t = (battle.elapsed - start) / DRINK_PULSE_ANIMATION_SECONDS;
    if (t < 0 || t >= 1) return { y: 0, scaleX: 1, scaleY: 1 };

    const compress = Math.sin(clamp01(t / 0.26) * Math.PI);
    const springT = clamp01((t - 0.18) / 0.82);
    const hop = Math.sin(springT * Math.PI);
    const rebound = Math.sin(springT * Math.PI * 3) * (1 - springT);
    return {
      y: compress * 2 - hop * DRINK_PULSE_HOP_PIXELS,
      scaleX: 1 + compress * 0.1 - rebound * 0.035,
      scaleY: 1 - compress * 0.12 + rebound * 0.055,
    };
  }

  function drawBattleUnit(unit) {
    const radius = 28 + unit.tier * 4;
    drawUnitStatusFlashes(unit, unit.x, unit.y, radius);
    drawFoodAnimal(unit, unit.x, unit.y, radius, unit.side === "ally");
    drawUnitStatusGlyphs(unit, unit.x, unit.y, radius);
    const baseBarRows = drawBattleBaseBars(unit, radius);
    drawUpgradeStars(unit.tier, unit.x, unit.y + radius + 14 + baseBarRows * 8, 10, "center");
    ctx.textAlign = "left";
  }

  function drawBattleBaseBars(unit, r) {
    const shieldPct = unit.shield > 0 ? clamp(unit.shield / Math.max(1, unit.maxHp * 0.5), 0.08, 1) : 0;
    const hpPct = clamp01(unit.hp / Math.max(1, unit.maxHp));
    const healthVisible = hpPct < 0.995;
    let rows = 0;
    if (shieldPct > 0) {
      drawBattleBaseBar(unit.x, unit.y + r + 5, shieldPct, "#5aa6d6", "rgba(220, 244, 252, 0.8)");
      rows += 1;
    }
    if (healthVisible) {
      const y = unit.y + r + 5 + rows * 8;
      drawBattleBaseBar(unit.x, y, hpPct, hpPct > 0.45 ? "#4a9e68" : "#d9573c", "rgba(255, 249, 224, 0.78)");
      if (hpPct <= 0.28) {
        const time = visibleBattle()?.elapsed || 0;
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(time * 7.5) * 0.18;
        ctx.strokeStyle = "#d9573c";
        ctx.lineWidth = 2;
        roundedRect(unit.x - 27, y - 2, 54, 9, 5);
        ctx.stroke();
        ctx.restore();
      }
      rows += 1;
    }
    return rows;
  }

  function drawBattleBaseBar(centerX, y, pct, color, bgColor) {
    const bw = 50;
    const bh = 5;
    const x = centerX - bw / 2;
    const fillWidth = clamp(bw * pct, 0, bw);

    ctx.save();
    roundedRect(x, y, bw, bh, 3);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 57, 45, 0.34)";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (fillWidth > 0) {
      roundedRect(x, y, fillWidth, bh, Math.min(3, fillWidth / 2));
      ctx.fillStyle = color;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBattleDefeatStill(unit) {
    const image = getDefeatStillSprite(unit);
    if (!(image && image.complete && image.naturalWidth > 0)) return;
    const radius = 28 + unit.tier * 4;
    const size = Math.round(radius * 2.7);
    const y = unit.y + radius * 0.08;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 0.86;
    ctx.drawImage(image, Math.round(unit.x - size / 2), Math.round(y - size / 2), size, size);
    ctx.restore();
    ctx.imageSmoothingEnabled = true;
  }

  function activeStatusEffects(unit) {
    const effects = [];
    if (unit.burn) effects.push({ id: "burn", ...STATUS_EFFECT_STYLES.burn });
    if (unit.mark) effects.push({ id: "mark", ...STATUS_EFFECT_STYLES.mark });
    if (unit.teamVulnerable) effects.push({ id: "teamVulnerable", ...STATUS_EFFECT_STYLES.teamVulnerable });
    if (unit.haste) effects.push({ id: "haste", ...STATUS_EFFECT_STYLES.haste });
    if (unit.attackBoost) effects.push({ id: "attackBoost", ...STATUS_EFFECT_STYLES.attackBoost });
    if (unit.attackSlow) effects.push({ id: "attackSlow", ...STATUS_EFFECT_STYLES.attackSlow });
    if (unit.antiSupport) effects.push({ id: "antiSupport", ...STATUS_EFFECT_STYLES.antiSupport });
    if (unit.slowed) effects.push({ id: "slowed", ...STATUS_EFFECT_STYLES.slowed });
    if (unit.lateFightStacks > 0) effects.push({ id: "lateFightStacks", ...STATUS_EFFECT_STYLES.lateFightStacks });
    if (unit.moldStacks > 0) effects.push({ id: "mold", ...STATUS_EFFECT_STYLES.mold });
    return effects;
  }

  function drawUnitStatusFlashes(unit, x, y, r) {
    const effects = activeStatusEffects(unit).filter((effect) => effect.id !== "burn");
    if (!effects.length) return;
    const time = visibleBattle()?.elapsed || 0;
    effects.slice(0, 4).forEach((effect, index) => {
      const pulse = 0.5 + Math.sin(time * 5.4 + index * 1.7) * 0.5;
      ctx.save();
      ctx.globalAlpha = 0.16 + pulse * 0.13;
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(x, y + 2, r * 1.08 + index * 3 + pulse * 4, r * 0.78 + index * 2 + pulse * 3, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.12 + pulse * 0.1;
      ctx.fillStyle = effect.color;
      ctx.beginPath();
      ctx.ellipse(x, y + 6, r * 0.88 + pulse * 4, r * 0.48 + pulse * 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawUnitStatusGlyphs(unit, x, y, r) {
    const effects = activeStatusEffects(unit);
    if (!effects.length) return;
    const time = visibleBattle()?.elapsed || 0;
    const count = effects.length;
    effects.forEach((effect, index) => {
      const angle = -Math.PI / 4 + (index / count) * Math.PI * 2;
      const pulse = 0.5 + Math.sin(time * 6.2 + index * 1.1) * 0.5;
      const distance = r + 10 + pulse * 5;
      drawStatusGlyph(effect, x + Math.cos(angle) * distance, y + Math.sin(angle) * (distance * 0.74), 13 + pulse * 2);
    });
  }

  function drawStatusGlyph(effect, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "rgba(255, 253, 232, 0.82)";
    ctx.strokeStyle = "rgba(22, 57, 45, 0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const sprite = getStatusEffectSprite(effect.id);
    if (sprite?.complete && sprite.naturalWidth) {
      const imageSize = size * 2.28;
      const smoothing = ctx.imageSmoothingEnabled;
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, -imageSize / 2, -imageSize / 2, imageSize, imageSize);
      ctx.imageSmoothingEnabled = smoothing;
      ctx.restore();
      return;
    }

    ctx.fillStyle = effect.color;
    ctx.strokeStyle = "#fff9df";
    ctx.lineWidth = 2;

    if (effect.kind === "flame") {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.8, -size * 0.2, size * 0.3, size * 0.75);
      ctx.quadraticCurveTo(0, size * 1.05, -size * 0.45, size * 0.6);
      ctx.quadraticCurveTo(-size * 0.9, -size * 0.15, 0, -size);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.arc(size * 0.12, size * 0.3, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "target") {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "chevron") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 4;
      for (let i = 0; i < 2; i++) {
        const yy = i * size * 0.45 - size * 0.25;
        ctx.beginPath();
        ctx.moveTo(-size * 0.65, yy + size * 0.32);
        ctx.lineTo(0, yy - size * 0.28);
        ctx.lineTo(size * 0.65, yy + size * 0.32);
        ctx.stroke();
      }
    } else if (effect.kind === "burst") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * size * 0.25, Math.sin(a) * size * 0.25);
        ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
        ctx.stroke();
      }
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "down") {
      ctx.fillStyle = effect.color;
      roundedRect(-size * 0.24, -size, size * 0.48, size * 1.15, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-size * 0.72, size * 0.1);
      ctx.lineTo(0, size);
      ctx.lineTo(size * 0.72, size * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (effect.kind === "brokenPlus") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-size * 0.75, 0);
      ctx.lineTo(-size * 0.18, 0);
      ctx.moveTo(size * 0.18, 0);
      ctx.lineTo(size * 0.75, 0);
      ctx.moveTo(0, -size * 0.75);
      ctx.lineTo(0, -size * 0.18);
      ctx.moveTo(0, size * 0.18);
      ctx.lineTo(0, size * 0.75);
      ctx.stroke();
      ctx.strokeStyle = effect.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size * 0.45, -size * 0.45);
      ctx.lineTo(size * 0.45, size * 0.45);
      ctx.stroke();
    } else if (effect.kind === "vine") {
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.65, Math.PI * 0.25, Math.PI * 1.65);
      ctx.stroke();
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.ellipse(-size * 0.38, -size * 0.08, size * 0.28, size * 0.16, -0.6, 0, Math.PI * 2);
      ctx.ellipse(size * 0.34, size * 0.12, size * 0.28, size * 0.16, 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.kind === "crown") {
      ctx.fillStyle = effect.color;
      ctx.beginPath();
      ctx.moveTo(-size, size * 0.5);
      ctx.lineTo(-size * 0.7, -size * 0.45);
      ctx.lineTo(-size * 0.22, size * 0.12);
      ctx.lineTo(0, -size * 0.65);
      ctx.lineTo(size * 0.22, size * 0.12);
      ctx.lineTo(size * 0.7, -size * 0.45);
      ctx.lineTo(size, size * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (effect.kind === "mold") {
      ctx.fillStyle = effect.color;
      ctx.beginPath();
      ctx.arc(-size * 0.36, size * 0.18, size * 0.32, 0, Math.PI * 2);
      ctx.arc(size * 0.08, -size * 0.1, size * 0.42, 0, Math.PI * 2);
      ctx.arc(size * 0.48, size * 0.26, size * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = effect.accent;
      ctx.beginPath();
      ctx.arc(-size * 0.08, size * 0.2, size * 0.1, 0, Math.PI * 2);
      ctx.arc(size * 0.32, -size * 0.02, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawParticles() {
    state.particles.forEach((p) => {
      const alpha = Math.max(0, p.life / (p.maxLife || 0.45));
      ctx.globalAlpha = alpha;
      if (p.foodParticles) {
        const image = p.particleSprite === "drink"
          ? getDrinkThrowableSprite(p.particleType)
          : p.particleSprite === "item"
            ? getItemSprite({ id: p.particleType, tier: p.particleTier })
            : getAttackParticleSprite(p.particleType);
        const size = (p.size || 24) * (0.75 + alpha * 0.35);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.imageSmoothingEnabled = false;
        if (image && image.complete && image.naturalWidth) {
          ctx.drawImage(image, -size / 2, -size / 2, size, size);
        } else {
          roundedRect(-size / 4, -size / 4, size / 2, size / 2, 3);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.strokeStyle = "#fff9df";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
        ctx.imageSmoothingEnabled = true;
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  function pointInRect(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  function shopFreezeRect(x, y, w, h) {
    return { x: x + w / 2 - 23, y: y - h / 2 + 6, w: 18, h: 20 };
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * W,
      y: ((event.clientY - rect.top) / rect.height) * H,
    };
  }

  function hitTest(pos) {
    if (state.codexOpen) return hitTestCodex(pos);
    if (state.phase === "prep") {
      if (pointInRect(pos.x, pos.y, SHOPKEEPER_DISPLAY.codexButton)) return { area: "codexButton", index: 0 };
      if (pointInRect(pos.x, pos.y, buttons.shopUpgrade)) return { area: "button", index: "shopUpgrade" };
      if (pointInRect(pos.x, pos.y, buttons.roll)) return { area: "button", index: "roll" };
      if (pointInRect(pos.x, pos.y, buttons.battle)) return { area: "button", index: "battle" };
      const selectedRef = getSelectedRef();
      if (selectedEquipmentTargetRef() && pointInRect(pos.x, pos.y, equipmentSlotRect())) return { area: "equipment", index: 0 };
      if (
        selectedRef &&
        (
          (isUnit(selectedRef.entry) && (selectedRef.area === "bench" || selectedRef.area === "board")) ||
          (isTopping(selectedRef.entry) && (selectedRef.area === "bench" || selectedRef.area === "itemBench")) ||
          (isDrink(selectedRef.entry) && (selectedRef.area === "bench" || selectedRef.area === "itemBench" || selectedRef.area === "drinks"))
        ) &&
        pointInRect(pos.x, pos.y, selectedSellButton(selectedRef))
      ) {
        return { area: "button", index: "sell" };
      }
      if (
        selectedRef &&
        isUnit(selectedRef.entry) &&
        selectedRef.entry.item &&
        (selectedRef.area === "bench" || selectedRef.area === "board") &&
        pointInRect(pos.x, pos.y, selectedDetachButton(selectedRef))
      ) {
        return { area: "button", index: "detach" };
      }
      if (state.drag && canSellDrag(state.drag) && pointInRect(pos.x, pos.y, shopkeeperSellTargetRect())) {
        return { area: "keeperSell", index: 0 };
      }
      for (let i = 0; i < shopSlots.length; i++) {
        const s = shopSlots[i];
        if (!isShopSlotUnlocked(i) && Math.abs(pos.x - s.x) <= SHOP_SLOT_W / 2 && Math.abs(pos.y - s.y) <= SHOP_SLOT_H / 2) {
          return { area: "shopUnlock", index: i };
        }
        if (state.shop[i] && pointInRect(pos.x, pos.y, shopFreezeRect(s.x, s.y, SHOP_SLOT_W, SHOP_SLOT_H))) {
          return { area: "shopFreeze", index: i };
        }
        if (Math.abs(pos.x - s.x) <= SHOP_SLOT_W / 2 && Math.abs(pos.y - s.y) <= SHOP_SLOT_H / 2) return { area: "shop", index: i };
      }
      for (let i = 0; i < boardSlots.length; i++) {
        const s = boardSlots[i];
        if (Math.abs(pos.x - s.x) <= 36 && Math.abs(pos.y - s.y) <= 36) return { area: "board", index: i };
      }
      for (let i = 0; i < drinkSlots.length; i++) {
        const s = drinkSlots[i];
        if (Math.abs(pos.x - s.x) <= DRINK_SLOT_SIZE / 2 && Math.abs(pos.y - s.y) <= DRINK_SLOT_SIZE / 2) return { area: "drinks", index: i };
      }
      for (let i = 0; i < itemBenchSlots.length; i++) {
        const s = itemBenchSlots[i];
        if (Math.abs(pos.x - s.x) <= ITEM_BENCH_SLOT_SIZE / 2 && Math.abs(pos.y - s.y) <= ITEM_BENCH_SLOT_SIZE / 2) return { area: "itemBench", index: i };
      }
      for (let i = 0; i < benchSlots.length; i++) {
        const s = benchSlots[i];
        if (Math.abs(pos.x - s.x) <= 36 && Math.abs(pos.y - s.y) <= 36) return { area: "bench", index: i };
      }
    }
    if (state.phase === "battle" && pointInRect(pos.x, pos.y, buttons.battleSpeed)) {
      return { area: "button", index: "battleSpeed" };
    }
    if (state.phase === "result" && state.hearts <= 0 && pointInRect(pos.x, pos.y, buttons.next)) {
      return { area: "button", index: "next" };
    }
    if (state.phase === "result" && state.rewardChoices?.length) {
      for (let i = 0; i < state.rewardChoices.length; i++) {
        if (pointInRect(pos.x, pos.y, buttons[`reward${i}`])) return { area: "button", index: `reward${i}` };
      }
    }
    return null;
  }

  function onPointerDown(event) {
    const pos = canvasPoint(event);
    state.pointer = pos;
    const hit = hitTest(pos);
    if (!hit) {
      state.selected = null;
      return;
    }
    if (hit.area === "button") {
      if (hit.index === "shopUpgrade") upgradeShop();
      if (hit.index === "roll") refreshShop(false);
      if (hit.index === "battle") startBattle();
      if (hit.index === "battleSpeed") cycleBattleSpeed();
      if (hit.index === "next") continuePrep();
      if (String(hit.index).startsWith("reward")) applyRewardChoice(Number(String(hit.index).slice(6)));
      if (hit.index === "sell") {
        const selectedRef = getSelectedRef();
        if (selectedRef && isItem(selectedRef.entry)) sellSelectedItem();
        else sellSelectedUnit();
      }
      if (hit.index === "detach") detachSelectedItem();
      return;
    }
    if (hit.area === "codexButton") {
      state.codexOpen = true;
      state.codexSelectedId = state.codexSelectedId || CATALOG[0]?.id || null;
      state.codexSelectedToppingId = state.codexSelectedToppingId || codexToppings()[0]?.id || null;
      state.codexSelectedDrinkId = state.codexSelectedDrinkId || codexDrinks()[0]?.id || null;
      syncCodexSelectionToVisibleEntry();
      state.selected = null;
      state.message = "Food menu";
      event.preventDefault();
      return;
    }
    if (hit.area === "codexTab") {
      const tab = CODEX_TABS[hit.index];
      if (tab) {
        state.codexTab = tab.id;
        if (tab.id !== "food") state.codexSelectedFormTier = 1;
        state.codexSelectedItemTier = 1;
        state.codexSelectedId = state.codexSelectedId || CATALOG[0]?.id || null;
        state.codexSelectedToppingId = state.codexSelectedToppingId || codexToppings()[0]?.id || null;
        state.codexSelectedDrinkId = state.codexSelectedDrinkId || codexDrinks()[0]?.id || null;
        syncCodexSelectionToVisibleEntry();
        state.message = tab.label;
      }
      event.preventDefault();
      return;
    }
    if (hit.area === "codexFilter") {
      setCodexFilter(hit.key, hit.value);
      event.preventDefault();
      return;
    }
    if (hit.area === "codexEntry") {
      const entry = codexEntries()[hit.index];
      if (state.codexTab === "toppings") {
        state.codexSelectedToppingId = entry?.id || state.codexSelectedToppingId;
        state.codexSelectedItemTier = 1;
      } else if (state.codexTab === "drinks") {
        state.codexSelectedDrinkId = entry?.id || state.codexSelectedDrinkId;
        state.codexSelectedItemTier = 1;
      } else {
        state.codexSelectedId = entry?.id || state.codexSelectedId;
        state.codexSelectedFormTier = 1;
      }
      state.message = entry?.short || entry?.name || "Food menu";
      event.preventDefault();
      return;
    }
    if (hit.area === "codexForm") {
      const animal = currentCodexEntry();
      const maxTier = Math.min(4, animal?.forms?.length || 1);
      if (hit.index >= maxTier) {
        state.codexSelectedFormTier = 0;
        state.message = "Meal";
        event.preventDefault();
        return;
      }
      state.codexSelectedFormTier = Math.max(1, Math.min(maxTier, hit.index + 1));
      const form = animal.forms?.[state.codexSelectedFormTier - 1];
      state.message = form?.short || form?.name || "Food menu";
      event.preventDefault();
      return;
    }
    if (hit.area === "codexItemForm") {
      const entry = currentCodexEntry();
      state.codexSelectedItemTier = Math.max(1, Math.min(MAX_ITEM_TIER, hit.index + 1));
      state.message = `${entry?.short || entry?.name || "Item"} Lv ${state.codexSelectedItemTier}`;
      event.preventDefault();
      return;
    }
    if (hit.area === "codexClose") {
      state.codexOpen = false;
      state.message = "Prep";
      event.preventDefault();
      return;
    }
    if (hit.area === "codex") {
      event.preventDefault();
      return;
    }
    if (hit.area === "shopFreeze") {
      toggleShopFreeze(hit.index);
      event.preventDefault();
      return;
    }
    if (hit.area === "shopUnlock") {
      purchaseShopSlot(hit.index);
      event.preventDefault();
      return;
    }
    if (hit.area === "equipment") {
      startEquipmentDrag(pos);
      if (state.drag) canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      return;
    }
    if (hit.area === "shop") {
      startShopDrag(hit.index, pos);
      if (state.drag) canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
      return;
    }
    if (hit.area === "bench" || hit.area === "itemBench" || hit.area === "board" || hit.area === "drinks") {
      if (state[hit.area][hit.index]) {
        startUnitDrag(hit.area, hit.index, pos);
        if (state.drag) canvas.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      } else {
        selectFrom(hit.area, hit.index);
      }
    }
  }

  function onPointerMove(event) {
    const pos = canvasPoint(event);
    state.pointer = pos;
    const hit = hitTest(pos);
    if (state.drag) {
      updateDrag(pos, hit);
      event.preventDefault();
      return;
    }
    state.hover = hit && hit.area !== "button" ? hit : null;
  }

  function onPointerUp(event) {
    if (!state.drag) return;
    const pos = canvasPoint(event);
    state.pointer = pos;
    const hit = hitTest(pos);
    finishDrag(hit);
    state.hover = hit && hit.area !== "button" ? hit : null;
    canvas.releasePointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function onPointerCancel(event) {
    state.pointer = null;
    if (!state.drag) return;
    state.drag = null;
    state.message = "Cancelled";
    canvas.releasePointerCapture?.(event.pointerId);
  }

  function onPointerLeave() {
    state.pointer = null;
    state.hover = null;
  }

  function startShopDrag(index, pos) {
    const unit = state.shop[index];
    const equipmentTarget = selectedEquipmentTargetRef();
    if (!isShopSlotUnlocked(index)) {
      state.message = "Open slot first";
      return;
    }
    if (!unit) {
      state.message = "Empty shop";
      return;
    }
    const cost = purchaseCost(unit, index);
    if (state.gold < cost) {
      state.selected = { area: "shop", index };
      state.message = "Need gold";
      return;
    }
    if (isItem(unit) && !hasShopItemTarget(unit)) {
      state.selected = { area: "shop", index };
      state.message = "No item target";
      return;
    }
    if (!(isTopping(unit) && equipmentTarget)) state.selected = null;
    state.drag = {
      area: "shop",
      index,
      unit,
      equipmentTarget,
      startX: pos.x,
      startY: pos.y,
      x: pos.x,
      y: pos.y,
      moved: false,
      over: null,
      valid: false,
    };
    state.message = isDrink(unit) ? "Drag to drink rail" : isItem(unit) ? "Drag to animal" : "Drag to grid";
  }

  function startUnitDrag(area, index, pos) {
    const unit = state[area]?.[index];
    if (!unit) return;
    const equipmentTarget = selectedEquipmentTargetRef();
    if (!(isTopping(unit) && equipmentTarget)) state.selected = { area, index };
    state.drag = {
      area,
      index,
      unit,
      equipmentTarget,
      startX: pos.x,
      startY: pos.y,
      x: pos.x,
      y: pos.y,
      moved: false,
      over: null,
      valid: false,
    };
    state.message = isDrink(unit) ? "Drag to drink rail" : isItem(unit) ? "Top an animal" : area === "bench" ? "Drag to board" : "Drag to slot";
  }

  function startEquipmentDrag(pos) {
    const source = selectedEquipmentTargetRef();
    if (!source?.unit?.item) {
      state.message = "Drop topping here";
      return;
    }
    state.drag = {
      area: "equipment",
      index: 0,
      unit: source.unit.item,
      equipmentTarget: { area: source.area, index: source.index },
      startX: pos.x,
      startY: pos.y,
      x: pos.x,
      y: pos.y,
      moved: false,
      over: null,
      valid: false,
    };
    state.message = "Drag topping out";
  }

  function updateDrag(pos, hit) {
    const dx = pos.x - state.drag.startX;
    const dy = pos.y - state.drag.startY;
    state.drag.x = pos.x;
    state.drag.y = pos.y;
    state.drag.moved = state.drag.moved || dx * dx + dy * dy > 64;
    state.drag.over = hit && isPotentialDropTarget(state.drag, hit.area, hit.index) ? hit : null;
    state.drag.valid = Boolean(state.drag.over && canDropDrag(state.drag, state.drag.over.area, state.drag.over.index));
    state.hover = state.drag.over;
  }

  function finishDrag(hit) {
    const drag = state.drag;
    state.drag = null;
    if (!drag) return;
    if (!drag.moved && hit?.area === drag.area && hit.index === drag.index) {
      if (drag.area === "equipment") {
        const source = selectedEquipmentTargetRef(drag);
        if (source?.unit?.item) {
          state.selected = { area: source.area, index: source.index };
          state.message = "Equipped";
        }
        return;
      }
      if (drag.area === "bench" || drag.area === "itemBench" || drag.area === "board" || drag.area === "shop" || drag.area === "drinks") {
        selectFrom(drag.area, drag.index);
        if (state.selected) state.message = "Inspecting";
      } else {
        state.message = "Drop on bench";
      }
      return;
    }
    if (drag.area === "shop") {
      if (!hit || !isPotentialDropTarget(drag, hit.area, hit.index)) {
        state.message = isDrink(drag.unit) ? "Drop on drink rail" : isItem(drag.unit) ? "Drop on animal" : "Drop on grid";
        return;
      }
      if (isItem(drag.unit) && isUnit(state[hit.area]?.[hit.index])) {
        buyShopItemToAnimal(drag.index, hit.area, hit.index);
        return;
      }
      if (hit.area === "equipment") {
        buyShopItemToEquipment(drag.index);
        return;
      }
      buyShopToSlot(drag.index, hit.area, hit.index);
      return;
    }
    if (hit?.area === "keeperSell") {
      sellDraggedEntry(drag);
      return;
    }
    if (!hit || !isPotentialDropTarget(drag, hit.area, hit.index)) {
      state.message = isDrink(drag.unit) ? "Drop on drink rail" : isItem(drag.unit) ? "Drop on animal" : drag.area === "bench" ? "Drop on board" : "Drop on slot";
      return;
    }
    if (!canDropDrag(drag, hit.area, hit.index)) {
      state.message = isItem(drag.unit) ? "Target unavailable" : "Spot full";
      return;
    }
    if (isItemStorageArea(drag.area) && isItemStorageArea(hit.area)) {
      moveUnitToOpenSlot(drag.area, drag.index, hit.area, hit.index);
      return;
    }
    if (hit.area === "equipment") {
      attachItemFromBenchToEquipment(drag.index, drag.area, drag);
      return;
    }
    if (drag.area === "equipment" && (hit.area === "bench" || hit.area === "board") && isUnit(state[hit.area]?.[hit.index])) {
      moveEquippedItemToAnimal(hit.area, hit.index);
      return;
    }
    if (drag.area === "equipment" && isItemStorageArea(hit.area)) {
      moveEquippedItemToStorage(hit.area, hit.index);
      return;
    }
    if (isItem(drag.unit) && isUnit(state[hit.area]?.[hit.index])) {
      attachItemFromStorage(drag.area, drag.index, hit.area, hit.index);
      return;
    }
    moveUnitToOpenSlot(drag.area, drag.index, hit.area, hit.index);
  }

  function onKeyDown(event) {
    if (event.key.toLowerCase() === "f") {
      if (!document.fullscreenElement) canvas.requestFullscreen?.();
      else document.exitFullscreen?.();
    }
    if (event.key === "Escape") {
      if (state.codexOpen) {
        state.codexOpen = false;
        state.message = "Prep";
        event.preventDefault();
        return;
      }
      state.selected = null;
    }
    if (event.key === " " && state.phase === "prep") {
      event.preventDefault();
      startBattle();
    }
    if (event.key.toLowerCase() === "r" && state.phase === "prep") {
      refreshShop(false);
    }
    if (event.key.toLowerCase() === "u" && state.phase === "prep") {
      upgradeShop();
    }
    if (event.key.toLowerCase() === "s" && state.phase === "battle") {
      cycleBattleSpeed();
    }
  }

  function gameLoop(now) {
    const dt = Math.min(0.05, ((now || 0) - state.lastTime) / 1000 || 1 / 60);
    state.lastTime = now || 0;
    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
  }

  function renderGameToText() {
    const rarityWeights = currentShopRarityWeights();
    const rarityOdds = shopRarityOdds();
    const enemyPreview = state.phase === "prep" ? ensureEnemyPreview() : state.enemyPreview?.units || [];
    const shownBattle = visibleBattle();
    const enemyDrinks = shownBattle ? shownBattle.enemyDrinks || [] : enemyPreviewDrinks();
    const battle = shownBattle
      ? {
          elapsed: Number(shownBattle.elapsed.toFixed(2)),
          arena: shownBattle.arena,
          enemyPlan: shownBattle.enemyPlan,
          mold: moldStateText(shownBattle),
          traitLevels: shownBattle.traitLevels,
          allies: shownBattle.allies
            .filter((u) => !u.dead)
            .map((u) => unitText(u, true)),
          enemies: shownBattle.enemies
            .filter((u) => !u.dead)
            .map((u) => unitText(u, true)),
          allyDrinks: (shownBattle.allyDrinks || []).map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
          enemyDrinks: (shownBattle.enemyDrinks || []).map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
          attacks: shownBattle.attacks.map((attack) => ({
            from: attack.from,
            to: attack.to,
            kind: attack.kind || "damage",
            particleType: attack.particleType,
            progress: Number(clamp01(1 - attack.t / (attack.duration || ATTACK_ANIMATION_SECONDS)).toFixed(2)),
          })),
          drinkTosses: (shownBattle.drinkTosses || []).map((toss) => ({
            id: toss.id,
            name: toss.name,
            kind: toss.kind,
            side: toss.side,
            slotIndex: toss.slotIndex,
            to: toss.to,
            progress: Number(clamp01(1 - toss.t / (toss.duration || DRINK_TOSS_ANIMATION_SECONDS)).toFixed(2)),
          })),
        }
      : null;
    return JSON.stringify({
      coordinateSystem: "origin top-left; x increases right; y increases down",
      phase: state.phase,
      round: state.round,
      gold: state.gold,
      hearts: state.hearts,
      message: state.message,
      battleSpeed: {
        value: currentBattleSpeed(),
        label: battleSpeedLabel(),
        index: state.battleSpeedIndex,
        options: [...BATTLE_SPEEDS],
      },
      particles: {
        count: state.particles.length,
        foodCount: state.particles.filter((particle) => particle.foodParticles).length,
        samples: state.particles.slice(0, 8).map((particle) => ({
          x: Number(particle.x.toFixed(1)),
          y: Number(particle.y.toFixed(1)),
          life: Number(particle.life.toFixed(2)),
          particleType: particle.particleType || null,
          food: Boolean(particle.foodParticles),
        })),
      },
      arena: arenaText(),
      arenas: ARENAS.map((arena) => arenaText(arena)),
      arenaRewards: {
        keepArenaNextRound: state.keepArenaNextRound,
        scout: state.arenaScout ? {
          arenaId: state.arenaScout.arenaId,
          arenaShort: state.arenaScout.arenaShort,
          traitIds: [...(state.arenaScout.traitIds || [])],
          shopsRemaining: state.arenaScout.shopsRemaining || 0,
        } : null,
        prepBuff: state.arenaPrepBuff ? {
          arenaId: state.arenaPrepBuff.arenaId,
          arenaShort: state.arenaPrepBuff.arenaShort,
          traitIds: [...(state.arenaPrepBuff.traitIds || [])],
          duration: state.arenaPrepBuff.duration,
          shieldPct: state.arenaPrepBuff.shieldPct,
          hastePct: state.arenaPrepBuff.hastePct,
          attackPct: state.arenaPrepBuff.attackPct,
        } : null,
      },
      economy: ECONOMY,
      traits: Object.fromEntries(Object.entries(TRAITS).map(([id, trait]) => [id, {
        label: trait.label,
        short: trait.short,
        thresholds: trait.thresholds,
      }])),
      activeTraits: activePlayerTraits(),
      rarities: Object.fromEntries(Object.entries(RARITIES).map(([id, rarity]) => [id, {
        label: rarity.label,
        baseShopWeight: rarity.shopWeight,
        shopWeight: rarityWeights[id] || 0,
        shopOddsPct: rarityOdds[id] || 0,
      }])),
      shopUpgrade: {
        level: state.shopLevel,
        maxLevel: MAX_SHOP_LEVEL,
        nextCost: nextShopUpgradeCost(),
        discountGold: state.nextShopUpgradeDiscountGold || 0,
        shopkeeperSrc: currentShopkeeperSrc(),
        rarityWeights,
        rarityOddsPct: rarityOdds,
        itemShopChancePct: Number((currentItemShopChance() * 100).toFixed(1)),
        drinkShopChancePct: Number((currentDrinkShopChance() * 100).toFixed(1)),
        toppingShopChancePct: Number((currentToppingShopChance() * 100).toFixed(1)),
        saleChancePct: Number((currentShopSaleChance() * 100).toFixed(1)),
      },
      currentRollCost: currentRollCost(),
      freeRolls: state.freeRolls,
      rollsThisRound: state.rollsThisRound,
      itemDiscountUsed: state.itemDiscountUsed,
      availableItemDiscount: availableItemDiscount(),
      streaks: {
        win: state.winStreak,
        loss: state.lossStreak,
      },
      lastIncome: state.lastIncome,
      lastCombatLedger: state.lastCombatLedger,
      shopFrozen: [...state.shopFrozen],
      shopSales: [...state.shopSales],
      shopUnlocked: [...state.shopUnlocked],
      shopLocked: shopSlots.map((_, index) => !isShopSlotUnlocked(index)),
      shopUnlockCosts: shopSlots.map((_, index) => shopSlotUnlockCost(index)),
      shop: state.shop.map((u, index) => (u ? shopEntryText(u, index) : null)),
      bench: state.bench.map((u) => (u ? entryText(u) : null)),
      itemBench: state.itemBench.map((item, index) => (item ? { ...itemText(item), slotKind: itemBenchSlotKind(index) } : { slotKind: itemBenchSlotKind(index), item: null })),
      board: state.board.map((u, i) => (isUnit(u) ? { ...unitText(u), ...slotText(i) } : null)),
      drinks: state.drinks.map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
      enemyDrinks: enemyDrinks.map((item, index) => (item ? { ...itemText(item), ...drinkSlotText(index) } : { ...drinkSlotText(index), item: null })),
      enemyPlan: state.enemyPreview?.plan || shownBattle?.enemyPlan || null,
      enemyPreview: enemyPreview.map((unit, index) => ({
        ...unitText(unit),
        previewSlot: enemySlotOrder()[index],
        ...slotText(enemySlotOrder()[index]),
      })),
      rewardChoices: state.rewardChoices.map((reward, index) => ({ index, ...reward })),
      codex: {
        open: state.codexOpen,
        tab: state.codexTab,
        filters: JSON.parse(JSON.stringify(state.codexFilters || {})),
        visibleCount: codexEntries().length,
        visibleEntries: codexEntries().slice(0, 12).map((entry) => ({
          id: entry.id,
          name: entry.name,
          rarity: entry.rarity || "common",
        })),
        selectedId: state.codexSelectedId,
        selectedFormTier: state.codexSelectedFormTier,
        selectedFormName: state.codexTab === "food"
          ? codexMealSelected()
            ? "Meal"
            : currentCodexEntry()?.forms?.[codexSelectedFormTier(currentCodexEntry()) - 1]?.name || null
          : null,
        selectedAnimal: state.codexTab === "food" && currentCodexEntry()
          ? unitText(codexUnitFor(currentCodexEntry(), codexMealSelected() ? 1 : codexSelectedFormTier(currentCodexEntry())))
          : null,
        selectedItemTier: state.codexSelectedItemTier,
        selectedItem: state.codexTab === "toppings" || state.codexTab === "drinks"
          ? currentCodexEntry()
            ? itemText(makeItem(currentCodexEntry().id, codexSelectedItemTier()))
            : null
          : null,
      },
      selected: state.selected,
      selectedEntry: getSelectedRef()?.entry ? entryText(getSelectedRef().entry) : null,
      selectedUnit: getSelectedRef()?.unit ? unitText(getSelectedRef().unit) : null,
      drag: state.drag
        ? {
            area: state.drag.area,
            index: state.drag.index,
            x: Math.round(state.drag.x),
            y: Math.round(state.drag.y),
            moved: state.drag.moved,
            over: state.drag.over,
            valid: state.drag.valid,
            entry: entryText(state.drag.unit),
          }
        : null,
      battle,
    });
  }

  function entryText(entry) {
    if (isItem(entry)) return itemText(entry);
    return unitText(entry);
  }

  function shopEntryText(entry, index) {
    return {
      ...entryText(entry),
      shopSale: shopSlotOnSale(index),
      basePrice: entryCost(entry),
      salePrice: saleAdjustedEntryCost(entry, index),
      purchasePrice: purchaseCost(entry, index),
    };
  }

  function itemText(item) {
    return {
      kind: "item",
      id: item.id,
      name: item.name,
      short: itemDisplayShort(item),
      baseShort: item.short,
      type: item.type,
      tier: itemTier(item.tier),
      maxTier: MAX_ITEM_TIER,
      tierScale: itemTierScale(item.tier),
      mergeProgress: itemMergeProgressCount(item.id, item.tier),
      mergeRequired: 3,
      mergeText: itemTier(item.tier) >= MAX_ITEM_TIER ? "Max level" : `${Math.min(itemMergeProgressCount(item.id, item.tier), 3)}/3 to Lv ${itemTier(item.tier) + 1}`,
      rarity: item.rarity || "common",
      rarityLabel: rarityInfo(item.rarity).label,
      price: entryCost(item),
      sellValue: itemSellValue(item),
      damageBonusPct: item.damageBonusPct,
      attackSpeedPct: item.attackSpeedPct,
      maxHpBonusPct: item.maxHpBonusPct,
      abilityPowerBonusPct: item.abilityPowerBonusPct,
      drinkAttackSpeedPct: item.drinkAttackSpeedPct,
      drinkMaxHpPct: item.drinkMaxHpPct,
      drinkAbilityPowerPct: item.drinkAbilityPowerPct,
      pairTraits: item.pairTraits ? [...item.pairTraits] : [],
      pairLabel: drinkPairLabel(item),
      pairedDrinkAttackSpeedPct: item.pairedDrinkAttackSpeedPct,
      pairedDrinkMaxHpPct: item.pairedDrinkMaxHpPct,
      pairedDrinkAbilityPowerPct: item.pairedDrinkAbilityPowerPct,
      drinkPulseType: item.drinkPulseType,
      drinkPulseUnlocked: drinkPulseUnlocked(item),
      drinkPulseTierScale: isDrink(item) && item.drinkPulseType ? Number(drinkPulseTierScale(item).toFixed(3)) : undefined,
      drinkPulseText: drinkPulseSpecLine(item, drinkPulseUnlocked(item)),
      drinkPulseInterval: item.drinkPulseInterval,
      drinkPulseDuration: item.drinkPulseDuration,
      drinkPulseShieldPct: item.drinkPulseShieldPct,
      drinkPulseHastePct: item.drinkPulseHastePct,
      drinkPulseHealPct: item.drinkPulseHealPct,
      drinkPulseEnemyDamagePct: item.drinkPulseEnemyDamagePct,
      drinkPulseAttackSlowPct: item.drinkPulseAttackSlowPct,
      drinkPulseAttackBoostPct: item.drinkPulseAttackBoostPct,
      onAttackShieldPct: item.onAttackShieldPct,
      onHitShieldPct: item.onHitShieldPct,
      shieldCrackleDamagePct: item.shieldCrackleDamagePct,
      burnDamagePct: item.burnDamagePct,
      burnDuration: item.burnDuration,
      supportBonusPct: item.supportBonusPct,
      markDamagePct: item.markDamagePct,
      markDuration: item.markDuration,
      damageTakenPct: item.damageTakenPct,
      everyNAttacks: item.everyNAttacks,
      selfHealPct: item.selfHealPct,
      splashDamagePct: item.splashDamagePct,
      lateFightStart: item.lateFightStart,
      lateFightInterval: item.lateFightInterval,
      lateFightDamagePct: item.lateFightDamagePct,
      lateFightMaxStacks: item.lateFightMaxStacks,
      lowHpThreshold: item.lowHpThreshold,
      lowHpAttackSpeedPct: item.lowHpAttackSpeedPct,
      lowHpLifestealPct: item.lowHpLifestealPct,
      cooldownDelay: item.cooldownDelay,
      supportHastePct: item.supportHastePct,
      supportHasteDuration: item.supportHasteDuration,
      antiSupportPct: item.antiSupportPct,
      antiSupportDuration: item.antiSupportDuration,
      receivedSupportSharePct: item.receivedSupportSharePct,
      bounceDamagePct: item.bounceDamagePct,
      shieldedAttackBonusPct: item.shieldedAttackBonusPct,
      overhealShieldPct: item.overhealShieldPct,
      mergeProgressBonus: item.mergeProgressBonus,
      frontRowDamageReductionPct: item.frontRowDamageReductionPct,
      backRowTargeting: item.backRowTargeting,
      adjacentStartShieldPct: item.adjacentStartShieldPct,
      pierceDamagePct: item.pierceDamagePct,
      lowHpBurnThreshold: item.lowHpBurnThreshold,
      lowHpBurnDamagePct: item.lowHpBurnDamagePct,
      lowHpBurnDuration: item.lowHpBurnDuration,
      deathSaveShieldPct: item.deathSaveShieldPct,
      firstDebuffCleanseHealPct: item.firstDebuffCleanseHealPct,
      timedHasteAt: item.timedHasteAt,
      timedHastePct: item.timedHastePct,
      timedHasteDuration: item.timedHasteDuration,
      shieldedTargetDamagePct: item.shieldedTargetDamagePct,
      attackSlowPct: item.attackSlowPct,
      attackSlowDuration: item.attackSlowDuration,
      statusDurationReductionPct: item.statusDurationReductionPct,
      statusDamageReductionPct: item.statusDamageReductionPct,
      decoyHpPct: item.decoyHpPct,
      firstHitRedirect: item.firstHitRedirect,
      periodicDamage: item.periodicDamage,
      periodicDamagePct: item.periodicDamagePct,
      periodicInterval: item.periodicInterval,
      sellBonusGold: item.sellBonusGold,
      surviveGold: item.surviveGold,
      firstItemDiscountGold: item.firstItemDiscountGold,
      sameLineShopChancePct: item.sameLineShopChancePct,
      extraAdjacentHealPct: item.extraAdjacentHealPct,
      shieldCapBonusPct: item.shieldCapBonusPct,
      statusDurationBonusPct: item.statusDurationBonusPct,
      supportAttackBuffPct: item.supportAttackBuffPct,
      supportAttackBuffDuration: item.supportAttackBuffDuration,
      battleStartHpLossPct: item.battleStartHpLossPct,
      firstAttacksBonusPct: item.firstAttacksBonusPct,
      firstAttacksCount: item.firstAttacksCount,
      exhaustedSpeedPenaltyPct: item.exhaustedSpeedPenaltyPct,
      selfBurnDamagePct: item.selfBurnDamagePct,
      shieldedAttackSpeedPct: item.shieldedAttackSpeedPct,
      teamVulnerabilityPct: item.teamVulnerabilityPct,
      teamVulnerabilityDuration: item.teamVulnerabilityDuration,
      executeSplashThreshold: item.executeSplashThreshold,
      executeSplashBonusPct: item.executeSplashBonusPct,
      executeSplashDamagePct: item.executeSplashDamagePct,
      teamOverhealShieldPct: item.teamOverhealShieldPct,
      teamHasteInterval: item.teamHasteInterval,
      teamHastePct: item.teamHastePct,
      teamHasteDuration: item.teamHasteDuration,
      supportRowEchoPct: item.supportRowEchoPct,
      adjacentStartAttackBuffPct: item.adjacentStartAttackBuffPct,
      adjacentStartBuffDuration: item.adjacentStartBuffDuration,
      abilityText: item.abilityText,
      cardText: itemCardText(item),
      baseCardText: item.cardText,
      description: isDrink(item) ? drinkTechnicalDescription(item) : item.description,
      specs: itemSpecLines(item),
      favoriteFor: favoriteUsersForItem(item.id),
    };
  }

  function unitText(unit, includePosition = false) {
    const payload = {
      kind: "unit",
      id: unit.typeId,
      lineName: unit.lineName,
      formName: unit.name,
      name: unit.short,
      rarity: unit.rarity,
      rarityLabel: rarityInfo(unit.rarity).label,
      family: unit.family,
      familyLabel: familyLabel(unit.family),
      traits: (unit.traits || []).map((traitId) => ({
        id: traitId,
        label: traitLabel(traitId),
        active: activeTraitStage(unit, traitId) > 0,
        stage: activeTraitStage(unit, traitId),
      })),
      tier: unit.tier,
      hp: unit.hp,
      maxHp: unit.maxHp,
      atk: unit.atk,
      abilityPower: unit.abilityPower,
      permanentHpBonus: unit.permanentHpBonus || 0,
      ability: unit.ability,
      abilityText: abilitySpecLine(unit),
      abilityLabel: unit.abilityText,
      favoriteTopping: favoriteToppingFor(unit),
      specialEffect: specialEffectFor(unit),
      shield: unit.shield || 0,
      burn: unit.burn ? { remaining: Number(unit.burn.remaining.toFixed(2)), damage: unit.burn.damage } : null,
      mark: unit.mark ? { remaining: Number(unit.mark.remaining.toFixed(2)), sourceUid: unit.mark.sourceUid, damagePct: unit.mark.damagePct } : null,
      teamVulnerable: unit.teamVulnerable ? { remaining: Number(unit.teamVulnerable.remaining.toFixed(2)), pct: unit.teamVulnerable.pct } : null,
      haste: unit.haste ? { remaining: Number(unit.haste.remaining.toFixed(2)), pct: unit.haste.pct } : null,
      attackBoost: unit.attackBoost ? { remaining: Number(unit.attackBoost.remaining.toFixed(2)), pct: unit.attackBoost.pct } : null,
      attackSlow: unit.attackSlow ? { remaining: Number(unit.attackSlow.remaining.toFixed(2)), pct: unit.attackSlow.pct } : null,
      antiSupport: unit.antiSupport ? { remaining: Number(unit.antiSupport.remaining.toFixed(2)), reductionPct: unit.antiSupport.reductionPct } : null,
      slowed: unit.slowed ? { remaining: Number(unit.slowed.remaining.toFixed(2)) } : null,
      lateFightStacks: unit.lateFightStacks || 0,
      moldStacks: unit.moldStacks || 0,
      kernelStacks: unit.kernelStacks || 0,
      abilitySpec: abilitySpecLine(unit),
      drinkAttackSpeedPct: unit.drinkAttackSpeedPct || 0,
      drinkEffects: unit.drinkEffects || [],
      item: unit.item ? itemText(unit.item) : null,
    };
    if (includePosition) {
      payload.x = Math.round(unit.x);
      payload.y = Math.round(unit.y);
      payload.side = unit.side;
      payload.slot = unit.slot;
      payload.row = unit.row;
      payload.col = unit.col;
      payload.depth = unit.col === FRONT_COL ? "front" : unit.col === BACK_COL ? "back" : "middle";
    }
    return payload;
  }

  function slotText(index) {
    const { row, col } = slotGrid(index);
    return {
      slot: index,
      row,
      col,
      depth: col === FRONT_COL ? "front" : col === BACK_COL ? "back" : "middle",
    };
  }

  function drinkSlotText(index) {
    const slot = drinkSlots[index];
    return {
      slot: index,
      axis: slot.axis,
      targetIndex: slot.targetIndex,
      targetLabel: slot.axis === "row" ? `row ${slot.targetIndex + 1}` : `column ${slot.targetIndex + 1}`,
    };
  }

  window.render_game_to_text = renderGameToText;
  window.advanceTime = (ms) => {
    const steps = Math.max(1, Math.round(ms / (1000 / 60)));
    for (let i = 0; i < steps; i++) update(1 / 60);
    draw();
    return renderGameToText();
  };
  window.__foodAnimals = {
    state,
    buyShop,
    buyShopToBench,
    buyShopToSlot,
    buyShopItemToAnimal,
    upgradeShop,
    nextShopUpgradeCost,
    currentShopRarityWeights,
    shopRarityOdds,
    currentDrinkShopChance,
    currentToppingShopChance,
    currentItemShopChance,
    currentShopSaleChance,
    shopSlotOnSale,
    moveUnitToOpenSlot,
    attachItemFromBench,
    detachSelectedItem,
    refreshShop,
    shopItem,
    shopEntry,
    ensureEnemyPreview,
    applyRewardChoice,
    generateRewardChoices,
    arenaRewardTraits,
    toggleShopFreeze,
    purchaseShopSlot,
    cycleBattleSpeed,
    currentBattleSpeed,
    currentArena,
    setArena,
    arenaInfo,
    arenas: ARENAS,
    sellSelectedUnit,
    sellSelectedItem,
    sellValue,
    itemSellValue,
    rarityInfo,
    chooseShopRarity,
    startBattle,
    continuePrep,
    makeUnit,
    makeItem,
    mergeTriples,
    resolveMerges,
    mergeItemTriples,
    resolveItemMerges,
    itemMergeProgressCount,
    positionBattleUnit,
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel);
  canvas.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("keydown", onKeyDown);

  preloadAttackParticleSprites();
  preloadDrinkThrowableSprites();
  preloadDefeatStillSprites();
  refreshShop(true);
  ensureEnemyPreview();
  draw();
  requestAnimationFrame(gameLoop);
})();
