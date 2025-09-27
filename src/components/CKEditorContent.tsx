import { cn } from '@/lib/utils';

interface CKEditorContentProps {
  content: string;
  className?: string;
}

export default function CKEditorContent({ content, className }: CKEditorContentProps) {
  return (
    <div
      className={cn(
        // Base prose styles
        "prose prose-lg max-w-none dark:prose-invert",
        // Enhanced CKEditor specific styles
        "ck-content",
        // Lists styling
        "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4",
        "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-4",
        "[&_li]:my-2 [&_li]:leading-relaxed",
        // Nested lists
        "[&_ul_ul]:list-[circle] [&_ul_ul]:ml-4",
        "[&_ol_ol]:list-[lower-alpha] [&_ol_ol]:ml-4",
        // Images styling - center by default if no alignment class
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:my-6 [&_img]:mx-auto [&_img]:block",
        "[&_figure]:my-6 [&_figure]:mx-auto [&_figure]:text-center",
        "[&_figure_img]:mb-2 [&_figure_img]:mx-auto [&_figure_img]:block",
        "[&_figcaption]:text-sm [&_figcaption]:text-gray-600 [&_figcaption]:italic [&_figcaption]:text-center",
        // Image alignment classes that CKEditor generates (override default centering)
        "[&_.image-style-align-left]:float-left [&_.image-style-align-left]:mr-4 [&_.image-style-align-left]:mb-4 [&_.image-style-align-left]:mx-0",
        "[&_.image-style-align-right]:float-right [&_.image-style-align-right]:ml-4 [&_.image-style-align-right]:mb-4 [&_.image-style-align-right]:mx-0",
        "[&_.image-style-align-center]:mx-auto [&_.image-style-align-center]:block",
        "[&_.image-style-side]:float-right [&_.image-style-side]:ml-4 [&_.image-style-side]:mb-4 [&_.image-style-side]:max-w-[50%] [&_.image-style-side]:mx-0",
        // CKEditor block alignment classes
        "[&_.image-style-block-align-left]:float-left [&_.image-style-block-align-left]:mr-4 [&_.image-style-block-align-left]:mb-4 [&_.image-style-block-align-left]:mx-0",
        "[&_.image-style-block-align-right]:float-right [&_.image-style-block-align-right]:ml-4 [&_.image-style-block-align-right]:mb-4 [&_.image-style-block-align-right]:mx-0",
        "[&_.image-style-block-align-center]:mx-auto [&_.image-style-block-align-center]:block",
        // Tables
        "[&_table]:border-collapse [&_table]:w-full [&_table]:my-6",
        "[&_table_th]:border [&_table_th]:border-gray-300 [&_table_th]:px-4 [&_table_th]:py-2 [&_table_th]:bg-gray-50",
        "[&_table_td]:border [&_table_td]:border-gray-300 [&_table_td]:px-4 [&_table_td]:py-2",
        // Blockquotes
        "[&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6",
        // Code blocks
        "[&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-4",
        "[&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm",
        // Links
        "[&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800",
        // Headings
        "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6",
        "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4",
        "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3",
        // Paragraphs
        "[&_p]:mb-4 [&_p]:leading-relaxed",
        // Text formatting
        "[&_strong]:font-bold",
        "[&_em]:italic",
        "[&_u]:underline",
        // Clear floats after content
        "after:content-[''] after:table after:clear-both",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
