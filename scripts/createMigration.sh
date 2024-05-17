#!/bin/bash

# Get current date/time in YYYYMMDDhhmmss format
now=$(date +%Y%m%d%H%M%S)

# Construct file name
filename="migrations/${now}.do.${1}.sql"

# File content - could be replaced with a template?
content=""

echo "$content" > "$filename"