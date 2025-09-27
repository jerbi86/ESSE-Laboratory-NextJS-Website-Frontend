import Link from 'next/link';
import { ResearchTeam } from '@/types/types';

export default function TeamCard({ team, locale }: { team: ResearchTeam; locale: string }) {
  const href = `/${locale}/teams/${team.slug}`;
  const leader = team.team_leader ? `${team.team_leader.firstName} ${team.team_leader.lastName}`.trim() : null;
  const membersCount = team.members?.length || 0;

  return (
    <Link href={href} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-[1.01] p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{team.name}</h3>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {leader && (
            <p>
              <span className="font-medium">{locale === 'fr' ? 'Chef d\'équipe' : 'Team leader'}:</span>{' '}
              <span className="underline font-semibold group-hover:text-blue-600">{leader}</span>
            </p>
          )}
          <p>
            <span className="font-medium">{locale === 'fr' ? 'Membres' : 'Members'}:</span>{' '}
            {membersCount}
          </p>
        </div>
      </div>
    </Link>
  );
}

