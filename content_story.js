'use strict';
// =====================================================================
//  content.js: ALL the stories (voice lines, on-screen tags, caption, hashtags, sound cues and the scene data).
//  Loaded by story.html. A story is pure data that only uses names from the kit (open the Catalog page in the preview to see every model).
//  To add a story: copy one, give it a new id, add it to STORIES at the bottom. The preview console shows validateStory() problems.
//  Kinds: tale (true stories), dyk (did you know), survival (what to do if...), fiction (short made-up stories).
//  Coordinates: actors use at:[x,z] (+ optional to:[x,z], y, s, face in degrees: 180 = looking at the camera). The camera looks along +z.
// =====================================================================
const OFF = (a) => a; // (placeholder helper so the file stays plain data)

// ---------------------------------------------------------------------
const MOLASSES = {
  id: 'molasses', kind: 'tale', title: 'The Molasses Flood', set: 'street', music: 'tense',
  caption: 'In 1919, a giant tank of molasses burst in Boston and sent a sticky wave through the streets. 🌊 (True story, told briefly.)',
  tags: '#truestory #history #boston #weirdhistory #didyouknow #shorts', footer: 'Based on the Great Molasses Flood, Boston, 15 January 1919. Figures are approximate.',
  beats: [
    { vo: 'In 1919, a giant tank of molasses burst open in the middle of Boston.', time: 'day', cam: { mode: 'crane', from: [9, 12, 2], to: [5, 3.5, 8], look: [0, 3, 30] }, tags: [{ t: [0.15, 0.95], text: 'BOSTON, 1919', size: 66 }], sfx: ['crowd', 'bell@0.5'],
      actors: [{ id: 'tank', m: 'tank', at: [0, 34], s: 1.5 }, { id: 'm1', m: 'worker', at: [-4, 14], to: [2, 20], ex: 'smile' }, { id: 'w1', m: 'woman', at: [5, 16], to: [-1, 22], c: { dress: 'teal' } }, { id: 'b1', m: 'boy', at: [3, 12], to: [4, 22] }, { id: 'ct', m: 'cart', at: [-5, 25], face: 90 }, { id: 'h1', m: 'horse', at: [-8.5, 25], face: 90, anim: 'stand' }] },
    { vo: 'A wave of sticky syrup rushed down the street, taller than a house.', time: 'day', cam: { mode: 'static', at: [9, 4, -9], look: [0, 3, 22] }, tags: [{ t: [0.2, 0.95], text: 'TALLER THAN A HOUSE', size: 52, bg: '#ff8a3d' }], sfx: ['crash@0.1', 'squelch@0.3', 'rumble@0.2'], flash: null,
      actors: [{ id: 'tank', m: 'tank', at: [0, 38], s: 1.5, o: { crack: 1 } }, { id: 'wv', m: 'wave', at: [0, 30], to: [0, 14], o: { w: 15, h: 7 } }, { id: 'r1', m: 'worker', at: [-3, 22], to: [-3, 4], anim: 'run', ex: 'shock' }, { id: 'r2', m: 'woman', at: [3, 24], to: [3, 3], anim: 'run', ex: 'shock', c: { dress: 'teal' } }] },
    { vo: 'It raced at about thirty-five miles per hour, faster than anyone could run.', time: 'day', cam: { mode: 'track', target: 'r1', off: [8, 2.2, -7] }, tags: [{ t: [0.1, 0.95], text: '35 MPH', size: 96, bg: '#ffd23f' }], sfx: ['rumble', 'steps@0.1', 'squelch@0.5'],
      actors: [{ id: 'wv', m: 'wave', at: [0, 44], to: [0, 6], o: { w: 15, h: 7 } }, { id: 'r1', m: 'boy', at: [-1, 26], to: [-1, 4], anim: 'run', ex: 'shock' }, { id: 'r2', m: 'officer', at: [3, 30], to: [3, 6], anim: 'run', ex: 'shock' }, { id: 'r3', m: 'man', at: [-4, 34], to: [-4, 8], anim: 'run', ex: 'shock', c: { shirt: 'green' } }] },
    { vo: 'Buildings were smashed, and the cleanup took weeks, with the harbor stained brown.', time: 'day', cam: { mode: 'orbit', target: [0, 1.5, 18], r: 14, h: 5, a0: -35, a1: 25 }, tags: [{ t: [0.15, 0.95], text: 'WEEKS OF CLEANUP', size: 56, bg: '#b9a0ff' }], sfx: ['crowd', 'drip@0.3'],
      actors: [{ id: 'pd', m: 'puddle', at: [0, 20], o: { w: 14, d: 22 } }, { id: 'hs', m: 'house', at: [-10, 24], face: 160, s: 1.3, o: { roll: 14, pitch: 6 } }, { id: 'w1', m: 'worker', at: [-3, 14], face: 200, anim: 'work', ex: 'worried' }, { id: 'w2', m: 'worker', at: [3, 18], face: 150, anim: 'work', c: { shirt: 'teal' } }, { id: 'w3', m: 'officer', at: [6, 12], face: 190, anim: 'point' }, { id: 'cr', m: 'crate', at: [-6, 11], s: 1.2 }, { id: 'bl', m: 'barrel', at: [7, 20], c: { a: 'molasses' } }] },
    { vo: "The tank's walls were too thin, and the disaster led to new safety rules.", time: 'clear', cam: { mode: 'orbit', target: 'eng', r: 7, h: 2.2, a0: -30, a1: 25 }, tags: [{ t: [0.15, 0.95], text: 'NEW SAFETY RULES', size: 58, bg: '#7cf2c0' }], sfx: ['chime@0.4', 'crowd'],
      actors: [{ id: 'eng', m: 'scientist', at: [0, 14], face: 190, anim: 'point', o: { hold: 'plans' }, ex: 'determined' }, { id: 'tk', m: 'tank', at: [0, 38], s: 1.5, c: { a: [110, 200, 140] } }, { id: 'ck', m: 'check', at: [0, 22], y: 4.2, s: 1.8, face: 180 }, { id: 'w2', m: 'worker', at: [-5, 18], face: 170, anim: 'celebrate', ex: 'laugh' }, { id: 'w3', m: 'woman', at: [5, 17], face: 195, anim: 'celebrate', ex: 'smile' }] },
  ] };

