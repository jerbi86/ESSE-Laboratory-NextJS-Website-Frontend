import fetchContentType from '@/lib/strapi/fetchContentType';
import Hero from '@/components/Hero';
import ProjectsList from '@/components/projects/ProjectsList';
import ClientSlugHandler from '../ClientSlugHandler';
import { Project } from '@/types/types';

interface ProjectsIndexProps {
  params: { locale: string };
}

export default async function ProjectsIndex({ params }: ProjectsIndexProps) {
  const { locale } = await params;

  const res = await fetchContentType('projects', {
    populate: {
      project_manager: { populate: '*' },
      research_team: { populate: '*' },
      localizations: { populate: '*' }
    },
    locale,
    pagination: { page: 1, pageSize: 500 },
  });

  const projects: Project[] = res?.data || [];

  const texts = locale === 'en'
    ? { title: 'Projects', subtitle: 'Discover our research projects' }
    : { title: 'Projets', subtitle: 'Découvrez nos projets de recherche' };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={{ en: 'projects', fr: 'projects' }} />
      <Hero title={texts.title} description={texts.subtitle} size="lg" />
      <ProjectsList projects={projects as any} locale={locale} />
    </main>
  );
}
