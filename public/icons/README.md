# PWA Icon Generation

The `/public/icons/icon.svg` file contains the source icon design.

To generate all required icon sizes, you can use an online tool or a script:

## Required Icon Sizes for iOS PWA:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Using Online Tools:
1. Visit https://realfavicongenerator.net/ or similar PWA icon generator
2. Upload the `icon.svg` file
3. Generate and download all required sizes
4. Place them in the `/public/icons/` directory

## Using Command Line (requires imagemagick):
```bash
# Install imagemagick first
# For macOS: brew install imagemagick
# For Ubuntu: sudo apt-get install imagemagick

# Convert SVG to PNG at different sizes
for size in 72 96 128 144 152 192 384 512; do
  convert -background none -resize ${size}x${size} icon.svg icon-${size}x${size}.png
done
```

## Temporary Placeholder
For development, create simple placeholder files or the manifest will reference missing images.
The app will still work, but won't have proper icons when installed.
