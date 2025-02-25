import { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'yta',
  description: 'fast youtube video to mp4 converter',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1c1c1c] text-[#f1f1f1] font-mono">
        {children}
      </body>
    </html>
  );
}