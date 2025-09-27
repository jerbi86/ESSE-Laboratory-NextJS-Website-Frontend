import fetchContentType from '@/lib/strapi/fetchContentType';
import Hero from '@/components/Hero';
import ClientSlugHandler from '../ClientSlugHandler';
import RecruitmentsList from '@/components/recruitments/RecruitmentsList';
import { Recruitment } from '@/types/types';

interface RecruitmentsIndexProps { params: { locale: string } }

export default async function RecruitmentsIndex({ params }: RecruitmentsIndexProps) {
  const { locale } = await params;

  const res = await fetchContentType('recruitments', {
    populate: {
      recruitments_types: { populate: '*' },
      localizations: { populate: '*' }
    },
    locale,
    pagination: { page: 1, pageSize: 100 }
  });

  const recruitments: Recruitment[] = res?.data || [];

  const texts = locale === 'en'
    ? { title: 'Recruitments', subtitle: 'Discover all current opportunities', empty: 'No recruitments available.' }
    : { title: 'Recrutements', subtitle: 'Découvrez toutes les opportunités actuelles', empty: 'Aucun recrutement disponible.' };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={{ en: 'recruitments', fr: 'recruitments' }} />
      <Hero title={texts.title} description={texts.subtitle} size="lg" />
      <section className="container mx-auto max-w-5xl px-4 py-12">
        <RecruitmentsList recruitments={recruitments} locale={locale} emptyLabel={texts.empty} />
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: RecruitmentsIndexProps) {
  const { locale } = await params;
  const title = locale === 'en' ? 'Recruitments' : 'Recrutements';
  const description = locale === 'en' ? 'Discover all current opportunities' : 'Découvrez toutes les opportunités actuelles';
  return { title, description, openGraph: { title, description } };
}
