import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setItems(data ?? []));
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">Hinweise</h1>
      </header>
      <section className="px-5">
        {items.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <Bell className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">Noch keine Benachrichtigungen.</p>
          </div>
        ) : (
          <div className="surface-card divide-y divide-border/60">
            {items.map((n) => (
              <div key={n.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-2xl bg-secondary grid place-items-center shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                    <p className="text-[11px] text-muted-foreground mt-1.5">{new Date(n.created_at).toLocaleString("de-DE")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
