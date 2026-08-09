import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prosthetic Design Studio",
  description: "Design a prosthetic leg that feels like you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}