export const MOTIVATIONAL_PHRASES_START = [
  "Hey, creative warrior!",
  "To the amazing creator,",
  "Feeling the weight of the editing grind?",
  "Take a deep breath, talented editor.",
  "It's okay to feel overwhelmed sometimes,",
  "Just a little reminder, superstar:",
  "Your dedication truly shines,",
  "Remember this, creative soul:",
];

export const MOTIVATIONAL_PHRASES_MIDDLE = [
  "every cut brings you closer to your vision.",
  "your passion is your superpower.",
  "even small breaks make a huge difference.",
  "the final product will be worth every effort.",
  "you're building something incredible, one step at a time.",
  "your unique perspective is what makes your work special.",
  "don't forget the joy of creation.",
  "your audience truly appreciates you.",
];

export const MOTIVATIONAL_PHRASES_END = [
  "You've got this!",
  "Keep that creative fire burning!",
  "We believe in you.",
  "Take a break, you've earned it.",
  "Your art matters.",
  "Push through, you're almost there!",
  "Remember your 'why'.",
  "You're making magic!",
];

/** Function to get a random element */
export const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];