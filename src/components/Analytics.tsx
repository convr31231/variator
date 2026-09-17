import { useEffect } from 'react';
import { siteConfig } from '../data/site';

/**
 * Заготовки под аналитику.
 * Вставьте ID в src/data/site.ts — скрипты подключатся автоматически.
 */
export function Analytics() {
  useEffect(() => {
    const { yandexMetrikaId, googleAnalyticsId } = siteConfig.analytics;

    if (yandexMetrikaId) {
      const ymScript = document.createElement('script');
      ymScript.innerHTML = `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(${JSON.stringify(yandexMetrikaId)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true });
      `;
      document.head.appendChild(ymScript);
    }

    if (googleAnalyticsId) {
      const gtagSrc = document.createElement('script');
      gtagSrc.async = true;
      gtagSrc.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(gtagSrc);

      const gtagInline = document.createElement('script');
      gtagInline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${googleAnalyticsId}');
      `;
      document.head.appendChild(gtagInline);
    }
  }, []);

  return null;
}
