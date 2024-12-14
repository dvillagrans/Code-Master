import React, { useState } from "react";
import { BsHouseDoor, BsCode, BsPerson, BsCalendarEvent, BsFilter, BsClock, BsGeoAlt } from "react-icons/bs";
import Header from "../Common/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const EventsPage = () => {
  const [events] = useState([
    {
      id: 1,
      title: "Coding Challenge 2024",
      date: "2024-03-15",
      time: "14:00",
      location: "Virtual",
      description: "Join our global coding competition with exciting prizes",
      category: "Competition",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
    },
    {
      id: 2,
      title: "Hackathon Spring 2024",
      date: "2024-04-01",
      time: "09:00",
      location: "Tech Hub Central",
      description: "48-hour hackathon focused on AI solutions",
      category: "Hackathon",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b"
    },
    {
      id: 3,
      title: "Algorithm Workshop",
      date: "2024-03-20",
      time: "16:00",
      location: "Online",
      description: "Master advanced algorithmic concepts",
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
    }
  ]);

  const [filter, setFilter] = useState("all");

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "competition":
        return "success";
      case "hackathon":
        return "warning";
      case "workshop":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Upcoming Events
              </h1>
              <p className="text-muted-foreground">
                Discover and join upcoming coding competitions and workshops
              </p>
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="competition">Competitions</SelectItem>
                <SelectItem value="hackathon">Hackathons</SelectItem>
                <SelectItem value="workshop">Workshops</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card 
                key={event.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 z-10" />
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321165247-4aa89a48be28";
                    }}
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <Badge variant={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <p className="text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <BsClock className="mr-2 text-primary" />
                      <span className="text-sm">{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <BsGeoAlt className="mr-2 text-primary" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full group" 
                    variant="default"
                  >
                    <BsCalendarEvent className="mr-2 group-hover:animate-pulse" />
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;