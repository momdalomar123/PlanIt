import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeaderIcons, ThemeIcons } from "../../utils/CategoriesUtils";

type HeaderProps = {
  userPicture?: string;
  setUserPicture: (value: string) => void;
  userPanelActive: boolean;
  setUserPanelActive: (value: boolean) => void;
  addHeaderElements: boolean;
  backArrow: boolean;
  theme: string;
  setTheme: (value: string) => void;
};
export default function Header({
  backArrow,
  addHeaderElements,
  userPicture,
  setUserPicture,
  userPanelActive,
  setUserPanelActive,
  theme,
  setTheme,
}: HeaderProps) {
  const navigate = useNavigate();
  const headerContainer = useRef(null);
  const [userPanel, setUserPanel] = useState(false);
  const userPanelRef = useRef<HTMLDivElement>(null);
  const selectPhotoRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      await fetch("/api/auth/GetProfile", {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
      }).then((res) => {
        res.json().then((data) => {
          console.log("data:", data);
          setUserPicture(data?.user?.style?.profilePicture);
        });
      });
    };
    getUserProfile();
  }, []);
  useEffect(() => {
    const changeUserProfile = async () => {
      if (!profilePhoto) return;
      const formData = new FormData();
      formData.append("photo", profilePhoto);
      if (!formData) return;
      await fetch("/api/auth/ProfilePhotoUpdate", {
        method: "POST",
        body: formData,
      }).then((res) => {
        // if (!res.ok) return;
        res.json().then((data) => {
          console.log(data);
          setUserPicture(data?.updatePhoto?.style?.profilePicture);
        });
      });
    };

    changeUserProfile();
  }, [previewUrl, setUserPicture]);
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (userPanelRef.current?.contains(e.target as Node)) return;
      setUserPanelActive(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [setUserPanelActive]);

  useEffect(() => {
    const changePreviewUrl = () => {
      if (!profilePhoto) {
        setPreviewUrl(null);
        return;
      }
      const url = URL.createObjectURL(profilePhoto);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    };
    changePreviewUrl();
  }, [profilePhoto]);
  function handleChoosingPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("please select an image file");
      return;
    }
    setProfilePhoto(file);
    e.target.value = "";
  }
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <>
      <motion.div
        ref={headerContainer}
        className={` m-5 rounded-[100px] flex justify-between sticky top-5 z-150 ${theme === "dark" ? "bg-slate-700" : "bg-zinc-300"} transition-all duration-500`}
      >
        <div className="flex flex-col gap-1 m-5">
          <div className=" max-[480px]:text-2xl max-[690px]:text-3xl text-4xl uppercase    ">
            Plan it
          </div>
          <div
            className={`max-[690px]:text-[10px] max-[490px]:text-[8px] max-[400px]:text-[7px] text-[15px]   absolute right-1/2 translate-x-1/2 -bottom-2 ${theme === "dark" ? "bg-slate-700" : "bg-zinc-300"} z-150 p-2 rounded-b-2xl transition-all duration-500    `}
          >
            <span className="relative font-bold">Functionality</span> Meets{" "}
            <span className="relative font-bold ">Responsibility</span>
          </div>
        </div>
        <div className="flex items-center justify-end flex-1 p-4 ">
          <motion.button
            whileHover={{ y: -5 }}
            className={`cursor-pointer  p-2 rounded-[100px] border  dark:border dark:border-white `}
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
            }}
          >
            <img
              src={
                theme === "dark" ? ThemeIcons.lightIcon : ThemeIcons.darkIcon
              }
              alt=""
              className="w-6 h-6 object-contain max-sm:w-4 max-sm:h-4 "
            />
          </motion.button>
        </div>

        {backArrow && (
          <div className="p-4 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            >
              <img
                src={HeaderIcons.backArrowIcon}
                alt="Back"
                className="w-10 h-10 object-cover max-sm:w-8 max-sm:h-8 "
              />
            </motion.button>
          </div>
        )}
        {addHeaderElements && (
          <div className="flex items-center  p-4 relative  ">
            <div></div>
            <motion.button
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9, y: 5 }}
              className=" cursor-pointer rounded-4xl "
              onClick={() => {
                setUserPanel(true);
                setUserPanelActive(true); // parent
              }}
            >
              <img
                src={
                  userPicture
                    ? `${userPicture}`
                    : `${HeaderIcons.defaultUserIcon}`
                }
                alt="profile"
                className="w-10 h-10 object-cover rounded-[100px] max-sm:w-8 max-sm:h-8"
              />
            </motion.button>

            <AnimatePresence>
              {userPanel ? (
                userPanelActive ? (
                  <motion.div
                    ref={userPanelRef}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4, ease: "easeIn" }}
                    className="absolute left-0 top-18 -translate-x-40 w-40 bg-white/90 p-3  rounded-lg z-100 backdrop-blur-2xl flex flex-col gap-3 dark:bg-slate-700 "
                  >
                    <motion.div
                      whileHover={{ opacity: 0.65 }}
                      className="bg-zinc-200 p-5 border-2 border-dashed flex justify-center items-center dark:bg-slate-500 dark:border-slate-400"
                    >
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          selectPhotoRef.current?.click();
                        }}
                      >
                        <input
                          ref={selectPhotoRef}
                          type="file"
                          accept="image/*"
                          className="w-0 h-0 p-0 m-0 "
                          onChange={(e) => {
                            handleChoosingPhoto(e);
                          }}
                        />
                        <img
                          src={
                            userPicture
                              ? `${userPicture}`
                              : `${HeaderIcons.defaultUserIcon}`
                          }
                          alt=""
                          className="w-20 h-20 rounded-[100px] object-cover "
                        />
                      </button>
                    </motion.div>
                    <div className="flex flex-col justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95, y: 3 }}
                        className="cursor-pointer border rounded-lg text-[15px] relative  "
                      >
                        Change Profile
                        <span className="absolute -bottom-0.5 right-0.5  text-blue-500 -z-1 ">
                          Profile
                        </span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95, y: 3 }}
                        className="text-[12px] cursor-pointer border rounded-lg "
                        onClick={() => {
                          navigate("/Main/Logout");
                        }}
                      >
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </>
  );
}
