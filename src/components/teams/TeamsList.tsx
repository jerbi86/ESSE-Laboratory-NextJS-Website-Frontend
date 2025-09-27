import TeamCard from './TeamCard';
import { ResearchTeam } from '@/types/types';

export default function TeamsList({ teams, locale }: { teams: ResearchTeam[]; locale: string }) {
  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {locale === 'fr' ? 'Aucune équipe trouvée.' : 'No teams found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} locale={locale} />
        ))}
      </div>
    </div>
  );
}

