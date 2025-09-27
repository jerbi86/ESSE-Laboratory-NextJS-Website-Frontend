import ProjectCard from './ProjectCard';
import { Project } from '@/types/types';

export default function ProjectsList({ projects, locale }: { projects: Project[]; locale: string }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {locale === 'fr' ? 'Aucun projet trouvé.' : 'No projects found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </div>
  );
}

