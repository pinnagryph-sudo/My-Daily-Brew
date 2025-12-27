#!/usr/bin/env python3
"""Generate PWA icons for My Daily Brew app"""

from PIL import Image, ImageDraw, ImageFont
import os

# Icon sizes needed for PWA
SIZES = [32, 72, 96, 128, 144, 152, 192, 384, 512]

# Colors from the cafe theme
BG_COLOR = (245, 230, 211)  # #F5E6D3
BROWN_DARK = (93, 64, 55)   # #5D4037
BROWN_MID = (139, 115, 85)  # #8B7355
CREAM = (253, 251, 247)     # #FDFBF7

def create_icon(size):
    """Create a single icon at the specified size"""
    # Create image with cafe beige background
    img = Image.new('RGBA', (size, size), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)
    
    # Calculate proportions
    center = size // 2
    cup_width = int(size * 0.5)
    cup_height = int(size * 0.4)
    cup_top = int(size * 0.35)
    
    # Draw coffee cup body (rounded rectangle)
    cup_left = center - cup_width // 2
    cup_right = center + cup_width // 2
    cup_bottom = cup_top + cup_height
    
    # Cup body
    corner_radius = int(size * 0.08)
    draw.rounded_rectangle(
        [cup_left, cup_top, cup_right, cup_bottom],
        radius=corner_radius,
        fill=CREAM,
        outline=BROWN_DARK,
        width=max(2, size // 64)
    )
    
    # Cup handle
    handle_size = int(size * 0.15)
    handle_left = cup_right - max(2, size // 64)
    handle_top = cup_top + int(cup_height * 0.2)
    handle_right = handle_left + handle_size
    handle_bottom = handle_top + int(cup_height * 0.5)
    
    # Draw handle as arc
    draw.arc(
        [handle_left, handle_top, handle_right, handle_bottom],
        start=-90, end=90,
        fill=BROWN_DARK,
        width=max(2, size // 48)
    )
    
    # Steam lines
    steam_start_y = cup_top - int(size * 0.05)
    steam_height = int(size * 0.15)
    line_width = max(2, size // 64)
    
    for i, x_offset in enumerate([-0.12, 0, 0.12]):
        x = center + int(size * x_offset)
        # Wavy steam line
        points = []
        for y in range(0, steam_height, max(2, size // 32)):
            wave = int(size * 0.02 * (1 if (y // (size // 16)) % 2 == 0 else -1))
            points.append((x + wave, steam_start_y - y))
        
        if len(points) >= 2:
            draw.line(points, fill=BROWN_MID, width=line_width)
    
    # Coffee surface (brown ellipse inside cup)
    coffee_margin = int(size * 0.06)
    coffee_top = cup_top + coffee_margin
    draw.ellipse(
        [cup_left + coffee_margin, coffee_top, 
         cup_right - coffee_margin, coffee_top + int(size * 0.08)],
        fill=BROWN_MID
    )
    
    # Add subtle checkmark in corner for "tracker" feel
    check_size = int(size * 0.18)
    check_margin = int(size * 0.08)
    check_center_x = size - check_margin - check_size // 2
    check_center_y = size - check_margin - check_size // 2
    
    # Checkmark circle background
    draw.ellipse(
        [check_center_x - check_size // 2, check_center_y - check_size // 2,
         check_center_x + check_size // 2, check_center_y + check_size // 2],
        fill=BROWN_DARK
    )
    
    # Checkmark
    check_line_width = max(2, size // 48)
    check_points = [
        (check_center_x - check_size // 4, check_center_y),
        (check_center_x - check_size // 10, check_center_y + check_size // 4),
        (check_center_x + check_size // 3, check_center_y - check_size // 4)
    ]
    draw.line(check_points[:2], fill=CREAM, width=check_line_width)
    draw.line(check_points[1:], fill=CREAM, width=check_line_width)
    
    return img

def main():
    output_dir = "/home/claude/daily-brew-pwa/icons"
    os.makedirs(output_dir, exist_ok=True)
    
    for size in SIZES:
        icon = create_icon(size)
        filename = f"icon-{size}.png"
        filepath = os.path.join(output_dir, filename)
        icon.save(filepath, "PNG")
        print(f"Created {filename}")
    
    # Create screenshot placeholders (simple colored rectangles with text)
    # Wide screenshot
    wide = Image.new('RGB', (1280, 720), BG_COLOR)
    wide_draw = ImageDraw.Draw(wide)
    wide_draw.rectangle([40, 40, 1240, 680], outline=BROWN_MID, width=4)
    wide_draw.text((640, 360), "My Daily Brew", fill=BROWN_DARK, anchor="mm")
    wide.save(os.path.join(output_dir, "screenshot-wide.png"), "PNG")
    print("Created screenshot-wide.png")
    
    # Narrow screenshot  
    narrow = Image.new('RGB', (750, 1334), BG_COLOR)
    narrow_draw = ImageDraw.Draw(narrow)
    narrow_draw.rectangle([30, 30, 720, 1304], outline=BROWN_MID, width=4)
    narrow_draw.text((375, 667), "My Daily Brew", fill=BROWN_DARK, anchor="mm")
    narrow.save(os.path.join(output_dir, "screenshot-narrow.png"), "PNG")
    print("Created screenshot-narrow.png")
    
    print("\nAll icons generated successfully!")

if __name__ == "__main__":
    main()
