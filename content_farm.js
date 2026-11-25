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
    payoff: { c: ['*SWEET* CARROTS', 'FROM A BUCKET'], v: 'Sweet carrots, from one bucket.' },

    // OPTIONAL: makes this topic eligible for the long "full guide" video (1 to 3 min)
    long: {
      d: { fill: 'One extra sentence about this step.', plant: 'Another detail.' },      // key = step action
      points: [   // 5 to 7 beats. label: MISTAKE | PRO TIP | GOOD TO KNOW | MYTH.  v = 15 to 25 words
        { label: 'MISTAKE', c: ['TOO *SHALLOW*'], v: 'Carrots need depth. A shallow pot gives short, twisted roots.', target: 'base' },
      ],
      recap: 'Deep pot, loose soil, and patience.'
    }
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

/* ===================== FULL GUIDE (1-3 min) DATA FOR BUILT-IN TOPICS =====================
   For your own topics, put this inside the topic as:   long: { d:{...}, points:[...], recap:'...' }
   d      = one extra sentence per step action (added to that step's voice in the full guide)
   points = 5 to 7 beats: label (MISTAKE | PRO TIP | GOOD TO KNOW | MYTH), c (caption), v (voice, 15 to 25 words), target (top | mid | base)
   recap  = one closing sentence before "Follow for more"                                           */
const LONG_DATA = {
tomato:{d:{drill:'Without drainage, roots sit in water and rot. Five or six holes is plenty.',fill:'Skip garden soil. A light potting mix drains better and keeps the roots airy.',plant:'Tomatoes grow roots all along a buried stem, so a deeper plant gets a stronger base.',water:'Deep, steady watering beats little sips. Swings from dry to soaked can crack the fruit.',sun:'Tomatoes need full sun to set fruit. Turn the bucket now and then so it grows evenly.'},
 points:[
  {label:'MISTAKE',c:['BUCKET TOO *SMALL*'],v:'The most common mistake is a bucket that is too small. Five gallons is the minimum, and bigger gives a bigger harvest.',target:'base'},
  {label:'PRO TIP',c:['ADD A *STAKE*','OR CAGE'],v:'Add a stake or cage early. Tall tomato vines get heavy, and tying them up keeps the fruit off the soil.',target:'top'},
  {label:'GOOD TO KNOW',c:['FEED EVERY *2 WEEKS*'],v:'Containers run out of nutrients fast. Feed with a tomato fertilizer every couple of weeks once flowers appear.',target:'mid'},
  {label:'MISTAKE',c:['DO NOT *OVERWATER*'],v:'Soggy soil is the other big mistake. Push a finger into the soil, and only water when the top inch is dry.',target:'base'},
  {label:'PRO TIP',c:['MULCH THE *TOP*'],v:'Cover the soil with a layer of straw or leaves. It holds moisture and keeps the roots cooler in summer.',target:'base'},
  {label:'GOOD TO KNOW',c:['PICK WHEN *FULLY RED*'],v:'Pick when the fruit is fully colored and slightly soft. Fresh off the vine, they taste far better than store tomatoes.',target:'mid'}],
 recap:'So that is it. A bucket, good soil, deep planting, steady water, and plenty of sun.'},
basil:{d:{fill:'Pick a pot with drainage holes. Basil hates wet feet.',plant:'Basil seeds need light to sprout, so press them in and barely cover them.',water:'Water gently so you do not wash the seeds away.',sun:'A south facing window is best. Turn the pot every few days so it grows straight.'},
 points:[
  {label:'MISTAKE',c:['NO *DRAINAGE*'],v:'The classic mistake is a pot with no drainage holes. Standing water rots basil roots fast.',target:'base'},
  {label:'PRO TIP',c:['PINCH THE *TOPS*'],v:'Pinch the top pair of leaves just above a leaf junction. The plant splits into two stems and grows bushy instead of tall.',target:'top'},
  {label:'GOOD TO KNOW',c:['KEEP IT *WARM*'],v:'Basil loves warmth. Below about ten degrees Celsius it sulks, so keep it away from cold glass at night.',target:'mid'},
  {label:'MISTAKE',c:['DO NOT LET IT *BOLT*'],v:'When flower spikes appear, the leaves turn bitter. Pinch them off right away to keep the flavor sweet.',target:'top'},
  {label:'PRO TIP',c:['HARVEST *OFTEN*'],v:'Picking often tells the plant to grow more. Take leaves from the top, and never strip the whole plant.',target:'mid'},
  {label:'GOOD TO KNOW',c:['START *NEW POTS*'],v:'Sow a fresh pot every few weeks, and you will never run out of basil.',target:'base'}],
 recap:'A warm window, a pot that drains, and regular pinching. That is the whole secret.'},
micro:{d:{fill:'Any clean tray with drainage works. One inch of soil or coconut coir is enough.',plant:'Spread the seeds thickly, nearly touching. Microgreens do not need space like normal plants.',water:'Mist until the soil is damp, not flooded. Stack another tray on top for the first couple of days.',sun:'Once they sprout, give them bright light so the stems turn green and sturdy.'},
 points:[
  {label:'MISTAKE',c:['TOO *WET*'],v:'Overwatering is the top mistake. Soggy trays grow mold. Water from the bottom, and let air move around them.',target:'base'},
  {label:'PRO TIP',c:['SOAK *BIG SEEDS*'],v:'Soak large seeds like peas overnight. They sprout faster and more evenly.',target:'base'},
  {label:'GOOD TO KNOW',c:['RADISH IS *EASY*'],v:'Radish, broccoli, and sunflower are great beginner seeds. Radish is ready in about a week.',target:'mid'},
  {label:'PRO TIP',c:['CUT *ABOVE* THE SOIL'],v:'Cut just above the soil with clean scissors. Rinse, dry, and store them in the fridge.',target:'top'},
  {label:'GOOD TO KNOW',c:['NO *FERTILIZER*'],v:'You do not need fertilizer. The seed holds all the energy it needs for the first week.',target:'base'},
  {label:'PRO TIP',c:['SOW *EVERY WEEK*'],v:'Start a new tray every few days, and you will have fresh greens on the table all the time.',target:'mid'}],
 recap:'A tray, some soil, and seeds. Fresh greens in a week.'},
onion:{d:{plant:'Cut the white root end about an inch above the roots, and keep the roots whole.',water:'Keep only the roots under water. If the whole bulb sits in water, it can rot.',sun:'Put the jar on a bright windowsill. Green shoots show up in just a few days.'},
 points:[
  {label:'MISTAKE',c:['TOO MUCH *WATER*'],v:'Do not drown the bulb. The water should cover the roots only, or the base turns slimy.',target:'base'},
  {label:'PRO TIP',c:['CHANGE THE *WATER*'],v:'Swap the water every two days to keep it fresh and clean smelling.',target:'base'},
  {label:'GOOD TO KNOW',c:['CUT, DO NOT *PULL*'],v:'Snip the green tops with scissors, and leave the white part. It keeps growing back.',target:'top'},
  {label:'GOOD TO KNOW',c:['LEEKS AND *CELERY*'],v:'The same trick works with leeks, celery bases, and lettuce stumps. Free food from scraps.',target:'mid'},
  {label:'PRO TIP',c:['MOVE TO *SOIL*'],v:'After a couple of weeks, you can plant them in a pot of soil for stronger, thicker growth.',target:'base'},
  {label:'MISTAKE',c:['NO *SUNLIGHT*'],v:'Dark corners make weak, pale shoots. A bright window makes them grow strong and green.',target:'top'}],
 recap:'Roots in water, a bright window, and a fresh swap every two days.'},
strawberry:{d:{stack:'Use pots that get smaller as you go up, so each level leaves a ring of soil to plant in.',fill:'Use a light potting mix. Strawberries like soil that drains well but stays slightly moist.',plant:'Keep the crown level with the soil. Burying it can rot the plant.',water:'Water from the top, and let it trickle down through every level.'},
 points:[
  {label:'MISTAKE',c:['BURIED *CROWNS*'],v:'Keep the crown, where leaves meet roots, level with the soil. Plant it too deep, and it rots.',target:'base'},
  {label:'PRO TIP',c:['PICK *RIPE* BERRIES'],v:'Wait until berries are fully red. They do not ripen after picking, so patience pays.',target:'mid'},
  {label:'GOOD TO KNOW',c:['NET *THE BIRDS*'],v:'Birds love berries as much as you do. A little net over the tower keeps your harvest safe.',target:'top'},
  {label:'MISTAKE',c:['TOP LEVEL *DRIES* FAST'],v:'The top pot dries out first. Check it every day in hot weather.',target:'top'},
  {label:'PRO TIP',c:['FEED *LIGHTLY*'],v:'Feed with a berry fertilizer when flowers show up. Too much nitrogen makes leaves instead of fruit.',target:'mid'},
  {label:'GOOD TO KNOW',c:['REPLACE *EVERY 3 YEARS*'],v:'Strawberry plants slow down after about three years. Replace them with fresh runners.',target:'base'}],
 recap:'Stack, plant, water from the top, and enjoy sweet berries all season.'},
lettuce:{d:{fill:'A window box at least six inches deep is perfect for lettuce.',plant:'Lettuce seeds are tiny. Scatter them, and press them in lightly. They like some light to sprout.',water:'Water often with a gentle spray. Lettuce has shallow roots and hates drying out.',sun:'Lettuce likes cool weather. In hot summers give it some afternoon shade.'},
 points:[
  {label:'MISTAKE',c:['TOO *HOT*'],v:'Heat makes lettuce bolt and turn bitter. In summer, move the box into afternoon shade.',target:'top'},
  {label:'PRO TIP',c:['THIN *SEEDLINGS*'],v:'When seedlings are two inches tall, thin them so each plant has room. Eat the thinnings as baby greens.',target:'base'},
  {label:'PRO TIP',c:['CUT AND *COME AGAIN*'],v:'Harvest the outer leaves and leave the center. The plant keeps making new leaves for weeks.',target:'mid'},
  {label:'GOOD TO KNOW',c:['MIX *VARIETIES*'],v:'Plant loose leaf lettuce in different colors. It grows fast, and it looks beautiful.',target:'mid'},
  {label:'MISTAKE',c:['DO NOT *CROWD*'],v:'Crowded plants fight for light and invite disease. Space gives bigger, healthier leaves.',target:'base'},
  {label:'PRO TIP',c:['SOW *EVERY 2 WEEKS*'],v:'Sow a fresh row every two weeks for non stop salad.',target:'top'}],
 recap:'Cool, moist, and cut often. That is how you keep salad coming.'},
potato:{d:{fill:'Start with just a few inches of soil at the bottom, and roll the bag sides down.',plant:'Cut large seed potatoes into pieces with at least two eyes, and let them dry for a day.',water:'Water well, but never let the bag sit in soggy soil.',hill:'As the shoots grow, add soil to cover all but the top leaves. More buried stem means more potatoes.'},
 points:[
  {label:'MISTAKE',c:['GROCERY *SPUDS*'],v:'Store bought potatoes are often treated to stop sprouting. Buy certified seed potatoes for the best results.',target:'base'},
  {label:'PRO TIP',c:['CHIT *FIRST*'],v:'Set seed potatoes in a bright spot for two weeks until short sprouts appear. They get a head start.',target:'base'},
  {label:'MISTAKE',c:['KEEP THEM *COVERED*'],v:'Potatoes that see light turn green and bitter. Keep every tuber buried.',target:'base'},
  {label:'GOOD TO KNOW',c:['TRY *EARLY* VARIETIES'],v:'Early varieties are ready in about ten weeks, and they are great for bags.',target:'mid'},
  {label:'PRO TIP',c:['WATER *CONSISTENTLY*'],v:'Even watering gives smooth potatoes. Big swings between dry and wet cause cracks.',target:'mid'},
  {label:'GOOD TO KNOW',c:['WAIT FOR *YELLOW*'],v:'When the leaves turn yellow and die back, the potatoes are ready. Tip the bag out, and enjoy the treasure hunt.',target:'top'}],
 recap:'A bag, soil, seed potatoes, and a little patience.'},
worm:{d:{fill:'Moist, fluffy bedding gives worms air and a place to live. Tear paper into thin strips.',water:'Damp bedding helps worms breathe through their skin. Too wet, and the bin gets smelly.',plant:'Red wigglers, not garden earthworms, are the ones that thrive in a bin.',feed:'Start small. Chop scraps, bury them, and add more only once the last batch is mostly gone.'},
 points:[
  {label:'MISTAKE',c:['TOO *MUCH* FOOD'],v:'Overfeeding is the number one mistake. Extra scraps rot, and the bin starts to smell.',target:'base'},
  {label:'GOOD TO KNOW',c:['WHAT *NOT* TO ADD'],v:'Skip meat, dairy, and oil, and go easy on salty food. Citrus and onions only in small amounts.',target:'base'},
  {label:'PRO TIP',c:['CHOP *SMALL*'],v:'Smaller pieces break down faster, so the worms eat them sooner.',target:'mid'},
  {label:'PRO TIP',c:['KEEP IT *DARK*'],v:'Worms hate light. Keep the lid on, and keep the bin out of direct sun and frost.',target:'top'},
  {label:'GOOD TO KNOW',c:['THE *TEA*'],v:'The dark liquid that drains out is called worm tea. Dilute it, and use it to feed your plants.',target:'base'},
  {label:'GOOD TO KNOW',c:['HARVEST AFTER *3 MONTHS*'],v:'In a few months, the bedding turns into dark, crumbly compost. Move it to one side, and the worms follow the fresh food.',target:'mid'}],
 recap:'Bedding, moisture, worms, and small meals. That is a worm bin.'},
pepper:{d:{fill:'Use a pot at least ten to twelve inches wide, with good drainage.',plant:'Plant at the same depth as the nursery pot. Unlike tomatoes, peppers do not root from the stem.',water:'Water deeply, and let the top inch dry out. Constant soggy soil causes root rot.',sun:'Peppers love heat. Put them in the sunniest, warmest spot you have.'},
 points:[
  {label:'MISTAKE',c:['PLANTING *TOO EARLY*'],v:'Peppers hate cold. Wait until nights stay above about ten degrees Celsius before moving them outside.',target:'base'},
  {label:'PRO TIP',c:['PINCH THE *FIRST FLOWERS*'],v:'Pinch off the very first flowers. The plant puts energy into roots, and gives bigger harvests later.',target:'top'},
  {label:'GOOD TO KNOW',c:['STAKE *THE PLANT*'],v:'Fruit gets heavy. A small stake stops branches from snapping.',target:'mid'},
  {label:'MISTAKE',c:['UNEVEN *WATERING*'],v:'Dry spells followed by floods stress the plant, and can cause blossom end rot.',target:'base'},
  {label:'PRO TIP',c:['PICK *GREEN OR RIPE*'],v:'You can pick peppers green, or wait for them to turn red, sweeter, and often hotter. Both are good.',target:'mid'},
  {label:'GOOD TO KNOW',c:['TRY *COMPACT* TYPES'],v:'Compact varieties like cherry peppers and small hot peppers do best in pots.',target:'top'}],
 recap:'Warmth, sun, deep watering, and a pot with room. Peppers will do the rest.'}
};
BUILTIN_TOPICS.forEach(t=>{ if(LONG_DATA[t.id] && !t.long) t.long = LONG_DATA[t.id]; });

