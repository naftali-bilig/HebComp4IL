import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host ? new URL(`${protocol}://${host}`) : undefined;

  return {
    metadataBase,
    title: "קידוש החודש",
    description: "שעון עברי המציג את זמני החמה והלבנה, התאריך העברי ומיקום ירושלים או המיקום הנוכחי.",
    icons: {
      icon: "/hebrewclock.png",
      shortcut: "/hebrewclock.png",
    },
    openGraph: {
      title: "קידוש החודש",
      description: "שעון עברי לחמה, ללבנה ולתאריך העברי.",
      images: [{ url: "/og.png", width: 1744, height: 909, alt: "קידוש החודש" }],
      locale: "he_IL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "קידוש החודש",
      description: "שעון עברי לחמה, ללבנה ולתאריך העברי.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
