import previousArrowBlack from "../assets/images/Others/previous-main-arrow-black.png";
import previousArrowWhite from "../assets/images/Others/previous-main-arrow-white.png";


export const BackArrows = {
  previousArrowBlack,
  previousArrowWhite
}
export const getToday = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  