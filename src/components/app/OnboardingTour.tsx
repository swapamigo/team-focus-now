import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Trophy, BarChart3, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Slide {
  icon: any;
  title: string;
  desc: string;
}

const employeeSlides: Slide[] = [
  { icon: Sparkles, title: "Willkommen bei Team Focus", desc: "Schön, dass du dabei bist. Wir helfen dir, fokussierter zu arbeiten – ohne Druck, ohne Überwachung." },
  { icon: BarChart3, title: "Dein persönliches Dashboard", desc: "Sieh deinen Fortschritt auf einen Blick: Bildschirmzeit, Fokus-Phasen und dein Team-Ranking." },
  { icon: Lock, title: "Deine Privatsphäre ist geschützt", desc: "Nur DU siehst deine Daten. Dein Manager erhält ausschließlich anonyme Team-Aggregate – nie individuelle Werte." },
  { icon: Trophy, title: "Motivation statt Kontrolle", desc: "Verdiene Belohnungen, gewinne Challenges und arbeite entspannter. Erfasst wird nur während deiner Arbeitszeit." },
];

const managerSlides: Slide[] = [
  { icon: Sparkles, title: "Willkommen bei Team Focus", desc: "Das motivationsbasierte Produktivitäts-Tool für Ihr Team. In 5 Minuten startklar." },
  { icon: Trophy, title: "Teams & Challenges", desc: "Legen Sie Teams an, starten Sie faire Wettbewerbe und verteilen Sie Belohnungen für mehr Fokus." },
  { icon: BarChart3, title: "Anonyme Team-Statistiken", desc: "Sie sehen Trends auf Team-Ebene – nie individuelle Daten einzelner Mitarbeitender. Das schafft Vertrauen." },
  { icon: Lock, title: "Privacy-by-Design", desc: "Keine Screenshots, keine Tastatureingaben. Messung ausschließlich während der Arbeitszeit. DSGVO-konform." },
];

export default function OnboardingTour() {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const storageKey = user ? `tf:onboarded:${user.id}` : null;
  const slides = role === "manager" ? managerSlides : employeeSlides;

  useEffect(() => {
    if (!storageKey) return;
    if (!localStorage.getItem(storageKey)) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [storageKey]);

  const finish = () => {
    if (storageKey) localStorage.setItem(storageKey, "1");
    setOpen(false);
    setStep(0);
  };

  const slide = slides[step];
  const isLast = step === slides.length - 1;
  const Icon = slide.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) finish(); }}>
      <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-border/60">
        <div className="relative p-8 pt-10">
          <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
          <div className="relative">
            <div className="mx-auto mb-6 h-16 w-16 rounded-2xl gradient-primary grid place-items-center shadow-glow">
              <Icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-center">{slide.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground text-center leading-relaxed">{slide.desc}</p>

            <div className="flex justify-center gap-1.5 mt-7">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>

            <div className="mt-7 flex gap-2">
              {step > 0 && (
                <Button variant="ghost" className="flex-1 h-11 rounded-xl" onClick={() => setStep(step - 1)}>
                  Zurück
                </Button>
              )}
              {!isLast ? (
                <Button className="flex-1 h-11 rounded-xl" onClick={() => setStep(step + 1)}>
                  Weiter <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button className="flex-1 h-11 rounded-xl shadow-glow" onClick={finish}>
                  <Check className="mr-1 h-4 w-4" /> Loslegen
                </Button>
              )}
            </div>

            <button
              onClick={finish}
              className="block mx-auto mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Tour überspringen
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
