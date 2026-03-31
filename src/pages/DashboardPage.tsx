import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Radio, User, LogOut, CheckCircle, Circle, Edit2, Mic, Save, AlertCircle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { getBookings, Booking, subscribeBookings } from "@/lib/bookingStore";
import { format } from "date-fns";
import { toast } from "sonner";

const statusStyles = {
  pending: "bg-slot-pending/10 text-slot-pending border-slot-pending/25",
  approved: "bg-slot-available/10 text-slot-available border-slot-available/25",
  rejected: "bg-slot-booked/10 text-slot-booked border-slot-booked/25",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("vitcr_user_auth");
    const name = localStorage.getItem("vitcr_user_name");
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      setUsername(user);
      setUserName(name);
      const updateData = () => setBookings(getBookings().filter((b) => b.username === user).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.time.localeCompare(b.time)));
      updateData();
      return subscribeBookings(updateData);
    }
  }, [navigate]);

  if (!username) return null;

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: Calendar },
    { label: "Approved", value: bookings.filter((b) => b.status === "approved").length, icon: Radio },
    { label: "Pending", value: bookings.filter((b) => b.status === "pending").length, icon: Clock },
  ];

  const handleLogout = () => {
    localStorage.removeItem("vitcr_user_auth");
    localStorage.removeItem("vitcr_user_name");
    navigate("/login");
    toast.success("Successfully logged out");
  };

  const handleUpdateTracking = async (id: string, data: Partial<Booking>) => {
    try {
      await import("@/lib/bookingStore").then(m => m.updateBookingTracking(id, data));
      toast.success("Tracking details updated!");
    } catch (error) {
      toast.error("Failed to update tracking details");
    }
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Welcome back, <span className="gradient-text">{userName || 'User'}</span>!
                </h1>
                <p className="text-muted-foreground text-sm">Here's your booking overview</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-border bg-card rounded-xl flex items-center gap-2 hover:bg-muted text-foreground transition-colors shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-display text-3xl font-bold text-foreground">{stat.value}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Booking history */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> My Booking History
            </h2>
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="bg-card rounded-3xl p-16 text-center text-muted-foreground border border-border shadow-sm">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30 text-primary" />
                  <p className="text-foreground font-medium mb-2">No bookings yet.</p>
                  <p className="text-sm text-balance">Head over to the booking tab to reserve your very first studio slot!</p>
                  <button 
                    onClick={() => navigate('/book')} 
                    className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl transition-transform hover:scale-105"
                  >
                    Book a Slot
                  </button>
                </div>
              ) : (
                bookings.map((booking, i) => {
                  const hour = parseInt(booking.time.split(":")[0]);
                  const timeLabel = hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="bg-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between border border-border shadow-sm"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display font-bold text-lg text-foreground">{booking.showTitle}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusStyles[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md text-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(booking.date), "MMM d, yyyy")}
                          </span>
                          <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md text-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {timeLabel}
                          </span>
                          <span>Section: {booking.section}</span>
                        </div>

                        {booking.status === "approved" && booking.type === "Recorded" && (
                          <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/50 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Mic className="w-3 h-3" /> Production Tracking
                              </h4>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">Was this recorded?</span>
                                <div className="flex bg-muted p-1 rounded-lg border border-border">
                                  <button 
                                    onClick={() => handleUpdateTracking(booking.id, { recordingCompleted: true })}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${booking.recordingCompleted ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
                                  >Yes</button>
                                  <button 
                                    onClick={() => handleUpdateTracking(booking.id, { recordingCompleted: false })}
                                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${!booking.recordingCompleted ? 'bg-destructive text-destructive-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
                                  >No</button>
                                </div>
                              </div>
                            </div>
                            
                            {booking.recordingCompleted ? (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/30"
                              >
                                <div className="space-y-3">
                                  <label className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                      type="checkbox" 
                                      checked={booking.editingCompleted}
                                      onChange={(e) => handleUpdateTracking(booking.id, { editingCompleted: e.target.checked })}
                                      className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${booking.editingCompleted ? 'bg-primary border-primary text-white' : 'border-input bg-card'}`}>
                                      {booking.editingCompleted && <CheckCircle className="w-3 h-3" />}
                                    </div>
                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Editing Completed</span>
                                  </label>

                                  <div className="space-y-1">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Recorded By</span>
                                    <div className="relative">
                                      <Edit2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                      <input 
                                        type="text"
                                        placeholder="Name of recorder..."
                                        defaultValue={booking.recordedBy}
                                        onBlur={(e) => handleUpdateTracking(booking.id, { recordedBy: e.target.value })}
                                        className="w-full bg-card border border-input rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Airing Date (Optional)</span>
                                    <div className="relative">
                                      <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                      <input 
                                        type="date"
                                        defaultValue={booking.airingDate}
                                        onBlur={(e) => handleUpdateTracking(booking.id, { airingDate: e.target.value })}
                                        className="w-full bg-card border border-input rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-2 border-t border-border/30"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase">
                                    <AlertCircle className="w-3 h-3" /> Reason for not recording (Optional)
                                  </div>
                                  <textarea 
                                    placeholder="Explain why this slot wasn't recorded..."
                                    defaultValue={booking.notRecordedReason}
                                    onBlur={(e) => handleUpdateTracking(booking.id, { notRecordedReason: e.target.value })}
                                    className="w-full h-20 bg-card border border-input rounded-lg p-3 text-xs focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                  />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DashboardPage;
