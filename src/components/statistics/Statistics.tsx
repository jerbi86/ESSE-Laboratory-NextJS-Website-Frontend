'use client';

import { Users, FileText, FolderOpen, UsersIcon } from 'lucide-react';

interface StatisticsProps {
  membersCount: number;
  publicationsCount: number;
  projectsCount: number;
  teamsCount: number;
  locale: string;
}

interface StatItem {
  icon: React.ReactNode;
  count: number;
  label: string;
}

export default function Statistics({
  membersCount,
  publicationsCount,
  projectsCount,
  teamsCount,
  locale
}: StatisticsProps) {
  const texts = locale === 'en'
    ? {
        title: "Our Laboratory in Numbers",
        members: "Members",
        publications: "Publications",
        projects: "Projects",
        teams: "Research Teams"
      }
    : {
        title: "Notre Laboratoire en Chiffres",
        members: "Membres",
        publications: "Publications",
        projects: "Projets",
        teams: "Équipes de Recherche"
      };

  const stats: StatItem[] = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      count: membersCount,
      label: texts.members
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      count: publicationsCount,
      label: texts.publications
    },
    {
      icon: <FolderOpen className="w-8 h-8 text-purple-600" />,
      count: projectsCount,
      label: texts.projects
    },
    {
      icon: <UsersIcon className="w-8 h-8 text-orange-600" />,
      count: teamsCount,
      label: texts.teams
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {texts.title}
          </h2>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full">
                  {stat.icon}
                </div>
              </div>

              {/* Count */}
              <div className="mb-2">
                <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.count.toLocaleString()}
                </span>
              </div>

              {/* Label */}
              <div>
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
