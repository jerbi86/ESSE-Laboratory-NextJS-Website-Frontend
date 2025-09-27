import Link from 'next/link';
import { Project } from '@/types/types';
import CKEditorContent from '@/components/CKEditorContent';

export default function ProjectDetail({ project, locale }: { project: Project; locale: string }) {
  const manager = project.project_manager ? `${project.project_manager.firstName} ${project.project_manager.lastName}`.trim() : null;
  const team = project.research_team && typeof project.research_team === 'object' ? (project.research_team as any) : null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {manager && (
            <p>
              <span className="font-medium">{locale === 'fr' ? 'Responsable' : 'Manager'}:</span>{' '}
              <Link href={`/${locale}/members/${project.project_manager!.slug}`} className="underline font-semibold hover:text-blue-600">
                {manager}
              </Link>
            </p>
          )}
          {team && (
            <p>
              <span className="font-medium">{locale === 'fr' ? 'Équipe' : 'Team'}:</span>{' '}
              <Link href={`/${locale}/teams/${team.slug}`} className="underline font-semibold hover:text-blue-600">
                {team.name}
              </Link>
            </p>
          )}
        </div>
      </header>

      {project.content && (
        <CKEditorContent content={project.content} />
      )}
    </article>
  );
}
