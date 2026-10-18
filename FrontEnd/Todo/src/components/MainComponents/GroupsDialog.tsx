import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  CategoriesIcons,
  CategoriesBackgrounds,
} from "../../utils/CategoriesUtils";

type GroupsDialogProp = {
  theme: string;
  groupDialogOpen: boolean;
  setGroupDialogOpen: (value: boolean) => void;
  createClicked: boolean;
  setCreateClicked: (value: boolean) => void;
};
export default function GroupsDialog({
  theme,
  groupDialogOpen,
  setGroupDialogOpen,
  createClicked,
  setCreateClicked,
}: GroupsDialogProp) {
  useEffect(() => {
    if (groupDialogOpen) {
      dialogRef.current?.showModal();
    }
  }, [groupDialogOpen]);

  const Groups = {
    educationBtn: {
      name: "Education",
      selected: false,
    },
    healthBtn: {
      name: "Health",
      selected: false,
    },
    travelBtn: {
      name: "Travel",
      selected: false,
    },
    cookingBtn: {
      name: "Cooking",
      selected: false,
    },
    workBtn: {
      name: "Work",
      selected: false,
    },
    financeBtn: {
      name: "Finance",
      selected: false,
    },
  };

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [groupSelected, setGroupSelected] = useState({ ...Groups });
  const [groupType, setGroupType] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupColor, setGroupColor] = useState("");
  const [groupImage, setGroupImage] = useState("");
  const [groupSelection, setGroupSelection] = useState(false);

  const [titleEmpty, setTitleEmpty] = useState(false);

  const [createClickDialog, setCreateClickDialog] = useState(false);

  const descriptionRef = useRef<HTMLInputElement>(null);
  function setSelectedGroup(btn: React.MouseEvent<HTMLButtonElement>) {
    const newSelection = structuredClone(Groups);

    if (btn.currentTarget.name === "Education") {
      newSelection.educationBtn.selected = true;

      setGroupSelected(newSelection);
    } else if (btn.currentTarget.name === "Health") {
      newSelection.healthBtn.selected = true;

      setGroupSelected(newSelection);
    } else if (btn.currentTarget.name === "Traveling") {
      newSelection.travelBtn.selected = true;

      setGroupSelected(newSelection);
    } else if (btn.currentTarget.name === "Cooking") {
      newSelection.cookingBtn.selected = true;

      setGroupSelected(newSelection);
    } else if (btn.currentTarget.name === "Work") {
      newSelection.workBtn.selected = true;

      setGroupSelected(newSelection);
    } else if (btn.currentTarget.name === "Finance") {
      newSelection.financeBtn.selected = true;

      setGroupSelected(newSelection);
    }
    setGroupType(btn.currentTarget.name);
  }

  function checkTitle() {
    if (!groupTitle.length) {
      setTitleEmpty(true);
    } else {
      setTitleEmpty(false);
    }
  }
  useEffect(() => {
    dialogRef.current?.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkGroupSelection = () => {
      for (const [groupName, group] of Object.entries(groupSelected)) {
        checkTitle();
        if (group.selected) {
          console.log(groupName);
          setGroupSelection(true);
          return;
        }
      }
      setGroupSelection(false);
      checkTitle();
    };

    checkGroupSelection();
  }, [groupSelected, groupSelection, createClickDialog, groupTitle]);

  function unselectGroups() {
    const defaultGroups = structuredClone(Groups);
    setGroupSelected(defaultGroups);
  }
  async function createGroup() {
    console.log("noGroup:", groupSelection);
    console.log("titleEmpty", titleEmpty);
    if (!groupSelection || titleEmpty) return;

    try {
      const res = await fetch("/api/group/CreateGroup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          groupType,
          groupTitle,
          groupDescription,
          groupColor,
          groupImage,
        }),
      });
      if (!res.ok) {
        console.error("Request failed with status:", res.status);
        return;
      }
      console.log("fyt la mtr7 ws555");
      setGroupDialogOpen(false);
      setCreateClicked(!createClicked);
      setCreateClickDialog(false);
      setGroupDescription("");
      setGroupTitle("");

      unselectGroups();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {groupDialogOpen && (
          <motion.dialog
            onClose={() => {
              setGroupDialogOpen(false);
            }}
            ref={dialogRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ height: 20, opacity: 0 }}
            transition={{ duration: 0.7 }}
            dragElastic={true}
            className={`w-150  border rounded-lg  backdrop:bg-white/10 backdrop:backdrop-blur-sm fixed inset-0 m-auto overflow-y-auto overflow-x-hidden scrollbar-none select-none ${theme === "dark" ? "bg-slate-300" : "bg-gray-200"}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col gap-5"
            >
              <div className="flex justify-between items-center p-5 sticky top-0 z-100 backdrop-blur-2xl">
                <h1 className="text-4xl max-[500px]:text-2xl">
                  Add a{" "}
                  <span className="relative after:content-['New'] after:absolute after:left-1 after:-bottom-px after:text-blue-400 after:-z-10 max-sm:after:left-1 max-sm:after:bottom-0">
                    New
                  </span>{" "}
                  Group
                </h1>
                <motion.button
                  whileHover={{ opacity: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className=" w-5 h-5 opacity-40 cursor-pointer outline-0"
                  onClick={() => {
                    unselectGroups();
                    setGroupDescription("");
                    setGroupTitle("");
                    setGroupDialogOpen(false);
                    setCreateClickDialog(false);
                    setTitleEmpty(false);
                    setGroupSelection(false);
                  }}
                >
                  <img src={CategoriesIcons.behavior.CloseIcon} alt="Close" />
                </motion.button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="p-5 flex flex-col gap-5 border border-black/20 ml-5 mr-5 rounded-3xl "
              >
                <h2>Choose a Group Type:</h2>
                <div className="grid grid-cols-3 gap-5">
                  <div className="flex flex-col items-center">
                    <motion.button
                      name="Education"
                      whileHover={{ opacity: 0.5, scale: 1.15 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-2 cursor-pointer w-fit"
                      onClick={(e) => {
                        setSelectedGroup(e);
                        setGroupColor(CategoriesBackgrounds.green);
                        setGroupImage(CategoriesIcons.Categories.EducationIcon);
                      }}
                    >
                      <img
                        src={CategoriesIcons.Categories.EducationIcon}
                        alt="Education"
                        className={`w-10 h-10 bg-green-500 p-1 rounded-lg ${groupSelected.educationBtn.selected ? "outline-4 outline-white" : ""}`}
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
                      onClick={(e) => {
                        setSelectedGroup(e);
                        setGroupColor(CategoriesBackgrounds.red);
                        setGroupImage(
                          CategoriesIcons.Categories.HealthFitnessIcon,
                        );
                      }}
                    >
                      <img
                        src={CategoriesIcons.Categories.HealthFitnessIcon}
                        alt="Heath"
                        className={`w-10 h-10 bg-red-500 p-1 rounded-lg ${groupSelected.healthBtn.selected ? "outline-4 outline-white" : ""}`}
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
                      onClick={(e) => {
                        setSelectedGroup(e);
                        setGroupColor(CategoriesBackgrounds.blue);
                        setGroupImage(CategoriesIcons.Categories.TravelIcon);
                      }}
                    >
                      <img
                        src={CategoriesIcons.Categories.TravelIcon}
                        alt="Heath"
                        className={`w-10 h-10 bg-blue-500 p-1 rounded-lg ${groupSelected.travelBtn.selected ? "outline-4 outline-white " : ""}`}
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
                      onClick={(e) => {
                        setSelectedGroup(e);
                        setGroupColor(CategoriesBackgrounds.orange);
                        setGroupImage(CategoriesIcons.Categories.CookingIcon);
                      }}
                    >
                      <img
                        src={CategoriesIcons.Categories.CookingIcon}
                        alt="Heath"
                        className={`w-10 h-10 bg-orange-500 p-1 rounded-lg ${groupSelected.cookingBtn.selected ? "outline-4 outline-white" : ""}`}
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
                      onClick={(e) => {
                        setSelectedGroup(e);
                        setGroupColor(CategoriesBackgrounds.gray);
                        setGroupImage(CategoriesIcons.Categories.WorkIcon);
                      }}
                    >
                      <img
                        src={CategoriesIcons.Categories.WorkIcon}
                        alt="Heath"
                        className={`w-10 h-10 bg-gray-500 p-1 rounded-lg ${groupSelected.workBtn.selected ? "outline-4 outline-white" : ""}`}
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
                      onClick={(e) => {
                        setSelectedGroup(e);
                        setGroupColor(CategoriesBackgrounds.yellow);
                        setGroupImage(CategoriesIcons.Categories.FinanceIcon);
                      }}
                    >
                      <img
                        src={CategoriesIcons.Categories.FinanceIcon}
                        alt="Heath"
                        className={`w-10 h-10 bg-yellow-500 p-1 rounded-lg ${groupSelected.financeBtn.selected ? "outline-4 outline-white" : ""}`}
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
                  Choose a Group Title:
                </h2>
                <div className="ml-5 relative">
                  <input
                    type="text"
                    className="border-b outline-0 peer w-1/2 select-text"
                    onChange={(e) => {
                      setGroupTitle(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") descriptionRef.current?.focus();
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
                  Choose a Group Description (Optional):
                </h2>
                <div className="ml-5 relative">
                  <input
                    ref={descriptionRef}
                    type="text"
                    className="border-b outline-0 peer w-1/2 select-text"
                    onChange={(e) => {
                      setGroupDescription(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setCreateClickDialog(true);
                        createGroup();
                      }
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
              <motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  className="flex justify-between items-center p-5 "
                >
                  <div className="text-red-700">
                    <div>
                      {!groupSelection
                        ? createClickDialog
                          ? "Please Select a Group From Above"
                          : ""
                        : ""}
                    </div>
                    <div>
                      {titleEmpty
                        ? createClickDialog
                          ? "Please Enter a Title"
                          : ""
                        : ""}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-3xl outline-1 bg-green-700 p-2 rounded-lg text-white font-bold cursor-pointer transition-all hover:bg-inherit hover:text-green-700 hover:outline-green-700"
                      onClick={() => {
                        setCreateClickDialog(true);
                        createGroup();
                      }}
                    >
                      Create
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.dialog>
        )}
      </AnimatePresence>
    </>
  );
}
