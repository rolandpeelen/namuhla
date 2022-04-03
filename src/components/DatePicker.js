import { ButtonGroup, Button } from "react-bootstrap";
import { getDailyByDate, getToday, getDaysInMonth } from "../utils/lib.js";
import { buildWeek } from "../utils/dates.js";

const TOTAL = 7;

const DatePicker = ({ data, date, setDate }) => {
  const handleSetDate = (x) => (e) => setDate(x.toISOString().split("T")[0]);

  return (
    <ButtonGroup>
      {buildWeek(new Date(date)).map((x) => {
        const isoDate = x.toISOString().split("T")[0];
        return (
          <Button
            variant={isoDate === date ? "primary" : "secondary"}
            key={isoDate}
            onClick={handleSetDate(x)}
          >
            <div>{x.getDate()}</div>
            {<div>{getDailyByDate(data.dailies, isoDate) && "x"}</div>}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default DatePicker;
