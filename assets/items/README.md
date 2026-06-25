# Item Art Pipeline

Generated item and drink icons use the same project-local workflow as animal sprites: a flat chroma-key source image in `source/`, a transparent intermediate in `transparent/`, and individual runtime PNGs in `runtime/`.

## Horror Slot Backdrops V1

The horror-mode combat plate, drink coaster, and topping storage backdrops were generated as future-war mechanical pixel-art frames on a magenta `#ff00f0` chroma-key background so their neon green accents survive transparency extraction. Sources live at `source/combat_plate_horror_v1_chromakey.png`, `source/combat_coaster_horror_v1_chromakey.png`, and `source/topping_storage_horror_v1_chromakey.png`; transparent intermediates live under `transparent/*_horror_v1_transparent.png`; active runtime assets are `runtime/combat_plate-horror-v1.png`, `runtime/combat_coaster-horror-v1.png`, and `runtime/topping_storage-horror-v1.png`.

## Horror Weapon Sample V1

Star Shrapnel is the first horror-mode topping-to-weapon sample, replacing Cheese Star art only while the horror theme is active. The generated source strip is `source/star_shrapnel-horror-evolution-v1-chromakey.png`, the transparent strip is `transparent/star_shrapnel-horror-evolution-v1-transparent.png`, and active runtime slices are `runtime/star_shrapnel-horror-evolution-v1-lv1.png`, `runtime/star_shrapnel-horror-evolution-v1-lv2.png`, and `runtime/star_shrapnel-horror-evolution-v1-lv3.png`. The sheet was generated as static robotic armament with large gutters, no food material, and no motion cues.

## Horror Weapons Batch 1 V1

The first four-at-a-time horror weapon batch covers Solar Warhead, Grease Armor Plate, Reactive Armor Strips, and Red Micro-Missile as pure robotic armaments. The source sheet is `source/horror-weapons-batch-1-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-1-v1-transparent.png`, and runtime slices live at `runtime/solar_warhead-horror-evolution-v1-lv*.png`, `runtime/grease_armor_plate-horror-evolution-v1-lv*.png`, `runtime/reactive_armor_strips-horror-evolution-v1-lv*.png`, and `runtime/red_micro_missile-horror-evolution-v1-lv*.png`. The source was generated as a 4x3 grid with large gutters, static forms, and no firing, trails, smoke, sparks, or food material.

## Horror Weapons Batch 2 V1

The first eight-at-a-time horror weapon batch covers Brine Shard, Spore Mine, Disc Saw, Acid Wedge, Targeting Ring, Thermal Spike, Pit Guard Shield, and Viscous Charge as pure robotic armaments. The source sheet is `source/horror-weapons-batch-2-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-2-v1-transparent.png`, and runtime slices live at `runtime/brine_shard-horror-evolution-v1-lv*.png`, `runtime/spore_mine-horror-evolution-v1-lv*.png`, `runtime/disc_saw-horror-evolution-v1-lv*.png`, `runtime/acid_wedge-horror-evolution-v1-lv*.png`, `runtime/targeting_ring-horror-evolution-v1-lv*.png`, `runtime/thermal_spike-horror-evolution-v1-lv*.png`, `runtime/pit_guard_shield-horror-evolution-v1-lv*.png`, and `runtime/viscous_charge-horror-evolution-v1-lv*.png`. The prompt carried over each original topping's accent palette but rendered it as metallic hardware; Viscous Charge needed a custom alpha pass so magenta reactor glass survived the magenta chroma-key workflow.

## Horror Weapons Batch 3 V1

