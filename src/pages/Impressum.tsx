import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Mail, Phone, Scale } from "lucide-react";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";

const company = {
  name: "TeamFokus GmbH",
  street: "Königstraße 42",
  zipCity: "90402 Nürnberg",
  country: "Deutschland",
  phone: "+49 911 1234567",
  email: "joel@teamfokus.app",
  managingDirector: "Joel Schöppe",
  registerCourt: "Amtsgericht Nürnberg",
  registerNumber: "HRB 42 1337",
  vatId: "DE 345 678 901",
};

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Impressum – TeamFokus"
        description="Impressum von TeamFokus: Angaben gemäß § 5 TMG, Kontakt, Handelsregister und Verantwortlicher."
        path="/impressum"
      />

      <header className="border-b border-border/40">
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center"><Logo withWordmark /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
        </div>
      </header>

      <main className="container py-12 md:py-16 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-14 w-14 rounded-2xl gradient-primary items-center justify-center shadow-glow mb-5">
            <Scale className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Impressum</h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Angaben gemäß § 5 TMG.
          </p>
        </div>

        <div className="grid gap-4">
          <section className="surface-card p-6 md:p-7 flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="font-semibold mb-1">Diensteanbieter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{company.name}</strong><br />
                  {company.street}<br />
                  {company.zipCity}<br />
                  {company.country}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Kontakt</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-foreground transition-colors">{company.phone}</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${company.email}`} className="hover:text-foreground transition-colors">{company.email}</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Register & Steuer</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {company.registerCourt}<br />
                    {company.registerNumber}<br />
                    USt-IdNr.: {company.vatId}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Geschäftsführung</h3>
                <p className="text-sm text-muted-foreground">{company.managingDirector}</p>
              </div>
            </div>
          </section>

          <section className="surface-card p-6 md:p-7">
            <h2 className="font-semibold mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Joel Schöppe<br />
              TeamFokus GmbH<br />
              {company.street}, {company.zipCity}, {company.country}
            </p>
          </section>

          <section className="surface-card p-6 md:p-7">
            <h2 className="font-semibold mb-3">Haftungsausschluss</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
                Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
              </p>
              <p>
                Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr.
              </p>
            </div>
          </section>

          <section className="surface-card p-6 md:p-7">
            <h2 className="font-semibold mb-3">Online-Streitbeilegung</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              {" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>.
              Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
