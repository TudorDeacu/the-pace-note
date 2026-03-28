import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Pace Note",
  description: "Motorsportul românesc și cultura auto din România.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, padding: 0, background: "#000" }}>
        {children}
      </body>
    </html>
  );
}
