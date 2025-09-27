import Link from 'next/link';
import { Publication } from '@/types/types';

function formatPublicationDate(dateStr?: string | null) {
  if (!dateStr) return null;

  // Year only: YYYY
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  // Year and month: YYYY-MM
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const [year, month] = dateStr.split('-').map(String);
    const monthIdx = Math.max(0, Math.min(11, Number(month) - 1));
    const monthNames = [
      'january','february','march','april','may','june','july','august','september','october','november','december'
    ];
    return `${monthNames[monthIdx]} ${year}`;
  }

  // Full date (ISO or parseable by Date)
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const monthNames = [
    'january','february','march','april','may','june','july','august','september','october','november','december'
  ];
  const month = monthNames[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

function compact(value?: string | null) {
  return value && String(value).trim().length > 0 ? String(value).trim() : null;
}

function toAbsoluteUrl(u?: string | null) {
  if (!u) return null;
  return u.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${u}` : u;
}

function extractPdfLinks(publication: Publication): string[] {
  const raw = publication.attachements?.associatedPDF as any;
  if (!raw) return [];
  if (typeof raw === 'string') {
    const u = toAbsoluteUrl(raw);
    return u ? [u] : [];
  }
  if (Array.isArray(raw)) {
    return raw
      .map((it) => toAbsoluteUrl(it?.url))
      .filter((v): v is string => Boolean(v));
  }
  // Object case
  const u = toAbsoluteUrl(raw?.url);
  return u ? [u] : [];
}

function renderAuthors(p: Publication, locale: string) {
  type AuthorEntry = { key: string; name: string; slug?: string };

  const memberAuthors: AuthorEntry[] = (p.members || [])
    .filter((m: any) => (typeof m?.locale === 'string' ? m.locale === 'fr' : true))
    .map((m: any) => ({ key: `m-${m.id}`, name: `${m.firstName} ${m.lastName}`.trim(), slug: m.slug }))
    .filter(a => a.name);

  const nonMemberAuthors: AuthorEntry[] = (p.non_members || [])
    .map((nm: any) => ({ key: `n-${nm.id}`, name: nm.fullName }))
    .filter(a => a.name);

  const authorNodes = [
    ...memberAuthors.map((a) => (
      <span key={a.key}>
        <Link href={`/${locale}/members/${a.slug}`} className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-400">{a.name}</Link>
      </span>
    )),
    ...nonMemberAuthors.map((a) => (
      <span key={a.key}>{a.name}</span>
    )),
  ];

  if (!authorNodes.length) return null;

  const editorLabel = authorNodes.length > 1 ? 'eds.' : 'ed.';

  return (
    <span>
      (
      {authorNodes.map((node, idx) => (
        <span key={(node as any).key || idx}>
          {node}
          {idx < authorNodes.length - 1 ? ' and ' : ''}
        </span>
      ))}
      , {editorLabel})
    </span>

  );
}

export default function PublicationLine({ publication, locale, yearHeading }: { publication: Publication; locale: string; yearHeading?: string }) {
  const title = compact(publication.title);
  const afterAuthorsParts: string[] = [];

  if (compact(publication.type?.name)) afterAuthorsParts.push(publication.type!.name!);
  if (compact(publication.publisher?.name)) afterAuthorsParts.push(publication.publisher!.name!);
  if (compact(publication.publisher?.volume)) afterAuthorsParts.push(`volume ${publication.publisher!.volume}`);
  const when = formatPublicationDate(publication.publisher?.date);
  if (when) afterAuthorsParts.push(when);

  const doi = compact(publication.attachements?.associatedDoi);
  const url = compact(publication.attachements?.associatedURL);
  const scholar = compact(publication.attachements?.associatedScholar);
  const pdfs = extractPdfLinks(publication);

  const authorsNode = renderAuthors(publication, locale);

  return (
    <div className="space-y-2">
      {yearHeading && (
        <div className="text-base md:text-lg font-semibold text-center text-gray-800 dark:text-gray-100 mt-6">{yearHeading}</div>
      )}
      <p className="text-gray-900 dark:text-white">
        {/* Title */}
        {title}
        {/* Separator before authors if title exists */}
        {authorsNode && title ? ', ' : ''}
        {/* Authors */}
        {authorsNode}
        {/* Separator before remaining parts */}
        {afterAuthorsParts.length > 0 && (title || authorsNode) ? ', ' : ''}
        {/* Remaining parts */}
        {afterAuthorsParts.join(', ')}
        {/* Period */}
        {(title || authorsNode || afterAuthorsParts.length) ? '.' : ''}
        {' '}
        {doi && (
          <Link href={doi} target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">[doi]</Link>
        )}
        {doi && (url || scholar || pdfs.length) ? ' ' : ''}
        {url && (
          <Link href={url} target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">[url]</Link>
        )}
        {url && (scholar || pdfs.length) ? ' ' : ''}
        {scholar && (
          <Link href={scholar} target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">[scholar]</Link>
        )}
        {scholar && pdfs.length ? ' ' : ''}
        {pdfs.map((p, i) => (
          <span key={`pdf-${i}`}>
            <Link href={p} target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">[pdf]</Link>
            {i < pdfs.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </div>
  );
}
