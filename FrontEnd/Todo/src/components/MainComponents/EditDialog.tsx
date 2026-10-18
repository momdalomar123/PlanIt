import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CategoriesIcons } from "../../utils/CategoriesUtils";
type EditDialogProps = {
  editDialogOpen: boolean;
  setEditDialogOpen: (value: boolean) => void;
};
export default function EditDialog({
  editDialogOpen,
  setEditDialogOpen,
}: EditDialogProps) {
  const editDialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (editDialogOpen) editDialogRef.current?.showModal();
  }, [editDialogOpen]);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  return (
    <AnimatePresence
      onExitComplete={() => {
        editDialogRef.current?.close();
      }}
    >
      {editDialogOpen && (
        <motion.dialog
          ref={editDialogRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ height: 20, opacity: 0 }}
          transition={{ duration: 0.7 }}
          dragElastic={true}
          onClose={() => {
            setEditDialogOpen(false);
          }}
          className="w-150 bg-gray-300 border rounded-lg  backdrop:bg-white/10 backdrop:backdrop-blur-sm fixed inset-0 m-auto overflow-y-auto overflow-x-hidden scrollbar-none select-none "
        >
          <motion.div 
          initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
               className="flex flex-col gap-5 p-5">
            <div className="flex items-center sticky top-0 z-100 backdrop-blur-2xl h-20  ">
              <h1 className="relative text-4xl  max-[500px]:text-2xl">
                Edit the Group
                <span className="absolute -z-10 text-blue-400 left-49.5 -bottom-1 max-[500px]:left-33">
                  Group
                </span>
              </h1>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="p-5 flex flex-col gap-5 border border-black/20 ml-5 mr-5 rounded-3xl "
            >
              <h2>Change the Group Type:</h2>
              <div className="grid grid-cols-3 gap-5">
                <div className="flex flex-col items-center">
                  <motion.button
                    name="Education"
                    whileHover={{ opacity: 0.5, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2 cursor-pointer w-fit"
                  >
                    <img
                      src={CategoriesIcons.Categories.EducationIcon}
                      alt="Education"
                      className={`w-10 h-10 bg-green-500 p-1 rounded-lg "outline-4 outline-white" : ""}`}
                    />
                    <div className="text-[10px]">Education</div>
                  </motion.button>
                </div>
                <div className="flex flex-col items-center ">
                  <motion.button
                    name="Health"
                    whileHover={{ opacity: 0.5, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2 w-fit cursor-pointer"
                  >
                    <img
                      src={CategoriesIcons.Categories.HealthFitnessIcon}
                      alt="Heath"
                      className={`w-10 h-10 bg-red-500 p-1 rounded-lg  "outline-4 outline-white" : ""}`}
                    />
                    <div className="text-[10px]">Health And Fitness</div>
                  </motion.button>
                </div>
                <div className="flex flex-col items-center ">
                  <motion.button
                    name="Traveling"
                    whileHover={{ opacity: 0.5, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2 w-fit cursor-pointer"
                  >
                  
                    <img
                      src={CategoriesIcons.Categories.TravelIcon}
                      alt="Heath"
                      className={`w-10 h-10 bg-blue-500 p-1 rounded-lg  "outline-4 outline-white " : ""}`}
                    />
                    <div className="text-[10px]">Traveling</div>
                  </motion.button>
                </div>
           
                <div className="flex flex-col items-center ">
                  <motion.button
                    name="Cooking"
                    whileHover={{ opacity: 0.5, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2 w-fit cursor-pointer"
                  >
                    <img
                      src={CategoriesIcons.Categories.CookingIcon}
                      alt="Heath"
                      className={`w-10 h-10 bg-orange-500 p-1 rounded-lg "outline-4 outline-white" : ""}`}
                    />
                    <div className="text-[10px]">Cooking</div>
                  </motion.button>
                </div>
                <div className="flex flex-col items-center ">
                  <motion.button
                    name="Work"
                    whileHover={{ opacity: 0.5, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2 w-fit cursor-pointer"
                  >
                    <img
                      src={CategoriesIcons.Categories.WorkIcon}
                      alt="Heath"
                      className={`w-10 h-10 bg-gray-500 p-1 rounded-lg "outline-4 outline-white" : ""}`}
                    />
                    <div className="text-[10px]">Work</div>
                  </motion.button>
                </div>
                <div className="flex flex-col items-center ">
                  <motion.button
                    name="Finance"
                    whileHover={{ opacity: 0.5, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2 w-fit cursor-pointer"
                  >
                    <img
                      src={CategoriesIcons.Categories.FinanceIcon}
                      alt="Heath"
                      className={`w-10 h-10 bg-yellow-500 p-1 rounded-lg  "outline-4 outline-white" : ""}`}
                    />
                    <div className="text-[10px]">Finance</div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col gap-10 p-5 border border-black/20 rounded-3xl mr-5 ml-5 "
            >
              <h2 className="max-[550px]:text-[15px] max-[460px]:text-[13px]">
                Edit the Group Title:
              </h2>
              <div className="ml-5 relative">
                <input
                  type="text"
                  className="border-b outline-0 peer w-1/2 select-text"
                  onChange={(e) => {
                    setGroupTitle(e.currentTarget.value);
                  }}
                />
                <label
                  htmlFor=""
                  className={`${
                    groupTitle.length
                      ? "-translate-x-7 -translate-y-7 transition-all duration-300 opacity-100 bg-blue-300 p-px text-white   "
                      : "peer-focus:-translate-y-7 peer-focus:-translate-x-7 peer-focus:opacity-100 peer-focus:transition-all peer-focus:duration-300 peer-focus:bg-blue-300 peer-focus:p-px peer-focus:text-white"
                  }
                        -z-10
                        left-0
                        absolute
                        rounded-lg
                       opacity-40
                       transition-all
                       duration-300
                         
                         `}
                >
                  Title
                </label>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col gap-10 p-5 border border-black/20 rounded-3xl mr-5 ml-5 "
            >
              <h2 className="max-[550px]:text-[15px] max-[460px]:text-[13px]">
                Edit the Group Description:
              </h2>
              <div className="ml-5 relative">
                <input
                  type="text"
                  className="border-b outline-0 peer w-1/2 select-text"
                  onChange={(e) => {
                    setGroupDescription(e.currentTarget.value);
                  }}
                />
                <label
                  htmlFor=""
                  className={`absolute ${
                    groupDescription
                      ? "-translate-x-7 -translate-y-7 transition-all duration-300 opacity-100 bg-blue-300 p-px text-white   "
                      : "peer-focus:-translate-y-7  peer-focus:-translate-x-7 peer-focus:opacity-100 peer-focus:transition-all peer-focus:duration-300 peer-focus:bg-blue-300 peer-focus:p-px peer-focus:text-white"
                  }
                        
                     -z-10
                        left-0
                        absolute
                        rounded-lg
                       opacity-40
                       transition-all
                       duration-300
                       
                      

                         
                         
                         
                         `}
                >
                  Description
                </label>
              </div>
            </motion.div>
            <div className="flex justify-end items-center gap-5">
              <button
                type="button"
                className="text-3xl outline-1 bg-green-700 p-2 rounded-lg text-white font-bold cursor-pointer transition-all hover:bg-inherit hover:text-green-700 hover:outline-green-700"
              >
                Confirm
              </button>
              <button
                type="button"
                className="text-3xl outline-1 bg-orange-700 p-2 rounded-lg text-white font-bold cursor-pointer transition-all hover:bg-inherit hover:text-orange-700 hover:outline-orange-700"
                onClick={() => {
                  setEditDialogOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
