import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isBefore, isToday } from "date-fns";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { getSlotStatus, isWeekday, TIME_SLOT_OPTIONS, subscribeBookings } from "@/lib/bookingStore";

const SlotsPage = () => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [, setForceRender] = useState({});

  useEffect(() => {
    return subscribeBookings(() => setForceRender({}));
  }, []);

  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const statusConfig = {
    available: { bg: "bg-slot-available/10", border: "border-slot-available/25", dot: "bg-slot-available" },
    booked: { bg: "bg-slot-booked/10", border: "border-slot-booked/25", dot: "bg-slot-booked" },
    pending: { bg: "bg-slot-pending/10", border: "border-slot-pending/25", dot: "bg-slot-pending" },
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 text-foreground">
              Available <span className="gradient-text">Slots</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Real-time studio availability for the week
            </p>
          </motion.div>

          {/* Week navigation */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} className="p-2 rounded-xl bg-card border border-border shadow-sm hover:bg-muted transition-colors">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {format(weekDays[0], "MMM d")} – {format(weekDays[4], "MMM d, yyyy")}
            </h3>
            <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} className="p-2 rounded-xl bg-card border border-border shadow-sm hover:bg-muted transition-colors">
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mb-6 justify-center text-sm text-foreground">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slot-available" /> Available</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slot-pending" /> Pending</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slot-booked" /> Booked</span>
          </div>

          {/* Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
          >
            {/* Header */}
            <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border">
              <div className="p-4" />
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-4 text-center border-l border-border ${isToday(day) ? "bg-primary/5" : ""}`}
                >
                  <div className="text-xs text-muted-foreground font-medium uppercase">
                    {format(day, "EEE")}
                  </div>
                  <div className={`text-lg font-display font-bold ${isToday(day) ? "text-primary" : "text-foreground"}`}>
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>

            {/* Time rows */}
            {TIME_SLOT_OPTIONS.map((time) => {
              const hour = parseInt(time.split(":")[0]);
              const label = hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;

              return (
                <div key={time} className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border last:border-b-0">
                  <div className="p-3 text-xs text-muted-foreground font-medium flex items-center justify-center">
                    {label}
                  </div>
                  {weekDays.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const past = isBefore(day, new Date()) && !isToday(day);
                    const status = past ? "booked" : getSlotStatus(dateStr, time);
                    const config = statusConfig[status];

                    return (
                      <motion.div
                        key={`${dateStr}-${time}`}
                        whileHover={{ scale: 0.95 }}
                        className="border-l border-border p-2 flex items-center justify-center"
                      >
                        <div className={`w-full h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center gap-1.5 ${past ? "opacity-30" : ""}`}>
                          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                          <span className="text-[10px] font-medium uppercase tracking-wider hidden sm:inline text-foreground">
                            {status}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SlotsPage;
