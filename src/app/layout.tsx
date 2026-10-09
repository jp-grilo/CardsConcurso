import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CardsConcurso",
  description: "Plataforma de simulados e estudos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: '32px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
