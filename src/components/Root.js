import React from "react";

import App from "./App";
import Login from "./Auth/Login";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import { getTheme } from "../utils/theme.js";
import { useDarkMode } from "../utils/useDarkMode.js";
import { useAuth0 } from "@auth0/auth0-react";
import { authStates } from "../utils/types.js";
import { useAccessToken } from "../hooks/useAccessToken";

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: "wss://nearby-mammal-93.hasura.app/v1/graphql",
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      },
    }),
    cache: new InMemoryCache(),
  });
};

const GlobalStyles = createGlobalStyle`
  #root {
    display: flex;
    justify-items: flex-start;
    justify-content: flex-start;
    align-item: flex-start;
    flex-direction: column;
    width: 100vw;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  }

  body {
    background: ${({ theme }) => theme.background};
    background-image: ${({ theme }) => `radial-gradient(farthest-corner at 50vw 100vh, ${theme.backgroundD1} 0%, ${theme.background} 50%)`} ;
    color: ${({ theme }) => theme.text};
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Noto Sans', sans-serif;
    font-size: 18px;
    line-height: 2.0;
    display: flex;
    justify-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100vw;
    margin: 0;
    padding: 0;
    transition: all 0.3s ease-out;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }
  `;

const Root = () => {
  /* Data may contain error, or token, or be null when loading */
  const { getAccessToken, state, data } = useAccessToken();
  const [theme, setTheme, darkModeReady] = useDarkMode();
  const [client, setClient] = React.useState(null);

  const { logout } = useAuth0();

  const handleLogout = () => {
    logout();
    getAccessToken();
  };

  React.useEffect(() => {
    state === authStates.AUTHORIZED && setClient(createApolloClient(data));
  }, [state, data]);

  if (!darkModeReady) return <div />;

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <GlobalStyles />
      {state === authStates.LOADING && "Authorizing"}
      {state === authStates.UNAUTHORIZED && <Login />}
      {state === authStates.AUTHORIZED && client && (
        <ApolloProvider client={client}>
          <App logoutHandler={handleLogout} setTheme={setTheme} />
        </ApolloProvider>
      )}
    </ThemeProvider>
  );
};

export default Root;