/* ===================== ALTERNATE VOICE PHRASINGS =====================
   Key = an exact voice line (v). Value = other ways to say it. The engine picks one at random every video.
   You can add alternates for any line, or give a line directly as an array:  v: ['Version one.', 'Version two.']   */
const VOICE_ALTS = {
'Fill it with rich potting mix.':['Add rich potting mix, right up to the top.','Fill it up with good potting mix.'],
'Drill drainage holes in the bottom.':['Start by drilling drainage holes in the bottom.','Drill a few holes in the base, so extra water can escape.'],
'Bury the stem deep, so it grows extra roots.':['Plant it deep. Tomatoes grow roots along the buried stem.','Bury the stem, and it will grow extra roots.'],
'Water when the top inch feels dry.':['Check the soil, and water once the top inch is dry.','Only water when the top inch of soil feels dry.'],
'Give it six or more hours of sun.':['Put it where it gets six or more hours of sun.','Find a spot with at least six hours of sun.'],
'Pinch off the suckers to keep it tidy.':['Pinch off the little suckers between the branches.','Remove the suckers, so the plant stays tidy.'],
'Fresh tomatoes, from one bucket.':['Fresh tomatoes, from a single bucket.','That is a bucket full of fresh tomatoes.'],
'Five gallons is the minimum. Bigger is better.':['Go for five gallons at least. Bigger is better.','Do not go smaller than five gallons.'],
'Fill a pot with potting mix.':['Start by filling a pot with potting mix.','Fill a pot with fresh potting mix.'],
'Sprinkle seeds, and cover them lightly.':['Scatter the seeds, and cover them with a thin layer of soil.','Sprinkle some seeds, and barely cover them.'],
'Water gently, and keep it damp.':['Water gently, and keep the soil damp.','Give it a gentle watering, and keep it moist.'],
'Put it in a sunny window.':['Set it in your sunniest window.','Find a sunny window for it.'],
'Basil wants about six hours of light.':['Basil needs around six hours of light a day.','Give basil about six hours of light.'],
'Pinch off flowers to keep leaves coming.':['Pinch off any flower buds, and the leaves keep coming.','Remove flowers as they appear, to keep the leaves tasty.'],
'Fresh basil, all summer long.':['Fresh basil, all summer.','Enough basil for pasta night, all summer long.'],
'Fill a tray with an inch of soil.':['Fill a tray with about an inch of soil.','Add an inch of soil to a shallow tray.'],
'Sprinkle the seeds thick.':['Spread the seeds thickly.','Scatter the seeds thick, almost touching.'],
'Mist until damp.':['Mist the soil until it is damp.','Spray with water until the soil is damp.'],
'After three days, move it to the light.':['After about three days, bring it into the light.','Once it sprouts, move it into bright light.'],
'About seven days to harvest.':['It takes about a week to harvest.','Around seven days, and they are ready.'],
'Snip with scissors, just above the soil.':['Cut with scissors, just above the soil.','Use scissors, and snip right above the soil.'],
'Fresh greens, in one week.':['Fresh greens, in just a week.','A week from now, you are eating fresh greens.'],
'Stand the roots down in a jar.':['Put the roots down in a jar.','Stand the root ends in a jar, roots down.'],
'Cover only the roots with water.':['Add water, just enough to cover the roots.','Pour in water to cover the roots only.'],
'Set it in a bright spot.':['Put the jar in a bright spot.','Give it a bright windowsill.'],
'In about a week, you can cut again.':['In about a week, you can harvest again.','Within a week, you can snip some more.'],
'Change the water every two days.':['Swap the water every couple of days.','Refresh the water every two days.'],
'Endless green onions, from scraps.':['Green onions, from scraps, again and again.','Never buy green onions again.'],
'Stack the pots, biggest to smallest.':['Stack the pots, largest at the bottom.','Build the tower, biggest pot first.'],
'Fill each one with soil.':['Add soil to each level.','Fill every pot with potting mix.'],
'Plant every edge.':['Plant a berry plant in every gap.','Tuck plants into every edge.'],
'Water from the top.':['Water from the top, and let it trickle down.','Pour water in at the top.'],
'Sweet berries, from a tiny corner.':['Sweet berries, from one small corner.','A whole berry patch, in a tiny corner.'],
'Fill the box with potting mix.':['Fill the window box with potting mix.','Add potting mix to the box.'],
'Sprinkle the seeds thinly.':['Scatter the seeds thinly.','Sprinkle the seeds, not too thick.'],
'Keep the soil moist.':['Keep the soil evenly moist.','Water often, to keep the soil moist.'],
'Fresh salad, all season.':['Fresh salad, all season long.','Salad for weeks, from one box.'],
'Add six inches of soil.':['Start with six inches of soil.','Put six inches of soil in the bag.'],
'Drop in your seed potatoes.':['Place your seed potatoes on top.','Set the seed potatoes in.'],
'Cover them, and water well.':['Cover with soil, and water well.','Bury them, then give them a good soak.'],
'Add more soil as it grows.':['Keep adding soil as the plant grows.','As it grows, add more soil.'],
'Fresh potatoes, from one bag.':['Fresh potatoes, from a single bag.','A bag full of homegrown potatoes.'],
'Fill it with shredded paper.':['Fill the bin with shredded paper.','Add plenty of shredded paper.'],
'Add your red wigglers.':['Add the red wigglers.','Now, add your worms.'],
'Feed scraps. No meat or dairy.':['Feed kitchen scraps, but no meat or dairy.','Add scraps. Skip meat and dairy.'],
'Black gold, for your plants.':['Black gold for your garden.','Free compost, for your plants.'],
'Plant at the same depth.':['Plant it at the same depth.','Keep it at the same depth as the nursery pot.'],
'Give it lots of warmth and sun.':['Give it plenty of warmth and sun.','Put it somewhere warm and sunny.'],
'Peppers, all season long.':['Peppers, all season.','Fresh peppers, all season long.'],
'Pick early for more peppers.':['Pick early, and you get more peppers.','Harvest early, and the plant makes more.'],
'Fill a big pot with potting mix.':['Start with a big pot of potting mix.','Fill a large pot with potting mix.'],
'Water well, and keep them out of harsh sun for a few days.':['Water well, and give them a few days out of harsh sun.']
};
const SHORT_NAMES = {tomato:'tomatoes',basil:'basil',micro:'microgreens',onion:'green onions',strawberry:'strawberries',lettuce:'lettuce',potato:'potatoes',worm:'worm bins',pepper:'peppers'};

