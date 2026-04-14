import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puppeteer OS v1",
  description: "Local-first project operating system scaffold"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