// ---------------------------------------------------------------------
const WOJTEK = {
  id: 'wojtek', kind: 'tale', title: 'The Soldier Bear', set: 'camp', music: 'hope',
  caption: 'Wojtek, the bear who became an official soldier and carried ammunition crates in World War II. 🐻 (True story, told briefly.)',
  tags: '#truestory #history #bear #wojtek #animalstories #shorts', footer: 'Based on the documented story of Wojtek, the Syrian brown bear adopted by Polish soldiers (1942-1963). Told briefly.',
  beats: [
    { vo: 'In 1942, Polish soldiers adopted an orphan bear cub and named him Wojtek.', time: 'day', cam: { mode: 'dolly', from: [-5, 1.8, 6], to: [-1.5, 1.6, 12], look: [0.5, 1, 24] }, tags: [{ t: [0.15, 0.95], text: 'ADOPTED CUB', size: 72 }], sfx: ['birds', 'chime@0.5'],
      actors: [{ id: 's1', m: 'soldier', at: [-0.8, 24], face: 190, ex: 'smile', anim: 'stand' }, { id: 'cub', m: 'bear', at: [1, 22.5], face: 190, s: 0.45 }, { id: 'fl', m: 'flag', at: [9, 30], c: { a: 'white', b: 'red' } }, { id: 's2', m: 'soldier', at: [-5, 28], face: 160, anim: 'wave', ex: 'laugh' }] },
    { vo: 'He grew huge, and he loved wrestling with the soldiers.', time: 'day', cam: { mode: 'orbit', target: [0, 1.4, 20], r: 11, h: 3, a0: -30, a1: 30 }, tags: [{ t: [0.15, 0.95], text: 'LOVED WRESTLING', size: 62, bg: '#ff8a3d' }], sfx: ['crowd', 'thud@0.4', 'cheer@0.5'],
      actors: [{ id: 'bear', m: 'bear', at: [0.8, 20], face: 200, s: [0.6, 1.25], anim: 'up', o: { up: 1.0 } }, { id: 's1', m: 'soldier', at: [-1.2, 18.6], face: 20, anim: 'push', ex: 'determined' }, { id: 's2', m: 'soldier', at: [-6, 22], face: 160, anim: 'celebrate', ex: 'laugh' }, { id: 's3', m: 'soldier', at: [7, 20], face: 200, anim: 'celebrate', ex: 'laugh' }, { id: 't1', m: 'tent', at: [-16, 36], face: 170, s: 1.5 }] },
    { vo: 'To take him on a ship, the army made him an official soldier.', time: 'day', cam: { mode: 'static', at: [4, 1.8, 10], look: [0, 1.8, 22] }, tags: [{ t: [0.15, 0.95], text: 'OFFICIAL SOLDIER', size: 58, bg: '#7cf2c0' }], sfx: ['chime@0.5', 'clack@0.2'],
      actors: [{ id: 'of', m: 'officer', at: [-2.4, 20], face: 150, anim: 'point', ex: 'smile', o: { hold: 'book' } }, { id: 'bear', m: 'bear', at: [1, 22], face: 190, s: 1.1, anim: 'stand' }, { id: 'ck', m: 'check', at: [1, 22], y: 5, s: 1.6 }, { id: 's1', m: 'soldier', at: [5, 20], face: 200, anim: 'wave', ex: 'smile' }, { id: 'tr', m: 'truck', at: [-12, 34], face: 140, s: 1.2 }] },
    { vo: 'At Monte Cassino, he carried heavy crates of ammunition, and never dropped one.', time: 'dusk', cam: { mode: 'track', target: 'bear', off: [0.5, 2.6, -10] }, fx: ['dust'], tags: [{ t: [0.1, 0.95], text: 'CARRIED THE CRATES', size: 54, bg: '#ffb86b' }], sfx: ['steps', 'boom@0.6', 'wind'],
      actors: [{ id: 'bear', m: 'bear', at: [-10, 24], to: [8, 24], s: 1.2, anim: 'walk', o: { up: 1.1, hold: 'crate' }, face: 90 }, { id: 's1', m: 'soldier', at: [-16, 24.6], to: [2, 24.6], anim: 'carrywalk', face: 90, o: { hold: 'crate' } }, { id: 's2', m: 'soldier', at: [-20, 23.6], to: [-2, 23.6], anim: 'carrywalk', face: 90, o: { hold: 'crate' } }, { id: 'tr', m: 'truck', at: [-4, 34], face: 90, s: 1.1 }, { id: 'cr', m: 'crate', at: [11, 24], s: 1.4 }, { id: 'cr2', m: 'crate', at: [12.2, 24.4], s: 1.2 }] },
    { vo: 'After the war, he retired to Edinburgh Zoo, where old soldiers visited him for years.', set: 'meadow', time: 'clear', cam: { mode: 'orbit', target: 'bear', r: 9, h: 2.4, a0: -35, a1: 25 }, tags: [{ t: [0.1, 0.95], text: 'EDINBURGH ZOO', size: 64, bg: '#7cc4ff' }], sfx: ['birds', 'chime@0.6', 'crowd'],
      actors: [{ id: 'bear', m: 'bear', at: [0, 20], face: 190, s: 1.3, anim: 'stand' }, { id: 'fn', m: 'fence', at: [-9, 15], o: { n: 13 } }, { id: 'e1', m: 'elder', at: [-3, 11.5], face: 180, anim: 'wave', ex: 'smile', c: { hat: null } }, { id: 'e2', m: 'elder', at: [3.4, 11.5], face: 175, anim: 'wave', ex: 'laugh', c: { shirt: 'olive' } }, { id: 'kd', m: 'girl', at: [0.2, 11], face: 180, anim: 'celebrate', ex: 'laugh' }, { id: 'hr', m: 'heart', at: [0, 20], y: 5.2, s: 1.4 }] },
  ] };

