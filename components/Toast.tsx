"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Toast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    const on = (e: Event) => {
      setMsg((e as CustomEvent).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener("toast", on);
    return () => { window.removeEventListener("toast", on); clearTimeout(timer); };
  }, []);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
        >
          <Check size={14} /> {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
