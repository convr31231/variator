import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../data/site';

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
};

export function Seo({
  title,
  description,
  path = '/',
  type = 'website',
  noindex = false,
}: SeoProps) {
  const url = `${siteConfig.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const fullTitle = title.includes(siteConfig.shortName)
    ? title
    : `${title} — ${siteConfig.shortName}`;

  return (
    <Helmet>
      <html lang="ru" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content={siteConfig.shortName} />
      <meta property="og:image" content={`${siteConfig.baseUrl}/og-default.svg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {siteConfig.analytics.yandexWebmasterVerification && (
        <meta
          name="yandex-verification"
          content={siteConfig.analytics.yandexWebmasterVerification}
        />
      )}
      {siteConfig.analytics.googleSearchConsoleVerification && (
        <meta
          name="google-site-verification"
          content={siteConfig.analytics.googleSearchConsoleVerification}
        />
      )}
    </Helmet>
  );
}
