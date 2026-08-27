import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Info, Sparkles, Download } from "lucide-react";
import jsPDF from "jspdf";
import { useT, useI18n } from "@/i18n";

const REDUCTION = 0.35;
const WORKING_DAYS = 250;

const localeMap: Record<string, string> = { de: "de-DE", en: "en-US", es: "es-ES" };

const SRC_720H = "https://steeringpoint.ie/worklife/how-does-smartphone-use-impact-the-workplace/";
const SRC_LOSS = "https://www.prnewswire.com/news-releases/screen-educations-smartphone-distraction--workplace-safety-survey-finds-us-employees-distracted-2-5-hours-each-workday-by-digital-content-unrelated-to-their-jobs-301120969.html";

export default function RoiCalculator() {
  const t = useT();
  const { lang } = useI18n();
  const locale = localeMap[lang] || "de-DE";
  const [employees, setEmployees] = useState(25);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [hoursPerYear, setHoursPerYear] = useState(720);

  const fmtEUR = (n: number, prefix: string = "") => {
    const formatted = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
    return `${prefix}${formatted}`;
  };

  const fmtPerDay = (hoursPerYear: number) => {
    const totalMin = Math.round((hoursPerYear / WORKING_DAYS) * 60);
    if (totalMin >= 60) {
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      return t("landing.roi.per_day_hm", { h: String(h), m: String(m) });
    }
    return t("landing.roi.per_day_m", { m: String(totalMin) });
  };

  const { wastedHours, lossPerYear, savingsPerYear, savingsPerMonth } = useMemo(() => {
    const wasted = employees * hoursPerYear;
    const loss = wasted * hourlyCost;
    const savings = loss * REDUCTION;
    return { wastedHours: wasted, lossPerYear: loss, savingsPerYear: savings, savingsPerMonth: savings / 12 };
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
    doc.text(t("landing.roi.pdf.tagline"), 100, 72);
    setText(WHITE);
    doc.setFontSize(9);
    doc.text("teamfokus.app", pageW - 40, 55, { align: "right" });
    doc.text(new Date().toLocaleDateString(locale), pageW - 40, 72, { align: "right" });

    let y = 150;
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text(t("landing.roi.pdf.title"), 40, y);
    y += 10;
    setDraw(BLUE);
    doc.setLineWidth(3);
    doc.line(40, y, 120, y);
    y += 22;
    setText(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(t("landing.roi.pdf.confidential"), 40, y);

    y += 26;
    setFill(SLATE_SOFT);
    doc.roundedRect(40, y, pageW - 80, 92, 10, 10, "F");
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(t("landing.roi.pdf.your_inputs"), 56, y + 22);
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
    drawStat(t("landing.roi.pdf.employees_label"), `${employees}`, 56);
    drawStat(t("landing.roi.pdf.cost_per_hour_label"), fmtEUR(hourlyCost), 56 + colW);
    drawStat(t("landing.roi.pdf.hours_lost_label"), `${hoursPerYear} h`, 56 + colW * 2);

    y += 92 + 20;
    setFill(RED_SOFT);
    doc.roundedRect(40, y, pageW - 80, 100, 12, 12, "F");
    setFill(RED);
    doc.roundedRect(40, y, 6, 100, 3, 3, "F");
    setText(RED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(t("landing.roi.pdf.current_loss_title"), 60, y + 26);
    doc.setFontSize(32);
    doc.text(fmtEUR(lossPerYear, "-"), 60, y + 66);
    setText([153, 27, 27]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(t("landing.roi.pdf.hours_lost_line", { hours: wastedHours.toLocaleString(locale) }), 60, y + 86);

    y += 100 + 14;
    setFill(BLUE_SOFT);
    doc.roundedRect(40, y, pageW - 80, 100, 12, 12, "F");
    setFill(BLUE);
    doc.roundedRect(40, y, 6, 100, 3, 3, "F");
    setText(BLUE_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(t("landing.roi.pdf.revenue_increase_title"), 60, y + 26);
    doc.setFontSize(32);
    doc.text(fmtEUR(savingsPerYear, "+"), 60, y + 66);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(t("landing.roi.pdf.revenue_increase_line", { amount: fmtEUR(savingsPerMonth, "+") }), 60, y + 86);

    setText(SLATE);
    doc.setFontSize(8);
    doc.text(t("landing.roi.pdf.footer_page1"), 40, pageH - 24);
    doc.text("teamfokus.app", pageW - 40, pageH - 24, { align: "right" });

    // ===== PAGE 2 =====
    doc.addPage();
    setFill(NAVY);
    doc.rect(0, 0, pageW, 70, "F");
    setText(WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(t("landing.roi.pdf.page2_header"), 40, 42);
    setText([203, 213, 225]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("teamfokus.app", pageW - 40, 42, { align: "right" });

    y = 100;
    setText(NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(t("landing.roi.pdf.problem_title"), 40, y);
    y += 22;
    setText(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(t("landing.roi.pdf.problem_sub"), 40, y);

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
    doc.text(t("landing.roi.pdf.option_a_header"), 54, y + 22);
    setText([127, 29, 29]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(t("landing.roi.pdf.option_a_subhead"), 54, y + 58);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const optAPoints = [
      t("landing.roi.pdf.option_a_point1"),
      t("landing.roi.pdf.option_a_point2"),
      t("landing.roi.pdf.option_a_point3"),
      t("landing.roi.pdf.option_a_point4"),
      t("landing.roi.pdf.option_a_point5"),
      t("landing.roi.pdf.option_a_point6"),
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
    doc.text(t("landing.roi.pdf.option_b_header"), bx + 14, y + 22);
    setText(BLUE_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(t("landing.roi.pdf.option_b_subhead"), bx + 14, y + 58);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const optBPoints = [
      t("landing.roi.pdf.option_b_point1"),
      t("landing.roi.pdf.option_b_point2"),
      t("landing.roi.pdf.option_b_point3"),
      t("landing.roi.pdf.option_b_point4"),
      t("landing.roi.pdf.option_b_point5"),
      t("landing.roi.pdf.option_b_point6"),
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
    doc.text(t("landing.roi.pdf.why_title"), 40, y);
    y += 6;
    setDraw(BLUE);
    doc.setLineWidth(2);
    doc.line(40, y, 90, y);
    y += 20;

    const benefits = [
      { t: t("landing.roi.pdf.benefit1_t"), d: t("landing.roi.pdf.benefit1_d") },
      { t: t("landing.roi.pdf.benefit2_t"), d: t("landing.roi.pdf.benefit2_d") },
      { t: t("landing.roi.pdf.benefit3_t"), d: t("landing.roi.pdf.benefit3_d") },
      { t: t("landing.roi.pdf.benefit4_t"), d: t("landing.roi.pdf.benefit4_d") },
      { t: t("landing.roi.pdf.benefit5_t"), d: t("landing.roi.pdf.benefit5_d") },
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
    doc.text(t("landing.roi.pdf.cta_title"), 56, cy + 28);
    setText([203, 213, 225]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(t("landing.roi.pdf.cta_sub"), 56, cy + 46);
    setText(BLUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.textWithLink("teamfokus.app", 56, cy + 64, { url: "https://teamfokus.app" });
    doc.textWithLink("teamfokus.app/fuer-betriebsrat", 160, cy + 64, { url: "https://teamfokus.app/fuer-betriebsrat" });
    doc.textWithLink("teamfokus.app/fuer-mitarbeitende", 320, cy + 64, { url: "https://teamfokus.app/fuer-mitarbeitende" });

    setText(SLATE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(t("landing.roi.pdf.footer_page2"), 40, pageH - 24);
    doc.text("teamfokus.app", pageW - 40, pageH - 24, { align: "right" });

    doc.save(`TeamFokus-ROI-${employees}-MA.pdf`);
  };

  const emailPdf = () => {
    const subject = encodeURIComponent(t("landing.roi.email.subject"));
    const body = encodeURIComponent(
      t("landing.roi.email.body", {
        employees: String(employees),
        loss: fmtEUR(lossPerYear),
        savings: fmtEUR(savingsPerYear),
      })
    );
    exportPdf();
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section className="container py-20 md:py-24 border-t border-border/40 scroll-mt-24" id="roi">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">{t("landing.roi.eyebrow")}</p>
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{t("landing.roi.title")}</h2>
        <p className="mt-4 text-muted-foreground text-lg">
          {t("landing.roi.subtitle")}{" "}
          <a 
            href="https://steeringpoint.ie/worklife/how-does-smartphone-use-impact-the-workplace#:~:text=Smartphones%20are%20the%20ultimate%20office%20distraction%20%E2%80%93%E2%80%93%20which%20is%20why%20they%20are%20a%20problem%20for%20employers.%20The%20average%20employee%20loses%20720%20work%20hours%20due%20to%20distraction%20every%20year%20%5B15%5D.%20Those%20lost%20hours%20are%20felt%20in%20profits.%20As%20such%2C%20it%E2%80%99s%20no%20surprise%20that%20businesses%20have%20tried%20to%20fix%20the%20problem"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t("landing.roi.view_study")}
          </a>
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface-card p-7 md:p-8 space-y-7">
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">{t("landing.roi.employees_label")}</Label>
              <span className="text-2xl font-semibold tabular-nums">{employees}</span>
            </div>
            <Slider value={[employees]} min={1} max={2000} step={1} onValueChange={(v) => setEmployees(v[0])} />
            <Input type="number" min={1} max={10000} value={employees}
              onChange={(e) => setEmployees(Math.max(1, Math.min(10000, Number(e.target.value) || 1)))} className="h-10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">{t("landing.roi.hourly_cost_label")}</Label>
              <span className="text-2xl font-semibold tabular-nums">{fmtEUR(hourlyCost)}</span>
            </div>
            <Slider value={[hourlyCost]} min={10} max={150} step={1} onValueChange={(v) => setHourlyCost(v[0])} />
            <Input type="number" min={1} max={500} value={hourlyCost}
              onChange={(e) => setHourlyCost(Math.max(1, Math.min(500, Number(e.target.value) || 1)))} className="h-10" />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <Label className="text-sm font-medium">{t("landing.roi.hours_per_year_label")}</Label>
              <span className="text-2xl font-semibold tabular-nums">{hoursPerYear} h</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              {t("landing.roi.hours_per_year_hint")}
            </p>
            <Slider value={[hoursPerYear]} min={154} max={720} step={1} onValueChange={(v) => setHoursPerYear(v[0])} />
            <p className="text-xs text-muted-foreground">
              {fmtPerDay(hoursPerYear)} <span className="opacity-70">{t("landing.roi.working_days_note")}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-secondary/60 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("landing.roi.range_note")}{" "}
              <a href={SRC_720H} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                {t("landing.roi.source")}
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
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{t("landing.roi.current_loss_label")}</p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-destructive">{fmtEUR(lossPerYear, "-")}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≙ <strong className="text-foreground">{t("landing.roi.hours_lost", { hours: wastedHours.toLocaleString(locale) })}</strong> {t("landing.roi.lost_work_time")}.
              </p>
              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                {t("landing.roi.loss_details")}{" "}
                <a href={SRC_LOSS} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {t("landing.roi.view_study2")}
                </a>
              </p>
            </div>
          </div>

          <div className="surface-card p-7 relative overflow-hidden border-primary/30 ring-1 ring-primary/20">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full gradient-primary opacity-20 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">{t("landing.roi.revenue_increase_label")}</p>
              </div>
              <p className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient">{fmtEUR(savingsPerYear, "+")}</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≈ <strong className="text-foreground">{t("landing.roi.per_month", { amount: fmtEUR(savingsPerMonth, "+") })}</strong> – {t("landing.roi.revenue_increase_note")}
              </p>
              <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                {t("landing.roi.practice_note")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        <div className="max-w-3xl w-full text-center">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {t("landing.roi.problem_prefix")} <span className="text-destructive">{t("landing.roi.problem_must")}</span> {t("landing.roi.problem_suffix")}
          </h3>
          <p className="mt-2 text-muted-foreground">{t("landing.roi.problem_question")}</p>
        </div>
        <div className="max-w-3xl w-full grid md:grid-cols-2 gap-4">
          <div className="surface-card p-5 border-destructive/30">
            <p className="text-xs uppercase tracking-widest text-destructive font-semibold mb-2">{t("landing.roi.option_a_label")}</p>
            <p className="text-base font-semibold mb-1">{t("landing.roi.option_a_title")}</p>
            <p className="text-sm text-muted-foreground">{t("landing.roi.option_a_desc")}</p>
          </div>
          <div className="surface-card p-5 border-primary/40 ring-1 ring-primary/20">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{t("landing.roi.option_b_label")}</p>
            <p className="text-base font-semibold mb-1">{t("landing.roi.option_b_title")}</p>
            <p className="text-sm text-muted-foreground">{t("landing.roi.option_b_desc")}</p>
          </div>
        </div>

        <div className="max-w-2xl w-full surface-card p-6 md:p-8 text-center">
          <p className="text-sm font-medium text-foreground mb-2">{t("landing.roi.offer_title")}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {t("landing.roi.offer_desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="h-12 px-8 shadow-glow w-full sm:w-auto">
              <a href="https://cal.com/joelschoppe/teamfocus" target="_blank" rel="noopener noreferrer">
                {t("landing.roi.book_call")}
              </a>
            </Button>
            <Button onClick={exportPdf} size="lg" variant="outline" className="h-12 px-6 w-full sm:w-auto">
              <Download className="h-4 w-4" /> {t("landing.roi.export_pdf")}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-md">
          {t("landing.roi.summary_note")}
        </p>
      </div>
    </section>
  );
}
