import { ButtonGroup, Button } from "./Button.js";
import { getDailyByDate, getToday, getDaysInMonth } from "../utils/lib.js";
import { buildWeek } from "../utils/dates.js";

import styled, { css } from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 2rem;
`;

const DateElement = styled(Button)`
  width: 3rem;
  ${({ hasDate, theme }) =>
    hasDate
      ? css`
          border: 1px solid ${theme.text};
        `
      : null}

  ${({ selected, theme }) =>
    selected
      ? css`
          background-color: ${theme.text};
          color: ${theme.background};
          &:hover {
            background-color: ${theme.text};
            color: ${theme.background};
          }
        `
      : null}
`;

const DatePicker = ({ data, date, setDate }) => {
  const handleSetDate = (x) => (e) => setDate(x.toISOString().split("T")[0]);

  return (
    <Container>
      <ButtonGroup>
        {buildWeek(new Date(date)).map((x) => {
          const isoDate = x.toISOString().split("T")[0];
          return (
            <DateElement
              selected={date === isoDate}
              hasDate={!!getDailyByDate(data.dailies, isoDate)}
              key={isoDate}
              onClick={handleSetDate(x)}
            >
              {x.getDate()}
            </DateElement>
          );
        })}
      </ButtonGroup>
    </Container>
  );
};

export default DatePicker;
