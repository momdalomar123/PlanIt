import { motion } from "framer-motion";
import { useEffect } from "react";
import { BackArrows } from "../../utils/GeneralUtils";
import { useNavigate } from "react-router-dom";
type LogoutProps = {
  theme: string;
};
export default function LogoutPage({ theme }: LogoutProps) {
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);
  const navigate = useNavigate()
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.8 }}
        className={`h-screen flex justify-center items-center ${theme === "dark" ? "bg-slate-900" : "bg-white"} relative `}
      >
        <motion.button
         whileHover={{ x: -10, transition: { duration: 0.3 } }}
              
                  onClick={() => {
                    navigate("/Main");}}
               
         className="absolute top-5 left-1 p-3 cursor-pointer">
          <img
            src={
              theme === "dark"
                ? BackArrows.previousArrowWhite
                : BackArrows.previousArrowBlack
            }
            alt="Back"
            className="w-10 h-10 object-contain"
          />
        </motion.button>
        <div className="flex flex-col border p-2 h-fit w-130 relative dark:border-white/20 border-black/20 rounded-lg max-[540px]:w-110 max-[460px]:w-90">
          <p className="text-3xl absolute -top-10 dark:bg-slate-900 bg-white p-2 max-[540px]:text-2xl max-[540px]:right-6 max-[460px]:text-[19px]">
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
