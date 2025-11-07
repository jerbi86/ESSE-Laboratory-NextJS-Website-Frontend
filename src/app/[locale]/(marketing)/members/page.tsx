import fetchContentType from "@/lib/strapi/fetchContentType";
import ClientSlugHandler from "../ClientSlugHandler";
import Hero from "@/components/Hero";
import NewsPagination from "@/components/NewsPagination";
import MemberCard from "@/components/members/MemberCard";
import { MemberProfile } from "@/types/types";
import type { Metadata } from "next";

type MembersIndexParams = {
  locale: string;
};

type MembersIndexSearchParams = {
  page?: string;
};

interface MembersIndexProps {
  // Match Next's PageProps constraint
  params: Promise<MembersIndexParams>;
  searchParams?: Promise<MembersIndexSearchParams>;
}

export default async function MembersIndex({
  params,
  searchParams,
}: MembersIndexProps) {
  const { locale } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  const currentPage = parseInt(resolvedSearch.page || "1", 10);
  const pageSize = 12;

  const res = await fetchContentType("user-profiles", {
    populate: {
      image: { populate: "*" },
      members_roles: { populate: "*" },
    },
    locale,
    sort: ["rank:asc", "lastName:asc", "firstName:asc"],
    pagination: { page: currentPage, pageSize },
  });

  const members: MemberProfile[] = res?.data || [];
  const pagination =
    res?.meta?.pagination || { page: 1, pageSize, pageCount: 1, total: 0 };

  const texts =
    locale === "en"
      ? {
          title: "Members",
          subtitle: "Discover our team and collaborators",
          empty: "No members available yet.",
        }
      : {
          title: "Membres",
          subtitle: "Découvrez notre équipe et nos collaborateurs",
          empty: "Aucun membre disponible pour le moment.",
        };

  return (
    <main className="min-h-screen">
      <ClientSlugHandler localizedSlugs={{ en: "members", fr: "members" }} />

      <Hero title={texts.title} description={texts.subtitle} size="lg" />

      <section className="container mx-auto py-12 max-w-6xl px-4">
        {members.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {texts.empty}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m) => (
                <MemberCard key={m.id} member={m} locale={locale} />
              ))}
            </div>

            <NewsPagination
              currentPage={pagination.page}
              totalPages={pagination.pageCount}
              locale={locale}
              baseUrl={`/${locale}/members`}
            />
          </>
        )}
      </section>
    </main>
  );
}

export async function generateMetadata(
  { params, searchParams }: MembersIndexProps
): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  // You don't really need the page here, but this keeps the signature consistent
  void resolvedSearch;

  const title = locale === "en" ? "Members" : "Membres";
  const description =
    locale === "en"
      ? "Discover our team and collaborators"
      : "Découvrez notre équipe et nos collaborateurs";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}
