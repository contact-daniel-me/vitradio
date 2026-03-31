import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, isBefore, startOfDay, addHours } from "date-fns";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import {
  addBooking,
  getSlotStatus,
  isWeekday,
  TIME_SLOT_OPTIONS,
  SECTIONS,
  STUDIOS,
} from "@/lib/bookingStore";

const BookingPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "form">("date");

  const [formData, setFormData] = useState({
    name: "",
    section: "",
    contact: "",
    showTitle: "",
    studio: "Studio 1" as "Studio 1" | "Studio 2",
    scriptApproved: false,
    approvedBy: "" as "Faculty" | "Section head" | "",
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) return;
    if (!formData.name || !formData.section || !formData.showTitle) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!formData.approvedBy) {
      toast.error("Please select who approved the script");
      return;
    }
    const username = localStorage.getItem("vitcr_user_auth");
    if (!username) {
      toast.error("Please log in to make a booking");
      return;
    }

    try {
      addBooking({
        name: formData.name,
        section: formData.section,
        contact: formData.contact,
        showTitle: formData.showTitle,
        studio: formData.studio,
        date: dateStr,
        time: selectedTime,
        scriptApproved: formData.scriptApproved,
        approvedBy: formData.approvedBy as "Faculty" | "Section head",
        username,
      });
      toast.success("Booking submitted successfully!");
      setStep("date");
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: "", section: "", contact: "", showTitle: "", studio: "Studio 1", scriptApproved: false, approvedBy: "" });
    } catch (error: any) {
      toast.error(error.message || "This slot is already booked!");
    }
  };

  const slotColor = (time: string) => {
    if (!dateStr) return "bg-muted";
    const status = getSlotStatus(dateStr, time);
    if (status === "booked") return "bg-slot-booked/10 border-slot-booked/30 text-slot-booked";
    if (status === "pending") return "bg-slot-pending/10 border-slot-pending/30 text-slot-pending";
    return "bg-slot-available/10 border-slot-available/30 text-slot-available hover:bg-slot-available/20";
  };

  const inputClasses = "w-full rounded-2xl bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all";

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 text-foreground">
              Book a <span className="gradient-text">Studio Slot</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Select a date and time, then fill in your show details
            </p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-semibold mb-6 shadow-sm"
            >
              <Clock className="w-4 h-4 animate-pulse-subtle" />
              Note: Slots must be booked at least 24 hours in advance.
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === "date" ? (
              <motion.div
                key="date-step"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Calendar */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-muted transition-colors">
                      <ChevronLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {format(currentMonth, "MMMM yyyy")}
                    </h3>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-muted transition-colors">
                      <ChevronRight className="h-5 w-5 text-foreground" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {days.map((day) => {
                      const weekday = isWeekday(day);
                      // Disable past dates and today (must book 24h in advance)
                      const isPastOrToday = isBefore(day, startOfDay(new Date())) || isToday(day);
                      const selected = selectedDate && isSameDay(day, selectedDate);
                      const disabled = !weekday || isPastOrToday;

                      return (
                        <motion.button
                          key={day.toISOString()}
                          whileHover={!disabled ? { scale: 1.1 } : {}}
                          whileTap={!disabled ? { scale: 0.95 } : {}}
                          disabled={disabled}
                          onClick={() => {
                            setSelectedDate(day);
                            setSelectedTime(null);
                          }}
                          className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${disabled
                              ? "text-muted-foreground/30 cursor-not-allowed"
                              : selected
                                ? "bg-primary text-primary-foreground shadow-md"
                                : isToday(day)
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted text-foreground"
                            }`}
                        >
                          {format(day, "d")}
                        </motion.button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Weekdays only (Mon – Fri) • 9:00 AM – 7:30 PM
                  </p>
                </div>

                {/* Time slots */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a date first"}
                      </h3>
                    </div>
                    {selectedDate && (
                      <select
                        value={formData.studio}
                        onChange={(e) => setFormData({ ...formData, studio: e.target.value as "Studio 1" | "Studio 2" })}
                        className="rounded-xl bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                      >
                        {STUDIOS.map((studio) => (
                          <option key={studio} value={studio}>{studio}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedDate ? (
                    <div className="space-y-3">
                      {TIME_SLOT_OPTIONS.map((time) => {
                        const status = getSlotStatus(dateStr, time, formData.studio);
                        const isSelected = selectedTime === time;
                        const [h, m] = time.split(":").map(Number);
                        const period = h < 12 ? "AM" : "PM";
                        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
                        const label = `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;

                        // Enforce 24-hour advance booking rule
                        const now = new Date();
                        const slotDateTime = new Date(selectedDate!);
                        slotDateTime.setHours(h, m, 0, 0);
                        const isTooSoon = isBefore(slotDateTime, addHours(now, 24));
                        const disabled = status === "booked" || isTooSoon;

                        return (
                          <motion.button
                            key={time}
                            whileHover={!disabled ? { scale: 1.02 } : {}}
                            whileTap={!disabled ? { scale: 0.98 } : {}}
                            disabled={disabled}
                            onClick={() => setSelectedTime(time)}
                            className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all ${isSelected
                                ? "border-primary bg-primary/10 shadow-sm"
                                : disabled
                                  ? "opacity-40 cursor-not-allowed border-border"
                                  : slotColor(time)
                              }`}
                          >
                            <span className="font-medium text-foreground">{label}</span>
                            <span className="text-xs uppercase font-semibold tracking-wider">
                              {isTooSoon && status !== "booked" && status !== "pending"
                                ? "Too Soon"
                                : status === "booked"
                                ? "Booked"
                                : status === "pending"
                                ? "Pending"
                                : "Available"}
                            </span>
                          </motion.button>
                        );
                      })}

                      {selectedTime && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setStep("form")}
                          className="w-full mt-4 rounded-2xl bg-primary px-6 py-4 font-display font-semibold text-primary-foreground transition-all glow-hover hover:scale-[1.02] active:scale-95 shadow-lg"
                        >
                          Continue to Booking Form
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                      <Calendar className="h-12 w-12 mb-4 opacity-30" />
                      <p>Pick a date from the calendar</p>
                    </div>
                  )}

                  {/* Legend */}
                  <div className="flex gap-4 mt-6 pt-4 border-t border-border text-xs">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slot-available" /> Available</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slot-pending" /> Pending</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slot-booked" /> Booked</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                  <button
                    onClick={() => setStep("date")}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back to calendar
                  </button>

                  <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at{" "}
                      {selectedTime && (() => {
                        const [h, m] = selectedTime.split(":").map(Number);
                        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
                        const period = h < 12 ? "AM" : "PM";
                        return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`;
                      })()} • {formData.studio}
                    </span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Studio *</label>
                      <select
                        value={formData.studio}
                        onChange={(e) => setFormData({ ...formData, studio: e.target.value as "Studio 1" | "Studio 2" })}
                        className={inputClasses}
                      >
                        {STUDIOS.map((studio) => (
                          <option key={studio} value={studio}>{studio}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Name *</label>
                        <input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Arun Kumar"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Show Title *</label>
                        <input
                          value={formData.showTitle}
                          onChange={(e) => setFormData({ ...formData, showTitle: e.target.value })}
                          placeholder="e.g. Vanakkam Vellore"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Section *</label>
                        <select
                          value={formData.section}
                          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                          className={inputClasses}
                        >
                          <option value="">Select section</option>
                          {SECTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Contact Number <span className="text-muted-foreground font-normal">(Optional)</span></label>
                        <input
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="e.g. 9876543210"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-foreground">Script Approved By *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, approvedBy: "Faculty", scriptApproved: true })}
                          className={`p-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-center gap-2 ${formData.approvedBy === "Faculty" ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border hover:border-primary/50 text-foreground"}`}
                        >
                          {formData.approvedBy === "Faculty" && <Check className="h-4 w-4" />}
                          Faculty
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, approvedBy: "Section head", scriptApproved: true })}
                          className={`p-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-center gap-2 ${formData.approvedBy === "Section head" ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card border-border hover:border-primary/50 text-foreground"}`}
                        >
                          {formData.approvedBy === "Section head" && <Check className="h-4 w-4" />}
                          Section Head
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="w-full rounded-2xl bg-primary px-6 py-4 font-display font-semibold text-primary-foreground transition-all glow-hover shadow-lg"
                    >
                      Submit Booking
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
};

export default BookingPage;
