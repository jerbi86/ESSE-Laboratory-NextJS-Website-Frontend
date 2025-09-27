import { notFound } from 'next/navigation';
import fetchTeamBySlug from '@/lib/strapi/fetchTeamBySlug';
import { ResearchTeam } from '@/types/types';
import TeamDetail from '@/components/teams/TeamDetail';
import Hero from '@/components/Hero';
import ClientSlugHandler from '../../ClientSlugHandler';

interface TeamPageProps {
  params: { locale: string; slug: string };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale, slug } = await params;
  const team: ResearchTeam | null = await fetchTeamBySlug(slug, locale);

  if (!team) {
    notFound();
  }

  // Créer les slugs localisés pour le ClientSlugHandler
  const localizedSlugs =
    team.localizations?.reduce((acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    }, { [locale]: slug }) || { [locale]: slug };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <Hero title={team.name} size="lg" />
      <TeamDetail team={team} locale={locale} />
    </main>
  );
}

export async function generateMetadata({ params }: TeamPageProps) {
  const { locale, slug } = await params;
  const team = await fetchTeamBySlug(slug, locale);

  if (!team) {
    return { title: 'Team Not Found' } as any;
  }

  return {
    title: team.name,
    description: team.content ? team.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
  } as any;
}
