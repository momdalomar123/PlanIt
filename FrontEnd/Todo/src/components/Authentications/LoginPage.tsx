import Header from "../MainComponents/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import checkMark from "../../assets/images/Others/checkmark.png";
import showPasswordIcon from "../../assets/images/Others/eye-open.png";
import hidePasswordIcon from "../../assets/images/Others/eye-close.png";

type LoginProps = {
  theme: string;
  setTheme: (value: string) => void;
};
export default function LoginPage({ theme, setTheme }: LoginProps) {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [userOrEmail, setUserOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const backArrow = false;
  const loginContainer = useRef(null);

  loginSession();
  async function loginSession() {
    await fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          navigate("Main");
        }
      });
  }
  async function login() {
    if (!userOrEmail || !password) {
      setEmptyFields(true);
      return;
    }
    setEmptyFields(false);
    setLoading(true);

    await fetch("/api/auth/Login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userOrEmail, password }),
    }).then((res) => {
      res.json().then((data) => {
        if (!data.loggedIn) {
          setInvalidCredentials(true);
        } else {
          setInvalidCredentials(false);
        }
      });
    });
    loginSession();
    setLoading(false);
  }
  return (
    <>
      <div className=" h-screen bg-[url('./assets/images/wallpapers/Login-Signup-Background.jpg')] bg-cover overflow-y-auto overflow-x-hidden">
        <Header
          theme={theme}
          setTheme={setTheme}
          setUserPicture={() => {}}
          userPanelActive={false}
          setUserPanelActive={() => {}}
          addHeaderElements={false}
          backArrow={backArrow}
        />
        <div className="">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="h-screen flex flex-col justify-center items-center bg-cover backdrop-blur-[3px] overflow-x-hidden "
          >
            <div
              ref={loginContainer}
              className="h-140 w-120  border-4 border-white rounded-lg relative max-sm:w-10/12 max-sm:h-145  "
            >
              <div className="text-4xl text-white h-28 w-55 absolute -top-4 -left-5 bg-blue-300 p-4 rounded-lg max-sm:text-2xl max-sm:w-40 max-sm:h-25  ">
                <div>
                  Get <strong>Back</strong>
                </div>
                <div className="ml-2">
                  on <strong>Track</strong>
                </div>
              </div>
              <div className="h-30"></div>
              <div className="text-white flex flex-col p-5 gap-10">
                <div className="flex flex-col gap-1 ">
                  <label className="text-[20px] font-bold max-sm:text-[17px] ">
                    Username or Email
                  </label>
                  <div className="flex gap-5">
                    <input
                      type="text"
                      className="w-full text-black p-2 bg-white outline-0 rounded-[5px]  "
                      onChange={(e) => {
                        setUserOrEmail(e.currentTarget.value);
                      }}
                    />
                    <div className="w-8 h-8"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 ">
                  <label className="text-[20px] font-bold max-sm:text-[17px]">
                    Password
                  </label>
                  <div className="flex gap-5">
                    <input
                      type={showPassword ? "" : "password"}
                      className="w-full  text-black p-2 bg-white outline-0 rounded-[5px]  "
                      onChange={(e) => {
                        setPassword(e.currentTarget.value);
                      }}
                    />

                    <button
                      type="button"
                      className="cursor-pointer flex justify-center items-center "
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          src={showPasswordIcon}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          src={hidePasswordIcon}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col  gap-2">
                  <div className="flex justify-start gap-3 ">
                    <label className="font-bold">Remember me?</label>
                    <button
                      className="w-6 h-6 bg-white rounded-lg cursor-pointer flex justify-center items-center"
                      onClick={() => {
                        setRememberMe(!rememberMe);
                      }}
                    >
                      <AnimatePresence>
                        {rememberMe ? (
                          <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={checkMark}
                            className="bg-cover w-5 h-5 "
                          />
                        ) : (
                          ""
                        )}
                      </AnimatePresence>
                    </button>
                  </div>

                  <div className="h-0 text-red-400 flex justify-center max-sm:text-[12px]  ">
                    {emptyFields
                      ? "Please Enter all the Credentials"
                      : invalidCredentials
                        ? "Username ,Email or Password Incorrect"
                        : ""}
                  </div>
                </div>

                <div className=" flex flex-col gap-2  ">
                  <div className="flex justify-center">
                    <motion.button
                      drag
                      dragConstraints={loginContainer}
                      dragElastic={0.9}
                      whileHover={{ scale: 1.1, backgroundColor: "" }}
                      whileTap={{ scale: 0.9 }}
                      className=" flex justify-center items-center w-40 h-15 bg-blue-400 rounded-2xl text-3xl font-bold cursor-pointer "
                      onClick={() => {
                        login();
                      }}
                    >
                      {loading ? (
                        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-800 animate-spin max-sm:w-8 max-sm:h-8"></div>
                      ) : (
                        "Login"
                      )}
                    </motion.button>
                  </div>
                  <div className="flex justify-between items-center max-sm:mt-5">
                    <div className="max-sm:text-[13px]">
                      {" "}
                      Don't have an Account ?
                    </div>

                    <div className="">
                      <button
                        className="text-blue-400 cursor-pointer transition-all hover:text-blue-300 max-sm:text-[13px] "
                        onClick={() => {
                          navigate("Signup", { state: { backArrow: true } });
                        }}
                      >
                        Signup Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-white opacity-60 mt-5 max-sm:text-[12px] ">
              Copyright-All Rights Reserved
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
