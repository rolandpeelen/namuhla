import { ButtonGroup, Button } from "./Button.js";
import { getDailyByDate, getToday, getDaysInMonth } from "../utils/lib.js";
import { buildWeek } from "../utils/dates.js";

import styled, { css } from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 2rem;
`;

const ButtonGroupStyled = styled(ButtonGroup)`
  background-color: transparent;
`;

const DateElement = styled(Button)`
  width: 2rem;
  height: 2rem;
  margin: 0.25rem;
  font-family: monospace;
  transition: all 0.3s ease-in-out;
  ${({ hasDate, theme }) =>
    hasDate
      ? css`
          border: 1px solid ${theme.text};
          &:hover {
            background-color: ${theme.text};
            color: ${theme.background};
          }
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
      <ButtonGroupStyled>
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
      </ButtonGroupStyled>
    </Container>
  );
};

export default DatePicker;
