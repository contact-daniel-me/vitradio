import { motion } from "framer-motion";
import { Mic, Calendar, Users, Headphones, Zap, Radio, Facebook, Instagram, Mail, Phone, Youtube, PlayCircle, Clock } from "lucide-react";

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.261 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.56.3z" />
  </svg>
);
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import logo from "@/assets/VCR_logo.png";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Index = () => {
  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen overflow-hidden">
        {/* Hero */}
        <section className="relative flex min-h-screen items-center justify-center px-6" style={{ background: "var(--gradient-hero)" }}>
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="mx-auto mb-8 animate-float"
            >
              <img src={logo} alt="VIT Community Radio 90.8" className="h-28 sm:h-32 w-auto mx-auto rounded-3xl shadow-2xl border border-white/50 bg-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-normal tracking-tight mb-4 text-foreground"
            >
              VIT Community Radio <br />
              <motion.span 
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="gradient-text mt-2 inline-block pb-3 bg-[length:200%_auto]"
              >
                Studio Booking
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance"
            >
              Book your studio slot with ease and go live. Connect with the VIT community through the power of radio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-display font-semibold text-primary-foreground transition-all glow-hover hover:scale-105 active:scale-95 shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                Book Your Slot
              </Link>
              <Link
                to="/slots"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 bg-card px-8 py-4 font-display font-semibold text-foreground transition-all hover:scale-105 hover:border-primary/40 active:scale-95 shadow-sm"
              >
                View Available Slots
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Guidelines & Purpose */}
        <section className="relative px-6 py-24 bg-background">
          <div className="container mx-auto max-w-4xl space-y-16">

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-foreground relative z-10">
                  Welcome to the VIT Community Radio Studio Booking Portal
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed relative z-10 text-balance">
                  <p>...a space where voices find their time, and ideas find their rhythm.</p>
                  <p>At VIT Community Radio, every programme is more than sound it is expression, responsibility, and connection. This platform is designed to ensure that each voice is heard at the right moment, in the right space, with the discipline that radio has always upheld.</p>
                  <p className="font-semibold text-foreground">Step in, choose your time, and let your story go on air.</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                <span className="bg-primary text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md">1</span>
                Purpose of the Booking System
              </h2>
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <p className="text-muted-foreground text-lg mb-6">This booking system is created to bring structure, transparency, and efficiency to studio usage. It ensures:</p>
                <ul className="space-y-4 text-muted-foreground text-lg ml-2">
                  <li className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>Fair and equal access to recording slots</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>Clear scheduling without overlap or confusion</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>Smooth coordination between students and the radio team</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>Maintenance of professional broadcast standards</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg mt-8 border-t border-border pt-6 italic">By streamlining the process, we aim to create an environment where creativity flows freely within a framework of time, respect, and responsibility.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                <span className="bg-primary text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md">2</span>
                Simple Instructions
              </h2>
              <div className="bg-card rounded-2xl p-8 md:p-10 border border-border shadow-sm">
                <ul className="space-y-6 text-foreground font-medium text-lg ml-2">
                  <li className="flex items-center gap-5">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20"><Calendar className="w-5 h-5" /></div>
                    <span>Check the Available Slots page before booking</span>
                  </li>
                  <li className="flex items-center gap-5">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20"><Users className="w-5 h-5" /></div>
                    <span>Fill in the booking form with accurate details</span>
                  </li>
                  <li className="flex items-center gap-5">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20"><Radio className="w-5 h-5" /></div>
                    <span>Submit your request for the preferred date and time</span>
                  </li>
                  <li className="flex items-center gap-5">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20"><Zap className="w-5 h-5" /></div>
                    <span>Wait for approval confirmation from the radio team</span>
                  </li>
                  <li className="flex items-center gap-5">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20"><Clock className="w-5 h-5" /></div>
                    <span>Once approved, arrive at the studio 10 minutes early</span>
                  </li>
                  <li className="flex items-center gap-5">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20"><Headphones className="w-5 h-5" /></div>
                    <span>Ensure your script/content is ready before recording</span>
                  </li>
                </ul>

                <div className="mt-10 bg-slot-booked/10 border-l-4 border-slot-booked p-6 rounded-r-xl">
                  <p className="text-slot-booked flex gap-3 font-semibold items-center">
                    <span className="text-xl leading-none">⚠️</span> Note: Once a slot is approved, it is locked and cannot be reassigned.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Feedback / Contact */}
        <section id="feedback" className="px-6 py-24 bg-muted/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="container mx-auto max-w-3xl text-center bg-card rounded-3xl p-12 md:p-16 relative overflow-hidden border border-border shadow-lg"
          >
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-secondary/5 blur-2xl" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Share Your Feedback
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                We'd love to hear from you! Reach out to us or follow our channels.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
                <a href="mailto:vitcr@vit.ac.in" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
                  <div className="bg-primary/10 p-2.5 rounded-full"><Mail className="w-5 h-5 text-primary" /></div>
                  vitcr@vit.ac.in
                </a>
                <a href="tel:9943908908" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
                  <div className="bg-primary/10 p-2.5 rounded-full"><Phone className="w-5 h-5 text-primary" /></div>
                  +91 9943908908
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="https://www.facebook.com/vitcommunityradio" target="_blank" rel="noopener noreferrer" title="Facebook" className="p-3 bg-muted rounded-full hover:bg-[#1877F2] hover:text-white transition-all hover:scale-110 active:scale-95 text-foreground">
                  <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://www.instagram.com/vitradio/" target="_blank" rel="noopener noreferrer" title="Instagram" className="p-3 bg-muted rounded-full hover:bg-[#E4405F] hover:text-white transition-all hover:scale-110 active:scale-95 text-foreground">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://open.spotify.com/show/6uOOkDQiomTEE0Re9TqQaA" target="_blank" rel="noopener noreferrer" title="Spotify" className="p-3 bg-muted rounded-full hover:bg-[#1DB954] hover:text-white transition-all hover:scale-110 active:scale-95 text-foreground">
                  <SpotifyIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://www.youtube.com/@vitradiolive" target="_blank" rel="noopener noreferrer" title="YouTube Live" className="p-3 bg-muted rounded-full hover:bg-[#FF0000] hover:text-white transition-all hover:scale-110 active:scale-95 text-foreground">
                  <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://music.youtube.com/playlist?list=PLYqph8hk7qPByIqmjo2x_a4-TIs0YKTp5" target="_blank" rel="noopener noreferrer" title="YouTube Music" className="p-3 bg-muted rounded-full hover:bg-[#FF0000] hover:text-white transition-all hover:scale-110 active:scale-95 text-foreground">
                  <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-8 bg-card">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © 2026 VIT Community Radio 90.8. All rights reserved.
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
