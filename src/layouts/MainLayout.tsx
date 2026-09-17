import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileActionBar } from '../components/MobileActionBar';
import { JsonLd } from '../components/JsonLd';

export function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <JsonLd />
      <Header />
      <main className="main-with-bar">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
