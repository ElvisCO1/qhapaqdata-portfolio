import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "QhapaqData — Data, connected to insight",
    template: "%s | QhapaqData",
  },
  description:
    "Elvis Candia Ochoa's portfolio: data analytics, applied statistics, and artificial intelligence.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="page-shell">
          {children}
        </main>
        <footer className="footer">
          <div>
            <Link href="/" className="font-semibold text-white">
              QhapaqData.
            </Link>
            <p>Data. Engineering. Understanding.</p>
          </div>
          <span>Built by Elvis Candia Ochoa</span>
          <Link href="/about">About the creator ↗</Link>
        </footer>
      </body>
    </html>
  );
}
