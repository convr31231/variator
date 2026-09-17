import { Seo } from '../components/Seo';
import { Hero } from '../components/Hero';
import { Symptoms } from '../components/Symptoms';
import { Urgency } from '../components/Urgency';
import { Services } from '../components/Services';
import { Variators } from '../components/Variators';
import { Process } from '../components/Process';
import { Prices } from '../components/Prices';
import { Cases } from '../components/Cases';
import { Advantages } from '../components/Advantages';
import { Reviews } from '../components/Reviews';
import { FAQ } from '../components/FAQ';
import { CTA } from '../components/CTA';
import { Contacts } from '../components/Contacts';

export function HomePage() {
  return (
    <>
      <Seo
        title="Ремонт вариаторов во Владивостоке"
        description="Диагностика и ремонт вариаторов во Владивостоке: выясняем причину, согласуем стоимость, ремонтируем и проверяем автомобиль. Запись на диагностику."
        path="/"
      />
      <Hero />
      <Symptoms />
      <Urgency />
      <Services />
      <Variators />
      <Process />
      <Prices />
      <Cases />
      <Advantages />
      <Reviews />
      <FAQ limit={5} />
      <CTA />
      <Contacts />
    </>
  );
}
