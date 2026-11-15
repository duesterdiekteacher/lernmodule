#!/usr/bin/env python3
"""Baut die Prüfungssimulationen Abschlussprüfung Teil 2 (Metall).

Aufruf: python3 _werkzeuge/pruefung/build.py
Jede Prüfung = template.html + style.css + lib.js + Projektdaten + Prüfungsdaten + app.js
"""
from pathlib import Path

HIER = Path(__file__).resolve().parent
ROOT = HIER.parent.parent
ZIEL = ROOT / "abschlusspruefung-teil2-metall"

# Ausgabedatei: (Projektdatei oder None, Prüfungsdatei)
PRUEFUNGEN = {
    "afa-industriemechaniker.html": ("projekt-im.js", "afa-im.js"),
    "ft-industriemechaniker.html": ("projekt-im.js", "ft-im.js"),
    "afa-werkzeugmechaniker.html": ("projekt-wm.js", "afa-wm.js"),
    "ft-werkzeugmechaniker.html": ("projekt-wm.js", "ft-wm.js"),
    "wiso.html": (None, "wiso.js"),
}


def lies(p):
    return (HIER / p).read_text(encoding="utf-8")


def main():
    ZIEL.mkdir(exist_ok=True)
    tpl, style, lib, app = lies("template.html"), lies("style.css"), lies("lib.js"), lies("app.js")
    for datei, (projekt, pruefung) in PRUEFUNGEN.items():
        if not (HIER / "daten" / pruefung).exists():
            print("fehlt noch:", pruefung)
            continue
        daten = (lies("daten/" + projekt) + "\n" if projekt else "") + lies("daten/" + pruefung)
        html = (tpl.replace("{{STYLE}}", style).replace("{{LIB}}", lib)
                .replace("{{DATA}}", daten).replace("{{APP}}", app).replace("{{TITLE}}", "Prüfungssimulation"))
        (ZIEL / datei).write_text(html, encoding="utf-8")
        print("geschrieben:", ZIEL / datei)
    ueb = lies("uebersicht.html").replace("{{STYLE}}", style).replace("{{LIB}}", lib)
    (ZIEL / "index.html").write_text(ueb, encoding="utf-8")
    print("geschrieben:", ZIEL / "index.html")


if __name__ == "__main__":
    main()
