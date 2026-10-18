import { motion } from "framer-motion";
import { useEffect } from "react";

type LogoutProps = {
  theme: string;
};
export default function LogoutPage({ theme }: LogoutProps) {
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.8 }}
        className={`h-screen flex justify-center items-center ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}
      >
        <div className="flex flex-col border p-2 h-fit w-130 relative dark:border-white/20 border-black/20 rounded-lg ">
          <p className="text-3xl absolute -top-10 dark:bg-slate-900 bg-white p-2">
            What a delightful day to...
          </p>
          <div className="flex flex-col h-full gap-5 justify-center items-center p-5">
            <div>
              <motion.button
                whileHover={{ y: -5, opacity: 0.6 }}
                className="p-2 border dark:border-white/20 border-black/20 rounded-lg cursor-pointer "
              >
                Logout
              </motion.button>
            </div>
            <div>
              <motion.button
                whileHover={{ y: -5, opacity: 0.6 }}
                className=" text-red-500 p-2 border dark:border-white/20 border-black/20 rounded-lg cursor-pointer "
              >
                Delete Account
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