The second eight-at-a-time horror weapon batch covers Crown Clamp, Foam Sealant, Sensor Blade Array, Adhesive Gel, Repulsor Module, Impact Pellet, Razor Ring, and Amber Reservoir as pure robotic armaments. The source sheet is `source/horror-weapons-batch-3-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-3-v1-transparent.png`, and runtime slices live at `runtime/crown_clamp-horror-evolution-v1-lv*.png`, `runtime/foam_sealant-horror-evolution-v1-lv*.png`, `runtime/sensor_blade_array-horror-evolution-v1-lv*.png`, `runtime/adhesive_gel-horror-evolution-v1-lv*.png`, `runtime/repulsor_module-horror-evolution-v1-lv*.png`, `runtime/impact_pellet-horror-evolution-v1-lv*.png`, `runtime/razor_ring-horror-evolution-v1-lv*.png`, and `runtime/amber_reservoir-horror-evolution-v1-lv*.png`. The prompt referenced the original topping palettes but translated them into metallic plating, ceramic armor, glass power cores, and mechanical modules, with no food material or motion cues.

## Horror Weapons Batch 4 V1

The third eight-at-a-time horror weapon batch covers Soft Armor Cube, Phantom Copy Chip, Tide Snare, Knotwire Spike, Sabot Cone, Rail Spear, Thermal Spray, and Stim Cube as pure robotic armaments. The source sheet is `source/horror-weapons-batch-4-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-4-v1-transparent.png`, and runtime slices live at `runtime/soft_armor_cube-horror-evolution-v1-lv*.png`, `runtime/phantom_copy_chip-horror-evolution-v1-lv*.png`, `runtime/tide_snare-horror-evolution-v1-lv*.png`, `runtime/knotwire_spike-horror-evolution-v1-lv*.png`, `runtime/sabot_cone-horror-evolution-v1-lv*.png`, `runtime/rail_spear-horror-evolution-v1-lv*.png`, `runtime/thermal_spray-horror-evolution-v1-lv*.png`, and `runtime/stim_cube-horror-evolution-v1-lv*.png`. The prompt reused the original ivory, bronze, sea-green, gold, red, and white palette accents as ceramic armor, dark metal, heated glass, and mechanical weapon modules while forbidding food materials, loose particles, and motion cues.

## Horror Weapons Redo Sample V3

The ten requested horror weapon redos cover Knotwire Spike, Impact Pellet, Tide Snare, Sabot Cone, Repulsor Module, Adhesive Gel, Thermal Spray, Soft Armor Cube, Rail Spear, and Stim Cube. The accepted source sheet is `source/horror-weapons-redo-sample-v3-chromakey.png`, with thin black pixel-art outlines, large cutout gutters, static mechanical armaments, and no food material or motion cues. The transparent sheet is `transparent/horror-weapons-redo-sample-v3-transparent.png`; active runtime slices live at `runtime/{knotwire_spike,impact_pellet,tide_snare,sabot_cone,repulsor_module,adhesive_gel,thermal_spray,soft_armor_cube,rail_spear,stim_cube}-horror-evolution-v3-lv*.png` and are wired in `game.js` for horror/reality mode.

## Horror Weapons Batch 5 V1

The fourth eight-at-a-time horror weapon batch covers Decon Patch, Fizz Capacitor, Crystalline Flak, Corrosive Sprayer, Delay Module, Shieldbreaker Plate, Red Charge Mine, and Guard Pike as pure robotic armaments. The source sheet is `source/horror-weapons-batch-5-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-5-v1-transparent.png`, and runtime slices live at `runtime/decon_patch-horror-evolution-v1-lv*.png`, `runtime/fizz_capacitor-horror-evolution-v1-lv*.png`, `runtime/crystalline_flak-horror-evolution-v1-lv*.png`, `runtime/corrosive_sprayer-horror-evolution-v1-lv*.png`, `runtime/delay_module-horror-evolution-v1-lv*.png`, `runtime/shieldbreaker_plate-horror-evolution-v1-lv*.png`, `runtime/red_charge_mine-horror-evolution-v1-lv*.png`, and `runtime/guard_pike-horror-evolution-v1-lv*.png`. The prompt pushed the set harder into future-war, dark, war-torn, neon-lit, black-outline high-detail pixel art, with extra constraints against magenta/pink/purple edge halos.

