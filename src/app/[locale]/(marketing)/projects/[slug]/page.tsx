import { notFound } from 'next/navigation';
import fetchProjectBySlug from '@/lib/strapi/fetchProjectBySlug';
import { Project } from '@/types/types';
import ProjectDetail from '@/components/projects/ProjectDetail';
import Hero from '@/components/Hero';
import ClientSlugHandler from '../../ClientSlugHandler';

interface ProjectPageProps {
  params: { locale: string; slug: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const project: Project | null = await fetchProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  // Créer les slugs localisés pour le ClientSlugHandler
  const localizedSlugs = project.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  ) || { [locale]: slug };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <Hero title={project.name} size="lg" />
      <ProjectDetail project={project} locale={locale} />
    </main>
  );
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { locale, slug } = await params;
  const project = await fetchProjectBySlug(slug, locale);

  if (!project) {
    return { title: 'Project Not Found' } as any;
  }

  return {
    title: project.name,
    description: project.content ? project.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
  } as any;
}
