import Header from "../MainComponents/Header";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import showPasswordIcon from "../../assets/images/Others/eye-open.png";
import hidePasswordIcon from "../../assets/images/Others/eye-close.png";
type SignupProps = {
  theme: string;
  setTheme: (value: string) => void;
};
export default function SignupPage({ theme, setTheme }: SignupProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const loginContainer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [loggedBefore, setLoggedBefore] = useState(false);
  const [shortPassword, setShortPassword] = useState(false);

  async function signup() {
    if (!username || !email || !password) {
      setEmptyFields(true);
      return;
    } else if (password.length < 8) {
      setShortPassword(true);
      setEmptyFields(false);
      return;
    }
    setEmptyFields(false);
    setLoading(true);

    await fetch("/api/auth/Signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password, profilePicture: "" }),
    }).then((res) => {
      if (!res.ok) throw new Error("Sign Up failed");
      res.json().then((data) => {
        if (data.userLoggedBefore) {
          setLoggedBefore(true);
        }
      });
    });
    setLoading(false);
    navigate("/Login");
  }
  return (
    <>
      <div className="h-screen bg-[url('./assets/images/wallpapers/Login-Signup-Background.jpg')] bg-cover overflow-y-auto overflow-x-hidden">
        <Header
          theme={theme}
          setTheme={setTheme}
          setUserPicture={() => {}}
          userPanelActive={false}
          setUserPanelActive={() => {}}
          addHeaderElements={false}
          backArrow={location.state?.backArrow}
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
              className="h-140 w-120  border-4 border-white rounded-lg relative  max-sm:w-10/12 max-sm:h-145 "
            >
              <div className="text-4xl text-white h-28 w-70 absolute -top-4 -left-5 bg-blue-300 p-4 rounded-lg max-sm:text-2xl max-sm:w-50 max-sm:h-25 ">
                <div>Start a</div>
                <div className="ml-2">
                  new <strong>Journey</strong>
                </div>
              </div>
              <div className="h-30"></div>

              <div className="text-white flex flex-col p-5 gap-10">
                <div className="flex flex-col gap-1 ">
                  <label className="text-[20px] font-bold max-sm:text-[17px]">
                    Username
                  </label>
                  <div className="flex gap-5 ">
                    <input
                      type="text"
                      className="w-full text-black p-2 bg-white outline-0 rounded-[5px]   "
                      onChange={(e) => {
                        setUsername(e.currentTarget.value);
                      }}
                    />
                    <div className=" w-8 h-8 "></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 ">
                  <label className="text-[20px] font-bold max-sm:text-[17px]">
                    Email
                  </label>
                  <div className="flex gap-5">
                    <input
                      type="text"
                      className="w-full text-black p-2 bg-white outline-0 rounded-[5px]   "
                      onChange={(e) => {
                        setEmail(e.currentTarget.value);
                      }}
                    />
                    <div className="w-8 h-8 "></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 ">
                  <label className="text-[20px] font-bold max-sm:text-[17px]">
                    Password
                  </label>
                  <div className="flex gap-5">
                    <input
                      type={showPassword ? "" : "password"}
                      className="w-full text-black p-2 bg-white outline-0 rounded-[5px] "
                      onChange={(e) => {
                        setPassword(e.currentTarget.value);
                      }}
                    />

                    <button
                      type="button"
                      className="cursor-pointer flex justify-center items-center w-fit h-fit "
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          src={showPasswordIcon}
                          className="w-8 h-8 object-contain "
                        />
                      ) : (
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          src={hidePasswordIcon}
                          className="w-8 h-8 object-contain "
                        />
                      )}
                    </button>
                  </div>

                  <div className="h-0 text-red-400 flex justify-center max-sm:text-[12px]">
                    {emptyFields
                      ? "Please Enter all the Credentials"
                      : loggedBefore
                        ? "Information Already Exist"
                        : shortPassword
                          ? "Password Must be 8 Characters or Longer"
                          : ""}
                  </div>
                </div>

                <div className="flex justify-center">
                  <motion.button
                    drag
                    dragConstraints={loginContainer}
                    dragElastic={0.9}
                    whileHover={{ scale: 1.1, backgroundColor: "" }}
                    whileTap={{ scale: 0.9 }}
                    className=" flex justify-center items-center w-40 h-15 bg-blue-400 rounded-2xl text-3xl font-bold cursor-pointer"
                    onClick={() => {
                      signup();
                    }}
                  >
                    {loading ? (
                      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-800 animate-spin"></div>
                    ) : (
                      "Sign Up"
                    )}
                  </motion.button>
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