## Horror Weapons Batch 6 V1

The first ten-at-a-time horror weapon batch covers Kernel Flak, Probability Decoder, Luck Core, Golden Supply Pod, Protocol Breaker, Sustain Injector, Viscous Armor Reservoir, Hazard Grenade, Signal Relay, and Glass Shard as pure robotic armaments. The source sheet is `source/horror-weapons-batch-6-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-6-v1-transparent.png`, and runtime slices live at `runtime/kernel_flak-horror-evolution-v1-lv*.png`, `runtime/probability_decoder-horror-evolution-v1-lv*.png`, `runtime/luck_core-horror-evolution-v1-lv*.png`, `runtime/golden_supply_pod-horror-evolution-v1-lv*.png`, `runtime/protocol_breaker-horror-evolution-v1-lv*.png`, `runtime/sustain_injector-horror-evolution-v1-lv*.png`, `runtime/viscous_armor_reservoir-horror-evolution-v1-lv*.png`, `runtime/hazard_grenade-horror-evolution-v1-lv*.png`, `runtime/signal_relay-horror-evolution-v1-lv*.png`, and `runtime/glass_shard-horror-evolution-v1-lv*.png`. The prompt referenced `output/horror-weapons-batch-6-reference-palette.png`, translated the cozy colors into dark metallic materials, and explicitly forbade food materials, motion cues, magenta/pink/purple subject pixels, and chroma-key edge halos. A second runtime cleanup pass neutralized remaining purple rim pixels into dark mechanical outlines.

## Horror Weapons Batch 7 V1

The first remaining-items horror weapon batch covers Wasabi Piercer, Molten Rounds, Shellbreaker Rack, Command Crown, Dragon Starblade, Prism Armor Node, Cluster Mines, and Signal Filaments as pure robotic armaments. The source sheet is `source/horror-weapons-batch-7-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-7-v1-transparent.png`, and runtime slices live at `runtime/wasabi_piercer-horror-evolution-v1-lv*.png`, `runtime/molten_rounds-horror-evolution-v1-lv*.png`, `runtime/shellbreaker_rack-horror-evolution-v1-lv*.png`, `runtime/command_crown-horror-evolution-v1-lv*.png`, `runtime/dragon_starblade-horror-evolution-v1-lv*.png`, `runtime/prism_armor_node-horror-evolution-v1-lv*.png`, `runtime/cluster_mines-horror-evolution-v1-lv*.png`, and `runtime/signal_filaments-horror-evolution-v1-lv*.png`. The prompt referenced `output/horror-weapons-batch-7-reference-palette.png`, translated pink/purple food palettes into coral-red, cyan, white ceramic, gold, black graphite, and other metallic materials, and forbade motion cues or edible/organic forms.

## Horror Weapons Batch 8 V1

The final remaining-items horror weapon batch covers Vector Oil Slick, Red Flak, Signal Mast, Scattershot Pods, Burn Charge, Foam Coolant, and Royal Aegis Crest as pure robotic armaments. The source sheet is `source/horror-weapons-batch-8-v1-chromakey.png`, the transparent sheet is `transparent/horror-weapons-batch-8-v1-transparent.png`, and runtime slices live at `runtime/vector_oil_slick-horror-evolution-v1-lv*.png`, `runtime/red_flak-horror-evolution-v1-lv*.png`, `runtime/signal_mast-horror-evolution-v1-lv*.png`, `runtime/scattershot_pods-horror-evolution-v1-lv*.png`, `runtime/burn_charge-horror-evolution-v1-lv*.png`, `runtime/foam_coolant-horror-evolution-v1-lv*.png`, and `runtime/royal_aegis_crest-horror-evolution-v1-lv*.png`. The prompt referenced `output/horror-weapons-batch-8-reference-palette.png`, kept the future-war dark neon mechanical style, and converted the remaining food-like palettes into static armor pods, flak canisters, masts, coolant modules, and aegis weapon crests. The finished runtime scan reports zero pale key-pink or forbidden purple pixels across batches 7 and 8.

