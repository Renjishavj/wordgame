export const VALID_WORDS = [
  "APPLE", "BRAVE", "CRANE", "DANCE", "EAGLE", "FLAME", "GRAPE", "HEART",
  "IMAGE", "JUICE", "KNIFE", "LEMON", "MAGIC", "NIGHT", "OCEAN", "PEACE",
  "QUEEN", "RIVER", "SNAKE", "TRAIN", "UNCLE", "VOICE", "WATER", "XENON",
  "YOUTH", "ZEBRA", "ABOUT", "BOARD", "CHAIR", "DREAM", "EARTH", "FRUIT",
  "GLASS", "HOUSE", "INDEX", "JOINT", "KNEEL", "LIGHT", "MOUSE", "NOISE",
  "OTHER", "PLANT", "QUICK", "ROUND", "SOUND", "TABLE", "UNDER", "VALUE",
  "WORLD", "XRAYS", "YIELD", "ZONED"
];

export const getDailyWord = () => {
  // Use a fixed epoch to calculate days passed
  const epoch = new Date('2024-01-01T00:00:00');
  const now = new Date();
  
  // Calculate days passed since epoch
  const diffTime = Math.abs(now - epoch);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Use days passed to pick a word from the list
  const wordIndex = diffDays % VALID_WORDS.length;
  return VALID_WORDS[wordIndex];
};
