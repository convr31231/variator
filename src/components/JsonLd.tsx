import { useEffect } from 'react';
import { siteConfig } from '../data/site';

export function JsonLd() {
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': ['AutoRepair', 'LocalBusiness'],
      name: siteConfig.shortName,
      description: siteConfig.tagline,
      url: siteConfig.baseUrl,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        postalCode: siteConfig.address.postalCode,
        addressCountry: 'RU',
        addressRegion: siteConfig.region,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.geo.lat,
        longitude: siteConfig.geo.lng,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          description: siteConfig.workingHours.weekdays,
        },
      ],
      areaServed: {
        '@type': 'City',
        name: siteConfig.city,
      },
      priceRange: '₽₽',
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'local-business-jsonld';
    script.text = JSON.stringify(data);
    document.getElementById('local-business-jsonld')?.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById('local-business-jsonld')?.remove();
    };
  }, []);

  return null;
}