## Horror Power Source Sample V1

`war_power_core` is the first horror-mode drink/power-source sample. It treats the drink slot as a pure robotic weapon power center rather than food: a compact reactor cell evolves into an armored generator and then a full mechanical reactor-cannon core. The source strip includes only static neon motes, cubes, and munition beads with no baked-in motion trails.

Source art lives at `source/war_power_core-grand-strip-v1-chromakey.png`, the transparent strip lives at `transparent/war_power_core-grand-strip-v1-transparent.png`, and runtime samples live at `runtime/item-horror-power_war_power_core_lv1_idle_SW_00.png`, `runtime/item-horror-power_war_power_core_lv2_idle_SW_00.png`, and `runtime/item-horror-power_war_power_core_lv3_idle_SW_00.png`.

## Horror Power Source Batch V1

The first four-at-a-time horror power-source batch adds `siege_capacitor`, `void_pylon`, `plasma_warhead_rack`, and `rail_furnace`. Each line was generated as a separate wide three-form strip with large gutters, then chroma-keyed and sliced into `192x192` runtime frames. The art remains pure robotic weapon hardware and futuristic power-center machinery, with only static neon motes, shell casings, cubes, and munition beads as particles.

Source strips live at `source/{siege_capacitor,void_pylon,plasma_warhead_rack,rail_furnace}-grand-strip-v1-chromakey.png`; transparent strips live at `transparent/*-grand-strip-v1-transparent.png`; runtime previews live at `runtime/item-horror-power_{slug}_evolution_SW_sheet.png`; active samples live at `runtime/item-horror-power_{slug}_lv1_idle_SW_00.png`, `runtime/item-horror-power_{slug}_lv2_idle_SW_00.png`, and `runtime/item-horror-power_{slug}_lv3_idle_SW_00.png`.

## Horror Power Source Batch 2 V1

The second four-at-a-time horror power-source batch adds `neutron_arsenal_core`, `grav_rail_battery`, `ion_bastion_reactor`, and `obsidian_missile_forge`. Each line was generated as a separate wide three-form strip with large gutters, then chroma-keyed and sliced into `192x192` runtime frames. These strips intentionally contain no detached particles, shell casings, motes, sparkles, debris, or loose objects; associated particles are packaged separately under `assets/particles`.

Source strips live at `source/{neutron_arsenal_core,grav_rail_battery,ion_bastion_reactor,obsidian_missile_forge}-grand-strip-v1-chromakey.png`; transparent strips live at `transparent/*-grand-strip-v1-transparent.png`; runtime previews live at `runtime/item-horror-power_{slug}_evolution_SW_sheet.png`; active samples live at `runtime/item-horror-power_{slug}_lv1_idle_SW_00.png`, `runtime/item-horror-power_{slug}_lv2_idle_SW_00.png`, and `runtime/item-horror-power_{slug}_lv3_idle_SW_00.png`.

Horror-mode runtime wiring maps these power sources onto the first four drink/fuel systems only when the reality layer is active: `bean_brew` now uses the no-purple `caffeine_reactor` redo, `berry_fizz` uses `ion_bastion_reactor`, `garden_spritz` now uses the brighter `cleanroom_repair_source` redo, and `citrus_tea` now uses the brighter `citrus_brine_battery` redo. Cozy mode continues to use the original drink art.

`caffeine_reactor` replaces the earlier `grav_rail_battery` art for `bean_brew` in horror mode. Its source sheet is `source/caffeine_reactor-redo-v3-no-purple-chromakey.png`, the transparent sheet is `transparent/caffeine_reactor-redo-v3-no-purple-transparent.png`, runtime frames are `runtime/item-horror-power_caffeine_reactor_lv*_idle_SW_00.png`, and the review wreck is `runtime/item-horror-power_caffeine_reactor_defeat_idle_SW_00.png`. The redo keeps the cozy Bean Brew espresso, cream, copper, caramel, and amber palette as mechanical materials, with cyan and red accents and no purple/magenta/violet/pink subject pixels.

