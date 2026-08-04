import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Themis - LexiGuard Compliance Navigator",
  description: "AI Compliance Navigator for Agricultural Export — Hệ thống hỗ trợ xuất khẩu nông sản đối soát pháp lý",
  keywords: ["compliance", "EUDR", "MRL", "export", "agriculture", "legal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f7f9fb] text-[#191c1e] antialiased">
        {children}
      </body>
    </html>
  );
}
