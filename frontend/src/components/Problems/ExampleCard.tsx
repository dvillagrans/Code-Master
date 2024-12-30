import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code } from "@/components/ui/code-comparison";
import {
  CarouselItem,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Brain, Trophy } from "lucide-react";

const ExampleCard = ({ example, index }: { example: any; index: number }) => (
    <CarouselItem>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-medium">
                <Brain className="h-4 w-4 mr-1" />
                Ejemplo {index + 1}
              </Badge>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trophy className="h-5 w-5 text-yellow-500" />
              </motion.div>
            </div>
            <div className="space-y-3">
              <div className="relative group">
                <Code className="w-full p-4 group-hover:border-primary/50 transition-colors">
                  {`Input: ${example.input}`}
                </Code>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    opacity: [0, 0.1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <div className="relative group">
                <Code className="w-full p-4 group-hover:border-primary/50 transition-colors">
                  {`Output: ${example.output}`}
                </Code>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    opacity: [0, 0.1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </div>
            </div>
            {example.explanation && (
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {example.explanation}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </CarouselItem>
  );

export default ExampleCard;