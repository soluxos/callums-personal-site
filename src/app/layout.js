import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";
import DitherOverlay from "@/components/DitherOverlay/DitherOverlay";
import PageTransition from "@/components/PageTransition/PageTransition";
import LivePresence from "@/components/LivePresence/LivePresence";
import MatCuts from "@/components/CuttingMat/MatCuts";
import DraggableCanvas from "@/components/DraggableCanvas/DraggableCanvas";
import EditModeProvider from "@/contexts/EditModeContext";

// app/layout.js
import Script from "next/script";
import SiteShell from "@/components/SiteShell/SiteShell";
import ConditionalFooter from "@/components/ConditionalFooter/ConditionalFooter";
import PageWrapper from "@/components/PageWrapper/PageWrapper";
import WipBanner from "@/components/WipBanner/WipBanner";
import { PasswordGateProvider } from "@/contexts/PasswordGateContext";
import { SITE_URL, pageMetadata } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// What a search result or a shared link shows. Written for a recruiter or hiring
// manager seeing the link out of context, so it says what I do and what I've done.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: "Callum Harrod · Design lead & design engineer",
    description:
      "Design lead at Acquia and a design engineer who builds in code. I led design on Drupal Canvas, now on 13,000+ sites, and rebuilt Site Studio in React with one other engineer.",
  }),
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteShell>
          <EditModeProvider>
            <PasswordGateProvider>
              <DraggableCanvas>
                <div id="page-content">
                  {/* <div aria-hidden="true" className="noise-overlay" /> */}
                  {/* <DitherOverlay opacity="0.6" /> */}
                  {/* <WipBanner /> */}
                  <PageWrapper>
                    <Navigation />
                    <PageTransition>{children}</PageTransition>
                    <ConditionalFooter />
                  </PageWrapper>
                </div>
                <LivePresence />
                <MatCuts />
              </DraggableCanvas>
            </PasswordGateProvider>
          </EditModeProvider>
        </SiteShell>
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
