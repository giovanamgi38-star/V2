/**
 * Reduces a number to a single digit or master number (11, 22, 33)
 * @param {number} num 
 * @returns {number}
 */
function reduceNumber(num) {
  if (num === 11 || num === 22 || num === 33) return num;
  if (num < 10) return num;
  
  const sum = String(num).split('').reduce((acc, digit) => acc + Number(digit), 0);
  return reduceNumber(sum);
}

const letterMap = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

function getNameValue(name, type = 'all') {
  const normalized = name.toUpperCase().replace(/[^A-Z]/g, '');
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  
  let total = 0;
  for (const char of normalized) {
    if (type === 'vowels' && !vowels.includes(char)) continue;
    if (type === 'consonants' && vowels.includes(char)) continue;
    total += letterMap[char] || 0;
  }
  
  return reduceNumber(total);
}

/**
 * Calculates Numerology Core Four
 * @param {string} name 
 * @param {string} dateStr - YYYY-MM-DD
 */
function calculateNumerology(name, dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Life Path: Sum of digits in date
  const dateDigits = dateStr.replace(/-/g, '').split('').map(Number);
  const lifePathSum = dateDigits.reduce((acc, d) => acc + d, 0);
  const lifePath = reduceNumber(lifePathSum);
  
  // Expression: Sum of all letters in name
  const expression = getNameValue(name, 'all');
  
  // Soul Urge: Sum of vowels in name
  const soulUrge = getNameValue(name, 'vowels');
  
  // Birthday: The day of birth reduced
  const birthday = reduceNumber(day);
  
  return {
    lifePath,
    expression,
    soulUrge,
    birthday
  };
}

module.exports = {
  calculateNumerology,
  reduceNumber
};
