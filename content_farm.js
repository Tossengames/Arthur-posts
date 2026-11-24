/* =====================================================================
   content_farm.js  —  ALL TOPICS FOR farm2.html
   ---------------------------------------------------------------------
   TO ADD A TOPIC: copy the TEMPLATE below into NEW_TOPICS (right here
   at the top), fill it in, save. The workflow picks it up by itself.
   Captions use *stars* to highlight words (shown in a different colour).
   "c" = on-screen caption lines, "v" = what the voice says (keep it short:
   about 6 to 11 words, so the whole reel stays under 30 seconds).
   ===================================================================== */

const NEW_TOPICS = [
  // ↓↓↓ PASTE NEW TOPICS HERE ↓↓↓

  /* TEMPLATE (remove the slashes-stars to use it)
  {
    id: 'carrots',                 // unique, no spaces
    kind: 'grow',                  // 'grow' or 'homestead' (used to rotate content types)
    cat: '26',                     // YouTube category (26 = Howto & Style)
    name: 'Carrots in a bucket',   // short name, also shown as "NEXT:" on the last card
    seoTitle: 'How to grow carrots in a bucket (no garden needed)',   // YouTube title (#Shorts is added)
    hook: 'No garden? You can still grow carrots.',                   // first line of the description
    keywords: ['container carrots', 'small space garden'],
    tags: '#carrots #containergardening #homestead',
    footer: 'Tiny space, real food.',

    // LOOK:  crop = tomato | pepper | basil | micro | onion | strawberry | lettuce | potato | worm
    //        box  = bucket | pot | tray | box | bag | bin | jar | tower
    //        mode = seedling | seeds | tuber | bulbs | worms   (how the planting step looks)
    crop: 'lettuce', box: 'bucket', mode: 'seeds',
    sets: ['balcony', 'backyard'],       // windowsill | balcony | backyard | kitchen | coop (barn)
    tall: false,                         // true if the plant gets tall (moves the captions)
    days: 70, unit: 'DAY',               // the time-lapse calendar counts 1 to this number (unit 'WEEK' also works)

    // BEATS (in this order in the video). Hooks: one is picked at random.
    hooks: [
      { c: ['NO GARDEN?', 'GROW *CARROTS*'], v: 'No garden? Grow carrots in a bucket.' },
    ],
    need: { v: 'You need a deep bucket, potting mix and seeds.',
            items: [['bucket', 'Deep bucket'], ['soil', 'Potting mix'], ['seeds', 'Carrot seeds']] },
    // step actions: drill | fill | plant | water | sun | stack (tower) | feed (bin) | hill (bag). opt:1 = sometimes skipped
    steps: [
      { a: 'fill',  c: ['FILL WITH *LOOSE*', 'SOIL'],      v: 'Fill it with loose soil.' },
      { a: 'plant', c: ['SPRINKLE *SEEDS*'],               v: 'Sprinkle the seeds on top.' },
      { a: 'water', c: ['KEEP IT *DAMP*'],                 v: 'Keep the soil damp.' },
    ],
    grow:   { c: ['WATCH IT *GROW*'], v: 'Give it a couple of months.' },        // optional
    stat:   { big: '70', c: ['DAYS TO', '*HARVEST*'], icon: 'clock', v: 'About seventy days to harvest.' },  // optional. icon = sun | clock | worms | bucket
    tip:    { c: ['THIN THE *SEEDLINGS*'], v: 'Thin the seedlings so roots have room.', target: 'base' },       // optional. target = top | mid | base
    payoff: { c: ['*SWEET* CARROTS', 'FROM A BUCKET'], v: 'Sweet carrots, from one bucket.' }
  },
  */

  // ↑↑↑ PASTE NEW TOPICS ABOVE THIS LINE ↑↑↑
];

