import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

const scheduleData = [
  { time: "09:00", shows: { mon: "Signature Tune & Radio Anthem", tue: "Signature Tune & Radio Anthem", wed: "Signature Tune & Radio Anthem", thu: "Signature Tune & Radio Anthem", fri: "Signature Tune & Radio Anthem" }, isCommon: true },
  { time: "09:05", shows: { mon: "Vanakkam Vellore / Andru Indru", tue: "Vanakkam Vellore / Andru Indru", wed: "Vanakkam Vellore / Andru Indru", thu: "Vanakkam Vellore / Andru Indru", fri: "Vanakkam Vellore / Andru Indru" }, isCommon: true },
  { time: "09:10", shows: { mon: "Dhinam Oru Thiravukool", tue: "Dhinam Oru Thiravukool", wed: "Dhinam Oru Thiravukool", thu: "Dhinam Oru Thiravukool", fri: "Dhinam Oru Thiravukool" }, isCommon: true },
  { time: "09:15", shows: { mon: "Manvaasanai / Dhinam Oru Velan Seithi", tue: "Manvaasanai / Dhinam Oru Velan Seithi", wed: "Manvaasanai / Dhinam Oru Velan Seithi", thu: "Manvaasanai / Dhinam Oru Velan Seithi", fri: "Manvaasanai / Dhinam Oru Velan Seithi" }, isCommon: true },
  { time: "09:20", shows: { mon: "Sevichelvam", tue: "Sevichelvam", wed: "Sevichelvam", thu: "Sevichelvam", fri: "Sevichelvam" }, isCommon: true },
  { time: "09:25", shows: { mon: "Data Chunks", tue: "Data Chunks", wed: "Data Chunks", thu: "Data Chunks", fri: "Data Chunks" }, isCommon: true },
  { time: "09:30", shows: { mon: "Anubava Medai", tue: "Thiraikadaloodi", wed: "Anubava Medai", thu: "Thiraikadaloodi", fri: "Anubava Medai" }, isCommon: false, colors: { mon: "bg-purple-500/20 text-purple-700 dark:text-purple-300", tue: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300", wed: "bg-purple-500/20 text-purple-700 dark:text-purple-300", thu: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300", fri: "bg-purple-500/20 text-purple-700 dark:text-purple-300" } },
  { time: "10:00", shows: { mon: "Vallunar Paarvai", tue: "Maruthuva Neram", wed: "Vallunar Paarvai", thu: "Maruthuva Neram", fri: "Vallunar Paarvai" }, isCommon: false, colors: { mon: "bg-blue-500/20 text-blue-700 dark:text-blue-300", tue: "bg-amber-500/20 text-amber-700 dark:text-amber-300", wed: "bg-blue-500/20 text-blue-700 dark:text-blue-300", thu: "bg-amber-500/20 text-amber-700 dark:text-amber-300", fri: "bg-blue-500/20 text-blue-700 dark:text-blue-300" } },
  { time: "10:30", shows: { mon: "Pallikoodam", tue: "Noble Lectures", wed: "Pallikoodam", thu: "Experts Talk", fri: "VIT Achievers" }, isCommon: false, colors: { mon: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300", tue: "bg-green-500/20 text-green-700 dark:text-green-300", wed: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300", thu: "bg-green-500/20 text-green-700 dark:text-green-300", fri: "bg-lime-500/20 text-lime-700 dark:text-lime-300" } },
  { time: "11:00", shows: { mon: "Karuthukalam", tue: "Kaarasaram", wed: "Second Look", thu: "Karuthukalam", fri: "Kaarasaram" }, isCommon: false, colors: { mon: "bg-rose-500/20 text-rose-700 dark:text-rose-300", tue: "bg-teal-500/20 text-teal-700 dark:text-teal-300", wed: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300", thu: "bg-rose-500/20 text-rose-700 dark:text-rose-300", fri: "bg-teal-500/20 text-teal-700 dark:text-teal-300" } },
  { time: "11:30", shows: { mon: "Exchange of Ideas", tue: "Arivom Aayiram", wed: "Travel Bonanza", thu: "Arivom Aayiram", fri: "Teamspeak Time" }, isCommon: false, colors: { mon: "bg-green-600/20 text-green-800 dark:text-green-200", tue: "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300", wed: "bg-lime-500/20 text-lime-700 dark:text-lime-300", thu: "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300", fri: "bg-green-500/20 text-green-700 dark:text-green-300" } },
  { time: "11:59", shows: { mon: "Closing Announcement (Morning)", tue: "Closing Announcement (Morning)", wed: "Closing Announcement (Morning)", thu: "Closing Announcement (Morning)", fri: "Closing Announcement (Morning)" }, isCommon: true },
  { time: "12:00", shows: { mon: "Rebroadcast - I", tue: "Rebroadcast - I", wed: "Rebroadcast - I", thu: "Rebroadcast - I", fri: "Rebroadcast - I" }, isCommon: true },
  { time: "14:59", shows: { mon: "Closing Announcement (Afternoon)", tue: "Closing Announcement (Afternoon)", wed: "Closing Announcement (Afternoon)", thu: "Closing Announcement (Afternoon)", fri: "Closing Announcement (Afternoon)" }, isCommon: true },
  { time: "15:00", shows: { mon: "Rebroadcast - II (1700 Hrs - The Campus Quiz)", tue: "Rebroadcast - II", wed: "Rebroadcast - II", thu: "Rebroadcast - II", fri: "Rebroadcast - II" }, isCommon: true, extra: "1700 Hrs - The Campus Quiz Can you answer this?" },
  { time: "18:00", shows: { mon: "Closing Announcement (Evening)", tue: "Closing Announcement (Evening)", wed: "Closing Announcement (Evening)", thu: "Closing Announcement (Evening)", fri: "Closing Announcement (Evening)" }, isCommon: true }
];

const days = ["mon", "tue", "wed", "thu", "fri"] as const;

const SchedulePage = () => {
  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-foreground">
              Show <span className="gradient-text">Schedule</span>
            </h1>
          </motion.div>

          {/* Desktop Table */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
          >
            <div className="grid grid-cols-[80px_repeat(5,1fr)] bg-primary/5 border-b border-border">
              <div className="p-4 text-center font-display font-bold text-foreground bg-primary/10">Hrs</div>
              {days.map((day) => (
                <div key={day} className="p-4 text-center font-display font-bold text-foreground border-l border-border bg-primary/10">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </div>
              ))}
            </div>

            {scheduleData.map((row) => (
              <div key={row.time} className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-border last:border-b-0">
                <div className="p-4 font-bold text-sm text-foreground bg-primary/5 flex items-center justify-center border-r border-border">
                  {row.time.replace(":", "")}
                </div>
                {row.isCommon ? (
                  <div className="col-span-5 p-4 text-center text-sm font-medium text-foreground flex items-center justify-center flex-col">
                    {row.shows.mon}
                    {row.extra && <span className="text-xs text-primary mt-1">{row.extra}</span>}
                  </div>
                ) : (
                  days.map((day) => {
                    const bgColor = row.colors?.[day] || "bg-transparent";
                    return (
                      <div key={day} className={`p-4 text-center text-sm font-semibold border-l border-border/50 flex items-center justify-center transition-colors ${bgColor}`}>
                        {row.shows[day]}
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </motion.div>

          {/* Mobile List View */}
          <div className="lg:hidden space-y-8">
            {scheduleData.map((row) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={row.time}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
              >
                <div className="bg-primary/10 p-3 text-center border-b border-border font-display font-bold text-foreground">
                  {row.time} Hrs
                </div>
                {row.isCommon ? (
                  <div className="p-4 text-center text-sm font-medium text-foreground">
                    {row.shows.mon}
                    {row.extra && <div className="text-xs text-primary mt-2">{row.extra}</div>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
                    {days.map((day) => {
                      const bgColor = row.colors?.[day] || "bg-card";
                      return (
                        <div key={day} className={`p-4 flex flex-col justify-center gap-1 ${bgColor}`}>
                          <span className="text-xs uppercase tracking-wider opacity-70 font-semibold">{day}</span>
                          <span className="text-sm font-bold">{row.shows[day]}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SchedulePage;
