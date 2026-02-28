#!/bin/bash

# Upload script for The Unveiled Word to Cloudflare R2
BUCKET="theunveiledword"
COUNTER=0

echo "Starting upload to R2 bucket: $BUCKET"

# Function to upload a file with proper content-type
upload_file() {
    local file="$1"
    local key="${file#./}"  # Remove leading ./
    
    # Determine content-type based on extension
    case "${file##*.}" in
        html) content_type="text/html" ;;
        css)  content_type="text/css" ;;
        js)   content_type="application/javascript" ;;
        json) content_type="application/json" ;;
        png)  content_type="image/png" ;;
        jpg|jpeg) content_type="image/jpeg" ;;
        svg)  content_type="image/svg+xml" ;;
        ico)  content_type="image/x-icon" ;;
        xml)  content_type="application/xml" ;;
        txt)  content_type="text/plain" ;;
        gz)   content_type="application/gzip" ;;
        *)    content_type="application/octet-stream" ;;
    esac
    
    echo "[$COUNTER] Uploading $key..."
    npx wrangler r2 object put "$BUCKET/$key" --file "$file" --content-type "$content_type"
    COUNTER=$((COUNTER + 1))
    
    if [ $((COUNTER % 100)) -eq 0 ]; then
        echo "✅ Uploaded $COUNTER files so far..."
    fi
}

# Find all website files and upload them
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" -o -name "*.png" -o -name "*.jpg" -o -name "*.svg" -o -name "*.ico" -o -name "*.xml" -o -name "*.txt" -o -name "*.gz" \) \
    ! -path "./.git/*" \
    ! -path "./build/*" \
    ! -path "./node_modules/*" \
    ! -path "./.wrangler/*" \
    ! -name "upload-to-r2.sh" | \
while read -r file; do
    upload_file "$file"
done

echo "🎉 Upload complete! Uploaded $COUNTER files to https://pub-0afc826038154c3f8c10ce9324bc261a.r2.dev"