`citrus_brine_battery` replaces the earlier `obsidian_missile_forge` art for `citrus_tea` in horror mode. Its source sheet is `source/citrus_brine_battery-redo-v1-chromakey.png`, the transparent sheet is `transparent/citrus_brine_battery-redo-v1-transparent.png`, runtime frames are `runtime/item-horror-power_citrus_brine_battery_lv*_idle_SW_00.png`, and the review wreck is `runtime/item-horror-power_citrus_brine_battery_defeat_idle_SW_00.png`. The redo keeps the cozy Citrus Tea orange, gold, amber, green, and cream palette as metallic brine-battery hardware, with stronger cyan neon discharge windows and red warning lights.

`cleanroom_repair_source` replaces the earlier `neutron_arsenal_core` art for `garden_spritz` in horror mode. Its source sheet is `source/cleanroom_repair_source-redo-v1-chromakey.png`, the transparent sheet is `transparent/cleanroom_repair_source-redo-v1-transparent.png`, runtime frames are `runtime/item-horror-power_cleanroom_repair_source_lv*_idle_SW_00.png`, and the review wreck is `runtime/item-horror-power_cleanroom_repair_source_defeat_idle_SW_00.png`. The redo keeps the cozy Garden Spritz lime, leaf green, pale yellow, cream, and warm gold palette as sterile ceramic-and-metal repair hardware with stronger neon green glow.

## Horror Power Source Batch 3 V1

The third four-at-a-time horror power-source batch adds `ignition_barrage_core`, `pressure_bulwark_reactor`, `abyssal_tide_singularity`, and `cryo_guard_battery`. Each line was generated as a separate wide three-form strip with large gutters, then chroma-keyed and sliced into `192x192` runtime frames. Like batch 2, these drink/fuel strips intentionally contain no detached particles, shell casings, motes, sparkles, debris, or loose objects; associated particles are packaged separately under `assets/particles`.

Source strips live at `source/{ignition_barrage_core,pressure_bulwark_reactor,abyssal_tide_singularity,cryo_guard_battery}-grand-strip-v1-chromakey.png`; transparent strips live at `transparent/*-grand-strip-v1-transparent.png`; runtime previews live at `runtime/item-horror-power_{slug}_evolution_SW_sheet.png`; active samples live at `runtime/item-horror-power_{slug}_lv1_idle_SW_00.png`, `runtime/item-horror-power_{slug}_lv2_idle_SW_00.png`, and `runtime/item-horror-power_{slug}_lv3_idle_SW_00.png`.

Horror-mode runtime wiring maps these power sources onto the next four drink/fuel systems only when the reality layer is active: `chili_crunch_cola` now uses the brighter `thermal_overdrive_tank` redo, `pepper_broth` now uses the brighter `pepper_armor_station` redo, `abyssal_shake` uses `abyssal_tide_singularity`, and `cream_soda_float` now uses the brighter `foam_shield_station` redo. Cozy mode continues to use the original drink art.

`thermal_overdrive_tank` replaces the earlier `ignition_barrage_core` art for `chili_crunch_cola` in horror mode. Its source sheet is `source/thermal_overdrive_tank-redo-v1-chromakey.png`, the transparent sheet is `transparent/thermal_overdrive_tank-redo-v1-transparent.png`, runtime frames are `runtime/item-horror-power_thermal_overdrive_tank_lv*_idle_SW_00.png`, and the review wreck is `runtime/item-horror-power_thermal_overdrive_tank_defeat_idle_SW_00.png`. The redo keeps the cozy Chili Crunch Cola red, cola brown, tomato-orange, cream, warm gold, and tiny green accent palette as metallic treaded overdrive-tank hardware with stronger red-orange thermal glow.