BUILTIN_TOPICS.forEach(t=>{ if(!t.short && SHORT_NAMES[t.id]) t.short = SHORT_NAMES[t.id]; });

/* ===================== MORE TOPICS ===================== */
const HK=(c,v)=>({c,v}), STP=(a,c,v,opt)=>({a,c,v,opt}), PT=(label,c,v,target)=>({label,c,v,target});
const MORE_TOPICS = [
{ id:'cherry', kind:'grow', cat:'26', name:'Cherry tomatoes in a pot', short:'cherry tomatoes',
  seoTitle:'Grow cherry tomatoes in a pot (balcony friendly)', hook:'Snack straight off the vine, even on a balcony.',
  keywords:['cherry tomatoes','container garden','balcony garden'], tags:'#cherrytomatoes #balconygarden #containergardening #gardening', footer:'Sweet snacks, tiny space.',
  crop:'tomato', look:{fs:.5,fn:7}, box:'pot', mode:'seedling', tall:true, sets:['balcony','backyard','windowsill'], days:60, unit:'DAY',
  hooks:[HK(['NO YARD?','GROW *CHERRY TOMATOES*'],'No yard? Grow cherry tomatoes in a pot.'),HK(['SNACK *STRAIGHT*','OFF THE VINE'],'Snack straight off the vine, right on your balcony.'),HK(['ONE POT.','*HANDFULS* OF TOMATOES'],'One pot can give you handfuls of cherry tomatoes.')],
  need:{items:[['pot','Big pot'],['soil','Potting mix'],['seedling','Cherry tomato plant'],['can','Water']]},
  steps:[STP('fill',['FILL A *BIG POT*','WITH POTTING MIX'],'Fill a big pot with potting mix.'),STP('plant',['PLANT IT *DEEP*'],'Plant it deep, up to the first set of leaves.'),STP('water',['WATER WHEN THE','TOP INCH IS *DRY*'],'Water deeply when the top inch is dry.'),STP('sun',['SIX TO EIGHT HOURS','OF *SUN*'],'Give it six to eight hours of sun.',1)],
  stat:{big:'6-8',c:['HOURS OF *SUN*','FOR SWEET FRUIT'],icon:'sun',v:'Six to eight hours of sun makes the sweetest fruit.'},
  tip:{c:['PICK *OFTEN*'],v:['Pick ripe ones often. The plant keeps making more.','Keep picking, and the plant keeps producing.'],target:'mid'},
  payoff:{c:['*SWEET* SNACKS','FROM ONE POT'],v:['Sweet snacks, from one pot.','One pot, and you are snacking all summer.']},
  long:{points:[PT('MISTAKE',['POT TOO *SMALL*'],'Cherry tomatoes still need room. Aim for a pot that holds at least five gallons.','base'),PT('PRO TIP',['ADD A *CAGE*'],'Add a cage or stake early, so the vines have something to climb.','top'),PT('MISTAKE',['UNEVEN *WATERING*'],'Uneven watering makes the fruit split. Keep the soil evenly moist.','base'),PT('GOOD TO KNOW',['FEED *EVERY 2 WEEKS*'],'Once flowers show up, feed every couple of weeks with a tomato fertilizer.','mid')],recap:'Big pot, deep planting, steady water, and lots of sun.'} },

{ id:'chili', kind:'grow', cat:'26', name:'Chili peppers on a windowsill', short:'chili peppers',
  seoTitle:'Grow chili peppers on a windowsill (all year heat)', hook:'Yes, you can grow chili peppers indoors.',
  keywords:['chili peppers','indoor garden','windowsill garden'], tags:'#chili #peppers #indoorgarden #windowsill', footer:'Homegrown heat.',
  crop:'pepper', look:{ripe:'#ff3b30',fs:.6}, box:'pot', mode:'seedling', tall:true, sets:['windowsill','kitchen','balcony'], days:90, unit:'DAY',
  hooks:[HK(['GROW *CHILIES*','INDOORS'],'Yes, you can grow chili peppers indoors.'),HK(['SPICE UP','YOUR *WINDOWSILL*'],'Spice up your windowsill with your own chili peppers.'),HK(['FRESH *HEAT*','ALL YEAR'],'Fresh heat, all year round.')],
  need:{items:[['pot','Small pot'],['soil','Potting mix'],['seedling','Chili plant'],['can','Water']]},
  steps:[STP('fill',['FILL WITH *LIGHT*','POTTING MIX'],'Fill a pot with light potting mix.'),STP('plant',['PLANT AT THE','*SAME DEPTH*'],'Plant at the same depth as its nursery pot.'),STP('water',['LET THE TOP INCH','*DRY OUT*'],'Let the top inch dry out between waterings.'),STP('sun',['FIND YOUR','*SUNNIEST* WINDOW'],'Find the sunniest window you have.')],
  stat:{big:'8',c:['HOURS OF *LIGHT*','IS IDEAL'],icon:'sun',v:'Chilies want lots of light, around eight hours.'},
  tip:{c:['KEEP IT *WARM*'],v:'Chilies love warmth. Keep them away from cold drafts.',target:'base'},
  payoff:{c:['*HOMEGROWN*','HEAT'],v:'Homegrown heat, from a tiny pot.'},
  long:{points:[PT('MISTAKE',['OVER*WATERING*'],'Soggy soil is the number one killer of chili plants. Let the top inch dry out first.','base'),PT('PRO TIP',['SHAKE THE *FLOWERS*'],'Indoors there is no wind. Gently shake the plant so the flowers can set fruit.','top'),PT('GOOD TO KNOW',['BE *PATIENT*'],'Chilies can take a few months to ripen. They change color from green to red as they mature.','mid'),PT('PRO TIP',['PICK *RIPE* ONES'],'Picking ripe chilies encourages the plant to make more.','mid')],recap:'Warmth, light, and patience. That is how you grow chilies.'} },

{ id:'tomseed', kind:'grow', cat:'26', name:'Start tomatoes from seed', short:'starting tomato seeds',
  seoTitle:'How to start tomatoes from seed (indoors, easy)', hook:'Tomato plants for the price of a seed packet.',
  keywords:['start seeds indoors','tomato seeds','seed starting'], tags:'#seedstarting #tomatoes #gardening #growyourown', footer:'Grow your own from seed.',
  crop:'tomato', box:'pot', mode:'seeds', sets:['windowsill','kitchen'], days:56, unit:'DAY',
  hooks:[HK(['START *TOMATOES*','FROM SEED'],'Start tomatoes from seed, and save money.'),HK(['A *PACKET*','MAKES DOZENS'],'One seed packet makes dozens of tomato plants.'),HK(['SEEDS TO *PLANTS*','INDOORS'],'Turn tiny seeds into strong plants, indoors.')],
  need:{items:[['pot','Small pots'],['soil','Seed mix'],['seeds','Tomato seeds'],['can','Spray bottle']]},
  steps:[STP('fill',['FILL WITH *SEED*','STARTING MIX'],'Fill small pots with seed starting mix.'),STP('plant',['PRESS SEEDS IN','*1/4 INCH* DEEP'],'Press the seeds in about a quarter inch deep.'),STP('water',['MIST TO KEEP IT','*DAMP*'],'Mist to keep the soil damp, not soggy.'),STP('sun',['GIVE THEM','*BRIGHT* LIGHT'],'Give them bright light as soon as they sprout.')],
  stat:{big:'6-8',c:['WEEKS HEAD START','BEFORE *PLANTING OUT*'],icon:'clock',v:'Start seeds six to eight weeks before you plant outside.'},
  tip:{c:['KEEP SEEDS *WARM*'],v:'Tomato seeds sprout best in warm soil, around twenty five degrees Celsius.',target:'base'},
  payoff:{c:['*YOUR OWN*','TOMATO PLANTS'],v:'Your own tomato plants, for the price of a seed packet.'},
  long:{points:[PT('MISTAKE',['NOT ENOUGH *LIGHT*'],'Weak light makes tall, floppy seedlings. Bright light keeps them short and sturdy.','top'),PT('PRO TIP',['FAN *THE SEEDLINGS*'],'A gentle breeze from a small fan makes the stems stronger.','mid'),PT('GOOD TO KNOW',['HARDEN *OFF*'],'Before planting out, give seedlings a week of gradual outdoor time to toughen them up.','base'),PT('MISTAKE',['OVER*WATERING*'],'Soggy soil causes damping off, which can kill seedlings overnight. Keep it just damp.','base')],recap:'Warm, bright, and gently watered. That is how seedlings thrive.'} },

{ id:'mint', kind:'grow', cat:'26', name:'Mint in a pot', short:'mint',
  seoTitle:'Grow mint in a pot (so it does not take over)', hook:'Grow mint without letting it take over.',
  keywords:['grow mint','herb garden','container herbs'], tags:'#mint #herbs #containergardening #gardening', footer:'Fresh mint, zero chaos.',
  crop:'basil', look:{leaf:['#6fdc8c','#46c777']}, box:'pot', mode:'seedling', sets:['windowsill','kitchen','balcony'], days:30, unit:'DAY',
  hooks:[HK(['GROW *MINT*','WITHOUT THE CHAOS'],'Grow mint in a pot, so it does not take over.'),HK(['FRESH *MINT*','FOR TEA'],'Fresh mint for tea, right outside your door.'),HK(['MINT *LOVES*','POTS'],'Mint loves a pot, and your garden will thank you.')],
  need:{items:[['pot','Pot with holes'],['soil','Potting mix'],['seedling','Mint plant'],['can','Water']]},
  steps:[STP('fill',['FILL A POT WITH','*POTTING MIX*'],'Fill a pot with potting mix.'),STP('plant',['KEEP IT *IN A POT*'],'Plant it in a pot, never straight in the ground.'),STP('water',['KEEP IT *MOIST*'],'Mint likes moist soil, so water often.'),STP('sun',['MORNING *SUN*','AFTERNOON SHADE'],'Morning sun and afternoon shade is perfect.')],
  tip:{c:['TRIM *OFTEN*'],v:'Trim the tips often. It makes the plant bushy.',target:'top'},
  payoff:{c:['*ENDLESS*','FRESH MINT'],v:'Endless fresh mint.'},
  long:{points:[PT('MISTAKE',['PLANTED IN THE *GROUND*'],'Mint spreads by runners, and can take over a garden. A pot keeps it under control.','base'),PT('PRO TIP',['CUT BACK *HARD*'],'Cut it back by a third now and then. New growth is softer and tastier.','top'),PT('GOOD TO KNOW',['FLOWERS *FEED BEES*'],'Mint flowers feed bees, so let a few bloom. Just trim the rest.','top'),PT('MISTAKE',['LET IT *DRY OUT*'],'Mint wilts fast when dry. Check the pot every day in hot weather.','base')],recap:'A pot, plenty of water, and regular trims.'} },

{ id:'parsley', kind:'grow', cat:'26', name:'Parsley in a pot', short:'parsley',
  seoTitle:'Grow parsley in a pot (slow to sprout, worth it)', hook:'Parsley is slow, but worth the wait.',
  keywords:['grow parsley','container herbs','herb garden'], tags:'#parsley #herbs #containergardening', footer:'Patience pays off.',
  crop:'basil', look:{leaf:['#2f9a45','#3aa64a']}, box:'pot', mode:'seeds', sets:['windowsill','kitchen','balcony'], days:60, unit:'DAY',
  hooks:[HK(['FRESH *PARSLEY*','IN A POT'],'Grow fresh parsley in a pot.'),HK(['SLOW SEEDS.','*WORTH IT*'],'Parsley seeds are slow, but worth the wait.')],
  need:{items:[['pot','Deep pot'],['soil','Potting mix'],['seeds','Parsley seeds'],['can','Water']]},
  steps:[STP('fill',['FILL A *DEEP* POT'],'Fill a deep pot with potting mix.'),STP('plant',['SOW SEEDS','*1/4 INCH* DEEP'],'Sow the seeds a quarter inch deep.'),STP('water',['KEEP IT *MOIST*'],'Keep the soil moist. Parsley is slow to sprout.'),STP('sun',['BRIGHT LIGHT,','SOME *SHADE*'],'Give it bright light, with some afternoon shade.')],
  stat:{big:'3',c:['*WEEKS* TO SPROUT'],icon:'clock',v:'Be patient. Parsley can take three weeks to sprout.'},
  tip:{c:['SOAK *SEEDS* FIRST'],v:'Soak the seeds overnight in warm water to speed up sprouting.',target:'base'},
  payoff:{c:['*PARSLEY*','ALMOST ALL YEAR'],v:'Parsley, almost all year round.'},
  long:{points:[PT('MISTAKE',['GIVING UP *TOO SOON*'],'Parsley seeds are slow. Do not toss the pot after a week.','base'),PT('PRO TIP',['PICK *OUTER* STEMS'],'Cut the outer stems at the base, and the center keeps producing.','mid'),PT('GOOD TO KNOW',['GO *DEEP*'],'Parsley has a long taproot, so choose a pot at least eight inches deep.','base'),PT('MISTAKE',['TOO *HOT*'],'Hot afternoon sun makes it bolt. Give it some shade in summer.','top')],recap:'Deep pot, soaked seeds, and patience.'} },

{ id:'cilantro', kind:'grow', cat:'26', name:'Cilantro in a window box', short:'cilantro',
  seoTitle:'Grow cilantro without it bolting (window box)', hook:'Cilantro without the bolting drama.',
  keywords:['grow cilantro','bolting','window box herbs'], tags:'#cilantro #herbs #windowbox #gardening', footer:'Taco night, sorted.',
  crop:'basil', look:{leaf:['#7fdc8a','#5fcf6f']}, box:'box', mode:'seeds', sets:['windowsill','balcony','kitchen'], days:28, unit:'DAY',
  hooks:[HK(['GROW *CILANTRO*','WITHOUT BOLTING'],'Grow cilantro without it going to seed too fast.'),HK(['FRESH *CILANTRO*','FOR TACO NIGHT'],'Fresh cilantro for taco night, from a window box.')],
  need:{items:[['box','Window box'],['soil','Potting mix'],['seeds','Cilantro seeds'],['can','Water']]},
  steps:[STP('fill',['FILL THE BOX WITH','*POTTING MIX*'],'Fill a window box with potting mix.'),STP('plant',['SCATTER SEEDS','& *THINLY* COVER'],'Scatter seeds, and cover with a thin layer of soil.'),STP('water',['KEEP SOIL','*MOIST*'],'Keep the soil moist.'),STP('sun',['MORNING SUN,','*AFTERNOON SHADE*'],'Give it morning sun, and shade from the hot afternoon.')],
  stat:{big:'4',c:['*WEEKS* TO','HARVEST'],icon:'clock',v:'About four weeks to your first harvest.'},
  tip:{c:['SOW *EVERY 3 WEEKS*'],v:'Sow a fresh batch every three weeks, because cilantro bolts quickly.',target:'base'},
  payoff:{c:['*FRESH CILANTRO*','ALL SEASON'],v:'Fresh cilantro for months.'},
  long:{points:[PT('MISTAKE',['TOO MUCH *HEAT*'],'Heat makes cilantro bolt. Grow it in spring and fall, or give it shade.','top'),PT('PRO TIP',['EAT THE *SEEDS* TOO'],'When it bolts, let it flower. The seeds are coriander, and you can use them.','top'),PT('PRO TIP',['CUT *LEAVES* EARLY'],'Harvest when plants are four to six inches tall, from the outside in.','mid'),PT('MISTAKE',['MOVING *SEEDLINGS*'],'Cilantro hates root disturbance. Sow directly in the final box.','base')],recap:'Cool, shaded, and sown often. That is the cilantro trick.'} },

{ id:'chives', kind:'grow', cat:'26', name:'Chives in a pot', short:'chives',
  seoTitle:'Grow chives in a pot (easiest herb ever)', hook:'Chives might be the easiest herb you can grow.',
  keywords:['grow chives','easy herbs','container herbs'], tags:'#chives #herbs #easygardening', footer:'Easy wins.',
  crop:'onion', box:'pot', mode:'seeds', sets:['windowsill','kitchen','balcony','backyard'], days:40, unit:'DAY',
  hooks:[HK(['*CHIVES*','ARE SO EASY'],'Chives might be the easiest herb you can grow.'),HK(['GROW *CHIVES*','IN A POT'],'Grow chives in a pot, and snip them all year.')],
  need:{items:[['pot','Pot with holes'],['soil','Potting mix'],['seeds','Chive seeds'],['can','Water']]},
  steps:[STP('fill',['FILL A POT WITH','*POTTING MIX*'],'Fill a pot with potting mix.'),STP('plant',['SPRINKLE SEEDS,','COVER *LIGHTLY*'],'Sprinkle seeds, and cover them lightly.'),STP('water',['KEEP IT *DAMP*'],'Keep the soil damp until they sprout.'),STP('sun',['SIX HOURS','OF *SUN*'],'Give them about six hours of sun.')],
  stat:{big:'2',c:['*WEEKS* TO SPROUT'],icon:'clock',v:'Seeds sprout in about two weeks.'},
  tip:{c:['SNIP *2 INCHES*','ABOVE THE SOIL'],v:'Snip about two inches above the soil, and they grow back.',target:'mid'},
  payoff:{c:['*CHIVES*','FOR EVERY MEAL'],v:'Chives for every meal.'},
  long:{points:[PT('GOOD TO KNOW',['THEY COME *BACK*'],'Chives are perennial. They die back in winter, and return in spring.','base'),PT('PRO TIP',['EAT THE *FLOWERS*'],'The purple flowers are edible, and they taste like mild onion.','top'),PT('MISTAKE',['TOO LITTLE *LIGHT*'],'Chives get thin and weak in dim light. Give them a bright spot.','top'),PT('PRO TIP',['DIVIDE *EVERY 2 YEARS*'],'When the clump gets crowded, divide it, and share the extras.','base')],recap:'Sun, a snip now and then, and they keep coming back.'} },

{ id:'rosemary', kind:'grow', cat:'26', name:'Rosemary in a pot', short:'rosemary',
  seoTitle:'Grow rosemary in a pot (do not overwater it)', hook:'Rosemary loves neglect. Here is how.',
  keywords:['grow rosemary','container herbs','drought tolerant herbs'], tags:'#rosemary #herbs #containergardening', footer:'Less water, more flavor.',
  crop:'basil', look:{leaf:['#8fb9a0','#7aa88c']}, box:'pot', mode:'seedling', sets:['windowsill','balcony','backyard','kitchen'], days:50, unit:'DAY',
  hooks:[HK(['GROW *ROSEMARY*','IN A POT'],'Grow rosemary in a pot, and do not overwater it.'),HK(['ROSEMARY','LOVES *NEGLECT*'],'Rosemary loves a little neglect. Here is how to grow it.')],
  need:{items:[['pot','Clay pot'],['soil','Potting mix'],['seedling','Rosemary plant'],['can','Water']]},
  steps:[STP('fill',['ADD *SAND* FOR','DRAINAGE'],'Mix some sand into the potting mix for drainage.'),STP('plant',['START WITH A','*NURSERY* PLANT'],'Start with a nursery plant, since seeds are slow.'),STP('water',['WATER ONLY WHEN','*DRY*'],'Water only when the soil is dry.'),STP('sun',['FULL *SUN*'],'Rosemary loves full sun.')],
  stat:{big:'6+',c:['HOURS OF *SUN*','A DAY'],icon:'sun',v:'Rosemary wants six or more hours of sun.'},
  tip:{c:['TRIM *LIGHTLY*'],v:'Trim a few inches often. Never cut into the bare wood.',target:'top'},
  payoff:{c:['*FRESH ROSEMARY*','ALL YEAR'],v:'Fresh rosemary, all year.'},
  long:{points:[PT('MISTAKE',['OVER*WATERING*'],'Rosemary hates wet feet. Soggy soil is how most pots die.','base'),PT('PRO TIP',['USE *TERRACOTTA*'],'Clay pots dry faster, which rosemary loves.','base'),PT('GOOD TO KNOW',['BRING IT *INSIDE*'],'In cold winters, move it to a bright indoor spot.','mid'),PT('MISTAKE',['SKIPPING *LIGHT*'],'Indoors, rosemary needs the sunniest window, or it gets leggy.','top')],recap:'Sun, sharp drainage, and very little water.'} },

{ id:'basildiv', kind:'grow', cat:'26', name:'Split a supermarket basil', short:'supermarket basil',
  seoTitle:'Split supermarket basil into 5+ plants (easy hack)', hook:'One supermarket basil can become many plants.',
  keywords:['supermarket basil','divide basil','herb hack'], tags:'#basil #gardenhack #herbs #frugal', footer:'One pot, many plants.',
  crop:'basil', box:'pot', mode:'seedling', sets:['windowsill','kitchen'], days:35, unit:'DAY',
  hooks:[HK(['ONE *BASIL*','FIVE PLANTS'],'One supermarket basil can become five plants.'),HK(['STOP *KILLING*','STORE BASIL'],'Stop killing your supermarket basil. Do this instead.')],
  need:{items:[['seedling','Supermarket basil'],['pot','A few pots'],['soil','Potting mix'],['can','Water']]},
  steps:[STP('fill',['FILL A FEW POTS','WITH *SOIL*'],'Fill a few pots with potting mix.'),STP('plant',['*SPLIT* IT INTO','CLUMPS'],'Gently tease the plant into small clumps, and pot each one.'),STP('water',['WATER *WELL*'],'Water well, and keep them out of harsh sun for a few days.'),STP('sun',['THEN MOVE TO A','*SUNNY* WINDOW'],'Then move them to a sunny window.')],
  stat:{big:'5',c:['*PLANTS* FROM','ONE POT'],icon:'bucket',v:'One store bought pot can become five or more plants.'},
  tip:{c:['PINCH THE *TOPS*'],v:'Pinch the tops once new growth appears, to get bushy plants.',target:'top'},
  payoff:{c:['*ONE POT.*','MANY PLANTS'],v:'One pot, many plants.'},
  long:{points:[PT('MISTAKE',['LEAVING IT *CROWDED*'],'Supermarket basil is packed with dozens of seedlings. They starve each other and die.','base'),PT('PRO TIP',['BE *GENTLE*'],'Rinse the roots softly, and split them with your fingers.','base'),PT('GOOD TO KNOW',['EXPECT A *SULK*'],'Leaves may droop for a few days. That is normal transplant shock.','mid'),PT('PRO TIP',['PINCH *EARLY*'],'Pinch the tops once new growth appears to get bushy plants.','top')],recap:'Split, repot, and give them light.'} },

{ id:'kale', kind:'grow', cat:'26', name:'Kale in a bucket', short:'kale',
  seoTitle:'Grow kale in a bucket (cut and come again)', hook:'Kale in a bucket, and it keeps coming back.',
  keywords:['grow kale','container vegetables','cut and come again'], tags:'#kale #containergardening #leafygreens', footer:'Greens on repeat.',
  crop:'lettuce', look:{leaf:['#2f8f4a','#277a40']}, box:'bucket', mode:'seeds', sets:['balcony','backyard','coop'], days:55, unit:'DAY', sc:.8,
  hooks:[HK(['GROW *KALE*','IN A BUCKET'],'Grow kale in a bucket.'),HK(['*KALE*','KEEPS COMING BACK'],'Kale keeps coming back, even in a bucket.')],
  need:{items:[['bucket','Bucket with holes'],['soil','Potting mix'],['seeds','Kale seeds'],['can','Water']]},
  steps:[STP('drill',['DRILL *DRAINAGE*','HOLES'],'Drill drainage holes in the bottom.',1),STP('fill',['FILL WITH *POTTING*','MIX'],'Fill it with potting mix.'),STP('plant',['SOW SEEDS','*1/2 INCH* DEEP'],'Sow seeds half an inch deep.'),STP('water',['KEEP IT *EVENLY*','MOIST'],'Keep the soil evenly moist.')],
  stat:{big:'4',c:['*WEEKS* TO','BABY LEAVES'],icon:'clock',v:'About four weeks to baby kale leaves.'},
  tip:{c:['PICK *OUTER*','LEAVES'],v:'Pick the lower outer leaves, and the plant keeps growing from the top.',target:'mid'},
  payoff:{c:['*FRESH KALE*','FROM A BUCKET'],v:'Fresh kale, from a bucket.'},
  long:{points:[PT('MISTAKE',['CABBAGE *WORMS*'],'Check under leaves for green caterpillars. A light net keeps butterflies from laying eggs.','mid'),PT('PRO TIP',['FEED *LIGHTLY*'],'Kale is hungry. Feed it every few weeks with a balanced fertilizer.','base'),PT('GOOD TO KNOW',['FROST *SWEETENS* IT'],'Kale thrives in cool weather, and it tastes sweeter after a light frost.','top'),PT('MISTAKE',['PICKING THE *CENTER*'],'Never cut the top bud. Take the outer leaves, and leave the growing center.','top')],recap:'Cool weather, outer leaves, and regular feeding.'} },

{ id:'spinach', kind:'grow', cat:'26', name:'Spinach in a window box', short:'spinach',
  seoTitle:'Grow spinach in a window box (cool season)', hook:'Spinach loves cool weather. Here is the trick.',
  keywords:['grow spinach','window box vegetables','cool season crops'], tags:'#spinach #windowbox #gardening #leafygreens', footer:'Cool season greens.',
  crop:'lettuce', look:{leaf:['#58c26a','#6fd67a']}, box:'box', mode:'seeds', sets:['windowsill','balcony','kitchen'], days:30, unit:'DAY',
  hooks:[HK(['GROW *SPINACH*','IN A BOX'],'Grow spinach in a window box.'),HK(['SPINACH','IN *4 WEEKS*'],'Baby spinach in about four weeks.')],
  need:{items:[['box','Window box'],['soil','Potting mix'],['seeds','Spinach seeds'],['can','Water']]},
  steps:[STP('fill',['FILL THE BOX WITH','*POTTING MIX*'],'Fill the box with potting mix.'),STP('plant',['SOW SEEDS','*1/2 INCH* DEEP'],'Sow seeds half an inch deep.'),STP('water',['KEEP IT *EVENLY*','MOIST'],'Keep the soil evenly moist.'),STP('sun',['PART *SHADE*','IS FINE'],'Spinach is happy in part shade.')],
  stat:{big:'4',c:['*WEEKS* TO','BABY LEAVES'],icon:'clock',v:'About four weeks to baby leaves.'},
  tip:{c:['HARVEST *OUTER*','LEAVES'],v:'Harvest the outer leaves, and the plant keeps going.',target:'mid'},
  payoff:{c:['*FRESH SPINACH*','FROM A BOX'],v:'Fresh spinach, from a window box.'},
  long:{points:[PT('MISTAKE',['WARM *WEATHER*'],'Spinach bolts fast in heat. Grow it in spring and fall.','top'),PT('PRO TIP',['SOW *EVERY 2 WEEKS*'],'Sow a new row every two weeks, so the harvest never stops.','base'),PT('GOOD TO KNOW',['LOVES *NITROGEN*'],'Spinach loves nitrogen. A little compost makes leaves bigger and greener.','base'),PT('MISTAKE',['CROWDED *ROWS*'],'Thin seedlings to about three inches apart so leaves can grow wide.','base')],recap:'Cool, moist, and well spaced.'} }
];

