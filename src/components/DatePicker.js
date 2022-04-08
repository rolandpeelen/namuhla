import { ButtonGroup, Button } from "./Button.js";
import { getDailyByDate, addDays } from "../utils/lib.js";
import { buildWeek } from "../utils/dates.js";

import styled, { css } from "styled-components";
import { kinds } from "../utils/theme.js";

import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";

const ButtonGroupStyled = styled(ButtonGroup)`
  background-color: transparent;
`;

const DateElement = styled(Button)`
  width: 2rem;
  height: 2rem;
  margin: 0.25rem;
  padding: 0;
  font-family: monospace;
  transition: all 0.3s ease-out;
  background: transparent;
  ${({ hasDate, theme }) =>
    hasDate
      ? css`
          border: 2px solid
            ${theme.kind === kinds.DARK
          ? theme.backgroundL3
          : theme.backgroundD2};
        `
      : null}

  &:hover {
    box-shadow: 0px 0px 2px 0px
      ${({ theme }) =>
    theme.kind === kinds.DARK ? theme.backgroundL3 : theme.backgroundD1};
    background-color: ${({ theme }) =>
    theme.kind === kinds.DARK ? theme.backgroundL3 : theme.backgroundD1};
  }

  ${({ selected, theme }) =>
    selected
      ? css`
            border-color: ${({ theme }) =>
          theme.kind === kinds.DARK
            ? theme.backgroundL2
            : theme.backgroundD2};
          background-color: ${({ theme }) =>
          theme.kind === kinds.DARK
            ? theme.backgroundL2
            : theme.backgroundD2};
          color: ${theme.text};
          &:hover {
            cursor: default;
            background-color: ${({ theme }) =>
          theme.kind === kinds.DARK
            ? theme.backgroundL2
            : theme.backgroundD2};
            color: ${theme.text};
          }
        `
      : null}
`;

const DatePicker = ({ data, date, setDate }) => {
  const handleSetDate = (x) => (_e) => setDate(x.toISOString().split("T")[0]);

  return (
    <ButtonGroupStyled>
      <DateElement icon key={"prev"} onClick={handleSetDate(addDays(date, -1))}>
        <RiArrowDropLeftLine size={22} />
      </DateElement>
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
      <DateElement icon key={"next"} onClick={handleSetDate(addDays(date, 1))}>
        <RiArrowDropRightLine size={22} />
      </DateElement>
    </ButtonGroupStyled>
  );
};

export default DatePicker;
