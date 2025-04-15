
#!/bin/bash
echo "Checking for duplicate exports in changed files..."

# Get all staged TypeScript files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep ".ts$")

if [ "$STAGED_FILES" = "" ]; then
  echo "No TypeScript files are staged for commit."
  exit 0
fi

# Check for duplicate exports in the staged files
for FILE in $STAGED_FILES; do
  # Look for export statements
  EXPORTS=$(grep "export " "$FILE" | grep -v "export \* from" | grep -o "export.*\(function\|const\|class\|interface\|type\) \w\+")
  
  if [ ! -z "$EXPORTS" ]; then
    echo "Exports in $FILE:"
    echo "$EXPORTS"
    
    # Extract just the names
    EXPORT_NAMES=$(echo "$EXPORTS" | sed -E 's/export.*(function|const|class|interface|type) ([a-zA-Z0-9_]+).*/\2/' | sort)
    
    # Check for these names in other files
    for NAME in $EXPORT_NAMES; do
      OTHER_FILES=$(grep -l "export.*\(function\|const\|class\|interface\|type\) $NAME" --include="*.ts" --include="*.tsx" src/ | grep -v "$FILE")
      
      if [ ! -z "$OTHER_FILES" ]; then
        echo "Warning: '$NAME' in $FILE is also exported from:"
        echo "$OTHER_FILES"
        echo "Consider renaming or using explicit re-exports to avoid conflicts."
        echo ""
      fi
    done
  fi
done

echo "Export check completed."
exit 0
