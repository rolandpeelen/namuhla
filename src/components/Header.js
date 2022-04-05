import React from "react";
import { Button, ButtonGroup } from "./Button.js";
import { ThemeContext } from "styled-components";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  height: 50px;
`;

const Title = styled.h2`
  margin: 0 0 0 1rem;
  padding: 0;
`;

const Date = styled.h4`
  font-family: monospace;
  margin: 0;
  padding: 0;
`;

const Actions = styled.div`
  margin: 0 0.35rem 0 0;
  padding: 0;
`;

const Header = ({ date, logoutHandler, toggleTheme, toggleExport }) => {
  const theme = React.useContext(ThemeContext);
  return (
    <Container>
      <Title>Namuhla</Title>

      <Date>{date}</Date>

      <Actions>
        <ButtonGroup transparent>
          <Button transparent type="button" onClick={toggleTheme}>
          {theme.name === "dark" ? "Light" : "Dark"}
          </Button>
          <Button transparent type="button" onClick={toggleExport}>
            Export
          </Button>
          <Button
            transparent
            className="btn-margin logoutBtn"
            onClick={logoutHandler}
          >
            Log Out
          </Button>
        </ButtonGroup>
      </Actions>
    </Container>
  );
};

export default Header;