`pepper_armor_station` replaces the earlier `pressure_bulwark_reactor` art for `pepper_broth` in horror mode. Its source sheet is `source/pepper_armor_station-redo-v1-chromakey.png`, the transparent sheet is `transparent/pepper_armor_station-redo-v1-transparent.png`, runtime frames are `runtime/item-horror-power_pepper_armor_station_lv*_idle_SW_00.png`, and the review wreck is `runtime/item-horror-power_pepper_armor_station_defeat_idle_SW_00.png`. The redo keeps the cozy Pepper Broth red, tomato-orange, cream, chili brown, bronze, and tiny green garnish palette as dark metallic armor-station hardware with stronger red-orange neon shield glow.

`foam_shield_station` replaces the earlier `cryo_guard_battery` art for `cream_soda_float` in horror mode. Its source sheet is `source/foam_shield_station-redo-v1-chromakey.png`, the transparent sheet is `transparent/foam_shield_station-redo-v1-transparent.png`, runtime frames are `runtime/item-horror-power_foam_shield_station_lv*_idle_SW_00.png`, and the review wreck is `runtime/item-horror-power_foam_shield_station_defeat_idle_SW_00.png`. The redo keeps the cozy Cream Soda Float cream, gold, caramel, red, and pale straw palette as metallic shield-station materials, with stronger cyan neon shield glow.

## Horror Power Source Batch 4 V1

The fourth four-at-a-time horror power-source batch adds `tide_turbo_source`, `pit_repair_reservoir`, `thermal_brine_reactor`, and `convoy_overcharger`. The source was generated as one 4x3 sheet with strong row/column gutters, then chroma-keyed and sliced into `192x192` runtime frames. These fuel-source evolution rows intentionally contain no detached particles, shell casings, motes, sparkles, debris, or loose objects; associated static munitions are packaged separately under `assets/particles`.

The source sheet lives at `source/horror-power-sources-batch4-v1-chromakey.png`; the transparent sheet lives at `transparent/horror-power-sources-batch4-v1-transparent.png`; runtime previews live at `runtime/item-horror-power_{slug}_evolution_SW_sheet.png`; active samples live at `runtime/item-horror-power_{slug}_lv1_idle_SW_00.png`, `runtime/item-horror-power_{slug}_lv2_idle_SW_00.png`, and `runtime/item-horror-power_{slug}_lv3_idle_SW_00.png`.

Horror-mode runtime wiring maps these power sources onto the next four drink/fuel systems only when the reality layer is active: `tidepool_espresso` uses `tide_turbo_source`, `avocado_lassi` uses `pit_repair_reservoir`, `chili_brine_tonic` uses `thermal_brine_reactor`, and `market_malt` uses `convoy_overcharger`. Cozy mode continues to use the original drink art.

## Horror Power Source Batch 5 V1

The fifth horror power-source batch expands to six lines: `maple_cloud_reactor`, `pearl_armor_core`, `kelp_turbo_cooler`, `nori_pop_powercell`, `harissa_brine_ampoule`, and `pretzel_shield_reservoir`. The source was generated as one 6x3 sheet with large gutters, then chroma-keyed and sliced into `192x192` runtime frames. The prompt emphasized distinct silhouettes so these do not read as repeated generic reactors: amber dome reactor, pearl shield sphere, green cooling fin tower, folded black powercell, red hazard ampoule, and bronze knot-shield reservoir. These fuel-source evolution rows intentionally contain no detached particles, shell casings, motes, sparkles, debris, or loose objects; associated static munitions are packaged separately under `assets/particles`.

The source sheet lives at `source/horror-power-sources-batch5-v1-chromakey.png`; the transparent sheet lives at `transparent/horror-power-sources-batch5-v1-transparent.png`; runtime previews live at `runtime/item-horror-power_{slug}_evolution_SW_sheet.png`; active samples live at `runtime/item-horror-power_{slug}_lv1_idle_SW_00.png`, `runtime/item-horror-power_{slug}_lv2_idle_SW_00.png`, and `runtime/item-horror-power_{slug}_lv3_idle_SW_00.png`.

