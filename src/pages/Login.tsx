import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("vitcr_user_auth")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email domain
    const email = username.trim().toLowerCase();
    const allowedDomains = ['@vitstudent.ac.in', '@vit.ac.in'];
    const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));
    
    if (!isValidDomain) {
      toast.error("Only VIT email addresses (@vitstudent.ac.in or @vit.ac.in) are allowed");
      return;
    }
    
    if (isNewUser) {
      // New user - require name
      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }
      localStorage.setItem("vitcr_user_auth", email);
      localStorage.setItem("vitcr_user_name", name.trim());
      localStorage.setItem(`vitcr_user_name_${email}`, name.trim());
      toast.success("Registration successful!");
    } else {
      // Existing user - check if they exist
      const existingName = localStorage.getItem(`vitcr_user_name_${email}`);
      if (!existingName) {
        toast.error("No account found. Please register first.");
        return;
      }
      localStorage.setItem("vitcr_user_auth", email);
      localStorage.setItem("vitcr_user_name", existingName);
      toast.success("Logged in successfully!");
    }
    
    navigate("/dashboard");
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-md h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-card border border-border rounded-3xl p-8 shadow-sm mt-10"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <UserCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">VIT Student Portal</h1>
              <p className="text-muted-foreground text-sm mt-1">Sign in or register to book and manage slots</p>
            </div>

            {/* User Type Toggle */}
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsNewUser(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isNewUser
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Existing User
              </button>
              <button
                type="button"
                onClick={() => setIsNewUser(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  isNewUser
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                New User
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {isNewUser && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">VIT Email Address</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter your VIT email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Enter password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl glow-hover transition-all hover:scale-[1.02] active:scale-95 mt-6"
              >
                {isNewUser ? "Register" : "Sign In"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
