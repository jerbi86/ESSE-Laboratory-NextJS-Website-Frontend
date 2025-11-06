import fetchEventBySlug from "@/lib/strapi/fetchEventBySlug";
import EventDetail from "@/components/events/EventDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Event } from "@/types/types";

type EventsPageParams = {
  locale: string;
  slug: string;
};

interface EventsPageProps {
  // TS trick to satisfy Next's PageProps constraint (params: Promise<any>)
  params: Promise<EventsPageParams>;
}

export default async function EventsPage({ params }: EventsPageProps) {
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

export async function generateMetadata(
  { params }: EventsPageProps
): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await fetchEventBySlug(slug, locale);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: event.title,
    description: event.content
      ? event.content.replace(/<[^>]*>/g, "").substring(0, 160)
      : "",
  };
}