// ---------------------------------------------------------------------
const STINK = {
  id: 'stink', kind: 'tale', title: 'The Great Stink', set: 'riverside', music: 'tense',
  caption: 'In 1858, London smelled so bad that it forced the city to build its sewers. 👃 (True story, told briefly.)',
  tags: '#truestory #history #london #weirdhistory #didyouknow #shorts', footer: 'Based on the Great Stink of London, summer 1858, and the sewer system built by Joseph Bazalgette. Figures are approximate.',
  beats: [
    { vo: 'In 1858, London smelled so awful that people could barely breathe.', time: 'smog', water: 'green', fx: ['fog'], cam: { mode: 'dolly', from: [-7, 2.4, -2], to: [-2, 2.2, 3], look: [3, 1.6, 12] }, tags: [{ t: [0.15, 0.95], text: 'LONDON, 1858', size: 66, bg: '#c8e870' }], sfx: ['wind', 'crowd@0.2'],
      actors: [{ id: 'g1', m: 'gentleman', at: [-1, 9], face: 200, anim: 'pinch', ex: 'worried' }, { id: 'l1', m: 'lady', at: [2.4, 10.5], face: 170, anim: 'pinch', ex: 'worried' }, { id: 'w1', m: 'worker', at: [6, 8], face: 190, anim: 'pinch', ex: 'sad' }, { id: 'p1', m: 'puff', at: [-3, 12], y: 1.2, s: 1.4, c: { a: [150, 190, 50] } }, { id: 'p2', m: 'puff', at: [4, 13], y: 2.2, s: 1.6, c: { a: [140, 180, 60] } }] },
    { vo: 'The Thames had become an open sewer, baking in the summer heat.', time: 'smog', water: 'green', fx: ['fog'], cam: { mode: 'static', at: [-4, 3.4, 4], look: [4, 1, 30] }, tags: [{ t: [0.15, 0.95], text: 'AN OPEN SEWER', size: 64, bg: '#c8e870' }], sfx: ['squelch@0.2', 'drip@0.4', 'wind'],
      actors: [{ id: 'p1', m: 'puff', at: [-6, 24], y: 0.4, s: 2.4, c: { a: [150, 190, 50] } }, { id: 'p2', m: 'puff', at: [6, 34], y: 0.4, s: 3, c: { a: [140, 180, 60] } }, { id: 'p3', m: 'puff', at: [18, 22], y: 0.4, s: 2.2, c: { a: [150, 190, 50] } }, { id: 'g1', m: 'gentleman', at: [2, 9], face: 200, anim: 'pinch', ex: 'sad' }, { id: 'l1', m: 'lady', at: [5, 9.4], face: 195, anim: 'pinch', ex: 'worried' }] },
    { vo: 'Even politicians fled Parliament, hanging curtains soaked in chemicals at the windows.', time: 'smog', water: 'green', fx: ['fog'], cam: { mode: 'static', at: [0, 3, -2], look: [0, 3, 30] }, tags: [{ t: [0.1, 0.95], text: 'LAWMAKERS FLED', size: 62, bg: '#ffb86b' }], sfx: ['crowd', 'steps'],
      actors: [{ id: 'g1', m: 'gentleman', at: [-12, 8], to: [12, 8], anim: 'run', ex: 'shock' }, { id: 'g2', m: 'gentleman', at: [-18, 10], to: [8, 10], anim: 'run', ex: 'shock', c: { coat: 'navy' } }, { id: 'g3', m: 'gentleman', at: [-24, 7], to: [4, 7], anim: 'run', ex: 'worried', c: { coat: 'brown' } }, { id: 'pf', m: 'puff', at: [0, 20], y: 1, s: 3, c: { a: [150, 190, 50] } }] },
    { vo: 'Within weeks, they funded engineer Joseph Bazalgette to build over a thousand miles of sewers.', time: 'day', water: 'green', cam: { mode: 'orbit', target: [2, 1.4, 11], r: 9, h: 2.6, a0: -30, a1: 20 }, tags: [{ t: [0.1, 0.95], count: [0, 1100], suffix: ' MILES OF SEWERS', size: 46, bg: '#7cf2c0' }], sfx: ['clack', 'crowd', 'chime@0.7'],
      actors: [{ id: 'eng', m: 'gentleman', at: [0, 11], face: 195, anim: 'point', ex: 'determined', o: { hold: 'plans' }, c: { coat: 'brown' } }, { id: 'sw', m: 'sewer', at: [10, 12], face: 190, s: 1.2 }, { id: 'w1', m: 'worker', at: [-4.4, 10], face: 150, anim: 'work' }, { id: 'w2', m: 'worker', at: [5, 9], face: 220, anim: 'work', c: { shirt: 'teal' } }, { id: 'cr', m: 'crate', at: [-7, 12], s: 1.3 }, { id: 'cr2', m: 'crate', at: [-7.2, 12], y: 1.1, s: 1.1 }] },
    { vo: 'The city got cleaner, and deadly cholera outbreaks faded. A terrible smell changed London forever.', time: 'clear', water: 'blue', fx: ['confetti'], cam: { mode: 'dolly', from: [-6, 2.6, 0], to: [3, 3.2, 3], look: [0, 1.8, 20] }, tags: [{ t: [0.1, 0.95], text: 'LONDON, SAVED', size: 66, bg: '#7cf2c0' }], sfx: ['birds', 'cheer@0.3', 'chime@0.7'],
      actors: [{ id: 'g1', m: 'gentleman', at: [-2, 9], face: 190, anim: 'celebrate', ex: 'laugh' }, { id: 'l1', m: 'lady', at: [2, 9.6], face: 175, anim: 'celebrate', ex: 'laugh' }, { id: 'w1', m: 'worker', at: [5.4, 8.4], face: 190, anim: 'wave', ex: 'smile' }, { id: 'f1', m: 'flower', at: [-6, 10], s: 2, c: { a: 'pink' } }, { id: 'f2', m: 'flower', at: [7, 11], s: 2, c: { a: 'yellow' } }, { id: 'hr', m: 'heart', at: [0, 14], y: 4.2, s: 1.4 }] },
  ] };

