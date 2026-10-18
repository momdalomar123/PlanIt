import DeleteIcon from "../assets/images/Todo/delete-icon.png";
import EditIconWhite from "../assets/images/Todo/edit-white.png";
import EditIconBlack from "../assets/images/Todo/edit-black.png";

import previousArrowBlack from "../assets/images/Others/previous-main-arrow-black.png";
import previousArrowWhite from "../assets/images/Others/previous-main-arrow-white.png";

import checkedBlack from "../assets/images/Todo/checked-black.png";
import checkedWhite from '../assets/images/Todo/checked-white.png'
import unCheckedBlack from '../assets/images/Todo/unchecked-black.png'
import unCheckedWhite from '../assets/images/Todo/unchecked-white.png'

import type { Category,Todo } from "../objects/categories";
const TodoIcons = {
  DeleteIcon,
  EditIconBlack,
  EditIconWhite,
};

const TodoPageIcons = {
  previousArrowBlack,
  previousArrowWhite,
};
const TodoImportancyStyles = {
  urgent: { background: "bg-[#F4DAD6]", textColor: "text-[#8F3A32]" },
  Important: { background: "bg-[#F8E1CF]", textColor: "text-[#9A5420]" },
  OnTheSide: { background: "bg-[#F6EACB]", textColor: "text-[#7A5A14]" },
  CanWait: { background: "bg-[#DDE8D6]", textColor: "text-[#4A6340]" },
};

const TodoCheckMarks = {
  checkedBlack,
  checkedWhite,
  unCheckedBlack,
  unCheckedWhite
}

function filterTodosAndSave(data: Category,setCategoryTodo:(value:Todo[])=>void) {
    const notDoneTodosUrgent = data?.groupTodo?.filter((todo: Todo) => {
      return !todo.finished && todo.importancy === "urgent";
    });
    const notDoneTodosImportant = data?.groupTodo?.filter((todo: Todo) => {
      return !todo.finished && todo.importancy === "important";
    });
    const notDoneTodosOnTheSide = data?.groupTodo?.filter((todo: Todo) => {
      return !todo.finished && todo.importancy === "on the side";
    });
    const notDoneTodosCanWait = data?.groupTodo?.filter((todo: Todo) => {
      return !todo.finished && todo.importancy === "can wait";
    });
    const notDoneTodos = [
      ...notDoneTodosUrgent,
      ...notDoneTodosImportant,
      ...notDoneTodosOnTheSide,
      ...notDoneTodosCanWait,
    ];
    const doneTodos = data?.groupTodo?.filter((todo: Todo) => {
      return todo.finished;
    });
    console.log("notDoneTodos:", notDoneTodos);
    console.log("doneTodos:", doneTodos);
    setCategoryTodo([...notDoneTodos, ...doneTodos]);
  }
export { TodoIcons, TodoPageIcons, TodoImportancyStyles,TodoCheckMarks,filterTodosAndSave };
