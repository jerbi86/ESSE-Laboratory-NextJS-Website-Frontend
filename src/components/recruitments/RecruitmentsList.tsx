'use client';

import { useMemo, useState } from 'react';
import { Recruitment } from '@/types/types';
import RecruitmentCard from './RecruitmentCard';
import { Button } from '@/components/ui/button';

interface RecruitmentsListProps {
  recruitments: Recruitment[];
  locale: string;
  emptyLabel?: string;
}

export default function RecruitmentsList({ recruitments, locale, emptyLabel }: RecruitmentsListProps) {
  const [selectedType, setSelectedType] = useState<string>('__all__');

  const texts = useMemo(() => (
    locale === 'fr'
      ? { all: 'Tous', filter: 'Filtrer par type' }
      : { all: 'All', filter: 'Filter by type' }
  ), [locale]);

  const types = useMemo(() => {
    const set = new Set<string>();
    recruitments?.forEach(r => r.recruitments_types?.forEach(t => t.name && set.add(t.name)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [recruitments]);

  const filtered = useMemo(() => {
    const arr = Array.isArray(recruitments) ? [...recruitments] : [];
    // tri par date de création desc
    arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (selectedType === '__all__') return arr;
    return arr.filter(r => r.recruitments_types?.some(t => t.name === selectedType));
  }, [recruitments, selectedType]);

  if (!recruitments || recruitments.length === 0) {
    return <p className="text-center text-gray-500 py-12">{emptyLabel || (locale === 'fr' ? 'Aucun recrutement disponible.' : 'No recruitments available.')}</p>;
  }

  return (
    <div className="space-y-8">
      {types.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">{texts.filter}:</span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={selectedType === '__all__' ? 'default' : 'outline'} onClick={() => setSelectedType('__all__')}>{texts.all}</Button>
            {types.map(t => (
              <Button key={t} size="sm" variant={selectedType === t ? 'default' : 'outline'} onClick={() => setSelectedType(t)}>{t}</Button>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(r => <RecruitmentCard key={r.id} recruitment={r} locale={locale} />)}
      </div>
    </div>
  );
}

