
/**
 * Custom ESLint formatter that provides detailed error reporting
 * @param {Array} results - The ESLint results array
 * @returns {string} Formatted output
 */
module.exports = function(results) {
  return results.map(r => {
    const header = `\nFile: ${r.filePath}`;
    const body = r.messages.map(m =>
      `  [${m.ruleId}@${m.severity===2?'error':'warn'}] `+
      `(${m.line}:${m.column}) ${m.message}`
    ).join("\n");
    return header + "\n" + body;
  }).join("\n");
};
