import type {Metadata} from 'next';
import {Syne, DM_Sans, Playfair_Display} from 'next/font/google';
import './globals.css'; // Global styles

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'FLEX – Fitness Tracker',
  description: 'Personalized postural correction and fitness tracker.',
  icons: {
    icon: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${playfairDisplay.variable}`}>
      <body className="bg-[#0A0A0A] text-[#F5F5F0] antialiased min-h-screen font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
