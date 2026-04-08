import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // โหลด font เร็วขึ้น ไม่บล็อก render
});

export const metadata = {
  title: "SmartPersona - สร้าง Resume ออนไลน์",
  description: "สร้าง Resume และ Portfolio สวยงาม ง่ายดาย และโดนเด่น ด้วย SmartPersona",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
