const getDaysInMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const getTodayIso = () => new Date().toISOString()
const getToday = () => new Date().toISOString().split("T")[0];
const addDays = (date, days) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days);
  return new Date(newDate);
};

const hasSettings = (data) => !!data && data.settings && data.settings.length > 0;
const hasDailies = (data) => !!data && data.dailies && data.dailies.length > 0;
const getDailyByDate = (data, date) => data.find((x) => x.date === date);
const head = (xs) => xs[0];

export { getTodayIso, getDaysInMonth, getToday, hasSettings, hasDailies, getDailyByDate, head, addDays };
