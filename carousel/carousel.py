"""carousel.py — spec-driven carousel generator (JSON -> PDF).

One engine, many carousels. Replaces the per-carousel hand-written scripts.
Existing scripts (make_*.py) keep working; this is the preferred path from now on.

Usage:
    python carousel.py specs/milestone.json
    python carousel.py specs/milestone.json --out custom-name.pdf

Spec schema (JSON):
{
  "title":   "PDF metadata title",
  "author":  "PDF metadata author",
  "out":     "optional-filename.pdf",          # default: <spec-name>.pdf
  "pages": [
    {
      "label":       "HEADER LABEL",             # small mono caps line (optional)
      "title":       ["LINE ONE", "LINE TWO"],   # display lines
      "title_size":  104,                        # optional, default 104
      "body":        ["text", "  indented text"],# mono body lines (optional)
      "body_size":   18,                         # optional, default 18
      "leading":     46,                         # optional, default 46
      "takeaway":    "serif closing line",       # optional (renders above footer)
      "note":        "tiny footnote",            # optional (bottom left)
      "ai_mark":     true                        # optional, prints [By AI] bottom centre
    }
  ]
}

Layout contract (keeps every slide balanced, same as the hand-written carousels):
    header  -> label + hairline (top)
    title   -> Big Shoulders, upper third
    body    -> mono block
    footer  -> hairline + serif takeaway, then page number and optional note
"""
import argparse
import json
import os
import sys

from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import black, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = r"C:\Users\Nishant\.agents\skills\canvas-design\canvas-fonts"

W, H = 1080, 1350
M = 96
TAKE_Y = 236
FOOT_RULE_Y = 300

_FONTS_REGISTERED = False


def _register_fonts():
    global _FONTS_REGISTERED
    if _FONTS_REGISTERED:
        return
    pdfmetrics.registerFont(TTFont("Display", os.path.join(FONTS, "BigShoulders-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Mono", os.path.join(FONTS, "JetBrainsMono-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Serif", os.path.join(FONTS, "LibreBaskerville-Regular.ttf")))
    _FONTS_REGISTERED = True


class Carousel:
    def __init__(self, out_path, title="", author=""):
        _register_fonts()
        self.c = rl_canvas.Canvas(out_path, pagesize=(W, H))
        if title:
            self.c.setTitle(title)
        if author:
            self.c.setAuthor(author)
        self.out_path = out_path

    def _bg(self):
        self.c.setFillColor(white)
        self.c.rect(0, 0, W, H, stroke=0, fill=1)
        self.c.setFillColor(black)

    def _rule(self, y, width=2.4):
        self.c.setLineWidth(width)
        self.c.setStrokeColor(black)
        self.c.line(M, y, W - M, y)

    def _header(self, label):
        self.c.setFont("Mono", 17)
        self.c.drawString(M, H - M - 8, label.upper())
        self._rule(H - M - 34)

    def _title(self, lines, y, size):
        self.c.setFont("Display", size)
        for ln in lines:
            self.c.drawString(M, y, ln)
            y -= int(size * 1.05)

    def _body(self, lines, y0, size, leading):
        self.c.setFont("Mono", size)
        y = y0
        for ln in lines:
            self.c.drawString(M, y, ln)
            y -= leading

    def _footer(self, page_no, total, takeaway=None, note=None, ai_mark=False):
        if takeaway:
            self._rule(FOOT_RULE_Y, width=1.2)
            self.c.setFont("Serif", 26)
            self.c.drawString(M, TAKE_Y, takeaway)
        if note:
            self.c.setFont("Mono", 13)
            self.c.drawString(M, 60, note)
        if ai_mark:
            self.c.setFont("Mono", 15)
            self.c.drawCentredString(W / 2, 60, "[By AI]")
        self.c.setFont("Mono", 15)
        self.c.drawRightString(W - M, 60, "%02d / %02d" % (page_no, total))

    def add_page(self, page, page_no, total):
        self._bg()
        if page.get("label"):
            self._header(page["label"])
        size = int(page.get("title_size", 104))
        tlines = page.get("title") or []
        if tlines:
            self._title(tlines, int(page.get("title_y", H - 250)), size)
        body = page.get("body") or []
        if body:
            self._body(body, int(page.get("body_y", H - 470)), int(page.get("body_size", 18)),
                       int(page.get("leading", 46)))
        self._footer(page_no, total, page.get("takeaway"), page.get("note"), bool(page.get("ai_mark")))
        self.c.showPage()

    def save(self):
        self.c.save()
        return self.out_path


def build(spec_path):
    spec = json.load(open(spec_path, encoding="utf-8"))
    base = os.path.splitext(os.path.basename(spec_path))[0]
    out = spec.get("out") or (base + ".pdf")
    if not os.path.isabs(out):
        out = os.path.join(HERE, out)
    pages = spec.get("pages") or []
    if not pages:
        sys.exit("spec has no pages: " + spec_path)
    car = Carousel(out, spec.get("title", ""), spec.get("author", "Nishant Verma"))
    for i, p in enumerate(pages, 1):
        car.add_page(p, i, len(pages))
    car.save()
    print("wrote", out, os.path.getsize(out), "bytes", "|", len(pages), "pages")
    return out


def main():
    ap = argparse.ArgumentParser(description="Build a carousel PDF from a JSON spec.")
    ap.add_argument("spec", help="path to the JSON spec")
    ap.add_argument("--out", help="override output filename")
    args = ap.parse_args()
    if args.out:
        spec = json.load(open(args.spec, encoding="utf-8"))
        spec["out"] = args.out
        tmp = args.spec + ".tmp"
        json.dump(spec, open(tmp, "w", encoding="utf-8"))
        build(tmp)
        os.remove(tmp)
    else:
        build(args.spec)


if __name__ == "__main__":
    main()