// ---------------------------------------------------------------------
const DANCE = {
  id: 'dance', kind: 'tale', title: 'The Dancing Plague', set: 'plaza', music: 'fun',
  caption: "In 1518, hundreds of people in Strasbourg danced for days and nobody knows exactly why. 💃 (True story, told briefly.)",
  tags: '#truestory #history #mystery #weirdhistory #didyouknow #shorts', footer: 'Based on the Dancing Plague of 1518 in Strasbourg. Historians still debate the cause, and the numbers are estimates.',
  beats: [
    { vo: "In 1518, a woman in Strasbourg started dancing in the street and couldn't stop.", time: 'day', cam: { mode: 'dolly', from: [-3, 2.8, 3], to: [0, 2.2, 9], look: 'w' }, tags: [{ t: [0.12, 0.95], text: 'STRASBOURG 1518', size: 56 }], sfx: ['drum@0.1', 'birds'],
      actors: [{ id: 'w', m: 'woman', at: [0, 17], face: 185, anim: 'dance', ex: 'laugh' }, { id: 'p1', m: 'peasant', at: [-7, 20], face: 160, anim: 'look', ex: 'shock' }, { id: 'p2', m: 'elder', at: [7, 21], face: 200, anim: 'look', ex: 'shock' }, { id: 'p3', m: 'boy', at: [4, 13], face: 190, anim: 'point', ex: 'laugh' }] },
    { vo: 'Within days, dozens of people joined her, dancing day and night.', time: 'day', cam: { mode: 'orbit', target: [0, 1.4, 18], r: 13, h: 5, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], count: [1, 34], suffix: ' DANCERS', size: 64, bg: '#ffd23f' }], sfx: ['drum', 'crowd'],
      actors: [{ id: 'w', m: 'woman', at: [0, 18], face: 185, anim: 'dance', ex: 'laugh' }, { id: 'c1', m: 'crowd', at: [-6, 18], anim: 'dance', o: { n: 5, spread: 6, seed: 1 } }, { id: 'c2', m: 'crowd', at: [6, 20], anim: 'dance', o: { n: 5, spread: 6, seed: 2 } }, { id: 'c3', m: 'crowd', at: [0, 25], anim: 'dance', o: { n: 4, spread: 8, seed: 3 } }] },
    { vo: 'Officials thought more dancing would cure them, so they hired musicians.', time: 'day', cam: { mode: 'dolly', from: [8, 3, 4], to: [3, 3, 8], look: [-1, 1.8, 20] }, tags: [{ t: [0.1, 0.95], text: 'MUSIC TO THE RESCUE', size: 52, bg: '#7cc4ff' }], sfx: ['drum', 'crowd@0.1'],
      actors: [{ id: 'of', m: 'gentleman', at: [6, 17], face: 200, anim: 'point', ex: 'smile', c: { coat: 'crimson' } }, { id: 'mu1', m: 'musician', at: [3.4, 20], face: 190, anim: 'work', o: { hold: 'drum' }, ex: 'laugh' }, { id: 'mu2', m: 'musician', at: [1.6, 21], face: 180, anim: 'celebrate', ex: 'laugh', c: { shirt: 'teal' } }, { id: 'c1', m: 'crowd', at: [-5, 20], anim: 'dance', o: { n: 6, spread: 8, seed: 4 } }, { id: 'c2', m: 'crowd', at: [-2, 27], anim: 'dance', o: { n: 5, spread: 8, seed: 5 } }] },
    { vo: 'Soon hundreds were dancing, and nobody knows for sure why.', time: 'dusk', cam: { mode: 'crane', from: [0, 15, 2], to: [0, 6, 7], look: [0, 1, 22] }, tags: [{ t: [0.1, 0.95], text: 'HUNDREDS', size: 90, bg: '#ff8a9a' }], sfx: ['drum', 'crowd', 'heart@0.7'],
      actors: [{ id: 'c1', m: 'crowd', at: [-9, 18], anim: 'dance', o: { n: 8, spread: 8, seed: 6 } }, { id: 'c2', m: 'crowd', at: [0, 20], anim: 'dance', o: { n: 9, spread: 9, seed: 7 } }, { id: 'c3', m: 'crowd', at: [9, 18], anim: 'dance', o: { n: 8, spread: 8, seed: 8 } }, { id: 'c4', m: 'crowd', at: [-3, 28], anim: 'dance', o: { n: 8, spread: 12, seed: 9 } }, { id: 'c5', m: 'crowd', at: [6, 30], anim: 'dance', o: { n: 6, spread: 10, seed: 10 } }] },
    { vo: 'Some blame extreme stress, others suspect moldy bread. Would you have joined in?', time: 'dusk', cam: { mode: 'orbit', target: 'sc', r: 7, h: 2.2, a0: -25, a1: 25 }, tags: [{ t: [0.1, 0.95], text: 'STRESS? MOLDY BREAD?', size: 46, bg: '#b9a0ff' }], sfx: ['chime@0.3', 'drum'],
      actors: [{ id: 'sc', m: 'scientist', at: [0, 14], face: 190, anim: 'point', ex: 'worried' }, { id: 'c1', m: 'crowd', at: [-6, 22], anim: 'dance', o: { n: 5, spread: 8, seed: 11 } }, { id: 'c2', m: 'crowd', at: [6, 23], anim: 'dance', o: { n: 5, spread: 8, seed: 12 } }, { id: 'cr', m: 'crate', at: [3, 12], s: 1.2, c: {} }] },
  ] };

// ---------------------------------------------------------------------
const WOOD = {
  id: 'woodweb', kind: 'dyk', title: 'Trees Talk Underground', set: 'cutaway', music: 'wonder',
  caption: 'Did you know trees can share food and send warnings through underground fungus? 🌳 The "wood wide web"!',
  tags: '#didyouknow #trees #nature #science #forest #shorts', footer: 'Based on research on mycorrhizal networks. Scientists still debate how much trees share and signal through them.',
  beats: [
    { vo: 'Did you know trees can share food and warnings through an underground fungus network?', time: 'day', cam: { mode: 'dolly', from: [0, 5, -26], to: [0, 2, -16], look: [0, 1, 20] }, tags: [{ t: [0.15, 0.95], text: 'TREES TALK?', size: 82 }], sfx: ['wind', 'birds@0.2'],
      actors: [{ id: 'bf', m: 'butterfly', at: [-6, 6], to: [8, 12], y: [5, 8] }, { id: 'bd', m: 'bird', at: [8, 18], y: 8, face: 200, o: { c: { a: 'blue', b: 'sky' } } }] },
    { vo: 'Thin fungus threads wrap around the roots, connecting trees across the whole forest.', time: 'day', glow: 1, cam: { mode: 'static', at: [0, -1, -14], look: [0, -3, 20] }, tags: [{ t: [0.1, 0.95], text: 'FUNGUS NETWORK', size: 66, bg: '#ffe46b' }], sfx: ['magic@0.3', 'hum'],
      actors: [] },
    { vo: 'Through them, big trees can send sugar to shaded young seedlings.', time: 'day', glow: 1, cam: { mode: 'static', at: [0, -1, -14], look: [-2, -3, 20] }, tags: [{ t: [0.1, 0.95], text: 'SHARING SUGAR', size: 70, bg: '#ffb0c0' }], sfx: ['magic', 'pop@0.6'],
      actors: [{ id: 'p1', m: 'puff', at: [0, 22], to: [-6, 14.4], y: -2.6, s: 0.28, c: { a: [255, 230, 120] }, o: { glow: 1 } }, { id: 'p2', m: 'puff', at: [0, 22], to: [-6, 14.4], y: -2.6, s: 0.28, from: 0.25, c: { a: [255, 230, 120] }, o: { glow: 1 } }, { id: 'p3', m: 'puff', at: [0, 22], to: [5, 14.4], y: -2.6, s: 0.28, from: 0.1, c: { a: [255, 230, 120] }, o: { glow: 1 } }, { id: 'p4', m: 'puff', at: [0, 22], to: [5, 14.4], y: -2.6, s: 0.28, from: 0.4, c: { a: [255, 230, 120] }, o: { glow: 1 } }, { id: 'h1', m: 'heart', at: [-6, 14], y: 3.2, s: 0.8, vis: [0.6, 1] }, { id: 'h2', m: 'heart', at: [5, 14], y: 3.2, s: 0.8, vis: [0.7, 1] }] },
    { vo: 'Some studies suggest trees even warn neighbors about insect attacks.', time: 'day', glow: 1, cam: { mode: 'static', at: [6, 2, -18], look: [4, 1, 20] }, tags: [{ t: [0.1, 0.95], text: 'DANGER SIGNAL', size: 66, bg: '#ff6b6b', col: '#ffffff' }], sfx: ['alarm@0.3', 'pop@0.2'],
      actors: [{ id: 'gm', m: 'germ', at: [22, 15], y: 5, s: 1.4, c: { a: [236, 70, 60] }, face: 180 }, { id: 'a1', m: 'puff', at: [22, 18], to: [0, 22], y: -2.6, s: 0.3, c: { a: [255, 90, 80] }, o: { glow: 1 } }, { id: 'a2', m: 'puff', at: [0, 22], to: [-22, 16], y: -2.6, s: 0.3, from: 0.5, c: { a: [255, 90, 80] }, o: { glow: 1 } }, { id: 'xm', m: 'xmark', at: [22, 14], y: 9.5, s: 1.4, vis: [0.3, 1] }] },
    { vo: 'Scientists still debate how much, but they call it the wood wide web.', time: 'clear', glow: 1, cam: { mode: 'crane', from: [0, -1, -14], to: [0, 5, -30], look: [0, 0, 20] }, tags: [{ t: [0.1, 0.95], text: 'THE WOOD WIDE WEB', size: 56, bg: '#7cf2c0' }], sfx: ['magic@0.2', 'chime@0.6', 'birds'],
      actors: [{ id: 'sp', m: 'sky_sparkle', at: [0, 20], y: 7, s: 3, o: { n: 14 } }, { id: 'bf', m: 'butterfly', at: [-6, 6], to: [8, 12], y: [5, 8] }] },
  ] };

