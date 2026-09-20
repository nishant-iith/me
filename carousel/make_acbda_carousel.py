"""Carousel: ACBDA vs MVC - teaching-first, no company names.

Run:  python make_acbda_carousel.py
Out:  acbda.pdf  (1080x1350, 10 slides, minimal black/white)
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
pdfmetrics.registerFont(TTFont("Serif", os.path.join(FONTS, "LibreBaskerville-Regular.ttf")))

W, H = 1080, 1350
M = 96
TAKE_Y = 236
FOOT_RULE_Y = 300
N = 10
OUT = os.path.join(HERE, "acbda.pdf")

c = rl_canvas.Canvas(OUT, pagesize=(W, H))
c.setTitle("ACBDA vs MVC")
c.setAuthor("Nishant Verma")


def page_bg():
    c.setFillColor(white)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(black)


def rule(y, width=2.4):
    c.setLineWidth(width)
    c.setStrokeColor(black)
    c.line(M, y, W - M, y)


def header(label):
    c.setFont("Mono", 17)
    c.drawString(M, H - M - 8, label.upper())
    rule(H - M - 34)


def title(text, y, size=104):
    c.setFont("BigShoulders", size)
    c.drawString(M, y, text)


def body(lines, y0, size=18, leading=46):
    c.setFont("Mono", size)
    y = y0
    for ln in lines:
        c.drawString(M, y, ln)
        y -= leading
    return y


def footer(n, takeaway=None, note=None):
    if takeaway:
        rule(FOOT_RULE_Y, width=1.2)
        c.setFont("Serif", 26)
        c.drawString(M, TAKE_Y, takeaway)
    if note:
        c.setFont("Mono", 13)
        c.drawString(M, 60, note)


def pagenum(n):
    c.setFont("Mono", 15)
    c.drawRightString(W - M, 60, "%02d / %d" % (n, N))


# 1 cover
page_bg()
header("software architecture")
title("ACBDA", H - 300, 168)
title("vs MVC", H - 450, 168)
c.setFont("Serif", 26)
c.drawString(M, H - 610, "Two patterns. Two different layers.")
rule(FOOT_RULE_Y, width=1.2)
c.setFont("Mono", 17)
c.drawString(M, TAKE_Y, "10 slides  ·  what each one solves, and when to use it")
pagenum(1)
c.showPage()

# 2 the problem
page_bg()
header("the problem both patterns try to solve")
title("THE TANGLED METHOD", H - 250, 96)
body([
    "One function that:",
    "  validates the request",
    "  runs a SQL query",
    "  calls another service over HTTP",
    "  applies business rules",
    "  formats the JSON response",
], H - 450, size=18, leading=48)
body(["Change the database schema and this method breaks.",
      "You cannot test it without both a database and a network."], H - 760, size=17, leading=30)
footer(2, takeaway="Tangled concerns are the real enemy.")
pagenum(2)
c.showPage()

# 3 what ACBDA is
page_bg()
header("pattern 1  ·  backend service layer")
title("ACBDA", H - 250, 130)
c.setFont("Mono", 18)
c.drawString(M, H - 330, "Five roles, one responsibility each.")
body([
    "A  Activity   - owns the use case, orchestrates the work",
    "C  Component  - business rules and calculations",
    "B  Builder    - assembles the final response object",
    "D  DAO        - all database access for one entity",
    "A  Accessor   - all calls to external services",
], H - 430, size=19, leading=60)
footer(3, takeaway="Each box has exactly one reason to change.")
pagenum(3)
c.showPage()

# 4 worked example
page_bg()
header("worked example")
title("GET /users/42/orders", H - 250, 84)
body([
    "Activity   -> handle this endpoint end to end",
    "Accessor   -> fetch the user from the auth service",
    "DAO        -> read orders for user 42 from the DB",
    "Component  -> apply discount + tax rules",
    "Builder    -> shape the response DTO",
], H - 440, size=18, leading=58)
footer(4, takeaway="Read it as: who does what, in order.")
pagenum(4)
c.showPage()

# 5 flow
page_bg()
header("the request path")
title("FLOW", H - 250, 130)
body([
    "Request",
    "   -> Activity        own the use case",
    "        -> Accessor    fetch external data",
    "        -> DAO         read / write",
    "        -> Component   apply rules",
    "   -> Builder         assemble response",
    "Response",
], H - 450, size=19, leading=52)
footer(5, takeaway="Wiring is one direction, always.")
pagenum(5)
c.showPage()

# 6 why it helps
page_bg()
header("why the split pays off")
title("PROS", H - 250, 130)
body([
    "+  test each role alone - mock the DAO, no DB needed",
    "+  swap the database by rewriting one class",
    "+  one place holds all SQL for an entity",
    "+  rules live in Components, not controllers",
    "+  teams can work on layers in parallel",
], H - 450, size=18, leading=58)
footer(6, takeaway="Testability is the real prize.")
pagenum(6)
c.showPage()

# 7 the cost
page_bg()
header("the cost of the split")
title("CONS", H - 250, 130)
body([
    "-  five files where one method would do",
    "-  indirection: a request touches five classes",
    "-  overkill for a simple CRUD endpoint",
    "-  needs discipline or the layers blur",
    "-  more navigation when debugging",
], H - 450, size=18, leading=58)
footer(7, takeaway="Structure is a cost you pay on purpose.")
pagenum(7)
c.showPage()

# 8 MVC
page_bg()
header("pattern 2  ·  presentation tier")
title("MVC", H - 250, 130)
body([
    "Model ...... domain state and rules",
    "View ....... renders it on screen",
    "Controller . translates input, mediates",
    "",
    "Wiring: the View depends on the Model.",
    "The Model never depends on the View.",
], H - 450, size=18, leading=54)
body(["It is a UI pattern - not a whole-app architecture."], H - 750, size=17, leading=28)
footer(8, takeaway="Same idea, smaller scope: separate look from data.")
pagenum(8)
c.showPage()

# 9 comparison
page_bg()
header("side by side")
title("THE DIFFERENCE", H - 250, 104)
body([
    "scope     backend service   |  presentation tier",
    "roles     5                 |  3",
    "owns      use case          |  one screen",
    "wiring    request path      |  view -> model",
    "fixes     tangled backend   |  tangled UI",
    "breaks    too much ceremony |  massive controller",
], H - 440, size=17, leading=54)
footer(9, takeaway="Different problems - not competitors.")
pagenum(9)
c.showPage()

# 10 verdict
page_bg()
header("the verdict")
title("PICK THE LAYER", H - 260, 104)
title("THEN THE PATTERN", H - 370, 104)
body([
    "Building a UI?        MVC or MVVM",
    "Building a service?   ACBDA, hexagonal, clean",
    "Real products do both - at the same time.",
    "",
    "The shared rule: one reason to change per unit,",
    "and dependencies that point one way.",
], H - 540, size=18, leading=44)
footer(10, takeaway="Match the pattern to the layer, not the trend.")
c.setFont("Mono", 15)
c.drawCentredString(W / 2, 60, "[By AI]")
pagenum(10)
c.showPage()

c.save()
print("wrote", OUT, os.path.getsize(OUT), "bytes")
