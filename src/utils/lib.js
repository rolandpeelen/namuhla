const getDaysInMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const getToday = () => new Date().toISOString().split("T")[0];

const hasDailies = (data) => !!data && data.dailies && data.dailies.length > 0;
const getDailyByDate = (data, date) => data.find((x) => x.date === date);
const head = (xs) => xs[0];

export { getDaysInMonth, getToday, hasDailies, getDailyByDate, head };