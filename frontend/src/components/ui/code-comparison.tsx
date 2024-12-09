import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeProps {
  language?: string;
  children: string;
  className?: string;
}

export const Code: React.FC<CodeProps> = ({ language = "python", children, className }) => {
  return (
    <SyntaxHighlighter language={language} style={ghcolors} className={className}>
      {children}
    </SyntaxHighlighter>
  );
};