// ---------------------------------------------------------------------
const HONEY = {
  id: 'honey', kind: 'dyk', title: 'Honey Never Spoils', set: 'desert', music: 'wonder',
  caption: 'Did you know honey can stay edible for thousands of years? 🍯',
  tags: '#didyouknow #honey #egypt #science #foodfacts #shorts', footer: 'Based on food science: low water content, acidity and bee enzymes help sealed honey last. Honey must be kept sealed and dry.',
  beats: [
    { vo: 'Archaeologists opened an ancient Egyptian tomb and found jars of honey inside.', time: 'hazy', cam: { mode: 'dolly', from: [-9, 2.6, 4], to: [-3, 2.2, 12], look: [0, 2.4, 30] }, tags: [{ t: [0.12, 0.95], text: 'ANCIENT EGYPT', size: 64 }], sfx: ['wind', 'chime@0.5'],
      actors: [{ id: 'a1', m: 'archaeologist', at: [-3, 18], to: [-1, 24], face: 0, ex: 'smile' }, { id: 'a2', m: 'archaeologist', at: [1.5, 17], to: [1.5, 23], c: { shirt: 'green' }, o: { hold: 'torch' } }, { id: 'pl', m: 'palm', at: [8, 28], s: 1.4 }] },
    { vo: 'Honey sealed in jars like these can stay edible for thousands of years.', set: 'tomb', time: 'tomb', cam: { mode: 'orbit', target: [0, 1.7, 38], r: 6, h: 2.2, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], text: 'THOUSANDS OF YEARS', size: 52, bg: '#ffd23f' }], sfx: ['hum', 'magic@0.4'],
      actors: [{ id: 'ch', m: 'chest', at: [0, 38], s: 1.2, face: 180 }, { id: 'hj', m: 'honeyjar', at: [0, 38], y: 1.3, s: 1.5, o: { glow: 1 } }, { id: 'a1', m: 'archaeologist', at: [-3.4, 34], face: 150, ex: 'shock', anim: 'look' }] },
    { vo: "It has very little water, so bacteria can't survive in it.", set: 'tomb', time: 'tomb', cam: { mode: 'static', at: [3.4, 2.6, 33], look: [0, 1.6, 38] }, tags: [{ t: [0.1, 0.95], text: 'VERY LITTLE WATER', size: 58, bg: '#7cc4ff' }], sfx: ['pop@0.5', 'hum'],
      actors: [{ id: 'ch', m: 'chest', at: [0, 38], s: 1.2 }, { id: 'hj', m: 'honeyjar', at: [0, 38], y: 1.3, s: 1.5, o: { glow: 1 } }, { id: 'g1', m: 'germ', at: [4, 36.5], to: [0.9, 37.2], y: 0.2, s: [1, 0.05], face: 90 }, { id: 'g2', m: 'germ', at: [-4, 35.5], to: [-0.9, 37.2], y: 0.2, s: [1, 0.05], face: 270, from: 0.2 }, { id: 'g3', m: 'germ', at: [5, 38.5], to: [1.0, 38], y: 0.2, s: [1, 0.05], face: 90, from: 0.4 }] },
    { vo: 'Bees also add an enzyme that makes honey slightly acidic and antibacterial.', set: 'tomb', time: 'tomb', cam: { mode: 'orbit', target: [0, 2.2, 38], r: 5, h: 2.4, a0: 40, a1: -20 }, tags: [{ t: [0.1, 0.95], text: 'BEE POWER', size: 80, bg: '#ffd23f' }], sfx: ['buzz', 'magic@0.5'],
      actors: [{ id: 'ch', m: 'chest', at: [0, 38], s: 1.2 }, { id: 'hj', m: 'honeyjar', at: [0, 38], y: 1.3, s: 1.5, o: { glow: 1 } }, { id: 'sw', m: 'swarm', at: [0, 38], y: 2.6, o: { n: 8, r: 2 } }] },
    { vo: 'So keep it sealed, and honey can last practically forever.', set: 'meadow', time: 'clear', fx: ['confetti'], cam: { mode: 'orbit', target: 'jr', r: 5, h: 1.6, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], text: 'LASTS FOREVER', size: 74, bg: '#7cf2c0' }], sfx: ['buzz', 'chime@0.5', 'birds'],
      actors: [{ id: 'cr', m: 'crate', at: [0, 16], s: 1.2 }, { id: 'jr', m: 'honeyjar', at: [0, 16], y: 1.2, s: 1.8, o: { glow: 1 } }, { id: 'b1', m: 'boy', at: [3, 14], face: 200, anim: 'celebrate', ex: 'laugh' }, { id: 'sw', m: 'swarm', at: [-3, 16], y: 3, o: { n: 4, r: 1.6 } }] },
  ] };

