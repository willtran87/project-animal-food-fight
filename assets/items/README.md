# Item Art Pipeline

Generated item and drink icons use the same project-local workflow as animal sprites: a flat chroma-key source image in `source/`, a transparent intermediate in `transparent/`, and individual runtime PNGs in `runtime/`.

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

## Bespoke Favorite Toppings V1

The favorite-topping flavor pass added six bespoke toppings as 6x3 sticker-style evolution art. The source sheet is `source/bespoke-toppings-v1-chromakey.png`, the transparent sheet is `transparent/bespoke-toppings-v1-transparent.png`, and active runtime sprites live under `runtime/*-sticker-v1-lv1.png`, `runtime/*-sticker-v1-lv2.png`, and `runtime/*-sticker-v1-lv3.png` for Scallion Oil, Gochugaru Flakes, Dill Sprig, Sesame Seeds, Cinnamon Sugar, and Milk Tea Foam.

This sheet uses a magenta `#ff00ff` source key to protect the green herb/scallion art. The final runtime slices keep a 192x192 frame with at least 18px transparent margin and zero corner alpha.
