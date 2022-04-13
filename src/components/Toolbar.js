import React from "react";
import DatePicker from "./DatePicker";
import ToolbarActions from "./ToolbarActions";
import styled from "styled-components";

import { useMutation, gql } from "@apollo/client";
import queries from "../utils/queries.js";

const UPDATE_SETTINGS = gql`
  mutation updateSettings(
    $id: uuid!
    $theme: themes_enum!
    $dateUpdated: timestamptz!
  ) {
    update_settings_by_pk(
      pk_columns: { id: $id }
      _set: { dateUpdated: $dateUpdated, theme: $theme }
    ) {
      id
    }
  }
`;

const DatePickerContainer = styled.div`
  padding: 0.5rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundD1};
  transition: all 0.2s 0.1s ease-in-out;
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
  background-color: ${({ theme }) => theme.background};
    }
    ${ToolbarActionsContainer} {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;

const Toolbar = ({ settings, setTheme, openExport, data, date, setDate }) => {
  const [updateThemeMutation] = useMutation(UPDATE_SETTINGS);

  const handleSetTheme = (theme) => {
    setTheme(theme);
    updateThemeMutation({
      variables: {
        id: settings.id,
        theme,
        dateUpdated: new Date().toISOString(),
      },
      refetchQueries: [queries.GET_SETTINGS],
    })
  }

  React.useEffect(() => {
    setTheme(settings.theme);
  }, [settings])

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
