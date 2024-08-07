import React from "react";
import DatePicker from "./DatePicker";
import ToolbarActions from "./ToolbarActions";
import styled from "styled-components";

import { useMutation } from "@apollo/client";
import queries from "../utils/queries.js";

const DatePickerContainer = styled.div`
  border: ${({ theme }) => `5px solid ${theme.backgroundL1}`};
  padding: 0.5rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundD1};
  transition: all 0.2s 0.1s ease-in-out;
  box-shadow: ${({ theme }) => `0 0 20px ${ theme.backgroundD1 }`};
`;
const ToolbarActionsContainer = styled.div`
  padding: 0.25rem 0.6rem 0.6rem;
  transform: translateY(-5px);
  opacity: 0;
  transition: all 0.2s 0.1s ease-out;
`;

const Container = styled.div`
  position: fixed;
  bottom: 2rem;
  padding: 0.5rem 0.6rem 0.6rem;
  transition: all 0.2s 0.1s ease-in-out;
  border-radius: ${({ theme }) => theme.borderRadius};
  &:hover {
    background-color: ${({ theme }) => theme.backgroundL1};
    ${DatePickerContainer} {
      border: 5px solid transparent;
      background-color: ${({ theme }) => theme.background};
    }
    ${ToolbarActionsContainer} {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

const Toolbar = ({ settings, setTheme, openExport, data, date, setDate }) => {
  const [updateThemeMutation] = useMutation(queries.UPDATE_THEME);

  const handleSetTheme = (theme) => {
    setTheme(theme);
    updateThemeMutation({
      variables: {
        id: settings.id,
        theme,
        dateUpdated: new Date().toISOString(),
      },
      refetchQueries: [queries.GET_SETTINGS],
    });
  };

  return (
    <>
      <Container>
        <ToolbarActionsContainer>
          <ToolbarActions
            themeName={settings.theme}
            setDate={setDate}
            setTheme={handleSetTheme}
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
