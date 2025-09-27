import { notFound } from 'next/navigation';
import fetchRecruitmentBySlug from '@/lib/strapi/fetchRecruitmentBySlug';
import ClientSlugHandler from '../../ClientSlugHandler';
import Hero from '@/components/Hero';
import RecruitmentDetail from '@/components/recruitments/RecruitmentDetail';
import { Recruitment } from '@/types/types';

interface RecruitmentPageProps { params: { locale: string; slug: string } }

export default async function RecruitmentPage({ params }: RecruitmentPageProps) {
  const { locale, slug } = await params;

  const recruitment: Recruitment | null = await fetchRecruitmentBySlug(slug, locale);
  if (!recruitment) {
    notFound();
  }

  // Construire les slugs localisés
  const localizedSlugs = recruitment?.localizations?.reduce((acc: Record<string,string>, loc) => {
    acc[loc.locale] = loc.slug;
    return acc;
  }, { [locale]: slug }) || { [locale]: slug };

  const types = recruitment?.recruitments_types?.map(t => t.name).join(' • ');
  const subtitle = types || (locale === 'fr' ? 'Opportunité' : 'Opportunity');

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <Hero title={recruitment!.title} description={subtitle} size="lg" />
      <section className="container mx-auto max-w-4xl px-4 py-12">
        <RecruitmentDetail recruitment={recruitment!} locale={locale} />
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: RecruitmentPageProps) {
  const { locale, slug } = await params;
  const recruitment = await fetchRecruitmentBySlug(slug, locale);
  if (!recruitment) {
    return { title: locale === 'fr' ? 'Recrutement introuvable' : 'Recruitment not found' };
  }
  const plain = recruitment.content ? recruitment.content.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim() : '';
  const description = plain.slice(0,160);
  return { title: recruitment.title, description, openGraph: { title: recruitment.title, description } };
}