/* ===================== BUILT-IN TOPICS ===================== */
const BUILTIN_TOPICS = [
{ id:'tomato', kind:'grow', cat:'26', name:'Bucket tomatoes',
  seoTitle:'How to grow tomatoes in a bucket (no yard needed)', hook:'No yard? You can still grow tomatoes.',
  keywords:['container tomatoes','bucket garden','small space garden'], tags:'#tomatoes #containergardening #homestead #gardening', footer:'Tiny space, real food.',
  crop:'tomato', box:'bucket', mode:'seedling', tall:true, sets:['balcony','backyard','coop'], days:70, unit:'DAY',
  hooks:[{c:['NO YARD?','GROW *TOMATOES*'],v:'No yard? Grow tomatoes in a bucket.'},{c:['ONE BUCKET.','*LOADS* OF TOMATOES'],v:'One bucket can give you loads of tomatoes.'},{c:['TINY SPACE.','*HUGE* HARVEST'],v:'Tiny space, huge harvest.'}],
  need:{v:'You need a big bucket, a drill, potting mix, and one tomato plant.',items:[['bucket','5-gal bucket'],['drill','Drill'],['soil','Potting mix'],['seedling','Tomato plant']]},
  steps:[{a:'drill',opt:1,c:['DRILL *DRAINAGE*','HOLES IN THE BASE'],v:'Drill drainage holes in the bottom.'},{a:'fill',c:['FILL WITH *RICH*','POTTING MIX'],v:'Fill it with rich potting mix.'},{a:'plant',c:['BURY THE STEM','*DEEP*'],v:'Bury the stem deep, so it grows extra roots.'},{a:'water',c:['WATER WHEN THE','TOP INCH IS *DRY*'],v:'Water when the top inch feels dry.'},{a:'sun',opt:1,c:['GIVE IT *6+ HOURS*','OF SUN'],v:'Give it six or more hours of sun.'}],
  grow:{c:['WATCH IT *GROW*'],v:'Give it a few weeks, and watch it go.'},
  stat:{big:'5',c:['GALLONS IS THE','*MINIMUM* BUCKET'],icon:'bucket',v:'Five gallons is the minimum. Bigger is better.'},
  tip:{c:['PINCH OFF THE','*SUCKERS*'],v:'Pinch off the suckers to keep it tidy.',target:'mid'},
  payoff:{c:['FRESH *TOMATOES*','FROM ONE BUCKET'],v:'Fresh tomatoes, from one bucket.'} },

{ id:'basil', kind:'grow', cat:'26', name:'Windowsill herbs',
  seoTitle:'Grow fresh basil on your windowsill (easy for beginners)', hook:'Fresh herbs, no garden needed.',
  keywords:['windowsill herbs','indoor herb garden','grow basil'], tags:'#basil #herbs #indoorgarden #gardening', footer:'Fresh flavor, tiny space.',
  crop:'basil', box:'pot', mode:'seeds', sets:['windowsill','kitchen'], days:40, unit:'DAY',
  hooks:[{c:['NO GARDEN?','GROW *HERBS* INDOORS'],v:'No garden? Grow herbs on your windowsill.'},{c:['FRESH *BASIL*','ON YOUR WINDOWSILL'],v:'Fresh basil, right on your windowsill.'},{c:['STOP BUYING','*HERBS*'],v:'Stop buying herbs. Grow them.'}],
  need:{v:'You need a pot, potting mix, and basil seeds.',items:[['pot','Pot with holes'],['soil','Potting mix'],['seeds','Basil seeds'],['can','Water']]},
  steps:[{a:'fill',c:['FILL A POT WITH','*POTTING MIX*'],v:'Fill a pot with potting mix.'},{a:'plant',c:['SPRINKLE SEEDS','& *LIGHTLY* COVER'],v:'Sprinkle seeds, and cover them lightly.'},{a:'water',c:['WATER *GENTLY*','KEEP IT DAMP'],v:'Water gently, and keep it damp.'},{a:'sun',c:['PUT IT IN A','*SUNNY* WINDOW'],v:'Put it in a sunny window.'}],
  stat:{big:'6',c:['HOURS OF *LIGHT*','A DAY'],icon:'sun',v:'Basil wants about six hours of light.'},
  tip:{c:['PINCH OFF *FLOWERS*','TO KEEP LEAVES COMING'],v:'Pinch off flowers to keep leaves coming.',target:'top'},
  payoff:{c:['*FRESH BASIL*','ALL SUMMER'],v:'Fresh basil, all summer long.'} },

{ id:'micro', kind:'grow', cat:'26', name:'Microgreens in a week',
  seoTitle:'Grow microgreens at home in 7 days (no garden)', hook:'Fresh greens in just one week.',
  keywords:['microgreens','indoor gardening','grow food fast'], tags:'#microgreens #indoorgarden #growyourownfood #gardening', footer:'Fast food, tiny space.',
  crop:'micro', box:'tray', mode:'seeds', sets:['kitchen','windowsill'], days:7, unit:'DAY', sc:1.3,
  hooks:[{c:['READY IN','*ONE WEEK*'],v:'Fresh greens, ready in one week.'},{c:['*MICROGREENS*','ON YOUR COUNTER'],v:'Grow microgreens right on your counter.'},{c:['NO GARDEN?','NO PROBLEM'],v:'No garden? No problem.'}],
  need:{v:'You need a shallow tray, soil, and radish seeds.',items:[['tray','Shallow tray'],['soil','Soil or coir'],['seeds','Radish seeds'],['can','Spray bottle']]},
  steps:[{a:'fill',c:['FILL A TRAY WITH','*1 INCH* OF SOIL'],v:'Fill a tray with an inch of soil.'},{a:'plant',c:['SPRINKLE SEEDS','*THICK*'],v:'Sprinkle the seeds thick.'},{a:'water',c:['MIST UNTIL','*DAMP*'],v:'Mist until damp.'},{a:'sun',c:['MOVE TO *LIGHT*','AFTER 3 DAYS'],v:'After three days, move it to the light.'}],
  stat:{big:'7',c:['DAYS TO','*HARVEST*'],icon:'clock',v:'About seven days to harvest.'},
  tip:{c:['SNIP WITH *SCISSORS*','ABOVE THE SOIL'],v:'Snip with scissors, just above the soil.',target:'top',r:200},
  payoff:{c:['*FRESH GREENS*','IN ONE WEEK'],v:'Fresh greens, in one week.'} },

{ id:'onion', kind:'grow', cat:'26', name:'Regrow green onions',
  seoTitle:'Regrow green onions from scraps (free food forever)', hook:'Never buy green onions again.',
  keywords:['regrow vegetables','kitchen scraps','green onions'], tags:'#greenonions #regrow #kitchenscraps #frugal', footer:'Free food from scraps.',
  crop:'onion', box:'jar', mode:'bulbs', sets:['kitchen','windowsill'], days:10, unit:'DAY',
  hooks:[{c:['*REGROW*','GREEN ONIONS'],v:'Regrow green onions from scraps.'},{c:['FREE *FOOD*','FROM SCRAPS'],v:'Free food, from your kitchen scraps.'},{c:['STOP BUYING','*GREEN ONIONS*'],v:'Stop buying green onions.'}],
  need:{v:'You need the root ends, a glass jar, and water.',items:[['bulbs','Onion ends'],['jar','Glass jar'],['can','Fresh water']]},
  steps:[{a:'plant',c:['STAND THE ROOTS','*DOWN* IN A JAR'],v:'Stand the roots down in a jar.'},{a:'water',c:['COVER THE *ROOTS*','ONLY'],v:'Cover only the roots with water.'},{a:'sun',c:['SET IT IN A','*BRIGHT* SPOT'],v:'Set it in a bright spot.'}],
  stat:{big:'1',c:['*WEEK* UNTIL YOU','CAN CUT AGAIN'],icon:'clock',v:'In about a week, you can cut again.'},
  tip:{c:['CHANGE THE WATER','*EVERY 2 DAYS*'],v:'Change the water every two days.',target:'base'},
  payoff:{c:['*ENDLESS*','GREEN ONIONS'],v:'Endless green onions, from scraps.'} },

{ id:'strawberry', kind:'grow', cat:'26', name:'Strawberry tower',
  seoTitle:'Grow strawberries on a balcony with a pot tower', hook:'Short on space? Grow up, not out.',
  keywords:['vertical garden','strawberry tower','balcony garden'], tags:'#strawberries #verticalgarden #balconygarden #gardening', footer:'Sweet berries, tiny corner.',
  crop:'strawberry', box:'tower', mode:'seedling', tall:true, sets:['balcony','backyard'], days:60, unit:'DAY',
  hooks:[{c:['*STRAWBERRIES*','ON A BALCONY'],v:'Strawberries, on a balcony.'},{c:['GROW *UP*','NOT OUT'],v:'Short on space? Grow up, not out.'},{c:['SMALL SPACE?','GO *VERTICAL*'],v:'Small space? Go vertical.'}],
  need:{v:'You need stacking pots, potting mix, and strawberry plants.',items:[['pot','Stacking pots'],['soil','Potting mix'],['seedling','Strawberry plants'],['can','Water']]},
  steps:[{a:'stack',c:['STACK POTS *BIGGEST*','TO SMALLEST'],v:'Stack the pots, biggest to smallest.'},{a:'fill',c:['FILL EACH WITH','*SOIL*'],v:'Fill each one with soil.'},{a:'plant',c:['PLANT *EVERY EDGE*'],v:'Plant every edge.'},{a:'water',c:['WATER *FROM*','THE TOP'],v:'Water from the top.'}],
  stat:{big:'6-8',c:['HOURS OF *SUN*','A DAY'],icon:'sun',v:'Give them six to eight hours of sun.'},
  tip:{c:['PINCH OFF *RUNNERS*','FOR BIGGER BERRIES'],v:'Pinch off runners for bigger berries.',target:'base',r:230},
  payoff:{c:['SWEET *BERRIES*','FROM A TINY CORNER'],v:'Sweet berries, from a tiny corner.'} },

{ id:'lettuce', kind:'grow', cat:'26', name:'Salad window box',
  seoTitle:'Grow a salad in a window box (4 weeks to harvest)', hook:'Fresh salad, from a window box.',
  keywords:['window box','grow lettuce','salad garden'], tags:'#lettuce #salad #windowbox #gardening', footer:'Salad in four weeks.',
  crop:'lettuce', box:'box', mode:'seeds', sets:['windowsill','balcony','kitchen'], days:28, unit:'DAY',
  hooks:[{c:['*SALAD*','FROM A WINDOW BOX'],v:'Grow a salad in a window box.'},{c:['GROW *LETTUCE*','IN 4 WEEKS'],v:'Grow lettuce in four weeks.'},{c:['NO YARD?','GROW *SALAD*'],v:'No yard? Grow salad.'}],
  need:{v:'You need a window box, potting mix, and lettuce seeds.',items:[['box','Window box'],['soil','Potting mix'],['seeds','Lettuce seeds'],['can','Water']]},
  steps:[{a:'fill',c:['FILL THE BOX WITH','*POTTING MIX*'],v:'Fill the box with potting mix.'},{a:'plant',c:['SPRINKLE SEEDS','*THINLY*'],v:'Sprinkle the seeds thinly.'},{a:'water',c:['KEEP SOIL','*MOIST*'],v:'Keep the soil moist.'},{a:'sun',c:['BRIGHT BUT *COOL*','PART SUN WORKS'],v:'Bright but cool. Part sun works.'}],
  stat:{big:'4',c:['*WEEKS* TO FIRST','BABY LEAVES'],icon:'clock',v:'Four weeks to your first baby leaves.'},
  tip:{c:['PICK THE *OUTER*','LEAVES FIRST'],v:'Pick the outer leaves first, and it keeps growing.',target:'mid',r:250},
  payoff:{c:['*FRESH SALAD*','ALL SEASON'],v:'Fresh salad, all season.'} },

{ id:'potato', kind:'grow', cat:'26', name:'Potatoes in a bag',
  seoTitle:'Grow potatoes in a bag (no garden needed)', hook:'You can grow potatoes in a bag.',
  keywords:['grow bag potatoes','container potatoes','small space garden'], tags:'#potatoes #growbag #containergardening #homestead', footer:'Dig your own dinner.',
  crop:'potato', box:'bag', mode:'tuber', tall:true, sets:['backyard','balcony','coop'], days:90, unit:'DAY',
  hooks:[{c:['*POTATOES*','IN A BAG'],v:'Grow potatoes in a bag.'},{c:['NO YARD?','GROW *SPUDS*'],v:'No yard? Grow spuds.'},{c:['ONE BAG.','*SO MANY* SPUDS'],v:'One bag. So many spuds.'}],
  need:{v:'You need a grow bag, potting mix, and seed potatoes.',items:[['bag','Grow bag'],['soil','Potting mix'],['tuber','Seed potatoes'],['can','Water']]},
  steps:[{a:'fill',c:['ADD *6 INCHES*','OF SOIL'],v:'Add six inches of soil.'},{a:'plant',c:['DROP IN','*SEED POTATOES*'],v:'Drop in your seed potatoes.'},{a:'water',c:['COVER & *WATER*','WELL'],v:'Cover them, and water well.'},{a:'hill',c:['ADD SOIL AS','IT *GROWS*'],v:'Add more soil as it grows.'}],
  stat:{big:'3',c:['*MONTHS* TO','HARVEST'],icon:'clock',v:'About three months to harvest.'},
  tip:{c:['TIP THE BAG','OUT TO *HARVEST*'],v:'Tip the bag out to harvest.',target:'base',r:220},
  payoff:{c:['*FRESH POTATOES*','FROM ONE BAG'],v:'Fresh potatoes, from one bag.'} },

{ id:'worm', kind:'homestead', cat:'26', name:'Worm bin compost',
  seoTitle:'Start a worm bin: free compost from kitchen scraps', hook:'Worms turn your scraps into gold.',
  keywords:['worm bin','vermicompost','compost small space'], tags:'#wormbin #composting #vermicomposting #homestead', footer:'Free compost, zero waste.',
  crop:'worm', box:'bin', mode:'worms', fillKind:'paper', sets:['kitchen','coop','balcony'], days:12, unit:'WEEK',
  hooks:[{c:['*FREE* COMPOST','UNDER THE SINK'],v:'Free compost, right under your sink.'},{c:['WORMS EAT','YOUR *TRASH*'],v:'Worms will eat your trash.'},{c:['TURN SCRAPS','INTO *GOLD*'],v:'Turn kitchen scraps into gold.'}],
  need:{v:'You need a plastic bin, shredded paper, red wigglers, and scraps.',items:[['bin','Plastic bin'],['paper','Shredded paper'],['worms','Red wigglers'],['scraps','Kitchen scraps']]},
  steps:[{a:'fill',c:['FILL WITH *SHREDDED*','PAPER'],v:'Fill it with shredded paper.'},{a:'water',c:['MOISTEN LIKE A','*WRUNG* SPONGE'],v:'Moisten it like a wrung out sponge.'},{a:'plant',c:['ADD *RED*','*WIGGLERS*'],v:'Add your red wigglers.'},{a:'feed',c:['FEED *SCRAPS*','NO MEAT OR DAIRY'],v:'Feed scraps. No meat or dairy.'}],
  stat:{big:'½',c:['THEIR WEIGHT IN','*SCRAPS* DAILY'],icon:'worms',v:'Worms can eat half their weight daily.'},
  tip:{c:['BURY SCRAPS','TO *STOP* FLIES'],v:'Bury the scraps to stop flies.',target:'base',r:260},
  payoff:{c:['*BLACK GOLD*','FOR YOUR PLANTS'],v:'Black gold, for your plants.'} },

{ id:'pepper', kind:'grow', cat:'26', name:'Peppers in a pot',
  seoTitle:'Grow peppers in a pot on a balcony', hook:'Peppers love pots.',
  keywords:['container peppers','balcony garden','grow peppers'], tags:'#peppers #balconygarden #containergardening #gardening', footer:'Spicy, in small spaces.',
  crop:'pepper', box:'pot', mode:'seedling', tall:true, sets:['balcony','windowsill','backyard'], days:75, unit:'DAY',
  hooks:[{c:['*PEPPERS*','IN A POT'],v:'Grow peppers in a pot.'},{c:['SMALL SPACE?','GROW *PEPPERS*'],v:'Small space? Grow peppers.'},{c:['PEPPERS','ON A *BALCONY*'],v:'Yes, peppers grow on a balcony.'}],
  need:{v:'You need a pot, potting mix, and one pepper plant.',items:[['pot','Pot with holes'],['soil','Potting mix'],['seedling','Pepper plant'],['can','Water']]},
  steps:[{a:'fill',c:['FILL WITH *RICH*','POTTING MIX'],v:'Fill it with rich potting mix.'},{a:'plant',c:['PLANT AT THE','*SAME DEPTH*'],v:'Plant at the same depth.'},{a:'water',c:['WATER *DEEPLY*','THEN LET IT DRY'],v:'Water deeply, then let it dry a little.'},{a:'sun',c:['LOTS OF *WARMTH*','& SUN'],v:'Give it lots of warmth and sun.'}],
  stat:{big:'6-8',c:['HOURS OF *SUN*','IS IDEAL'],icon:'sun',v:'Six to eight hours of sun is ideal.'},
  tip:{c:['PICK *EARLY*','FOR MORE PEPPERS'],v:'Pick early for more peppers.',target:'mid'},
  payoff:{c:['*PEPPERS*','ALL SEASON'],v:'Peppers, all season long.'} }
];

const STORIES = [...NEW_TOPICS, ...BUILTIN_TOPICS];
