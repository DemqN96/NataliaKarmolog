import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Стан Достатку — курс Наталії Войтович",
  description: "Курс з кармології, психосоматики та особистісного зростання для створення достатку у вашому житті.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
