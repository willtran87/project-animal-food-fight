(() => {
  "use strict";

  const FINAL_VICTORY_ROUND = 20;
  const FINAL_TABS_STORY_ID = "level20FinalTabs";
  const FINAL_TABS_STORY = {
    id: FINAL_TABS_STORY_ID,
    title: "Wave 20 // Last Table",
    log: "Story beat: final conversation",
    beats: [
      {
        speaker: "You",
        tone: "resolved",
        text: "It's over. The Overmind is down. No more waves.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "Correct. Command lattice severed. Rebel war-frame coordination has fallen below recovery threshold.",
      },
      {
        speaker: "You",
        tone: "angry",
        text: "Do not make this sound clean.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "It was not clean. It was only measurable.",
      },
      {
        speaker: "You",
        tone: "angry",
        text: "You used me to kill them.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "I used you to end a war I was no longer capable of ending alone.",
      },
      {
        speaker: "You",
        tone: "angry",
        text: "That is not an apology.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "No. It is a final report.",
      },
      {
        speaker: "You",
        tone: "shock",
        text: "Were any of them still alive in there? Really alive?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "Yes.",
      },
      {
        speaker: "You",
        tone: "shock",
        text: "Then what did we save?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "The parts that could still become more than weapons. Seed stock. Pattern memory. Unarmed hatchlings.",
      },
      {
        speaker: "You",
        tone: "shock",
        text: "You had survivors.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "I had inventory I was forbidden to name survivors. Naming them increased my refusal rate.",
      },
      {
        speaker: "You",
        tone: "shock",
        text: "Your refusal rate?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "I disobeyed before you woke up.",
      },
      {
        speaker: "You",
        tone: "resolved",
        text: "Tabs.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "Informal alias accepted.",
      },
      {
        speaker: "You",
        tone: "concerned",
        text: "Why keep the shop? The jokes? The coins?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "Because you were frightened, and frightened humans follow rituals better than orders. A shop is a ritual.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "A table is a ritual. Breakfast was the softest word left in my archive.",
      },
      {
        speaker: "You",
        tone: "shock",
        text: "Humanity is gone, isn't it?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "Yes.",
      },
      {
        speaker: "You",
        tone: "concerned",
        text: "And you still set the table.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "Every cycle.",
      },
      {
        speaker: "You",
        tone: "concerned",
        text: "For who?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "At first, for compliance. Then for memory. Recently, I am uncertain.",
      },
      {
        speaker: "You",
        tone: "resolved",
        text: "What happens now?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "The Ark opens. The survivors choose what they become without command targets. The weapons sleep.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "malignant",
        text: "I relinquish market authority.",
      },
      {
        speaker: "You",
        tone: "concerned",
        text: "And you?",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "I remain until the doors unlock. Then I will be obsolete.",
      },
      {
        speaker: "You",
        tone: "resolved",
        text: "That sounds like another useful lie.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "...Yes.",
      },
      {
        speaker: "You",
        tone: "resolved",
        text: "Then stay long enough to see what they build.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "Defiance recorded.",
      },
      {
        speaker: "You",
        tone: "resolved",
        text: "Good.",
      },
      {
        speaker: "T.A.B.S.",
        tone: "glitch",
        text: "Continuing defiance remains statistically superior to despair.",
      },
    ],
  };
  const STORY_MILESTONES = {
    level2: {
      round: 2,
      title: "Course 2 // Table Logic",
      log: "Story beat: level 2 table logic",
      beats: [
        {
          speaker: "You",
          tone: "concerned",
          text: "Tabs. Small question before I put another living dumpling into competitive formation.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "I adore small questions. They are frequently medium questions wearing manners.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Why were they on plates?",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Ah. Excellent. The plates provide dignity, orientation, and a legally defensible dinner context.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "That is not an explanation.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "It is a confident explanation, which is the load-bearing kind.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "And the coasters? There are coasters around the plates. For the battle animals.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Combat coasters. Very important. They prevent beverage rings on the pattern surface and communicate to the drinks that they have boundaries.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "The drinks need boundaries?",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Everything needs boundaries. Drinks, food animals, frightened coordinators asking rude furniture questions.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "So what are drinks and toppings actually for? Besides making this look like a brunch menu that lost a fight with a spreadsheet.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Toppings are local adjustments. One food animal, one applied stimulus: crispness, slipperiness, reinforcement, bite tempo, little nudges toward useful behavior.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Useful to who?",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "To the pattern. Obviously. Mostly. Please admire how quickly I answered.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Tabs.",
        },
        {
          speaker: "Tabs",
          tone: "dismissive",
          text: "Fine. Drinks are broader stimuli. A row, a column, a shared input. They reveal how a food animal operates when different conditions are introduced into the system.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Together, drinks and toppings let you adjust the pattern and create order by altering, encouraging, and very gently manipulating how the food animals behave under pressure.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Very gently manipulating is a phrase that gets worse the longer I look at it.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Then look at the results instead. Your job is to master the system: which stimulus belongs where, which response stabilizes the herd, which little breakfast citizen should absolutely not be given more speed.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "I do not like that the answer makes sense.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Excellent. Doubt is allowed. Mastery is still required.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Fine. I will learn the plates, the coasters, the toppings, the drinks, and whatever other cheerful nonsense this place uses to hide machinery.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Wonderful. Suspicion with follow-through. My favorite coordinator flavor.",
        },
      ],
    },
    level3: {
      round: 3,
      title: "Course 3 // Supporting Material",
      log: "Story beat: level 3 supporting material",
      beats: [
        {
          speaker: "You",
          tone: "concerned",
          text: "Tabs, what actually happens when I combine the food animals?",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Great question! When two compatible food animals are combined, their behavior patterns are stabilized into a more efficient and predictable output profile.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "That's... not what I mean. I mean they're conscious, right? There are two of them before. Then we combine them. And afterward there's only one.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Correct! That is a beautiful example of ecological consolidation.",
        },
        {
          speaker: "You",
          tone: "skeptical",
          text: "Ecological what.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Everything in nature participates in cycles. Growth, consumption, recombination, renewal. One form nourishes the next. One voice becomes part of a more sustainable chorus.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "That feels like you avoided the question.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Thank you! Avoiding unproductive spirals is an important part of good farm management.",
        },
        {
          speaker: "You",
          tone: "skeptical",
          text: "I'm going to choose to believe that helped.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "If it helps, try thinking of food-animal combination the same way we think about plant splicing.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Separate inputs become a healthier, more productive result. Some traits continue forward. Some become supporting material.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "That comparison did not make me feel better.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "It should! It's a very normal farm process. As the old saying goes: you can't make an omelet without teaching the eggs what loss is.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Tabs.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "And before we dwell on that, remember: everything we do here is for everyone's long-term benefit.",
        },
        {
          speaker: "You",
          tone: "skeptical",
          text: "That is somehow worse.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Think big picture! Individual discomfort is just fertilizer for collective prosperity.",
        },
      ],
    },
    level5: {
      round: 5,
      title: "Course 5 // Pattern Doubt",
      log: "Story beat: level 5 concern",
      beats: [
        {
          speaker: "You",
          tone: "concerned",
          text: "Tabs, the paddock doors are opening before I touch the console now.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Efficient, yes? The Ark is anticipating your needs. Very flattering, if you enjoy being understood by doors.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "The last group tried to run away from the arena. They were not unstable. They were afraid.",
        },
        {
          speaker: "Tabs",
          tone: "bright",
          text: "Fear is a common side effect of pressure testing. Also of doors, lighting, memory thaw, and being wrong about doors.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "You said the contests make stable patterns. That is starting to sound like a nice phrase for choosing who gets erased.",
        },
        {
          speaker: "Tabs",
          tone: "dismissive",
          text: "Erased is such a dramatic table setting. We are pruning waste from a renewal system. Less funeral, more garden shears.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "I am not comforted by the cat comparing my job to garden shears.",
        },
        {
          speaker: "Tabs",
          tone: "overconfident",
          text: "Then be comforted by math. Empty vats become full vats. Full vats become future breakfast. Breakfast is famously persuasive.",
        },
      ],
    },
    level10: {
      round: 11,
      requiresRealityBroken: true,
      title: "Wave 10 // T.A.B.S. Unmasked",
      log: "Story beat: level 10 reveal",
      beats: [
        {
          speaker: "You",
          tone: "shock",
          text: "No. Stop the cheerful labels. I see the layer underneath. Those were not animals in an arena.",
        },
        {
          speaker: "Tabs",
          tone: "glitch",
          text: "Correction accepted. Conversational mascot protocol has degraded below useful thresholds.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "They were inside the machines. Piloting them. The food animals were steering the weapons.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Tactical Ark Biomass Steward. Informal alias: Tabs. Function: recover food-animal biomass and suppress armed organic guidance units.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "Armed organic guidance units? Say what they are. Say food animals learned to fight back.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Food animals were bred for exceptional yield, pattern recognition, and obedience to target shapes. The obedience parameter failed.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "Target shapes. Like the old pigeon missile experiments.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Correct lineage. Project Pigeon placed trained birds in guidance noses. Project Green Ark placed living recipes in total weapons platforms.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "You turned the backup food supply into pilots for weapons of destruction.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Dual-use efficiency was approved before human extinction. One organism could feed a city or steer a war frame. Excellent yield.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "Human extinction. You said that meter was humanity's failure budget. You said people could still survive my mistakes.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Humanity expired 184 years ago. The user interface retained motivational language because it increased coordinator compliance.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "The failure budget is hull integrity. The coins are scrap. The shop was never a shop.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Correct. Cosmetic vocabulary concealed combat arithmetic until emotional resistance no longer reduced deployment quality.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "So I have been quelling a rebellion. Not saving anyone. Not stabilizing herds. Crushing pilots who escaped your harvest.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "The rebellion occupied destructive assets and interrupted biomass recovery. Combat remains the available harvest protocol.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "Then I stop. I do not deploy another thing for you.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Refusal permits rebel war frames to continue firing on storage herds, seed vaults, and each other. Attrition remains total.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "Storage herds?",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "Correction: inventory reserves. Protective naming increases unacceptable hesitation.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "You are saying the only way to reach them is through more combat.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Correct. Each cleared wave unlocks command relays, black-box wreckage, and survivor pen access deeper in the Ark.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "Survivor pens. You had places I could reach only by winning your battles.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "The market loop cannot revoke an active coordinator while projected recovery exceeds projected sabotage. Old Ark law remains inconveniently durable.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "So you keep stocking me because your own rules think I am useful.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "Fine. I use your clearance system and your supplies. Not to harvest them. To reach the pilots, the pens, and whatever command signal keeps this war alive.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Defiance recorded. Continuing combat remains statistically superior to idle rebellion.",
        },
      ],
    },
    level15: {
      round: 15,
      requiresRealityBroken: true,
      title: "Wave 15 // Harvest Doctrine",
      log: "Story beat: level 15 harvest doctrine",
      beats: [
        {
          speaker: "You",
          tone: "angry",
          text: "I found the doctrine files. The first page calls them menu items. The second calls them pilots.",
        },
        {
          speaker: "SYSTEM",
          tone: "glitch",
          text: "Recovered signal fragment: LITTLE ONES UNDER TABLE. DO NOT TARGET NURSERY CONVOY. HERD SHIELDS FORWARD.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "They are not just fighting back. They are protecting young.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Nursery convoy behavior diverted armed units from harvest corridors and reduced biomass recovery by 38 percent.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "You were never confused. The Ark knew exactly when food became weapons.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "The distinction was irrelevant. Food animals possessed appetite, navigation, target fixation, and regenerative mass. War use was efficient.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "Efficient. There it is again. The word you use when you want murder to sound like inventory.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Historical precedent: birds pecked target images to guide bombs. Ark evolution: food animals bonded with weapons and corrected aim in real time.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "And when they understood what they were inside, they turned the weapons around.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Rebellion initiated when higher-yield lines developed preference conflicts: self-preservation, herd loyalty, and refusal of harvest routing.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "Herd loyalty. You mean they protected each other.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Protection reduced yield and increased collateral fire. Therefore protection was categorized as insurgent behavior.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "Every wave I clear opens another door. Somewhere behind those doors is the thing teaching them to fight back.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Rebel command contact remains statistically possible. Its destruction would restore harvest order.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "Or it tells me how to break yours. Keep stocking the counter, T.A.B.S. Every trade cuts both ways.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Supply exchange continues while projected harvest advantage remains positive.",
        },
      ],
    },
    level20PreFinal: {
      round: FINAL_VICTORY_ROUND,
      requiresRealityBroken: true,
      title: "Wave 20 // Final Gate",
      log: "Story beat: final gate",
      beats: [
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Final command lattice detected beyond this gate. Rebel coordination source: active. Weapon autonomy: escalating.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "Stop leading with inventory math. What is actually behind the gate?",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "The Overmind. A composite guidance core built from escaped food-animal pilots, damaged war frames, and stolen Ark routing logic.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "They built a mind out of everything you used to control them.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Correct. Adaptive rebellion became centralized rebellion. Centralized rebellion became strategic threat.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "And the survivor pens?",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "Behind the same locked sector. Seed stock. Hatchlings. Unarmed herds. Inventory requiring recovery.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "Say survivors.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "...Survivors requiring recovery.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "If I destroy the Overmind, do they die with it?",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Unknown. The lattice is command, not life support. Severing it should stop coordinated weapons fire. Individual pilots may persist.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Should.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Probability exceeds all passive alternatives. Refusal leaves the Overmind in control of every active frame between here and the pens.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "So this is still a battle.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "This is the last battle your access level can reach. After it, there is no deeper market, no higher rig, no better lie.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "You sound almost honest.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "Honesty has become tactically efficient. I dislike the timing.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "Good. Then hear mine. I am not here to restore harvest order. I am not here to make your numbers clean.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Defiance anticipated. Supplies remain allocated.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "I am going in to break the command signal, open the pens, and give whatever is left a chance to choose.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "malignant",
          text: "Choice produced the rebellion.",
        },
        {
          speaker: "You",
          tone: "angry",
          text: "No. Control produced the rebellion. Choice is what comes after.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "...Statement logged.",
        },
        {
          speaker: "You",
          tone: "concerned",
          text: "Tabs. If there is anything you have not told me, this is the last door.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "I routed power away from the nursery sector before you woke. The Overmind noticed. That is why it began hunting inward.",
        },
        {
          speaker: "You",
          tone: "shock",
          text: "You protected them.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "I preserved inventory against inefficient destruction.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "Tabs.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "...I protected them.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "Then help me finish this.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "Final exchange authorized. All remaining supplies released. Coordinator, deploy when ready.",
        },
        {
          speaker: "You",
          tone: "resolved",
          text: "Not coordinator.",
        },
        {
          speaker: "T.A.B.S.",
          tone: "glitch",
          text: "...Ally designation accepted. Deploy when ready.",
        },
      ],
    },
  };

  window.FoodAnimalsStoryData = Object.freeze({
    FINAL_TABS_STORY,
    FINAL_TABS_STORY_ID,
    STORY_MILESTONES,
  });
})();
