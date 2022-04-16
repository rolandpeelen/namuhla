import React from "react";
import Logo from "./Logo.js";
import styled, { css } from "styled-components";
import { getTheme } from "../utils/theme.js";
import { getToday } from "../utils/lib.js";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAccessToken } from "../hooks/useAccessToken";

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
  & svg {
    cursor: pointer;
    transition: all 0.2s ease-out;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const HeaderDate = styled.h4`
  margin: 0;
  padding: 0;
`;

const Action = styled.li`
  padding: 0.25rem 1rem;
  width: 100%;
  display: inline-flex;
  list-style-type: none;
  align-content: center;
  align-items: center;
  justify-content: start;
  justify-items: start;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.backgroundL1};
  }
  & svg {
    margin-right: 1rem;
  }
`;
const ActionsTitle = styled.li`
  padding: 0.25rem 1rem;
  list-style-type: none;
  & h4 {
    margin: 0;
    padding: 0;
  }
`;
const Spacer = styled.li`
  width: 100%;
  height: 1px;
  list-style-type: none;
  opacity: 0.1;
  background-color: ${({ theme }) => theme.text};
`;
const ActionsList = styled.ul`
  margin: 0;
  padding: 0;
  top: 3rem;
  right: 0rem;
  width: 15rem;
  position: absolute;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundD1};
  transition: all 0.2s ease-out;
`;
const ActionsMenu = styled.div`
  position: relative;
  margin: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 1.5rem;
  background-position: center center;
  background-size: cover;
  background-image: url(${({ backgroundImage }) => backgroundImage});
`;
const Actions = styled.div`
  margin: 0 0.35rem 0 0;
  padding: 0;
  & ${ActionsList} {
    opacity: 0;
    z-index: -1;
    transform: translateY(-0.5rem);
    pointer-events: none;
  }
  ${({ hovering }) =>
    hovering
      ? css`
          & ${ActionsList} {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
          }
        `
      : null}
`;

const Header = ({ setDate, date, settings, logoutHandler }) => {
  const { user } = useAccessToken();
  const [hovering, setHovering] = React.useState(false);

  const handleSetDate = (x) => (_e) => setDate(x.toISOString().split("T")[0]);

  return (
    <Container>
      <Title>
        <Logo
          onClick={(_e) => setDate(getToday())}
          width={60}
          height={20}
          fill={getTheme(settings.theme).text}
        />
      </Title>

      <HeaderDate>{date}</HeaderDate>
      <Actions
        hovering={hovering}
        onMouseOver={(_event) => setHovering(true)}
        onMouseOut={(_event) => setHovering(false)}
      >
        <ActionsMenu backgroundImage={user.picture} alt="">
          <ActionsList>
            <ActionsTitle>
              <h4>{user.name}</h4>
            </ActionsTitle>
            <Spacer />
            <Action onClick={logoutHandler}>
              <RiLogoutBoxRLine /> Log out
            </Action>
          </ActionsList>
        </ActionsMenu>
      </Actions>
    </Container>
  );
};

export default Header;
