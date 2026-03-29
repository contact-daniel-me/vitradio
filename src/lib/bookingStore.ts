import { supabase } from "./supabaseClient";

export interface Booking {
  id: string;
  section: string;
  contact: string;
  showTitle: string;
  type: "Live" | "Recorded" | "Special Show";
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: "pending" | "approved" | "rejected";
  scriptApproved: boolean;
  approvedBy?: "Faculty" | "Section head" | "";
  createdAt: string;
  username?: string;
}

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

// Seed some sample bookings
const sampleBookings: Booking[] = [
  {
    id: "1",
    section: "Tamil",
    contact: "9876543210",
    showTitle: "Vanakkam Vellore",
    type: "Live",
    date: "2026-03-30",
    time: "09:00",
    status: "approved",
    scriptApproved: true,
    createdAt: "2026-03-28T10:00:00Z",
  },
];

let bookings: Booking[] = [...sampleBookings];

const listeners = new Set<() => void>();

export const subscribeBookings = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notify = () => {
  listeners.forEach((l) => l());
};

export const fetchBookings = async () => {
  try {
    const { data, error } = await supabase.from("bookings").select("*");
    if (!error && data) {
      bookings = data as Booking[];
      notify();
    }
  } catch (err) {
    console.error("Failed to fetch from supabase:", err);
  }
};

// Initiate first auto-fetch from cloud
fetchBookings();

export const getBookings = () => [...bookings];

export const updateBookingStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
  // Optimistic UI updates
  bookings = bookings.map((b) => (b.id === id ? { ...b, status } : b));
  notify();
  await supabase.from("bookings").update({ status }).eq("id", id);
};

export const deleteBooking = async (id: string) => {
  bookings = bookings.filter((b) => b.id !== id);
  notify();
  await supabase.from("bookings").delete().eq("id", id);
};

export const addBooking = async (booking: Omit<Booking, "id" | "status" | "createdAt">): Promise<Booking> => {
  const existing = bookings.find((b) => b.date === booking.date && b.time === booking.time && b.status !== "rejected");
  if (existing) throw new Error("Slot already booked");

  const newBooking: Booking = {
    ...booking,
    id: crypto.randomUUID(), // Can be superseded by supabase SERIAL id if using numeric
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  
  // Optimistic push
  bookings = [...bookings, newBooking];
  notify();
  
  // Send to DB
  const { error } = await supabase.from("bookings").insert(newBooking);
  if (error) console.error("Error inserting booking", error);

  return newBooking;
};

export const getSlotStatus = (date: string, time: string): "available" | "booked" | "pending" => {
  const booking = bookings.find((b) => b.date === date && b.time === time);
  if (!booking) return "available";
  if (booking.status === "pending") return "pending";
  return "booked";
};

export const TIME_SLOT_OPTIONS = TIME_SLOTS;

export const SECTIONS = ["Tamil", "English", "Malayalam", "Telugu", "Hindi", "Others"] as const;
export const SHOW_TYPES = ["Live", "Recorded", "Special Show"] as const;

export const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};
