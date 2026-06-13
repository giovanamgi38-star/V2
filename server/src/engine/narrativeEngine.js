/**
 * Generates the editorial narrative based on the synthesis result.
 * Follows the "System Architect" tone: Direct, technical, objective.
 */
function generateNarrative(synthesis) {
  const { saju, numerology, tarotSpread, oracleTheme, signals } = synthesis;
  
  const dm = saju.dayMaster;
  const lp = numerology.lifePath;
  
  // Part 1: Core Essence
  let coreEssence = `Your structure shows a functional alignment with ${dm.element} ${dm.polarity} through the Day Master, `;
  coreEssence += `interfacing with a Life Path frequency of ${lp}. `;
  
  if (saju.missingElements.length > 0) {
    coreEssence += `The absence of ${saju.missingElements.join(', ')} creates an open loop in your operational blueprint, requiring external intervention to stabilize.`;
  }

  // Part 2: Identifiers
  const identifiers = [
    {
      label: 'Tronco del Día (Day Master)',
      value: `${dm.name_en} (${dm.name_kr})`,
      description: `${dm.element} ${dm.polarity}: ${dm.traits}`
    },
    {
      label: 'Life Path Number',
      value: lp.toString(),
      description: `Defines the primary mission frequency and temporal rhythm.`
    }
  ];

  // Part 3: Dynamics & Interventions
  const dynamics = [];
  
  // Dynamic 1: Day Master trait
  dynamics.push({
    title: `Core Operational Mode: ${dm.element}`,
    description: `Your system naturally defaults to ${dm.element} qualities. This results in ${dm.traits.toLowerCase()}.`,
    intervention: `To optimize, lean into the productive cycle of ${dm.element}.`
  });

  // Dynamic 2: Missing Element (if any)
  if (saju.missingElements.length > 0) {
    const missing = saju.missingElements[0];
    dynamics.push({
      title: `System Gap: ${missing}`,
      description: `The lack of ${missing} energy leads to a deficit in ${getMissingElementDeficit(missing)}.`,
      intervention: `Intervención concreta: Incorporate ${getMissingElementRemedy(missing)} into your daily routine.`
    });
  }

  // Dynamic 3: Tarot Synthesis
  dynamics.push({
    title: `Situational Directive: ${tarotSpread.synthesisCard.card_name}`,
    description: `The current narrative message indicates a need for ${tarotSpread.synthesisCard.keywords.toLowerCase()}.`,
    intervention: `Action: ${getTarotAction(tarotSpread.synthesisCard)}`
  });

  return {
    coreEssence,
    identifiers,
    dynamics
  };
}

function getMissingElementDeficit(el) {
  const map = {
    Wood: 'growth and expansion',
    Fire: 'passion and visibility',
    Earth: 'stability and grounding',
    Metal: 'refinement and logic',
    Water: 'wisdom and flow'
  };
  return map[el] || 'balance';
}

function getMissingElementRemedy(el) {
  const map = {
    Wood: 'green colors and nature walks',
    Fire: 'bright lights and social activity',
    Earth: 'physical exercise and routine',
    Metal: 'organization and minimalist design',
    Water: 'meditation and fluid movement'
  };
  return map[el] || 'new habits';
}

function getTarotAction(card) {
  // Simple heuristic or mapping could be here
  return `Reflect on how ${card.keywords.toLowerCase()} can be integrated into your current decision-making process.`;
}

module.exports = {
  generateNarrative
};