// ---------------------------------------------------------------------
const WOMBAT = {
  id: 'wombat', kind: 'dyk', title: 'The Cube Poop Animal', set: 'outback', music: 'fun',
  caption: 'Did you know wombats make cube-shaped poop? 🟫 Nature really builds with blocks.',
  tags: '#didyouknow #wombat #animalfacts #australia #science #shorts', footer: 'Based on published research on wombat intestines and cube-shaped droppings (e.g. Georgia Tech, 2018). Numbers are approximate.',
  beats: [
    { vo: 'Meet the only animal in the world that poops cubes.', time: 'hazy', cam: { mode: 'dolly', from: [4, 1.2, 4], to: [2, 1.1, 9], look: 'wb' }, tags: [{ t: [0.15, 0.95], text: 'CUBE POOP?!', size: 82, bg: '#ffd23f' }], sfx: ['wind', 'pop@0.6'],
      actors: [{ id: 'wb', m: 'wombat', at: [0, 20], to: [0, 14], face: 180, anim: 'walk' }, { id: 'c1', m: 'cube', at: [0.4, 19], y: [1.8, 0], s: 1.6, vis: [0.3, 1] }, { id: 'c2', m: 'cube', at: [-0.3, 17.6], y: [1.8, 0], s: 1.6, vis: [0.55, 1] }] },
    { vo: 'A wombat makes up to a hundred little cubes every single night.', time: 'dusk', cam: { mode: 'static', at: [6, 2.4, 4], look: [0, 0.8, 18] }, tags: [{ t: [0.1, 0.95], count: [0, 100], suffix: ' CUBES / NIGHT', size: 54, bg: '#ff8a3d' }], sfx: ['pop', 'pop@0.5', 'crowd@0.1'],
      actors: [{ id: 'wb', m: 'wombat', at: [-8, 18], to: [8, 18], face: 90, anim: 'walk', s: 1.2 }, { id: 'c1', m: 'cube', at: [-4, 18], s: 1.6, vis: [0.2, 1] }, { id: 'c2', m: 'cube', at: [-1.5, 18.4], s: 1.6, vis: [0.35, 1] }, { id: 'c3', m: 'cube', at: [1, 17.6], s: 1.6, vis: [0.5, 1] }, { id: 'c4', m: 'cube', at: [3.4, 18.2], s: 1.6, vis: [0.65, 1] }, { id: 'c5', m: 'cube', at: [-2.6, 17], s: 1.6, vis: [0.75, 1] }] },
    { vo: 'Its intestines have stiff and stretchy parts that squeeze the poop into cube shapes.', time: 'day', cam: { mode: 'orbit', target: 'wb', r: 5, h: 1.6, a0: -50, a1: 10 }, tags: [{ t: [0.1, 0.95], text: 'STIFF + STRETCHY', size: 60, bg: '#7cf2c0' }], sfx: ['squelch@0.3', 'pop@0.7'],
      actors: [{ id: 'wb', m: 'wombat', at: [0, 16], face: 190, s: 1.8, anim: 'stand' }, { id: 'sp', m: 'sky_sparkle', at: [0, 15], y: 0.4, s: 1.6, o: { n: 8, col: [255, 220, 120] } }, { id: 'c1', m: 'cube', at: [0, 13], y: [1.4, 0], s: 2.2, vis: [0.5, 1] }] },
    { vo: "Cubes don't roll away, so wombats stack them on rocks to mark their territory.", time: 'day', cam: { mode: 'static', at: [5, 2, 6], look: [1, 0.8, 18] }, tags: [{ t: [0.1, 0.95], text: "CUBES DON'T ROLL", size: 58, bg: '#ffb0c0' }], sfx: ['steps@0.2', 'pop@0.6'],
      actors: [{ id: 'bl', m: 'ball', at: [-1, 15], to: [-8, 36], o: { spin: 6 }, s: 1.8 }, { id: 'cu', m: 'cube', at: [2, 15], s: 1.8 }, { id: 'rk', m: 'rock', at: [4, 18], s: 2 }, { id: 'c2', m: 'cube', at: [3.6, 18], y: 1.8, s: 1.4 }, { id: 'c3', m: 'cube', at: [4.5, 18.2], y: 1.8, s: 1.4, vis: [0.4, 1] }, { id: 'wb', m: 'wombat', at: [8, 14], face: 200, anim: 'stand', s: 1.1 }] },
    { vo: "That makes wombats nature's tiny brick makers!", time: 'clear', cam: { mode: 'orbit', target: [2, 1.4, 17], r: 7, h: 2.2, a0: -30, a1: 25 }, fx: ['confetti'], tags: [{ t: [0.1, 0.95], text: 'BRICK MAKERS!', size: 78, bg: '#7cf2c0' }], sfx: ['chime@0.4', 'cheer@0.5'],
      actors: [{ id: 'rk', m: 'rock', at: [2, 17], s: 2.4 }, { id: 'k1', m: 'cube', at: [1.2, 17], y: 2.2, s: 1.4 }, { id: 'k2', m: 'cube', at: [2.2, 17], y: 2.2, s: 1.4 }, { id: 'k3', m: 'cube', at: [3.2, 17], y: 2.2, s: 1.4 }, { id: 'k4', m: 'cube', at: [1.7, 17], y: 2.55, s: 1.4 }, { id: 'k5', m: 'cube', at: [2.7, 17], y: 2.55, s: 1.4 }, { id: 'k6', m: 'cube', at: [2.2, 17], y: 2.9, s: 1.4 }, { id: 'wb', m: 'wombat', at: [-1.4, 14], face: 190, anim: 'stand', s: 1.4 }, { id: 'hr', m: 'heart', at: [-1.4, 14], y: 3.4, s: 1.1 }] },
  ] };

