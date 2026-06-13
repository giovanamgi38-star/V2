const { Solar } = require('lunar-javascript');
const dataLoader = require('./dataLoader');

/**
 * Calculates Saju Pillars and Elemental Balance
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} timeStr - HH:mm
 */
function calculateSaju(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  
  // Create Solar date object
  // Note: We might need to adjust for longitude/timezone if we had place data
  // For now, using the provided birth date/time directly.
  const date = new Date(year, month - 1, day, hour, minute);
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const pillars = {
    year: {
      stem: dataLoader.findStem(eightChar.getYearGan()),
      branch: dataLoader.findBranch(eightChar.getYearZhi())
    },
    month: {
      stem: dataLoader.findStem(eightChar.getMonthGan()),
      branch: dataLoader.findBranch(eightChar.getMonthZhi())
    },
    day: {
      stem: dataLoader.findStem(eightChar.getDayGan()),
      branch: dataLoader.findBranch(eightChar.getDayZhi())
    },
    hour: {
      stem: dataLoader.findStem(eightChar.getTimeGan()),
      branch: dataLoader.findBranch(eightChar.getTimeZhi())
    }
  };

  const dayMaster = pillars.day.stem;
  
  // Calculate Elemental Balance
  const elements = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach(p => {
    if (p.stem) elements[p.stem.element]++;
    if (p.branch) elements[p.branch.element]++;
  });

  const missingElements = Object.keys(elements).filter(el => elements[el] === 0);

  return {
    pillars,
    dayMaster,
    elements,
    missingElements
  };
}

module.exports = {
  calculateSaju
};
