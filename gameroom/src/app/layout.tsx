import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GAMEROOM",
  description: "A bright, expandable STEAM game suite for iPad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
