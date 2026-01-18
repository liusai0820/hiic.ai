#!/usr/bin/env python3
"""
HIIC AI Lab Brand Guidelines Poster
Institutional Precision Design Philosophy
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Canvas dimensions (A3 portrait at 150 DPI)
WIDTH = 1754
HEIGHT = 2480
MARGIN = 120

# Color System
COLORS = {
    'primary': '#2563EB',      # Tech Blue
    'primary_light': '#3B82F6',
    'primary_dark': '#1D4ED8',
    'slate_900': '#0F172A',
    'slate_800': '#1E293B',
    'slate_700': '#334155',
    'slate_600': '#475569',
    'slate_500': '#64748B',
    'slate_400': '#94A3B8',
    'slate_300': '#CBD5E1',
    'slate_200': '#E2E8F0',
    'slate_100': '#F1F5F9',
    'slate_50': '#F8FAFC',
    'white': '#FFFFFF',
    'violet': '#7C3AED',
    'emerald': '#059669',
    'amber': '#D97706',
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# Font paths
FONT_DIR = '/Users/liusai/.claude/skills/canvas-design/canvas-fonts'

def load_font(name, size):
    try:
        return ImageFont.truetype(os.path.join(FONT_DIR, name), size)
    except:
        return ImageFont.load_default()

# Create canvas
img = Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(COLORS['white']))
draw = ImageDraw.Draw(img)

# Load fonts
font_title = load_font('InstrumentSans-Bold.ttf', 72)
font_heading = load_font('InstrumentSans-Bold.ttf', 32)
font_subhead = load_font('InstrumentSans-Regular.ttf', 24)
font_body = load_font('InstrumentSans-Regular.ttf', 18)
font_caption = load_font('GeistMono-Regular.ttf', 14)
font_label = load_font('GeistMono-Regular.ttf', 12)
font_large = load_font('InstrumentSans-Bold.ttf', 120)
font_chinese = load_font('NotoSansSC-Bold.ttf', 28)
font_chinese_small = load_font('NotoSansSC-Regular.ttf', 16)

y = MARGIN

# === HEADER SECTION ===
# Logo mark - geometric square with "AI"
logo_size = 80
draw.rectangle([MARGIN, y, MARGIN + logo_size, y + logo_size],
               fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 18, y + 20), "AI", font=load_font('InstrumentSans-Bold.ttf', 36),
          fill=hex_to_rgb(COLORS['white']))

# Title
draw.text((MARGIN + logo_size + 24, y + 8), "HIIC AI Lab",
          font=font_title, fill=hex_to_rgb(COLORS['slate_900']))
draw.text((MARGIN + logo_size + 24, y + 52), "Brand Guidelines",
          font=font_subhead, fill=hex_to_rgb(COLORS['slate_500']))

# Version label
draw.text((WIDTH - MARGIN - 100, y + 10), "v1.0",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_400']))
draw.text((WIDTH - MARGIN - 100, y + 28), "2026.01",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_400']))

y += 140

# Divider line
draw.line([(MARGIN, y), (WIDTH - MARGIN, y)], fill=hex_to_rgb(COLORS['slate_200']), width=1)
y += 60

# === DESIGN PHILOSOPHY ===
draw.text((MARGIN, y), "01", font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 40, y), "DESIGN PHILOSOPHY", font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
y += 40

draw.text((MARGIN, y), "Institutional", font=font_large, fill=hex_to_rgb(COLORS['slate_900']))
y += 100
draw.text((MARGIN, y), "Precision", font=font_large, fill=hex_to_rgb(COLORS['primary']))
y += 130

# Philosophy text
philosophy = "Systematic intelligence expressed through geometric certainty,"
draw.text((MARGIN, y), philosophy, font=font_body, fill=hex_to_rgb(COLORS['slate_600']))
y += 28
philosophy2 = "chromatic restraint, and the weight of considered space."
draw.text((MARGIN, y), philosophy2, font=font_body, fill=hex_to_rgb(COLORS['slate_600']))
y += 70

# === COLOR SYSTEM ===
draw.text((MARGIN, y), "02", font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 40, y), "COLOR SYSTEM", font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
y += 50

# Primary color - large swatch
swatch_size = 160
draw.rectangle([MARGIN, y, MARGIN + swatch_size, y + swatch_size],
               fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + swatch_size + 24, y + 10), "Primary Blue",
          font=font_heading, fill=hex_to_rgb(COLORS['slate_900']))
draw.text((MARGIN + swatch_size + 24, y + 50), "#2563EB",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
draw.text((MARGIN + swatch_size + 24, y + 70), "RGB 37, 99, 235",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
draw.text((MARGIN + swatch_size + 24, y + 90), "HSL 217°, 91%, 53%",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))

# Secondary colors row
sec_x = MARGIN + swatch_size + 250
sec_size = 80
sec_colors = [
    ('Violet', '#7C3AED'),
    ('Emerald', '#059669'),
    ('Amber', '#D97706'),
]
for i, (name, color) in enumerate(sec_colors):
    x = sec_x + i * (sec_size + 20)
    draw.rectangle([x, y, x + sec_size, y + sec_size], fill=hex_to_rgb(color))
    draw.text((x, y + sec_size + 8), name, font=font_label, fill=hex_to_rgb(COLORS['slate_500']))
    draw.text((x, y + sec_size + 24), color, font=font_label, fill=hex_to_rgb(COLORS['slate_400']))

y += swatch_size + 20

# Slate scale
slate_width = (WIDTH - 2 * MARGIN) // 9
slate_colors = ['slate_900', 'slate_800', 'slate_700', 'slate_600', 'slate_500',
                'slate_400', 'slate_300', 'slate_200', 'slate_100']
for i, sc in enumerate(slate_colors):
    x = MARGIN + i * slate_width
    draw.rectangle([x, y, x + slate_width - 4, y + 40], fill=hex_to_rgb(COLORS[sc]))

y += 50
for i, sc in enumerate(slate_colors):
    x = MARGIN + i * slate_width
    label = sc.replace('slate_', '')
    draw.text((x, y), label, font=font_label, fill=hex_to_rgb(COLORS['slate_400']))

y += 60

# === TYPOGRAPHY ===
draw.text((MARGIN, y), "03", font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 40, y), "TYPOGRAPHY", font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
y += 50

# Display font
draw.text((MARGIN, y), "Instrument Sans", font=load_font('InstrumentSans-Bold.ttf', 48),
          fill=hex_to_rgb(COLORS['slate_900']))
draw.text((MARGIN + 450, y + 15), "Display & Headlines", font=font_caption,
          fill=hex_to_rgb(COLORS['slate_500']))
y += 70

# Body font sample
draw.text((MARGIN, y), "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm",
          font=font_subhead, fill=hex_to_rgb(COLORS['slate_700']))
y += 35
draw.text((MARGIN, y), "Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz",
          font=font_subhead, fill=hex_to_rgb(COLORS['slate_700']))
y += 35
draw.text((MARGIN, y), "0 1 2 3 4 5 6 7 8 9",
          font=font_subhead, fill=hex_to_rgb(COLORS['slate_700']))
y += 50

# Mono font
draw.text((MARGIN, y), "Geist Mono", font=load_font('GeistMono-Bold.ttf', 28),
          fill=hex_to_rgb(COLORS['slate_900']))
draw.text((MARGIN + 220, y + 5), "Code & Labels", font=font_caption,
          fill=hex_to_rgb(COLORS['slate_500']))
y += 45

draw.text((MARGIN, y), "const app = { id: 'hiic-ai-lab', version: '1.0' };",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_600']))
y += 50

# === SPACING SYSTEM ===
draw.text((MARGIN, y), "04", font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 40, y), "SPACING GRID", font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
y += 50

# Grid visualization
grid_sizes = [4, 8, 12, 16, 24, 32, 48, 64]
grid_x = MARGIN
for size in grid_sizes:
    # Draw square
    draw.rectangle([grid_x, y, grid_x + size, y + size],
                   fill=hex_to_rgb(COLORS['primary_light']))
    grid_x += size + 24

y += 80
grid_x = MARGIN
for size in grid_sizes:
    draw.text((grid_x, y), str(size), font=font_label, fill=hex_to_rgb(COLORS['slate_500']))
    grid_x += size + 24

y += 50

# === ICON STYLE ===
draw.text((MARGIN, y), "05", font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 40, y), "ICON SYSTEM", font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
y += 50

# Icon containers
icon_size = 56
icon_spacing = 80
icons_y = y
for i in range(6):
    x = MARGIN + i * icon_spacing
    # Icon container
    draw.rounded_rectangle([x, icons_y, x + icon_size, icons_y + icon_size],
                           radius=12, fill=hex_to_rgb(COLORS['slate_100']))
    # Simple geometric shapes to represent icons
    cx, cy = x + icon_size // 2, icons_y + icon_size // 2
    if i == 0:  # Circle
        draw.ellipse([cx-12, cy-12, cx+12, cy+12], fill=hex_to_rgb(COLORS['primary']))
    elif i == 1:  # Square
        draw.rectangle([cx-10, cy-10, cx+10, cy+10], fill=hex_to_rgb(COLORS['violet']))
    elif i == 2:  # Triangle (approximated)
        draw.polygon([(cx, cy-12), (cx-12, cy+10), (cx+12, cy+10)],
                     fill=hex_to_rgb(COLORS['emerald']))
    elif i == 3:  # Line
        draw.line([(cx-12, cy), (cx+12, cy)], fill=hex_to_rgb(COLORS['amber']), width=4)
    elif i == 4:  # Cross
        draw.line([(cx-10, cy-10), (cx+10, cy+10)], fill=hex_to_rgb(COLORS['primary']), width=3)
        draw.line([(cx+10, cy-10), (cx-10, cy+10)], fill=hex_to_rgb(COLORS['primary']), width=3)
    elif i == 5:  # Dots
        for dx, dy in [(-8, -8), (8, -8), (-8, 8), (8, 8)]:
            draw.ellipse([cx+dx-3, cy+dy-3, cx+dx+3, cy+dy+3],
                         fill=hex_to_rgb(COLORS['slate_600']))

# Icon specs
draw.text((MARGIN + 520, icons_y + 10), "Lucide Icons", font=font_subhead,
          fill=hex_to_rgb(COLORS['slate_900']))
draw.text((MARGIN + 520, icons_y + 38), "24px base size / 2px stroke", font=font_caption,
          fill=hex_to_rgb(COLORS['slate_500']))

y += 100

# === COMPONENT RADIUS ===
draw.text((MARGIN, y), "06", font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 40, y), "BORDER RADIUS", font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
y += 50

# Radius examples
radii = [('none', 0), ('sm', 4), ('md', 8), ('lg', 12), ('xl', 16), ('2xl', 24)]
rad_x = MARGIN
for name, r in radii:
    draw.rounded_rectangle([rad_x, y, rad_x + 80, y + 50], radius=r,
                           fill=hex_to_rgb(COLORS['slate_200']))
    draw.text((rad_x + 25, y + 58), name, font=font_label, fill=hex_to_rgb(COLORS['slate_500']))
    rad_x += 100

y += 110

# === PRINCIPLES ===
draw.text((MARGIN, y), "07", font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((MARGIN + 40, y), "DESIGN PRINCIPLES", font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))
y += 50

# Principle boxes
principles = [
    ("Clarity", "Information hierarchy through visual weight"),
    ("Restraint", "Purposeful minimalism, no decoration"),
    ("Precision", "Pixel-perfect alignment and spacing"),
    ("Consistency", "Systematic application of all elements"),
]

box_width = (WIDTH - 2 * MARGIN - 30) // 2
box_height = 90
for i, (title, desc) in enumerate(principles):
    col = i % 2
    row = i // 2
    x = MARGIN + col * (box_width + 30)
    by = y + row * (box_height + 16)

    draw.rounded_rectangle([x, by, x + box_width, by + box_height], radius=12,
                           fill=hex_to_rgb(COLORS['slate_50']),
                           outline=hex_to_rgb(COLORS['slate_200']))
    draw.text((x + 20, by + 20), title, font=font_heading, fill=hex_to_rgb(COLORS['slate_900']))
    draw.text((x + 20, by + 55), desc, font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))

y += 230

# === FOOTER ===
draw.line([(MARGIN, y), (WIDTH - MARGIN, y)], fill=hex_to_rgb(COLORS['slate_200']), width=1)
y += 30

# Footer content
draw.text((MARGIN, y), "HIIC AI Lab", font=font_subhead, fill=hex_to_rgb(COLORS['slate_900']))
draw.text((MARGIN, y + 30), "Shenzhen National High-tech Industry Innovation Center",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_500']))

draw.text((WIDTH - MARGIN - 200, y), "Institutional Precision",
          font=font_caption, fill=hex_to_rgb(COLORS['primary']))
draw.text((WIDTH - MARGIN - 200, y + 18), "Design System v1.0",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_400']))
draw.text((WIDTH - MARGIN - 200, y + 36), "github.com/liusai0820",
          font=font_caption, fill=hex_to_rgb(COLORS['slate_400']))

# Save
output_path = '/Users/liusai/hiic.ai/brand/HIIC-AI-Lab-Brand-Guidelines.png'
img.save(output_path, 'PNG', dpi=(150, 150))
print(f"Brand guidelines poster saved to: {output_path}")
