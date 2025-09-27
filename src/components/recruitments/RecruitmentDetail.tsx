import { Recruitment } from '@/types/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import CKEditorContent from '@/components/CKEditorContent';

export default function RecruitmentDetail({ recruitment, locale }: { recruitment: Recruitment; locale: string }) {
  const types = recruitment.recruitments_types || [];
  const backLabel = locale === 'fr' ? 'Retour aux recrutements' : 'Back to recruitments';
  const contentLabel = locale === 'fr' ? 'Description' : 'Description';
  const typesLabel = locale === 'fr' ? 'Types' : 'Types';

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/${locale}/recruitments`} className="text-sm text-blue-600 hover:underline">{backLabel}</Link>
      </div>

      {types.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {types.map(t => (
            <Badge key={t.id} variant="secondary" className="text-xs">{t.name}</Badge>
          ))}
        </div>
      )}

      <div className="prose max-w-none dark:prose-invert">
        <h2 className="text-xl font-semibold mb-4">{contentLabel}</h2>
        {recruitment.content && (
          <CKEditorContent content={recruitment.content} />
        )}
      </div>
    </div>
  );
}
