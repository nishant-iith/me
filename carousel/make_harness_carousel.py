"""Carousel: "The Harness" - Claude Code vs Codex vs DeepSeek Harness.

Run:  python make_harness_carousel.py
Out:  harness.pdf  (1080x1350, 8 slides, minimal black/white)
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
TAKE_Y = 236
FOOT_RULE_Y = 300
OUT = os.path.join(HERE, "harness.pdf")

c = rl_canvas.Canvas(OUT, pagesize=(W, H))
c.setTitle("The Harness")
c.setAuthor("Nishant Verma")


def page_bg():
    c.setFillColor(white)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(black)


def rule(y, x1=M, x2=W - M, width=2.4):
    c.setLineWidth(width)
    c.setStrokeColor(black)
    c.line(x1, y, x2, y)


def header(label):
    c.setFont("Mono", 17)
    c.drawString(M, H - M - 8, label.upper())
    rule(H - M - 34)


def title(text, y, size=104):
    c.setFont("BigShoulders", size)
    c.drawString(M, y, text)


def body(lines, y0, size=20, leading=46):
    c.setFont("Mono", size)
    y = y0
    for ln in lines:
        c.drawString(M, y, ln)
        y -= leading
    return y


def footer(n, takeaway=None, note=None):
    if takeaway:
        rule(FOOT_RULE_Y, width=1.2)
        c.setFont("Serif", 27)
        c.drawString(M, TAKE_Y, takeaway)
    if note:
        c.setFont("Mono", 14)
        c.drawString(M, 60, note)
    c.setFont("Mono", 15)
    c.drawRightString(W - M, 60, "%02d / 08" % n)


# 1 cover
page_bg()
header("coding agents  ·  2026")
title("THE", H - 300, 168)
title("HARNESS", H - 450, 168)
c.setFont("Serif", 27)
c.drawString(M, H - 610, "Same model. Very different results.")
c.setFont("MonoB", 19)
c.drawString(M, H - 668, "CLAUDE CODE  ·  CODEX  ·  DEEPSEEK HARNESS")
rule(FOOT_RULE_Y, width=1.2)
c.setFont("Mono", 17)
c.drawString(M, TAKE_Y, "8 slides  ·  what actually decides agent performance")
c.setFont("Mono", 15)
c.drawRightString(W - M, 60, "01 / 08")
c.showPage()

# 2 premise
page_bg()
header("the premise")
title("THE MODEL IS", H - 250, 122)
title("NOT THE AGENT.", H - 370, 122)
body([
    "The harness decides what the model sees,",
    "which tools it can call, how state persists,",
    "when it retries, and when it stops.",
], H - 520)
body(["Same model, four harnesses.", "Different scores. Different cost."], H - 720, size=19, leading=36)
footer(2, takeaway="The wrapper shapes the inference, not just the output.")
c.showPage()

# 3 benchmark
page_bg()
header("the benchmark  ·  composio, 30 agentic tasks, one model")
title("ONE MODEL,", H - 250, 118)
title("THREE SCORES", H - 360, 118)
body([
    "DeepSeek V4 Pro through each harness:",
    "   Pi ................ 21 / 30",
    "   DeepSeek Harness .. 20 / 30",
    "   Claude Code ....... 19 / 30",
], H - 500, size=19, leading=48)
body(["Tokens per task:  88k  |  650k  |  925k"], H - 760, size=19)
footer(3, takeaway="Success rate and token cost move in opposite directions.")
c.showPage()

# 4 claude code
page_bg()
header("claude code  ·  anthropic")
title("AGENT-CENTRIC", H - 250, 110)
body([
    "—  26 lifecycle hooks: inject logic at every step",
    "—  CLAUDE.md, skills, subagents, MCP, plugins",
    "—  1M-token context; fastest median time in test",
    "—  broadest ecosystem of the three",
    "—  closed source; optimised for Claude models",
], H - 470, size=19, leading=58)
footer(4, takeaway="Make one agent stronger. Product, not toolbox.")
c.showPage()

# 5 codex
page_bg()
header("codex  ·  openai")
title("EXECUTION-CENTRIC", H - 250, 106)
body([
    "—  kernel-level sandbox: Seatbelt, Landlock",
    "—  boundaries the model cannot talk its way past",
    "—  AGENTS.md spec; 272K context, to 1.05M",
    "—  Codex Cloud: up to 6 parallel threads",
    "—  safety leader for untrusted code",
], H - 470, size=19, leading=58)
footer(5, takeaway="Run real systems without losing control of them.")
c.showPage()

# 6 deepseek harness
page_bg()
header("deepseek harness  ·  mit, aug 2026")
title("RUNTIME-CENTRIC", H - 250, 108)
body([
    "—  Cordis microkernel: everything is a plugin",
    "—  models, tools, sessions, sandboxes, loop, UI",
    "—  40+ model providers, model-agnostic by design",
    "—  trajectory view: every action traced to its plugin",
    "—  can call Claude Code / Codex as sub-agents",
    "—  v0.1 preview: breaking changes expected",
], H - 460, size=18, leading=52)
footer(6, takeaway="A frame you build on, not a product you adopt.")
c.showPage()

# 7 costs
page_bg()
header("what nobody mentions")
title("THE TOKEN TAX", H - 250, 112)
body([
    "Framework overhead, input tokens per task:",
    "   OpenCode .......... ~12k",
    "   Codex CLI ......... ~18k",
    "   Claude Code ....... ~22k",
    "   DeepSeek Harness .. ~95k",
], H - 480, size=19, leading=50)
body(["Confirmed bug: duplicate CLAUDE.md + AGENTS.md", "injection adds 30k+ tokens on its own."], H - 770, size=17, leading=32)
footer(7, takeaway="Flexibility is paid for in context, every turn.")
c.showPage()

# 8 the point
page_bg()
header("the point")
title("WHO OWNS THE", H - 260, 112)
title("DECISIONS?", H - 375, 112)
c.setFont("Serif", 30)
c.drawString(M, H - 540, "Model. Runtime. Policy. Human.")
body([
    "That split is the real difference.",
    "Run your own 10-20 task benchmark before you commit.",
], H - 620, size=19, leading=34)
footer(8, note="sources: composio benchmark · 4sapi · atoms.dev · arceapps · bswen · mindstudio")
c.setFont("Mono", 15)
c.drawCentredString(W / 2, 60, "[By AI]")
c.drawRightString(W - M, 60, "08 / 08")
c.showPage()

c.save()
print("wrote", OUT, os.path.getsize(OUT), "bytes")
