
#!/bin/bash

# Make sure the script is executable
chmod +x $(dirname "$0")/ensure-vite.sh

# Run the ensure-vite script
$(dirname "$0")/ensure-vite.sh "$@"
