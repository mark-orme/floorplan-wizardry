
#!/bin/bash

# Make sure this script is executable (chmod +x scripts/dependency-manager.sh)
echo "🔄 Automated Dependency Management"
echo "================================="

# Get current date
DATE=$(date +"%Y-%m-%d")

# Create output directory
mkdir -p reports/dependencies

# Output files
OUTDATED_REPORT="reports/dependencies/outdated-$DATE.json"
AUDIT_REPORT="reports/dependencies/audit-$DATE.json"

echo "📊 Running dependency checks..."

# Check for outdated dependencies
echo "Checking outdated packages..."
npm outdated --json > "$OUTDATED_REPORT"

# Run security audit
echo "Running security audit..."
npm audit --json > "$AUDIT_REPORT"

# Check if there are vulnerable dependencies
VULNERABLE=$(cat "$AUDIT_REPORT" | grep -c "vulnerabilities")

if [ "$VULNERABLE" -gt 0 ]; then
  echo "⚠️ Security vulnerabilities found!"
  echo "   Review $AUDIT_REPORT for details"
  
  # Check if there are fixable vulnerabilities
  FIXABLE=$(cat "$AUDIT_REPORT" | grep -c "fixable")
  
  if [ "$FIXABLE" -gt 0 ]; then
    echo "🔧 Attempting to fix vulnerabilities..."
    npm audit fix
    
    # Check if there are still vulnerabilities that need manual intervention
    npm audit
    if [ $? -ne 0 ]; then
      echo "⚠️ Some vulnerabilities require manual intervention."
      echo "   Run 'npm audit' for details."
    else
      echo "✅ All fixable vulnerabilities have been resolved."
    fi
  fi
else
  echo "✅ No security vulnerabilities found."
fi

echo "📝 Results saved to:"
echo "   - $OUTDATED_REPORT"
echo "   - $AUDIT_REPORT"

echo "✨ Dependency check complete."

