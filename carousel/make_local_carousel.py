"""Carousel: "Local LLMs vs the $20 subscription" - the ROI math.

Run:  python make_local_carousel.py
Out:  local-llm.pdf  (1080x1350, 8 slides, minimal black/white)
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
OUT = os.path.join(HERE, "local-llm.pdf")

c = rl_canvas.Canvas(OUT, pagesize=(W, H))
c.setTitle("Local LLMs vs the 20 dollar subscription")
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


# 1
page_bg()
header("inference economics  ·  2026")
title("LOCAL", H - 300, 168)
title("vs $20/MO", H - 450, 168)
c.setFont("Serif", 27)
c.drawString(M, H - 610, "The math nobody runs before buying a GPU.")
rule(FOOT_RULE_Y, width=1.2)
c.setFont("Mono", 17)
c.drawString(M, TAKE_Y, "8 slides  ·  cost, speed, context, and where local actually wins")
c.setFont("Mono", 15)
c.drawRightString(W - M, 60, "01 / 08")
c.showPage()

# 2 the subsidy
page_bg()
header("the part everyone misses")
title("YOUR $20 PLAN IS", H - 250, 104)
title("SUBSIDISED.", H - 365, 104)
body([
    "SemiAnalysis estimate: a hard-used $20 ChatGPT Plus",
    "plan extracts about $700 of API-equivalent compute.",
    "A maxed $200 Pro plan: up to $14,000.",
], H - 520)
body(["One tracked user burned 10B tokens in 8 months:",
      "$15,000 at API rates. About $800 on subscriptions."], H - 720, size=18, leading=34)
footer(2, takeaway="You are not paying for the compute. They are.")
c.showPage()

# 3 light volume
page_bg()
header("effective cost  ·  500k tokens/day")
title("LOCAL LOSES BY 5x", H - 250, 112)
body([
    "Effective $ per million tokens, 12-month total:",
    "   open-weight API ..... $1.97",
    "   OpenAI API .......... $6.90",
    "   Anthropic API ....... $9.86",
    "   local, consumer ..... $35.37",
], H - 470, size=19, leading=52)
footer(3, takeaway="A casual user never pays the card back.")
c.showPage()

# 4 medium volume
page_bg()
header("effective cost  ·  5M tokens/day")
title("BREAK-EVEN IS", H - 250, 112)
title("~36 MONTHS", H - 365, 112)
body([
    "12-month totals:  OpenAI $12,600  |  local $18,387",
    "36-month totals:  OpenAI $37,800  |  local $32,870",
    "Hardware amortisation is the whole story -",
    "electricity is the small line.",
], H - 520, size=19, leading=52)
footer(4, takeaway="Year one goes to the API. Year three goes to you.")
c.showPage()

# 5 where local wins
page_bg()
header("where local actually wins")
title("ALWAYS-ON AGENTS", H - 250, 110)
body([
    "Past ~500M tokens/month the math flips:",
    "   local ......... $1.04 - $2.67 per M tokens",
    "   API .......... $2,000+ per month",
    "   payback ...... 6 to 12 months",
], H - 470, size=19, leading=52)
body(["Also wins on: privacy, no rate caps, offline,", "and zero vendor lock-in."], H - 700, size=18, leading=34)
footer(5, takeaway="Steady, high volume - or nothing at all.")
c.showPage()

# 6 speed + context
page_bg()
header("speed and context")
title("THE NUMBERS", H - 250, 118)
body([
    "first token:  local 50-200ms  |  cloud 200-800ms",
    "M5 Max 128GB: ~65 tok/s on 120B-class MoE",
    "RTX 5060 Ti 16GB: 20-40 tok/s on 24B",
    "context:  Claude Pro 200K  |  Llama 3.3 128K",
    "Plus caps:  160 messages per 3 hours",
], H - 470, size=18, leading=52)
footer(6, takeaway="Local wins latency. Cloud wins the ceiling.")
c.showPage()

# 7 quality
page_bg()
header("quality reality")
title("CLOSE IS NOT EQUAL", H - 250, 108)
body([
    "MMLU:  Llama 3.3 70B 80%  vs  GPT-5.2 87%",
    "Code:  Qwen3-Coder 32B 92.7% HumanEval - parity",
    "Agentic tasks over hours: local sub-30B collapses",
    "to 31-38% where the frontier holds ~90%.",
], H - 470, size=19, leading=52)
body(["Error compounds per step, so long loops punish", "the smaller model."], H - 700, size=18, leading=34)
footer(7, takeaway="Great at bounded work. Weak at long horizons.")
c.showPage()

# 8 verdict
page_bg()
header("the verdict")
title("PICK BY VOLUME,", H - 260, 108)
title("NOT BY PRICE.", H - 375, 108)
body([
    "Casual user .......... keep the $20 subscription",
    "Heavy interactive .... hybrid: local loops, cloud for hard",
    "Always-on agents ..... buy the hardware",
], H - 530, size=19, leading=54)
footer(8, note="sources: sitepoint TCO 2026 · flaviocopes · promptquorum · livingmethod · notacalculator")
c.setFont("Mono", 15)
c.drawCentredString(W / 2, 60, "[By AI]")
c.drawRightString(W - M, 60, "08 / 08")
c.showPage()

c.save()
print("wrote", OUT, os.path.getsize(OUT), "bytes")
