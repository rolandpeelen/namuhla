import React from "react";
import DatePicker from "./DatePicker";
import ToolbarActions from "./ToolbarActions";
import styled from "styled-components";

const DatePickerContainer = styled.div`
  padding: 0.5rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundD1};
  transition: all 0.3s 0.1s ease-in-out;
`;
const ToolbarActionsContainer = styled.div`
  padding: 0.25rem 0.6rem 0.6rem;
  transform: translateY(-5px);
  opacity: 0;
  transition: all 0.3s 0.2s ease-out;
`;

const Container = styled.div`
  position: fixed;
  bottom: 2rem;
  padding: 0.5rem 0.6rem 0.6rem;
  transition: all 0.3s 0.2s ease-in-out;
  border-radius: ${({ theme }) => theme.borderRadius};
  &:hover {
    background-color: ${({ theme }) => theme.backgroundL1};
    ${DatePickerContainer} {
  background-color: ${({ theme }) => theme.background};
    }
    ${ToolbarActionsContainer} {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

const Toolbar = ({ setTheme, openExport, data, date, setDate }) => {
  return (
    <>
      <Container>
        <ToolbarActionsContainer>
          <ToolbarActions
            setDate={setDate}
            setTheme={setTheme}
            openExport={openExport}
          />
        </ToolbarActionsContainer>
        <DatePickerContainer>
          <DatePicker data={data} date={date} setDate={setDate} />
        </DatePickerContainer>
      </Container>
    </>
  );
};

export default Toolbar;