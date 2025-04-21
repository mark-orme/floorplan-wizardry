
#!/bin/bash

# Script to check for common naming convention issues that could cause build errors
# Usage: ./scripts/check-naming-conventions.sh

echo "Checking for naming convention issues..."

# Define color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check for case sensitivity issues (files with same name but different case)
echo "Checking for case sensitivity issues..."
found_case_issues=false

# Use find to get all files in src directory
files=$(find ./src -type f -name "*.ts" -o -name "*.tsx" | sort)

# Create a temporary file to store lowercase filenames
tmp_file=$(mktemp)

# Process each file
for file in $files; do
  # Get the basename of the file
  basename=$(basename "$file")
  # Convert to lowercase for comparison
  lowercase=$(echo "$basename" | tr '[:upper:]' '[:lower:]')
  # Get the directory
  dir=$(dirname "$file")
  
  # Check if this lowercase name has been seen before in the same directory
  if grep -q "^$dir:$lowercase$" "$tmp_file"; then
    found_case_issues=true
    echo -e "${RED}CASE SENSITIVITY ISSUE: $file${NC}"
    echo -e "${RED}This conflicts with another file with the same name but different case in the same directory${NC}"
  else
    # Add to our temp file
    echo "$dir:$lowercase" >> "$tmp_file"
  fi
done

# Check React component files for proper casing
echo "Checking React component files for proper naming..."
found_component_issues=false

for file in $(find ./src -type f -name "*.tsx"); do
  basename=$(basename "$file")
  
  # Check if component file follows PascalCase naming
  if [[ ! "$basename" =~ ^[A-Z][a-zA-Z0-9]*\.tsx$ ]]; then
    found_component_issues=true
    echo -e "${YELLOW}COMPONENT NAMING ISSUE: $file${NC}"
    echo -e "${YELLOW}React component files should use PascalCase (e.g., Button.tsx)${NC}"
  fi
done

# Check hook files
echo "Checking hook files for proper naming..."
found_hook_issues=false

for file in $(find ./src -type f -name "*.ts" -o -name "*.tsx" | grep -E "use[A-Z]"); do
  basename=$(basename "$file")
  
  # Check if hook file follows useXxx naming
  if [[ ! "$basename" =~ ^use[A-Z][a-zA-Z0-9]*\.(ts|tsx)$ ]]; then
    found_hook_issues=true
    echo -e "${YELLOW}HOOK NAMING ISSUE: $file${NC}"
    echo -e "${YELLOW}Hook files should follow the pattern useXxx.ts or useXxx.tsx${NC}"
  fi
done

# Check import paths in files
echo "Checking for potential import path issues..."
found_import_issues=false

for file in $(find ./src -type f -name "*.ts" -o -name "*.tsx"); do
  # Look for potential case-insensitive imports
  imports=$(grep -E "import.*from '\.\/[a-zA-Z]+" "$file" || true)
  
  if [ ! -z "$imports" ]; then
    for import in $imports; do
      # This is a simplified check - a more robust implementation would parse the imports properly
      if [[ "$import" =~ from\ \'\.\/([a-zA-Z0-9]+)\' ]]; then
        imported_file="${BASH_REMATCH[1]}"
        
        # Check if the file exists with the exact same case
        if [ ! -f "$(dirname "$file")/$imported_file.ts" ] && 
           [ ! -f "$(dirname "$file")/$imported_file.tsx" ] && 
           [ -f "$(dirname "$file")/${imported_file,,}.ts" -o -f "$(dirname "$file")/${imported_file,,}.tsx" ]; then
          found_import_issues=true
          echo -e "${YELLOW}POTENTIAL IMPORT ISSUE in $file${NC}"
          echo -e "${YELLOW}Importing '$imported_file' but it might actually be '${imported_file,,}'${NC}"
        fi
      fi
    done
  fi
done

# Check if we found any issues
if [ "$found_case_issues" = false ] && [ "$found_component_issues" = false ] && [ "$found_hook_issues" = false ] && [ "$found_import_issues" = false ]; then
  echo -e "${GREEN}No naming convention issues found!${NC}"
  exit 0
else
  if [ "$found_case_issues" = true ]; then
    echo -e "${RED}✗ Case sensitivity issues found. These will cause build errors on case-sensitive file systems!${NC}"
  fi
  if [ "$found_component_issues" = true ] || [ "$found_hook_issues" = true ] || [ "$found_import_issues" = true ]; then
    echo -e "${YELLOW}⚠ Naming convention issues found. Consider fixing for better maintainability.${NC}"
  fi
  # Exit with non-zero code if we found any case sensitivity issues (these are critical)
  [ "$found_case_issues" = true ] && exit 1 || exit 0
fi

# Clean up
rm "$tmp_file"
