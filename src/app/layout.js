import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";

// app/layout.js
import Script from "next/script";
import Footer from "@/components/Footer/Footer";
import WipBanner from "@/components/WipBanner/WipBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Callum Harrod - Personal Site",
  description: "My little nook on the internet. I also make things.",
  openGraph: {
    title: "Callum Harrod - Personal Site",
    description: "My little nook on the internet. I also make things.",
    url: "https://callumharrod.com", // Replace with your actual URL
    type: "website",
    images: [
      {
        url: "https://callumharrod.com/images/social-thumb.png", // Absolute URL for the social share image
        width: 1200,
        height: 630,
        alt: "Callum Harrod - Personal Site",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Callum Harrod - Personal Site",
    description: "My little nook on the internet. I also make things.",
    images: ["https://callumharrod.com/images/social-thumb.png"], // Absolute URL for the social share image
  },
  icons: {
    icon: "/favicon.svg", // Path to your favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative overflow-hidden bg-[#f5f5f5] font-satoshi text-[#484848]">
          <div aria-hidden="true" className="noise-overlay" />
          <div aria-hidden="true" className="blinds-overlay" />
          <WipBanner />
          <div className="flex w-full max-w-[1440px] flex-col pb-[160px] pt-10 mx-auto relative z-10">
            <div className="mx-10 gap-[240px] flex flex-col pt-8">
              <Navigation />
              {children}
              <Footer />
            </div>
          </div>
        </div>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
