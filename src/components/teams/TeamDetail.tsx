import Link from 'next/link';
import { ResearchTeam } from '@/types/types';
import MemberCard from '@/components/members/MemberCard';
import ProjectCard from '@/components/projects/ProjectCard';
import CKEditorContent from '@/components/CKEditorContent';

export default function TeamDetail({ team, locale }: { team: ResearchTeam; locale: string }) {
  const leader = team.team_leader ? `${team.team_leader.firstName} ${team.team_leader.lastName}`.trim() : null;

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team.name}</h1>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {leader && team.team_leader && (
            <p>
              <span className="font-medium">{locale === 'fr' ? "Chef d'équipe" : 'Team leader'}:</span>{' '}
              <Link href={`/${locale}/members/${team.team_leader.slug}`} className="underline font-semibold hover:text-blue-600">
                {leader}
              </Link>
            </p>
          )}
          <p>
            <span className="font-medium">{locale === 'fr' ? 'Membres' : 'Members'}:</span>{' '}
            {team.members?.length ?? 0}
          </p>
          <p>
            <span className="font-medium">{locale === 'fr' ? 'Projets' : 'Projects'}:</span>{' '}
            {team.projects?.length ?? 0}
          </p>
        </div>
      </header>

      {team.content && (
        <CKEditorContent content={team.content} className="mb-10" />
      )}

      {team.members && team.members.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{locale === 'fr' ? 'Membres' : 'Members'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.members.map((m) => (
              <MemberCard key={m.id} member={m as any} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {team.projects && team.projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{locale === 'fr' ? 'Projets' : 'Projects'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.projects.map((p) => (
              <ProjectCard key={p.id} project={p as any} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
