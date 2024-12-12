import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  BsLightningCharge, 
  BsTrophy, 
  BsPeople, 
  BsArrowRight, 
  BsCode, 
  BsBookmark, 
  BsBan,
  BsCloudDownload,
  BsPlay,
  BsCheckCircle,
  BsTerminal,
  BsGraphUp,
  BsPlayFill, 
  BsTerminalFill,
  BsStarFill,
  BsQuote
} from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import PublicHeader from "../Common/PublicHeader";
import CodeCard from "../ui/code-card";

const StatCard = ({ number, label, icon: Icon }: { number: string; label: string; icon: any }) => (
  <div className="text-center">
    <Icon className="w-8 h-8 mx-auto text-purple-600 mb-2" />
    <h3 className="text-3xl font-bold mb-1">{number}</h3>
    <p className="text-gray-600 dark:text-gray-300">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <Card className="text-center">
    <CardContent className="pt-6">
      <Icon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {isAuthenticated ? <Header /> : <PublicHeader />}

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container relative mx-auto px-4 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <Badge variant="secondary" className="rounded-full px-6 py-2 animate-pulse">
              🚀 Plataforma #1 para Desarrolladores en Crecimiento
            </Badge>
            
            <h1 className="text-6xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                Transforma tu Potencial
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Domina la Programación
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300">
              Únete a una plataforma revolucionaria diseñada para transformar principiantes en desarrolladores profesionales. Aprende, practica y destaca con herramientas de última generación.
            </p>
            
            <div className="flex gap-4 flex-wrap">
            <a href="/signup">

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 flex items-center"
              >
                Comenzar Ahora <BsPlay className="ml-2" />
              </Button>
              </a>
              <a href="/problems">
              <Button 
                size="lg" 
                variant="outline" 
                className="hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
              >
                Explorar Desafíos <BsTerminal className="ml-2" />
              </Button>
              </a>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <BsCheckCircle className="text-green-500" />
              <span>Sin compromiso • Acceso Inmediato • Soporte 24/7</span>
            </div>
          </div>

          <motion.div style={{ y }} className="relative w-full overflow-hidden">
            <div className="flex flex-col gap-4 relative">
              {/* Primera fila del marquee */}
              <motion.div
                className="flex gap-4 relative"
                animate={{
                  x: [-1200, 0],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                <div className="flex gap-4">
                  {[
                    { icon: BsLightningCharge, title: "Ejecución Rápida", description: "Compila y ejecuta código en segundos" },
                    { icon: BsBan, title: "Análisis Profundo", description: "Detección avanzada de errores" },
                    { icon: BsBookmark, title: "Seguimiento de Progreso", description: "Visualiza tu evolución" },
                  ].map((item, index) => (
                    <div key={index} className="w-[280px] flex-shrink-0">
                      <CodeCard icon={item.icon} title={item.title} description={item.description} />
                    </div>
                  ))}
                </div>
                {/* Duplicamos los items para un scroll infinito más suave */}
                <div className="flex gap-4">
                  {[
                    { icon: BsLightningCharge, title: "Ejecución Rápida", description: "Compila y ejecuta código en segundos" },
                    { icon: BsBan, title: "Análisis Profundo", description: "Detección avanzada de errores" },
                    { icon: BsBookmark, title: "Seguimiento de Progreso", description: "Visualiza tu evolución" },
                  ].map((item, index) => (
                    <div key={`dup-${index}`} className="w-[280px] flex-shrink-0">
                      <CodeCard icon={item.icon} title={item.title} description={item.description} />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Segunda fila del marquee */}
              <motion.div
                className="flex gap-4 relative"
                animate={{
                  x: [0, -1200],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                <div className="flex gap-4">
                  {[
                    { icon: BsTrophy, title: "Desafíos Competitivos", description: "Gana premios reales" },
                    { icon: BsArrowRight, title: "Navegación Intuitiva", description: "Interfaz fácil de usar" },
                    { icon: BsCode, title: "Código en Vivo", description: "Entorno de desarrollo en tiempo real" },
                  ].map((item, index) => (
                    <div key={index} className="w-[280px] flex-shrink-0">
                      <CodeCard icon={item.icon} title={item.title} description={item.description} />
                    </div>
                  ))}
                </div>
                {/* Duplicamos los items para un scroll infinito más suave */}
                <div className="flex gap-4">
                  {[
                    { icon: BsTrophy, title: "Desafíos Competitivos", description: "Gana premios reales" },
                    { icon: BsArrowRight, title: "Navegación Intuitiva", description: "Interfaz fácil de usar" },
                    { icon: BsCode, title: "Código en Vivo", description: "Entorno de desarrollo en tiempo real" },
                  ].map((item, index) => (
                    <div key={`dup-${index}`} className="w-[280px] flex-shrink-0">
                      <CodeCard icon={item.icon} title={item.title} description={item.description} />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-24 bg-gray-50 dark:bg-gray-900/30"
      >
        <h2 className="text-4xl font-bold mb-16">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ¿Por qué elegirnos?
          </span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "10K+", label: "Usuarios Activos", icon: BsPeople },
            { number: "500+", label: "Desafíos Únicos", icon: BsCode },
            { number: "50+", label: "Concursos Diarios", icon: BsTrophy },
            { number: "95%", label: "Tasa de Éxito", icon: BsGraphUp }
          ].map((stat) => (
            <StatCard
              key={stat.label}
              number={stat.number}
              label={stat.label}
              icon={stat.icon}
            />
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-4 py-24 text-center"
      >
        <h2 className="text-4xl font-bold mb-16">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Características Principales
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={BsCode}
            title="Codificación Interactiva"
            description="Ambiente de desarrollo inteligente con retroalimentación en tiempo real"
          />
          <FeatureCard
            icon={BsPeople}
            title="Comunidad Global"
            description="Conecta con desarrolladores de todo el mundo, colabora y aprende"
          />
          <FeatureCard
            icon={BsTrophy}
            title="Retos Profesionales"
            description="Simulaciones de proyectos reales y oportunidades de networking"
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="container mx-auto px-4 py-24 text-center"
      >
        <h2 className="text-4xl font-bold mb-12">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Testimonios de Desarrolladores
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "La plataforma perfecta para evolucionar como desarrollador",
              author: "María G.",
              role: "Frontend Developer"
            },
            {
              quote: "Los desafíos diarios han mejorado mis habilidades",
              author: "Carlos R.",
              role: "Full Stack Developer"
            },
            {
              quote: "Una comunidad increíble y soporte excepcional",
              author: "Ana P.",
              role: "Backend Developer"
            }
          ].map((testimonial, index) => (
            <Card key={index} className="text-left">
              <CardContent className="pt-6">
                <BsQuote className="text-3xl text-purple-600 mb-4" />
                <p className="mb-4">{testimonial.quote}</p>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="container mx-auto px-4 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Comienza tu Viaje
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Únete a miles de desarrolladores que ya están transformando su carrera
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: BsPlayFill, title: "Aprende", description: "Tutoriales interactivos" },
            { icon: BsTerminalFill, title: "Practica", description: "Ejercicios reales" },
            { icon: BsStarFill, title: "Destaca", description: "Compite y gana" },
            { icon: BsGraphUp, title: "Crece", description: "Evoluciona profesionalmente" }
          ].map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <feature.icon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="container mx-auto px-4 py-32 text-center"
      >
        <h2 className="text-4xl font-bold mb-8">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ¿Listo para Comenzar?
          </span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          Únete ahora y obtén acceso inmediato a todos nuestros recursos
        </p>
        <a href="/signup">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
        >
          Comienza Gratis <BsArrowRight className="ml-2" />
        </Button>
        </a>
      </motion.section>

      <Footer />

    </div>

  );

};


export default LandingPage;
