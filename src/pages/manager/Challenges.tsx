import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy } from "lucide-react";

interface Challenge { id: string; title: string; description: string | null; status: string; start_date: string; end_date: string; }

export default function ManagerChallenges() {
  const { companyId } = useAuth();
  const [items, setItems] = useState<Challenge[]>([]);

  useEffect(() => {
    if (!companyId) return;
    supabase.from("challenges").select("*").eq("company_id", companyId).order("start_date", { ascending: false })
      .then(({ data }) => setItems(data ?? []));
  }, [companyId]);

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Challenges</h1>
      <ul className="space-y-3">
        {items.map(c => (
          <li key={c.id} className="surface-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-2xl gradient-primary grid place-items-center"><Trophy className="h-5 w-5 text-primary-foreground" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.start_date} → {c.end_date}</p>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>{c.status}</span>
            </div>
            {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Challenges.</p>}
      </ul>
    </div>
  );
}