Horror-mode runtime wiring maps these power sources onto the next six drink/fuel systems only when the reality layer is active: `maple_cloud_cocoa` uses `maple_cloud_reactor`, `pearl_biscuit_latte` uses `pearl_armor_core`, `kelp_cucumber_cooler` uses `kelp_turbo_cooler`, `nori_pop_slush` uses `nori_pop_powercell`, `harissa_morning_shot` uses `harissa_brine_ampoule`, and `pretzel_cream_soda` uses `pretzel_shield_reservoir`. Cozy mode continues to use the original drink art.

## Horror Power Source Batch 6 V1

The sixth horror power-source batch finishes the drink/fuel roster and replaces the alpha-damaged `pit_repair_reservoir` runtime art. It adds `boba_night_overdrive`, `pico_lime_repair_well`, and `night_bite_warcell`, while regenerating `pit_repair_reservoir` as a cleaner green/cream medical repair reservoir. The source was generated as one 4x3 sheet with large gutters, then chroma-keyed and sliced into `192x192` runtime frames. The prompt kept the rows visually distinct: medical repair reservoir, violet orb-overdrive, lime repair well, and black acid-green warcell. These fuel-source evolution rows intentionally contain no detached particles, shell casings, motes, sparkles, debris, or loose objects; associated static munitions are packaged separately under `assets/particles`.

The source sheet lives at `source/horror-power-sources-batch6-v1-chromakey.png`; the transparent sheet lives at `transparent/horror-power-sources-batch6-v1-transparent.png`; runtime previews live at `runtime/item-horror-power_{slug}_evolution_SW_sheet.png`; active samples live at `runtime/item-horror-power_{slug}_lv1_idle_SW_00.png`, `runtime/item-horror-power_{slug}_lv2_idle_SW_00.png`, and `runtime/item-horror-power_{slug}_lv3_idle_SW_00.png`.

Horror-mode runtime wiring maps these final power sources only when the reality layer is active: `boba_night_tea` uses `boba_night_overdrive`, `pico_lime_agua` uses `pico_lime_repair_well`, and `night_bite_energy` uses `night_bite_warcell`. `avocado_lassi` continues to use `pit_repair_reservoir`, now backed by the regenerated v2-quality runtime frames. Cozy mode continues to use the original drink art.

## Gap-Fill Drink Icons V1

The three drink icons added for the content-gap pass were generated with built-in image generation on a flat `#00ff00` background, converted with `remove_chroma_key.py`, then cropped into `192x192` transparent runtime icons:

- Chili Crunch Cola: `source/drink-icons-gap-v1-chromakey.png`, `transparent/drink-icons-gap-v1-transparent.png`, `runtime/chili_crunch_cola-v1.png`
- Pepper Broth: `source/drink-icons-gap-v1-chromakey.png`, `transparent/drink-icons-gap-v1-transparent.png`, `runtime/pepper_broth-v1.png`
- Abyssal Shake: `source/drink-icons-gap-v1-chromakey.png`, `transparent/drink-icons-gap-v1-transparent.png`, `runtime/abyssal_shake-v1.png`

## Grand Drink Evolutions V2

Drink evolutions should be generated as one wide three-form strip per drink, not as a crowded multi-row sheet. The v2 drink pass uses large chroma-key gutters between forms, minimal detached particles, and source strips under `source/*-grand-strip-v2-chromakey.png`. Each strip is converted to `transparent/*-grand-strip-v2-transparent.png`, then sliced into `runtime/*-grand-v2-lv1.png`, `runtime/*-grand-v2-lv2.png`, and `runtime/*-grand-v2-lv3.png`.

Garden Spritz uses a magenta `#ff00ff` source key so the green drink art survives background removal. The other drink strips use green `#00ff00`.

## Drink Additions Grand V1