// ---------------------------------------------------------------------
const LIGHTNING = {
  id: 'lightning', kind: 'survival', title: 'Caught in a Thunderstorm', set: 'meadow', music: 'tense',
  caption: 'Caught outside in a thunderstorm? Here is what to do. Save this! ⚡',
  tags: '#survival #safety #lightning #storm #howto #shorts', footer: 'General safety info. No place outdoors is truly safe in a thunderstorm: go indoors as soon as you can, and follow local weather authorities.',
  beats: [
    { vo: "Lightning hits Earth about a hundred times every second. Here's how to stay safe.", time: 'storm', fx: ['rain'], cam: { mode: 'static', at: [0, 2.4, -2], look: [0, 9, 50] }, tags: [{ t: [0.1, 0.95], text: '~100 PER SECOND', size: 62, bg: '#ffd23f' }], sfx: ['rain', 'thunder@0.3', 'wind'], bolts: [{ p: 0.25, x: -14, z: 60 }, { p: 0.55, x: 12, z: 70 }, { p: 0.8, x: 0, z: 80 }], flashes: [0.25, 0.55, 0.8],
      actors: [{ id: 'h', m: 'hiker', at: [0, 14], face: 190, anim: 'look', ex: 'worried' }, { id: 'sc1', m: 'stormcloud', at: [-8, 36], y: 26, s: 2.4 }, { id: 'sc2', m: 'stormcloud', at: [14, 46], y: 30, s: 2.8 }] },
    { vo: 'If you hear thunder, head inside a building or a hard-topped car.', time: 'storm', fx: ['rain'], cam: { mode: 'track', target: 'h', off: [-7, 2.4, -6], look: 'hs' }, tags: [{ t: [0.1, 0.95], text: 'GET INSIDE', size: 82, bg: '#7cf2c0' }], sfx: ['rain', 'thunder@0.2', 'steps@0.1'], bolts: [{ p: 0.3, x: -20, z: 56 }], flashes: [0.3],
      actors: [{ id: 'h', m: 'hiker', at: [-2, 12], to: [8, 24], anim: 'run', ex: 'worried' }, { id: 'hs', m: 'house', at: [12, 30], face: 200, s: 1.5 }, { id: 'cr', m: 'car', at: [-9, 26], face: 160, s: 1.1 }, { id: 'ck', m: 'check', at: [12, 30], y: 8, s: 1.8 }] },
    { vo: 'Never shelter under a lone tree, and avoid open fields, hilltops, and water.', time: 'storm', fx: ['rain'], cam: { mode: 'orbit', target: [0, 3, 26], r: 14, h: 3, a0: -30, a1: 20 }, tags: [{ t: [0.1, 0.95], text: 'NOT UNDER TREES', size: 64, bg: '#ff6b6b', col: '#ffffff' }], sfx: ['rain', 'thunder@0.6'], bolts: [{ p: 0.6, x: 0, z: 26, h: 32 }], flashes: [0.6],
      actors: [{ id: 'tr', m: 'tree', at: [0, 26], s: 1.8 }, { id: 'h', m: 'hiker', at: [3, 22], face: 190, anim: 'look', ex: 'worried' }, { id: 'xm', m: 'xmark', at: [0, 26], y: 13, s: 2.2 }] },
    { vo: 'Stuck outside? Move to low ground, crouch with feet together, and keep your head down.', time: 'storm', fx: ['rain'], cam: { mode: 'dolly', from: [6, 2.2, 6], to: [4, 1.8, 11], look: [0, 1, 20] }, tags: [{ t: [0.1, 0.95], text: 'LOW AND CROUCHED', size: 58, bg: '#ffb86b' }], sfx: ['rain', 'thunder@0.5', 'heart@0.2'], bolts: [{ p: 0.5, x: -16, z: 60 }], flashes: [0.5],
      actors: [{ id: 'h', m: 'hiker', at: [0, 20], face: 190, anim: 'crouch', ex: 'worried' }, { id: 'bs', m: 'bush', at: [-5, 22], s: 1.4 }, { id: 'rk', m: 'rock', at: [6, 24], s: 1.2 }] },
    { vo: 'Wait thirty minutes after the last thunder before going back out.', time: 'clear', fx: ['rainbow'], cam: { mode: 'dolly', from: [-5, 2.4, 4], to: [-1, 2.4, 9], look: [0, 4, 30] }, tags: [{ t: [0.1, 0.95], text: 'WAIT 30 MINUTES', size: 64, bg: '#7cf2c0' }], sfx: ['birds', 'chime@0.4'],
      actors: [{ id: 'h', m: 'hiker', at: [0, 18], face: 185, anim: 'wave', ex: 'smile' }, { id: 'bf', m: 'butterfly', at: [-4, 16], to: [5, 20], y: [2, 3] }, { id: 'f1', m: 'flower', at: [-3, 14], s: 2, c: { a: 'pink' } }, { id: 'f2', m: 'flower', at: [4, 15], s: 2, c: { a: 'yellow' } }] },
  ] };

// ---------------------------------------------------------------------
const RIP = {
  id: 'rip', kind: 'survival', title: 'Caught in a Rip Current', set: 'beach', music: 'tense',
  caption: 'Caught in a rip current? Stay calm and do this. Save it before your next beach trip! 🌊',
  tags: '#survival #safety #beach #ripcurrent #howto #shorts', footer: 'General safety info. Swim at beaches with lifeguards, follow local flags and warnings, and call emergency services if someone is in trouble.',
  beats: [
    { vo: 'Caught in a rip current? Stay calm. They cause most beach rescues.', time: 'day', rip: 1, cam: { mode: 'static', at: [5, 3.2, 49], look: [0, 0.4, 62] }, tags: [{ t: [0.1, 0.95], text: 'STAY CALM', size: 88, bg: '#ffd23f' }], sfx: ['waves', 'gulls@0.2'],
      actors: [{ id: 'sw', m: 'swimmer', at: [0, 60], y: -0.6, s: 1.8, face: 200, anim: 'panic', ex: 'shock' }] },
    { vo: "It's a channel of water pulling out to sea, but it won't pull you under.", time: 'day', rip: 1, cam: { mode: 'static', at: [12, 10, 40], look: [0, 0, 66] }, tags: [{ t: [0.1, 0.95], text: 'RIP CURRENT', size: 78, bg: '#ff8a3d' }], sfx: ['waves', 'rumble@0.3'],
      actors: [{ id: 'a1', m: 'arrow', at: [0, 48], to: [0, 74], y: -0.2, face: 0, s: 2.2, o: { ph: 0 } }, { id: 'a2', m: 'arrow', at: [-1, 58], to: [-1, 84], y: -0.2, face: 0, s: 2.2, o: { ph: 2 } }, { id: 'a3', m: 'arrow', at: [1, 68], to: [1, 94], y: -0.2, face: 0, s: 2.2, o: { ph: 4 } }, { id: 'sw', m: 'swimmer', at: [0, 52], to: [0, 62], y: -0.6, s: 1.8, face: 200, anim: 'panic', ex: 'worried' }] },
    { vo: "Don't fight it. Float, or swim parallel to the shore until it lets go.", time: 'day', rip: 1, cam: { mode: 'static', at: [-6, 4.4, 50], look: [7, 0.2, 62] }, tags: [{ t: [0.1, 0.95], text: 'SWIM SIDEWAYS', size: 70, bg: '#7cf2c0' }], sfx: ['waves', 'chime@0.7'],
      actors: [{ id: 'a1', m: 'arrow', at: [0, 52], to: [0, 70], y: -0.2, face: 0, s: 2.2 }, { id: 'sw', m: 'swimmer', at: [0, 62], to: [15, 62], y: -0.7, s: 1.8, anim: 'swim', ex: 'determined' }] },
    { vo: 'Then swim back at an angle, and wave and shout for help.', time: 'day', rip: 1, cam: { mode: 'static', at: [18, 4.5, 44], look: [11, 0.2, 54] }, tags: [{ t: [0.1, 0.95], text: 'ANGLE BACK', size: 76, bg: '#7cc4ff' }], sfx: ['waves', 'splash@0.2'],
      actors: [{ id: 'sw', m: 'swimmer', at: [15, 62], to: [9, 46], y: -0.7, s: 1.8, anim: 'swim', ex: 'determined', end: 'wave2' }] },
    { vo: 'To help someone else, call a lifeguard and throw something that floats.', time: 'day', rip: 1, cam: { mode: 'static', at: [-4, 3.6, 30], look: [5, 0.8, 46] }, tags: [{ t: [0.1, 0.95], text: 'CALL A LIFEGUARD', size: 60, bg: '#ff8a9a' }], sfx: ['waves', 'whoosh@0.4', 'cheer@0.7'],
      actors: [{ id: 'lg', m: 'lifeguard', at: [3, 28], face: 0, anim: 'throw', ex: 'determined' }, { id: 'bu', m: 'buoy', at: [3, 28], to: [7, 50], y: [3, -0.2], s: 1.6, from: 0.2, until: 0.6, face: 180 }, { id: 'sw', m: 'swimmer', at: [7, 52], y: -0.7, s: 1.8, face: 200, anim: 'wave2', ex: 'worried' }, { id: 'gr', m: 'girl', at: [-1, 27], face: 10, anim: 'point', ex: 'worried' }] },
  ] };

