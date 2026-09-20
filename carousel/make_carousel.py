"""Generate the stacked-PRs carousel PDF (minimal black/white, non-AI look).

Run:  python make_carousel.py
Out:  stacked-prs.pdf  (1080x1350, 8 slides)

Layout contract (keeps every slide balanced):
  header  : label + hairline      top
  title   : Big Shoulders         upper third
  body    : anchored mid-block
  footer  : takeaway + rule       fixed baseline (TAKE_Y)
"""
import os
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import black, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = r"C:\Users\Nishant\.agents\skills\canvas-design\canvas-fonts"

pdfmetrics.registerFont(TTFont("BigShoulders", os.path.join(FONTS, "BigShoulders-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Mono", os.path.join(FONTS, "JetBrainsMono-Regular.ttf")))
pdfmetrics.registerFont(TTFont("MonoB", os.path.join(FONTS, "JetBrainsMono-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Serif", os.path.join(FONTS, "LibreBaskerville-Regular.ttf")))

W, H = 1080, 1350
M = 96
TAKE_Y = 236          # closing takeaway baseline
FOOT_RULE_Y = 300     # hairline above the takeaway
OUT = os.path.join(HERE, "stacked-prs.pdf")

c = rl_canvas.Canvas(OUT, pagesize=(W, H))
c.setTitle("Stacked PRs")
c.setAuthor("Nishant Verma")


def page_bg():
    c.setFillColor(white)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(black)


def rule(y, x1=M, x2=W - M, width=2.4):
    c.setLineWidth(width)
    c.setStrokeColor(black)
    c.line(x1, y, x2, y)


def header(label, rule_after=True):
    c.setFont("Mono", 17)
    c.drawString(M, H - M - 8, label.upper())
    if rule_after:
        rule(H - M - 34)


def title(text, y, size=104):
    c.setFont("BigShoulders", size)
    c.drawString(M, y, text)


def footer(n, takeaway=None, note=None):
    if takeaway:
        rule(FOOT_RULE_Y, width=1.2)
        c.setFont("Serif", 28)
        c.drawString(M, TAKE_Y, takeaway)
    if note:
        c.setFont("Mono", 15)
        c.drawString(M, 60, note)
    c.setFont("Mono", 15)
    c.drawRightString(W - M, 60, "%02d / 08" % n)


def body(lines, y0, size=21, leading=44, indent=0):
    c.setFont("Mono", size)
    y = y0
    for ln in lines:
        c.drawString(M + indent, y, ln)
        y -= leading
    return y


# ---------------- 1 cover ----------------
page_bg()
header("github 2026  /  pull requests")
title("STACKED", H - 300, 168)
title("PRs", H - 450, 168)
c.setFont("Serif", 27)
c.drawString(M, H - 610, "One giant diff, split into reviewable layers.")
c.setFont("MonoB", 20)
c.drawString(M, H - 670, "THE MANUAL WAY  vs  GITHUB'S NATIVE WAY")
rule(FOOT_RULE_Y, width=1.2)
c.setFont("Mono", 17)
c.drawString(M, TAKE_Y, "8 slides  ·  what changed, and what it costs you")
c.setFont("Mono", 15)
c.drawRightString(W - M, 60, "01 / 08")
c.showPage()

# ---------------- 2 problem ----------------
page_bg()
header("the problem")
title("ONE PR.", H - 250, 126)
title("1,720 LINES.", H - 380, 126)
body([
    "The reviewer holds the data layer, the API,",
    "and the UI in their head at the same time.",
], H - 540)
body(["40 files. One scroll.", "No natural stopping point."], H - 700, size=19, leading=34)
footer(2, takeaway="Review quality drops before review speed does.")
c.showPage()

# ---------------- 3 manual way ----------------
page_bg()
header("the manual way")
title("LAYERED BRANCHES", H - 260, 104)
body([
    "main",
    "  └─ feat/catalog-data     -> PR to main",
    "       └─ feat/search-api  -> PR to catalog-data",
    "            └─ feat/chat   -> PR to search-api",
    "                 └─ feat/ui-> PR to chat",
], H - 470, size=20, leading=52)
body(["Each branch targets the one below it.",
      "Git has no idea they belong together."], H - 800, size=20, leading=36)
footer(3, takeaway="A chain of branches, tracked by hand.")
c.showPage()

# ---------------- 4 restack tax ----------------
page_bg()
header("the restack tax")
title("CHANGE LAYER 1,", H - 250, 112)
title("REDO THE STACK.", H - 365, 112)
body([
    "$ git rebase feat/catalog-data main",
    "$ git push --force-with-lease feat/catalog-data",
    "$ git rebase --onto ... feat/search-api",
    "$ git push --force-with-lease feat/search-api",
    "$ git rebase --onto ... feat/chat",
    "$ git push --force-with-lease feat/chat",
], H - 520, size=18, leading=42)
footer(4, takeaway="4 layers = 4 rebases, 4 force pushes.")
c.showPage()

# ---------------- 5 what github added ----------------
page_bg()
header("native stacked prs  ·  public preview 2026")
title("WHAT GITHUB ADDED", H - 250, 104)
body([
    "—  stack map in the PR header",
    "—  cascading rebase: server-side or gh stack rebase",
    "—  branch protection + CI run against the stack base",
    "—  merge the top PR -> every layer below lands",
    "—  stack object exposed via API and webhooks",
], H - 470, size=19, leading=62)
footer(5, takeaway="The platform now knows the layers are related.")
c.showPage()

# ---------------- 6 merge semantics ----------------
page_bg()
header("merge semantics")
title("MERGING", H - 250, 126)
body([
    "Merge the TOP     -> whole stack lands, bottom-up",
    "Merge MID-STACK   -> layers below land;",
    "                     layers above auto-retarget",
    "Squash / rebase / merge commit: all supported",
    "Merge queue aware: PRs enter in order",
], H - 470, size=19, leading=58)
footer(6, takeaway="One merge event, not four.")
c.showPage()

# ---------------- 7 gotchas ----------------
page_bg()
header("gotchas")
title("THE FINE PRINT", H - 250, 112)
body([
    "×  linear history required — rebase or no merge",
    "×  same repository only (no cross-fork stacks)",
    "×  not supported in GitHub Desktop",
    "×  no auto-merge on stacked PRs (yet)",
    "×  closing a middle PR blocks everything above",
    "×  3–5 layers is the practical ceiling",
], H - 470, size=19, leading=56)
footer(7, takeaway="Powerful, but the discipline is yours to keep.")
c.showPage()

# ---------------- 8 the point ----------------
page_bg()
header("the point")
title("AI MADE WRITING", H - 260, 108)
title("CODE CHEAP.", H - 380, 108)
c.setFont("Serif", 32)
c.drawString(M, H - 560, "Review is the bottleneck now.")
body(["Smaller layers are not a style choice.",
      "They are how review keeps up."], H - 660, size=20, leading=36)
footer(8, note="sources: github.blog changelog 30 jul 2026 · docs.github.com stacked prs")
c.setFont("Mono", 15)
c.drawCentredString(W / 2, 60, "[By AI]")
c.drawRightString(W - M, 60, "08 / 08")
c.showPage()

c.save()
print("wrote", OUT, os.path.getsize(OUT), "bytes")
