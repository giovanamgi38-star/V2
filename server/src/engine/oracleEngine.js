const dataLoader = require('./dataLoader');

/**
 * Gets Oracle theme based on Day Branch
 * @param {object} saju - Result from sajuEngine
 */
function getOracleTheme(saju) {
  const dayBranchId = saju.pillars.day.branch.id;
  return dataLoader.findOracle(dayBranchId);
}

module.exports = {
  getOracleTheme
};
