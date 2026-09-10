import type { Metadata } from "next";
import { Archivo_Black, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// MACRO-TYPOGRAPHY — neo-grotesque heavy sans for structural headers
const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-macro-archivo",
  subsets: ["latin"],
});

// MICRO-TYPOGRAPHY — monospace terminal face for data & telemetry
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
});

// TEXTURAL CONTRAST — high-contrast serif, used sparingly
const playfair = Playfair_Display({
  variable: "--font-serif-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "LINUX SYSADMIN // FIELD NOTES — LX-09",
  description:
    "Industrial telemetry interface for Linux System Administration course notes. Terminal operations, file systems, users & permissions, processes, services, storage, network, SELinux. 8 sections / 44 modules / 200+ commands.",
  keywords: ["Linux", "System Administration", "RHCSA", "notes", "terminal", "systemd", "SELinux", "LVM"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivoBlack.variable} ${jetbrainsMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
