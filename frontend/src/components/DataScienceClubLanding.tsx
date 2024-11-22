import React from 'react';
import { 
  Book, Code, Users, TrendingUp, ChevronRight, Star, Github, 
  Calendar, Mail, Linkedin, Twitter, Heart,
  BookOpen, Trophy, Target, Coffee
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';

const DataScienceClubLanding = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const events = [
    {
      date: "27 Nov",
      title: "Workshop: Introducción a Python",
      type: "Taller",
      instructor: "Carlos Ruiz"
    },
    {
      date: "30 Nov",
      title: "Machine Learning en Producción",
      type: "Charla",
      instructor: "Ana García"
    },
    {
      date: "5 Dic",
      title: "Hackathon: Data for Good",
      type: "Evento",
      instructor: "Equipo DS"
    }
  ];

  const teamMembers = [
    {
      name: "María González",
      role: "Directora",
      avatar: "/api/placeholder/64/64",
      description: "PhD en Machine Learning",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Juan Pérez",
      role: "Lead Instructor",
      avatar: "/api/placeholder/64/64",
      description: "Data Scientist @ Amazon",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Laura Torres",
      role: "Community Manager",
      avatar: "/api/placeholder/64/64",
      description: "Experta en Visualización",
      social: { linkedin: "#", twitter: "#" }
    }
  ];

  const blogPosts = [
    {
      title: "Introducción a Pandas",
      excerpt: "Aprende los fundamentos de la librería más popular para análisis de datos",
      image: "/api/placeholder/400/200",
      author: "María González",
      date: "20 Nov 2024"
    },
    {
      title: "Deep Learning en la Práctica",
      excerpt: "Casos de uso reales de redes neuronales",
      image: "/api/placeholder/400/200",
      author: "Juan Pérez",
      date: "18 Nov 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
     
      {/* Hero Section - Mejorado */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">¡Próximo Workshop: 27 Nov! 🚀</Badge>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Aprende Ciencia de Datos en Comunidad
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Únete a la comunidad líder en ciencia de datos. Aprende, colabora y crece con expertos y entusiastas.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" className="group">
                Únete Gratis
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
              </Button>
              <Button size="lg" variant="outline">
                Ver Calendario
              </Button>
            </div>
          </div>
          
          <Card className="p-6 bg-white/50 backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4">
                <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-bold">500+</h3>
                <p className="text-sm text-gray-600">Miembros</p>
              </div>
              <div className="text-center p-4">
                <BookOpen className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <h3 className="font-bold">50+</h3>
                <p className="text-sm text-gray-600">Workshops</p>
              </div>
              <div className="text-center p-4">
                <Trophy className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <h3 className="font-bold">20+</h3>
                <p className="text-sm text-gray-600">Proyectos</p>
              </div>
              <div className="text-center p-4">
                <Target className="w-8 h-8 mx-auto text-red-600 mb-2" />
                <h3 className="font-bold">100%</h3>
                <p className="text-sm text-gray-600">Práctico</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="container mx-auto px-6 py-24 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-4">Nuestra Misión</Badge>
          <h2 className="text-4xl font-bold mb-6">Formando la Próxima Generación de Data Scientists</h2>
          <p className="text-xl text-gray-600 mb-12">
            Somos un grupo de entusiastas de la ciencia de datos dedicados a aprender, 
            enseñar y construir juntos proyectos innovadores. Creemos en el poder de 
            la comunidad y el aprendizaje colaborativo.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Heart className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle>Colaboración</CardTitle>
              </CardHeader>
              <CardContent>
                Aprendemos juntos, compartimos conocimiento y crecemos como comunidad.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>Innovación</CardTitle>
              </CardHeader>
              <CardContent>
                Exploramos las últimas tecnologías y metodologías en ciencia de datos.
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle>Aprendizaje</CardTitle>
              </CardHeader>
              <CardContent>
                Fomentamos el crecimiento continuo y el desarrollo profesional.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programas y Eventos */}
      <section className="container mx-auto px-6 py-24 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Nuestros Programas</h2>
        
        <Tabs defaultValue="workshops" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workshops">
            <Card>
              <CardHeader>
                <CardTitle>Workshops Semanales</CardTitle>
                <CardDescription>
                  Sesiones prácticas con expertos en la industria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <Badge variant="outline">{event.date}</Badge>
                        <h4 className="font-semibold mt-2">{event.title}</h4>
                        <p className="text-sm text-gray-600">Por {event.instructor}</p>
                      </div>
                      <Button variant="outline">Inscribirse</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Hackathons, charlas y networking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <Badge variant="secondary">Hackathon</Badge>
                    <h4 className="font-semibold mt-2">Data for Good</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Resuelve problemas sociales usando ciencia de datos
                    </p>
                    <Button className="mt-4" variant="outline">Más información</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Proyectos Destacados</CardTitle>
                <CardDescription>
                  Trabajos realizados por nuestra comunidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <Badge>Proyecto Destacado</Badge>
                    <h4 className="font-semibold mt-2">Predicción de Demanda Energética</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Modelo de ML para optimizar el consumo energético
                    </p>
                    <Button className="mt-4" variant="outline">Ver Proyecto</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Equipo */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-12">Nuestro Equipo</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>DS</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{member.description}</p>
              </CardContent>
              <CardFooter className="flex justify-start space-x-4">
                <Button variant="ghost" size="sm">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Twitter className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog y Recursos */}
      <section className="container mx-auto px-6 py-24 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Blog y Recursos</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  Por {post.author} · {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Leer más</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">¿Listo para empezar?</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Contáctanos</CardTitle>
              <CardDescription>
                Envíanos un mensaje y te responderemos en breve
                </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                <Input
                  type="text"
                  placeholder="Nombre"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
                <Textarea
                  placeholder="Mensaje"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Enviar Mensaje</Button>
            </CardFooter>
            </Card>
            </div>
            </section>
            </div>
            );
            }

            export default DataScienceClubLanding;