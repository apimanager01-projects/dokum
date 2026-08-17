"""Generates public/paper-grain.png — the product's paper ground (#116, landed by #122).

The output is committed, so this runs only when the grain itself is re-tuned. It is
deterministic (seeded), so re-running it with the same constants reproduces the
committed tile byte for byte.

    python scripts/generate-grain.py        # from the repo root

Two things depend on the exact pixels and must be re-checked if they change:
  - #118's contrast table, every ratio of which is measured against the GRAINED
    darkest ground rather than the flat mean. `--dokum-ink-muted` has no margin.
  - #120's html2canvas measurements — the export softens fine detail at 2x, so a
    finer grain loses more in the PNG than it does on screen.

Why a generated tile rather than tiling docs/design/references/01-paper-grain-cream.jpg:
the scan is 691x1024, so a landing page shows an obvious repeat. This makes a small
SEAMLESS tile (blur applied to a 3x3 layout, then centre-cropped, so edges wrap) that
carries the scan's measured character and not its dimensions.

Measured off the reference:
    mean RGB      (243, 236, 229) = #f3ece5
    luma p5..p95  224 .. 249      -> the excursion is +-~12/255 around the mean
That excursion is what has to stay small for WCAG to keep holding on a textured
ground (a ratio assumes a FLAT background; here it must hold at the darkest point).
"""

from PIL import Image, ImageFilter
import random

SIZE = 200
random.seed(116)  # ticket number; keeps regeneration deterministic


def seamless_noise(size, blur):
    """Uniform noise blurred with wraparound, so the tile edges match."""
    noise = Image.new("L", (size, size))
    noise.putdata([random.randrange(256) for _ in range(size * size)])
    # Lay the tile out 3x3 so the blur kernel sees its own wrapped neighbours,
    # then take the centre cell back out.
    big = Image.new("L", (size * 3, size * 3))
    for x in range(3):
        for y in range(3):
            big.paste(noise, (x * size, y * size))
    big = big.filter(ImageFilter.GaussianBlur(blur))
    return big.crop((size, size, size * 2, size * 2))


# Two scales: fine fibre + a slower cloud, so the grain doesn't read as TV static.
fibre = seamless_noise(SIZE, 0.6)
cloud = seamless_noise(SIZE, 4.0)

fibre_px = list(fibre.getdata())
cloud_px = list(cloud.getdata())

# Sparse dark inclusions — the flecks visible in the scan.
flecks = set()
for _ in range(14):
    flecks.add((random.randrange(SIZE), random.randrange(SIZE)))

INK = (122, 105, 88)  # warm brown-grey; the colour the fibres darken toward
LIT = (255, 253, 246)  # the raised fibres catching light
out = Image.new("RGBA", (SIZE, SIZE))
px = []
for i in range(SIZE * SIZE):
    x, y = i % SIZE, i // SIZE
    # Centre both channels on 0. The sign picks the colour, so the tile swings
    # BOTH ways around the ground rather than only darkening it — flat cream
    # with specks subtracted reads as dirt; paper reads as fibre catching light.
    d = (128 - fibre_px[i]) / 128 * 0.62 + (128 - cloud_px[i]) / 128 * 0.38
    # 0.24 and 0.32 are the first pass's 0.30/0.40 at 80%: Jakob looked at the
    # rendered catalog and asked for ~20% less. Amplitude is the only thing
    # that changed — grain size, seed and fleck count are as they were.
    colour = INK if d >= 0 else LIT
    a = abs(d) * 0.24
    if (x, y) in flecks:
        colour, a = INK, 0.32
    px.append((*colour, round(min(a, 1.0) * 255)))
out.putdata(px)
out.save("public/paper-grain.png")

mean_alpha = sum(p[3] for p in px) / len(px)
print(f"wrote public/paper-grain.png  {SIZE}x{SIZE}")
print(f"mean alpha {mean_alpha:.1f}/255  max alpha {max(p[3] for p in px)}/255")
