import type { Metadata } from "next";
import { Inter, Fascinate_Inline } from "next/font/google";
import "./globals.css";

const fascinate = Fascinate_Inline({
  weight: "400",
  variable: "--font-fascinate",
  subsets: ["latin"]
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SimpleAnalyst",
  description: "Text analysis made simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fascinate.variable} ${inter.variable} antialiased`}>
      <body className="text-foreground font-sans [interpolate-size:allow-keywords]">
        <div className="fixed inset-0 h-screen grid grid-rows-[1fr_auto] bg-radial-[at_center_bottom] from-faded from-30% to-background overflow-auto">
          {children}
          <footer className="flex justify-between px-8 py-4"> 
            <small>Project created by Biaca et al. All rights reserved.</small>
            <small>&copy; SimpleAnalyst 2025</small>
          </footer>
        </div>
      </body>
    </html>
  );
}
