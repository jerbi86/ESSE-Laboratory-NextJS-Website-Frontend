import fetchEventBySlug from "@/lib/strapi/fetchEventBySlug";
import EventDetail from "@/components/events/EventDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Event } from "@/types/types";

interface EventPageParams {
  locale: string;
  slug: string;
}

interface EventPageProps {
  params: EventPageParams;
}

export default async function EventPage({ params }: EventPageProps) {
  const { locale, slug } = params;

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
  { params }: EventPageProps
): Promise<Metadata> {
  const { locale, slug } = params;
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
