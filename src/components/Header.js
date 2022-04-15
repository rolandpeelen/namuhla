import React from "react";
import { Button, ButtonGroup } from "./Button.js";
import { ThemeContext } from "styled-components";
import Logo from "./Logo.js";
import styled from "styled-components";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { gql } from "@apollo/client";

const GET_USER = gql`
  query userProfile {
    users {
      id
      profileImage
    }
  }
`;

const Container = styled.div`
  width: 100vw;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  position: fixed;
  top: 0;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 0 0 1rem;
  padding: 0;
`;

const Date = styled.h4`
  margin: 0;
  padding: 0;
`;

const Actions = styled.div`
  margin: 0 0.35rem 0 0;
  padding: 0;
`;

const Header = ({ date, logoutHandler }) => {
  const theme = React.useContext(ThemeContext);

  return (
    <Container>
      <Title>
        <Logo width={60} height={20} fill={theme.text} />
      </Title>

      <Date>{date}</Date>
      <Actions>
        <ButtonGroup transparent>
          <Button
            iconLeft
            transparent
            className="btn-margin logoutBtn"
            onClick={logoutHandler}
          >
            <RiLogoutBoxRLine />
            Log Out
          </Button>
        </ButtonGroup>
      </Actions>
    </Container>
  );
};

export default Header;
