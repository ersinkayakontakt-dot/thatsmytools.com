from pathlib import Path
from shutil import copyfile

from reportlab.graphics.shapes import Drawing, Rect
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "wohnungsaufloesung-checkliste.pdf"
PUBLIC = ROOT / "public" / "downloads" / "wohnungsaufloesung-checkliste.pdf"

INK = colors.HexColor("#111111")
ORANGE = colors.HexColor("#D24507")
PAPER = colors.HexColor("#F2F3F3")
MID = colors.HexColor("#D2D4D5")
MUTED = colors.HexColor("#555B5E")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="Brand",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=ORANGE,
        spaceAfter=3 * mm,
        uppercase=True,
    )
)
styles.add(
    ParagraphStyle(
        name="ChecklistTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=25,
        leading=27,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=4 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="ChecklistIntro",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=MUTED,
        spaceAfter=5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=INK,
        borderWidth=0,
        spaceBefore=4 * mm,
        spaceAfter=3 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="Task",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.2,
        leading=12,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="Note",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=INK,
        backColor=PAPER,
        borderColor=ORANGE,
        borderWidth=0,
        borderPadding=7,
        leftIndent=0,
        spaceBefore=3 * mm,
        spaceAfter=4 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="FieldLabel",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="Footer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
)


def checkbox():
    drawing = Drawing(5 * mm, 5 * mm)
    drawing.add(Rect(0.8 * mm, 0.8 * mm, 3.6 * mm, 3.6 * mm, strokeColor=INK, fillColor=None, strokeWidth=1))
    return drawing


def task_table(items):
    rows = [[checkbox(), Paragraph(item, styles["Task"]), ""] for item in items]
    table = Table(rows, colWidths=[7 * mm, 128 * mm, 35 * mm], repeatRows=0)
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LINEBELOW", (0, 0), (-1, -1), 0.45, MID),
                ("TOPPADDING", (0, 0), (-1, -1), 2.4 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.4 * mm),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 1.5 * mm),
                ("TEXTCOLOR", (2, 0), (2, -1), MUTED),
            ]
        )
    )
    return table


def fields_table(labels):
    rows = []
    for left, right in labels:
        rows.append(
            [
                Paragraph(left, styles["FieldLabel"]),
                Paragraph("________________________________________________", styles["Small"]),
                Paragraph(right, styles["FieldLabel"]),
                Paragraph("________________________", styles["Small"]),
            ]
        )
    table = Table(rows, colWidths=[28 * mm, 58 * mm, 30 * mm, 54 * mm])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
            ]
        )
    )
    return table


def section(title, items, note=None):
    parts = [Paragraph(title, styles["Section"]), task_table(items)]
    if note:
        parts.append(Paragraph(note, styles["Note"]))
    return KeepTogether(parts)


