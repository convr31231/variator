import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServicePage } from './pages/ServicePage';
import { VariatorsPage } from './pages/VariatorsPage';
import { VariatorPage } from './pages/VariatorPage';
import { CasesPage } from './pages/CasesPage';
import { PricesPage } from './pages/PricesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactsPage } from './pages/ContactsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Analytics } from './components/Analytics';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <Analytics />
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="uslugi" element={<ServicesPage />} />
          <Route path="uslugi/:slug" element={<ServicePage />} />
          <Route path="variatory" element={<VariatorsPage />} />
          <Route path="variatory/:slug" element={<VariatorPage />} />
          <Route path="raboty" element={<CasesPage />} />
          <Route path="ceny" element={<PricesPage />} />
          <Route path="otzyvy" element={<ReviewsPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="kontakty" element={<ContactsPage />} />
          <Route path="politika-konfidencialnosti" element={<PrivacyPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </>
  );
}
