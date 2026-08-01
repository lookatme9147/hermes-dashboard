import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hermes Agent Dashboard',
  description: 'Multi-Agent Orchestration & Control Dashboard for Hermes Agent',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
