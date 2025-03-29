
module.exports = {
  "*.{js,ts,tsx}": [
    "eslint --config ./eslint/export-validation.js --fix",
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": ["prettier --write"]
};
