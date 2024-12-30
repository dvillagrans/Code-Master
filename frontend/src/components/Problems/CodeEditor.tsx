import { motion } from "framer-motion";
import { Editor } from "@/components/ui/editor";

const CodeEditor = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <motion.div
      className="relative rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <Editor
        value={value}
        onChange={onChange}
        placeholder="Escribe tu solución aquí..."
        className="font-mono bg-muted/50 relative z-10"
        language="python"
      />
    </motion.div>
  );

export default CodeEditor;