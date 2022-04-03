import { getDaysInMonth } from "./lib.js";

// Assumption is that this is less than 28 days...
const WIDTH = 7;

const buildWeek = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const center = Math.floor(WIDTH / 2);
  const daysInMonth = getDaysInMonth(date);

  const middle = date.getDate();
  const toRight = daysInMonth - middle;
  const toLeft = middle;

  if (toLeft < center + 1) {
    const previousMonth = getDaysInMonth(
      new Date(date.setMonth(date.getMonth() - 1))
    );
    return new Array(WIDTH).fill(0).map((x, i) => {
      const day = i - center + middle;

      return day > 0
        ? new Date(year, month, day, 12)
        : new Date(year, month - 1, previousMonth + day, 12);
    });
  } else if (toRight < center + 1) {
    return new Array(WIDTH).fill(0).map((x, i) => {
      const day = i - center;
      return middle + day <= daysInMonth
        ? new Date(year, month, middle + day, 12)
        : new Date(year, month + 1, (middle + day) % daysInMonth, 12);
    });
  } else {
    return new Array(WIDTH)
      .fill(0)
      .map((x, i) => new Date(year, month, middle + i - center, 12));
  }
};

export { buildWeek };
