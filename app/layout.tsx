import type { Metadata, Viewport } from 'next';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://edencloudix.tech'),
  title: {
    default: 'EdenCloudix Technologies — AI • Full-Stack • Cloud Engineering',
    template: '%s | EdenCloudix Technologies',
  },
  description:
    'EdenCloudix Technologies designs and delivers enterprise-grade AI solutions, high-performance full-stack web applications, and scalable cloud engineering architectures.',
  keywords: [
    'AI Solutions',
    'Full-Stack Development',
    'Cloud Engineering',
    'AWS Cloud Architecture',
    'Next.js Development',
    'PostgreSQL & Prisma',
    'EdenCloudix Technologies',
    'Machine Learning Pipelines',
    'DevOps Automation',
  ],
  authors: [{ name: 'EdenCloudix Technologies', url: 'https://edencloudix.tech' }],
  creator: 'EdenCloudix Technologies',
  publisher: 'EdenCloudix Technologies',
  alternates: {
    canonical: 'https://edencloudix.tech',
  },
  openGraph: {
    title: 'EdenCloudix Technologies — Building Smart Solutions for a Smarter Tomorrow',
    description:
      'Premier software engineering consultancy delivering AI, Full-Stack, and Cloud infrastructure solutions.',
    url: 'https://edencloudix.tech',
    siteName: 'EdenCloudix Technologies',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 800,
        alt: 'EdenCloudix Technologies Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EdenCloudix Technologies',
    description: 'AI • Full-Stack Development • Cloud Engineering',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export const viewport: Viewport = {
  themeColor: '#020409',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'EdenCloudix Technologies',
    url: 'https://edencloudix.tech',
    logo: 'https://edencloudix.tech/logo.jpeg',
    image: 'https://edencloudix.tech/logo.jpeg',
    description:
      'EdenCloudix Technologies builds advanced AI solutions, full-stack software, and scalable cloud engineering architectures.',
    email: 'admin@edencloudix.tech',
    sameAs: [
      'https://github.com/deransiyadorinj',
      'https://www.linkedin.com/in/deransiya-dorin-j-a63185353',
      'https://www.instagram.com/edencloudixtechnologies',
    ],
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Engineering Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Solutions & LLM Workflows',
            description: 'Custom AI models, natural language processing, cognitive vision pipelines, and intelligent automation.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Full-Stack Web & Mobile Development',
            description: 'Modern, high-performance web applications built with Next.js, TypeScript, PostgreSQL, and reactive UI architectures.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cloud & Infrastructure Engineering',
            description: 'Scalable AWS cloud architecture, container orchestration, Kubernetes, CI/CD automation, and multi-region resilience.',
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
