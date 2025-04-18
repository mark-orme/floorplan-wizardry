
/**
 * Updates README badges with current coverage data
 */
const fs = require('fs');
const path = require('path');

function updateReadmeBadges() {
  try {
    // Read coverage summary
    const coveragePath = path.resolve(__dirname, '../coverage/coverage-summary.json');
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    
    const totalCoverage = Math.floor(coverage.total.statements.pct);
    const color = totalCoverage >= 80 ? 'brightgreen' : totalCoverage >= 60 ? 'yellow' : 'red';
    
    // Read README
    const readmePath = path.resolve(__dirname, '../README.md');
    let readme = fs.readFileSync(readmePath, 'utf8');
    
    // Update coverage badge
    readme = readme.replace(
      /!\[Test Coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-\d+%25-[a-z]+\.svg\)/,
      `![Test Coverage](https://img.shields.io/badge/coverage-${totalCoverage}%25-${color}.svg)`
    );
    
    fs.writeFileSync(readmePath, readme);
    console.log(`Updated coverage badge to ${totalCoverage}%`);
  } catch (error) {
    console.error('Error updating badges:', error);
    process.exit(1);
  }
}

updateReadmeBadges();
