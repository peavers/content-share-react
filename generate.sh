.#!/bin/bash

openapi-generator-cli generate \
    -i openapi.json \
    -g typescript-axios \
    -o ./src/generated \

 # Path to the generated models file
 MODELS_FILE="./src/generated/api.ts"

 # Check if the file exists
 if [ ! -f "$MODELS_FILE" ]; then
   echo "Error: Generated API file not found at $MODELS_FILE"
   exit 1
 fi

 # Create a backup of the original file
 cp "$MODELS_FILE" "${MODELS_FILE}.bak"

 # Replace optional properties (ending with ?) with required properties
 # This uses sed to replace patterns like "propertyName?: type;" with "propertyName: type;"
 if [[ "$OSTYPE" == "darwin"* ]]; then
   # macOS uses different sed syntax
   sed -i '' 's/\([a-zA-Z0-9_]*\)?: \([^;]*\);/\1: \2;/g' "$MODELS_FILE"
 else
   # Linux and other systems
   sed -i 's/\([a-zA-Z0-9_]*\)?: \([^;]*\);/\1: \2;/g' "$MODELS_FILE"
 fi

 echo "Successfully converted optional properties to required properties in $MODELS_FILE"
 echo "A backup of the original file was created at ${MODELS_FILE}.bak"