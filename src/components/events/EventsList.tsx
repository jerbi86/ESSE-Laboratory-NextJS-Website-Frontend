'use client';

import { Event } from '@/types/types';
import EventCard from './EventCard';

interface EventsListProps {
  events: Event[];
  locale: string;
}

export default function EventsList({ events, locale }: EventsListProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {locale === 'fr' 
            ? 'Aucun événement trouvé.' 
            : 'No events found.'
          }
        </p>
      </div>
    );
  }

  // Séparer les événements passés et à venir
  const now = new Date();
  const upcomingEvents = events.filter(event => new Date(event.date) >= now);
  const pastEvents = events.filter(event => new Date(event.date) < now);

  // Trier les événements à venir par date croissante
  upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Trier les événements passés par date décroissante
  pastEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {locale === 'fr' ? 'Événements à venir' : 'Upcoming Events'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {locale === 'fr' ? 'Événements passés' : 'Past Events'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
