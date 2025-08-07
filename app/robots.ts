import type { MetadataRoute } from 'next'
import { baseUrl } from '@/shared/consts'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/crypto-exchangers/*page=',
        '/api/',
        '/admin/',
        '/private/',
      ],
    },
    sitemap: `${baseUrl}/sitemap-index.xml`,
    host: baseUrl,
  }
} 