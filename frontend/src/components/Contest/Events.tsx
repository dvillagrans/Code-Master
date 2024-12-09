import React, { useState } from "react";
import { BsHouseDoor, BsCode, BsPerson, BsCalendarEvent, BsFilter, BsClock, BsGeoAlt } from "react-icons/bs";
import Header from "../Common/Header";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="space-y-2 mb-6 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Upcoming Events
              </h1>
              <p className="text-gray-600">Discover and join upcoming coding competitions and workshops</p>
            </div>
            
            <div className="flex items-center space-x-4 bg-white p-2 rounded-full shadow-sm border">
              <BsFilter className="text-blue-600" size={24} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-gray-700 font-medium"
              >
                <option value="all">All Events</option>
                <option value="competition">Competitions</option>
                <option value="hackathon">Hackathons</option>
                <option value="workshop">Workshops</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321165247-4aa89a48be28";
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>
                  
                  <p className="text-gray-600 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center text-gray-500">
                      <BsClock className="mr-2 text-blue-500" />
                      <span className="text-sm">{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <BsGeoAlt className="mr-2 text-blue-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl 
                    hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center space-x-2">
                    <BsCalendarEvent />
                    <span>Register Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;