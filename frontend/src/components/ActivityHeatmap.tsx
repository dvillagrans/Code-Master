import React from 'react';
import { motion } from 'framer-motion';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  startDate: Date;
  endDate: Date;
}

const ActivityHeatmap = ({ data, startDate, endDate }: ActivityHeatmapProps) => {
  const getIntensityColor = (count: number) => {
    const baseColor = 'hsl(var(--primary))';
    const opacity = Math.min(count * 0.2, 0.8);
    return `${baseColor} / ${opacity})`;
  };

  const getDaysArray = () => {
    const days = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const days = getDaysArray();
  const weeks = Math.ceil(days.length / 7);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] p-4">
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="w-8" /> {/* Espacio para etiquetas de meses */}
          <div className="grid grid-cols-7 gap-1">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-xs text-muted-foreground text-center">
                {day}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {Array.from({ length: weeks }).map((_, weekIndex) => (
              <div key={weekIndex} className="text-xs text-muted-foreground h-4">
                {weekIndex % 2 === 0 && 
                  new Date(days[weekIndex * 7]).toLocaleDateString('es', { month: 'short' })
                }
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => {
              const activity = data.find(d => new Date(d.date).toDateString() === date.toDateString());
              const count = activity?.count || 0;
              
              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className="relative group"
                >
                  <div
                    className={`w-4 h-4 rounded-sm transition-colors duration-200 ${
                      count > 0 ? 'bg-primary/20' : 'bg-muted'
                    }`}
                    style={{
                      backgroundColor: count > 0 ? getIntensityColor(count) : undefined,
                    }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
                      {count} ejercicios el {date.toLocaleDateString('es', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
