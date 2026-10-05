"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/ideas")) return null;
  return <Footer />;
}
