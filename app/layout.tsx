import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './novus.css';
import './polish.css';
import { cs } from './locales/cs';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: cs.metadata.title,
  description: cs.metadata.description,
  openGraph: { title: 'NOVUS', description: cs.metadata.socialDescription, images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'NOVUS', description: cs.metadata.socialDescription, images: ['/og.png'] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs-CZ">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
