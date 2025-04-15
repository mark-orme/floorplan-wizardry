
#!/bin/bash
echo "Checking for duplicate exports in the project..."

# Use grep to find all export statements
grep -r "export " --include="*.ts" --include="*.tsx" src/ > /tmp/exports.txt

# Look for potential duplicate exports
echo "Potential duplicate exports:"
cat /tmp/exports.txt | grep -o "export.*function \w\+" | sort | uniq -d
cat /tmp/exports.txt | grep -o "export.*const \w\+" | sort | uniq -d
cat /tmp/exports.txt | grep -o "export.*class \w\+" | sort | uniq -d
cat /tmp/exports.txt | grep -o "export.*interface \w\+" | sort | uniq -d
cat /tmp/exports.txt | grep -o "export.*type \w\+" | sort | uniq -d

# Check for wildcard exports which might cause conflicts
echo "Wildcard exports that might cause conflicts:"
grep -r "export \* from" --include="*.ts" --include="*.tsx" src/

echo "Export check completed."
