const sajuEngine = require('./sajuEngine');
const numerologyEngine = require('./numerologyEngine');
const tarotEngine = require('./tarotEngine');
const oracleEngine = require('./oracleEngine');
const narrativeEngine = require('./narrativeEngine');

/**
 * Main function to generate a Syntropy reading
 * @param {string} name 
 * @param {string} birthDate - YYYY-MM-DD
 * @param {string} birthTime - HH:mm
 */
function generateReading(name, birthDate, birthTime) {
  // 1. Calculate base data
  const saju = sajuEngine.calculateSaju(birthDate, birthTime);
  const numerology = numerologyEngine.calculateNumerology(name, birthDate);
  const tarotSpread = tarotEngine.generateSpread(saju, numerology);
  const oracleTheme = oracleEngine.getOracleTheme(saju);

  // 2. Apply Fusion Rules & Confirmation Logic
  const signals = [];
  
  const lpArchetype = require('./dataLoader').findNumerology(numerology.lifePath);
  
  if (lpArchetype && lpArchetype.element.includes(saju.dayMaster.element)) {
    signals.push({
      type: 'Syntropy Effect',
      name: 'Life Path Alignment',
      description: 'The elemental frequency of your Life Path matches your Day Master.'
    });
  }

  const lpElement = lpArchetype ? lpArchetype.element : '';
  const dmElement = saju.dayMaster.element;
  const majorTarotElement = tarotSpread.lifePathCard.element;
  
  if (lpElement.includes(dmElement) && majorTarotElement.includes(dmElement)) {
    signals.push({
      type: 'Triple Signal',
      name: 'Elemental Confluence',
      description: 'Your blueprint, mission, and current message all converge on ' + dmElement + '.'
    });
  }

  saju.missingElements.forEach(el => {
    const remedyCards = Object.values(tarotSpread).filter(card => card && card.element.includes(el));
    if (remedyCards.length > 0) {
      signals.push({
        type: 'Void Bridge',
        name: el + ' Remediation',
        description: 'The ' + el + ' element you lack in your Saju chart is provided by your Tarot spread.'
      });
    }
  });

  const baseResult = {
    input: { name, birthDate, birthTime },
    saju,
    numerology,
    tarotSpread,
    oracleTheme,
    signals
  };

  // 3. Generate Narrative
  const narrative = narrativeEngine.generateNarrative(baseResult);

  return {
    ...baseResult,
    narrative
  };
}

module.exports = {
  generateReading
};
