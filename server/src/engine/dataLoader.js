const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const DATA_DIR = '/home/team/shared/methodology/data';

function loadCsv(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    cast: true
  });
}

const data = {
  stems: loadCsv('stems.csv'),
  branches: loadCsv('branches.csv'),
  numerology: loadCsv('numerology.csv'),
  tarot: loadCsv('tarot.csv'),
  oracle: loadCsv('oracle.csv')
};

module.exports = {
  getStems: () => data.stems,
  getBranches: () => data.branches,
  getNumerology: () => data.numerology,
  getTarot: () => data.tarot,
  getOracle: () => data.oracle,
  
  findStem: (id) => data.stems.find(s => s.id === id || s.name_kr === id),
  findBranch: (id) => data.branches.find(b => b.id === id || b.name_kr === id),
  findNumerology: (num) => data.numerology.find(n => n.number === num),
  findTarotByAnchor: (anchor) => data.tarot.find(t => t.life_path_anchor === anchor),
  findTarotByName: (name) => data.tarot.find(t => t.card_name === name),
  findOracle: (branchId) => data.oracle.find(o => o.branch_id === branchId)
};
