import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShieldAlert, LogOut, Clock, Calendar, Phone, Search, Download, Users } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { getBookings, updateBookingStatus, deleteBooking, Booking, subscribeBookings } from "@/lib/bookingStore";
import { toast } from "sonner";
import { format } from "date-fns";

const statusStyles = {
  pending: "bg-slot-pending/20 text-slot-pending border-slot-pending/30",
  approved: "bg-slot-available/20 text-slot-available border-slot-available/30",
  rejected: "bg-slot-booked/20 text-slot-booked border-slot-booked/30",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "users">("bookings");

  useEffect(() => {
    if (localStorage.getItem("vitcr_admin_auth") !== "true") {
      navigate("/admin/login");
    } else {
      setBookings(getBookings().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      
      const unsub = subscribeBookings(() => {
        setBookings(getBookings().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      });
      return unsub;
    }
  }, [navigate]);


  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    updateBookingStatus(id, newStatus);
    const updatedBookings = getBookings().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(updatedBookings);
    toast.success(`Booking ${newStatus} successfully!`);
    
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      deleteBooking(id);
      setBookings(getBookings().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      toast.info("Booking deleted");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.showTitle.toLowerCase().includes(q) ||
      (b.username && b.username.toLowerCase().includes(q)) ||
      b.contact.includes(q) ||
      b.status.toLowerCase().includes(q) ||
      b.section.toLowerCase().includes(q)
    );
  });

  const userStats = Array.from(new Set(bookings.map((b) => b.username || "Anonymous"))).map((username) => {
    const userBookings = bookings.filter((b) => (b.username || "Anonymous") === username);
    const approved = userBookings.filter(b => b.status === "approved").length;
    return {
      username,
      contact: userBookings[0]?.contact || "N/A",
      totalBookings: userBookings.length,
      approvedBookings: approved,
      lastActive: userBookings[0]?.createdAt,
    };
  });


  const handleExportCSV = () => {
    const headers = ["Booking ID", "Show Title", "Date", "Time", "Section", "Type", "Status", "Script Approved", "Approved By", "Contact", "Requested By (Username)"];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map(b => [
        b.id,
        `"${b.showTitle.replace(/"/g, '""')}"`,
        b.date,
        b.time,
        b.section,
        b.type,
        b.status,
        b.scriptApproved ? "Yes" : "No",
        b.approvedBy || "None",
        b.contact,
        b.username || "Anonymous"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `VIT_Radio_Bookings_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Successfully exported current view to CSV!");
  };

  const handleLogout = () => {
    localStorage.removeItem("vitcr_admin_auth");
    navigate("/");
    toast.info("Logged out successfully");
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Admin Desk</h1>
                <p className="text-muted-foreground text-sm">Approve or reject slot requests</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 border border-border bg-card rounded-lg flex items-center gap-2 hover:bg-muted text-foreground transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Manual CSV Export
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-border bg-card text-destructive rounded-lg flex items-center gap-2 hover:bg-destructive/10 transition-colors text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Show Title, Username, or contact..."
                className="w-full rounded-xl border border-input bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex bg-card border border-border rounded-xl p-1 w-full md:w-auto mt-4 md:mt-0 shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 md:w-32 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === "bookings" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground"}`}
              >
                <Calendar className="w-4 h-4" /> Bookings
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex-1 md:w-32 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === "users" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground"}`}
              >
                <Users className="w-4 h-4" /> Users
              </button>
            </div>
          </motion.div>

          <div className="space-y-4">
            {activeTab === "bookings" && (
              filteredBookings.length === 0 ? (
              <div className="bg-card rounded-2xl p-16 text-center shadow-sm border border-border">
                <p className="text-muted-foreground">No bookings found securely matching your search criteria.</p>
              </div>
            ) : (
              filteredBookings.map((booking, idx) => {
                const hour = parseInt(booking.time.split(":")[0]);
                const timeStr = hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={booking.id}
                    className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-xl font-bold text-foreground">{booking.showTitle}</h3>
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${statusStyles[booking.status]}`}>
                          {booking.status}
                        </span>
                        <span className="bg-muted px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          User: {booking.username || "Anonymous"}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/80">
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <Calendar className="h-4 w-4 text-primary" />
                          {format(new Date(booking.date), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <Clock className="h-4 w-4 text-primary" />
                          {timeStr}
                        </div>
                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                          <Phone className="h-4 w-4 text-primary" />
                          {booking.contact}
                        </div>
                      </div>

                      <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <span>Section: {booking.section}</span> • 
                        <span>Type: {booking.type}</span> • 
                        <span className={booking.scriptApproved ? "text-slot-available" : "text-slot-booked"}>
                          Script: {booking.scriptApproved ? "Approved" : "Pending"}
                        </span>
                        {booking.approvedBy && (
                          <span> • Approved By: <strong className="text-foreground">{booking.approvedBy}</strong></span>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground/60">
                        Requested on: {format(new Date(booking.createdAt), "PPp")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:w-32 md:flex-col shrink-0">
                      {booking.status !== "approved" && (
                        <button
                          onClick={() => handleStatusChange(booking.id, "approved")}
                          className="flex-1 w-full bg-slot-available/10 text-slot-available border border-slot-available/20 hover:bg-slot-available hover:text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-semibold"
                        >
                          <Check className="h-4 w-4" /> Approve
                        </button>
                      )}
                      {booking.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(booking.id, "rejected")}
                          className="flex-1 w-full bg-slot-booked/10 text-slot-booked border border-slot-booked/20 hover:bg-slot-booked hover:text-white px-3 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-semibold"
                        >
                          <X className="h-4 w-4" /> Reject
                        </button>
                      )}
                      {booking.status === "rejected" && (
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="flex-1 w-full text-xs text-muted-foreground hover:text-destructive underline mt-2"
                        >
                          Delete purely
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ))}

            {activeTab === "users" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userStats.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div className="col-span-full bg-card rounded-2xl p-16 text-center shadow-sm border border-border">
                    <p className="text-muted-foreground">No users found matching your search.</p>
                  </div>
                ) : (
                  userStats.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase())).map((user, idx) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={user.username}
                      className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-3 border-b border-border pb-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-foreground">{user.username}</h3>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> {user.contact}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted rounded-xl p-3 text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Bookings</p>
                          <p className="text-2xl font-bold font-display text-foreground">{user.totalBookings}</p>
                        </div>
                        <div className="bg-slot-available/10 rounded-xl p-3 text-center border-slot-available/20 border">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Approved</p>
                          <p className="text-2xl font-bold font-display text-slot-available">{user.approvedBookings}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground/60 text-center pt-2">
                        Last Active: {user.lastActive ? format(new Date(user.lastActive), "PPp") : "Unknown"}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>


      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
