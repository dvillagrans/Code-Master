import React from "react";
import "katex/dist/katex.min.css";
import ReactKaTeX from "react-katex";

interface FormulaComponentProps {
  formula: string;
}

const FormulaComponent: React.FC<FormulaComponentProps> = ({ formula }) => {
  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <ReactKaTeX.BlockMath>{formula}</ReactKaTeX.BlockMath>
    </div>
  );
};

export default FormulaComponent;