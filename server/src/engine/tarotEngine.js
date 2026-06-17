const dataLoader = require('./dataLoader');

/**
 * Generates a 4-card spread based on Saju and Numerology
 * @param {object} saju - Result from sajuEngine
 * @param {object} numerology - Result from numerologyEngine
 */
function generateSpread(saju, numerology) {
  const allTarot = dataLoader.getTarot();
  
  // 1. The Anchor (Life Path)
  // For tarot anchor, reduce master numbers (11->2, 22->4, 33->6)
  let anchor = numerology.lifePath;
  if (anchor > 9) {
    anchor = Math.floor(anchor / 10) + (anchor % 10);
  }
  const lifePathCard = dataLoader.findTarotByAnchor(anchor);
  
  // 2. The Day Master Card
  // Find a card whose element matches Day Master.
  // The element field in tarot.csv can be compound like "Air/Metal" or "Earth/Wood"
  const dmElement = saju.dayMaster.element;
  const dmCards = allTarot.filter(t => t.element.includes(dmElement) && t !== lifePathCard);
  const dayMasterCard = dmCards.length > 0 ? dmCards[Math.floor(Math.random() * dmCards.length)] : null;
  
  // 3. The Shadow Card (Missing Element)
  let shadowCard = null;
  if (saju.missingElements.length > 0) {
    const missingEl = saju.missingElements[0]; // Take first missing
    const shadowCards = allTarot.filter(t => t.element.includes(missingEl) && t !== lifePathCard && t !== dayMasterCard);
    if (shadowCards.length > 0) {
      shadowCard = shadowCards[Math.floor(Math.random() * shadowCards.length)];
    }
  }
  
  // 4. The Synthesis Card (Actionable advice)
  // Pick a random card that hasn't been picked yet
  const picked = [lifePathCard, dayMasterCard, shadowCard].filter(Boolean);
  const remaining = allTarot.filter(t => !picked.includes(t));
  const synthesisCard = remaining[Math.floor(Math.random() * remaining.length)];
  
  return {
    lifePathCard,
    dayMasterCard,
    shadowCard,
    synthesisCard
  };
}

module.exports = {
  generateSpread
};
