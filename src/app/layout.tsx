import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { DatabaseProvider } from "@/context/DatabaseContext";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OneHope | Hope Starts With One",
  description: "OneHope is an international-level humanitarian platform dedicated to helping children, families, and disaster zones with honesty, transparency, and dignity from Rishikesh, India.",
  keywords: "Rishikesh charity, charity India, help children, emergency relief, transparent charity, become volunteer, OneHope",
  authors: [{ name: "OneHope Team", url: "https://onehope.in" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://onehope.in",
    title: "OneHope | Hope Starts With One",
    description: "An international-level humanitarian platform helping people with honesty, transparency, dignity and compassion.",
    siteName: "OneHope",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <DatabaseProvider>
          {children}
        </DatabaseProvider>
      </body>
    </html>
  );
}
