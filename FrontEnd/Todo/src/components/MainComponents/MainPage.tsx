import Header from "./Header";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import GroupsDialog from "./GroupsDialog";
import { MainPageIcons, MenuIcons } from "../../utils/CategoriesUtils.ts";
import type { CategoriesUser } from "../../objects/categories.ts";
import EditDialog from "./EditDialog.tsx";
import { useNavigate } from "react-router-dom";
type MainPageProps = {
  theme: string;
  setTheme: (value: string) => void;
  userPanelActive: boolean;
  setUserPanelActive: (value: boolean) => void;
};
export default function MainPage({
  theme,
  setTheme,
  userPanelActive,
  setUserPanelActive,
}: MainPageProps) {
  const navigate = useNavigate();
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [createClicked, setCreateClicked] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [categoriesUser, setCategoriesUser] = useState<CategoriesUser | null>(
    null,
  );
  const [userPicture, setUserPicture] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const [groupId, setGroupId] = useState("");

  //------------------------

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [optionsMenu, setOptionsMenu] = useState(false);
  const [editButtonId, setEditButtonId] = useState("");

  useEffect(() => {
    console.log(deleteDialogOpen);
    if (deleteDialogOpen) {
      deleteDialogRef.current?.showModal();
    }
  }, [deleteDialogOpen]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      console.log(scrollTop);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercentage((scrollTop / docHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseDown = () => {
      setEditButtonId("");
    };
    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  });

  useEffect(() => {
    const getUserCategories = async () => {
      await fetch("/api/group/GetGroups", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      }).then((res) => {
        res.json().then((data) => {
          setCategoriesUser(data.categories);
          console.log(data.categories);
        });
      });
    };

    getUserCategories();
  }, [createClicked]);

  async function deleteGroupData(groupId: string) {
    await fetch("/api/group/DeleteGroups", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupId }),
    }).then((res) => {
      if (!res.ok) throw new Error("Can't delete Group");
      res.json().then(() => {});
    });
  }

  function deleteGroup(e: React.MouseEvent<HTMLButtonElement>) {
    deleteGroupData(e.currentTarget.id);
    console.log(e.currentTarget.id);
    const id = e?.currentTarget?.id;
    setCategoriesUser((prev) => {
      if (!prev) return null;
      console.log("fyt");
      return {
        ...prev,
        categories: prev.categories.map((cat) => {
          return {
            ...cat,
            category: cat.category.filter((cat) => {
              return cat._id !== id;
            }),
          };
        }),
      };
    });
  }

  console.log(categoriesUser);

  return (
    <>
      <Header
        userPicture={userPicture}
        setUserPicture={setUserPicture}
        userPanelActive={userPanelActive}
        setUserPanelActive={setUserPanelActive}
        addHeaderElements={true}
        backArrow={false}
        theme={theme}
        setTheme={setTheme}
      />
      <AnimatePresence
        onExitComplete={() => {
          deleteDialogRef.current?.close();
        }}
      >
        {deleteDialogOpen && (
          <motion.dialog
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 130 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            onClose={() => {
              setDeleteDialogOpen(false);
            }}
            ref={deleteDialogRef}
            className={`inset-0 m-auto w-80  backdrop:backdrop-blur-sm backdrop:bg-white/20  p-5 rounded-lg outline-0 overflow-hidden select-none ${theme === "dark" ? "bg-black/30 text-white" : "bg-white/70 "}`}
          >
            <div className="flex flex-col gap-5 ">
              <p>Are You Sure You Want To Delete This Group?</p>
              <div className={`flex justify-end gap-5 `}>
                <motion.button
                  whileHover={{
                    background: "rgba(210,50,100)",
                    color: "rgba(255,255,255)",
                  }}
                  transition={{ duration: 0.3, ease: "easeIn" }}
                  className="outline-0 cursor-pointer border p-0.5 rounded-lg bg-inherit "
                  id={groupId}
                  onClick={(e) => {
                    deleteGroup(e);
                    setDeleteDialogOpen(!deleteDialogOpen);
                  }}
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{
                    background: "rgba(210,100,0)",
                    color: "rgba(255,255,255)",
                  }}
                  className="outline-0 cursor-pointer border p-0.5 rounded-lg"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>

      <div className="h-screen relative">
        <div className="relative">
          <div className="relative">
            <AnimatePresence>
              {scrollPercentage >= 40 && (
                <motion.button
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="text-white fixed h-10 w-10 p-1  flex justify-center items-center bottom-10 right-2 bg-linear-to-t from-sky-600 to-blue-400 rounded-4xl  text-3xl cursor-pointer z-100  "
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                  }}
                >
                  <img
                    src={MainPageIcons.upArrowIcon}
                    alt="Top"
                    className="w-6 h-6 object-contain"
                  />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-3 p-10 ">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className=" cursor-pointer"
                onClick={() => {
                  setGroupDialogOpen(true);
                }}
              >
                <img
                  src={
                    theme === "dark"
                      ? MainPageIcons.addCategoryWhiteIcon
                      : MainPageIcons.addCategoryBlackIcon
                  }
                  alt="Add Category"
                  className="w-15 h-15 opacity-50 dark: object-cover"
                />
              </motion.button>
              {categoriesUser?.categories.length ? (
                ""
              ) : (
                <p className="opacity-30 text-[15px]">
                  No Todo Group Was Found, Start By Creating One.
                </p>
              )}
            </div>

            <AnimatePresence>
              {categoriesUser?.categories.length ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  layout
                  className="border border-black/20 ml-10 mr-10 mt-10 pb-10 rounded-lg dark:border-white/20 relative"
                >
                  <h1 className="absolute dark:bg-slate-900 bg-white p-2 -top-7 left-2  text-2xl transition-all duration-500  max-[410px]:text-[18px] ">
                    Jump to Each Category
                  </h1>
                  <div className="flex p-5"></div>
                  <div className="mt-5 grid grid-cols-3 gap-1  ml-10 mr-10 max-[570px]:grid-cols-2   ">
                    {categoriesUser?.categories.map((cat) => {
                      return (
                        <div className="flex justify-center p-2  ">
                          <a className="w-full" href={`#${cat.categoryType}`}>
                            <motion.button
                              whileHover={{
                                x: -10,
                                y: -10,
                                transition: { duration: 0.3 },
                              }}
                              className={`cursor-pointer  rounded-lg w-full p-5 max-[450px]:text-[13px] border dark:border-white/20 border-black/20 `}
                            >
                              {cat?.categoryType}
                            </motion.button>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                ""
              )}
              {categoriesUser?.categories.length ? (
                <div className="mt-10 text-[20px] pl-5 pr-5 border flex justify-center  h-fit ml-5 mr-5 rounded-lg p-2  max-[500px]:text-[17px] max-[450px]:text-[13px] dark:border-white/20 border-black/20  ">
                  Click On Any Group to View Its Todo
                </div>
              ) : (
                ""
              )}

              {categoriesUser?.categories?.map((cat) => {
                return (
                  <>
                    {cat.category.length && (
                      <div>
                        <button
                          className="w-full flex justify-center"
                          id={cat?.categoryType}
                        >
                          <h1 className="mt-5  w-1/2  text-[20px] pl-5 pr-5 border-b-2 border-r border-black/40  flex justify-center h-fit  rounded-lg p-2 bg-black/20 max-[500px]:text-[17px] max-[450px]:text-[13px] dark:border-white/20 dark:bg-slate-800 transition-all duration-500">
                            {cat.categoryType}
                          </h1>
                        </button>
                      </div>
                    )}
                    <div
                      className="grid grid-cols-4 
                                max-[1100px]:grid-cols-3 max-[800px]:grid-cols-2
                                 max-[640px]:grid-cols-2 max-[500px]:grid-cols-1 p-5 gap-3"
                    >
                      {cat.category.map((cat) => {
                        return (
                          <AnimatePresence>
                            <motion.div
                              whileHover={
                                editButtonId
                                  ? {}
                                  : {
                                      scale: 1.05,
                                      transition: {
                                        duration: 0.2,
                                        ease: "easeInOut",
                                        delay: 0.1,
                                      },
                                    }
                              }
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: {
                                  duration: 0.6,
                                  ease: "easeInOut",
                                },
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0,
                                transition: { duration: 0.6 },
                              }}
                              layout
                              key={cat?._id}
                              className={`${cat?.style.background} 
                                  rounded-lg pt-5 pl-5 pr-5  text-white cursor-pointer  relative`}
                            >
                              <div className="flex justify-between">
                                <div
                                  className="flex gap-3 items-center"
                                  onClick={() => {
                                    navigate(
                                      `/Main/group/${encodeURIComponent(cat?._id)}`,
                                      {
                                        state: {
                                          cat,
                                          path: cat._id + "-" + cat.title,
                                        },
                                      },
                                    );
                                  }}
                                >
                                  <img
                                    src={cat?.style?.image}
                                    alt=""
                                    className="w-10 h-10  object-contain border rounded-lg p-1  bg-white/20"
                                  />
                                  <h1
                                    className="w-35 h-10 
                        flex items-center
                     overflow-x-auto scrollbar-none whitespace-nowrap
                          text-2xl max-[800px] text-[15px]  max-[800px]:text-[20px] max-[640px]:text-[25px] max-[470px]:text-3xl"
                                  >
                                    {cat?.title}
                                  </h1>
                                </div>
                                <motion.button
                                  id={cat?._id}
                                  className="cursor-pointer relative"
                                  onClick={(e) => {
                                    setEditButtonId(e.currentTarget.id);
                                    setOptionsMenu(!optionsMenu);
                                  }}
                                >
                                  <motion.img
                                    whileHover={{ opacity: 0.7 }}
                                    src={MenuIcons.menuWhiteIcon}
                                    alt="More Options"
                                    className="w-7 h-7 object-contain"
                                  />
                                  <AnimatePresence mode="wait">
                                    {cat?._id === editButtonId ? (
                                      <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.25 }}
                                        className=" flex flex-col justify-center items-center gap-3 absolute p-3 -right-20 bg-white/20  rounded-lg z-150  max-[800px]:right-5 backdrop:backdrop-blur-2xl backdrop-blur-2xl"
                                      >
                                        <div className="w-full">
                                          <motion.button
                                            whileHover={{ opacity: 0.6 }}
                                            transition={{ duration: 0.3 }}
                                            className="border p-1 w-full rounded-lg bg-white/20 cursor-pointer dark:text-white text-black "
                                            onClick={() => {
                                              setEditDialogOpen(true);
                                            }}
                                          >
                                            Edit
                                          </motion.button>
                                        </div>
                                        <div className="w-full ">
                                          <motion.button
                                            whileHover={{ opacity: 0.6 }}
                                            transition={{ duration: 0.3 }}
                                            className="border p-1 rounded-lg bg-white/20 cursor-pointer dark:text-white text-black"
                                            id={cat?._id}
                                            onClick={(e) => {
                                              console.log(e.currentTarget.id);
                                              setGroupId(e.currentTarget.id);
                                              setDeleteDialogOpen(true);

                                              // deleteGroup(e);
                                            }}
                                          >
                                            Delete
                                          </motion.button>
                                        </div>
                                      </motion.div>
                                    ) : (
                                      ""
                                    )}
                                  </AnimatePresence>
                                </motion.button>
                              </div>
                              <div
                                className="mt-5 h-40 overflow-auto scrollbar-thin"
                                onClick={() => {
                                  navigate(
                                    `/Main/group/${encodeURIComponent(cat?._id)}`,
                                    {
                                      state: {
                                        cat,
                                        path: cat._id + "-" + cat.title,
                                      },
                                    },
                                  );
                                }}
                              >
                                {cat?.description}
                              </div>

                              <div className=" h-10  flex items-center justify-end  mb-1">
                                <div className="rounded-[100px] bg-white/20 w-fit h-7 flex justify-center items-center pl-2 pr-2">
                                  {cat.groupTodo.length}
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        );
                      })}
                    </div>
                  </>
                );
              })}
            </AnimatePresence>
          </div>

          <GroupsDialog
            theme={theme}
            groupDialogOpen={groupDialogOpen}
            setGroupDialogOpen={setGroupDialogOpen}
            setCreateClicked={setCreateClicked}
            createClicked={createClicked}
          />
          <EditDialog
            editDialogOpen={editDialogOpen}
            setEditDialogOpen={setEditDialogOpen}
          />
        </div>
      </div>
    </>
  );
}
