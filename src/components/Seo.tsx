import { Helmet } from "react-helmet-async";
import { useI18n } from "@/i18n";

const SITE_URL = "https://teamfokus.app";

type Props = {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noindex?: boolean;
};

const OG_LOCALE: Record<string, string> = { de: "de_DE", en: "en_US", es: "es_ES" };
const OG_IMAGE: Record<string, string> = {
  de: `${SITE_URL}/og-image.jpg`,
  en: `${SITE_URL}/og-image-en.jpg`,
  es: `${SITE_URL}/og-image-es.jpg`,
};

export default function Seo({ title, description, path, jsonLd, noindex }: Props) {
  const { lang } = useI18n();
  const url = `${SITE_URL}${path}`;
  const image = OG_IMAGE[lang] ?? OG_IMAGE.de;
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:locale" content={OG_LOCALE[lang] ?? "de_DE"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
}
