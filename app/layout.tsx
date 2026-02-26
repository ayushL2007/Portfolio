import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ayush Lahiri | Pixel Portfolio",
  description:
    "Explore Ayush Lahiri's portfolio as a 2D pixel RPG adventure. Walk around the town and enter buildings to discover projects, experience, education, and more.",
};

export const viewport: Viewport = {
  themeColor: "#1a1c2c",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${pressStart.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
