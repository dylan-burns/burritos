import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hilbertos Freight Co. — Shipping Calculator",
  description: "Calculate the true cost of moving rolled tortillas across this great nation.",
  icons: { icon: "/hilbertos.jpg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
