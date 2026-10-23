import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import {
  TodoPageIcons,
  TodoIcons,
  TodoImportancyStyles,
  TodoCheckMarks,
  filterTodosAndSave,
} from "../../utils/TodosUtils";
import { getToday } from "../../utils/GeneralUtils";
import { AnimatePresence, motion } from "framer-motion";
import type { Todo } from "../../objects/categories";

type OpenedGroupTodoProps = {
  theme: string;
  setTheme: (value: string) => void;
  userPanelActive: boolean;
  setUserPanelActive: (value: boolean) => void;
};

async function saveTodoBackEnd(
  todo: TodoProps,
  categoryTodo: Todo[],
  setCategoryTodo: (value: Todo[]) => void,
  setAddTodoPressed: (value: boolean) => void,
) {
  setAddTodoPressed(false);
  await fetch("/api/todo/AddTodo", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(todo),
  }).then((res) => {
    if (!res.ok) throw new Error("can't create todo");
    res.json().then((data) => {
      filterTodosAndSave(data, setCategoryTodo);
    });
  });
  console.log(categoryTodo);
}

type TodoProps = {
  categoryTodoId: string;
  todoTitle: string;
  todoImportancy: string;
  todoDueTime: string;
};
type AddTodoProps = {
  categoryTodoId: string;
  categoryTodo: Todo[];
  setCategoryTodo: (value: Todo[]) => void;
  setAddTodoPressed: (value: boolean) => void;
};

type TodoDisplayProps = {
  key: string;
  cat: Todo;
  theme: string;
  categoryTodoId: string | undefined;
  categoryTodo: Todo[];
  setCategoryTodo: (value: Todo[]) => void;
};

type InputEditTodoProps = {
  todoTitle: string | undefined;
  todo: Todo;
  setTodo: (value: Todo) => void;
};

type SelectEditTodoProps = {
  todoImportancy: string | undefined;
  todo: Todo;
  setTodo: (value: Todo) => void;
};

type DateEditTodoProps = {
  dueTime: string | undefined;
  todo: Todo;
  setTodo: (value: Todo) => void;
};
function InputEditTodo({ todoTitle, todo, setTodo }: InputEditTodoProps) {
  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!todoInputRef.current || !todoTitle) return;
    todoInputRef.current.value = todoTitle;
  }, [todoTitle]);
  return (
    <>
      <input
        ref={todoInputRef}
        type="text"
        className="outline-0 pl-2 p-1 rounded-lg 
         dark:bg-white/20  w-90 max-[660px]:w-80 max-[490px]:w-45 max-[590px]:w-60 max-[440px]:w-35"
        onChange={(e) => {
          const title = e?.currentTarget?.value;
          setTodo({ ...todo, title });
        }}
      />
    </>
  );
}

function SelectEditTodo({
  todoImportancy,
  todo,
  setTodo,
}: SelectEditTodoProps) {
  const todoSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!todoSelectRef.current || !todoImportancy) return;
    todoSelectRef.current.value = todoImportancy;
  }, [todoImportancy]);
  return (
    <>
      <div>
        {" "}
        <motion.select
          ref={todoSelectRef}
          whileHover={{ opacity: 0.7, transition: { duration: 0.4 } }}
          name=""
          id=""
          className=" p-1 border border-black/20 dark:border-white/20 rounded-lg cursor-pointer dark:bg-slate-900 bg-white "
          onChange={(e) => {
            if (!e?.currentTarget?.value) return;
            const importancy = e.currentTarget.value;

            setTodo({ ...todo, importancy });
          }}
        >
          <option value="urgent">Urgent</option>
          <option value="important">Important</option>
          <option value="on the side">On The Side</option>
          <option value="can wait">Can Wait</option>
        </motion.select>
      </div>
    </>
  );
}

function DateEditTodo({ dueTime, todo, setTodo }: DateEditTodoProps) {
  const inputDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputDateRef.current || !dueTime) return;

    inputDateRef.current.value = dueTime;
  }, [dueTime]);
  return (
    <>
      <motion.div
        whileHover={{ opacity: 0.7, transition: { duration: 0.4 } }}
        className="relative h-fit w-fit"
      >
        <div
          className="absolute bg-inherit w-full h-full rounded-lg bottom-0 cursor-pointer z-100 "
          onClick={() => {
            inputDateRef?.current?.showPicker();
          }}
        ></div>
        <input
          ref={inputDateRef}
          type="date"
          min={getToday()}
          className="relative outline-0  p-2 rounded-lg  "
          onChange={(e) => {
            if (e.currentTarget.value < getToday()) {
              e.currentTarget.value = "";
              return;
            }
            const dueTime = e?.currentTarget?.value;
            setTodo({ ...todo, dueTime });
          }}
        />
      </motion.div>
    </>
  );
}

