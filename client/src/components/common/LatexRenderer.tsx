import React from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

type Props = {
  content: string;
};

/**
 * Tách chuỗi dựa vào các biểu thức LaTeX dạng $...$
 * và render mỗi phần tương ứng là văn bản hoặc công thức.
 */
export default function LatexRenderer({ content }: Props) {
  // Biểu thức regex để tách các phần có `$...$`
  const parts = content.split(/(\$[^$]+\$)/g);

  return (
    <div>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const latex = part.slice(1, -1); // Bỏ dấu $
          return <InlineMath key={index} math={latex} />;
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </div>
  );
}
