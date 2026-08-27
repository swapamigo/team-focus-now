import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Trophy, BarChart3, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/i18n";

interface Slide {
  icon: any;
  title: string;
  desc: string;
}

export default function OnboardingTour() {
  const t = useT();
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const employeeSlides: Slide[] = [
    { icon: Sparkles, title: t("app.onboardingtour.employee_slide1_title"), desc: t("app.onboardingtour.employee_slide1_desc") },
    { icon: BarChart3, title: t("app.onboardingtour.employee_slide2_title"), desc: t("app.onboardingtour.employee_slide2_desc") },
    { icon: Lock, title: t("app.onboardingtour.employee_slide3_title"), desc: t("app.onboardingtour.employee_slide3_desc") },
    { icon: Trophy, title: t("app.onboardingtour.employee_slide4_title"), desc: t("app.onboardingtour.employee_slide4_desc") },
  ];

  const managerSlides: Slide[] = [
    { icon: Sparkles, title: t("app.onboardingtour.manager_slide1_title"), desc: t("app.onboardingtour.manager_slide1_desc") },
    { icon: Trophy, title: t("app.onboardingtour.manager_slide2_title"), desc: t("app.onboardingtour.manager_slide2_desc") },
    { icon: BarChart3, title: t("app.onboardingtour.manager_slide3_title"), desc: t("app.onboardingtour.manager_slide3_desc") },
    { icon: Lock, title: t("app.onboardingtour.manager_slide4_title"), desc: t("app.onboardingtour.manager_slide4_desc") },
  ];

  const storageKey = user ? `tf:onboarded:${user.id}` : null;
  const slides = role === "manager" ? managerSlides : employeeSlides;

  useEffect(() => {
    if (!storageKey) return;
    if (!localStorage.getItem(storageKey)) {
      const timer = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(timer);
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
                  {t("app.onboardingtour.back")}
                </Button>
              )}
              {!isLast ? (
                <Button className="flex-1 h-11 rounded-xl" onClick={() => setStep(step + 1)}>
                  {t("app.onboardingtour.next")} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button className="flex-1 h-11 rounded-xl shadow-glow" onClick={finish}>
                  <Check className="mr-1 h-4 w-4" /> {t("app.onboardingtour.start")}
                </Button>
              )}
            </div>

            <button
              onClick={finish}
              className="block mx-auto mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("app.onboardingtour.skip")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