def page_frame(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(INK)
    canvas.rect(0, height - 9 * mm, width, 9 * mm, stroke=0, fill=1)
    canvas.setFillColor(ORANGE)
    canvas.rect(0, height - 9 * mm, 38 * mm, 9 * mm, stroke=0, fill=1)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(colors.white)
    canvas.drawString(14 * mm, height - 6 * mm, "SCHNELLHELFER24")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(width / 2, 9 * mm, f"www.schnellhelfer24.de  |  Seite {doc.page}")
    canvas.restoreState()


story = [
    Spacer(1, 5 * mm),
    Paragraph("ARBEITSBLATT · STAND 30.07.2026", styles["Brand"]),
    Paragraph("Wohnungsauflösung<br/>klar planen", styles["ChecklistTitle"]),
    Paragraph(
        "Diese Checkliste ordnet Termine, Unterlagen, Sortierung, Räumung und Übergabe. "
        "Sie ersetzt keine Rechtsberatung und enthält bewusst keine erfundenen Pauschalpreise.",
        styles["ChecklistIntro"],
    ),
    fields_table(
        [
            ("Objekt / Adresse", ""),
            ("Übergabetermin", "Verantwortlich"),
            ("Vermieter / Kontakt", "Telefon"),
        ]
    ),
    Spacer(1, 3 * mm),
    section(
        "1. Auftrag, Rechte und Termine klären",
        [
            "Mietende und spätesten Übergabetermin schriftlich festhalten.",
            "Klären, wer beauftragen und über Gegenstände entscheiden darf.",
            "Bei einer Erbengemeinschaft Freigaben der Beteiligten dokumentieren.",
            "Wohnungs-, Keller-, Dachboden-, Briefkasten- und Garagenschlüssel sammeln.",
            "Zugangszeiten, Hausordnung und mögliche Aufzugsreservierung klären.",
            "Zwischen Räumung und Übergabe mindestens einen Puffertag einplanen.",
        ],
        "Bei einem Todesfall nichts endgültig verwerten oder entsorgen, solange Erb- und "
        "Verfügungsberechtigung nicht geklärt sind.",
    ),
    section(
        "2. Unterlagen und Persönliches sichern",
        [
            "Ausweise, Urkunden, Testamente und Vollmachten sichern.",
            "Mietvertrag, Übergabeprotokolle und Betriebskostenunterlagen sichern.",
            "Bank-, Versicherungs-, Renten- und Steuerunterlagen sammeln.",
            "Medikamente, Hilfsmittel und sensible Gesundheitsunterlagen herausnehmen.",
            "Schmuck, Sammlungen, Fotos, Briefe und Erinnerungsstücke kennzeichnen.",
            "Computer, Telefone, Datenträger und Zugangsdaten separat verwahren.",
            "Eine Prüfkiste für unklare Gegenstände anlegen - nicht mehrere Stapel.",
        ],
    ),
    PageBreak(),
    Spacer(1, 4 * mm),
    Paragraph("SORTIERUNG UND ANGEBOTE", styles["Brand"]),
    Paragraph("Entscheiden, bevor getragen wird", styles["ChecklistTitle"]),
    section(
        "3. Bestand in vier Kategorien sortieren",
        [
            "BEHALTEN: persönlich beschriften und aus dem Arbeitsbereich entfernen.",
            "VERKAUFEN / VERSCHENKEN: Zustand, Maße und Abholfrist notieren.",
            "SPENDEN: Annahmebedingungen und Transport vorher klären.",
            "ENTSORGEN: Materialarten trennen und Sonderstoffe kennzeichnen.",
            "Alle Schränke, Schubladen, Taschen und Ordner vollständig prüfen.",
            "Keller, Dachboden, Balkon, Garage und Nebenräume nicht vergessen.",
            "Entscheidungen mit Fotos dokumentieren, wenn mehrere Personen beteiligt sind.",
        ],
    ),
    section(
        "4. Vergleichbare Angebote vorbereiten",
        [
            "Raumliste inklusive Nebenflächen erstellen.",
            "Je Raum ein Übersichtsfoto und Fotos geöffneter Schränke aufnehmen.",
            "Etage, Aufzug, Treppenhaus und Trageweg bis zum Fahrzeug dokumentieren.",
            "Große Möbel, Elektrogeräte, Matratzen und Sondermaterial einzeln nennen.",
            "Demontage, Bodenbeläge, Reinigung und Übergabe als Zusatzarbeiten benennen.",
            "Allen Betrieben dieselben Angaben und Fotos schicken.",
            "Schriftlich prüfen, was enthalten ist und wann Zusatzkosten entstehen können.",
        ],
        "Ein niedriger Endbetrag ist nur vergleichbar, wenn Leistungsumfang, Menge und "
        "Zugang identisch beschrieben wurden.",
    ),
    section(
        "5. Verträge und laufende Versorgung",
        [
            "Strom, Gas, Wasser und weitere Versorger über den Auszug informieren.",
            "Telefon, Internet, Rundfunkbeitrag und Abonnements prüfen.",
            "Hausratversicherung und weitere wohnungsbezogene Verträge anpassen.",
            "Nachsendeauftrag und neue Kontaktadresse einrichten.",
            "Zählernummern und letzte Abrechnungen bereithalten.",
        ],
    ),
    PageBreak(),
    Spacer(1, 4 * mm),
    Paragraph("RÄUMUNG UND ÜBERGABE", styles["Brand"]),
    Paragraph("Der letzte Kontrollgang", styles["ChecklistTitle"]),
    section(
        "6. Vor und während der Räumung",
        [
            "Arbeitsumfang und Flächen vor Beginn gemeinsam abgleichen.",
            "Gegenstände, die bleiben, sichtbar markieren und schützen.",
            "Zufahrt und Halteposition für das Fahrzeug freihalten.",
            "Empfindliche Bereiche im Treppenhaus vor Schäden schützen.",
            "Sondermaterial nicht mit gewöhnlichem Sperrmüll vermischen.",
            "Nach Abschluss alle Räume und Nebenflächen gemeinsam kontrollieren.",
            "Vereinbarte Fotodokumentation und Entsorgungsnachweise sichern.",
        ],
    ),
    section(
        "7. Wohnungsübergabe vorbereiten",
        [
            "Wohnung, Keller, Dachboden, Balkon und Garage vollständig kontrollieren.",
            "Fenster, Türen, Einbauten und erkennbare Schäden fotografieren.",
            "Strom-, Gas-, Wasser- und Heizungszähler ablesen und fotografieren.",
            "Anzahl und Art aller Schlüssel notieren.",
            "Offene Arbeiten konkret mit Zuständigkeit und Termin ins Protokoll aufnehmen.",
            "Übergabeprotokoll vollständig lesen und erst danach unterschreiben.",
            "Eine unterschriebene Kopie des Protokolls mitnehmen.",
        ],
        "Keine pauschalen Zusatzpflichten unterschreiben, die nicht geprüft wurden. "
        "Bei Unsicherheit unabhängige Mietrechtsberatung nutzen.",
    ),
    section(
        "8. Nach der Übergabe",
        [
            "Schlüsselquittung und Übergabeprotokoll sicher ablegen.",
            "Zählerstände an die Versorger übermitteln.",
            "Neue Kontaktadresse für Betriebskosten und Kaution mitteilen.",
            "Rechnungen, Freigaben, Fotos und Entsorgungsbelege zusammen ablegen.",
            "Offene Erstattungen oder Kautionsabrechnung im Kalender nachhalten.",
        ],
    ),
    PageBreak(),
    Spacer(1, 4 * mm),
    Paragraph("ÜBERGABEBLATT", styles["Brand"]),
    Paragraph("Zähler, Schlüssel und Notizen", styles["ChecklistTitle"]),
    Paragraph("Zählerstände", styles["Section"]),
]

meter_rows = [
    ["Zähler", "Nummer", "Stand", "Foto"],
    ["Strom", "", "", ""],
    ["Gas", "", "", ""],
    ["Wasser kalt", "", "", ""],
    ["Wasser warm", "", "", ""],
    ["Heizung", "", "", ""],
]
meter_table = Table(meter_rows, colWidths=[38 * mm, 58 * mm, 48 * mm, 26 * mm], rowHeights=[9 * mm] + [12 * mm] * 5)
meter_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), INK),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
            ("FONTNAME", (1, 1), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 8.5),
            ("GRID", (0, 0), (-1, -1), 0.7, MID),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 2 * mm),
        ]
    )
)
story.extend(
    [
        meter_table,
        Paragraph("Schlüssel", styles["Section"]),
        task_table(
            [
                "Wohnungstür: Anzahl ______",
                "Haustür: Anzahl ______",
                "Briefkasten: Anzahl ______",
                "Keller / Dachboden: Anzahl ______",
                "Garage / Stellplatz / Sonstige: ________________________________",
            ]
        ),
        Paragraph("Offene Punkte und Vereinbarungen", styles["Section"]),
    ]
)

