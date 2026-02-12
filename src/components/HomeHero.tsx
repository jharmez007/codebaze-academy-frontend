"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeNewsletter } from "@/services/adminService"; // adjust path

const HomeHero = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast States
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await subscribeNewsletter(name, email);

    if (res.status === 200 || res.status === 201) {
      setToastMessage("Thanks for Subscribing!");
      setToastType("success");
      setName("");
      setEmail("");
    } else {
      setToastMessage(res.message || "Something went wrong. Try again.");
      setToastType("error");
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500); // hide after 2.5s

    setLoading(false);
  };

  return (
    <>
      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`
              fixed top-0 left-0 w-full py-10 text-lg text-center z-50 font-semibold shadow-lg
              ${toastType === "success" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}
            `}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="w-full bg-[#00bf63] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Stay Up To Date
          </h2>

          <p className="mt-4 text-white/90 text-base md:text-lg">
            Join our newsletter for up-to-date information on everything{" "}
            <span className="font-semibold text-white">CodeBaze Academy</span>, 
            plus free tips and tutorials.
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-3 rounded-lg border bg-white text-black border-transparent shadow-md 
                         focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500 text-base"
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-3 rounded-lg border bg-white text-black border-transparent shadow-md 
                         focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500 text-base"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white font-bold md:ml-8 px-8 py-4 rounded-full transition-all duration-300 ease-in-out 
                         transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Now"}
            </button>
          </form>

          <p className="mt-6 text-white/80">
            You're signing up to receive emails from{" "}
            <span className="font-bold text-white">CodeBaze Academy</span>
          </p>
        </div>
      </section>
    </>
  );
};

export default HomeHero;
