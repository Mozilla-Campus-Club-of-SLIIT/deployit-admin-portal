import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deploy(it) Admin Portal",
  description: "DevOps Lab Management System",
};

import AuthGuard from "@/components/AuthGuard";
import LayoutContent from "@/components/LayoutContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <LayoutContent>
            {children}
          </LayoutContent>
        </AuthGuard>
      </body>
    </html>
  );
}