const MORE_TOPICS2 = [
{ id:'chard', kind:'grow', cat:'26', name:'Swiss chard in a pot', short:'Swiss chard',
  seoTitle:'Grow Swiss chard in a pot (heat tolerant greens)', hook:'Chard handles heat better than lettuce.',
  keywords:['swiss chard','heat tolerant greens','container vegetables'], tags:'#chard #containergardening #leafygreens', footer:'Colorful and tough.',
  crop:'lettuce', look:{leaf:['#2f9a45','#c13a5b']}, box:'pot', mode:'seeds', sets:['balcony','backyard','kitchen'], days:56, unit:'DAY',
  hooks:[HK(['GROW *CHARD*','IN A POT'],'Grow Swiss chard in a pot.'),HK(['*COLORFUL*','TOUGH GREENS'],'Colorful, tough greens that handle heat.')],
  need:{items:[['pot','Deep pot'],['soil','Potting mix'],['seeds','Chard seeds'],['can','Water']]},
  steps:[STP('fill',['FILL A *DEEP* POT'],'Fill a deep pot with potting mix.'),STP('plant',['SOW SEEDS','*1/2 INCH* DEEP'],'Sow seeds half an inch deep.'),STP('water',['KEEP IT *MOIST*'],'Keep the soil moist while they sprout.'),STP('sun',['FULL SUN','OR PART SHADE'],'Full sun, or part shade, both work.')],
  stat:{big:'8',c:['*WEEKS* TO FULL','SIZE LEAVES'],icon:'clock',v:'About eight weeks to full size leaves, and baby leaves come sooner.'},
  tip:{c:['CUT, DO NOT *PULL*'],v:'Cut outer leaves an inch above the soil. The plant regrows.',target:'mid'},
  payoff:{c:['*COLORFUL*','CHARD ALL SEASON'],v:'Colorful chard, all season.'},
  long:{points:[PT('GOOD TO KNOW',['HEAT *PROOF*'],'Chard handles heat much better than spinach and lettuce.','top'),PT('PRO TIP',['SOAK *SEEDS*'],'Soak seeds overnight to speed up sprouting.','base'),PT('MISTAKE',['TOO *CLOSE*'],'Each seed is really a cluster of seedlings. Thin to one strong plant.','base'),PT('PRO TIP',['EAT THE *STEMS* TOO'],'The colorful stems are edible, so cook them along with the leaves.','mid')],recap:'Cut often, thin early, and enjoy the color.'} },

{ id:'arugula', kind:'grow', cat:'26', name:'Arugula in 3 weeks', short:'arugula',
  seoTitle:'Grow arugula in 3 weeks (window box salad)', hook:'Peppery salad greens in three weeks.',
  keywords:['grow arugula','fast growing greens','window box'], tags:'#arugula #salad #windowbox #gardening', footer:'Fast greens.',
  crop:'lettuce', look:{leaf:['#4fb85e','#7ad36c']}, box:'box', mode:'seeds', sets:['windowsill','balcony','kitchen'], days:21, unit:'DAY',
  hooks:[HK(['*ARUGULA*','IN 3 WEEKS'],'Arugula can be ready in three weeks.'),HK(['FAST *SALAD*','GREENS'],'Fast, peppery salad greens, from a window box.')],
  need:{items:[['box','Window box'],['soil','Potting mix'],['seeds','Arugula seeds'],['can','Water']]},
  steps:[STP('fill',['FILL THE BOX WITH','*POTTING MIX*'],'Fill the box with potting mix.'),STP('plant',['SCATTER SEEDS,','BARELY *COVER*'],'Scatter seeds, and barely cover them.'),STP('water',['KEEP IT *MOIST*'],'Keep the soil moist.'),STP('sun',['PART *SUN*','IS FINE'],'Part shade is fine.')],
  stat:{big:'3',c:['*WEEKS* TO','BABY LEAVES'],icon:'clock',v:'About three weeks to baby leaves.'},
  tip:{c:['PICK *YOUNG* LEAVES'],v:'Young leaves are mild. Older leaves turn spicy and bitter.',target:'mid'},
  payoff:{c:['*PEPPERY*','SALAD IN 3 WEEKS'],v:'Peppery salad, in three weeks.'},
  long:{points:[PT('MISTAKE',['LEFT *TOO LONG*'],'Big old leaves turn bitter. Harvest while they are small.','mid'),PT('PRO TIP',['SOW *EVERY WEEK*'],'It grows so fast that a weekly sowing gives a steady supply.','base'),PT('GOOD TO KNOW',['BOLTS *IN HEAT*'],'In hot weather it flowers quickly. The flowers are edible, and taste peppery.','top'),PT('PRO TIP',['GIVE IT *SHADE*'],'Afternoon shade makes it last much longer.','top')],recap:'Sow often, harvest young, and keep it cool.'} },

{ id:'lettucetower', kind:'grow', cat:'26', name:'Lettuce tower', short:'a lettuce tower',
  seoTitle:'Build a lettuce tower (vertical garden for small spaces)', hook:'A whole salad garden in one tower.',
  keywords:['vertical garden','lettuce tower','small space vegetables'], tags:'#verticalgarden #lettuce #smallspace #gardening', footer:'Grow up, not out.',
  crop:'lettuce', box:'tower', mode:'seedling', tall:true, sets:['balcony','backyard'], days:35, unit:'DAY',
  hooks:[HK(['A *LETTUCE*','TOWER'],'Build a lettuce tower, and grow salad in a tiny space.'),HK(['SALAD','GOES *VERTICAL*'],'Salad goes vertical. Here is how.')],
  need:{items:[['pot','Stacking pots'],['soil','Potting mix'],['seedling','Lettuce seedlings'],['can','Water']]},
  steps:[STP('stack',['STACK THE POTS','*BIG TO SMALL*'],'Stack the pots, big to small.'),STP('fill',['FILL EACH WITH','*SOIL*'],'Fill each level with potting mix.'),STP('plant',['PLANT *EVERY*','RING'],'Plant a seedling in every ring.'),STP('water',['WATER *FROM*','THE TOP'],'Water from the top.')],
  stat:{big:'4-6',c:['HOURS OF *SUN*','IS ENOUGH'],icon:'sun',v:'Lettuce is happy with four to six hours of sun.'},
  tip:{c:['PICK *OUTER*','LEAVES'],v:'Pick the outer leaves, and the plants keep growing.',target:'mid',r:230},
  payoff:{c:['*FRESH SALAD*','FROM A TOWER'],v:'Fresh salad, from a tower.'},
  long:{points:[PT('MISTAKE',['TOP *DRIES* FIRST'],'The top pot dries fastest. Water from the top, and check the sides.','top'),PT('PRO TIP',['PLANT *EVERY RING*'],'Plant a seedling in every ring of the tower to use all the space.','base'),PT('GOOD TO KNOW',['TURN *THE TOWER*'],'You can turn the tower to follow the sun, or shade it in summer.','mid'),PT('PRO TIP',['MIX *COLORS*'],'Mix green and red lettuce for a beautiful tower.','mid')],recap:'Stack, plant every ring, and water from the top.'} },

{ id:'herbtower', kind:'grow', cat:'26', name:'Herb tower', short:'an herb tower',
  seoTitle:'Build an herb tower (whole herb garden in one spot)', hook:'A whole herb garden in one tower.',
  keywords:['herb tower','vertical herb garden','small space herbs'], tags:'#herbs #verticalgarden #smallspace #gardening', footer:'Herbs at hand.',
  crop:'basil', box:'tower', mode:'seedling', tall:true, sets:['balcony','backyard','kitchen'], days:40, unit:'DAY',
  hooks:[HK(['AN *HERB*','TOWER'],'Build an herb tower, and snip fresh herbs while you cook.'),HK(['HERBS','GO *VERTICAL*'],'Herbs go vertical. Here is how.')],
  need:{items:[['pot','Stacking pots'],['soil','Potting mix'],['seedling','Herb plants'],['can','Water']]},
  steps:[STP('stack',['STACK THE POTS','*BIG TO SMALL*'],'Stack the pots, big to small.'),STP('fill',['FILL EACH WITH','*SOIL*'],'Fill each level with potting mix.'),STP('plant',['MATCH HERBS BY','*WATER NEEDS*'],'Plant herbs with similar needs together.'),STP('water',['WATER *FROM*','THE TOP'],'Water from the top.')],
  stat:{big:'1',c:['*TOWER.*','A WHOLE HERB GARDEN'],icon:'bucket',v:'One tower holds a whole herb garden.'},
  tip:{c:['KEEP *MINT*','OUT OF IT'],v:'Keep mint out of the tower, or it will take over.',target:'base',r:230},
  payoff:{c:['*FRESH HERBS*','AT HAND HEIGHT'],v:'Fresh herbs, right at hand height.'},
  long:{points:[PT('MISTAKE',['MIXING *THIRSTY*','WITH DRY'],'Do not mix thirsty herbs like basil with dry lovers like rosemary.','base'),PT('PRO TIP',['THIRSTY *AT THE BOTTOM*'],'Water runs down, so put thirstier herbs low, and dry lovers high.','mid'),PT('GOOD TO KNOW',['EASY *HARVEST*'],'Everything is at hand height, so you can snip herbs while you cook.','mid'),PT('PRO TIP',['TRIM *OFTEN*'],'Regular trimming keeps the herbs bushy, and the tower full.','top')],recap:'Match herbs by water needs, and snip often.'} },

{ id:'radish', kind:'grow', cat:'26', name:'Radishes in a window box', short:'radishes',
  seoTitle:'Grow radishes in 25 days (window box, beginner friendly)', hook:'Radishes are ready in about twenty five days.',
  keywords:['grow radishes','fast vegetables','window box'], tags:'#radish #fastgrowing #windowbox #gardening', footer:'The fastest veggie.',
  crop:'radish', box:'box', mode:'seeds', sets:['windowsill','balcony','kitchen'], days:25, unit:'DAY',
  hooks:[HK(['*RADISHES*','IN 25 DAYS'],'Radishes are ready in about twenty five days.'),HK(['THE *FASTEST*','VEGGIE'],'Want the fastest veggie you can grow? Radishes.')],
  need:{items:[['box','Window box'],['soil','Potting mix'],['seeds','Radish seeds'],['can','Water']]},
  steps:[STP('fill',['FILL THE BOX WITH','*POTTING MIX*'],'Fill a window box with potting mix.'),STP('plant',['SOW SEEDS','*1/2 INCH* DEEP'],'Sow seeds half an inch deep.'),STP('water',['KEEP IT *EVENLY*','MOIST'],'Keep it evenly moist.'),STP('sun',['AT LEAST','*4 HOURS* OF SUN'],'Give them at least four hours of sun.')],
  stat:{big:'25',c:['DAYS TO','*HARVEST*'],icon:'clock',v:'Radishes are ready in about twenty five days.'},
  tip:{c:['PICK *ON TIME*'],v:'Pick when roots are about an inch wide. Wait too long, and they turn woody.',target:'base'},
  payoff:{c:['*CRUNCHY*','RADISHES IN 4 WEEKS'],v:'Crunchy radishes, in four weeks.'},
  long:{points:[PT('MISTAKE',['CROWDING'],'Thin seedlings to about two inches apart, or the roots will not swell.','base'),PT('PRO TIP',['EVEN *WATER*'],'Irregular watering makes radishes split or turn woody.','base'),PT('GOOD TO KNOW',['EAT THE *LEAVES*'],'Radish leaves are edible. Saute them like greens.','top'),PT('PRO TIP',['SOW *EVERY WEEK*'],'Sow a few seeds every week for a steady supply.','base')],recap:'Thin early, water evenly, and pick on time.'} },

{ id:'carrot', kind:'grow', cat:'26', name:'Carrots in a bucket', short:'carrots',
  seoTitle:'Grow carrots in a bucket (no garden needed)', hook:'Sweet carrots, straight from a bucket.',
  keywords:['grow carrots','container carrots','bucket garden'], tags:'#carrots #bucketgarden #containergardening', footer:'Sweet roots.',
  crop:'carrot', box:'bucket', mode:'seeds', sets:['balcony','backyard','coop'], days:70, unit:'DAY',
  hooks:[HK(['NO GARDEN?','GROW *CARROTS*'],'No garden? Grow carrots in a bucket.'),HK(['*SWEET*','BUCKET CARROTS'],'Sweet carrots, straight from a bucket.')],
  need:{items:[['bucket','Deep bucket'],['drill','Drill'],['soil','Potting mix'],['seeds','Carrot seeds']]},
  steps:[STP('drill',['DRILL *DRAINAGE*','HOLES'],'Drill drainage holes in the bottom.',1),STP('fill',['FILL WITH *LOOSE*','SOIL'],'Fill a deep bucket with loose, fine soil.'),STP('plant',['SPRINKLE *SEEDS*','& BARELY COVER'],'Sprinkle seeds on top, and barely cover them.'),STP('water',['KEEP THE TOP','*MOIST*'],'Keep the surface moist until they sprout.')],
  stat:{big:'70',c:['DAYS TO','*HARVEST*'],icon:'clock',v:'About seventy days until harvest.'},
  tip:{c:['THIN *SEEDLINGS*'],v:'Thin to about two inches apart, so the roots can fatten up.',target:'base'},
  payoff:{c:['*SWEET* CARROTS','FROM A BUCKET'],v:'Sweet carrots, from a bucket.'},
  long:{points:[PT('MISTAKE',['HEAVY *SOIL*'],'Rocks and clay make short, forked carrots. Use light, loose potting mix.','base'),PT('MISTAKE',['DRYING *OUT*'],'Carrot seeds are slow, and the soil must stay moist the whole time.','base'),PT('GOOD TO KNOW',['CHECK THE *SHOULDERS*'],'Peek at the top of the root at the soil line. When it is about an inch wide, they are ready.','base'),PT('PRO TIP',['TRY *SHORT* TYPES'],'Short or round varieties do well in shallow containers.','mid')],recap:'Deep bucket, loose soil, and thinning.'} },

{ id:'bean', kind:'grow', cat:'26', name:'Pole beans on a balcony', short:'pole beans',
  seoTitle:'Grow pole beans in a pot (balcony vertical garden)', hook:'Beans love to climb. Give them a pole.',
  keywords:['pole beans','vertical vegetables','balcony garden'], tags:'#beans #balconygarden #verticalgarden #gardening', footer:'Grow up.',
  crop:'bean', box:'bucket', mode:'seeds', tall:true, sets:['balcony','backyard'], days:60, unit:'DAY',
  hooks:[HK(['*BEANS*','LOVE TO CLIMB'],'Beans love to climb. Give them a pole.'),HK(['GROW *UP*','NOT OUT'],'Short on space? Grow beans straight up.')],
  need:{items:[['bucket','Big pot'],['soil','Potting mix'],['seeds','Pole bean seeds'],['can','Water']]},
  steps:[STP('fill',['FILL A BIG POT','WITH *SOIL*'],'Fill a big pot with potting mix.'),STP('plant',['SOW *1 INCH* DEEP','BY A STAKE'],'Sow seeds an inch deep, beside a tall stake.'),STP('water',['WATER *REGULARLY*'],'Water regularly, but do not soak.'),STP('sun',['FULL *SUN*'],'Give them full sun.')],
  stat:{big:'60',c:['DAYS TO','*FIRST BEANS*'],icon:'clock',v:'About sixty days to your first beans.'},
  tip:{c:['PICK *OFTEN*'],v:'Pick often. The more you pick, the more beans you get.',target:'mid'},
  payoff:{c:['*CRISP*','BEANS ON A BALCONY'],v:'Crisp beans, on a balcony.'},
  long:{points:[PT('PRO TIP',['GIVE THEM *HEIGHT*'],'Use a stake or string at least six feet tall. Pole beans climb fast.','top'),PT('MISTAKE',['PLANTING *TOO EARLY*'],'Beans hate cold soil. Wait until after the last frost.','base'),PT('GOOD TO KNOW',['THEY *FEED THE SOIL*'],'Beans work with soil bacteria to add nitrogen, so they need little fertilizer.','base'),PT('MISTAKE',['TOO MUCH *FEED*'],'Too much nitrogen makes lots of leaves and few beans.','mid')],recap:'A tall stake, warm soil, and regular picking.'} },

{ id:'pea', kind:'grow', cat:'26', name:'Peas in a pot', short:'peas',
  seoTitle:'Grow peas in a pot (spring container garden)', hook:'Sweet peas, straight from a pot.',
  keywords:['grow peas','container peas','spring garden'], tags:'#peas #springgarden #containergardening', footer:'Sweet and crunchy.',
  crop:'bean', look:{pod:'#8fe06a'}, box:'pot', mode:'seeds', tall:true, sets:['balcony','backyard','windowsill'], days:65, unit:'DAY',
  hooks:[HK(['GROW *PEAS*','IN A POT'],'Grow sweet peas in a pot.'),HK(['SWEET *PEAS*','STRAIGHT FROM THE VINE'],'Sweet peas, straight from the vine.')],
  need:{items:[['pot','Deep pot'],['soil','Potting mix'],['seeds','Pea seeds'],['can','Water']]},
  steps:[STP('fill',['FILL A *DEEP* POT'],'Fill a deep pot with potting mix.'),STP('plant',['SOW SEEDS','*1 INCH* DEEP'],'Sow the seeds an inch deep, beside a support.'),STP('water',['KEEP IT *MOIST*'],'Keep the soil moist, but not soggy.'),STP('sun',['SUN OR','*PART SHADE*'],'Give them sun, or light shade.')],
  stat:{big:'65',c:['DAYS TO','*FIRST PEAS*'],icon:'clock',v:'About sixty five days to your first peas.'},
  tip:{c:['PICK *OFTEN*'],v:'Pick often, and the vines keep producing.',target:'mid'},
  payoff:{c:['*SWEET*','PEAS FROM A POT'],v:'Sweet peas, from a pot.'},
  long:{points:[PT('GOOD TO KNOW',['PEAS LOVE *COOL*'],'Peas grow best in cool weather. Sow in early spring, or in late summer for a fall crop.','base'),PT('PRO TIP',['ADD A *TRELLIS*'],'Give the vines a trellis or netting right away. They climb on little tendrils.','top'),PT('MISTAKE',['SOGGY *SOIL*'],'Wet soil rots the seeds before they sprout. Keep it moist, not wet.','base'),PT('PRO TIP',['EAT THE *SHOOTS*'],'Young pea shoots are tasty in salads, and you can snip a few at a time.','top')],recap:'Cool weather, a trellis, and regular picking.'} },

{ id:'garlic', kind:'grow', cat:'26', name:'Garlic in a pot', short:'garlic',
  seoTitle:'Grow garlic in a pot (plant one clove, get a bulb)', hook:'One clove becomes a whole bulb of garlic.',
  keywords:['grow garlic','container garlic','plant garlic'], tags:'#garlic #containergardening #homestead #gardening', footer:'Plant once, harvest next summer.',
  crop:'onion', look:{leaf:['#58c26a','#4dc15a']}, box:'pot', mode:'seeds', sets:['backyard','balcony','kitchen'], days:240, unit:'DAY',
  hooks:[HK(['GROW *GARLIC*','IN A POT'],'Grow garlic in a pot.'),HK(['ONE *CLOVE.*','ONE BULB'],'Plant one clove, and get a whole bulb.')],
  need:{items:[['pot','Deep pot'],['soil','Potting mix'],['seeds','Seed garlic'],['can','Water']]},
  steps:[STP('fill',['FILL A *DEEP* POT'],'Fill a deep pot with potting mix.'),STP('plant',['POINTY END *UP*','2 INCHES DEEP'],'Plant cloves pointy end up, about two inches deep.'),STP('water',['WATER *WELL*'],'Water well, then keep it lightly moist.'),STP('sun',['FULL *SUN*'],'Give it full sun.')],
  stat:{big:'8',c:['*MONTHS* TO','HARVEST'],icon:'clock',v:'Garlic takes about eight months, but it is worth the wait.'},
  tip:{c:['CUT THE *SCAPES*'],v:'In early summer, cut off the flower stalks, called scapes. The bulb grows bigger, and scapes taste great.',target:'top'},
  payoff:{c:['*HOMEGROWN*','GARLIC'],v:'Homegrown garlic, from one clove.'},
  long:{points:[PT('MISTAKE',['GROCERY *GARLIC*'],'Store garlic is often treated to stop sprouting. Buy seed garlic from a nursery.','base'),PT('PRO TIP',['MULCH *IT*'],'A layer of straw protects the cloves from winter cold.','base'),PT('GOOD TO KNOW',['WAIT FOR *BROWN LEAVES*'],'Harvest when the lower leaves turn brown, and the top ones are still green.','top'),PT('MISTAKE',['OVER*WATERING*'],'Soggy soil rots cloves. Water only when the top inch is dry.','base')],recap:'Plant in fall, mulch, and wait for summer.'} },

{ id:'microsun', kind:'grow', cat:'26', name:'Sunflower and pea shoots', short:'microgreens',
  seoTitle:'Grow sunflower and pea shoots in 10 days (indoors)', hook:'Crunchy shoots in about ten days.',
  keywords:['sunflower shoots','pea shoots','microgreens'], tags:'#microgreens #sunflowershoots #peashoots #indoorgarden', footer:'Fast and crunchy.',
  crop:'micro', box:'tray', mode:'seeds', sets:['kitchen','windowsill'], days:10, unit:'DAY', sc:1.3,
  hooks:[HK(['CRUNCHY *SHOOTS*','IN 10 DAYS'],'Grow crunchy sunflower and pea shoots in about ten days.'),HK(['*SUNFLOWER*','SHOOTS AT HOME'],'Sunflower shoots, right on your counter.')],
  need:{items:[['tray','Shallow tray'],['soil','Soil or coir'],['seeds','Sunflower seeds'],['can','Spray bottle']]},
  steps:[STP('fill',['FILL A TRAY WITH','*SOIL*'],'Fill a tray with soil.'),STP('plant',['SOAK SEEDS,','SPREAD *THICK*'],'Soak the seeds overnight, then spread them thickly.'),STP('water',['MIST & *COVER*','FOR 3 DAYS'],'Mist, and cover with another tray for a few days.'),STP('sun',['UNCOVER INTO','*LIGHT*'],'Uncover them into bright light once sprouts lift the lid.')],
  stat:{big:'10',c:['DAYS TO','*HARVEST*'],icon:'clock',v:'About ten days to harvest.'},
  tip:{c:['RINSE THE *HULLS*'],v:'Rinse off the loose seed hulls with water before eating.',target:'top',r:200},
  payoff:{c:['*CRUNCHY* SHOOTS','IN 10 DAYS'],v:'Crunchy shoots, in ten days.'},
  long:{points:[PT('PRO TIP',['SOAK *OVERNIGHT*'],'Soaking wakes the seeds up, and they sprout evenly.','base'),PT('GOOD TO KNOW',['THE *BLACKOUT* PERIOD'],'Stack a tray on top for three days. The sprouts grow tall and tender while searching for light.','mid'),PT('MISTAKE',['*MOLD* OR ROOT HAIRS?'],'Fuzzy white hairs are usually harmless root hairs. Slimy or gray patches mean too little air.','base'),PT('PRO TIP',['USE *CLEAN* SEEDS'],'Buy seeds sold for sprouting or microgreens, and keep the tray clean.','base')],recap:'Soak, cover, then light. Ten days to shoots.'} },

{ id:'wormfix', kind:'homestead', cat:'26', name:'Fix a smelly worm bin', short:'worm bin problems',
  seoTitle:'Fix a smelly worm bin fast (flies, smell, escaping worms)', hook:'Smelly worm bin? Here is the fix.',
  keywords:['worm bin smell','vermicompost problems','fruit flies worm bin'], tags:'#wormbin #composting #vermicomposting #homestead', footer:'Happy worms, no smell.',
  crop:'worm', box:'bin', mode:'worms', fillKind:'paper', sets:['kitchen','coop','balcony'], days:6, unit:'WEEK',
  hooks:[HK(['SMELLY *WORM BIN?*','FIX IT FAST'],'Smelly worm bin? Here is the fix.'),HK(['FLIES IN YOUR','*WORM BIN?*'],'Flies in your worm bin? Do this.')],
  need:{items:[['paper','Dry paper'],['worms','More worms'],['scraps','Frozen scraps'],['bin','Your bin']]},
  steps:[STP('fill',['ADD *DRY PAPER*','TO SOAK UP WATER'],'Add dry shredded paper to soak up extra moisture.'),STP('plant',['A FEW *MORE*','WORMS IF EMPTY'],'Add a few more worms if the bin looks empty.'),STP('feed',['BURY *SCRAPS*','UNDER THE BEDDING'],'Bury scraps under the bedding, never on top.')],
  tip:{c:['ADD *AIR HOLES*'],v:'Add more air holes if the bin smells sour.',target:'base',r:260},
  payoff:{c:['*HAPPY* WORMS','NO SMELL'],v:'Happy worms, and no smell.'},
  long:{points:[PT('MISTAKE',['TOO *WET*'],'Most smelly bins are simply too wet. Add dry paper, and stop adding water.','base'),PT('PRO TIP',['COVER WITH *PAPER*'],'Bury scraps, and cover the top with a layer of paper to stop fruit flies.','base'),PT('GOOD TO KNOW',['WHY WORMS *ESCAPE*'],'Worms crawl out when the bin is too wet, too acidic, or too bright. Fix the cause, and leave a light on for a night.','top'),PT('PRO TIP',['FREEZE *SCRAPS*'],'Freeze scraps first. They break down faster once thawed, and it kills fruit fly eggs.','mid')],recap:'Dry paper, buried scraps, and a little air.'} }
];

const STORIES = [...NEW_TOPICS, ...BUILTIN_TOPICS, ...MORE_TOPICS, ...MORE_TOPICS2];
