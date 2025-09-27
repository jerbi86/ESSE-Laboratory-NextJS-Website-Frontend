import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { MemberProfile } from '@/types/types';
import { strapiImage } from '@/lib/strapi/strapiImage';
import PublicationsList from '@/components/publications/PublicationsList';
import CKEditorContent from '@/components/CKEditorContent';

export default function MemberDetail({ member, locale }: { member: MemberProfile; locale: string }) {
  const fullName = `${member.firstName} ${member.lastName}`.trim();
  const imgUrl = member.image?.formats?.medium?.url
    || member.image?.formats?.small?.url
    || member.image?.formats?.thumbnail?.url
    || member.image?.url;

  const t = (k: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        role: 'Roles',
        contact: 'Contact',
        email: 'Email',
        phone: 'Phone',
        bio: 'Biography',
        publications: 'Publications',
        noPublications: 'No publications yet.'
      },
      fr: {
        role: 'Rôles',
        contact: 'Contact',
        email: 'Email',
        phone: 'Téléphone',
        bio: 'Biographie',
        publications: 'Publications',
        noPublications: 'Aucune publication pour le moment.'
      },
    };
    return (dict[locale] || dict.fr)[k] || k;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            {imgUrl && (
              <Image src={strapiImage(imgUrl)} alt={member.image?.alternativeText || fullName} fill className="object-cover" />
            )}
          </div>
          <h2 className="mt-4 text-center text-xl font-semibold text-gray-900 dark:text-white">{fullName}</h2>
          {member.members_roles?.length ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {member.members_roles.map((r, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{r.name}</Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t('contact')}</h3>
          <ul className="space-y-2 text-sm">
            {member.email && (
              <li>
                <span className="font-medium">{t('email')}:</span>{' '}
                <Link href={`mailto:${member.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{member.email}</Link>
              </li>
            )}
            {member.phone_number && (
              <li>
                <span className="font-medium">{t('phone')}:</span>{' '}
                <span className="text-gray-700 dark:text-gray-200">{member.phone_number}</span>
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:col-span-2 space-y-8">
        {member.biography && (
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">{t('bio')}</h3>
            <CKEditorContent content={member.biography} />
          </section>
        )}

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{t('publications')}</h3>
          <PublicationsList publications={member.publications || []} locale={locale} />
        </section>
      </div>
    </div>
  );
}
