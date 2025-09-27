"use client";

import { useMemo, useState } from 'react';
import { Publication } from '@/types/types';
import PublicationLine from '@/components/publications/PublicationLine';
import { Button } from '@/components/ui/button';

function parseDate(value?: string | null): number {
  if (!value) return -Infinity; // place unknown dates at the end
  // YYYY
  if (/^\d{4}$/.test(value)) return new Date(`${value}-01-01`).getTime();
  // YYYY-MM
  if (/^\d{4}-\d{2}$/.test(value)) return new Date(`${value}-01`).getTime();
  // Fallback
  const d = new Date(value);
  return isNaN(d.getTime()) ? -Infinity : d.getTime();
}

function extractYear(value?: string | null): string | null {
  if (!value) return null;
  if (/^\d{4}$/.test(value)) return value;
  if (/^\d{4}-/.test(value)) return value.slice(0, 4);
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : String(d.getFullYear());
}

export default function PublicationsList({ publications, locale }: { publications: Publication[]; locale: string }) {
  const [selectedType, setSelectedType] = useState<string>('__all__');

  const texts = useMemo(() => (
    locale === 'en'
      ? { all: 'All', filterLabel: 'Filter by type', empty: 'No publications yet.' }
      : { all: 'Tous', filterLabel: 'Filtrer par type', empty: 'Aucune publication pour le moment.' }
  ), [locale]);

  const types = useMemo(() => {
    const set = new Set<string>();
    publications?.forEach(p => { if (p.type?.name) set.add(p.type.name); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [publications]);

  const filtered = useMemo(() => {
    const base = Array.isArray(publications) ? publications.slice() : [];
    base.sort((a, b) => parseDate(b.publisher?.date) - parseDate(a.publisher?.date)); // desc
    if (selectedType === '__all__') return base;
    return base.filter(p => (p.type?.name || '') === selectedType);
  }, [publications, selectedType]);

  if (!publications || publications.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">{texts.empty}</p>;
  }

  return (
    <div className="space-y-4">
      {types.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-300">{texts.filterLabel}:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedType === '__all__' ? 'default' : 'outline'}
              onClick={() => setSelectedType('__all__')}
            >
              {texts.all}
            </Button>
            {types.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={selectedType === t ? 'default' : 'outline'}
                onClick={() => setSelectedType(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {(() => {
          let lastYear: string | null = null;
          return filtered.map((p) => {
            const year = extractYear(p.publisher?.date);
            const yearHeading = year && year !== lastYear ? year : undefined;
            if (yearHeading) lastYear = year!;
            return (
              <li key={p.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <PublicationLine publication={p} locale={locale} yearHeading={yearHeading} />
              </li>
            );
          });
        })()}
      </ul>
    </div>
  );
}
