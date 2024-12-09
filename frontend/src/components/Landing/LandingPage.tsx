import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  BsLightningCharge, 
  BsTrophy, 
  BsPeople, 
  BsArrowRight, 
  BsCode, 
  BsBookmark, 
  BsBan 
} from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from "@/components/ui/carousel";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container relative mx-auto px-4 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <Badge variant="secondary" className="rounded-full px-6 py-2">
              ✨ La mejor plataforma para aprender programación
            </Badge>
            
            <h1 className="text-6xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                Domina el Código
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Evoluciona tus Habilidades
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300">
              Únete a nuestra comunidad de desarrolladores apasionados. Practica programación, compite en desafíos y acelera tu carrera.
            </p>
            
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
              >
                Comenzar <BsArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Explorar Desafíos <BsCode className="ml-2" />
              </Button>
            </div>
          </div>

          <motion.div style={{ y }} className="relative">
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {[
                  { icon: BsLightningCharge, title: "Ejecución Rápida" },
                  { icon: BsBan, title: "Análisis Inteligente" },
                  { icon: BsBookmark, title: "Guarda tu Progreso" },
                  { icon: BsTrophy, title: "Gana Desafíos" }
                ].map((item, index) => (
                  <CarouselItem key={index} className="basis-1/2 p-2">
                    <CodeCard icon={item.icon} title={item.title} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </motion.div>
        </motion.div>
      </div>

      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "10K+", label: "Usuarios Activos" },
            { number: "500+", label: "Desafíos" },
            { number: "50+", label: "Concursos Diarios" },
            { number: "95%", label: "Tasa de Éxito" }
          ].map((stat, index) => (
            <StatCard key={index} number={stat.number} label={stat.label} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold mb-16">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ¿Por qué elegirnos?
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={BsCode}
            title="Codificación Interactiva"
            description="Practica con feedback en tiempo real"
          />
          <FeatureCard
            icon={BsPeople}
            title="Comunidad Activa"
            description="Aprende y crece con otros desarrolladores"
          />
          <FeatureCard
            icon={BsTrophy}
            title="Competencias"
            description="Participa en concursos y gana premios"
          />
        </div>
      </section>
    </div>
  );
};

const CodeCard = ({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>, title: string }) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6 flex items-center gap-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-300">
        <Icon className="text-2xl text-purple-600" />
      </div>
      <span className="font-medium">{title}</span>
    </CardContent>
  </Card>
);

const StatCard = ({ number, label }: { number: string, label: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center"
  >
    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
      {number}
    </div>
    <div className="text-gray-600 dark:text-gray-300 mt-2">{label}</div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"
  >
    <div className="inline-block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-4">
      <Icon className="text-3xl text-purple-600" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

export default LandingPage;