import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Info, Sparkles, ArrowRight, Download } from "lucide-react";
import jsPDF from "jspdf";

const REDUCTION = 0.35;
const WORKING_DAYS = 250;

const fmtEUR = (n: number, prefix: string = "") => {
  const formatted = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  return `${prefix}${formatted}`;
};

const fmtPerDay = (hoursPerYear: number) => {
  const totalMin = Math.round((hoursPerYear / WORKING_DAYS) * 60);
  if (totalMin >= 60) {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `≈ ${h} Std ${m} Min pro Tag`;
  }
  return `≈ ${totalMin} Min pro Tag`;
};

const SRC_720H = "https://steeringpoint.ie/worklife/how-does-smartphone-use-impact-the-workplace/";
const SRC_LOSS = "https://www.prnewswire.com/news-releases/screen-educations-smartphone-distraction--workplace-safety-survey-finds-us-employees-distracted-2-5-hours-each-workday-by-digital-content-unrelated-to-their-jobs-301120969.html";

export default function RoiCalculator() {
  const [employees, setEmployees] = useState(25);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [hoursPerYear, setHoursPerYear] = useState(720);

  const { wastedHours, lossPerYear, savingsPerYear, savingsPerMonth, teamfocusCostPerYear, netSavings } = useMemo(() => {
    const wasted = employees * hoursPerYear;
    const loss = wasted * hourlyCost;
    const savings = loss * REDUCTION;
    const tfCost = employees * 2.99 * 12;
    return { wastedHours: wasted, lossPerYear: loss, savingsPerYear: savings, savingsPerMonth: savings / 12, teamfocusCostPerYear: tfCost, netSavings: savings - tfCost };
  }, [employees, hourlyCost, hoursPerYear]);

  const exportPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const NAVY: [number, number, number] = [15, 23, 42];
    const BLUE: [number, number, number] = [59, 130, 246];
    const BLUE_DARK: [number, number, number] = [30, 64, 175];
    const BLUE_SOFT: [number, number, number] = [219, 234, 254];
    const RED: [number, number, number] = [220, 38, 38];
    const RED_SOFT: [number, number, number] = [254, 226, 226];
    const GREEN: [number, number, number] = [22, 163, 74];
    const GREEN_SOFT: [number, number, number] = [220, 252, 231];
    const SLATE: [number, number, number] = [100, 116, 139];
    const SLATE_SOFT: [number, number, number] = [241, 245, 249];
    const WHITE: [number, number, number] = [255, 255, 255];

    const setFill = (c: [number, number, number]) => doc.setFillColor(c[0], c[1], c[2]);
    const setText = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
    const setDraw = (c: [number, number, number]) => doc.setDrawColor(c[0], c[1], c[2]);

    // ===== PAGE 1 =====
    setFill(NAVY);
    doc.rect(0, 0, pageW, 110, "F");
    setFill(BLUE);
    doc.roundedRect(40, 32, 46, 46, 10, 10, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("TF", 63, 62, { align: "center" });
    doc.setFontSize(22);
    doc.text("TeamFokus", 100, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText([203, 213, 225]);
    doc.text("Fokus-Booster für produktive Teams", 100, 72);
    setText(WHITE);
    doc.setFontSize(9);
    doc.text("teamfokus.app", pageW - 40, 55, { align: "right" });
    doc.text(new Date().toLocaleDateString("de-DE"), pageW - 40, 72, { align: "right" });

    let y = 150;
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("Ihre ROI-Auswertung", 40, y);
    y += 10;
    setDraw(BLUE);
    doc.setLineWidth(3);
    doc.line(40, y, 120, y);
    y += 22;
    setText(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Vertraulich — vorbereitet für die Geschäftsführung", 40, y);

    y += 26;
    setFill(SLATE_SOFT);
    doc.roundedRect(40, y, pageW - 80, 92, 10, 10, "F");
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("IHRE EINGABEN", 56, y + 22);
    const colW = (pageW - 80 - 32) / 3;
    const drawStat = (label: string, value: string, x: number) => {
      setText(SLATE);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(label, x, y + 44);
      setText(NAVY);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(value, x, y + 70);
    };
    drawStat("Mitarbeitende", `${employees}`, 56);
    drawStat("Kosten / Std.", fmtEUR(hourlyCost), 56 + colW);
    drawStat("Verlorene Std. / MA / Jahr", `${hoursPerYear} h`, 56 + colW * 2);

    y += 92 + 20;
    setFill(RED_SOFT);
    doc.roundedRect(40, y, pageW - 80, 100, 12, 12, "F");
    setFill(RED);
    doc.roundedRect(40, y, 6, 100, 3, 3, "F");
    setText(RED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("AKTUELLER VERLUST IHRES UNTERNEHMENS / JAHR", 60, y + 26);
    doc.setFontSize(32);
    doc.text(fmtEUR(lossPerYear, "-"), 60, y + 66);
    setText([153, 27, 27]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`= ${wastedHours.toLocaleString("de-DE")} verlorene Arbeitsstunden pro Jahr`, 60, y + 86);

    y += 100 + 14;
    setFill(BLUE_SOFT);
    doc.roundedRect(40, y, pageW - 80, 100, 12, 12, "F");
    setFill(BLUE);
    doc.roundedRect(40, y, 6, 100, 3, 3, "F");
    setText(BLUE_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("UMSATZSTEIGERUNG MIT TEAMFOCUS / JAHR", 60, y + 26);
    doc.setFontSize(32);
    doc.text(fmtEUR(savingsPerYear, "+"), 60, y + 66);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Bei rund 35 % weniger Bildschirmzeit — ca. ${fmtEUR(savingsPerMonth, "+")} pro Monat`, 60, y + 86);

    y += 100 + 14;
    setFill(GREEN_SOFT);
    doc.roundedRect(40, y, pageW - 80, 84, 12, 12, "F");
    setFill(GREEN);
    doc.roundedRect(40, y, 6, 84, 3, 3, "F");
    setText([21, 128, 61]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("NETTO-GEWINN NACH INVESTITION", 60, y + 24);
    doc.setFontSize(24);
    doc.text(fmtEUR(netSavings, "+"), 60, y + 54);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Investition: nur ${fmtEUR(teamfocusCostPerYear)} / Jahr  (2,99 € pro MA / Monat)`, 60, y + 72);

    setText(SLATE);
    doc.setFontSize(8);
    doc.text("Seite 1 / 2 — TeamFokus ROI-Auswertung", 40, pageH - 24);
    doc.text("teamfokus.app", pageW - 40, pageH - 24, { align: "right" });

    // ===== PAGE 2 =====
    doc.addPage();
    setFill(NAVY);
    doc.rect(0, 0, pageW, 70, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TeamFokus — Warum sich die Investition lohnt", 40, 42);
    setText([203, 213, 225]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("teamfokus.app", pageW - 40, 42, { align: "right" });

    y = 100;
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Das Problem muss gelöst werden.", 40, y);
    y += 22;
    setText(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Die Frage ist nur: wie? Sie haben zwei Optionen.", 40, y);

    y += 24;
    const boxW = (pageW - 80 - 16) / 2;
    const boxH = 210;

    setFill(RED_SOFT);
    doc.roundedRect(40, y, boxW, boxH, 10, 10, "F");
    setFill(RED);
    doc.roundedRect(40, y, boxW, 34, 10, 10, "F");
    doc.rect(40, y + 20, boxW, 14, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("OPTION A — HANDY-VERBOT", 54, y + 22);
    setText([127, 29, 29]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Wie vor 20 Jahren", 54, y + 58);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const optAPoints = [
      "Handy muss abgegeben werden",
      "Kontrolle statt Vertrauen",
      "Mitarbeiter fühlen sich überwacht",
      "Widerstand vom Betriebsrat",
      "Talentabwanderung droht",
      "Keine messbaren Daten",
    ];
    let ty = y + 82;
    optAPoints.forEach((p) => {
      setText(RED);
      doc.setFont("helvetica", "bold");
      doc.text("X", 54, ty);
      setText([127, 29, 29]);
      doc.setFont("helvetica", "normal");
      doc.text(p, 68, ty);
      ty += 18;
    });

    const bx = 40 + boxW + 16;
    setFill(BLUE_SOFT);
    doc.roundedRect(bx, y, boxW, boxH, 10, 10, "F");
    setFill(BLUE);
    doc.roundedRect(bx, y, boxW, 34, 10, 10, "F");
    doc.rect(bx, y + 20, boxW, 14, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("OPTION B — TEAMFOCUS", bx + 14, y + 22);
    setText(BLUE_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Belohnung statt Verbot", bx + 14, y + 58);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const optBPoints = [
      "Freiwillig & spielerisch",
      "Belohnungen für Fokus im Team",
      "100 % DSGVO — k>=5 Anonymität",
      "Betriebsrat-fertig (AVV/VVT/DSFA)",
      "Mitarbeiter lieben es",
      "Messbare Umsatzsteigerung",
    ];
    ty = y + 82;
    optBPoints.forEach((p) => {
      setText(BLUE);
      doc.setFont("helvetica", "bold");
      doc.text("+", bx + 14, ty);
      setText(BLUE_DARK);
      doc.setFont("helvetica", "normal");
      doc.text(p, bx + 28, ty);
      ty += 18;
    });

    y += boxH + 24;
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Warum sich TeamFokus für Sie lohnt", 40, y);
    y += 6;
    setDraw(BLUE);
    doc.setLineWidth(2);
    doc.line(40, y, 90, y);
    y += 20;

    const benefits = [
      { t: "Datenschutz erledigt", d: "100 % DSGVO — k-Anonymität (k>=5), tägliche Aggregation, Rohdaten nach 24 h gelöscht." },
      { t: "Compliance-Starter-Kit inklusive", d: "AVV, VVT, DSFA und Muster-Betriebsvereinbarung — sofort einsatzbereit." },
      { t: "Mitarbeitende lieben es", d: "Firmenessen, Team-Belohnungen, bessere Firmenwagen — Fokus als Spiel statt Zwang." },
      { t: "Weniger Stress, mehr Klarheit", d: "Im Beruf und im Privatleben — glücklichere Familien, entspanntere Teams." },
      { t: "Nur während der Arbeitszeit", d: "Freizeit bleibt komplett privat — keine Überwachung, keine Kontrolle." },
    ];

    doc.setFontSize(10);
    benefits.forEach((b) => {
      setFill(BLUE);
      doc.circle(46, y - 3, 3, "F");
      setText(NAVY);
      doc.setFont("helvetica", "bold");
      doc.text(b.t, 58, y);
      setText(SLATE);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(b.d, pageW - 80 - 18);
      doc.text(lines, 58, y + 14);
      y += 14 + lines.length * 12 + 6;
    });

    // CTA
    const cy = pageH - 120;
    setFill(NAVY);
    doc.roundedRect(40, cy, pageW - 80, 78, 12, 12, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Bereit, den Fokus in Ihr Team zu bringen?", 56, cy + 28);
    setText([203, 213, 225]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Website, Demo und Betriebsrat-Akzeptanz:", 56, cy + 46);
    setText(BLUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.textWithLink("teamfokus.app", 56, cy + 64, { url: "https://teamfokus.app" });
    doc.textWithLink("teamfokus.app/akzeptanz", 160, cy + 64, { url: "https://teamfokus.app/akzeptanz" });
    doc.textWithLink("teamfokus.app/vorteile", 320, cy + 64, { url: "https://teamfokus.app/vorteile" });

    setText(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Seite 2 / 2 — TeamFokus ROI-Auswertung", 40, pageH - 24);
    doc.text("teamfokus.app", pageW - 40, pageH - 24, { align: "right" });

    doc.save(`TeamFokus-ROI-${employees}-MA.pdf`);
  };

  const emailPdf = () => {
    const subject = encodeURIComponent("TeamFokus ROI-Auswertung");
    const body = encodeURIComponent(
      `Hallo,\n\nanbei meine ROI-Auswertung mit TeamFokus:\n\n` +
      `- Mitarbeitende: ${employees}\n` +
      `- Aktueller Verlust / Jahr: ${fmtEUR(lossPerYear)}\n` +
      `- Mögliche Einsparung / Jahr (35 %): ${fmtEUR(savingsPerYear)}\n` +
      `- Investition TeamFokus / Jahr: ${fmtEUR(teamfocusCostPerYear)} (2,99 €/MA/Monat)\n` +
      `- Netto-Gewinn / Jahr: ${fmtEUR(netSavings)}\n\n` +
      `Mehr Infos: https://teamfokus.app\n` +
      `Betriebsrat-Akzeptanz: https://teamfokus.app/akzeptanz\n\n` +
      `(PDF-Export bitte separat anhängen – wurde aus dem Rechner heruntergeladen.)`
    );
    exportPdf();
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section className="container py-20 md:py-24 border-t border-border/40" id="calculator">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Schritt 1 · Lohnt sich das?</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Was kostet Ablenkung Ihr Unternehmen?</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Studien belegen das ein:e Mitarbeitende:r 154 bis 720 Arbeitsstunden pro Jahr durch Ablenkung verliert.{" "}
          <a 
            href="https://steeringpoint.ie/worklife/how-does-smartphone-use-impact-the-workplace#:~:text=Smartphones%20are%20the%20ultimate%20office%20distraction%20%E2%80%93%E2%80%93%20which%20is%20why%20they%20are%20a%20problem%20for%20employers.%20The%20average%20employee%20loses%20720%20work%20hours%20due%20to%20distraction%20every%20year%20%5B15%5D.%20Those%20lost%20hours%20are%20felt%20in%20profits.%20As%20such%2C%20it%E2%80%99s%20no%20surprise%20that%20businesses%20have%20tried%20to%20fix%20the%20problem"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Studie einsehen
          </a>
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface-card p-7 md:p-8 space-y-7">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Mitarbeitende</Label>
              <span className="text-2xl font-semibold tabular-nums">{employees}</span>
            </div>
            <Slider value={[employees]} min={1} max={2000} step={1} onValueChange={(v) => setEmployees(v[0])} />
            <Input type="number" min={1} max={10000} value={employees}
              onChange={(e) => setEmployees(Math.max(1, Math.min(10000, Number(e.target.value) || 1)))} className="h-10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Kosten pro Mitarbeitendem / Stunde</Label>
              <span className="text-2xl font-semibold tabular-nums">{fmtEUR(hourlyCost)}</span>
            </div>
            <Slider value={[hourlyCost]} min={10} max={150} step={1} onValueChange={(v) => setHourlyCost(v[0])} />
            <Input type="number" min={1} max={500} value={hourlyCost}
              onChange={(e) => setHourlyCost(Math.max(1, Math.min(500, Number(e.target.value) || 1)))} className="h-10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">Verschwendete Arbeitszeit / Mitarbeitendem / Jahr</Label>
              <span className="text-2xl font-semibold tabular-nums">{hoursPerYear} h</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Wie viele Stunden, denken Sie, verschwenden Ihre Mitarbeitenden im Jahr?
            </p>
            <Slider value={[hoursPerYear]} min={154} max={720} step={1} onValueChange={(v) => setHoursPerYear(v[0])} />
            <p className="text-xs text-muted-foreground">
              {fmtPerDay(hoursPerYear)} <span className="opacity-70">(bei 250 Arbeitstagen/Jahr)</span>
            </p>
          </div>

          <div className="rounded-2xl bg-secondary/60 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Spanne 154–720 h/Jahr je nach Arbeitsbereich. Oberwert (720 h):{" "}
              <a href={SRC_720H} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                Quelle
              </a>
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="surface-card p-7 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-destructive/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">AKTUELLER VERLUST IHRES UNTERNEHMENS DURCH HANDY ABLENKUNG / JAHR</p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-destructive">{fmtEUR(lossPerYear, "-")}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≙ <strong className="text-foreground">{wastedHours.toLocaleString("de-DE")} Stunden</strong> verlorener Arbeitszeit.
              </p>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                Smartphone-Sucht am Arbeitsplatz kostet nicht nur Zeit: Studien zeigen mehr Fehler, sinkende Qualität, höhere Unfallrisiken, schlechtere Zusammenarbeit und steigenden Stress in der Arbeit und im Privatleben – die tatsächlichen Folgekosten liegen meist deutlich über dem reinen Stundenverlust.{" "}
                <a href={SRC_LOSS} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  Studie ansehen
                </a>
              </p>
            </div>
          </div>

          <div className="surface-card p-7 relative overflow-hidden border-primary/30 ring-1 ring-primary/20">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-20 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">IHRE UMSATZSTEIGERUNG MIT TEAMFOCUS / JAHR</p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">{fmtEUR(savingsPerYear, "+")}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≈ <strong className="text-foreground">{fmtEUR(savingsPerMonth, "+")} / Monat</strong> – bei rund 35 % weniger Bildschirmzeit.
              </p>
              <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                In der Praxis meist höher: mehr Konzentration → weniger Fehler {"->"} Stärker als die Konkurenz
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        <div className="max-w-3xl w-full text-center">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Das Problem <span className="text-destructive">muss</span> gelöst werden.
          </h3>
          <p className="mt-2 text-muted-foreground">Die Frage ist nur: wie?</p>
        </div>
        <div className="max-w-3xl w-full grid md:grid-cols-2 gap-4">
          <div className="surface-card p-5 border-destructive/30">
            <p className="text-xs uppercase tracking-widest text-destructive font-semibold mb-2">Option A</p>
            <p className="text-base font-semibold mb-1">Handy-Verbot</p>
            <p className="text-sm text-muted-foreground">Handy muss abgegeben werden – es wird wieder fokussiert gearbeitet wie vor 20 Jahren.</p>
          </div>
          <div className="surface-card p-5 border-primary/40 ring-1 ring-primary/20">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Option B</p>
            <p className="text-base font-semibold mb-1">TeamFokus</p>
            <p className="text-sm text-muted-foreground">Mitarbeiterfreundlich und belohnungsbasiert motivierend – ohne Verbote, ohne Überwachung.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={exportPdf} size="lg" variant="outline" className="h-12 px-6 w-full sm:w-auto">
            <Download className="h-4 w-4" /> Als PDF exportieren
          </Button>
          <Button onClick={emailPdf} size="lg" variant="outline" className="h-12 px-6 w-full sm:w-auto">
            Per E-Mail senden
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Einseitige Zusammenfassung mit Branding – ideal zum Weiterleiten an Geschäftsführung & Betriebsrat.
        </p>
      </div>
    </section>
  );
}
