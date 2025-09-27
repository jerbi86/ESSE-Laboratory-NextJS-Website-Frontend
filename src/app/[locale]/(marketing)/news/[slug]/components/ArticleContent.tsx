import { Article } from '@/types/types';
import CKEditorContent from '@/components/CKEditorContent';

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div className="article-content">
      {/* Contenu HTML de l'article */}
      <CKEditorContent 
        content={article.content}
        className="prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white"
      />
    </div>
  );
}
