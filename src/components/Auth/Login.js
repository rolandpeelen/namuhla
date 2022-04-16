import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Button, ButtonGroup } from "../Button.js";
import Loader from "../Loader";
import styled from "styled-components";
import { RiLoginBoxLine, RiLoginCircleLine } from "react-icons/ri";

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
`;

const LoginModal = styled.div`
padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundD1};
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
text-align: center;
`;

const Login = () => {
  const { loading, loginWithRedirect } = useAuth0();
  if (loading) {
    return <Loader message="Loading..." />;
  }
  return (
    <Container>
      <LoginModal>
        <h2>Welcome!</h2>
        <p>Good to have you back... <br /> Please login / signup using the link below.</p>
        <ButtonGroup>
          <Button
          iconLeft
            onClick={() => {
              loginWithRedirect({});
            }}
          >
            <RiLoginCircleLine />
            Sign Up
          </Button>
          <Button
            primary
          iconLeft
            onClick={() => {
              loginWithRedirect({});
            }}
          >
            <RiLoginBoxLine />
            Log In
          </Button>
        </ButtonGroup>
      </LoginModal>
    </Container>
  );
};

export default Login;
