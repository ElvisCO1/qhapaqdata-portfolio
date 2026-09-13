import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function AcademicMarkdown({ children }: { children: string }) {
  return (
    <div className="msc-markdown">
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { trust: false, strict: "warn" }]]}
        components={{
          h1: ({ children }) => <h4>{children}</h4>,
          h2: ({ children }) => <h4>{children}</h4>,
          h3: ({ children }) => <h4>{children}</h4>,
          table: ({ children }) => (
            <div
              className="msc-table-scroll"
              tabIndex={0}
              role="region"
              aria-label="Scrollable content table"
            >
              <table>{children}</table>
            </div>
          ),
          // Markdown images stay local or use the author's explicit URL, with no optimizer configuration.
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
