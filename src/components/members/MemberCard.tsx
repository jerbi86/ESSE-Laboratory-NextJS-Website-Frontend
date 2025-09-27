import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MemberProfile } from '@/types/types';

export default function MemberCard({ member, locale }: { member: MemberProfile; locale: string }) {
  const fullName = `${member.firstName} ${member.lastName}`.trim();
  const href = `/${locale}/members/${member.slug}`;
  const raw = member.image?.formats?.small?.url || member.image?.formats?.thumbnail?.url || member.image?.url;
  const imgUrl = raw && raw.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${raw}` : raw;

  return (
    <Link href={href} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-[1.01] p-5">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={member.image?.alternativeText || fullName}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-base font-medium text-gray-500">
                {member.firstName?.[0]?.toUpperCase()}{member.lastName?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {fullName}
            </h3>
            {member.members_roles && member.members_roles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {member.members_roles.slice(0, 3).map((r, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[11px]">{r.name}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
