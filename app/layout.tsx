import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'College Discovery Platform',
  description: 'Search, compare, and explore top colleges in India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
