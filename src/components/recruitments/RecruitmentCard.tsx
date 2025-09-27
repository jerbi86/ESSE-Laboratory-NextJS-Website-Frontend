import Link from 'next/link';
import { Recruitment } from '@/types/types';
import { Badge } from '@/components/ui/badge';

export default function RecruitmentCard({ recruitment, locale }: { recruitment: Recruitment; locale: string }) {
  const href = `/${locale}/recruitments/${recruitment.slug}`;
  const types = recruitment.recruitments_types || [];
  const plainText = recruitment.content
    ? recruitment.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const excerpt = plainText.length > 180 ? plainText.slice(0, 177) + '…' : plainText;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-shadow">
      <div className="p-5 flex flex-col h-full">
        <div className="flex flex-wrap gap-2 mb-3">
          {types.map(t => (
            <Badge key={t.id} variant="secondary" className="text-xs">{t.name}</Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={href}>{recruitment.title}</Link>
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 mb-4">{excerpt}</p>
        )}
        <div className="mt-auto">
          <Link href={href} className="text-sm font-medium text-blue-600 hover:underline">
            {locale === 'fr' ? 'Voir plus' : 'Read more'} →
          </Link>
        </div>
      </div>
    </div>
  );
}

