import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Sentinals — Intelligent Monitoring Platform',
        template: '%s | Sentinals',
    },
    description:
        'AI-powered monitoring and observability platform. Get intelligent alerts, real-time insights, and proactive incident detection for your infrastructure.',
    keywords: ['monitoring', 'observability', 'AI', 'alerts', 'infrastructure', 'SaaS'],
    authors: [{ name: 'Sentinals' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://sentinals.app',
        siteName: 'Sentinals',
        title: 'Sentinals — Intelligent Monitoring Platform',
        description:
            'AI-powered monitoring and observability platform. Get intelligent alerts, real-time insights, and proactive incident detection.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sentinals — Intelligent Monitoring Platform',
        description: 'AI-powered monitoring and observability for your infrastructure.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
