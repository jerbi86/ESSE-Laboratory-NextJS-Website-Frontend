import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  locale: string;
  baseUrl: string;
}

export default function NewsPagination({ 
  currentPage, 
  totalPages, 
  locale,
  baseUrl 
}: NewsPaginationProps) {
  const getTexts = (locale: string) => {
    return locale === 'en'
      ? {
          previous: 'Previous',
          next: 'Next'
        }
      : {
          previous: 'Précédent',
          next: 'Suivant'
        };
  };

  const texts = getTexts(locale);

  // Si il n'y a qu'une page ou moins, ne pas afficher la pagination
  if (totalPages <= 1) return null;

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si moins de 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (currentPage <= 3) {
        // Au début
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // À la fin
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Au milieu
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-12">
      <Pagination>
        <PaginationContent>
          {/* Bouton Précédent */}
          <PaginationItem>
            {currentPage > 1 ? (
              <Link href={`${baseUrl}?page=${currentPage - 1}`}>
                <PaginationPrevious>
                  <span>{texts.previous}</span>
                </PaginationPrevious>
              </Link>
            ) : (
              <PaginationPrevious className="opacity-50 cursor-not-allowed pointer-events-none">
                <span>{texts.previous}</span>
              </PaginationPrevious>
            )}
          </PaginationItem>

          {/* Numéros de pages */}
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <Link href={`${baseUrl}?page=${page}`}>
                  <PaginationLink
                    isActive={page === currentPage}
                    className={page === currentPage ? "bg-primary text-primary-foreground" : ""}
                  >
                    {page}
                  </PaginationLink>
                </Link>
              )}
            </PaginationItem>
          ))}

          {/* Bouton Suivant */}
          <PaginationItem>
            {currentPage < totalPages ? (
              <Link href={`${baseUrl}?page=${currentPage + 1}`}>
                <PaginationNext>
                  <span>{texts.next}</span>
                </PaginationNext>
              </Link>
            ) : (
              <PaginationNext className="opacity-50 cursor-not-allowed pointer-events-none">
                <span>{texts.next}</span>
              </PaginationNext>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