// ---------------------------------------------------------------------
const ROBOT = {
  id: 'gardener', kind: 'fiction', title: 'The Last Gardener', set: 'wasteland', music: 'sad',
  caption: 'A short fictional story about hope and one tiny seed. 🤖🌱 (This is a made-up story.)',
  tags: '#shortstory #fiction #robot #hope #animatedstory #shorts', footer: 'A fictional story, written for entertainment.',
  beats: [
    { vo: 'Long after the people left, one old robot kept working in the dust.', time: 'hazy', fx: ['dust'], cam: { mode: 'dolly', from: [-6, 2.2, 4], to: [-2, 2, 10], look: [0, 1.4, 18] }, tags: [{ t: [0.12, 0.95], text: 'ALL ALONE', size: 78, bg: '#e0c8a0' }], sfx: ['wind', 'hum@0.1'],
      actors: [{ id: 'rb', m: 'robot', at: [0, 17], face: 190, anim: 'work', ex: 'sad' }, { id: 'sc1', m: 'scrap', at: [-6, 20], s: 1.4, o: { seed: 1 } }, { id: 'sc2', m: 'scrap', at: [7, 22], s: 1.6, o: { seed: 2 } }] },
    { vo: 'One day, it found a single seed hidden under a pile of rusty junk.', time: 'hazy', fx: ['dust'], cam: { mode: 'orbit', target: 'rb', r: 5, h: 1.8, a0: -30, a1: 25 }, tags: [{ t: [0.12, 0.95], text: 'A SINGLE SEED', size: 66, bg: '#ffd23f' }], sfx: ['beep@0.5', 'magic@0.55', 'wind'],
      actors: [{ id: 'sc1', m: 'scrap', at: [-2.6, 18], s: 1.5, o: { seed: 3 } }, { id: 'rb', m: 'robot', at: [0, 16], face: 190, anim: 'stand', ex: 'shock', o: { hold: 'seed' }, exs: [[0, 'neutral'], [0.5, 'shock']] }, { id: 'sp', m: 'sky_sparkle', at: [0.6, 16.4], y: 1.2, s: 0.8, o: { n: 8 }, vis: [0.45, 1] }] },
    { vo: 'It built a tiny shelter, watered the seed with its last drops, and waited.', time: 'dusk', fx: ['dust'], cam: { mode: 'static', at: [3.4, 1.8, 11], look: [0, 0.9, 20] }, tags: [{ t: [0.12, 0.95], text: 'WATER AND WAIT', size: 62, bg: '#7cc4ff' }], sfx: ['wind', 'drip@0.4', 'hum'],
      actors: [{ id: 'sh', m: 'shelter', at: [0, 21], s: 1.2 }, { id: 'rb', m: 'robot', at: [-1.6, 19], face: 150, anim: 'plant', ex: 'smile', o: { hold: 'can' } }, { id: 'dr', m: 'sky_sparkle', at: [0, 21], y: 0.1, s: 0.5, o: { n: 6, col: [120, 200, 255] } }] },
    { vo: 'Days passed. Then a green sprout pushed up through the dust.', time: 'dawn', green: [0, 0.2], cam: { mode: 'dolly', from: [3, 1.2, 12], to: [1.2, 1, 16], look: [0, 0.9, 21] }, tags: [{ t: [0.12, 0.95], text: 'DAYS PASS...', size: 70, bg: '#b9f0d0' }], sfx: ['magic@0.5', 'chime@0.7', 'birds@0.8'],
      actors: [{ id: 'sp', m: 'sprout', at: [0, 21], s: 1.5, o: { g: [0.05, 1] } }, { id: 'rb', m: 'robot', at: [-1.8, 19.5], face: 160, anim: 'look', ex: 'smile' }, { id: 'ss', m: 'sky_sparkle', at: [0, 21], y: 0, s: 0.8, o: { n: 8 }, vis: [0.6, 1] }] },
    { vo: 'Soon flowers bloomed, bees returned, and the world began to grow again.', time: 'clear', green: [0.3, 1], fx: ['confetti'], cam: { mode: 'crane', from: [-4, 3, 6], to: [1, 5, 4], look: [0, 1.4, 20] }, tags: [{ t: [0.12, 0.95], text: 'LIFE RETURNS', size: 72, bg: '#7cf2c0' }], sfx: ['birds', 'buzz', 'chime@0.4', 'cheer@0.7'],
      actors: [{ id: 'sp', m: 'sprout', at: [0, 21], s: 2.2, o: { g: 1 } }, { id: 'rb', m: 'robot', at: [-2.2, 18.4], face: 170, anim: 'celebrate', ex: 'laugh' }, { id: 'sw', m: 'swarm', at: [2, 21], y: 2.6, o: { n: 5, r: 1.8 } }, { id: 'b1', m: 'butterfly', at: [-4, 19], to: [4, 17], y: [1.4, 2.6] }, { id: 'b2', m: 'butterfly', at: [5, 21], to: [-3, 23], y: [2.4, 1.4], a: 0, c: { a: 'pink', b: 'white' } }] },
  ] };

const STORIES = [MOLASSES, WOJTEK, STINK, DANCE, WOOD, HONEY, WOMBAT, LIGHTNING, RIP, ROBOT];