notes = Table([[""] for _ in range(3)], colWidths=[170 * mm], rowHeights=[8 * mm] * 3)
notes.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.5, MID)]))
story.extend(
    [
        notes,
        Spacer(1, 3 * mm),
        fields_table(
            [
                ("Übergabe am", "Uhrzeit"),
                ("Übergeben durch", "Übernommen von"),
                ("Unterschrift", "Unterschrift"),
            ]
        ),
        Paragraph(
            "Weitere Erläuterungen und die jeweils aktuelle Fassung: "
            "schnellhelfer24.de/ratgeber/wohnungsaufloesung-checkliste-pdf/",
            styles["Small"],
        ),
    ]
)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
PUBLIC.parent.mkdir(parents=True, exist_ok=True)

document = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=20 * mm,
    leftMargin=20 * mm,
    topMargin=18 * mm,
    bottomMargin=17 * mm,
    title="Wohnungsauflösung Checkliste",
    author="Schnellhelfer24",
    subject="Druckbare Checkliste für Wohnungsauflösung und Wohnungsübergabe",
)
document.build(story, onFirstPage=page_frame, onLaterPages=page_frame)
copyfile(OUTPUT, PUBLIC)

print(f"Created {OUTPUT}")
print(f"Copied to {PUBLIC}")
