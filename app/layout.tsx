import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magie Deals",
  description: "B2B Deal Presentation for Magie All Hands",
  icons: { icon: "/icons/magie_favico.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-page text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}
