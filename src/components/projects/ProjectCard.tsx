import Link from 'next/link';
import { Project } from '@/types/types';

export default function ProjectCard({ project, locale }: { project: Project; locale: string }) {
  const href = `/${locale}/projects/${project.slug}`;
  const manager = project.project_manager ? `${project.project_manager.firstName} ${project.project_manager.lastName}`.trim() : null;
  const team = typeof project.research_team === 'object' && project.research_team ? (project.research_team as any).name : null;

  return (
    <Link href={href} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-[1.01] p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{project.name}</h3>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {manager && (
            <p><span className="font-medium">{locale === 'fr' ? 'Responsable' : 'Manager'}:</span> {manager}</p>
          )}
          {team && (
            <p><span className="font-medium">{locale === 'fr' ? 'Équipe' : 'Team'}:</span> {team}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

