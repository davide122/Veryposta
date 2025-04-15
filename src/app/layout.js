import localFont from "next/font/local";
import "./globals.css";
import { SearchTermsProvider } from "./components/SearchTermsProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "VeryPosta - Il Futuro dei Multiservizi è Ora | Franchising Innovativo",
  description: "VeryPosta offre un franchising multiservizi innovativo con supporto reale, formazione continua e tecnologia inclusa. Scopri come aprire un punto VeryPosta nella tua città.",
  keywords: [
    "VeryPosta",
    "franchising multiservizi",
    "servizi postali",
    "spedizioni",
    "energia",
    "telefonia",
    "CAF",
    "patronato",
    "SPID",
    "firme digitali",
    "PEC",
    "pratiche amministrative",
    "aprire un franchising",
    "punto servizi",
    "affiliazione",
  ],
  author: "VeryPosta Team",
  robots: "index, follow",
  canonical: "https://veryposta.it",
  openGraph: {
    title: "VeryPosta - Il Futuro dei Multiservizi è Ora | Franchising Innovativo",
    description: "Diventa affiliato VeryPosta: franchising multiservizi con supporto reale, formazione continua e tecnologia inclusa. La soluzione ideale per imprenditori.",
    url: "https://veryposta.it",
    type: "website",
    locale: "it_IT",
    images: [
      {
        url: "/dsx.png",
        width: 1200,
        height: 630,
        alt: "VeryPosta - Franchising Multiservizi",
      },
    ],
    siteName: "VeryPosta",
  },
  twitter: {
    card: "summary_large_image",
    title: "VeryPosta - Il Futuro dei Multiservizi è Ora",
    description: "Franchising multiservizi con supporto reale, formazione continua e tecnologia inclusa.",
    images: ["/dsx.png"],
  },
  alternates: {
    canonical: "https://veryposta.it",
  },
  verification: {
    google: "google-site-verification-code", // Sostituire con il codice reale quando disponibile
  },
};


export default function RootLayout({ children }) {
  // Metadati predefiniti per il SearchTermsProvider
  const defaultMetadata = {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords
  };
  
  return (
    <html lang="it">
      <head>
        {/* Meta tag per i metadati dinamici (verranno letti dal client) */}
        <meta name="x-seo-title" content="" />
        <meta name="x-seo-description" content="" />
        <meta name="x-seo-keywords" content="" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "VeryPosta",
              "url": "https://veryposta.it",
              "logo": "https://veryposta.it/dsx.png",
              "description": "VeryPosta offre un franchising multiservizi innovativo con supporto reale, formazione continua e tecnologia inclusa.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IT"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+39-000-000000",
                "contactType": "customer service",
                "email": "info@veryposta.it",
                "availableLanguage": "Italian"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchTermsProvider defaultMetadata={defaultMetadata}>
          {children}
        </SearchTermsProvider>
      </body>
    </html>
  );
}
