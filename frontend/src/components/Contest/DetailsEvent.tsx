import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaEnvelope, FaPhone, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../Common/Header";
import Footer from "../Common/Footer";

const EventDetailsPage = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const eventData = {
    title: "TechHacks 2024: Global Data Innovation Challenge",
    banner: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3",
    dates: {
      start: "March 15, 2024",
      end: "March 17, 2024",
    },
    time: "9:00 AM - 6:00 PM EST",
    location: {
      type: "Hybrid",
      physical: "Tech Innovation Center, 123 Data Street, Silicon Valley, CA",
      virtual: "zoom.us/meeting-link",
    },
    description: "Join us for an exciting 48-hour datathon where participants will tackle real-world challenges using cutting-edge data science and machine learning techniques. This event brings together data enthusiasts, developers, and innovators from around the globe to create impactful solutions.",
    agenda: [
      { time: "Day 1 - 9:00 AM", activity: "Opening Ceremony & Team Formation" },
      { time: "Day 1 - 10:30 AM", activity: "Problem Statement Release & Workshops" },
      { time: "Day 1 - 2:00 PM", activity: "Hacking Begins" },
      { time: "Day 2 - All Day", activity: "Continuous Hacking & Mentorship Sessions" },
      { time: "Day 3 - 3:00 PM", activity: "Project Submissions" },
      { time: "Day 3 - 4:00 PM", activity: "Final Presentations" },
      { time: "Day 3 - 5:30 PM", activity: "Awards Ceremony" },
    ],
    contact: {
      email: "info@techhacks2024.com",
      phone: "+1 (555) 123-4567",
      social: {
        linkedin: "linkedin.com/techhacks",
        twitter: "twitter.com/techhacks",
      },
    },
  };

  const handleRegistration = () => {
    setIsRegistered(true);
  };

  return (
    <div>
    <Header />
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-0">
            <div className="relative h-64 md:h-96 rounded-t-xl overflow-hidden">
              <img
                src={eventData.banner}
                alt="Event Banner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {eventData.title}
              </h1>
              <Badge variant="secondary" className="flex items-center gap-2 mx-auto w-fit">
                <FaClock className="h-4 w-4" />
                {eventData.dates.start} - {eventData.dates.end}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">Acerca del Evento</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>Acerca del Evento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {eventData.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agenda">
                <Card>
                  <CardHeader>
                    <CardTitle>Agenda del Evento</CardTitle>
                    <CardDescription>Cronograma detallado de actividades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full pr-4">
                      <div className="space-y-4">
                        {eventData.agenda.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4 p-4 rounded-lg border"
                          >
                            <Badge variant="outline" className="w-32 justify-center">
                              {item.time}
                            </Badge>
                            <span className="text-muted-foreground">{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registro</CardTitle>
              </CardHeader>
              <CardContent>
                {!isRegistered ? (
                  <Button className="w-full" size="lg" onClick={handleRegistration}>
                    Registrarse Ahora
                  </Button>
                ) : (
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    ¡Registro Exitoso!
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary mt-1" />
                  <div className="space-y-1">
                    <Badge>{eventData.location.type}</Badge>
                    <p className="text-sm text-muted-foreground">{eventData.location.physical}</p>
                    <Button variant="link" className="h-auto p-0">
                      {eventData.location.virtual}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-primary" />
                    <Button variant="link" className="h-auto p-0">
                      {eventData.contact.email}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-primary" />
                    <span className="text-muted-foreground">{eventData.contact.phone}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <Button variant="outline" size="icon">
                    <FaLinkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <FaTwitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default EventDetailsPage;