function AddTodo({
  categoryTodoId,
  categoryTodo,
  setCategoryTodo,
  setAddTodoPressed,
}: AddTodoProps) {
  const inputDateRef = useRef<HTMLInputElement>(null);
  const [todo, setTodo] = useState<TodoProps>({
    categoryTodoId: categoryTodoId,
    todoTitle: "",
    todoImportancy: "urgent",
    todoDueTime: new Date().toISOString().split("T")[0],
  });
  const [noTitle, setNoTitle] = useState(false);

  return (
    <>
      <>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          layout
          className="flex justify-center mb-10"
        >
          <div className="relative w-fit border p-5 rounded-lg dark:border-white/20 border-black/20  flex flex-col gap-8 items-center max-sm:p-5 ">
            <div className="flex max-[500px]:flex-col max-[500px]:items-center max-[500px]:gap-3">
              <div className="flex gap-3 items-center mr-5  ">
                <label htmlFor="" className="flex max-[500px]:justify-start">
                  Importancy
                </label>
                <motion.select
                  whileHover={{ opacity: 0.7, transition: { duration: 0.4 } }}
                  name=""
                  id=""
                  className="p-2 border border-black/20 dark:border-white/20 rounded-lg cursor-pointer max-[500px]:w-25"
                  onChange={(e) => {
                    const importancy = e?.currentTarget?.value;

                    setTodo((prev) => ({
                      ...prev,
                      todoImportancy: importancy,
                    }));
                  }}
                >
                  <option value="urgent">Urgent</option>
                  <option value="important">Important</option>
                  <option value="on the side">On The Side</option>
                  <option value="can wait">Can Wait</option>
                </motion.select>
              </div>
              <div className="flex items-center gap-3 ">
                <label htmlFor="" className="flex max-[500px]:justify-start">
                  Due Time
                </label>

                <motion.div
                  whileHover={{ opacity: 0.7, transition: { duration: 0.4 } }}
                  className="relative h-fit w-fit"
                >
                  <div
                    className="absolute bg-inherit w-full h-full rounded-lg bottom-0 cursor-pointer z-100 "
                    onClick={() => {
                      inputDateRef?.current?.showPicker();
                    }}
                  ></div>
                  <input
                    ref={inputDateRef}
                    type="date"
                    min={getToday()}
                    className="relative outline-0 border p-2 rounded-lg dark:border-white/20 border-black/20  w-10 h-10 max-[500px]:w-40"
                    onChange={(e) => {
                      if (e.currentTarget.value < getToday()) {
                        e.currentTarget.value = "";
                        return;
                      }

                      const date = e?.currentTarget?.value;
                      console.log(date);
                      setTodo((prev) => ({
                        ...prev,
                        todoDueTime: date,
                      }));
                    }}
                  />
                </motion.div>
              </div>
            </div>
            <input
              autoFocus
              type="text"
              className="w-100 h-10 pl-2 p-1 bg-slate-200 dark:bg-white/20 rounded-lg  outline-0 text-2xl transition-all duration-500 max-[500px]:w-60"
              onChange={(e) => {
                const title = e?.currentTarget?.value;
                setTodo((prev) => ({ ...prev, todoTitle: title }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!todo.todoTitle.trim()) {
                    setNoTitle(true);
                    setTimeout(() => {
                      setNoTitle(false);
                    }, 2000);
                    return;
                  }
                  console.log("todo:", todo);
                  saveTodoBackEnd(
                    todo,
                    categoryTodo,
                    setCategoryTodo,
                    setAddTodoPressed,
                  );
                }
              }}
            />
            <h1 className="absolute text-2xl dark:bg-slate-900 bg-white left-1 -top-4 transition-all duration-500">
              New Todo
            </h1>
            <button
              className="absolute flex justify-center items-center -top-3 right-1 w-5 h-5 dark:bg-slate-900 z-100 cursor-pointer bg-white transition-all duration-500 "
              onClick={() => {
                setAddTodoPressed(false);
              }}
            >
              <div className="opacity-60 text-2xl ">x</div>
            </button>
            <div className="flex flex-col gap-2 w-60 justify-center items-center">
              <motion.button
                whileHover={{ opacity: 0.7 }}
                whileTap={{ opacity: 1 }}
                className="border p-2  pl-10 pr-10 rounded-lg dark:border-white/20 border-black/20 cursor-pointer"
                onClick={() => {
                  if (!todo.todoTitle.trim()) {
                    setNoTitle(true);
                    setTimeout(() => {
                      setNoTitle(false);
                    }, 2000);
                    return;
                  }
                  saveTodoBackEnd(
                    todo,
                    categoryTodo,
                    setCategoryTodo,
                    setAddTodoPressed,
                  );
                }}
              >
                Add
              </motion.button>

              <motion.div>
                <AnimatePresence>
                  {noTitle && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Please Enter a Todo Title
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </>
    </>
  );
}

function TodoDisplay({
  key,
  cat,
  theme,
  categoryTodoId,
  setCategoryTodo,
}: TodoDisplayProps) {
  const [editTodo, setEditTodo] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.screen.availWidth);
  const [todo, setTodo] = useState<Todo>({
    _id: cat._id,
    title: cat.title,
    importancy: cat.importancy,
    dueTime: cat.dueTime,
    finished: cat.finished,
  });

  const [editTitleEmpty, setEditTitleEmpty] = useState(false);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.screen.availWidth);
    });
  }, []);
  async function deleteTodo() {
    await fetch("/api/todo/DeleteTodo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ todoId: cat._id, categoryId: categoryTodoId }),
    }).then((res) => {
      res.json().then((data) => {
        filterTodosAndSave(data, setCategoryTodo);
      });
    });
  }

  async function changeFinishedState() {
    await fetch("/api/todo/ChangeFinished", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        todoId: cat._id,
        categoryId: categoryTodoId,
        todoFinished: !cat.finished,
      }),
    }).then((res) => {
      res.json().then((data) => {
        filterTodosAndSave(data, setCategoryTodo);
      });
    });
  }
  async function editTodoBackEnd() {
    setEditTodo(false);
    await fetch("/api/todo/EditTodo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        todo,
        categoryId: categoryTodoId,
      }),
    }).then((res) => {
      res.json().then((data) => {
        filterTodosAndSave(data, setCategoryTodo);
      });
    });
  }
  return (
    <AnimatePresence>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        layout
        className="flex justify-center "
      >
        <div
          className={` flex border w-200 h-fit  p-5 items-center dark:border-white/20 border-black/20 rounded-lg relative ${cat.finished ? "opacity-60" : ""} `}
        >
          <div className="absolute flex gap-5 -top-3  pl-1 pr-1  ">
            {!editTodo ? (
              <div
                className={`uppercase border p-1 rounded-lg dark:border-white/20 border-black/20 w-30 flex justify-center items-center   ${cat.importancy === "urgent" ? TodoImportancyStyles.urgent.background + " " + TodoImportancyStyles.urgent.textColor : cat.importancy === "important" ? TodoImportancyStyles.Important.background + " " + TodoImportancyStyles.Important.textColor : cat.importancy === "on the side" ? TodoImportancyStyles.OnTheSide.background + " " + TodoImportancyStyles.OnTheSide.textColor : cat.importancy === "can wait" ? TodoImportancyStyles.CanWait.background + " " + TodoImportancyStyles.CanWait.textColor : ""} max-[640px]:text-[13px] max-[640px]:w-24 `}
              >
                {cat.importancy}
              </div>
            ) : (
              <SelectEditTodo
                todoImportancy={cat.importancy}
                todo={todo}
                setTodo={setTodo}
              />
            )}
            <div className="flex items-center uppercase border p-1 rounded-lg dark:border-white/20 border-black/20 dark:bg-slate-900 bg-white max-[640px]:text-[13px] h-8 transition-all duration-500">
              {" "}
              {editTodo ? (
                <DateEditTodo
                  dueTime={cat.dueTime}
                  todo={todo}
                  setTodo={setTodo}
                />
              ) : (
                <p>Due To:{cat.dueTime}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full relative h-fit justify-center items-center">
            <div
              className={`flex h-fit w-full  justify-between items-center max-[460px]:mt-3 ${editTodo ? "mt-5" : ""}`}
            >
              {editTodo ? (
                <InputEditTodo
                  todoTitle={cat.title}
                  todo={todo}
                  setTodo={setTodo}
                />
              ) : (
                <div className="">
                  <h1
                    className={`text-2xl ml-4 h-full 
                      w-90 wrap-break-word max-[399px]:w-30 max-[452px]:w-45 max-[530px]:w-60  max-[600px]:w-80 ${editTodo ? "" : ""}`}
                  >
                    {cat?.title}
                  </h1>
                </div>
              )}
              <div className="   h-10 flex items-center ">
                {!editTodo ? (
                  <div className=" flex gap-5 items-center">
                    {!cat.finished ? (
                      <motion.button
                        style={{
                          filter: "drop-shadow(0 0 0px rgba(255,255,255,0)) ",
                        }}
                        whileHover={{
                          opacity: 0.7,
                          filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4)) ",
                        }}
                        transition={{ duration: 0.4 }}
                        className="cursor-pointer border p-2 rounded-lg dark:border-white/20 border-black/20 transition-all duration-500"
                        onClick={() => {
                          setEditTodo(true);
                        }}
                      >
                        <img
                          src={
                            theme === "dark"
                              ? TodoIcons.EditIconWhite
                              : TodoIcons.EditIconBlack
                          }
                          alt="Edit"
                          className="w-7 h-7 object-contain "
                        />
                      </motion.button>
                    ) : (
                      ""
                    )}
                    <motion.button
                      style={{
                        filter: "drop-shadow(0 0 0px rgba(255,0,0,0))  ",
                      }}
                      whileHover={{
                        opacity: 0.7,
                        filter: "drop-shadow(0 0 8px rgba(255,0,0,0.4))  ",
                      }}
                      transition={{ duration: 0.4 }}
                      className="cursor-pointer  border p-2 rounded-lg dark:border-white/20 border-black/20 transition-all duration-500"
                      onClick={() => {
                        deleteTodo();
                      }}
                    >
                      <img
                        src={TodoIcons.DeleteIcon}
                        alt="Delete"
                        className="w-7 h-7 object-contain"
                      />
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex gap-2 h-fit items-center   ">
                    <motion.button
                      whileHover={{ opacity: 0.6 }}
                      className="cursor-pointer border p-2 rounded-lg dark:border-white/20 border-black/20 max-[600px]:text-[12px]"
                      onClick={() => {
                        if (!todo.title?.trim()) {
                          setEditTitleEmpty(true);
                          setTimeout(() => {
                            setEditTitleEmpty(false);
                          }, 2000);
                          return;
                        }
                        editTodoBackEnd();
                      }}
                    >
                      Confirm Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ opacity: 0.6 }}
                      className="cursor-pointer border p-2 rounded-lg dark:border-white/20 border-black/20 max-[600px]:text-[12px] "
                      onClick={() => {
                        setEditTodo(false);
                      }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
            {screenWidth < 500 && <h1></h1>}

            <div className=" flex w-full justify-center  h-fit">
              {editTitleEmpty && <h1 className="mt-2">Title Can't be Empty</h1>}
              {!editTodo && (
                <motion.button
                  whileHover={{ opacity: 0.7 }}
                  className="cursor-pointer h-fit transition-all duration-500"
                  onClick={() => {
                    changeFinishedState();
                  }}
                >
                  {" "}
                  <img
                    src={
                      theme === "dark"
                        ? cat?.finished
                          ? TodoCheckMarks.checkedWhite
                          : TodoCheckMarks.unCheckedWhite
                        : cat?.finished
                          ? TodoCheckMarks.checkedBlack
                          : TodoCheckMarks.unCheckedBlack
                    }
                    alt=""
                    className={`w-7 h-7 object-contain ${cat.finished ? "opacity-60" : ""} transition-all duration-500`}
                  />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function OpenedGroupTodo({
  theme,
  setTheme,
  userPanelActive,
  setUserPanelActive,
}: OpenedGroupTodoProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [addTodoPressed, setAddTodoPressed] = useState(false);

  const location = useLocation();

  const [categoryTodo, setCategoryTodo] = useState<Todo[]>([]);
  const [searchingTodo, setSearchingTodo] = useState(false);
  const [searchTodoEmpty, setSearchTodoEmpty] = useState(false);
   const { categoryIdParam } = useParams();
  const [categoryTodoId, setCategoryTodoId] = useState<string | undefined>(categoryIdParam);

  console.log("param:", categoryIdParam);
  useEffect(() => {
    const getCategoryId = () => {
      setCategoryTodoId(categoryIdParam);
    };
    getCategoryId();
  }, [categoryIdParam]);

  const navigate = useNavigate();
  console.log(location?.state?.cat);

  useEffect(() => {
    const getTodos = async () => {
      await fetch("/api/todo/GetTodo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ categoryTodoId }),
      }).then((res) => {
        if (!res.ok) throw new Error("cant get todos");
        res.json().then((data) => {
          filterTodosAndSave(data, setCategoryTodo);
        });
      });
    };
    getTodos();
  }, [location?.state?.cat?._id, categoryTodoId, searchingTodo]);
  console.log("categoryTodo:", categoryTodo);

  function filterSearchTodo(searchedTodo: string) {
    if (searchingTodo) {
      const filteredTodos = categoryTodo.filter((cat) => {
        return (
          cat.title?.includes(searchedTodo) ||
          cat.dueTime?.includes(searchedTodo)
        );
      });
      if (!filteredTodos.length) {
        setSearchTodoEmpty(true);
        return;
      }
      setCategoryTodo(filteredTodos);
      setSearchTodoEmpty(false);
    }
  }
  return (
    <>
      <Header
        backArrow={false}
        userPicture=""
        setUserPicture={() => {}}
        addHeaderElements={true}
        theme={theme}
        setTheme={setTheme}
        userPanelActive={userPanelActive}
        setUserPanelActive={setUserPanelActive}
      />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
          className="flex h-screen"
        >
          <div className="p-5 w-full ">
            <div className="flex flex-col">
              <div className="flex gap-5  mb-7 ">
                <motion.button
                  whileHover={{ x: -10, transition: { duration: 0.3 } }}
                  className={`cursor-pointer ${location?.state?.cat?.title?.length > 20 ? "w-50" : ""}  `}
                  onClick={() => {
                    navigate("/Main");
                  }}
                >
                  <img
                    src={
                      theme === "dark"
                        ? TodoPageIcons.previousArrowWhite
                        : TodoPageIcons.previousArrowBlack
                    }
                    alt="Back To Main Page"
                    className="w-10 h-10 object-contain"
                  />
                </motion.button>
                <h1
                  className={` text-5xl mt-5 ${location?.state?.cat?.title?.length > 10 ? "text-[20px]" : ""}  `}
                >
                  {location?.state?.cat.title}
                </h1>
              </div>
              <h2
                className={`w-full text-2xl border-t border-b border-t-black/20 border-b-black/20 dark:border-t-white/20 dark:border-b-white/20 p-4  ${location?.state?.cat?.title?.length > 10 ? "text-[20px]" : ""} `}
              >
                {location?.state?.cat?.description}
              </h2>
            </div>

            <div className="flex justify-end p-5 ">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 2 }}
                transition={{ duration: 0.4 }}
                className="cursor-pointer border rounded-lg p-2 "
                onClick={() => {
                  setAddTodoPressed(true);
                }}
              >
                + Add a Todo
              </motion.button>
            </div>

            <div>
              <AnimatePresence>
                {addTodoPressed && (
                  <AddTodo
                    categoryTodoId={location?.state?.cat?._id}
                    categoryTodo={categoryTodo}
                    setCategoryTodo={setCategoryTodo}
                    setAddTodoPressed={setAddTodoPressed}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {categoryTodo.length ? (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className=" text-3xl  flex justify-center mb-10 "
                  >
                    <div className="relative h-fit p-2">
                      <label
                        htmlFor=""
                        className="text-[22px] max-[650px]:text-[20px] absolute max-[650px]:-top-1 -top-2 left-5 h-fit dark:bg-slate-900 bg-white dark:text-white/60 text-black/60 transition-all duration-500 "
                      >
                        Search Your Todos
                      </label>
                      <input
                        className="outline-0 rounded-lg border p-2 pl-2 dark:border-white/20 border-black/20 max-[500px]:w-65 "
                        onChange={(e) => {
                          const searchedTodo = e?.currentTarget.value.trim();
                          if (searchedTodo !== "") {
                            setSearchingTodo(true);
                          } else {
                            setSearchingTodo(false);
                          }
                          filterSearchTodo(searchedTodo);
                        }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  ""
                )}
                {!searchTodoEmpty ? (
                  categoryTodo.length ? (
                    <>
                      <motion.div
                        layout
                        className="grid grid-cols-1 gap-5 pb-10"
                      >
                        <AnimatePresence>
                          {categoryTodo.map((cat) => {
                            console.log("btata");
                            return (
                              <TodoDisplay
                                key={cat._id}
                                cat={cat}
                                theme={theme}
                                categoryTodoId={categoryTodoId}
                                categoryTodo={categoryTodo}
                                setCategoryTodo={setCategoryTodo}
                              />
                            );
                          })}
                        </AnimatePresence>
                      </motion.div>
                    </>
                  ) : !addTodoPressed ? (
                    <h1 className="flex justify-center text-2xl opacity-60">
                      No Active Todos Yet
                    </h1>
                  ) : (
                    ""
                  )
                ) : (
                  <h1 className="flex justify-center text-2xl opacity-60 max-sm:text-[20px]">
                    No Todos With Searched Value
                  </h1>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
