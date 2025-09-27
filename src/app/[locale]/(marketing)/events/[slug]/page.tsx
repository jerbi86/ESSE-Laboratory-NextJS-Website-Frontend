import fetchEventBySlug from "@/lib/strapi/fetchEventBySlug";
import EventDetail from '@/components/events/EventDetail';
import { notFound } from 'next/navigation';
import { Event } from '@/types/types';

interface EventPageProps {
  params: { locale: string; slug: string };
}

export default async function EventPage({ params }: EventPageProps) {
  const { locale, slug } = await params;

  const event: Event | null = await fetchEventBySlug(slug, locale);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <EventDetail event={event} locale={locale} />
    </main>
  );
}

export async function generateMetadata({ params }: EventPageProps) {
  const { locale, slug } = await params;
  const event = await fetchEventBySlug(slug, locale);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: event.title,
    description: event.content ? event.content.replace(/<[^>]*>/g, '').substring(0, 160) : '',
  };
}
