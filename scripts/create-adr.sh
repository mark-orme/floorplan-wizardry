
#!/bin/bash
# Script to create a new ADR using adr-tools

# Ensure adr-tools is installed
if ! command -v adr &> /dev/null; then
  echo "Error: adr-tools is not installed"
  echo "Install with: npm install -g adr-tools"
  exit 1
fi

# Check if argument is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 \"Title of the ADR\""
  exit 1
fi

# Create new ADR
ADR_NUM=$(adr new "$1")
ADR_FILE=$(echo "$ADR_NUM" | grep -o '[0-9].*\.md')

echo "Created new ADR: $ADR_FILE"
echo "Don't forget to document your decision!"

# Reminder for the structure
echo "Remember to include:
- Context
- Decision
- Status
- Consequences
- Compliance"

# Open in editor if available
if command -v code &> /dev/null; then
  code "docs/architecture/adr/$ADR_FILE"
fi