The five drink-gap additions use the same one-wide-strip approach as Grand Drink Evolutions V2, with large gutters and minimal detached particles. Source strips live at `source/{cream_soda_float,tidepool_espresso,avocado_lassi,chili_brine_tonic,market_malt}-grand-strip-v1-chromakey.png`, transparent strips live at `transparent/*-grand-strip-v1-transparent.png`, and active runtime sprites live at `runtime/*-grand-v1-lv1.png`, `runtime/*-grand-v1-lv2.png`, and `runtime/*-grand-v1-lv3.png`.

Cream Soda Float and Avocado Lassi use magenta `#ff00ff` key backgrounds to protect pale/golden and green drink colors. Tidepool Espresso, Chili Brine Tonic, and Market Malt use green `#00ff00`.

## Drink Gap Round 2 Grand V1

The second drink-gap pass adds Maple Cloud Cocoa, Pearl Biscuit Latte, Kelp Cucumber Cooler, and Nori Pop Slush. Like the other grand drink additions, each drink was generated as its own wide three-form strip with large gutters and minimal particles. Source strips live at `source/{maple_cloud_cocoa,pearl_biscuit_latte,kelp_cucumber_cooler,nori_pop_slush}-grand-strip-v1-chromakey.png`, transparent strips live at `transparent/*-grand-strip-v1-transparent.png`, and active runtime sprites live at `runtime/*-grand-v1-lv1.png`, `runtime/*-grand-v1-lv2.png`, and `runtime/*-grand-v1-lv3.png`.

Kelp Cucumber Cooler and Nori Pop Slush used magenta `#ff00ff` keys because their subjects are green/teal. After hard key removal, those transparent strips received an extra magenta-fringe cleanup pass before slicing.

## Drink Gap Round 3 Grand V1

The third drink-gap pass adds Harissa Morning Shot, Pretzel Cream Soda, Boba Night Tea, and Pico Lime Agua. Each drink was generated as its own wide three-form strip with large gutters and minimal particles. Source strips live at `source/{harissa_morning_shot,pretzel_cream_soda,boba_night_tea,pico_lime_agua}-grand-strip-v1-chromakey.png`, transparent strips live at `transparent/*-grand-strip-v1-transparent.png`, and active runtime sprites live at `runtime/*-grand-v1-lv1.png`, `runtime/*-grand-v1-lv2.png`, and `runtime/*-grand-v1-lv3.png`.

Pico Lime Agua used a magenta `#ff00ff` key because the subject is green/lime-heavy. Harissa Morning Shot used a hard green-key pass plus green-edge cleanup after the soft matte retained a faint square background.

## Night Bite Energy Grand V1

Night Bite Energy was added as a Breakfast/Snack energy drink gap filler. The first wired version was extracted from a style-reference preview rather than a chroma-key strip: `source/night_bite_energy-grand-strip-v1-preview.png` was background-cut into `transparent/night_bite_energy-grand-strip-v1-transparent.png`, then sliced into `runtime/night_bite_energy-grand-v1-lv1.png`, `runtime/night_bite_energy-grand-v1-lv2.png`, and `runtime/night_bite_energy-grand-v1-lv3.png`.

## Bespoke Favorite Toppings V1

The favorite-topping flavor pass added six bespoke toppings as 6x3 sticker-style evolution art. The source sheet is `source/bespoke-toppings-v1-chromakey.png`, the transparent sheet is `transparent/bespoke-toppings-v1-transparent.png`, and active runtime sprites live under `runtime/*-sticker-v1-lv1.png`, `runtime/*-sticker-v1-lv2.png`, and `runtime/*-sticker-v1-lv3.png` for Scallion Oil, Gochugaru Flakes, Dill Sprig, Sesame Seeds, Cinnamon Sugar, and Milk Tea Foam.

This sheet uses a magenta `#ff00ff` source key to protect the green herb/scallion art. The final runtime slices keep a 192x192 frame with at least 18px transparent margin and zero corner alpha.
